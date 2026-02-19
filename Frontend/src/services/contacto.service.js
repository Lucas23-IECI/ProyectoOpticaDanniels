import axios from "./root.service";

/**
 * Enviar un mensaje de contacto (público).
 */
export async function enviarMensajeContacto(mensajeData) {
    const { data } = await axios.post("/contacto", mensajeData);
    return data;
}

// ==================== ADMIN ====================

/**
 * Obtener todos los mensajes (admin).
 */
export async function getAllMensajes(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.leido !== undefined) params.append("leido", filtros.leido);
        if (filtros.respondido !== undefined) params.append("respondido", filtros.respondido);
        const url = `/contacto/admin${params.toString() ? `?${params}` : ""}`;
        const { data } = await axios.get(url);
        return data?.data || [];
    } catch (error) {
        console.error("Error obteniendo mensajes:", error);
        return [];
    }
}

/**
 * Marcar mensaje como leído (admin).
 */
export async function marcarMensajeLeido(mensajeId) {
    const { data } = await axios.patch(`/contacto/${mensajeId}/leido`);
    return data;
}

/**
 * Marcar mensaje como respondido (admin).
 */
export async function marcarMensajeRespondido(mensajeId) {
    const { data } = await axios.patch(`/contacto/${mensajeId}/respondido`);
    return data;
}

/**
 * Eliminar mensaje (admin).
 */
export async function eliminarMensaje(mensajeId) {
    const { data } = await axios.delete(`/contacto/${mensajeId}`);
    return data;
}
