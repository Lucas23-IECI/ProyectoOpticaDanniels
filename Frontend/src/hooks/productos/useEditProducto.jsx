import { useState } from 'react';
import { updateProducto, updateProductoImagen } from '@services/producto.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';
import { 
    validatePrice, 
    validateStock, 
    validateDiscount, 
    validateSKU, 
    validateCategory,
    validateBrand,
    validateDescription,
    validateProductName
} from '@helpers/validation.helper';

const useEditProducto = (onSuccess) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = (formData, isImageOnly = false) => {
        if (isImageOnly) return true;

        const newErrors = {};
        
        const nombreError = validateProductName(formData.get('nombre'));
        if (nombreError) newErrors.nombre = nombreError;

        const descripcionError = validateDescription(formData.get('descripcion'));
        if (descripcionError) newErrors.descripcion = descripcionError;

        const precioValue = formData.get('precio')?.replace(/\D/g, '') || '';
        const precioError = validatePrice(precioValue);
        if (precioError) newErrors.precio = precioError;

        const categoriaError = validateCategory(formData.get('categoria'));
        if (categoriaError) newErrors.categoria = categoriaError;

        const stockError = validateStock(formData.get('stock'));
        if (stockError) newErrors.stock = stockError;

        const marcaError = validateBrand(formData.get('marca'));
        if (marcaError) newErrors.marca = marcaError;

        const skuError = validateSKU(formData.get('codigoSKU'));
        if (skuError) newErrors.codigoSKU = skuError;

        const descuentoError = validateDiscount(formData.get('descuento'));
        if (descuentoError) newErrors.descuento = descuentoError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = async (productoId, formData, isImageOnly = false) => {
        try {
            setLoading(true);
            setErrors({});

            if (!validateForm(formData, isImageOnly)) {
                showErrorAlert('Errores de validación', 'Por favor corrige los errores marcados en el formulario.');
                return;
            }

            let productoActualizado;
            
            if (isImageOnly) {
                productoActualizado = await updateProductoImagen(productoId, formData);
                showSuccessAlert(
                    '¡Imagen actualizada!', 
                    'La imagen del producto ha sido actualizada exitosamente.'
                );
            } else {
                productoActualizado = await updateProducto(productoId, formData);
                showSuccessAlert(
                    '¡Producto actualizado!', 
                    `${productoActualizado.nombre} ha sido actualizado exitosamente.`
                );
            }
            
            if (onSuccess) {
                onSuccess(productoActualizado);
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            
            if (error.response?.status === 400) {
                const responseData = error.response.data;
                
                if (responseData.errores) {
                    const serverErrors = {};
                    responseData.errores.forEach(err => {
                        serverErrors[err.campo] = err.mensaje;
                    });
                    setErrors(serverErrors);
                } else if (responseData.details) {
                    setErrors(responseData.details);
                }
                
                showErrorAlert(
                    'Error de validación', 
                    responseData.mensaje || 'Por favor verifica los datos ingresados.'
                );
            } else if (error.response?.status === 404) {
                showErrorAlert(
                    'Producto no encontrado', 
                    'El producto que intentas editar no existe.'
                );
            } else if (error.response?.status === 409) {
                setErrors({ codigoSKU: 'Este código SKU ya está en uso' });
                showErrorAlert(
                    'Código SKU duplicado', 
                    'Ya existe un producto con este código SKU. Por favor usa uno diferente.'
                );
            } else if (error.response?.status === 413) {
                setErrors({ imagen: 'La imagen es demasiado grande' });
                showErrorAlert(
                    'Archivo muy grande', 
                    'La imagen es demasiado grande. El tamaño máximo permitido es 5MB.'
                );
            } else if (error.response?.status === 401) {
                showErrorAlert(
                    'Sesión expirada', 
                    'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
                );
            } else if (error.response?.status === 403) {
                showErrorAlert(
                    'Acceso denegado', 
                    'No tienes permisos para editar productos.'
                );
            } else {
                showErrorAlert(
                    'Error al actualizar producto', 
                    error.response?.data?.mensaje || 
                    'No se pudo actualizar el producto. Verifica tu conexión e intenta nuevamente.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const clearErrors = () => setErrors({});

    return { 
        handleEdit, 
        loading, 
        errors, 
        clearErrors,
        setErrors 
    };
};

export default useEditProducto;
