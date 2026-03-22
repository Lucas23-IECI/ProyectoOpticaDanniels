import { AppDataSource } from "../config/configDb.js";
import Producto from "../entity/producto.entity.js";
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import fs from "fs";
import path from "path";
import logger from "../config/logger.js";

export const actualizarImagenProductoService = async (id, imagenUrl) => {
    const productoRepository = AppDataSource.getRepository(Producto);
    const producto = await productoRepository.findOneBy({ id });

    if (!producto) {
        throw { status: 404, message: "Producto no encontrado" };
    }

    if (producto.imagen_url && !producto.imagen_url.startsWith("http")) {
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
    "subcategoria",
    "activo",
    "oferta",
    "precio_min",
    "precio_max",
    "stock_min",
    "stock_max",
    "descuento_min",
    "descuento_max",
    "genero",
    "material",
    "forma",
    "color_armazon",
    "color_cristal",
    "polarizado",
    "tipo_cristal",
    "disponibilidad",
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
            throw {
                status: 400,
                message: `Filtro(s) inválido(s): ${clavesInvalidas.join(", ")}`,
            };
        }

        const queryBuilder = productoRepository.createQueryBuilder("producto")
            .leftJoinAndSelect("producto.imagenes", "imagenes")
            .addOrderBy("imagenes.posicion", "ASC");

        if (filtros.id) {
            const id = Number(filtros.id);
            if (isNaN(id) || id < 1) throw { status: 400, message: "ID inválido" };
            queryBuilder.andWhere("producto.id = :id", { id });
        }

        if (filtros.nombre) {
            const searchTerm = filtros.nombre.toLowerCase().trim();
            queryBuilder.andWhere(
                "(LOWER(producto.nombre) LIKE :searchTerm OR "
                + "LOWER(producto.marca) LIKE :searchTerm OR "
                + "LOWER(producto.categoria) LIKE :searchTerm OR "
                + "LOWER(producto.codigoSKU) LIKE :searchTerm)",
                { searchTerm: `%${searchTerm}%` }
            );
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

        if (filtros.subcategoria) {
            queryBuilder.andWhere("LOWER(producto.subcategoria) = LOWER(:subcategoria)", {
                subcategoria: filtros.subcategoria
            });
        }

        if (filtros.activo !== undefined) {
            queryBuilder.andWhere("producto.activo = :activo", { activo: filtros.activo === "true" });
        }

        if (filtros.oferta !== undefined) {
            queryBuilder.andWhere("producto.oferta = :oferta", { oferta: filtros.oferta === "true" });
        }

        if (filtros.genero) {
            queryBuilder.andWhere("LOWER(producto.genero) = LOWER(:genero)", { genero: filtros.genero });
        }

        if (filtros.material) {
            queryBuilder.andWhere("LOWER(producto.material) = LOWER(:material)", { material: filtros.material });
        }

        if (filtros.forma) {
            queryBuilder.andWhere("LOWER(producto.forma) = LOWER(:forma)", { forma: filtros.forma });
        }

        if (filtros.color_armazon) {
            queryBuilder.andWhere("LOWER(producto.color_armazon) = LOWER(:color_armazon)", { color_armazon: filtros.color_armazon });
        }

        if (filtros.color_cristal) {
            queryBuilder.andWhere("LOWER(producto.color_cristal) = LOWER(:color_cristal)", { color_cristal: filtros.color_cristal });
        }

        if (filtros.polarizado !== undefined) {
            queryBuilder.andWhere("producto.polarizado = :polarizado", { polarizado: filtros.polarizado === "true" });
        }

        if (filtros.tipo_cristal) {
            queryBuilder.andWhere("LOWER(producto.tipo_cristal) = LOWER(:tipo_cristal)", { tipo_cristal: filtros.tipo_cristal });
        }

        if (filtros.disponibilidad) {
            if (filtros.disponibilidad === "disponible") {
                queryBuilder.andWhere("producto.stock > 0 AND producto.activo = true");
            } else if (filtros.disponibilidad === "agotado") {
                queryBuilder.andWhere("producto.stock = 0");
            }
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

        const pagina = filtros.page ? parseInt(filtros.page) : 1;
        const limite = filtros.limit ? parseInt(filtros.limit) : 12;

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
        } else {
            queryBuilder.orderBy("producto.createdAt", "DESC");
        }

        queryBuilder.skip(skip).take(limite);

        const [productos, total] = await queryBuilder.getManyAndCount();

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

        // Si se está actualizando la imagen, eliminar la anterior (solo si es archivo local)
        if (datos.imagen_url && productoExistente.imagen_url && datos.imagen_url !== productoExistente.imagen_url) {
            if (!productoExistente.imagen_url.startsWith("http")) {
                const rutaImagenAnterior = path.join("uploads", "productos", productoExistente.imagen_url);
                try {
                    if (fs.existsSync(rutaImagenAnterior)) {
                        fs.unlinkSync(rutaImagenAnterior);
                    }
                } catch (errorImagen) {
                    logger.error(`Error al eliminar imagen anterior: ${rutaImagenAnterior}`, errorImagen);
                }
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

        // Eliminar la imagen física del filesystem si existe
        if (producto.imagen_url) {
            const rutaImagen = path.join("uploads", "productos", producto.imagen_url);

            try {
                if (fs.existsSync(rutaImagen)) {
                    fs.unlinkSync(rutaImagen);
                }
            } catch (errorImagen) {
                logger.error(`Error al eliminar imagen: ${rutaImagen}`, errorImagen);
                // No lanzamos error aquí para que siga eliminando el producto de la BD
            }
        }

        // Eliminar el producto de la base de datos
        await productoRepository.remove(producto);

        return producto;
    } catch (error) {
        throw {
            status: error.status || 500,
            message: error.message || "Error al eliminar el producto",
        };
    }
};

export const generarSugerenciasBusqueda = async (terminoBusqueda) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        // Obtener todos los productos activos para generar sugerencias
        const productos = await productoRepository.find({
            where: { activo: true },
            select: ["nombre", "marca", "codigoSKU", "categoria"]
        });

        const termino = terminoBusqueda.toLowerCase().trim();
        const sugerencias = new Set();

        // Función para calcular similitud entre dos strings
        const calcularSimilitud = (str1, str2) => {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;

            if (longer.length === 0) return 1.0;

            const editDistance = levenshteinDistance(longer, shorter);
            return (longer.length - editDistance) / longer.length;
        };

        // Función para calcular distancia de Levenshtein
        const levenshteinDistance = (str1, str2) => {
            const matrix = [];
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            return matrix[str2.length][str1.length];
        };

        // Generar sugerencias basadas en diferentes campos
        productos.forEach(producto => {
            const campos = [
                producto.nombre,
                producto.marca,
                producto.codigoSKU,
                producto.categoria
            ].filter(campo => campo && campo.trim());

            campos.forEach(campo => {
                const campoLower = campo.toLowerCase();

                // Verificar si el término está contenido en el campo
                if (campoLower.includes(termino) && termino.length >= 2) {
                    sugerencias.add(campo);
                }

                // Verificar similitud si el término tiene al menos 3 caracteres
                if (termino.length >= 3) {
                    const similitud = calcularSimilitud(termino, campoLower);
                    if (similitud >= 0.6) { // Umbral de similitud del 60%
                        sugerencias.add(campo);
                    }
                }

                // Buscar palabras que empiecen con el término
                const palabras = campoLower.split(/\s+/);
                palabras.forEach(palabra => {
                    if (palabra.startsWith(termino) && termino.length >= 2) {
                        sugerencias.add(campo);
                    }
                });
            });
        });

        // Convertir a array y ordenar por relevancia
        const sugerenciasArray = Array.from(sugerencias);

        // Ordenar por relevancia (primero las que contienen el término exacto)
        sugerenciasArray.sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();

            const aExacta = aLower.includes(termino);
            const bExacta = bLower.includes(termino);

            if (aExacta && !bExacta) return -1;
            if (!aExacta && bExacta) return 1;

            // Si ambas son exactas o ambas no, ordenar por longitud
            return a.length - b.length;
        });

        // Limitar a 5 sugerencias
        return sugerenciasArray.slice(0, 5);
    } catch (error) {
        logger.error("Error generando sugerencias:", error);
        return [];
    }
};

