import { useState } from 'react';
import { createProducto } from '@services/producto.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useCreateProducto = (onSuccess) => {
    const [loading, setLoading] = useState(false);

    const handleCreate = async (data) => {
        try {
            setLoading(true);
            const nuevo = await createProducto(data);
            showSuccessAlert('¡Creado!', 'El producto fue registrado exitosamente.');
            if (onSuccess) onSuccess(nuevo);
        } catch (error) {
            console.error("Error al crear producto:", error);
            showErrorAlert('Error', error.response?.data?.mensaje || 'No se pudo crear el producto.');
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading };
};

export default useCreateProducto;
