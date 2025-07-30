import { useState } from 'react';
import { createProducto } from '@services/producto.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';
import { 
    validatePrice, 
    validateStock, 
    validateDiscount, 
    validateSKU, 
    validateCategory,
    validateBrand,
    validateDescription,
    validateProductName,
    validateImage
} from '@helpers/validation.helper';

const useCreateProducto = (onSuccess) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = (formData) => {
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

        const imagenError = validateImage(formData.get('imagen'));
        if (imagenError) newErrors.imagen = imagenError;

        const stockError = validateStock(formData.get('stock'));
        if (stockError) newErrors.stock = stockError;

        const marcaError = validateBrand(formData.get('marca'));
        if (marcaError) newErrors.marca = marcaError;

        // Solo validar SKU si tiene al menos 3 caracteres
        const skuValue = formData.get('codigoSKU');
        if (!skuValue || skuValue.trim() === '') {
            newErrors.codigoSKU = 'El código SKU es requerido';
        }
        // Comentar temporalmente la validación de "solo letras" para debug
        // if (skuValue && skuValue.trim().length >= 3) {
        //     const skuError = validateSKU(skuValue);
        //     if (skuError) newErrors.codigoSKU = skuError;
        // }

        const descuentoError = validateDiscount(formData.get('descuento'));
        if (descuentoError) newErrors.descuento = descuentoError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async (formData) => {
        try {
            setLoading(true);
            setErrors({});

            if (!validateForm(formData)) {
                showErrorAlert('Errores de validación', 'Por favor corrige los errores marcados en el formulario.');
                return;
            }

            const nuevoProducto = await createProducto(formData);
            
            showSuccessAlert(
                '¡Producto creado exitosamente!', 
                `${nuevoProducto.nombre} ha sido agregado al catálogo.`
            );
            
            if (onSuccess) {
                onSuccess(nuevoProducto);
            }
        } catch (error) {
            console.error("Error al crear producto:", error);
            
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
                    'No tienes permisos para crear productos.'
                );
            } else {
                showErrorAlert(
                    'Error al crear producto', 
                    error.response?.data?.mensaje || 
                    'No se pudo crear el producto. Verifica tu conexión e intenta nuevamente.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const clearErrors = () => setErrors({});

    return { 
        handleCreate, 
        loading, 
        errors, 
        clearErrors,
        setErrors 
    };
};

export default useCreateProducto;
