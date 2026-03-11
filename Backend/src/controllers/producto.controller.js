import {
    actualizarProductoService,
    buscarProductosService,
    crearProductoService,
    eliminarProductoService,
    generarSugerenciasBusqueda,
    getProductosStockBajoService,
} from "../services/producto.service.js";
import { actualizarImagenProductoService } from "../services/producto.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import { sendStockAlertEmail } from "../helpers/email.helper.js";
import logger from "../config/logger.js";

/**
 * Genera la URL pública de una imagen de producto.
 * Si es una URL completa (Cloudinary), la devuelve tal cual.
 * Si es un nombre de archivo local, construye la ruta estática.
 */
const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `/uploads/productos/${filename}`;
};

export const subirImagenProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        // Cloudinary: req.file.path es la URL completa
        // Disco local: req.file.filename es el nombre del archivo
        const imagenUrl = req.file.path && req.file.path.startsWith("http")
            ? req.file.path
            : req.file.filename;

        const producto = await actualizarImagenProductoService(Number(id), imagenUrl);

        handleSuccess(res, 200, "Imagen del producto actualizada correctamente", {
            ...producto,
            imagen_url: getImageUrl(producto.imagen_url),
        });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const crearProductoController = async (req, res) => {
    try {
        const datosProducto = req.body;
        
        if (req.file) {
            datosProducto.imagen_url = req.file.path && req.file.path.startsWith("http")
                ? req.file.path
                : req.file.filename;
        }

        const productoCreado = await crearProductoService(datosProducto);

        handleSuccess(res, 201, "Producto creado exitosamente.", {
            ...productoCreado,
            imagen_url: getImageUrl(productoCreado.imagen_url),
        });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const buscarProductosController = async (req, res) => {
    try {
        const { productos, paginacion } = await buscarProductosService(req.query);

        const productosConUrl = productos.map((producto) => ({
            ...producto,
            imagen_url: getImageUrl(producto.imagen_url),
        }));

        handleSuccess(
            res,
            200,
            productos.length > 0 ? "Productos encontrados correctamente." : "No se encontraron productos.",
            { productos: productosConUrl, paginacion },
        );
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};


export const actualizarProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const datosProducto = { ...req.body };
        
        if (req.file) {
            datosProducto.imagen_url = req.file.path && req.file.path.startsWith("http")
                ? req.file.path
                : req.file.filename;
        }
        
        const producto = await actualizarProductoService(Number(id), datosProducto);

        handleSuccess(res, 200, "Producto actualizado correctamente.", {
            ...producto,
            imagen_url: getImageUrl(producto.imagen_url),
        });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const eliminarProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await eliminarProductoService(Number(id));

        handleSuccess(res, 200, "Producto eliminado correctamente.", producto);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const obtenerSugerenciasBusquedaController = async (req, res) => {
    try {
        const { termino } = req.query;
        
        if (!termino || termino.trim().length < 2) {
            return handleSuccess(res, 200, "Término de búsqueda muy corto.", { sugerencias: [] });
        }

        const sugerencias = await generarSugerenciasBusqueda(termino);

        handleSuccess(res, 200, "Sugerencias generadas correctamente.", { sugerencias });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const getProductosStockBajoController = async (req, res) => {
    try {
        const umbral = parseInt(req.query.umbral) || 10;
        const [productos, error] = await getProductosStockBajoService(umbral);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Productos con stock bajo obtenidos.", {
            productos,
            total: productos.length,
            umbral,
        });
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const enviarAlertaStockController = async (req, res) => {
    try {
        const umbral = parseInt(req.query.umbral) || 10;
        const [productos, error] = await getProductosStockBajoService(umbral);

        if (error) return handleErrorServer(res, 500, error);

        if (productos.length === 0) {
            return handleSuccess(res, 200, "No hay productos con stock bajo.", { enviado: false, total: 0 });
        }

        sendStockAlertEmail(productos, umbral).catch((err) =>
            logger.error("Error enviando alerta stock:", err)
        );

        handleSuccess(res, 200, `Alerta enviada para ${productos.length} productos con stock bajo.`, {
            enviado: true,
            total: productos.length,
        });
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};