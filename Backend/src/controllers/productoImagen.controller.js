import {
    agregarImagenesService,
    eliminarImagenService,
    establecerPrincipalService,
    obtenerImagenesService,
    reordenarImagenesService,
} from "../services/productoImagen.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

const getImageUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `/uploads/productos/${filename}`;
};

const formatImagen = (img) => ({
    ...img,
    imagen_url: getImageUrl(img.imagen_url),
});

export const obtenerImagenesController = async (req, res) => {
    try {
        const { id } = req.params;
        const imagenes = await obtenerImagenesService(Number(id));
        handleSuccess(res, 200, "Imágenes obtenidas.", imagenes.map(formatImagen));
    } catch (error) {
        if (error.status) return handleErrorClient(res, error.status, error.message);
        handleErrorServer(res, 500, error.message);
    }
};

export const agregarImagenesController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.files || req.files.length === 0) {
            return handleErrorClient(res, 400, "Debe enviar al menos una imagen.");
        }
        const imagenes = await agregarImagenesService(Number(id), req.files);
        handleSuccess(res, 201, "Imágenes agregadas.", imagenes.map(formatImagen));
    } catch (error) {
        if (error.status) return handleErrorClient(res, error.status, error.message);
        handleErrorServer(res, 500, error.message);
    }
};

export const eliminarImagenController = async (req, res) => {
    try {
        const { imagenId } = req.params;
        const result = await eliminarImagenService(Number(imagenId));
        handleSuccess(res, 200, "Imagen eliminada.", result);
    } catch (error) {
        if (error.status) return handleErrorClient(res, error.status, error.message);
        handleErrorServer(res, 500, error.message);
    }
};

export const reordenarImagenesController = async (req, res) => {
    try {
        const { id } = req.params;
        const { orden } = req.body;
        if (!Array.isArray(orden)) {
            return handleErrorClient(res, 400, "Debe enviar un array 'orden' con los IDs.");
        }
        const imagenes = await reordenarImagenesService(Number(id), orden);
        handleSuccess(res, 200, "Orden actualizado.", imagenes.map(formatImagen));
    } catch (error) {
        if (error.status) return handleErrorClient(res, error.status, error.message);
        handleErrorServer(res, 500, error.message);
    }
};

export const establecerPrincipalController = async (req, res) => {
    try {
        const { imagenId } = req.params;
        const imagen = await establecerPrincipalService(Number(imagenId));
        handleSuccess(res, 200, "Imagen principal actualizada.", formatImagen(imagen));
    } catch (error) {
        if (error.status) return handleErrorClient(res, error.status, error.message);
        handleErrorServer(res, 500, error.message);
    }
};
