import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCreditCard, FaArrowLeft, FaShoppingCart, FaUser,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaClipboardList,
    FaSpinner, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import { useCart } from '@context/CartContext';
import { useAuth } from '@context/AuthContext';
import { crearOrden } from '@services/orden.service';
import { obtenerDirecciones } from '@services/direccion.service';
import LazyImage from '@components/LazyImage';
import '@styles/checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        observaciones: '',
    });
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ordenId, setOrdenId] = useState(null);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    // Pre-rellenar datos del usuario
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                nombre: `${user.primerNombre || ''} ${user.apellidoPaterno || ''}`.trim(),
                correo: user.email || '',
                telefono: user.telefono || '',
            }));
        }
    }, [user]);

    // Cargar direcciones guardadas
    useEffect(() => {
        const fetchDirecciones = async () => {
            try {
                const data = await obtenerDirecciones();
                setDirecciones(data);
                // Si hay una dirección principal, preseleccionarla
                const principal = data.find((d) => d.esPrincipal);
                if (principal) {
                    setFormData((prev) => ({
                        ...prev,
                        direccion: `${principal.calle} ${principal.numero}, ${principal.comuna}, ${principal.region}`,
                    }));
                }
            } catch {
                // No es crítico si falla
            }
        };
        fetchDirecciones();
    }, []);

    // Redirigir si el carrito está vacío y no hubo éxito
    useEffect(() => {
        if (cart.length === 0 && !success) {
            navigate('/carrito');
        }
    }, [cart, success, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Limpiar error del campo al editar
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleDireccionSelect = (dir) => {
        setFormData((prev) => ({
            ...prev,
            direccion: `${dir.calle} ${dir.numero}, ${dir.comuna}, ${dir.region}`,
        }));
        if (fieldErrors.direccion) {
            setFieldErrors((prev) => ({ ...prev, direccion: '' }));
        }
    };

    const validate = () => {
        const errors = {};
        if (!formData.nombre || formData.nombre.length < 2) {
            errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.correo || !emailRegex.test(formData.correo)) {
            errors.correo = 'Ingresa un correo electrónico válido.';
        }
        const telRegex = /^[\d\s+()-]+$/;
        if (!formData.telefono || !telRegex.test(formData.telefono)) {
            errors.telefono = 'Ingresa un teléfono válido.';
        }
        if (!formData.direccion || formData.direccion.length < 5) {
            errors.direccion = 'La dirección debe tener al menos 5 caracteres.';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const formatPrice = (price) => {
        return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const getItemPrice = (item) => {
        if (item.oferta && item.descuento > 0) {
            return Math.round(item.precio * (1 - item.descuento / 100));
        }
        return item.precio;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setLoading(true);
        try {
            const orderData = {
                cliente: {
                    nombre: formData.nombre,
                    correo: formData.correo,
                    telefono: formData.telefono,
                    direccion: formData.direccion,
                    observaciones: formData.observaciones || '',
                },
                productos: cart.map((item) => ({
                    id: item.id,
                    cantidad: item.cantidad,
                })),
            };

            const result = await crearOrden(orderData);
            setOrdenId(result?.id || null);
            setSuccess(true);
            clearCart();
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al procesar tu orden. Por favor intenta de nuevo.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="checkout-container">
                <div className="checkout-success">
                    <FaCheckCircle className="success-icon" />
                    <h1>¡Orden creada exitosamente!</h1>
                    <p>Tu orden {ordenId ? `#${ordenId}` : ''} ha sido registrada.</p>
                    <p className="success-detail">Te enviaremos actualizaciones sobre el estado de tu pedido.</p>
                    <div className="success-actions">
                        <button className="btn-primary" onClick={() => navigate('/catalogo')}>
                            Seguir comprando
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/')}>
                            Ir al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalPrice = getTotalPrice();

    return (
        <div className="checkout-container">
            <button className="checkout-back" onClick={() => navigate('/carrito')}>
                <FaArrowLeft /> Volver al carrito
            </button>

            <h1 className="checkout-title"><FaCreditCard /> Finalizar compra</h1>

            <form className="checkout-layout" onSubmit={handleSubmit}>
                {/* Columna izquierda: formulario */}
                <div className="checkout-form-col">
                    <div className="checkout-section">
                        <h2><FaUser /> Datos del cliente</h2>

                        <div className="form-group">
                            <label htmlFor="nombre"><FaUser /> Nombre completo</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre completo"
                                className={fieldErrors.nombre ? 'input-error' : ''}
                            />
                            {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="correo"><FaEnvelope /> Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                className={fieldErrors.correo ? 'input-error' : ''}
                            />
                            {fieldErrors.correo && <span className="field-error">{fieldErrors.correo}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono"><FaPhone /> Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="+56 9 1234 5678"
                                className={fieldErrors.telefono ? 'input-error' : ''}
                            />
                            {fieldErrors.telefono && <span className="field-error">{fieldErrors.telefono}</span>}
                        </div>
                    </div>

                    <div className="checkout-section">
                        <h2><FaMapMarkerAlt /> Dirección de envío</h2>

                        {direcciones.length > 0 && (
                            <div className="saved-addresses">
                                <p className="saved-label">Direcciones guardadas:</p>
                                <div className="address-chips">
                                    {direcciones.map((dir) => (
                                        <button
                                            key={dir.id}
                                            type="button"
                                            className={`address-chip ${
                                                formData.direccion === `${dir.calle} ${dir.numero}, ${dir.comuna}, ${dir.region}` ? 'active' : ''
                                            }`}
                                            onClick={() => handleDireccionSelect(dir)}
                                        >
                                            {dir.calle} {dir.numero}, {dir.comuna}
                                            {dir.esPrincipal && <span className="chip-main">Principal</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="direccion"><FaMapMarkerAlt /> Dirección completa</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Calle, número, comuna, región"
                                className={fieldErrors.direccion ? 'input-error' : ''}
                            />
                            {fieldErrors.direccion && <span className="field-error">{fieldErrors.direccion}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="observaciones"><FaClipboardList /> Observaciones (opcional)</label>
                            <textarea
                                id="observaciones"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                placeholder="Instrucciones especiales de entrega, referencias, etc."
                                rows={3}
                                maxLength={500}
                            />
                        </div>
                    </div>
                </div>

                {/* Columna derecha: resumen */}
                <div className="checkout-summary-col">
                    <div className="checkout-summary">
                        <h2><FaShoppingCart /> Resumen del pedido</h2>

                        <div className="summary-items">
                            {cart.map((item) => {
                                const unitPrice = getItemPrice(item);
                                return (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-img">
                                            <LazyImage
                                                src={item.imagen}
                                                alt={item.nombre}
                                                className="summary-thumb"
                                            />
                                        </div>
                                        <div className="summary-item-info">
                                            <span className="summary-item-name" title={item.nombre}>
                                                {item.nombre.length > 40
                                                    ? item.nombre.slice(0, 40) + '...'
                                                    : item.nombre}
                                            </span>
                                            <span className="summary-item-qty">
                                                x{item.cantidad} — {formatPrice(unitPrice * item.cantidad)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="summary-total-price">{formatPrice(totalPrice)}</span>
                        </div>

                        {error && (
                            <div className="checkout-error">
                                <FaExclamationTriangle /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-confirm-order"
                            disabled={loading || cart.length === 0}
                        >
                            {loading ? (
                                <><FaSpinner className="spin" /> Procesando...</>
                            ) : (
                                <><FaCreditCard /> Confirmar orden</>
                            )}
                        </button>

                        <p className="checkout-disclaimer">
                            Al confirmar, aceptas nuestros términos y condiciones.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
