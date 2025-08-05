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

            console.log('Datos a enviar:', userData);
            const newUser = await createUser(userData);
            
            showSuccessAlert('¡Éxito!', 'Usuario creado correctamente');
            return { success: true, data: newUser };
        } catch (err) {
            console.error('Error al crear usuario:', err);
            console.error('Respuesta del servidor:', err.response?.data);
            
            let errorMessage = 'Error al crear el usuario';
            let field = null;
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            // Si el error tiene información específica del campo
            if (err.response?.data?.dataInfo) {
                field = err.response.data.dataInfo;
                showErrorAlert('Error de validación', errorMessage);
                return { 
                    success: false, 
                    error: errorMessage,
                    field: field 
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