/**
 * Obtener productos con stock bajo.
 * @param {number} umbral — Umbral de stock (default 10)
 * @returns {Promise<[Array, null] | [null, string]>}
 */
export const getProductosStockBajoService = async (umbral = 10) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        const productos = await productoRepository
            .createQueryBuilder("producto")
            .select([
                "producto.id",
                "producto.nombre",
                "producto.marca",
                "producto.categoria",
                "producto.stock",
                "producto.precio",
                "producto.imagen_url",
                "producto.activo",
            ])
            .where("producto.stock < :umbral AND producto.activo = :activo", {
                umbral,
                activo: true,
            })
            .orderBy("producto.stock", "ASC")
            .getMany();

        return [productos, null];
    } catch (error) {
        logger.error("Error obteniendo productos stock bajo:", error);
        return [null, "Error al obtener productos con stock bajo."];
    }
};

/**
 * Obtener facetas (conteos) para filtros contextuales del catálogo.
 * Respeta los filtros activos para recalcular conteos dinámicamente.
 */
export const obtenerFacetasService = async (filtros) => {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        // Construir query base con los filtros activos (igual que buscarProductos)
        const buildBaseQuery = (excluirCampo) => {
            const qb = productoRepository.createQueryBuilder("producto")
                .where("producto.activo = true");

            if (excluirCampo !== "categoria" && filtros.categoria) {
                qb.andWhere("producto.categoria = :categoria", { categoria: filtros.categoria });
            }
            if (excluirCampo !== "subcategoria" && filtros.subcategoria) {
                qb.andWhere("LOWER(producto.subcategoria) = LOWER(:subcategoria)", { subcategoria: filtros.subcategoria });
            }
            if (excluirCampo !== "marca" && filtros.marca) {
                qb.andWhere("LOWER(producto.marca) = LOWER(:marca)", { marca: filtros.marca });
            }
            if (excluirCampo !== "genero" && filtros.genero) {
                qb.andWhere("LOWER(producto.genero) = LOWER(:genero)", { genero: filtros.genero });
            }
            if (excluirCampo !== "material" && filtros.material) {
                qb.andWhere("LOWER(producto.material) = LOWER(:material)", { material: filtros.material });
            }
            if (excluirCampo !== "forma" && filtros.forma) {
                qb.andWhere("LOWER(producto.forma) = LOWER(:forma)", { forma: filtros.forma });
            }
            if (excluirCampo !== "color_armazon" && filtros.color_armazon) {
                qb.andWhere("LOWER(producto.color_armazon) = LOWER(:color_armazon)", { color_armazon: filtros.color_armazon });
            }
            if (excluirCampo !== "color_cristal" && filtros.color_cristal) {
                qb.andWhere("LOWER(producto.color_cristal) = LOWER(:color_cristal)", { color_cristal: filtros.color_cristal });
            }
            if (excluirCampo !== "polarizado" && filtros.polarizado !== undefined) {
                qb.andWhere("producto.polarizado = :polarizado", { polarizado: filtros.polarizado === "true" });
            }
            if (excluirCampo !== "tipo_cristal" && filtros.tipo_cristal) {
                qb.andWhere("LOWER(producto.tipo_cristal) = LOWER(:tipo_cristal)", { tipo_cristal: filtros.tipo_cristal });
            }
            if (filtros.precio_min) {
                qb.andWhere("producto.precio >= :precioMin", { precioMin: Number(filtros.precio_min) });
            }
            if (filtros.precio_max) {
                qb.andWhere("producto.precio <= :precioMax", { precioMax: Number(filtros.precio_max) });
            }
            if (filtros.nombre) {
                const searchTerm = filtros.nombre.toLowerCase().trim();
                qb.andWhere(
                    "(LOWER(producto.nombre) LIKE :searchTerm OR LOWER(producto.marca) LIKE :searchTerm)",
                    { searchTerm: `%${searchTerm}%` }
                );
            }
            return qb;
        };

        // Función para obtener conteos de un campo
        const getFacetCounts = async (campo, excluirCampo) => {
            const qb = buildBaseQuery(excluirCampo);
            const results = await qb
                .select(`producto.${campo}`, "valor")
                .addSelect("COUNT(*)", "count")
                .andWhere(`producto.${campo} IS NOT NULL AND producto.${campo} != ''`)
                .groupBy(`producto.${campo}`)
                .orderBy("count", "DESC")
                .getRawMany();
            return results.map(r => ({ valor: r.valor, count: parseInt(r.count) }));
        };

        const [
            categorias,
            subcategorias,
            marcas,
            generos,
            materiales,
            formas,
            coloresArmazon,
            coloresCristal,
            tiposCristal,
        ] = await Promise.all([
            getFacetCounts("categoria", "categoria"),
            getFacetCounts("subcategoria", "subcategoria"),
            getFacetCounts("marca", "marca"),
            getFacetCounts("genero", "genero"),
            getFacetCounts("material", "material"),
            getFacetCounts("forma", "forma"),
            getFacetCounts("color_armazon", "color_armazon"),
            getFacetCounts("color_cristal", "color_cristal"),
            getFacetCounts("tipo_cristal", "tipo_cristal"),
        ]);

        // Faceta polarizado (true/false)
        const qbPol = buildBaseQuery("polarizado");
        const polResults = await qbPol
            .select("producto.polarizado", "valor")
            .addSelect("COUNT(*)", "count")
            .andWhere("producto.polarizado IS NOT NULL")
            .groupBy("producto.polarizado")
            .getRawMany();
        const polarizado = polResults.map(r => ({
            valor: r.valor === true || r.valor === "true" ? "Sí" : "No",
            rawValue: r.valor,
            count: parseInt(r.count),
        }));

        // Rango de precios global (para slider)
        const qbPrecio = buildBaseQuery(null);
        const precioRange = await qbPrecio
            .select("MIN(producto.precio)", "min")
            .addSelect("MAX(producto.precio)", "max")
            .getRawOne();

        return {
            categorias,
            subcategorias,
            marcas,
            generos,
            materiales,
            formas,
            coloresArmazon,
            coloresCristal,
            tiposCristal,
            polarizado,
            precioRango: {
                min: precioRange?.min ? parseInt(precioRange.min) : 0,
                max: precioRange?.max ? parseInt(precioRange.max) : 0,
            },
        };
    } catch (error) {
        logger.error("Error obteniendo facetas:", error);
        throw {
            status: error.status || 500,
            message: error.message || "Error al obtener facetas de productos.",
        };
    }
};

