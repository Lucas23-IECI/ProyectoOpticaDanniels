import axios from './root.service.js';

/**
 * Obtener todas las órdenes con filtros opcionales.
 * @param {Object} filtros - { correo, estado, orden, desde, hasta }
 */
export async function getOrdenes(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.correo) params.append('correo', filtros.correo);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.orden) params.append('orden', filtros.orden);
    if (filtros.desde) params.append('desde', filtros.desde);
    if (filtros.hasta) params.append('hasta', filtros.hasta);

    const queryString = params.toString();
    const url = queryString ? `/ordenes/?${queryString}` : '/ordenes/';

    const response = await axios.get(url);
    return response.data.data;
}

/**
 * Obtener una orden por su ID.
 * @param {number} id
 */
export async function getOrdenById(id) {
    const response = await axios.get(`/ordenes/detalle/${id}`);
    return response.data.data;
}

/**
 * Actualizar el estado de una orden (solo admin).
 * @param {number} id
 * @param {string} estado - pendiente|pagada|en preparación|en camino|entregada|cancelada
 */
export async function actualizarEstadoOrden(id, estado) {
    const response = await axios.patch(`/ordenes/${id}`, { estado });
    return response.data.data;
}

/**
 * Eliminar una orden (solo admin).
 * @param {number} id
 */
export async function eliminarOrden(id) {
    const response = await axios.delete(`/ordenes/${id}`);
    return response.data;
}

/**
 * Obtener estadísticas de órdenes (solo admin).
 */
export async function getEstadisticasOrdenes() {
    const response = await axios.get('/reportes/ordenes');
    return response.data.data;
}
