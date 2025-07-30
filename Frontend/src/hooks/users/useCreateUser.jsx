import { useState } from 'react';
import { createUser } from '@services/user.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';

const useCreateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const newUser = await createUser(userData);
            
            showSuccessAlert('¡Éxito!', 'Usuario creado correctamente');
            return { success: true, data: newUser };
        } catch (err) {
            console.error('Error al crear usuario:', err);
            const errorMessage = err.response?.data?.message || 'Error al crear el usuario';
            setError(errorMessage);
            
            // Si el error tiene información específica del campo
            if (err.response?.data?.dataInfo) {
                showErrorAlert('Error de validación', errorMessage);
                return { 
                    success: false, 
                    error: errorMessage,
                    field: err.response.data.dataInfo 
                };
            }
            
            showErrorAlert('Error', errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        handleCreateUser,
        loading,
        error
    };
};

export default useCreateUser;