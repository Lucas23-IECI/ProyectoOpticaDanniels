import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

export const getProductos = async (filtros = {}) => {
    try {
        const response = await axios.get(`${API_URL}/productos`, { params: filtros });
        return response.data.productos || [];
    } catch (error) {
        console.error("Error en getProductos:", error);
        throw error;
    }
};

export const createProducto = async (producto) => {
    try {
        const response = await axios.post(`${API_URL}/productos`, producto);
        return response.data.producto;
    } catch (error) {
        console.error("Error en createProducto:", error);
        throw error;
    }
};

