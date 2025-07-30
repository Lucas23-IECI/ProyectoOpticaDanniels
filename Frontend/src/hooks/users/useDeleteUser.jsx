import { useState } from 'react';
import { deleteUser } from '@services/user.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';

const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDeleteUser = async (query) => {
        try {
            setLoading(true);
            setError(null);

            await deleteUser(query);
            
            showSuccessAlert('¡Éxito!', 'Usuario eliminado correctamente');
            return { success: true };
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            const errorMessage = err.response?.data?.message || 'Error al eliminar el usuario';
            setError(errorMessage);
            
            showErrorAlert('Error', errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDeleteUser,
        loading,
        error
    };
};

export default useDeleteUser;