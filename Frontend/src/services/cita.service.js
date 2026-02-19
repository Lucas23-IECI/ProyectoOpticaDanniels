import axios from "./root.service";

/**
 * Obtener disponibilidad de un día (público).
 */
export async function getDisponibilidad(fecha) {
    try {
        const { data } = await axios.get(`/citas/disponibilidad/${fecha}`);
        return data?.data || { slots: [], disponible: false };
    } catch (error) {
        console.error("Error obteniendo disponibilidad:", error);
        return { slots: [], disponible: false };
    }
}

/**
 * Crear una cita (usuario autenticado).
 */
export async function crearCita(citaData) {
    const { data } = await axios.post("/citas", citaData);
    return data;
}

/**
 * Obtener las citas del usuario autenticado.
 */
export async function getMisCitas() {
    try {
        const { data } = await axios.get("/citas/mis-citas");
        return data?.data || [];
    } catch (error) {
        console.error("Error obteniendo mis citas:", error);
        return [];
    }
}

/**
 * Cancelar una cita del usuario.
 */
export async function cancelarCita(citaId) {
    const { data } = await axios.patch(`/citas/${citaId}/cancelar`);
    return data;
}

// ==================== ADMIN ====================

/**
 * Obtener todas las citas (admin).
 */
export async function getAllCitas(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.estado) params.append("estado", filtros.estado);
        if (filtros.fecha) params.append("fecha", filtros.fecha);
        const url = `/citas/admin${params.toString() ? `?${params}` : ""}`;
        const { data } = await axios.get(url);
        return data?.data || [];
    } catch (error) {
        console.error("Error obteniendo citas:", error);
        return [];
    }
}

/**
 * Actualizar estado de cita (admin).
 */
export async function actualizarEstadoCita(citaId, body) {
    const { data } = await axios.patch(`/citas/${citaId}/estado`, body);
    return data;
}
