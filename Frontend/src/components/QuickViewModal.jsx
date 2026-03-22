import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaShoppingCart, FaExpandArrowsAlt } from "react-icons/fa";
import { formatearNombreParaURL } from "@helpers/formatData";
import CartButton from "./CartButton";
import WishlistButton from "./WishlistButton";
import LazyImage from "./LazyImage";

const QuickViewModal = ({ producto, onClose }) => {
    const navigate = useNavigate();
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    if (!producto) return null;

    const precioConDescuento = producto.oferta
        ? producto.precio * (1 - producto.descuento / 100)
        : producto.precio;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const goToDetail = () => {
        onClose();
        navigate(`/productos/${formatearNombreParaURL(producto.nombre)}`);
    };

    return (
        <div className="quickview-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="quickview-modal">
                <button className="quickview-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="quickview-content">
                    <div className="quickview-image">
                        <LazyImage
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            className="quickview-img"
                        />
                        {producto.oferta && (
                            <span className="quickview-badge">-{producto.descuento}%</span>
                        )}
                    </div>

                    <div className="quickview-info">
                        {producto.marca && (
                            <span className="quickview-brand">{producto.marca}</span>
                        )}
                        <h2 className="quickview-name">{producto.nombre}</h2>

                        <div className="quickview-price">
                            {producto.oferta ? (
                                <>
                                    <span className="price-current">
                                        ${precioConDescuento.toLocaleString("es-CL", { minimumFractionDigits: 0 })}
                                    </span>
                                    <span className="price-original">
                                        ${producto.precio.toLocaleString("es-CL", { minimumFractionDigits: 0 })}
                                    </span>
                                </>
                            ) : (
                                <span className="price-current">
                                    ${producto.precio.toLocaleString("es-CL", { minimumFractionDigits: 0 })}
                                </span>
                            )}
                        </div>

                        {producto.descripcion && (
                            <p className="quickview-desc">
                                {producto.descripcion.length > 200
                                    ? producto.descripcion.slice(0, 200) + "..."
                                    : producto.descripcion}
                            </p>
                        )}

                        <div className="quickview-meta">
                            {producto.genero && <span>Género: {producto.genero}</span>}
                            {producto.material && <span>Material: {producto.material}</span>}
                            {producto.forma && <span>Forma: {producto.forma}</span>}
                        </div>

                        <div className="quickview-stock">
                            {producto.stock > 0 ? (
                                <span className="stock-available">
                                    {producto.stock <= 5
                                        ? `¡Últimas ${producto.stock} unidades!`
                                        : "En stock"}
                                </span>
                            ) : (
                                <span className="stock-out">Agotado</span>
                            )}
                        </div>

                        <div className="quickview-actions">
                            <CartButton producto={producto} className="quickview-cart-btn" />
                            <WishlistButton productoId={producto.id} />
                            <button className="quickview-detail-btn" onClick={goToDetail}>
                                <FaExpandArrowsAlt />
                                Ver detalle completo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
