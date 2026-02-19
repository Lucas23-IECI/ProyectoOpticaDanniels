import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaShoppingCart, FaTrash, FaArrowLeft, FaCreditCard,
    FaShieldAlt, FaTruck, FaUndo, FaTag, FaStore,
} from "react-icons/fa";
import { useCart } from "@context/CartContext";
import { useAuth } from "@context/AuthContext";
import LazyImage from "@components/LazyImage";
import "@styles/carrito.css";

/* ── helpers ── */
const fmt = (p) =>
    `$${Number(p).toLocaleString("es-CL", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;

const unitPrice = (item) =>
    item.oferta && item.descuento > 0
        ? Math.round(item.precio * (1 - item.descuento / 100))
        : item.precio;

/* ═══════════════════════════════════════════════ */
const Carrito = () => {
    const {
        cart, getTotalItems, getTotalPrice,
        removeFromCart, updateQuantity, clearCart,
    } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [removing, setRemoving] = useState(null);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const handleQty = (id, qty) => {
        if (qty <= 0) {
            animateRemove(id);
        } else {
            updateQuantity(id, qty);
        }
    };

    const animateRemove = (id) => {
        setRemoving(id);
        setTimeout(() => {
            removeFromCart(id);
            setRemoving(null);
        }, 300);
    };

    /* ── Not authenticated ── */
    if (!isAuthenticated) {
        return (
            <div className="ct">
                <div className="ct-empty-wrap">
                    <div className="ct-empty-card">
                        <div className="ct-empty-ico">
                            <FaShoppingCart />
                        </div>
                        <h2>Inicia sesión para ver tu carrito</h2>
                        <p>Necesitas estar autenticado para gestionar tu carrito de compras</p>
                        <button className="ct-btn ct-btn--primary" onClick={() => navigate("/login")}>
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Empty cart ── */
    if (cart.length === 0) {
        return (
            <div className="ct">
                <div className="ct-empty-wrap">
                    <div className="ct-empty-card">
                        <div className="ct-empty-ico">
                            <FaShoppingCart />
                        </div>
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega productos para comenzar tu compra</p>
                        <button className="ct-btn ct-btn--primary" onClick={() => navigate("/productos")}>
                            <FaStore /> Explorar productos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Cart with items ── */
    return (
        <div className="ct">
            {/* Header */}
            <div className="ct-header">
                <button className="ct-back" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Volver
                </button>
                <div className="ct-heading">
                    <h1><FaShoppingCart /> Mi Carrito</h1>
                    <span className="ct-count">{totalItems} {totalItems === 1 ? "producto" : "productos"}</span>
                </div>
                <button className="ct-clear" onClick={clearCart}>
                    <FaTrash /> Vaciar
                </button>
            </div>

            {/* Grid */}
            <div className="ct-grid">
                {/* Items */}
                <div className="ct-items">
                    {cart.map((item) => {
                        const up = unitPrice(item);
                        const sub = up * item.cantidad;
                        const isRemoving = removing === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`ct-card ${isRemoving ? "ct-card--removing" : ""}`}
                            >
                                {/* Product image */}
                                <div className="ct-card__img">
                                    <LazyImage src={item.imagen_url} alt={item.nombre} />
                                    {item.oferta && item.descuento > 0 && (
                                        <span className="ct-card__discount">
                                            <FaTag /> -{item.descuento}%
                                        </span>
                                    )}
                                </div>

                                {/* Main info */}
                                <div className="ct-card__body">
                                    <div className="ct-card__top">
                                        <h3 className="ct-card__name">{item.nombre}</h3>
                                        <button
                                            className="ct-card__remove"
                                            onClick={() => animateRemove(item.id)}
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <div className="ct-card__meta">
                                        {item.marca && <span className="ct-card__brand">{item.marca}</span>}
                                        {item.categoria && <span className="ct-card__cat">{item.categoria}</span>}
                                    </div>

                                    {/* Price row */}
                                    <div className="ct-card__pricing">
                                        <div className="ct-card__prices">
                                            <span className="ct-card__price">{fmt(up)}</span>
                                            {item.oferta && item.descuento > 0 && (
                                                <span className="ct-card__original">{fmt(item.precio)}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom row: qty + subtotal */}
                                    <div className="ct-card__bottom">
                                        <div className="ct-qty">
                                            <button
                                                className="ct-qty__btn"
                                                onClick={() => handleQty(item.id, item.cantidad - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="ct-qty__val">{item.cantidad}</span>
                                            <button
                                                className="ct-qty__btn"
                                                onClick={() => handleQty(item.id, item.cantidad + 1)}
                                                disabled={item.cantidad >= item.stock}
                                            >
                                                +
                                            </button>
                                            <span className="ct-qty__stock">
                                                {item.stock} disponible{item.stock !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                        <div className="ct-card__subtotal">
                                            <span className="ct-card__sub-label">Subtotal</span>
                                            <span className="ct-card__sub-val">{fmt(sub)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary sidebar */}
                <aside className="ct-aside">
                    <div className="ct-summary">
                        <h3 className="ct-summary__title">Resumen del pedido</h3>

                        <div className="ct-summary__rows">
                            <div className="ct-summary__row">
                                <span>Productos ({totalItems})</span>
                                <span>{fmt(totalPrice)}</span>
                            </div>
                            <div className="ct-summary__row ct-summary__row--muted">
                                <span>Envío</span>
                                <span>Se calcula en checkout</span>
                            </div>
                        </div>

                        <div className="ct-summary__sep" />

                        <div className="ct-summary__total">
                            <span>Total estimado</span>
                            <span className="ct-summary__total-val">{fmt(totalPrice)}</span>
                        </div>

                        <button
                            className="ct-btn ct-btn--pay"
                            onClick={() => navigate("/checkout")}
                        >
                            <FaCreditCard /> Proceder al pago
                        </button>

                        <button
                            className="ct-btn ct-btn--ghost"
                            onClick={() => navigate("/productos")}
                        >
                            Continuar comprando
                        </button>

                        {/* Trust badges */}
                        <div className="ct-trust">
                            <div className="ct-trust__item">
                                <FaTruck />
                                <span>Envío seguro</span>
                            </div>
                            <div className="ct-trust__item">
                                <FaShieldAlt />
                                <span>Pago protegido</span>
                            </div>
                            <div className="ct-trust__item">
                                <FaUndo />
                                <span>Devoluciones</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Carrito;
