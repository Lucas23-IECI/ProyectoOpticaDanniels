import { useState, useCallback } from 'react';
import { getProductos } from '@services/producto.service';

const useGetProductos = () => {
    const [productos, setProductos] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProductos = useCallback(async (filtros = {}) => {
        try {
            setLoading(true);
            const result = await getProductos(filtros);
            const productosData = result?.productos || result || [];
            const paginacionData = result?.paginacion || null;
            setProductos(Array.isArray(productosData) ? productosData : []);
            setPaginacion(paginacionData);
            setError('');
            return productosData;
        } catch (err) {
            console.error('Error al obtener productos:', err);
            setError('Error al obtener productos');
            setProductos([]);
            setPaginacion(null);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);
    
    return { productos, paginacion, loading, error, fetchProductos };
};

export default useGetProductos;
