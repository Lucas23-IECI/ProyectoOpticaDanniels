import { AppDataSource } from "../config/configDb.js";
import Orden from "../entity/orden.entity.js";
import OrdenProducto from "../entity/ordenProducto.entity.js";
import Producto from "../entity/producto.entity.js";
import StockMovimiento from "../entity/stockMovimiento.entity.js";
import { Between, In } from "typeorm";
import { calcularCostoEnvio } from "../helpers/shipping.helper.js";
import logger from "../config/logger.js";

/**
 * Transiciones de estado válidas para una orden.
 */
const TRANSICIONES_VALIDAS = {
    pendiente: ["pagada", "cancelada"],
    pagada: ["en_preparacion", "cancelada"],
    en_preparacion: ["enviada", "cancelada"],
    enviada: ["entregada"],
    entregada: [],
    cancelada: [],
};

/**
 * Crea una orden con transacción atómica:
 * - Valida stock disponible
 * - Reserva stock (lo descuenta)
 * - Aplica descuentos vigentes
 * - Calcula subtotal, IVA, envío y total
 * - Registra movimientos de stock
 */
export const crearOrdenService = async (datos, usuarioId = null) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const { productos, cliente, metodoEntrega, metodoPago,
            region, comuna, direccionId, costoEnvio: costoEnvioCliente } = datos;
        const { nombre, correo, direccion, telefono, observaciones } = cliente;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            throw { status: 400, message: "La orden debe contener al menos un producto." };
        }

        const idsProductos = productos.map((p) => p.id);
        // Lock rows for update to prevent race conditions
        const productosDB = await queryRunner.manager
            .getRepository(Producto)
            .createQueryBuilder("p")
            .where("p.id IN (:...ids)", { ids: idsProductos })
            .setLock("pessimistic_write")
            .getMany();

        if (productosDB.length !== productos.length) {
            throw { status: 400, message: "Uno o más productos no existen." };
        }

        let subtotalBruto = 0;
        const ordenProductos = [];
        const stockMovimientos = [];

        for (const item of productos) {
            const producto = productosDB.find((p) => p.id === item.id);
            const cantidad = Number(item.cantidad);

            if (cantidad <= 0 || isNaN(cantidad)) {
                throw {
                    status: 400,
                    message: `Cantidad inválida para "${producto.nombre}".`,
                };
            }

            // Verificar stock
            if (cantidad > producto.stock) {
                throw {
                    status: 400,
                    message: `Stock insuficiente para "${producto.nombre}". `
                        + `Disponible: ${producto.stock}, solicitado: ${cantidad}.`,
                };
            }

            // Aplicar descuento del producto (si tiene oferta activa)
            const descuentoPct = producto.oferta ? (producto.descuento || 0) : 0;
            const precioConDescuento = Math.round(
                producto.precio * (1 - descuentoPct / 100),
            );
            const subtotalItem = cantidad * precioConDescuento;
            subtotalBruto += subtotalItem;

            ordenProductos.push(
                queryRunner.manager.getRepository(OrdenProducto).create({
                    producto,
                    cantidad,
                    precio: precioConDescuento,
                    descuento: descuentoPct,
                    subtotal: subtotalItem,
                }),
            );

            // Registrar movimiento de stock (reserva)
            const stockAnterior = producto.stock;
            const stockNuevo = stockAnterior - cantidad;

            stockMovimientos.push(
                queryRunner.manager.getRepository(StockMovimiento).create({
                    producto,
                    tipo: "reserva",
                    cantidad: -cantidad,
                    stockAnterior,
                    stockNuevo,
                    motivo: `Reserva por orden`,
                }),
            );

            // Descontar stock
            producto.stock = stockNuevo;
        }

        // Calcular envío
        let costoEnvioFinal = 0;
        if (metodoEntrega === "envio" && region && comuna) {
            const envioCalc = calcularCostoEnvio(region, comuna);
            costoEnvioFinal = envioCalc.costoEnvio;
        } else if (metodoEntrega === "retiro") {
            costoEnvioFinal = 0;
        }

        // IVA (precios ya incluyen IVA, desglosamos para la boleta)
        const netoSinIva = Math.round(subtotalBruto / 1.19);
        const ivaDesglosado = subtotalBruto - netoSinIva;
        const totalFinal = subtotalBruto + costoEnvioFinal;

        const nuevaOrden = queryRunner.manager.getRepository(Orden).create({
            nombre,
            correo,
            direccion,
            telefono,
            observaciones,
            subtotal: subtotalBruto,
            iva: ivaDesglosado,
            costoEnvio: costoEnvioFinal,
            total: totalFinal,
            estado: "pendiente",
            estadoPago: "pendiente",
            metodoEntrega: metodoEntrega || "envio",
            metodoPago: metodoPago || "webpay",
            direccionId: direccionId || null,
            productos: ordenProductos,
            usuario: usuarioId ? { id: usuarioId } : null,
            anonId: datos.anonId || null,
        });

        const ordenGuardada = await queryRunner.manager.save(nuevaOrden);

        // Actualizar stock de productos
        for (const prod of productosDB) {
            await queryRunner.manager.save(prod);
        }

        // Guardar movimientos de stock con referencia a la orden
        for (const mov of stockMovimientos) {
            mov.orden = { id: ordenGuardada.id };
            mov.motivo = `Reserva por orden #${ordenGuardada.id}`;
            await queryRunner.manager.save(mov);
        }

        await queryRunner.commitTransaction();

        return ordenGuardada;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        logger.error("Error en crearOrdenService:", error);
        throw {
            status: error.status || 500,
            message: error.message || "Error al crear la orden.",
        };
    } finally {
        await queryRunner.release();
    }
};

