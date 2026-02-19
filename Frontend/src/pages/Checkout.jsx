import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCreditCard, FaArrowLeft, FaShoppingCart, FaUser,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaClipboardList,
    FaSpinner, FaCheckCircle, FaExclamationTriangle,
    FaStore, FaTruck, FaShieldAlt, FaLock, FaTag,
    FaCrosshairs, FaBoxOpen,
} from 'react-icons/fa';
import { useCart } from '@context/CartContext';
import { useAuth } from '@context/AuthContext';
import { crearOrden, getCostoEnvio } from '@services/orden.service';
import {
    iniciarPagoWebpay,
    iniciarPagoMercadoPago,
} from '@services/pago.service';
import { obtenerDirecciones } from '@services/direccion.service';
import regiones, { obtenerComunas } from '@constants/regiones';
import LazyImage from '@components/LazyImage';
import '@styles/checkout.css';

const IVA_RATE = 0.19;

const METODOS_PAGO = [
    {
        id: 'webpay',
        label: 'WebPay Plus',
        sub: 'Débito / Crédito',
        icon: '💳',
    },
    {
        id: 'mercadopago',
        label: 'MercadoPago',
        sub: 'Tarjeta, transferencia y más',
        icon: '🟡',
    },
];

const STEPS = [
    { num: 1, label: 'Datos' },
    { num: 2, label: 'Entrega' },
    { num: 3, label: 'Pago' },
];

