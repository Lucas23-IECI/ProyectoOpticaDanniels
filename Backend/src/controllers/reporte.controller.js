"use strict";
import {
    getEstadisticasGeneralesService,
    getEstadisticasUsuariosService,
    getEstadisticasProductosService,
} from "../services/reporte.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getEstadisticasGenerales(req, res) {
    try {
        const [estadisticas, error] = await getEstadisticasGeneralesService();

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Estadísticas generales obtenidas correctamente", estadisticas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getEstadisticasUsuarios(req, res) {
    try {
        const [estadisticas, error] = await getEstadisticasUsuariosService();

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Estadísticas de usuarios obtenidas correctamente", estadisticas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getEstadisticasProductos(req, res) {
    try {
        const [estadisticas, error] = await getEstadisticasProductosService();

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Estadísticas de productos obtenidas correctamente", estadisticas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}