export const obtenerOrdenesService = async (filtros) => {
    const ordenRepository = AppDataSource.getRepository(Orden);

    const { correo, estado, orden, desde, hasta } = filtros;

    const where = {};

    if (correo) where.correo = correo;
    if (estado) where.estado = estado;
    if (desde && hasta) {
        const desdeFecha = new Date(desde);
        const hastaFecha = new Date(hasta);

        if (!isNaN(desdeFecha.getTime()) && !isNaN(hastaFecha.getTime())) {
            where.createdAt = Between(desdeFecha, hastaFecha);
        } else {
            throw {
                status: 400,
                message: "Los parámetros 'desde' y/o 'hasta' tienen un formato de fecha inválido.",
            };
        }
    }

    let order = { createdAt: "DESC" };

    if (orden) {
        const partes = orden.split("_");
        if (partes.length !== 2) {
            throw {
                status: 400,
                message: "Parámetro 'orden' inválido. Usa formato como 'createdAt_DESC'.",
            };
        }

        const [campo, direccion] = partes;
        const camposPermitidos = ["createdAt", "updatedAt", "fecha"];
        const direccionesPermitidas = ["ASC", "DESC"];

        if (
            camposPermitidos.includes(campo)
            && direccionesPermitidas.includes(direccion)
        ) {
            order = { [campo]: direccion };
        } else {
            throw {
                status: 400,
                message: "Parámetro 'orden' inválido. Usa formato como 'createdAt_DESC'.",
            };
        }
    }

    const ordenes = await ordenRepository.find({
        where,
        relations: {
            productos: {
                producto: true,
            },
        },
        order,
    });

    return ordenes;
};

export const obtenerOrdenPorIdService = async (id) => {
    const ordenRepository = AppDataSource.getRepository(Orden);

    const orden = await ordenRepository.findOne({
        where: { id: parseInt(id) },
        relations: {
            productos: {
                producto: true,
            },
        },
    });

    return orden;
};

