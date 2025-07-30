import axios from './root.service.js';

export async function getEstadisticasGenerales() {
    const response = await axios.get('/reportes/generales');
    return response.data.data;
}

export async function getEstadisticasUsuarios() {
    const response = await axios.get('/reportes/usuarios');
    return response.data.data;
}

export async function getEstadisticasProductos() {
    const response = await axios.get('/reportes/productos');
    return response.data.data;
}