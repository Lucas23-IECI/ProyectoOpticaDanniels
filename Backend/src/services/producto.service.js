import { AppDataSource } from "../config/configDb.js";
import Producto from "../entity/producto.entity.js";
import { ILike, Between, MoreThanOrEqual, LessThanOrEqual, Not } from "typeorm";

const camposPermitidos = [
    "id",
    "nombre",
    "codigoSKU",
    "marca",
    "categoria",
    "activo",
    "oferta",
    "precio_min",
    "precio_max",
    "stock_min",
    "stock_max",
    "descuento_min",
    "descuento_max",
    "page",
    "limit",
    "orden",
];


const categoriasValidas = ["opticos", "sol", "accesorios"];

export const crearProductoService = async (datos) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        const productoExistente = await productoRepository.findOneBy({
            codigoSKU: datos.codigoSKU,
        });

        if (productoExistente) {
            throw {
                status: 400,
                message: "Ya existe un producto con ese código SKU.",
            };
        }

        const nuevoProducto = productoRepository.create(datos);
        const productoGuardado = await productoRepository.save(nuevoProducto);

        return productoGuardado;
    } catch (error) {
        throw {
            status: error.status || 500,
            message: error.message || "Error al crear el producto.",
        };
    }
};

export const buscarProductosService = async (filtros) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        const clavesInvalidas = Object.keys(filtros).filter(
            (clave) => !camposPermitidos.includes(clave)
        );

        if (clavesInvalidas.length > 0) {
            console.log("Claves inválidas en filtros:", clavesInvalidas);
            throw {
                status: 400,
                message: `Filtro(s) inválido(s): ${clavesInvalidas.join(", ")}`,
            };
        }

        const where = {};

        if (filtros.id) {
            const id = Number(filtros.id);
            if (isNaN(id) || id < 1) throw { status: 400, message: "ID inválido" };
            where.id = id;
        }

        if (filtros.nombre) where.nombre = ILike(`%${filtros.nombre}%`);
        if (filtros.codigoSKU) where.codigoSKU = ILike(`%${filtros.codigoSKU}%`);
        if (filtros.marca) where.marca = ILike(`%${filtros.marca}%`);

        if (filtros.categoria) {
            if (!categoriasValidas.includes(filtros.categoria)) {
                throw { status: 400, message: "Categoría inválida" };
            }
            where.categoria = filtros.categoria;
        }

        if (filtros.activo !== undefined)
            where.activo = filtros.activo === "true";
        if (filtros.oferta !== undefined)
            where.oferta = filtros.oferta === "true";

        if (filtros.precio_min && filtros.precio_max) {
            const min = Number(filtros.precio_min);
            const max = Number(filtros.precio_max);
            if (min < 0 || max < 0 || min > max)
                throw { status: 400, message: "Rango de precio inválido" };
            where.precio = Between(min, max);
        } else if (filtros.precio_min) {
            const min = Number(filtros.precio_min);
            if (min < 0) throw { status: 400, message: "Precio mínimo inválido" };
            where.precio = MoreThanOrEqual(min);
        } else if (filtros.precio_max) {
            const max = Number(filtros.precio_max);
            if (max < 0) throw { status: 400, message: "Precio máximo inválido" };
            where.precio = LessThanOrEqual(max);
        }

        if (filtros.stock_min && filtros.stock_max) {
            const min = Number(filtros.stock_min);
            const max = Number(filtros.stock_max);
            if (min < 0 || max < 0 || min > max)
                throw { status: 400, message: "Rango de stock inválido" };
            where.stock = Between(min, max);
        } else if (filtros.stock_min) {
            const min = Number(filtros.stock_min);
            if (min < 0) throw { status: 400, message: "Stock mínimo inválido" };
            where.stock = MoreThanOrEqual(min);
        } else if (filtros.stock_max) {
            const max = Number(filtros.stock_max);
            if (max < 0) throw { status: 400, message: "Stock máximo inválido" };
            where.stock = LessThanOrEqual(max);
        }

        if (filtros.descuento_min && filtros.descuento_max) {
            const min = Number(filtros.descuento_min);
            const max = Number(filtros.descuento_max);
            if (min < 0 || max < 0 || min > max)
                throw { status: 400, message: "Rango de descuento inválido" };
            where.descuento = Between(min, max);
        } else if (filtros.descuento_min) {
            const min = Number(filtros.descuento_min);
            if (min < 0)
                throw { status: 400, message: "Descuento mínimo inválido" };
            where.descuento = MoreThanOrEqual(min);
        } else if (filtros.descuento_max) {
            const max = Number(filtros.descuento_max);
            if (max < 0)
                throw { status: 400, message: "Descuento máximo inválido" };
            where.descuento = LessThanOrEqual(max);
        }

        console.log("Filtros recibidos:", filtros);
        console.log("Condición WHERE final:", where);

        const pagina = filtros.page ? parseInt(filtros.page) : 1;
        const limite = filtros.limit ? parseInt(filtros.limit) : 10;

        if (pagina < 1 || limite < 1)
            throw { status: 400, message: "Parámetros de paginación inválidos" };

        const skip = (pagina - 1) * limite;
        const take = limite;

        let order = {};

        if (filtros.orden) {
            const [campo, direccion] = filtros.orden.split("_");
            const camposValidos = [
                "nombre",
                "precio",
                "stock",
                "descuento",
                "createdAt",
                "updatedAt",
            ];

            if (
                !camposValidos.includes(campo) ||
                !["ASC", "DESC"].includes(direccion?.toUpperCase())
            ) {
                throw { status: 400, message: "Parámetro de ordenamiento inválido" };
            }

            order[campo] = direccion.toUpperCase();
        }

        const [productos, total] = await productoRepository.findAndCount({
            where,
            skip,
            take,
            order,
        });

        console.log("Paginación => página:", pagina, " | límite:", limite);
        console.log("Orden aplicado:", order);
        console.log("Total productos encontrados:", total);

        return {
            productos,
            paginacion: {
                total,
                pagina,
                paginas: Math.ceil(total / limite),
                limite,
            },
        };
    } catch (error) {
        console.log("Error en buscarProductosService:", error);
        throw {
            status: error.status || 500,
            message: error.message || "Error al buscar los productos.",
        };
    }
};

