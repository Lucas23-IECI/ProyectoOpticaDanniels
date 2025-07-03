import { AppDataSource } from "../config/configDb.js";
import Orden from "../entity/orden.entity.js";
import OrdenProducto from "../entity/ordenProducto.entity.js";
import Producto from "../entity/producto.entity.js";
import { Between, In } from "typeorm";

export const crearOrdenService = async (datos, usuarioId = null) => {
    try {
        const ordenRepository = AppDataSource.getRepository(Orden);
        const ordenProductoRepository = AppDataSource.getRepository(OrdenProducto);
        const productoRepository = AppDataSource.getRepository(Producto);

        const { productos, cliente } = datos;
        const { nombre, correo, direccion, telefono, observaciones } = cliente;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            throw {
                status: 400,
                message: "La orden debe contener al menos un producto.",
            };
        }

        const idsProductos = productos.map((p) => p.id);
        const productosDB = await productoRepository.findBy({ id: In(idsProductos) });

        if (productosDB.length !== productos.length) {
            throw {
                status: 400,
                message: "Uno o más productos no existen.",
            };
        }

        let total = 0;
        const ordenProductos = [];

        for (const item of productos) {
            const producto = productosDB.find((p) => p.id === item.id);
            const cantidad = Number(item.cantidad);
            const precioUnitario = producto.precio;

            if (cantidad <= 0 || isNaN(cantidad)) {
                throw {
                    status: 400,
                    message: `Cantidad inválida para el producto ${producto.nombre}.`,
                };
            }

            const subtotal = cantidad * precioUnitario;
            total += subtotal;

            const ordenProducto = ordenProductoRepository.create({
                producto,
                cantidad,
                precio: precioUnitario,
            });
            
            ordenProductos.push(ordenProducto);
        }

        const nuevaOrden = ordenRepository.create({
            nombre,
            correo,
            direccion,
            telefono,
            observaciones,
            total,
            estado: "pendiente",
            productos: ordenProductos,
            usuario: usuarioId ? { id: usuarioId } : null,
            anonId: datos.anonId || null
        });

        const ordenGuardada = await ordenRepository.save(nuevaOrden);

        return ordenGuardada;
    } catch (error) {
        console.log("Error en crearOrdenService:", error);
        throw {
            status: error.status || 500,
            message: error.message || "Error al crear la orden.",
        };
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
            camposPermitidos.includes(campo) &&
            direccionesPermitidas.includes(direccion)
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
    const ordenRepository = AppDataSource.getRepository(Orden);

    const orden = await ordenRepository.findOneBy({ id: parseInt(id) });
    if (!orden) {
        throw {
            status: 404,
            message: "Orden no encontrada.",
        };
    }

    orden.estado = nuevoEstado;
    orden.updatedAt = new Date();

    await ordenRepository.save(orden);

    return orden;
};

export const eliminarOrdenService = async (id) => {
    const ordenRepository = AppDataSource.getRepository(Orden);

    const orden = await ordenRepository.findOneBy({ id: parseInt(id) });
    if (!orden) {
        throw {
            status: 404,
            message: "Orden no encontrada.",
        };
    }

    await ordenRepository.remove(orden);
    return { mensaje: "Orden eliminada correctamente." };
};