/* ── helpers ── */
const formatPrice = (price) =>
    `$${Number(price).toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;

const detectRegionComuna = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('no-geo'));
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const url
                        = "https://nominatim.openstreetmap.org/reverse"
                        + `?lat=${latitude}&lon=${longitude}`
                        + "&format=json&accept-language=es&addressdetails=1";
                    const resp = await fetch(url, {
                        headers: {
                            "User-Agent": "OpticaDanniels/1.0",
                        },
                    });
                    const data = await resp.json();
                    const addr = data.address || {};
                    const rawRegion = addr.state || '';
                    const rawComuna = addr.city || addr.town
                        || addr.village || addr.suburb || '';
                    resolve({ region: rawRegion, comuna: rawComuna });
                } catch {
                    reject(new Error('geo-fail'));
                }
            },
            () => reject(new Error('geo-denied')),
            { enableHighAccuracy: false, timeout: 8000 },
        );
    });

/* ─────────────────── Component ─────────────────── */
const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getTotalPrice, clearCart, cartLoaded } = useCart();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        region: '',
        comuna: '',
        observaciones: '',
    });
    const [metodoEntrega, setMetodoEntrega] = useState('envio');
    const [metodoPago, setMetodoPago] = useState('webpay');
    const [direcciones, setDirecciones] = useState([]);
    const [selectedDireccionId, setSelectedDireccionId] = useState(null);
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [costoEnvio, setCostoEnvio] = useState(0);
    const [loadingEnvio, setLoadingEnvio] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ordenId, setOrdenId] = useState(null);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoStatus, setGeoStatus] = useState('');

    /* price helpers */
    const getItemPrice = useCallback((item) => {
        if (item.oferta && item.descuento > 0) {
            return Math.round(
                item.precio * (1 - item.descuento / 100),
            );
        }
        return item.precio;
    }, []);

    const subtotalBruto = getTotalPrice();
    const netoSinIva = Math.round(subtotalBruto / (1 + IVA_RATE));
    const ivaDesglosado = subtotalBruto - netoSinIva;
    const envioFinal = metodoEntrega === 'retiro' ? 0 : costoEnvio;
    const totalFinal = subtotalBruto + envioFinal;
    const totalItems = cart.reduce((s, i) => s + i.cantidad, 0);

    /* step tracker */
    useEffect(() => {
        if (
            (metodoEntrega === 'envio'
            && formData.region && formData.comuna)
            || metodoEntrega === 'retiro'
        ) {
            setStep(3);
        } else if (
            formData.nombre && formData.correo && formData.telefono
        ) {
            setStep(2);
        } else {
            setStep(1);
        }
    }, [formData, metodoEntrega]);

    /* prefill user */
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

    /* load saved addresses */
    useEffect(() => {
        const fetchDirecciones = async () => {
            try {
                const data = await obtenerDirecciones();
                setDirecciones(data);
                const principal = data.find((d) => d.esPrincipal);
                if (principal) handleDireccionSelect(principal);
            } catch { /* no-op */ }
        };
        fetchDirecciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* redirect if cart empty (wait for localStorage to load first) */
    useEffect(() => {
        if (cartLoaded && cart.length === 0 && !success) {
            navigate('/carrito');
        }
    }, [cart, cartLoaded, success, navigate]);

    /* update comunas */
    useEffect(() => {
        if (formData.region) {
            const comunas = obtenerComunas(formData.region);
            setComunasDisponibles(comunas);
            if (!comunas.some((c) => c.nombre === formData.comuna)) {
                setFormData((p) => ({ ...p, comuna: '' }));
                setCostoEnvio(0);
            }
        } else {
            setComunasDisponibles([]);
        }
    }, [formData.region, formData.comuna]);

    /* calc shipping */
    useEffect(() => {
        if (metodoEntrega === 'retiro') {
            setCostoEnvio(0);
            return;
        }
        if (!formData.region || !formData.comuna) {
            setCostoEnvio(0);
            return;
        }
        const fetchCosto = async () => {
            setLoadingEnvio(true);
            try {
                const data = await getCostoEnvio(
                    formData.region, formData.comuna,
                );
                setCostoEnvio(data.costoEnvio || 0);
            } catch {
                setCostoEnvio(0);
            } finally {
                setLoadingEnvio(false);
            }
        };
        fetchCosto();
    }, [formData.region, formData.comuna, metodoEntrega]);

    /* ── Geolocation ── */
    const handleDetectLocation = async () => {
        setGeoLoading(true);
        setGeoStatus('');
        try {
            const { region, comuna } = await detectRegionComuna();
            const matchRegion = regiones.find((r) =>
                region.toLowerCase().includes(
                    r.nombre.toLowerCase(),
                )
                || r.nombre.toLowerCase().includes(
                    region.toLowerCase(),
                ),
            );
            if (matchRegion) {
                setFormData((p) => ({
                    ...p, region: matchRegion.nombre,
                }));
                const comunas = obtenerComunas(matchRegion.nombre);
                const matchComuna = comunas.find((c) =>
                    comuna.toLowerCase().includes(
                        c.nombre.toLowerCase(),
                    )
                    || c.nombre.toLowerCase().includes(
                        comuna.toLowerCase(),
                    ),
                );
                if (matchComuna) {
                    setFormData((p) => ({
                        ...p,
                        region: matchRegion.nombre,
                        comuna: matchComuna.nombre,
                    }));
                    setGeoStatus(
                        `📍 ${matchComuna.nombre}, ${matchRegion.nombre}`,
                    );
                } else {
                    setGeoStatus(
                        `📍 ${matchRegion.nombre} — selecciona tu comuna`,
                    );
                }
            } else {
                setGeoStatus(
                    "No pudimos detectar tu región exacta.",
                );
            }
        } catch {
            setGeoStatus("No se pudo obtener tu ubicación.");
        } finally {
            setGeoLoading(false);
        }
    };

    /* auto-trigger geolocation on mount */
    useEffect(() => {
        if (metodoEntrega === 'envio' && !formData.region) {
            handleDetectLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Handlers ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((p) => ({ ...p, [name]: '' }));
        }
    };

    const handleDireccionSelect = (dir) => {
        setSelectedDireccionId(dir.id);
        setFormData((p) => ({
            ...p,
            direccion: dir.direccion || '',
            region: dir.region || '',
            comuna: dir.ciudad || '',
        }));
        if (fieldErrors.direccion) {
            setFieldErrors((p) => ({ ...p, direccion: '' }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!formData.nombre || formData.nombre.length < 2) {
            errs.nombre
                = "El nombre debe tener al menos 2 caracteres.";
        }
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.correo || !emailRx.test(formData.correo)) {
            errs.correo = "Ingresa un correo electrónico válido.";
        }
        const telRx = /^[\d\s+()-]+$/;
        if (!formData.telefono || !telRx.test(formData.telefono)) {
            errs.telefono = "Ingresa un teléfono válido.";
        }
        if (metodoEntrega === 'envio') {
            if (!formData.direccion || formData.direccion.length < 5) {
                errs.direccion
                    = "La dirección debe tener al menos 5 caracteres.";
            }
            if (!formData.region) {
                errs.region = "Selecciona una región.";
            }
            if (!formData.comuna) {
                errs.comuna = "Selecciona una comuna.";
            }
        }
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
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
                    direccion: metodoEntrega === 'retiro'
                        ? "Retiro en tienda — Av. Manuel Rodríguez 426, Chiguayante"
                        : `${formData.direccion}, ${formData.comuna}, ${formData.region}`,
                    observaciones: formData.observaciones || '',
                },
                productos: cart.map((it) => ({
                    id: it.id, cantidad: it.cantidad,
                })),
                metodoEntrega,
                metodoPago,
                region: formData.region,
                comuna: formData.comuna,
                direccionId: selectedDireccionId || null,
                costoEnvio: envioFinal,
            };

            const result = await crearOrden(orderData);
            const newOrdenId = result?.id;
            setOrdenId(newOrdenId);
            setSuccess(true);
            clearCart();

            if (newOrdenId && metodoPago === 'webpay') {
                try {
                    const pd = await iniciarPagoWebpay(newOrdenId);
                    if (pd?.url) {
                        window.location.href
                            = `${pd.url}?token_ws=${pd.token}`;
                        return;
                    }
                } catch {
                    navigate(
                        `/checkout/resultado?status=pendiente&ordenId=${newOrdenId}`,
                    );
                    return;
                }
            } else if (newOrdenId && metodoPago === 'mercadopago') {
                try {
                    const pd = await iniciarPagoMercadoPago(newOrdenId);
                    const rUrl
                        = pd?.sandboxInitPoint || pd?.initPoint;
                    if (rUrl) {
                        window.location.href = rUrl;
                        return;
                    }
                } catch {
                    navigate(
                        `/checkout/resultado?status=pendiente&ordenId=${newOrdenId}`,
                    );
                    return;
                }
            }
        } catch (err) {
            const msg = err.response?.data?.message
                || "Error al procesar tu orden. Intenta de nuevo.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    /* ═══ SUCCESS SCREEN ═══ */
    if (success) {
        return (
            <div className="ck ck--success-wrap">
                <div className="ck-success-card">
                    <div className="ck-success-ring">
                        <FaCheckCircle />
                    </div>
                    <h1>¡Pedido confirmado!</h1>
                    <p className="ck-success-ord">
                        Orden {ordenId ? `#${ordenId}` : ''}
                    </p>
                    <p className="ck-success-sub">
                        Serás redirigido al portal de pago en breve.
                    </p>
                    <div className="ck-success-actions">
                        <button
                            className="ck-btn ck-btn--primary"
                            onClick={() => navigate('/mis-compras')}
                        >
                            Ver mis pedidos
                        </button>
                        <button
                            className="ck-btn ck-btn--ghost"
                            onClick={() => navigate('/productos')}
                        >
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ═══ MAIN CHECKOUT ═══ */
    return (
        <div className="ck">
            {/* Top bar */}
            <header className="ck-topbar">
                <button
                    className="ck-back"
                    onClick={() => navigate('/carrito')}
                    type="button"
                >
                    <FaArrowLeft /> Volver al carrito
                </button>

                <nav className="ck-stepper">
                    {STEPS.map((s, i) => (
                        <div key={s.num} className="ck-step-wrap">
                            <div
                                className={
                                    "ck-step"
                                    + (step >= s.num
                                        ? " ck-step--done" : "")
                                    + (step === s.num
                                        ? " ck-step--active" : "")
                                }
                            >
                                <span className="ck-step__num">
                                    {step > s.num
                                        ? <FaCheckCircle />
                                        : s.num}
                                </span>
                                <span className="ck-step__label">
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={
                                    "ck-step-line"
                                    + (step > s.num
                                        ? " ck-step-line--done" : "")
                                } />
                            )}
                        </div>
                    ))}
                </nav>
            </header>

            <h1 className="ck-title">Finalizar compra</h1>

            <form className="ck-grid" onSubmit={handleSubmit}>
                {/* ══════ LEFT ══════ */}
                <div className="ck-left">
                    {/* Datos */}
                    <section className="ck-card">
                        <h2 className="ck-card__head">
                            <span className="ck-card__ico">
                                <FaUser />
                            </span>
                            Datos del cliente
                        </h2>
                        <div className="ck-fields">
                            <div className="ck-field">
                                <label htmlFor="nombre">
                                    Nombre completo
                                </label>
                                <div className="ck-input-wrap">
                                    <FaUser className="ck-ico" />
                                    <input
                                        id="nombre" name="nombre"
                                        type="text"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Juan Pérez"
                                        className={
                                            fieldErrors.nombre
                                                ? 'ck-err' : ''
                                        }
                                    />
                                </div>
                                {fieldErrors.nombre && (
                                    <span className="ck-ferr">
                                        {fieldErrors.nombre}
                                    </span>
                                )}
                            </div>
                            <div className="ck-row-2">
                                <div className="ck-field">
                                    <label htmlFor="correo">
                                        Correo electrónico
                                    </label>
                                    <div className="ck-input-wrap">
                                        <FaEnvelope className="ck-ico" />
                                        <input
                                            id="correo" name="correo"
                                            type="email"
                                            value={formData.correo}
                                            onChange={handleChange}
                                            placeholder="correo@ejemplo.com"
                                            className={
                                                fieldErrors.correo
                                                    ? 'ck-err' : ''
                                            }
                                        />
                                    </div>
                                    {fieldErrors.correo && (
                                        <span className="ck-ferr">
                                            {fieldErrors.correo}
                                        </span>
                                    )}
                                </div>
                                <div className="ck-field">
                                    <label htmlFor="telefono">
                                        Teléfono
                                    </label>
                                    <div className="ck-input-wrap">
                                        <FaPhone className="ck-ico" />
                                        <input
                                            id="telefono"
                                            name="telefono"
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="+56 9 1234 5678"
                                            className={
                                                fieldErrors.telefono
                                                    ? 'ck-err' : ''
                                            }
                                        />
                                    </div>
                                    {fieldErrors.telefono && (
                                        <span className="ck-ferr">
                                            {fieldErrors.telefono}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Delivery */}
                    <section className="ck-card">
                        <h2 className="ck-card__head">
                            <span className="ck-card__ico">
                                <FaTruck />
                            </span>
                            Método de entrega
                        </h2>
                        <div className="ck-del-grid">
                            <label
                                className={
                                    "ck-del"
                                    + (metodoEntrega === 'envio'
                                        ? " ck-del--on" : "")
                                }
                            >
                                <input
                                    type="radio"
                                    name="metodoEntrega"
                                    value="envio"
                                    checked={
                                        metodoEntrega === 'envio'
                                    }
                                    onChange={(e) =>
                                        setMetodoEntrega(e.target.value)
                                    }
                                />
                                <FaTruck className="ck-del__ico" />
                                <div className="ck-del__text">
                                    <strong>
                                        Despacho a domicilio
                                    </strong>
                                    <span>
                                        Recibe en tu dirección
                                    </span>
                                </div>
                                <div className="ck-radio-dot" />
                            </label>
                            <label
                                className={
                                    "ck-del"
                                    + (metodoEntrega === 'retiro'
                                        ? " ck-del--on" : "")
                                }
                            >
                                <input
                                    type="radio"
                                    name="metodoEntrega"
                                    value="retiro"
                                    checked={
                                        metodoEntrega === 'retiro'
                                    }
                                    onChange={(e) =>
                                        setMetodoEntrega(e.target.value)
                                    }
                                />
                                <FaStore className="ck-del__ico" />
                                <div className="ck-del__text">
                                    <strong>
                                        Retiro en tienda
                                    </strong>
                                    <span>
                                        Av. M. Rodríguez 426,
                                        Chiguayante
                                    </span>
                                </div>
                                <span className="ck-free-tag">
                                    Gratis
                                </span>
                            </label>
                        </div>
                    </section>

                    {/* Address */}
                    {metodoEntrega === 'envio' && (
                        <section className="ck-card">
                            <h2 className="ck-card__head">
                                <span className="ck-card__ico">
                                    <FaMapMarkerAlt />
                                </span>
                                Dirección de envío
                            </h2>

                            <button
                                type="button"
                                className="ck-geo-btn"
                                onClick={handleDetectLocation}
                                disabled={geoLoading}
                            >
                                {geoLoading ? (
                                    <>
                                        <FaSpinner className="ck-spin" />
                                        Detectando...
                                    </>
                                ) : (
                                    <>
                                        <FaCrosshairs />
                                        Detectar mi ubicación
                                    </>
                                )}
                            </button>
                            {geoStatus && (
                                <p className="ck-geo-msg">
                                    {geoStatus}
                                </p>
                            )}

                            {direcciones.length > 0 && (
                                <div className="ck-saved">
                                    <p className="ck-saved__lbl">
                                        Direcciones guardadas
                                    </p>
                                    <div className="ck-chips">
                                        {direcciones.map((dir) => (
                                            <button
                                                key={dir.id}
                                                type="button"
                                                className={
                                                    "ck-chip"
                                                    + (selectedDireccionId === dir.id
                                                        ? " ck-chip--on" : "")
                                                }
                                                onClick={() =>
                                                    handleDireccionSelect(dir)
                                                }
                                            >
                                                <FaMapMarkerAlt />
                                                {dir.direccion},{" "}
                                                {dir.ciudad}
                                                {dir.esPrincipal && (
                                                    <span className="ck-chip__tag">
                                                        Principal
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="ck-fields">
                                <div className="ck-row-2">
                                    <div className="ck-field">
                                        <label htmlFor="region">
                                            Región
                                        </label>
                                        <select
                                            id="region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            className={
                                                fieldErrors.region
                                                    ? 'ck-err' : ''
                                            }
                                        >
                                            <option value="">
                                                Selecciona región
                                            </option>
                                            {regiones.map((r) => (
                                                <option
                                                    key={r.codigo}
                                                    value={r.nombre}
                                                >
                                                    {r.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {fieldErrors.region && (
                                            <span className="ck-ferr">
                                                {fieldErrors.region}
                                            </span>
                                        )}
                                    </div>
                                    <div className="ck-field">
                                        <label htmlFor="comuna">
                                            Comuna
                                        </label>
                                        <select
                                            id="comuna"
                                            name="comuna"
                                            value={formData.comuna}
                                            onChange={handleChange}
                                            disabled={!formData.region}
                                            className={
                                                fieldErrors.comuna
                                                    ? 'ck-err' : ''
                                            }
                                        >
                                            <option value="">
                                                Selecciona comuna
                                            </option>
                                            {comunasDisponibles.map(
                                                (c) => (
                                                    <option
                                                        key={c.nombre}
                                                        value={c.nombre}
                                                    >
                                                        {c.nombre}
                                                        {c.costoEnvio
                                                            === 0
                                                            ? " — Gratis"
                                                            : ""}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {fieldErrors.comuna && (
                                            <span className="ck-ferr">
                                                {fieldErrors.comuna}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="ck-field">
                                    <label htmlFor="direccion">
                                        Dirección (calle, número,
                                        depto.)
                                    </label>
                                    <div className="ck-input-wrap">
                                        <FaMapMarkerAlt
                                            className="ck-ico"
                                        />
                                        <input
                                            id="direccion"
                                            name="direccion"
                                            type="text"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            placeholder="Ej: Av. Providencia 1234, Depto 501"
                                            className={
                                                fieldErrors.direccion
                                                    ? 'ck-err' : ''
                                            }
                                        />
                                    </div>
                                    {fieldErrors.direccion && (
                                        <span className="ck-ferr">
                                            {fieldErrors.direccion}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {formData.region && formData.comuna && (
                                <div className={
                                    "ck-ship"
                                    + (costoEnvio === 0
                                        ? " ck-ship--free" : "")
                                }>
                                    {loadingEnvio ? (
                                        <>
                                            <FaSpinner
                                                className="ck-spin"
                                            />
                                            Calculando envío...
                                        </>
                                    ) : costoEnvio === 0 ? (
                                        <>
                                            <FaTruck />
                                            ¡Envío gratis a{" "}
                                            {formData.comuna}!
                                        </>
                                    ) : (
                                        <>
                                            <FaTruck />
                                            Envío a{" "}
                                            {formData.comuna}:
                                            &nbsp;
                                            <strong>
                                                {formatPrice(
                                                    costoEnvio,
                                                )}
                                            </strong>
                                        </>
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Observaciones */}
                    <section className="ck-card">
                        <h2 className="ck-card__head">
                            <span className="ck-card__ico">
                                <FaClipboardList />
                            </span>
                            Observaciones
                            <span className="ck-optional">
                                (opcional)
                            </span>
                        </h2>
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            placeholder="Instrucciones de entrega, referencias..."
                            rows={3}
                            maxLength={500}
                            className="ck-textarea"
                        />
                    </section>

                    {/* Payment */}
                    <section className="ck-card">
                        <h2 className="ck-card__head">
                            <span className="ck-card__ico">
                                <FaCreditCard />
                            </span>
                            Método de pago
                        </h2>
                        <div className="ck-pay-grid">
                            {METODOS_PAGO.map((mp) => (
                                <label
                                    key={mp.id}
                                    className={
                                        "ck-pay"
                                        + (metodoPago === mp.id
                                            ? " ck-pay--on" : "")
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="metodoPago"
                                        value={mp.id}
                                        checked={
                                            metodoPago === mp.id
                                        }
                                        onChange={(e) =>
                                            setMetodoPago(
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <span className="ck-pay__icon">
                                        {mp.icon}
                                    </span>
                                    <div className="ck-pay__text">
                                        <strong>{mp.label}</strong>
                                        <span>{mp.sub}</span>
                                    </div>
                                    <div className="ck-radio-dot" />
                                </label>
                            ))}
                        </div>
                        <p className="ck-secure">
                            <FaLock />
                            Pago 100% seguro. Serás redirigido
                            a la pasarela para completar tu compra.
                        </p>
                    </section>
                </div>

                {/* ══════ RIGHT — SUMMARY ══════ */}
                <aside className="ck-right">
                    <div className="ck-summary">
                        <h2 className="ck-sum__head">
                            <FaShoppingCart />
                            <span>Resumen del pedido</span>
                            <span className="ck-sum__badge">
                                {totalItems}
                            </span>
                        </h2>

                        <ul className="ck-prods">
                            {cart.map((item) => {
                                const up = getItemPrice(item);
                                const op = item.precio;
                                const disc
                                    = item.oferta
                                    && item.descuento > 0;
                                return (
                                    <li
                                        key={item.id}
                                        className="ck-prod"
                                    >
                                        <div className="ck-prod__img">
                                            <LazyImage
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                className="ck-prod__pic"
                                            />
                                            <span className="ck-prod__qty">
                                                {item.cantidad}
                                            </span>
                                        </div>
                                        <div className="ck-prod__info">
                                            <span
                                                className="ck-prod__name"
                                                title={item.nombre}
                                            >
                                                {item.nombre}
                                            </span>
                                            {item.marca && (
                                                <span className="ck-prod__brand">
                                                    {item.marca}
                                                </span>
                                            )}
                                            {disc && (
                                                <span className="ck-prod__disc">
                                                    <FaTag />
                                                    -{item.descuento}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="ck-prod__prices">
                                            <span className="ck-prod__price">
                                                {formatPrice(
                                                    up * item.cantidad,
                                                )}
                                            </span>
                                            {disc && (
                                                <span className="ck-prod__orig">
                                                    {formatPrice(
                                                        op * item.cantidad,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="ck-sep" />

                        <div className="ck-breakdown">
                            <div className="ck-bk">
                                <span>Subtotal (neto)</span>
                                <span>
                                    {formatPrice(netoSinIva)}
                                </span>
                            </div>
                            <div className="ck-bk">
                                <span>IVA (19%)</span>
                                <span>
                                    {formatPrice(ivaDesglosado)}
                                </span>
                            </div>
                            <div className={
                                "ck-bk"
                                + (envioFinal === 0
                                    ? " ck-bk--free" : "")
                            }>
                                <span>
                                    {metodoEntrega === 'retiro'
                                        ? 'Retiro en tienda'
                                        : 'Envío'}
                                </span>
                                <span>
                                    {loadingEnvio
                                        ? '...'
                                        : envioFinal === 0
                                            ? 'Gratis'
                                            : formatPrice(envioFinal)}
                                </span>
                            </div>
                        </div>

                        <div className="ck-sep" />

                        <div className="ck-total">
                            <span>Total</span>
                            <span className="ck-total__val">
                                {formatPrice(totalFinal)}
                            </span>
                        </div>

                        {error && (
                            <div className="ck-alert">
                                <FaExclamationTriangle /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="ck-btn ck-btn--pay"
                            disabled={
                                loading || cart.length === 0
                            }
                        >
                            {loading ? (
                                <>
                                    <FaSpinner
                                        className="ck-spin"
                                    />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <FaLock />
                                    Pagar{" "}
                                    {formatPrice(totalFinal)}
                                </>
                            )}
                        </button>

                        <div className="ck-trust">
                            <FaShieldAlt />
                            <span>
                                Compra protegida · Precios incluyen
                                IVA
                            </span>
                        </div>

                        <div className="ck-badges">
                            <div className="ck-badges__it">
                                <FaBoxOpen />
                                <span>Envío seguro</span>
                            </div>
                            <div className="ck-badges__it">
                                <FaShieldAlt />
                                <span>Pago protegido</span>
                            </div>
                            <div className="ck-badges__it">
                                <FaCheckCircle />
                                <span>Garantía</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </form>
        </div>
    );
};

export default Checkout;
