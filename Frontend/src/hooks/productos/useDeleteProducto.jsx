import { useState } from 'react';
import { deleteProducto } from '@services/producto.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteProducto = (onSuccess) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (productoId, nombreProducto) => {
        try {
            setLoading(true);

            await deleteProducto(productoId);
            
            showSuccessAlert(
                '¡Producto eliminado!', 
                `${nombreProducto} ha sido eliminado exitosamente.`
            );
            
            if (onSuccess) {
                onSuccess(productoId);
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            
            if (error.response?.status === 404) {
                showErrorAlert(
                    'Producto no encontrado', 
                    'El producto que intentas eliminar no existe.'
                );
            } else if (error.response?.status === 401) {
                showErrorAlert(
                    'Sesión expirada', 
                    'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
                );
            } else if (error.response?.status === 403) {
                showErrorAlert(
                    'Acceso denegado', 
                    'No tienes permisos para eliminar productos.'
                );
            } else if (error.response?.status === 409) {
                showErrorAlert(
                    'No se puede eliminar', 
                    'Este producto no se puede eliminar porque tiene pedidos asociados.'
                );
            } else {
                showErrorAlert(
                    'Error al eliminar producto', 
                    error.response?.data?.mensaje || 
                    'No se pudo eliminar el producto. Verifica tu conexión e intenta nuevamente.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return { 
        handleDelete, 
        loading 
    };
};

export default useDeleteProducto;
