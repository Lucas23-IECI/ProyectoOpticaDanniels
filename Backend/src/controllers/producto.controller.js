import {
    actualizarProductoService,
    buscarProductosService,
    crearProductoService,
    eliminarProductoService
} from "../services/producto.service.js";
import { actualizarImagenProductoService } from "../services/producto.service.js";
import { HOST, PORT } from "../config/configEnv.js";

export const subirImagenProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const imagenUrl = req.file.filename;

        const producto = await actualizarImagenProductoService(Number(id), imagenUrl);

        const protocolo = "http";
        const puertoDefault = PORT === "80" || PORT === "443";
        const imagenUrlCompleta =
            `${protocolo}://${HOST}${puertoDefault ? "" : `:${PORT}`}/uploads/productos/${producto.imagen_url}`;

        res.json({
            mensaje: "Imagen del producto actualizada correctamente",
            imagen_url: imagenUrlCompleta,
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

export const crearProductoController = async (req, res) => {
    try {
        const productoCreado = await crearProductoService(req.body);
        res.status(201).json({
            mensaje: "Producto creado exitosamente.",
            producto: productoCreado,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al crear el producto.",
        });
    }
};

export const buscarProductosController = async (req, res) => {
    try {
        const { productos, paginacion } = await buscarProductosService(req.query);

        if (!productos || productos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron productos con los filtros especificados.",
                productos: [],
                paginacion,
            });
        }

        const protocolo = "http";
        const puertoDefault = PORT === "80" || PORT === "443";

        const productosConImagenUrl = productos.map((producto) => ({
            ...producto,
            imagen_url: producto.imagen_url
                ? `${protocolo}://${HOST}${puertoDefault ? "" : `:${PORT}`}/uploads/productos/${producto.imagen_url}`
                : null,
        }));

        res.status(200).json({
            mensaje: "Productos encontrados correctamente.",
            productos: productosConImagenUrl,
            paginacion,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al buscar productos.",
        });
    }
};


export const actualizarProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await actualizarProductoService(Number(id), req.body);

        const protocolo = "http";
        const puertoDefault = PORT === "80" || PORT === "443";
        const imagenUrlCompleta = producto.imagen_url
            ? `${protocolo}://${HOST}${puertoDefault ? "" : `:${PORT}`}/uploads/productos/${producto.imagen_url}`
            : null;

        res.status(200).json({
            mensaje: "Producto actualizado correctamente.",
            producto: {
                ...producto,
                imagen_url: imagenUrlCompleta,
            },
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al actualizar el producto.",
        });
    }
};

export const eliminarProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await eliminarProductoService(Number(id));

        res.status(200).json({
            mensaje: "Producto eliminado correctamente.",
            producto,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al eliminar el producto.",
        });
    }
  };