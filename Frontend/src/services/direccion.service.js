import api from "./root.service";

const DIRECCIONES_ENDPOINT = "/direcciones";

export const obtenerDirecciones = async () => {
    try {
        const response = await api.get(DIRECCIONES_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerDirecciones:", error);
        throw error;
    }
};

export const obtenerDireccionPorId = async (direccionId) => {
    try {
        const response = await api.get(`${DIRECCIONES_ENDPOINT}/${direccionId}`);
        return response.data;
    } catch (error) {
        console.error("Error en obtenerDireccionPorId:", error);
        throw error;
    }
};

export const crearDireccion = async (direccionData) => {
    try {
        const response = await api.post(DIRECCIONES_ENDPOINT, direccionData);
        return response.data;
    } catch (error) {
        console.error("Error en crearDireccion:", error);
        throw error;
    }
};

export const actualizarDireccion = async (direccionId, direccionData) => {
    try {
        const response = await api.put(`${DIRECCIONES_ENDPOINT}/${direccionId}`, direccionData);
        return response.data;
    } catch (error) {
        console.error("Error en actualizarDireccion:", error);
        throw error;
    }
};

export const eliminarDireccion = async (direccionId) => {
    try {
        const response = await api.delete(`${DIRECCIONES_ENDPOINT}/${direccionId}`);
        return response.data;
    } catch (error) {
        console.error("Error en eliminarDireccion:", error);
        throw error;
    }
};

export const establecerDireccionPrincipal = async (direccionId) => {
    try {
        const response = await api.patch(`${DIRECCIONES_ENDPOINT}/${direccionId}/principal`);
        return response.data;
    } catch (error) {
        console.error("Error en establecerDireccionPrincipal:", error);
        throw error;
    }
}; 