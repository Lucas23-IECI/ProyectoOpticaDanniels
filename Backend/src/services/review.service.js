"use strict";
import { AppDataSource } from "../config/configDb.js";
import Review from "../entity/review.entity.js";
import Producto from "../entity/producto.entity.js";
import logger from "../config/logger.js";

/**
 * Obtener reseñas aprobadas de un producto (público).
 */
export async function getReviewsByProductoService(productoId) {
    try {
        const reviewRepository = AppDataSource.getRepository(Review);

        const reviews = await reviewRepository.find({
            where: { productoId: parseInt(productoId), estado: "aprobada" },
            relations: ["usuario"],
            order: { createdAt: "DESC" },
        });

        // Limpiar datos del usuario (no exponer password ni datos sensibles)
        const reviewsLimpias = reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comentario: r.comentario,
            createdAt: r.createdAt,
            usuario: r.usuario
                ? {
                      id: r.usuario.id,
                      primerNombre: r.usuario.primerNombre,
                      apellidoPaterno: r.usuario.apellidoPaterno,
                  }
                : null,
        }));

        return [reviewsLimpias, null];
    } catch (error) {
        logger.error("Error en getReviewsByProductoService:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener estadísticas de reseñas de un producto (público).
 */
export async function getReviewStatsService(productoId) {
    try {
        const reviewRepository = AppDataSource.getRepository(Review);

        const result = await reviewRepository
            .createQueryBuilder("review")
            .select("AVG(review.rating)", "promedio")
            .addSelect("COUNT(review.id)", "total")
            .where("review.productoId = :productoId", { productoId: parseInt(productoId) })
            .andWhere("review.estado = :estado", { estado: "aprobada" })
            .getRawOne();

        return [
            {
                promedio: result.promedio ? parseFloat(parseFloat(result.promedio).toFixed(1)) : 0,
                total: parseInt(result.total) || 0,
            },
            null,
        ];
    } catch (error) {
        logger.error("Error en getReviewStatsService:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Crear una reseña (usuario autenticado).
 */
export async function createReviewService(userId, body) {
    try {
        const reviewRepository = AppDataSource.getRepository(Review);
        const productoRepository = AppDataSource.getRepository(Producto);

        const { productoId, rating, comentario } = body;

        // Verificar que el producto existe y está activo
        const producto = await productoRepository.findOne({
            where: { id: parseInt(productoId), activo: true },
        });

        if (!producto) {
            return [null, "El producto no existe o no está disponible."];
        }

        // Verificar duplicado (1 reseña por usuario por producto)
        const existente = await reviewRepository.findOne({
            where: { userId: parseInt(userId), productoId: parseInt(productoId) },
        });

        if (existente) {
            return [null, "Ya has enviado una reseña para este producto."];
        }

        const nuevaReview = reviewRepository.create({
            userId: parseInt(userId),
            productoId: parseInt(productoId),
            rating,
            comentario: comentario || null,
            estado: "pendiente",
        });

        const reviewGuardada = await reviewRepository.save(nuevaReview);

        return [reviewGuardada, null];
    } catch (error) {
        logger.error("Error en createReviewService:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todas las reseñas (admin, con filtros opcionales).
 */
export async function getAllReviewsService(filtros = {}) {
    try {
        const reviewRepository = AppDataSource.getRepository(Review);

        const where = {};
        if (filtros.estado) where.estado = filtros.estado;
        if (filtros.productoId) where.productoId = parseInt(filtros.productoId);

        const reviews = await reviewRepository.find({
            where,
            relations: ["usuario", "producto"],
            order: { createdAt: "DESC" },
        });

        // Limpiar datos sensibles del usuario
        const reviewsLimpias = reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comentario: r.comentario,
            estado: r.estado,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            usuario: r.usuario
                ? {
                      id: r.usuario.id,
                      primerNombre: r.usuario.primerNombre,
                      apellidoPaterno: r.usuario.apellidoPaterno,
                      email: r.usuario.email,
                  }
                : null,
            producto: r.producto
                ? {
                      id: r.producto.id,
                      nombre: r.producto.nombre,
                      imagen_url: r.producto.imagen_url,
                  }
                : null,
        }));

        return [reviewsLimpias, null];
    } catch (error) {
        logger.error("Error en getAllReviewsService:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar estado de una reseña (admin).
 */
export async function updateReviewEstadoService(id, estado) {
    try {
        const reviewRepository = AppDataSource.getRepository(Review);

        const review = await reviewRepository.findOneBy({ id: parseInt(id) });

        if (!review) {
            return [null, "Reseña no encontrada."];
        }

        review.estado = estado;
        const reviewActualizada = await reviewRepository.save(review);

        return [reviewActualizada, null];
    } catch (error) {
        logger.error("Error en updateReviewEstadoService:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar una reseña (admin).
 */
export async function deleteReviewService(id) {
    try {
        const reviewRepository = AppDataSource.getRepository(Review);

        const review = await reviewRepository.findOneBy({ id: parseInt(id) });

        if (!review) {
            return [null, "Reseña no encontrada."];
        }

        await reviewRepository.remove(review);

        return [{ message: "Reseña eliminada correctamente." }, null];
    } catch (error) {
        logger.error("Error en deleteReviewService:", error);
        return [null, "Error interno del servidor"];
    }
}
