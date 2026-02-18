import {
    actualizarProductoService,
    buscarProductosService,
    crearProductoService,
    eliminarProductoService,
    generarSugerenciasBusqueda
} from "../services/producto.service.js";
import { actualizarImagenProductoService } from "../services/producto.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Genera la URL pública de una imagen de producto.
 * Las imágenes se sirven como archivos estáticos via express.static("/uploads").
 */
const getImageUrl = (filename) => {
    if (!filename) return null;
    return `/uploads/productos/${filename}`;
};

export const subirImagenProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const imagenUrl = req.file.filename;

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
            datosProducto.imagen_url = req.file.filename;
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
            datosProducto.imagen_url = req.file.filename;
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