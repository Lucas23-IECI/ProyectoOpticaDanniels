import api from "./root.service";

/**
 * Obtiene todas las marcas activas desde el backend, ordenadas alfabéticamente.
 * @returns {Promise<Array>}
 */
export const getMarcas = async () => {
    try {
        const response = await api.get("/marcas");
        return response.data.data || [];
    } catch (error) {
        console.error("Error obteniendo marcas:", error);
        return [];
    }
};
