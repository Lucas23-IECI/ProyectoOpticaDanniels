"use strict";
import {
    actualizarMarcaService,
    crearMarcaService,
    eliminarMarcaService,
    getMarcasService,
} from "../services/marcas.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export const getMarcasController = async (req, res) => {
    try {
        const [marcas, error] = await getMarcasService();
        if (error) return handleErrorServer(res, 500, error.message);
        handleSuccess(res, 200, "Marcas obtenidas correctamente", marcas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const crearMarcaController = async (req, res) => {
    try {
        const [marca, error] = await crearMarcaService(req.body);
        if (error) return handleErrorClient(res, error.status || 400, error.message);
        handleSuccess(res, 201, "Marca creada correctamente", marca);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const actualizarMarcaController = async (req, res) => {
    try {
        const [marca, error] = await actualizarMarcaService(req.params.id, req.body);
        if (error) return handleErrorClient(res, error.status || 400, error.message);
        handleSuccess(res, 200, "Marca actualizada correctamente", marca);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export const eliminarMarcaController = async (req, res) => {
    try {
        const [marca, error] = await eliminarMarcaService(req.params.id);
        if (error) return handleErrorClient(res, error.status || 404, error.message);
        handleSuccess(res, 200, "Marca eliminada correctamente", marca);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};
