import {
    actualizarDireccionService,
    crearDireccionService,
    eliminarDireccionService,
    establecerPrincipalService,
    obtenerDireccionesService,
    obtenerDireccionPorIdService
} from "../services/direccion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Crear nueva dirección
export const crearDireccionController = async (req, res) => {
    try {
        const userId = req.user.id;
        const datos = req.body;

        const [direccion, error] = await crearDireccionService(userId, datos);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        handleSuccess(res, 201, "Dirección creada correctamente", direccion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

// Obtener todas las direcciones del usuario
export const obtenerDireccionesController = async (req, res) => {
    try {
        const userId = req.user.id;

        const [direcciones, error] = await obtenerDireccionesService(userId);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        handleSuccess(res, 200, "Direcciones obtenidas correctamente", direcciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

// Obtener dirección por ID
export const obtenerDireccionController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [direccion, error] = await obtenerDireccionPorIdService(userId, parseInt(id));

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Dirección obtenida correctamente", direccion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

// Actualizar dirección
export const actualizarDireccionController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const datos = req.body;

        const [direccionActualizada, error] = await actualizarDireccionService(userId, parseInt(id), datos);

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Dirección actualizada correctamente", direccionActualizada);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

// Eliminar dirección
export const eliminarDireccionController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [resultado, error] = await eliminarDireccionService(userId, parseInt(id));

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Dirección eliminada correctamente");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

// Establecer dirección como principal
export const establecerPrincipalController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [direccionPrincipal, error] = await establecerPrincipalService(userId, parseInt(id));

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Dirección establecida como principal", direccionPrincipal);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}; 