export const actualizarProductoService = async (id, datos) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        const productoExistente = await productoRepository.findOneBy({ id });

        if (!productoExistente) {
            throw {
                status: 404,
                message: "Producto no encontrado",
            };
        }

        if (datos.codigoSKU && datos.codigoSKU !== productoExistente.codigoSKU) {
            const skuRepetido = await productoRepository.findOne({
                where: {
                    codigoSKU: datos.codigoSKU,
                    id: Not(id),
                },
            });

            if (skuRepetido) {
                throw {
                    status: 400,
                    message: "Ya existe un producto con ese código SKU",
                };
            }
        }

        if (datos.nombre && datos.nombre !== productoExistente.nombre) {
            const nombreRepetido = await productoRepository.findOne({
                where: {
                    nombre: datos.nombre,
                    id: Not(id),
                },
            });

            if (nombreRepetido) {
                throw {
                    status: 400,
                    message: "Ya existe un producto con ese nombre",
                };
            }
        }

        const productoActualizado = {
            ...productoExistente,
            ...datos,
            updatedAt: new Date(),
        };

        await productoRepository.save(productoActualizado);

        return productoActualizado;
    } catch (error) {
        throw {
            status: error.status || 500,
            message: error.message || "Error al actualizar el producto",
        };
    }
};



export const eliminarProductoService = async (id) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        const producto = await productoRepository.findOneBy({ id });

        if (!producto) {
            throw {
                status: 404,
                message: "Producto no encontrado",
            };
        }

        await productoRepository.remove(producto);

        return producto;
    } catch (error) {
        throw {
            status: error.status || 500,
            message: error.message || "Error al eliminar el producto",
        };
    }
};

