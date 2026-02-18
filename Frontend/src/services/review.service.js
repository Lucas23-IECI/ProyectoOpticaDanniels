import axios from "./root.service";

/**
 * Obtener reseñas aprobadas de un producto (público).
 * @param {number} productoId
 * @returns {Promise<Array>}
 */
export async function getReviewsByProducto(productoId) {
    try {
        const { data } = await axios.get(`/reviews/producto/${productoId}`);
        return data?.data || [];
    } catch {
        return [];
    }
}

/**
 * Obtener estadísticas de reseñas de un producto (público).
 * @param {number} productoId
 * @returns {Promise<{ promedio: number, total: number }>}
 */
export async function getReviewStats(productoId) {
    try {
        const { data } = await axios.get(`/reviews/producto/${productoId}/stats`);
        return data?.data || { promedio: 0, total: 0 };
    } catch {
        return { promedio: 0, total: 0 };
    }
}

/**
 * Crear una reseña (autenticado).
 * @param {{ productoId: number, rating: number, comentario?: string }} reviewData
 * @returns {Promise<Object>}
 */
export async function createReview(reviewData) {
    const { data } = await axios.post("/reviews", reviewData);
    return data?.data;
}

/**
 * Obtener todas las reseñas para administración.
 * @param {{ estado?: string, productoId?: number }} filtros
 * @returns {Promise<Array>}
 */
export async function getAllReviews(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.estado) params.append("estado", filtros.estado);
        if (filtros.productoId) params.append("productoId", filtros.productoId);

        const query = params.toString();
        const url = query ? `/reviews/admin?${query}` : "/reviews/admin";

        const { data } = await axios.get(url);
        return data?.data || [];
    } catch {
        return [];
    }
}

/**
 * Actualizar estado de una reseña (admin).
 * @param {number} id
 * @param {string} estado - "aprobada" | "rechazada"
 */
export async function updateReviewEstado(id, estado) {
    const { data } = await axios.patch(`/reviews/${id}/estado`, { estado });
    return data?.data;
}

/**
 * Eliminar una reseña (admin).
 * @param {number} id
 */
export async function deleteReviewAdmin(id) {
    const { data } = await axios.delete(`/reviews/${id}`);
    return data;
}
