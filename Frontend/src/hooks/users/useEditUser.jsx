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

            console.log('Datos a enviar:', userData);
            console.log('Query params:', query);
            
            const updatedUser = await updateUser(userData, query);
            
            showSuccessAlert('¡Éxito!', 'Usuario actualizado correctamente');
            return { success: true, data: updatedUser };
        } catch (err) {
            console.error('Error al actualizar usuario:', err);
            console.error('Respuesta del servidor:', err.response?.data);
            
            let errorMessage = 'Error al actualizar el usuario';
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
        handleEditUser,
        loading,
        error
    };
};

export default useEditUser;