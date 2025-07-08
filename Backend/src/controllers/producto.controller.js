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
        const datosProducto = req.body;
        
        if (req.file) {
            datosProducto.imagen_url = req.file.filename;
        }

        const productoCreado = await crearProductoService(datosProducto);
        
        const protocolo = "http";
        const puertoDefault = PORT === "80" || PORT === "443";
        const imagenUrlCompleta = productoCreado.imagen_url
            ? `${protocolo}://${HOST}${puertoDefault ? "" : `:${PORT}`}/uploads/productos/${productoCreado.imagen_url}`
            : null;

        res.status(201).json({
            mensaje: "Producto creado exitosamente.",
            producto: {
                ...productoCreado,
                imagen_url: imagenUrlCompleta,
            },
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

        const protocolo = "http";
        const puertoDefault = PORT === "80" || PORT === "443";

        const productosConImagenUrl = productos.map((producto) => ({
            ...producto,
            imagen_url: producto.imagen_url
                ? `${protocolo}://${HOST}${puertoDefault ? "" : `:${PORT}`}/uploads/productos/${producto.imagen_url}`
                : null,
        }));

        res.status(200).json({
            mensaje: productos.length > 0 ? "Productos encontrados correctamente." : "No se encontraron productos.",
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
        console.log("Actualizando producto con ID:", id);
        console.log("Datos recibidos:", req.body);
        
        const datosProducto = { ...req.body };
        
        if (req.file) {
            datosProducto.imagen_url = req.file.filename;
        }
        
        const producto = await actualizarProductoService(Number(id), datosProducto);

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
        console.error("Error en actualizarProductoController:", error);
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