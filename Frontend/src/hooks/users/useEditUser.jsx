import { useState } from 'react';
import { updateUser } from '@services/user.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';

const useEditUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEditUser = async (userData, query) => {
        try {
            setLoading(true);
            setError(null);

            const updatedUser = await updateUser(userData, query);
            
            showSuccessAlert('¡Éxito!', 'Usuario actualizado correctamente');
            return { success: true, data: updatedUser };
        } catch (err) {
            console.error('Error al actualizar usuario:', err);
            const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario';
            const field = err.response?.data?.field || null;
            setError(errorMessage);
            
            // Solo mostrar alerta si no es un error específico de campo
            if (!field) {
                showErrorAlert('Error', errorMessage);
            }
            
            return { success: false, error: errorMessage, field };
        } finally {
            setLoading(false);
        }
    };

    return {
        handleEditUser,
        loading,
        error
    };
};

export default useEditUser;