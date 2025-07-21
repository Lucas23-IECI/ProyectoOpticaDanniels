import { useState, useCallback } from 'react';
import { 
    obtenerDirecciones, 
    crearDireccion, 
    actualizarDireccion, 
    eliminarDireccion, 
    establecerDireccionPrincipal 
} from '../../services/direccion.service.js';

const useDirecciones = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDirecciones = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await obtenerDirecciones();
            setDirecciones(response.data || []);
            return response.data || [];
        } catch (err) {
            console.error('Error al obtener direcciones:', err);
            setError('Error al obtener direcciones');
            setDirecciones([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createDireccion = useCallback(async (direccionData) => {
        try {
            setLoading(true);
            setError('');
            const response = await crearDireccion(direccionData);
            // Refrescar lista después de crear
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('Error al crear dirección:', err);
            // No guardar el error en el estado global, solo lanzarlo
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDirecciones]);

    const updateDireccion = useCallback(async (direccionId, direccionData) => {
        try {
            setLoading(true);
            setError('');
            const response = await actualizarDireccion(direccionId, direccionData);
            // Refrescar lista después de actualizar
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('Error al actualizar dirección:', err);
            // No guardar el error en el estado global, solo lanzarlo
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDirecciones]);

    const deleteDireccion = useCallback(async (direccionId) => {
        try {
            setLoading(true);
            setError('');
            await eliminarDireccion(direccionId);
            // Refrescar lista después de eliminar
            await fetchDirecciones();
            return true;
        } catch (err) {
            console.error('Error al eliminar dirección:', err);
            // No guardar el error en el estado global, solo lanzarlo
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDirecciones]);

    const setPrincipal = useCallback(async (direccionId) => {
        try {
            setLoading(true);
            setError('');
            const response = await establecerDireccionPrincipal(direccionId);
            // Refrescar lista después de establecer principal
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('Error al establecer dirección principal:', err);
            // No guardar el error en el estado global, solo lanzarlo
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDirecciones]);

    return {
        direcciones,
        loading,
        error,
        fetchDirecciones,
        createDireccion,
        updateDireccion,
        deleteDireccion,
        setPrincipal
    };
};

export default useDirecciones;
