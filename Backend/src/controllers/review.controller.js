"use strict";
import {
    createReviewService,
    deleteReviewService,
    getAllReviewsService,
    getReviewsByProductoService,
    getReviewStatsService,
    updateReviewEstadoService,
} from "../services/review.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * GET /api/reviews/producto/:productoId — público
 */
export const getReviewsByProducto = async (req, res) => {
    try {
        const { productoId } = req.params;

        const [reviews, error] = await getReviewsByProductoService(productoId);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Reseñas obtenidas correctamente.", reviews);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * GET /api/reviews/producto/:productoId/stats — público
 */
export const getReviewStats = async (req, res) => {
    try {
        const { productoId } = req.params;

        const [stats, error] = await getReviewStatsService(productoId);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Estadísticas obtenidas correctamente.", stats);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * POST /api/reviews — autenticado
 */
export const createReview = async (req, res) => {
    try {
        const userId = req.user.id;

        const [review, error] = await createReviewService(userId, req.body);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Reseña creada correctamente. Está pendiente de aprobación.", review);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * GET /api/reviews/admin — admin
 */
export const getAllReviews = async (req, res) => {
    try {
        const { estado, productoId } = req.query;

        const [reviews, error] = await getAllReviewsService({ estado, productoId });

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Reseñas obtenidas correctamente.", reviews);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * PATCH /api/reviews/:id/estado — admin
 */
export const updateReviewEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const [review, error] = await updateReviewEstadoService(id, estado);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Estado de la reseña actualizado correctamente.", review);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

/**
 * DELETE /api/reviews/:id — admin
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const [result, error] = await deleteReviewService(id);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, result.message);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};
