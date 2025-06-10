import {
    actualizarProductoService,
    buscarProductosService,
    crearProductoService,
    eliminarProductoService
} from "../services/producto.service.js";

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

        res.status(200).json({
            mensaje: "Productos encontrados correctamente.",
            productos,
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

        res.status(200).json({
            mensaje: "Producto actualizado correctamente.",
            producto,
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