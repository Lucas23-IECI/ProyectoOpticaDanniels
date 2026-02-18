import {
    actualizarEstadoOrdenService,
    crearOrdenService,
    eliminarOrdenService,
    obtenerOrdenesService,
    obtenerOrdenPorIdService
} from "../services/orden.service.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export const crearOrdenController = async (req, res) => {
    try {
        const usuarioId = req.user?.id || null;
        const correoIngresado = req.body?.cliente?.correo;

        if (usuarioId) {
            const userRepo = AppDataSource.getRepository(User);
            const usuarioActual = await userRepo.findOneBy({ id: usuarioId });

            if (!usuarioActual) {
                return handleErrorClient(res, 404, "Usuario autenticado no encontrado.");
            }

            if (correoIngresado !== usuarioActual.email) {
                const correoOcupado = await userRepo.findOneBy({ email: correoIngresado });

                if (correoOcupado) {
                    return handleErrorClient(
                        res,
                        400,
                        "El correo ingresado ya está asociado a otra cuenta. Debes usar el correo de tu sesión.",
                    );
                }
            }
        }

        const ordenCreada = await crearOrdenService(req.body, usuarioId);

        handleSuccess(res, 201, "Orden creada exitosamente.", ordenCreada);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const obtenerOrdenesController = async (req, res) => {
    try {
        const parametrosPermitidos = ["correo", "estado", "orden", "desde", "hasta"];
        const keysQuery = Object.keys(req.query);

        const parametrosInvalidos = keysQuery.filter(k => !parametrosPermitidos.includes(k));

        if (parametrosInvalidos.length > 0) {
            return handleErrorClient(
                res,
                400,
                `Parámetros inválidos en la URL: ${parametrosInvalidos.join(", ")}`,
            );
        }

        const { correo, estado, orden, desde, hasta } = req.query;
        const filtros = { correo, estado, orden, desde, hasta };

        const ordenes = await obtenerOrdenesService(filtros);

        if (!ordenes || ordenes.length === 0) {
            return handleSuccess(res, 200, "No se encontraron órdenes con los filtros especificados.", { ordenes: [] });
        }

        handleSuccess(res, 200, "Órdenes encontradas correctamente.", { ordenes });
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};



export const obtenerOrdenPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await obtenerOrdenPorIdService(id);

        if (!orden) {
            return handleErrorClient(res, 404, "Orden no encontrada.");
        }

        handleSuccess(res, 200, "Orden obtenida correctamente.", orden);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const actualizarEstadoOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ordenActualizada = await actualizarEstadoOrdenService(id, estado);

        handleSuccess(res, 200, "Estado de la orden actualizado correctamente.", ordenActualizada);
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};

export const eliminarOrdenController = async (req, res) => {
    try {
        const { id } = req.params;
        await eliminarOrdenService(id);

        handleSuccess(res, 200, "Orden eliminada correctamente.");
    } catch (error) {
        if (error.status) {
            return handleErrorClient(res, error.status, error.message);
        }
        handleErrorServer(res, 500, error.message);
    }
};
