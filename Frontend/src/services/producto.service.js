import api from "./root.service";
import cacheService from "./cache.service";

const PRODUCTOS_ENDPOINT = "/productos";

export const getProductos = async (filtros = {}) => {
    try {
        const filtrosLimpios = Object.entries(filtros).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const cacheKey = `productos_${JSON.stringify(filtrosLimpios)}`;

        const cached = cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }

        const response = await api.get(PRODUCTOS_ENDPOINT, { params: filtrosLimpios });

        const apiData = response.data.data || response.data || {};
        const productos = Array.isArray(apiData.productos) ? apiData.productos : [];
        const paginacion = apiData.paginacion || null;

        const result = { productos, paginacion };
        cacheService.set(cacheKey, result, 3 * 60 * 1000);

        return result;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { productos: [], paginacion: null };
        }
        console.error("Error en getProductos:", error);
        throw error;
    }
};

export const getAllProductos = async (queryParams = {}) => {
    try {
        const filtrosLimpios = Object.entries(queryParams).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const cacheKey = `all_productos_${JSON.stringify(filtrosLimpios)}`;

        const cached = cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }

        const response = await api.get(PRODUCTOS_ENDPOINT, { params: filtrosLimpios });

        const apiData = response.data.data || response.data || {};
        const productos = Array.isArray(apiData.productos) ? apiData.productos : [];
        const paginacion = apiData.paginacion || {};

        return {
            productos,
            total: paginacion.total || productos.length,
            page: paginacion.pagina || 1,
            totalPages: paginacion.paginas || 1,
            hasMore: (paginacion.pagina || 1) < (paginacion.paginas || 1)
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { productos: [], total: 0, page: 1, totalPages: 0, hasMore: false };
        }
        console.error("Error en getAllProductos:", error);
        throw error;
    }
};

export const getProductoById = async (id) => {
    try {
        const response = await api.get(`${PRODUCTOS_ENDPOINT}/${id}`);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error en getProductoById:", error);
        throw error;
    }
};

export const createProducto = async (formData) => {
    try {
        const response = await api.post(PRODUCTOS_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error en createProducto:", error);
        throw error;
    }
};

export const updateProducto = async (id, data) => {
    try {
        let response;

        if (data instanceof FormData) {
            response = await api.put(`${PRODUCTOS_ENDPOINT}/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            response = await api.put(`${PRODUCTOS_ENDPOINT}/${id}`, data);
        }

        return response.data.data || response.data;
    } catch (error) {
        console.error("Error en updateProducto:", error);
        throw error;
    }
};

export const updateProductoImagen = async (id, formData) => {
    try {
        const response = await api.put(`${PRODUCTOS_ENDPOINT}/${id}/imagen`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error en updateProductoImagen:", error);
        throw error;
    }
};

export const deleteProducto = async (id) => {
    try {
        const response = await api.delete(`${PRODUCTOS_ENDPOINT}/${id}`);

        cacheService.clear();

        return response.data.data || response.data;
    } catch (error) {
        console.error("Error en deleteProducto:", error);
        throw error;
    }
};

export const buscarProductosRapido = async (query, options = {}) => {
    try {
        const params = {
            nombre: query,
            limit: options.limit || 10
        };
        const response = await api.get(PRODUCTOS_ENDPOINT, { params });
        const apiData = response.data.data || response.data || {};
        return Array.isArray(apiData.productos) ? apiData.productos : [];
    } catch (error) {
        console.error("Error en buscarProductosRapido:", error);
        return [];
    }
};

export const obtenerSugerenciasBusqueda = async (termino) => {
    try {
        const response = await api.get(`${PRODUCTOS_ENDPOINT}/sugerencias`, {
            params: { termino }
        });

        const sugData = response.data.data || response.data || {};
        return sugData.sugerencias || [];
    } catch (error) {
        console.error('Error obteniendo sugerencias:', error);
        return [];
    }
};

export const getProductosStockBajo = async (umbral = 10) => {
    try {
        const response = await api.get(`${PRODUCTOS_ENDPOINT}/stock-bajo`, {
            params: { umbral }
        });
        return response.data.data || { productos: [], total: 0, umbral };
    } catch (error) {
        console.error('Error obteniendo stock bajo:', error);
        return { productos: [], total: 0, umbral };
    }
};

export const enviarAlertaStock = async (umbral = 10) => {
    try {
        const response = await api.post(`${PRODUCTOS_ENDPOINT}/stock-bajo/alerta`, null, {
            params: { umbral }
        });
        return response.data.data || { enviado: false };
    } catch (error) {
        console.error('Error enviando alerta stock:', error);
        throw error;
    }
};

export const getFacetas = async (filtros = {}) => {
    try {
        const filtrosLimpios = Object.entries(filtros).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const cacheKey = `facetas_${JSON.stringify(filtrosLimpios)}`;
        const cached = cacheService.get(cacheKey);
        if (cached) return cached;

        const response = await api.get(`${PRODUCTOS_ENDPOINT}/facetas`, { params: filtrosLimpios });
        const data = response.data.data || response.data || {};

        cacheService.set(cacheKey, data, 2 * 60 * 1000);
        return data;
    } catch (error) {
        console.error("Error en getFacetas:", error);
        return {};
    }
};

// ── Multi-image endpoints ──

export const getImagenesProducto = async (productoId) => {
    try {
        const response = await api.get(`${PRODUCTOS_ENDPOINT}/${productoId}/imagenes`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error en getImagenesProducto:", error);
        return [];
    }
};

export const agregarImagenesProducto = async (productoId, archivos) => {
    const formData = new FormData();
    archivos.forEach((file) => formData.append("imagenes", file));
    const response = await api.post(`${PRODUCTOS_ENDPOINT}/${productoId}/imagenes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data || [];
};

export const eliminarImagenProducto = async (imagenId) => {
    const response = await api.delete(`${PRODUCTOS_ENDPOINT}/imagenes/${imagenId}`);
    return response.data.data;
};

export const reordenarImagenesProducto = async (productoId, ordenIds) => {
    const response = await api.put(`${PRODUCTOS_ENDPOINT}/${productoId}/imagenes/reordenar`, { ordenIds });
    return response.data.data || [];
};

export const establecerImagenPrincipal = async (imagenId) => {
    const response = await api.put(`${PRODUCTOS_ENDPOINT}/imagenes/${imagenId}/principal`);
    return response.data.data;
};



