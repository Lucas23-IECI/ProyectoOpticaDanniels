import {
    actualizarEstadoOrdenService,
    crearOrdenService,
    eliminarOrdenService,
    obtenerOrdenesService,
    obtenerOrdenPorIdService
} from "../services/orden.service.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";

export const crearOrdenController = async (req, res) => {
    try {
        const usuarioId = req.user?.id || null;
        const correoIngresado = req.body?.cliente?.correo;

        if (usuarioId) {
            const userRepo = AppDataSource.getRepository(User);
            const usuarioActual = await userRepo.findOneBy({ id: usuarioId });

            if (!usuarioActual) {
                return res.status(404).json({ mensaje: "Usuario autenticado no encontrado." });
            }

            if (correoIngresado !== usuarioActual.email) {
                const correoOcupado = await userRepo.findOneBy({ email: correoIngresado });

                if (correoOcupado) {
                    return res.status(400).json({
                        mensaje:
                            "El correo ingresado ya está asociado a otra cuenta. Debes usar el correo de tu sesión.",
                    });
                }
            }
        }

        const ordenCreada = await crearOrdenService(req.body, usuarioId);

        res.status(201).json({
            mensaje: "Orden creada exitosamente.",
            orden: ordenCreada,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al crear la orden.",
        });
    }
};

export const obtenerOrdenesController = async (req, res) => {
    try {
        const parametrosPermitidos = ["correo", "estado", "orden", "desde", "hasta"];
        const keysQuery = Object.keys(req.query);

        const parametrosInvalidos = keysQuery.filter(k => !parametrosPermitidos.includes(k));

        if (parametrosInvalidos.length > 0) {
            return res.status(400).json({
                mensaje: `Parámetros inválidos en la URL: ${parametrosInvalidos.join(", ")}`,
            });
        }

        const { correo, estado, orden, desde, hasta } = req.query;
        const filtros = { correo, estado, orden, desde, hasta };

        const ordenes = await obtenerOrdenesService(filtros);

        if (!ordenes || ordenes.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron órdenes con los filtros especificados.",
                ordenes: [],
            });
        }

        res.status(200).json({
            mensaje: "Órdenes encontradas correctamente.",
            ordenes,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al obtener las órdenes.",
        });
    }
};



export const obtenerOrdenPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await obtenerOrdenPorIdService(id);

        if (!orden) {
            return res.status(404).json({ mensaje: "Orden no encontrada." });
        }

        res.status(200).json({
            mensaje: "Orden obtenida correctamente.",
            orden,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al obtener la orden.",
        });
    }
};

export const actualizarEstadoOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ordenActualizada = await actualizarEstadoOrdenService(id, estado);

        res.status(200).json({
            mensaje: "Estado de la orden actualizado correctamente.",
            orden: ordenActualizada,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al actualizar el estado de la orden.",
        });
    }
};

export const eliminarOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        await eliminarOrdenService(id);

        res.status(200).json({
            mensaje: "Orden eliminada correctamente.",
        });
    } catch (error) {
        res.status(error.status || 500).json({
            mensaje: error.message || "Error al eliminar la orden.",
        });
    }
};
