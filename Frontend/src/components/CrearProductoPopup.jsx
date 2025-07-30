import { useState, useRef, useEffect } from 'react';
import useCreateProducto from '@hooks/productos/useCreateProducto';
import { FaTimes, FaUpload, FaImage, FaSpinner } from 'react-icons/fa';
import DropdownCategorias from './DropdownCategorias';
import '@styles/crearProducto.css';

const CrearProductoPopup = ({ show, setShow, onProductoCreated }) => {
    const { handleCreate, loading, errors, clearErrors, setErrors } = useCreateProducto((nuevoProducto) => {
        setShow(false);
        resetForm();
        if (onProductoCreated) onProductoCreated(nuevoProducto);
    });

    useEffect(() => {
        if (show) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [show]);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        subcategoria: '',
        stock: '',
        marca: '',
        codigoSKU: '',
        activo: true,
        oferta: false,
        descuento: ''
    });

    const [imagen, setImagen] = useState(null);
    const [previewImagen, setPreviewImagen] = useState(null);
    const [alert, setAlert] = useState(null);
    const fileInputRef = useRef(null);

    const showAlert = (message) => {
        setAlert(message);
        setTimeout(() => setAlert(null), 2000);
    };

    const isFormValid = () => {
        return (
            formData.nombre.trim().length >= 3 &&
            formData.descripcion.trim().length >= 10 &&
            formData.precio.length > 0 &&
            formData.categoria !== '' &&
            formData.subcategoria !== '' &&
            formData.stock !== '' &&
            formData.marca.trim().length >= 2 &&
            formData.codigoSKU.trim().length >= 3 &&
            imagen !== null
        );
    };

    const formatPrice = (value) => {
        if (!value) return '';
        const number = value.toString().replace(/\D/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (e) => {
        const inputValue = e.target.value;
        
        // Permitir solo números y puntos
        if (/[^0-9.]/.test(inputValue) && inputValue !== '') {
            showAlert('El precio solo puede contener números y puntos como separadores');
            return;
        }
        
        // No permitir múltiples puntos consecutivos
        if (/\.{2,}/.test(inputValue)) {
            showAlert('El precio no puede tener múltiples puntos consecutivos');
            return;
        }
        
        // No permitir que comience con punto
        if (/^\./.test(inputValue)) {
            showAlert('El precio no puede comenzar con un punto');
            return;
        }
        
        // Si está vacío, permitir
        if (inputValue === '') {
            setFormData(prev => ({
                ...prev,
                precio: ''
            }));
            return;
        }
        
        // Extraer solo números para validaciones
        const rawValue = inputValue.replace(/\D/g, '');
        
        // Validar longitud máxima
        if (rawValue.length > 8) {
            showAlert('El precio no puede exceder $10.000.000');
            return;
        }
        
        // Validar que sea mayor a 0
        const actualPrice = parseInt(rawValue);
        if (rawValue && actualPrice <= 0) {
            showAlert('El precio debe ser mayor a 0');
            return;
        }
        
        // Validar límite máximo
        if (rawValue && actualPrice > 10000000) {
            showAlert('El precio no puede exceder $10.000.000');
            return;
        }
        
        // Formatear automáticamente solo si hay números
        if (rawValue) {
            const formattedValue = formatPrice(rawValue);
            setFormData(prev => ({
                ...prev,
                precio: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                precio: inputValue
            }));
        }

        if (errors.precio) {
            setErrors(prev => ({
                ...prev,
                precio: null
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            categoria: '',
            subcategoria: '',
            stock: '',
            marca: '',
            codigoSKU: '',
            activo: true,
            oferta: false,
            descuento: ''
        });
        setImagen(null);
        setPreviewImagen(null);
        clearErrors();
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;
        
        if (name === 'nombre') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, nombre: '' }));
                return;
            }
            
            // 1. No más de 3 números juntos
            if (/\d{4,}/.test(value)) {
                showAlert('El nombre no puede tener más de 3 números juntos');
                return;
            }
            
            // 2. No más de 2 guiones juntos ni más de 2 guiones en total
            if (/-{3,}/.test(value)) {
                showAlert('El nombre no puede tener más de 2 guiones juntos');
                return;
            }
            if ((value.match(/-/g) || []).length > 2) {
                showAlert('El nombre no puede tener más de 2 guiones en total');
                return;
            }
            
            // 2.1. No más de 2 puntos juntos ni más de 2 puntos en total
            if (/\.{3,}/.test(value)) {
                showAlert('El nombre no puede tener más de 2 puntos juntos');
                return;
            }
            if ((value.match(/\./g) || []).length > 2) {
                showAlert('El nombre no puede tener más de 2 puntos en total');
                return;
            }
            
            // 3. Validación estricta de caracteres especiales
            // Solo permitir letras, números, espacios, guiones y puntos
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/.test(value)) {
                showAlert('El nombre solo puede contener letras, números, espacios, guiones (-) y puntos (.)');
                return;
            }
            
            // 4. No más de 3 caracteres repetidos seguidos
            if (/(.)\1{2,}/.test(value)) {
                showAlert('El nombre no puede tener más de 3 caracteres repetidos seguidos');
                return;
            }
            
            // Validaciones adicionales
            if (value.length > 100) {
                showAlert('El nombre no puede exceder 100 caracteres');
                return;
            }
            if (value.trim() === '' && value.length > 0) {
                showAlert('El nombre no puede ser solo espacios en blanco');
                return;
            }
            if (/^\d/.test(value)) {
                showAlert('El nombre no puede comenzar con números');
                return;
            }
            if (/^\s/.test(value)) {
                showAlert('El nombre no puede comenzar con espacios');
                return;
            }
            if (/\s{2,}/.test(value)) {
                showAlert('El nombre no puede tener más de 1 espacio juntos');
                return;
            }
            if ((value.match(/\s/g) || []).length > 2) {
                showAlert('El nombre no puede tener más de 2 espacios en total');
                return;
            }
        }
        
        if (name === 'descripcion') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, descripcion: '' }));
                return;
            }
            
            // 1. No más de 4 números juntos (para permitir años)
            if (/\d{5,}/.test(value)) {
                showAlert('La descripción no puede tener más de 4 números juntos');
                return;
            }
            
            // 2. No más de 2 guiones juntos ni más de 2 guiones en total
            if (/-{3,}/.test(value)) {
                showAlert('La descripción no puede tener más de 2 guiones juntos');
                return;
            }
            if ((value.match(/-/g) || []).length > 2) {
                showAlert('La descripción no puede tener más de 2 guiones en total');
                return;
            }
            
            // 2.1. No más de 2 puntos juntos ni más de 2 puntos en total
            if (/\.{3,}/.test(value)) {
                showAlert('La descripción no puede tener más de 2 puntos juntos');
                return;
            }
            if ((value.match(/\./g) || []).length > 2) {
                showAlert('La descripción no puede tener más de 2 puntos en total');
                return;
            }
            
            // 3. Permitir caracteres especiales en descripción (más flexible)
            // Solo permitir letras, números, espacios, guiones, puntos y caracteres especiales comunes
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.\,\;\:\!\?\"\'\(\)\[\]\{\}\/\+\=\*\&\^\%\$\#\@]+$/.test(value)) {
                showAlert('La descripción contiene caracteres no permitidos');
                return;
            }
            
            // 4. No más de 3 caracteres repetidos seguidos
            if (/(.)\1{2,}/.test(value)) {
                showAlert('La descripción no puede tener más de 3 caracteres repetidos seguidos');
                return;
            }
            
            // Validaciones adicionales
            if (value.length > 1000) {
                showAlert('La descripción no puede exceder 1000 caracteres');
                return;
            }
            if (value.trim() === '' && value.length > 0) {
                showAlert('La descripción no puede ser solo espacios en blanco');
                return;
            }
            if (/^\s/.test(value)) {
                showAlert('La descripción no puede comenzar con espacios');
                return;
            }
            if (/\s{2,}/.test(value)) {
                showAlert('La descripción no puede tener más de 1 espacio juntos');
                return;
            }
        }
        
        if (name === 'stock') {
            // Solo permitir números - si hay cualquier carácter no numérico, no actualizar
            if (!/^\d*$/.test(value)) {
                showAlert('El stock solo puede contener números');
                return; // Esto previene que se actualice el estado
            }
            
            if (value !== '') {
                const numValue = parseInt(value);
                if (isNaN(numValue) || numValue < 0) {
                    showAlert('El stock no puede ser negativo');
                    return;
                }
                if (numValue > 99999) {
                    showAlert('El stock no puede exceder 99,999 unidades');
                    return;
                }
            }
        }
        
        if (name === 'descuento') {
            // Solo permitir números - si hay cualquier carácter no numérico, no actualizar
            if (!/^\d*$/.test(value)) {
                showAlert('El descuento solo puede contener números');
                return; // Esto previene que se actualice el estado
            }
            
            if (value !== '') {
                const numValue = parseInt(value);
                if (isNaN(numValue) || numValue < 0) {
                    showAlert('El descuento no puede ser negativo');
                    return;
                }
                if (numValue > 100) {
                    showAlert('El descuento no puede exceder 100%');
                    return;
                }
            }
            
            // Si el valor está vacío, mantenerlo como string vacío
            newValue = value === '' ? '' : parseInt(value);
        }
        
        if (name === 'marca') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, marca: '' }));
                return;
            }
            
            // 1. No más de 3 números juntos
            if (/\d{4,}/.test(value)) {
                showAlert('La marca no puede tener más de 3 números juntos');
                return;
            }
            
            // 2. No más de 2 guiones juntos ni más de 2 guiones en total
            if (/-{3,}/.test(value)) {
                showAlert('La marca no puede tener más de 2 guiones juntos');
                return;
            }
            if ((value.match(/-/g) || []).length > 2) {
                showAlert('La marca no puede tener más de 2 guiones en total');
                return;
            }
            
            // 2.1. No más de 2 puntos juntos ni más de 2 puntos en total
            if (/\.{3,}/.test(value)) {
                showAlert('La marca no puede tener más de 2 puntos juntos');
                return;
            }
            if ((value.match(/\./g) || []).length > 2) {
                showAlert('La marca no puede tener más de 2 puntos en total');
                return;
            }
            
            // 3. Validación estricta de caracteres especiales
            // Solo permitir letras, números, espacios, guiones y puntos
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/.test(value)) {
                showAlert('La marca solo puede contener letras, números, espacios, guiones (-) y puntos (.)');
                return;
            }
            
            // 4. No más de 3 caracteres repetidos seguidos
            if (/(.)\1{2,}/.test(value)) {
                showAlert('La marca no puede tener más de 3 caracteres repetidos seguidos');
                return;
            }
            
            // Validaciones adicionales
            if (value.length > 50) {
                showAlert('La marca no puede exceder 50 caracteres');
                return;
            }
            if (value.trim() === '' && value.length > 0) {
                showAlert('La marca no puede ser solo espacios en blanco');
                return;
            }
            if (/^\d/.test(value)) {
                showAlert('La marca no puede comenzar con números');
                return;
            }
            if (/^\s/.test(value)) {
                showAlert('La marca no puede comenzar con espacios');
                return;
            }
            if (/\s{2,}/.test(value)) {
                showAlert('La marca no puede tener más de 1 espacio juntos');
                return;
            }
            if ((value.match(/\s/g) || []).length > 2) {
                showAlert('La marca no puede tener más de 2 espacios en total');
                return;
            }
        }
        
        if (name === 'codigoSKU') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, codigoSKU: '' }));
                return;
            }
            // No puede tener espacios
            if (value.includes(' ')) {
                showAlert('El SKU no puede contener espacios');
                return;
            }
            // Solo letras, números, guiones y guiones bajos
            if (/[^a-zA-Z0-9\-_]/.test(value)) {
                showAlert('El SKU solo puede contener letras, números, guiones y guiones bajos');
                return;
            }
            // No más de 1 guión seguido ni en total
            if (/-{2,}/.test(value)) {
                showAlert('El SKU no puede tener más de 1 guión seguido');
                return;
            }
            if ((value.match(/-/g) || []).length > 2) {
                showAlert('El SKU no puede tener más de 2 guiones en total');
                return;
            }
            // No más de 1 guión bajo seguido ni en total
            if (/_{2,}/.test(value)) {
                showAlert('El SKU no puede tener más de 1 guión bajo seguido');
                return;
            }
            if ((value.match(/_/g) || []).length > 2) {
                showAlert('El SKU no puede tener más de 2 guiones bajos en total');
                return;
            }
            // No más de 4 letras seguidas
            if (/[a-zA-Z]{5,}/.test(value)) {
                showAlert('El SKU no puede tener más de 4 letras seguidas');
                return;
            }
            // No más de 3 números juntos
            if (/\d{4,}/.test(value)) {
                showAlert('El SKU no puede tener más de 3 números juntos');
                return;
            }
            // No puede comenzar ni terminar con guión o guión bajo
            if (/^[-_]/.test(value) || /[-_]$/.test(value)) {
                showAlert('El SKU no puede comenzar ni terminar con guión o guión bajo');
                return;
            }
            // Longitud máxima 50 (quitar la mínima para permitir escribir)
            if (value.length > 50) {
                showAlert('El código SKU no puede exceder 50 caracteres');
                return;
            }
            // No solo números ni solo letras (solo si tiene al menos 5 caracteres)
            if (value.length >= 5) {
                if (/^\d+$/.test(value)) {
                    showAlert('El SKU no puede ser solo números');
                    return;
                }
                if (/^[a-zA-Z]+$/.test(value)) {
                    showAlert('El SKU no puede ser solo letras');
                    return;
                }
                // No solo caracteres repetidos
                if (/^(.)\1+$/.test(value)) {
                    showAlert('El SKU no puede ser solo caracteres repetidos');
                    return;
                }
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                showAlert('Solo se permiten imágenes JPG, PNG o WebP');
                e.target.value = '';
                setImagen(null);
                setPreviewImagen(null);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showAlert('La imagen no puede exceder 5MB');
                e.target.value = '';
                setImagen(null);
                setPreviewImagen(null);
                return;
            }
            
            const img = new Image();
            img.onload = function() {
                if (this.width < 200 || this.height < 200) {
                    showAlert('La imagen debe tener al menos 200x200 píxeles');
                    e.target.value = '';
                    setImagen(null);
                    setPreviewImagen(null);
                    return;
                }
                
                if (this.width > 4000 || this.height > 4000) {
                    showAlert('La imagen no puede exceder 4000x4000 píxeles');
                    e.target.value = '';
                    setImagen(null);
                    setPreviewImagen(null);
                    return;
                }
                
                setImagen(file);
                
                if (errors.imagen) {
                    setErrors(prev => ({ ...prev, imagen: null }));
                }
                
                const reader = new FileReader();
                reader.onload = (e) => setPreviewImagen(e.target.result);
                reader.readAsDataURL(file);
            };
            
            img.onerror = function() {
                showAlert('Archivo de imagen corrupto o no válido');
                e.target.value = '';
                setImagen(null);
                setPreviewImagen(null);
            };
            
            img.src = URL.createObjectURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.descripcion.trim().length < 10) {
            showAlert('La descripción debe tener al menos 10 caracteres');
            return;
        }
        
        if (formData.codigoSKU.trim().length < 3) {
            showAlert('El código SKU debe tener al menos 3 caracteres');
            return;
        }
        
        if (formData.nombre.trim().length < 3) {
            showAlert('El nombre debe tener al menos 3 caracteres');
            return;
        }
        
        if (formData.marca.trim().length < 2) {
            showAlert('La marca debe tener al menos 2 caracteres');
            return;
        }
        
        if (!imagen) {
            showAlert('Debes seleccionar una imagen para el producto');
            return;
        }
        
        const submitFormData = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (key === 'precio') {
                const rawPrice = formData[key].replace(/\D/g, '');
                submitFormData.append(key, rawPrice);
            } else if (key === 'descuento') {
                // Convertir descuento vacío a 0
                const descuentoValue = formData[key] === '' ? 0 : formData[key];
                submitFormData.append(key, descuentoValue);
            } else {
                submitFormData.append(key, formData[key]);
            }
        });
        
        if (imagen) {
            submitFormData.append('imagen', imagen);
        }

        handleCreate(submitFormData);
    };

    const handleClose = () => {
        setShow(false);
        resetForm();
    };

    if (!show) return null;

    return (
        <div className="crear-producto-overlay">
            <div className="crear-producto-modal">
                {alert && (
                    <div className="alert-notification">
                        <span>{alert}</span>
                    </div>
                )}
                
                <div className="crear-producto-header">
                    <h2>🆕 Crear Nuevo Producto</h2>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                        type="button"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="crear-producto-form">
                    <div className="form-grid">
                        <div className="form-section">
                            <h3>📝 Información Básica</h3>
                            
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Lentes Ray-Ban Aviator Clásicos"
                                    className={errors.nombre ? 'error' : ''}
                                    maxLength={100}
                                />
                                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción *</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Descripción detallada del producto, características, materiales, etc."
                                    className={errors.descripcion ? 'error' : ''}
                                    rows={4}
                                    maxLength={1000}
                                />
                                <small className="char-counter">{formData.descripcion.length}/1000</small>
                                {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="marca">Marca *</label>
                                    <input
                                        type="text"
                                        id="marca"
                                        name="marca"
                                        value={formData.marca}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Ray-Ban"
                                        className={errors.marca ? 'error' : ''}
                                    />
                                    {errors.marca && <span className="error-message">{errors.marca}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="codigoSKU">Código SKU *</label>
                                    <input
                                        type="text"
                                        id="codigoSKU"
                                        name="codigoSKU"
                                        value={formData.codigoSKU}
                                        onChange={handleInputChange}
                                        placeholder="Ej: RB-3025-001"
                                        className={errors.codigoSKU ? 'error' : ''}
                                    />
                                    {errors.codigoSKU && <span className="error-message">{errors.codigoSKU}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>🏷️ Precio y Categoría</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="precio">Precio (CLP) *</label>
                                    <input
                                        type="text"
                                        id="precio"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handlePriceChange}
                                        placeholder="149.990"
                                        className={errors.precio ? 'error' : ''}
                                    />
                                    {formData.precio && (
                                        <small className="precio-formateado">
                                            Precio: ${formData.precio} CLP
                                        </small>
                                    )}
                                    {errors.precio && <span className="error-message">{errors.precio}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Categoría y Subcategoría *</label>
                                    <DropdownCategorias
                                        selectedCategoria={formData.categoria}
                                        selectedSubcategoria={formData.subcategoria}
                                        onCategoriaChange={(categoria) => setFormData(prev => ({ ...prev, categoria, subcategoria: '' }))}
                                        onSubcategoriaChange={(subcategoria) => setFormData(prev => ({ ...prev, subcategoria }))}
                                        className={errors.categoria || errors.subcategoria ? 'error' : ''}
                                    />
                                    {errors.categoria && <span className="error-message">{errors.categoria}</span>}
                                    {errors.subcategoria && <span className="error-message">{errors.subcategoria}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="stock">Stock *</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="50"
                                        min="0"
                                        max="99999"
                                        inputMode="numeric"
                                        className={errors.stock ? 'error' : ''}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onInput={(e) => {
                                            // Validación adicional para prevenir pegar texto
                                            const value = e.target.value;
                                            if (!/^\d*$/.test(value)) {
                                                e.target.value = value.replace(/\D/g, '');
                                                showAlert('El stock solo puede contener números');
                                            }
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                                            const numbersOnly = pastedText.replace(/\D/g, '');
                                            e.target.value = numbersOnly;
                                            // Forzar la actualización del estado
                                            setFormData(prev => ({ ...prev, stock: numbersOnly }));
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                        }}
                                    />
                                    {errors.stock && <span className="error-message">{errors.stock}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descuento">Descuento (%)</label>
                                    <input
                                        type="number"
                                        id="descuento"
                                        name="descuento"
                                        value={formData.descuento === 0 || formData.descuento === '' ? '' : formData.descuento}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        inputMode="numeric"
                                        className={errors.descuento ? 'error' : ''}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onInput={(e) => {
                                            // Validación adicional para prevenir pegar texto
                                            const value = e.target.value;
                                            if (!/^\d*$/.test(value)) {
                                                e.target.value = value.replace(/\D/g, '');
                                                showAlert('El descuento solo puede contener números');
                                            }
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                                            const numbersOnly = pastedText.replace(/\D/g, '');
                                            e.target.value = numbersOnly;
                                            // Forzar la actualización del estado
                                            setFormData(prev => ({ ...prev, descuento: numbersOnly }));
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                        }}
                                    />
                                    {errors.descuento && <span className="error-message">{errors.descuento}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>📷 Imagen del Producto</h3>
                            
                            <div className="image-upload-section">
                                <div 
                                    className={`image-upload-area ${errors.imagen ? 'error' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewImagen ? (
                                        <div className="image-preview">
                                            <img src={previewImagen} alt="Preview" />
                                            <div className="image-overlay">
                                                <FaImage size={24} />
                                                <span>Cambiar imagen</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <FaUpload size={48} />
                                            <h4>Subir imagen del producto</h4>
                                            <p>JPG, PNG o WebP • Máximo 5MB</p>
                                            <p>Recomendado: 800x600px</p>
                                        </div>
                                    )}
                                </div>
                                
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                
                                {errors.imagen && <span className="error-message">{errors.imagen}</span>}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>⚙️ Configuración</h3>
                            
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="activo"
                                        checked={formData.activo}
                                        onChange={handleInputChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    Producto activo (visible en la tienda)
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="oferta"
                                        checked={formData.oferta}
                                        onChange={handleInputChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    Producto en oferta
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-create"
                            disabled={loading || !isFormValid()}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Creando producto...
                                </>
                            ) : (
                                'Crear Producto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearProductoPopup;
