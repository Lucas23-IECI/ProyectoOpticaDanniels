import { useState, useCallback } from 'react';
import { getProductos } from '@services/producto.service';

const useGetProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProductos = useCallback(async (filtros = {}) => {
        try {
            setLoading(true);
            if (import.meta.env.DEV) {
                console.log('🔄 Cargando productos con filtros:', filtros);
            }
            const productosData = await getProductos(filtros);
            setProductos(productosData);
            setError('');
            return productosData;
        } catch (err) {
            console.error('Error al obtener productos:', err);
            setError('Error al obtener productos');
            setProductos([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);
    
    return { productos, loading, error, fetchProductos };
};

export default useGetProductos;
