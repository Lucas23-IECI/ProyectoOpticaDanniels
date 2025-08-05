import {
    actualizarProductoService,
    buscarProductosService,
    crearProductoService,
    eliminarProductoService,
    generarSugerenciasBusqueda
} from "../services/producto.service.js";
import { actualizarImagenProductoService } from "../services/producto.service.js";
import { HOST, PORT } from "../config/configEnv.js";
import path from "path";
import fs from "fs";

const convertirImagenABase64 = (filename) => {
    if (!filename) return null;
    
    try {
        const imagePath = path.join("uploads", "productos", filename);
        
        if (!fs.existsSync(imagePath)) {
            return null;
        }
        
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(filename).toLowerCase();
        
        let mimeType = "image/jpeg";
        switch (ext) {
            case ".png":
                mimeType = "image/png";
                break;
            case ".jpg":
            case ".jpeg":
                mimeType = "image/jpeg";
                break;
            case ".webp":
                mimeType = "image/webp";
                break;
            case ".gif":
                mimeType = "image/gif";
                break;
        }
        
        const base64Image = imageBuffer.toString("base64");
        return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
        console.error("Error convirtiendo imagen a Base64:", error);
        return null;
    }
};

export const subirImagenProductoController = async (req, res) => {
    try {
        const { id } = req.params;
        const imagenUrl = req.file.filename;

        const producto = await actualizarImagenProductoService(Number(id), imagenUrl);

        const imagenBase64 = convertirImagenABase64(producto.imagen_url);

        res.json({
            mensaje: "Imagen del producto actualizada correctamente",
            producto: {
                ...producto,
                imagen_url: imagenBase64,
            }
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
        
        const imagenBase64 = convertirImagenABase64(productoCreado.imagen_url);

        res.status(201).json({
            mensaje: "Producto creado exitosamente.",
            producto: {
                ...productoCreado,
                imagen_url: imagenBase64,
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

        const productosConImagenBase64 = productos.map((producto) => ({
            ...producto,
            imagen_url: convertirImagenABase64(producto.imagen_url),
        }));

        res.status(200).json({
            mensaje: productos.length > 0 ? "Productos encontrados correctamente." : "No se encontraron productos.",
            productos: productosConImagenBase64,
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

        const imagenBase64 = convertirImagenABase64(producto.imagen_url);

        res.status(200).json({
            mensaje: "Producto actualizado correctamente.",
            producto: {
                ...producto,
                imagen_url: imagenBase64,
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

export const obtenerSugerenciasBusquedaController = async (req, res) => {
    try {
        const { termino } = req.query;
        
        if (!termino || termino.trim().length < 2) {
            return res.status(200).json({
                mensaje: "Término de búsqueda muy corto.",
                sugerencias: []
            });
        }

        const sugerencias = await generarSugerenciasBusqueda(termino);

        res.status(200).json({
            mensaje: "Sugerencias generadas correctamente.",
            sugerencias
        });
    } catch (error) {
        console.error("Error en obtenerSugerenciasBusquedaController:", error);
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al obtener sugerencias de búsqueda.",
        });
    }
};