import { useState } from 'react';
import { getProductos } from '@services/producto.service';

const useGetProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProductos = async (filtros = {}) => {
        try {
            setLoading(true);
            const data = await getProductos(filtros);
            setProductos(data);
            setError('');
        } catch (err) {
            console.error('Error al obtener productos:', err);
            setError('Error al obtener productos');
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    return { productos, loading, error, fetchProductos };
};

export default useGetProductos;
