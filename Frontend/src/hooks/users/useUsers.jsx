import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '@services/user.service';
import { showErrorAlert } from '@helpers/sweetAlert';

const useUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await getUsers();
            setUsuarios(data || []);
        } catch (err) {
            console.error('Error al obtener usuarios:', err);
            setError(err.response?.data?.message || 'Error al cargar usuarios');
            showErrorAlert('Error', 'No se pudieron cargar los usuarios');
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const refetchUsuarios = useCallback(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    return {
        usuarios,
        loading,
        error,
        refetchUsuarios,
        fetchUsuarios
    };
};

export default useUsers;