import { AppDataSource } from "../config/configDb.js";
import Producto from "../entity/producto.entity.js";
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import fs from "fs";
import path from "path";

export const actualizarImagenProductoService = async (id, imagenUrl) => {
    const productoRepository = AppDataSource.getRepository(Producto);
    const producto = await productoRepository.findOneBy({ id });

    if (!producto) {
        throw { status: 404, message: "Producto no encontrado" };
    }

    if (producto.imagen_url) {
        const rutaImagenAnterior = path.join("uploads", "productos", producto.imagen_url);
        if (fs.existsSync(rutaImagenAnterior)) {
            fs.unlinkSync(rutaImagenAnterior);
        }
    }

    producto.imagen_url = imagenUrl;
    await productoRepository.save(producto);
    return producto;
};

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

        const queryBuilder = productoRepository.createQueryBuilder("producto");

        if (filtros.id) {
            const id = Number(filtros.id);
            if (isNaN(id) || id < 1) throw { status: 400, message: "ID inválido" };
            queryBuilder.andWhere("producto.id = :id", { id });
        }

        if (filtros.nombre) {
            const searchWords = filtros.nombre.toLowerCase().trim().split(/\s+/);
            searchWords.forEach((word, index) => {
                queryBuilder.andWhere(
                    `(LOWER(producto.nombre) LIKE :word${index} OR `
                    + `LOWER(producto.nombre) LIKE :wordSpace${index} OR `
                    + `LOWER(producto.marca) LIKE :word${index} OR `
                    + `LOWER(producto.marca) LIKE :wordSpace${index} OR `
                    + `LOWER(producto.categoria) LIKE :word${index} OR `
                    + `LOWER(producto.categoria) LIKE :wordSpace${index} OR `
                    + `LOWER(producto.codigoSKU) LIKE :word${index} OR `
                    + `LOWER(producto.codigoSKU) LIKE :wordSpace${index})`,
                    { 
                        [`word${index}`]: `${word}%`,
                        [`wordSpace${index}`]: ` ${word}%`
                    }
                );
            });
        }

        if (filtros.codigoSKU) {
            queryBuilder.andWhere("LOWER(producto.codigoSKU) LIKE LOWER(:codigoSKU)", { 
                codigoSKU: `%${filtros.codigoSKU}%` 
            });
        }

        if (filtros.marca) {
            queryBuilder.andWhere("LOWER(producto.marca) LIKE LOWER(:marca)", { 
                marca: `%${filtros.marca}%` 
            });
        }

        if (filtros.categoria) {
            if (!categoriasValidas.includes(filtros.categoria)) {
                throw { status: 400, message: "Categoría inválida" };
            }
            queryBuilder.andWhere("producto.categoria = :categoria", { categoria: filtros.categoria });
        }

        if (filtros.activo !== undefined) {
            queryBuilder.andWhere("producto.activo = :activo", { activo: filtros.activo === "true" });
        }

        if (filtros.oferta !== undefined) {
            queryBuilder.andWhere("producto.oferta = :oferta", { oferta: filtros.oferta === "true" });
        }

        if (filtros.precio_min && filtros.precio_max) {
            const min = Number(filtros.precio_min);
            const max = Number(filtros.precio_max);
            if (min < 0 || max < 0 || min > max)
                throw { status: 400, message: "Rango de precio inválido" };
            queryBuilder.andWhere("producto.precio BETWEEN :precioMin AND :precioMax", { 
                precioMin: min, 
                precioMax: max 
            });
        } else if (filtros.precio_min) {
            const min = Number(filtros.precio_min);
            if (min < 0) throw { status: 400, message: "Precio mínimo inválido" };
            queryBuilder.andWhere("producto.precio >= :precioMin", { precioMin: min });
        } else if (filtros.precio_max) {
            const max = Number(filtros.precio_max);
            if (max < 0) throw { status: 400, message: "Precio máximo inválido" };
            queryBuilder.andWhere("producto.precio <= :precioMax", { precioMax: max });
        }

        if (filtros.stock_min && filtros.stock_max) {
            const min = Number(filtros.stock_min);
            const max = Number(filtros.stock_max);
            if (min < 0 || max < 0 || min > max)
                throw { status: 400, message: "Rango de stock inválido" };
            queryBuilder.andWhere("producto.stock BETWEEN :stockMin AND :stockMax", { 
                stockMin: min, 
                stockMax: max 
            });
        } else if (filtros.stock_min) {
            const min = Number(filtros.stock_min);
            if (min < 0) throw { status: 400, message: "Stock mínimo inválido" };
            queryBuilder.andWhere("producto.stock >= :stockMin", { stockMin: min });
        } else if (filtros.stock_max) {
            const max = Number(filtros.stock_max);
            if (max < 0) throw { status: 400, message: "Stock máximo inválido" };
            queryBuilder.andWhere("producto.stock <= :stockMax", { stockMax: max });
        }

        if (filtros.descuento_min && filtros.descuento_max) {
            const min = Number(filtros.descuento_min);
            const max = Number(filtros.descuento_max);
            if (min < 0 || max < 0 || min > max)
                throw { status: 400, message: "Rango de descuento inválido" };
            queryBuilder.andWhere("producto.descuento BETWEEN :descuentoMin AND :descuentoMax", { 
                descuentoMin: min, 
                descuentoMax: max 
            });
        } else if (filtros.descuento_min) {
            const min = Number(filtros.descuento_min);
            if (min < 0)
                throw { status: 400, message: "Descuento mínimo inválido" };
            queryBuilder.andWhere("producto.descuento >= :descuentoMin", { descuentoMin: min });
        } else if (filtros.descuento_max) {
            const max = Number(filtros.descuento_max);
            if (max < 0)
                throw { status: 400, message: "Descuento máximo inválido" };
            queryBuilder.andWhere("producto.descuento <= :descuentoMax", { descuentoMax: max });
        }

        console.log("Filtros recibidos:", filtros);

        const pagina = filtros.page ? parseInt(filtros.page) : 1;
        const limite = filtros.limit ? parseInt(filtros.limit) : 100; 

        if (pagina < 1 || limite < 1)
            throw { status: 400, message: "Parámetros de paginación inválidos" };

        const skip = (pagina - 1) * limite;

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
                !camposValidos.includes(campo)
                || !["ASC", "DESC"].includes(direccion?.toUpperCase())
            ) {
                throw { status: 400, message: "Parámetro de ordenamiento inválido" };
            }

            queryBuilder.orderBy(`producto.${campo}`, direccion.toUpperCase());
        }

        queryBuilder.skip(skip).take(limite);

        const [productos, total] = await queryBuilder.getManyAndCount();

        console.log("Paginación => página:", pagina, " | límite:", limite);
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

