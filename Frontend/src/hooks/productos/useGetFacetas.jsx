import { useState, useCallback } from 'react';
import { getFacetas } from '@services/producto.service';

const useGetFacetas = () => {
    const [facetas, setFacetas] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchFacetas = useCallback(async (filtros = {}) => {
        try {
            setLoading(true);
            const data = await getFacetas(filtros);
            setFacetas(data);
            return data;
        } catch (err) {
            console.error('Error al obtener facetas:', err);
            setFacetas({});
            return {};
        } finally {
            setLoading(false);
        }
    }, []);

    return { facetas, loading, fetchFacetas };
};

export default useGetFacetas;
