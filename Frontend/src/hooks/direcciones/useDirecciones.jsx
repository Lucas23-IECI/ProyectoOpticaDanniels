import { useState, useCallback } from 'react';
import { 
    obtenerDirecciones, 
    crearDireccion, 
    actualizarDireccion, 
    eliminarDireccion, 
    establecerDireccionPrincipal 
} from '@services/direccion.service';

const useDirecciones = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDirecciones = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 useDirecciones: Fetching direcciones...');
            const response = await obtenerDirecciones();
            console.log('✅ useDirecciones: Response received:', response);
            setDirecciones(response.data || []);
            return response.data || [];
        } catch (err) {
            console.error('❌ useDirecciones: Error al obtener direcciones:', err);
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
            console.log('🔄 useDirecciones: Creating direccion with data:', direccionData);
            const response = await crearDireccion(direccionData);
            console.log('✅ useDirecciones: Direccion created successfully:', response);
            // Refrescar lista después de crear
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('❌ useDirecciones: Error al crear dirección:', err);
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
            console.log('🔄 useDirecciones: Updating direccion with id:', direccionId, 'data:', direccionData);
            const response = await actualizarDireccion(direccionId, direccionData);
            console.log('✅ useDirecciones: Direccion updated successfully:', response);
            // Refrescar lista después de actualizar
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('❌ useDirecciones: Error al actualizar dirección:', err);
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
            console.log('🔄 useDirecciones: Deleting direccion with id:', direccionId);
            const response = await eliminarDireccion(direccionId);
            console.log('✅ useDirecciones: Direccion deleted successfully:', response);
            // Refrescar lista después de eliminar
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('❌ useDirecciones: Error al eliminar dirección:', err);
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
            console.log('🔄 useDirecciones: Setting principal direccion with id:', direccionId);
            const response = await establecerDireccionPrincipal(direccionId);
            console.log('✅ useDirecciones: Principal direccion set successfully:', response);
            // Refrescar lista después de cambiar principal
            await fetchDirecciones();
            return response.data;
        } catch (err) {
            console.error('❌ useDirecciones: Error al establecer dirección principal:', err);
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