import api from "./root.service";

const PRODUCTOS_ENDPOINT = "/productos";

export const getProductos = async (filtros = {}) => {
    try {
        const filtrosLimpios = Object.entries(filtros).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const response = await api.get(PRODUCTOS_ENDPOINT, { params: filtrosLimpios });
        
        if (response.data.productos && response.data.total !== undefined) {
            return {
                data: response.data.productos,
                total: response.data.total,
                page: response.data.page,
                totalPages: response.data.totalPages
            };
        }

        return response.data.productos || [];
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { data: [], total: 0, page: 1, totalPages: 0 };
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

        const response = await api.get(PRODUCTOS_ENDPOINT, { params: filtrosLimpios });

        if (response.data.productos && response.data.total !== undefined) {
            return {
                productos: response.data.productos,
                total: response.data.total,
                page: response.data.page,
                totalPages: response.data.totalPages,
                hasMore: response.data.hasMore
            };
        }

        const productos = response.data.productos || response.data || [];
        return {
            productos: productos,
            total: productos.length,
            page: 1,
            totalPages: 1,
            hasMore: false
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
        return response.data.producto;
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
        return response.data.producto;
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
        
        return response.data.producto;
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
        return response.data.producto;
    } catch (error) {
        console.error("Error en updateProductoImagen:", error);
        throw error;
    }
};

export const deleteProducto = async (id) => {
    try {
        const response = await api.delete(`${PRODUCTOS_ENDPOINT}/${id}`);
        return response.data;
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
        return response.data.productos || [];
    } catch (error) {
        console.error("Error en buscarProductosRapido:", error);
        return [];
    }
};

