import { useState, useEffect } from 'react';
import useEditProducto from '@hooks/productos/useEditProducto';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import DropdownCategorias from './DropdownCategorias';
import ImageGalleryEditor from './ImageGalleryEditor';
import BrandSelectorInput from './BrandSelectorInput';
import '@styles/crearProducto.css';

const EditarProductoPopup = ({ show, setShow, producto, onProductoUpdated }) => {
    const { handleEdit, loading, errors, clearErrors, setErrors } = useEditProducto((productoActualizado) => {
        setShow(false);
        if (onProductoUpdated) onProductoUpdated(productoActualizado);
    });

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
        descuento: 0
    });

    const [alert, setAlert] = useState(null);
    const [dropdownActivo, setDropdownActivo] = useState(null);

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

    useEffect(() => {
        if (producto && show) {
            const precio = producto.precio ? producto.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';

            setFormData({
                nombre: producto.nombre || '',
                descripcion: producto.descripcion || '',
                precio: precio,
                categoria: producto.categoria || '',
                subcategoria: producto.subcategoria || '',
                stock: producto.stock?.toString() || '',
                marca: producto.marca || '',
                codigoSKU: producto.codigoSKU || '',
                activo: producto.activo !== undefined ? producto.activo : true,
                oferta: producto.oferta !== undefined ? producto.oferta : false,
                descuento: producto.descuento || 0
            });

        }
    }, [producto, show]);

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
            formData.codigoSKU.trim().length >= 3
        );
    };

    const formatPrice = (value) => {
        if (!value) return '';
        const number = value.toString().replace(/\D/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (e) => {
        const inputValue = e.target.value;

        if (/[a-zA-Z]/.test(inputValue)) {
            showAlert('El precio no puede contener letras');
            return;
        }

        if (/[^0-9.]/.test(inputValue) && inputValue !== '') {
            showAlert('El precio solo puede contener números');
            return;
        }

        if ((inputValue.match(/\./g) || []).length > 1) {
            showAlert('El precio no puede tener múltiples puntos decimales');
            return;
        }

        if (inputValue.startsWith('.')) {
            showAlert('El precio no puede comenzar con un punto decimal');
            return;
        }

        const rawValue = inputValue.replace(/\D/g, '');

        if (rawValue.length > 8) {
            showAlert('El precio es demasiado largo');
            return;
        }

        const actualPrice = parseInt(rawValue);
        if (rawValue && actualPrice <= 0) {
            showAlert('El precio debe ser mayor a 0');
            return;
        }

        if (rawValue && actualPrice > 10000000) {
            showAlert('El precio no puede exceder $10.000.000');
            return;
        }

        const formattedValue = formatPrice(rawValue);

        setFormData(prev => ({
            ...prev,
            precio: formattedValue
        }));

        if (errors.precio) {
            setErrors(prev => ({
                ...prev,
                precio: null
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'precio') {
            handlePriceChange(e);
            return;
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

        // Validaciones específicas para cada campo (copiadas de CrearProductoPopup)
        if (name === 'nombre') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, nombre: '' }));
                return;
            }

            // 1. No más de 4 números juntos
            if (/\d{5,}/.test(value)) {
                showAlert('El nombre no puede tener más de 4 números juntos');
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

            // 3. Validación estricta de caracteres especiales
            // Solo permitir letras, números, espacios, guiones y puntos
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-.]+$/.test(value)) {
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
            if ((value.match(/\s/g) || []).length > 10) {
                showAlert('El nombre no puede tener más de 10 espacios en total');
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
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-.,;:!?"'()[\]{}/ +=*&^%$#@]+$/.test(value)) {
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

        if (name === 'marca') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, marca: '' }));
                return;
            }

            // 1. Solo letras, números, espacios y guiones (no puntos para marca)
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-]+$/.test(value)) {
                showAlert('La marca solo puede contener letras, números, espacios y guiones (-)');
                return;
            }

            // 1.1. No más de 4 números seguidos
            if (/\d{5,}/.test(value)) {
                showAlert('La marca no puede tener más de 4 números seguidos');
                return;
            }

            // 2. No más de 2 guiones juntos ni más de 1 guión en total
            if (/-{3,}/.test(value)) {
                showAlert('La marca no puede tener más de 2 guiones juntos');
                return;
            }
            if ((value.match(/-/g) || []).length > 1) {
                showAlert('La marca no puede tener más de 1 guión en total');
                return;
            }

            // 3. No más de 3 caracteres repetidos seguidos
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
            if ((value.match(/\s/g) || []).length > 1) {
                showAlert('La marca no puede tener más de 1 espacio en total');
                return;
            }
        }

        if (name === 'codigoSKU') {
            // Si está vacío, permitir
            if (value === '') {
                setFormData(prev => ({ ...prev, codigoSKU: '' }));
                return;
            }

            // 1. Solo letras, números y guiones (sin espacios ni puntos para SKU)
            if (!/^[a-zA-Z0-9-]+$/.test(value)) {
                showAlert('El código SKU solo puede contener letras, números y guiones (-), sin espacios');
                return;
            }

            // 2. No más de 2 guiones juntos ni más de 2 guiones en total
            if (/-{3,}/.test(value)) {
                showAlert('El código SKU no puede tener más de 2 guiones juntos');
                return;
            }
            if ((value.match(/-/g) || []).length > 2) {
                showAlert('El código SKU no puede tener más de 2 guiones en total');
                return;
            }

            // 3. No más de 3 caracteres repetidos seguidos
            if (/(.)\1{2,}/.test(value)) {
                showAlert('El código SKU no puede tener más de 3 caracteres repetidos seguidos');
                return;
            }

            // 4. No puede comenzar con guión (permitir terminar con guión mientras se escribe)
            if (/^-/.test(value)) {
                showAlert('El código SKU no puede comenzar con guión');
                return;
            }

            // Validaciones adicionales
            if (value.length > 20) {
                showAlert('El código SKU no puede exceder 20 caracteres');
                return;
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

        const submitFormData = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'precio') {
                const rawPrice = formData[key].replace(/\D/g, '');
                submitFormData.append(key, rawPrice);
            } else {
                submitFormData.append(key, formData[key]);
            }
        });

        handleEdit(producto.id, submitFormData);
    };

    const handleClose = () => {
        setShow(false);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            categoria: '',
            stock: '',
            marca: '',
            codigoSKU: '',
            activo: true,
            oferta: false,
            descuento: 0
        });
        clearErrors();
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
                    <h2>✏️ Editar Producto</h2>
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
                                    <BrandSelectorInput
                                        value={formData.marca}
                                        onChange={handleInputChange}
                                        error={errors.marca}
                                        name="marca"
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
                                        dropdownActivo={dropdownActivo}
                                        setDropdownActivo={setDropdownActivo}
                                        id="editar-producto"
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
                                        placeholder="50"
                                        min="0"
                                        max="99999"
                                        inputMode="numeric"
                                        className={errors.stock ? 'error' : ''}
                                    />
                                    {errors.stock && <span className="error-message">{errors.stock}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descuento">Descuento (%)</label>
                                    <input
                                        type="number"
                                        id="descuento"
                                        name="descuento"
                                        value={formData.descuento}
                                        onChange={handleInputChange}
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
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        inputMode="numeric"
                                        className={errors.descuento ? 'error' : ''}
                                    />
                                    {errors.descuento && <span className="error-message">{errors.descuento}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <ImageGalleryEditor productoId={producto?.id} />
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
                                    Actualizando producto...
                                </>
                            ) : (
                                'Actualizar Producto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarProductoPopup;
