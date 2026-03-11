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

export async function exportarReporte(tipo, formato) {
    const response = await axios.get('/reportes/exportar', {
        params: { tipo, formato },
        responseType: 'blob',
    });

    const extensions = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };
    const filename = `reporte-${tipo}.${extensions[formato] || formato}`;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}