export const actualizarEstadoOrdenService = async (id, nuevoEstado) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const orden = await queryRunner.manager.findOne(Orden, {
            where: { id: parseInt(id) },
            relations: { productos: { producto: true } },
        });

        if (!orden) {
            throw { status: 404, message: "Orden no encontrada." };
        }

        // Validar transición de estado
        const estadoActual = orden.estado;
        const transicionesPermitidas = TRANSICIONES_VALIDAS[estadoActual];

        if (!transicionesPermitidas || !transicionesPermitidas.includes(nuevoEstado)) {
            throw {
                status: 400,
                message: `No se puede cambiar de "${estadoActual}" a "${nuevoEstado}". `
                    + `Transiciones válidas: ${(transicionesPermitidas || []).join(", ") || "ninguna"}.`,
            };
        }

        // Si se cancela, restaurar stock
        if (nuevoEstado === "cancelada") {
            for (const op of orden.productos) {
                if (op.producto) {
                    const producto = await queryRunner.manager.findOneBy(
                        Producto, { id: op.producto.id },
                    );
                    if (producto) {
                        const stockAnterior = producto.stock;
                        const stockNuevo = stockAnterior + op.cantidad;
                        producto.stock = stockNuevo;
                        await queryRunner.manager.save(producto);

                        await queryRunner.manager.save(
                            queryRunner.manager.getRepository(StockMovimiento).create({
                                producto: { id: producto.id },
                                orden: { id: orden.id },
                                tipo: "restauracion",
                                cantidad: op.cantidad,
                                stockAnterior,
                                stockNuevo,
                                motivo: `Cancelación de orden #${orden.id}`,
                            }),
                        );
                    }
                }
            }
            orden.estadoPago = "cancelada";
        }

        orden.estado = nuevoEstado;
        orden.updatedAt = new Date();
        await queryRunner.manager.save(orden);

        await queryRunner.commitTransaction();
        return orden;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        logger.error("Error actualizando estado orden:", error);
        throw {
            status: error.status || 500,
            message: error.message || "Error al actualizar estado.",
        };
    } finally {
        await queryRunner.release();
    }
};

export const eliminarOrdenService = async (id) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const orden = await queryRunner.manager.findOne(Orden, {
            where: { id: parseInt(id) },
            relations: { productos: { producto: true } },
        });

        if (!orden) {
            throw { status: 404, message: "Orden no encontrada." };
        }

        // Restaurar stock si la orden no estaba cancelada previamente
        if (orden.estado !== "cancelada") {
            for (const op of orden.productos) {
                if (op.producto) {
                    const producto = await queryRunner.manager.findOneBy(
                        Producto, { id: op.producto.id },
                    );
                    if (producto) {
                        const stockAnterior = producto.stock;
                        producto.stock = stockAnterior + op.cantidad;
                        await queryRunner.manager.save(producto);

                        await queryRunner.manager.save(
                            queryRunner.manager.getRepository(StockMovimiento).create({
                                producto: { id: producto.id },
                                orden: { id: orden.id },
                                tipo: "restauracion",
                                cantidad: op.cantidad,
                                stockAnterior,
                                stockNuevo: producto.stock,
                                motivo: `Eliminación de orden #${orden.id}`,
                            }),
                        );
                    }
                }
            }
        }

        await queryRunner.manager.remove(orden);
        await queryRunner.commitTransaction();

        return { mensaje: "Orden eliminada correctamente." };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        logger.error("Error eliminando orden:", error);
        throw {
            status: error.status || 500,
            message: error.message || "Error al eliminar la orden.",
        };
    } finally {
        await queryRunner.release();
    }
};

/**
 * Obtiene las órdenes del usuario autenticado, ordenadas por fecha desc.
 */
export const obtenerMisOrdenesService = async (usuarioId) => {
    const ordenRepository = AppDataSource.getRepository(Orden);

    const ordenes = await ordenRepository.find({
        where: { usuario: { id: usuarioId } },
        relations: {
            productos: {
                producto: true,
            },
            pagos: true,
        },
        order: { createdAt: "DESC" },
    });

    return ordenes;
};
