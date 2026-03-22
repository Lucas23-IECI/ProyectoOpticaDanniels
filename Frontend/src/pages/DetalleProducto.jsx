import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductos } from "@services/producto.service";
import { getReviewsByProducto, getReviewStats, createReview } from "@services/review.service";
import { formatearNombreParaURL } from "@helpers/formatData";
import {
    FaArrowLeft, FaShoppingCart, FaHeart, FaShare, FaFire,
    FaTag, FaShieldAlt, FaTruck, FaUndo, FaStar, FaCheck,
    FaPlus, FaMinus, FaEye, FaSpinner, FaRegStar, FaUser, FaWhatsapp,
    FaRuler, FaInfoCircle, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import ProductCard from "@components/ProductCard";
import CartButton from "@components/CartButton";
import LazyImage from "@components/LazyImage";
import Breadcrumbs from "@components/Breadcrumbs";
import { SkeletonProductDetail } from "@components/Skeleton";
import { useWishlistContext } from "@context/WishlistContext";
import { useAuth } from "@context/AuthContext";
import "@styles/detalleProducto.css";
import "@styles/cartButton.css";

function DetalleProducto() {
    const { nombreProducto } = useParams();
    const navigate = useNavigate();
    const { toggleWishlist, isInWishlist } = useWishlistContext();
    const { isAuthenticated, user } = useAuth();
    const [producto, setProducto] = useState(null);
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ promedio: 0, total: 0 });
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComentario, setNewComentario] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [activeTab, setActiveTab] = useState('descripcion');

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const nombreBuscado = formatearNombreParaURL(decodeURIComponent(nombreProducto));
                const { productos } = await getProductos({ limit: 1000 });
                const productoEncontrado = productos.find(
                    (p) => formatearNombreParaURL(p.nombre) === nombreBuscado
                );

                if (productoEncontrado) {
                    setProducto(productoEncontrado);
                    setSelectedImage(null);

                    // Obtener productos recomendados (misma categoría, excluyendo el actual)
                    const recomendados = productos
                        .filter(p =>
                            p.categoria === productoEncontrado.categoria &&
                            p.id !== productoEncontrado.id &&
                            p.activo
                        )
                        .slice(0, 4);
                    setProductosRecomendados(recomendados);

                    // Cargar reviews del producto
                    const [fetchedReviews, fetchedStats] = await Promise.all([
                        getReviewsByProducto(productoEncontrado.id),
                        getReviewStats(productoEncontrado.id),
                    ]);
                    setReviews(fetchedReviews);
                    setReviewStats(fetchedStats);
                }
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [nombreProducto]);

    // Verificar si el usuario ya reseñó este producto
    useEffect(() => {
        if (user && reviews.length > 0) {
            const yaReseno = reviews.some(r => r.usuario?.id === user.id);
            setUserHasReviewed(yaReseno);
        }
    }, [user, reviews]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newRating) {
            setReviewError('Selecciona una calificación.');
            return;
        }
        setReviewError('');
        setReviewMessage('');
        setSubmittingReview(true);
        try {
            await createReview({
                productoId: producto.id,
                rating: newRating,
                comentario: newComentario.trim() || null,
            });
            setReviewMessage('¡Reseña enviada! Está pendiente de aprobación.');
            setNewRating(0);
            setNewComentario('');
            setUserHasReviewed(true);
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Error al enviar la reseña.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderStars = (rating, size = 'sm') => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className={`star filled ${size}`} />);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(<FaStar key={i} className={`star half ${size}`} />);
            } else {
                stars.push(<FaStar key={i} className={`star empty ${size}`} />);
            }
        }
        return stars;
    };

    const formatPrice = (price) => {
        return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const getPrecioConDescuento = () => {
        if (producto?.oferta && producto?.descuento > 0) {
            return producto.precio * (1 - producto.descuento / 100);
        }
        return producto?.precio || 0;
    };

    const handleCantidadChange = (operacion) => {
        if (operacion === 'aumentar' && cantidad < producto.stock) {
            setCantidad(cantidad + 1);
        } else if (operacion === 'disminuir' && cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    };

    const handleAddToWishlist = () => {
        if (producto) {
            toggleWishlist(producto);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: producto.nombre,
                text: `Mira este producto: ${producto.nombre}`,
                url: window.location.href,
            });
        }
    };

    const handleGalleryNav = (direction) => {
        if (!producto?.imagenes || producto.imagenes.length <= 1) return;
        const sorted = [...producto.imagenes].sort((a, b) => (b.es_principal ? 1 : 0) - (a.es_principal ? 1 : 0));
        const currentUrl = selectedImage || producto.imagen_url;
        const currentIdx = sorted.findIndex(img => img.imagen_url === currentUrl);
        const nextIdx = direction === 'next'
            ? (currentIdx + 1) % sorted.length
            : (currentIdx - 1 + sorted.length) % sorted.length;
        setSelectedImage(sorted[nextIdx].imagen_url);
    };

    const handleGoBack = () => {
        // Verificar si hay historial previo y si es una página válida
        if (window.history.length > 1) {
            // Intentar volver al historial anterior
            navigate(-1);
        } else {
            // Si no hay historial, ir directamente a productos
            navigate('/productos');
        }
    };

    const getStockStatus = () => {
        if (producto.stock === 0) return { text: 'Sin stock', class: 'out-of-stock', available: false };
        if (producto.stock <= 5) return { text: 'Últimas unidades', class: 'low-stock', available: true };
        return { text: 'Disponible', class: 'in-stock', available: true };
    };

    if (loading) {
        return (
            <div className="detalle-producto-modern">
                <SkeletonProductDetail />
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="detalle-error-container">
                <div className="detalle-error">
                    <h2>Producto no encontrado</h2>
                    <p>El producto que buscas no existe o ha sido eliminado.</p>
                    <button className="btn-back" onClick={handleGoBack}>
                        <FaArrowLeft />
                        Volver a productos
                    </button>
                </div>
            </div>
        );
    }

    const stockStatus = getStockStatus();
    const precioFinal = getPrecioConDescuento();

    return (
        <div className="detalle-producto-modern">
            {/* Breadcrumbs */}
            <Breadcrumbs customTrail={[
                { label: 'Productos', path: '/productos', isLast: false },
                { label: producto.categoria, path: `/productos?categoria=${producto.categoria}`, isLast: false },
                { label: producto.nombre, path: '#', isLast: true },
            ]} />

            {/* Contenido principal: 2 columnas */}
            <div className="detalle-main-content">
                {/* Galería de imágenes */}
                <div className="producto-gallery">
                    <div className="main-image">
                        <LazyImage
                            src={selectedImage || producto.imagen_url}
                            alt={producto.nombre}
                            className="product-main-image"
                            placeholder={
                                <div className="image-placeholder-large">
                                    <FaTag />
                                </div>
                            }
                        />
                        {producto.oferta && (
                            <div className="discount-badge-large">
                                <FaFire />
                                <span>-{producto.descuento}%</span>
                            </div>
                        )}
                        {producto.imagenes && producto.imagenes.length > 1 && (
                            <>
                                <button className="gallery-arrow gallery-arrow-left" onClick={() => handleGalleryNav('prev')} type="button" aria-label="Imagen anterior">
                                    <FaChevronLeft />
                                </button>
                                <button className="gallery-arrow gallery-arrow-right" onClick={() => handleGalleryNav('next')} type="button" aria-label="Imagen siguiente">
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                    </div>
                    {producto.imagenes && producto.imagenes.length > 1 && (
                        <div className="gallery-thumbnails">
                            {[...producto.imagenes]
                                .sort((a, b) => (b.es_principal ? 1 : 0) - (a.es_principal ? 1 : 0))
                                .map((img) => (
                                <button
                                    key={img.id}
                                    className={`gallery-thumb ${(selectedImage || producto.imagen_url) === img.imagen_url ? "active" : ""}`}
                                    onClick={() => setSelectedImage(img.imagen_url)}
                                    type="button"
                                >
                                    <LazyImage src={img.imagen_url} alt="" className="thumb-img" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="producto-info-modern">
                    <div className="producto-header-info">
                        <div className="brand-category">
                            <span className="producto-brand">{producto.marca}</span>
                            <span className="producto-category">
                                <FaTag />
                                {producto.categoria}
                            </span>
                        </div>
                        <h1 className="producto-title">{producto.nombre}</h1>

                        <div className="producto-rating">
                            <div className="stars">
                                {renderStars(reviewStats.promedio)}
                            </div>
                            <span className="rating-text">
                                {reviewStats.total > 0
                                    ? `${reviewStats.promedio} (${reviewStats.total} reseña${reviewStats.total !== 1 ? 's' : ''})`
                                    : 'Sin reseñas aún'}
                            </span>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="producto-pricing-modern">
                        {producto.oferta ? (
                            <div className="pricing-with-discount">
                                <span className="precio-original">{formatPrice(producto.precio)}</span>
                                <span className="precio-descuento">{formatPrice(precioFinal)}</span>
                                <span className="ahorro">Ahorras {formatPrice(producto.precio - precioFinal)}</span>
                            </div>
                        ) : (
                            <span className="precio-regular">{formatPrice(producto.precio)}</span>
                        )}
                    </div>

                    {/* Estado de stock */}
                    <div className={`stock-status-modern ${stockStatus.class}`}>
                        <FaCheck />
                        <span>{stockStatus.text}</span>
                        {stockStatus.available && <span className="stock-count">({producto.stock} disponibles)</span>}
                    </div>

                    {/* Selector de cantidad y botones */}
                    {stockStatus.available && (
                        <div className="producto-actions-section">
                            <div className="cantidad-selector">
                                <label>Cantidad:</label>
                                <div className="cantidad-controls">
                                    <button
                                        className="cantidad-btn"
                                        onClick={() => handleCantidadChange('disminuir')}
                                        disabled={cantidad <= 1}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="cantidad-display">{cantidad}</span>
                                    <button
                                        className="cantidad-btn"
                                        onClick={() => handleCantidadChange('aumentar')}
                                        disabled={cantidad >= producto.stock}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <CartButton
                                    producto={producto}
                                    size="large"
                                    showQuantity={false}
                                    initialQuantity={cantidad}
                                    className="btn-add-cart"
                                />
                                {isAuthenticated && (
                                    <button
                                        className={`btn-wishlist ${producto && isInWishlist(producto.id) ? 'active' : ''}`}
                                        onClick={handleAddToWishlist}
                                    >
                                        <FaHeart />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Beneficios */}
                    <div className="producto-benefits">
                        <div className="benefit-item">
                            <FaShieldAlt />
                            <span>Garantía de 1 año</span>
                        </div>
                        <div className="benefit-item">
                            <FaTruck />
                            <span>Envío gratis en Región del Biobío</span>
                        </div>
                        <div className="benefit-item">
                            <FaUndo />
                            <span>Devolución hasta 30 días</span>
                        </div>
                    </div>

                    {/* WhatsApp consulta */}
                    <a
                        href={`https://wa.me/56912345678?text=${encodeURIComponent(`Hola, me interesa el producto: ${producto.nombre} (${producto.marca}) - ${formatPrice(precioFinal)}. ¿Está disponible?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-product"
                    >
                        <FaWhatsapp />
                        Consultar por WhatsApp
                    </a>
                </div>
            </div>

            {/* Tabs full-width: Descripción | Ficha Técnica | Reseñas */}
            <div className="detalle-tabs-section">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'descripcion' ? 'active' : ''}`}
                        onClick={() => setActiveTab('descripcion')}
                    >
                        <FaInfoCircle />
                        Descripción
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'ficha' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ficha')}
                    >
                        <FaRuler />
                        Ficha Técnica
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <FaStar />
                        Reseñas {reviewStats.total > 0 && `(${reviewStats.total})`}
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'descripcion' && (
                        <div className="tab-pane tab-descripcion">
                            <p>{producto.descripcion || 'Sin descripción disponible.'}</p>
                        </div>
                    )}

                    {activeTab === 'ficha' && (
                        <div className="tab-pane ficha-tecnica">
                            <div className="ficha-grid">
                                <table className="ficha-table">
                                    <caption>Información general</caption>
                                    <tbody>
                                        <tr><th>Marca</th><td>{producto.marca || '—'}</td></tr>
                                        <tr><th>Categoría</th><td>{producto.categoria}</td></tr>
                                        {producto.subcategoria && (
                                            <tr><th>Subcategoría</th><td>{producto.subcategoria}</td></tr>
                                        )}
                                        {producto.codigoSKU && (
                                            <tr><th>Código SKU</th><td>{producto.codigoSKU}</td></tr>
                                        )}
                                        {producto.genero && (
                                            <tr><th>Género</th><td>{producto.genero}</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                <table className="ficha-table">
                                    <caption>Especificaciones</caption>
                                    <tbody>
                                        {producto.material && (
                                            <tr><th>Material</th><td>{producto.material}</td></tr>
                                        )}
                                        {producto.forma && (
                                            <tr><th>Forma</th><td>{producto.forma}</td></tr>
                                        )}
                                        {producto.color_armazon && (
                                            <tr><th>Color armazón</th><td>{producto.color_armazon}</td></tr>
                                        )}
                                        {producto.color_cristal && (
                                            <tr><th>Color cristal</th><td>{producto.color_cristal}</td></tr>
                                        )}
                                        {producto.polarizado !== undefined && producto.polarizado !== null && (
                                            <tr><th>Polarizado</th><td>{producto.polarizado ? 'Sí' : 'No'}</td></tr>
                                        )}
                                        {producto.tipo_cristal && (
                                            <tr><th>Tipo de cristal</th><td>{producto.tipo_cristal}</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="tab-pane tab-reviews">
                            {reviewStats.total > 0 && (
                                <div className="reviews-summary-bar">
                                    <span className="reviews-average">{reviewStats.promedio}</span>
                                    <div className="reviews-average-stars">{renderStars(reviewStats.promedio, 'md')}</div>
                                    <span className="reviews-count">Basado en {reviewStats.total} reseña{reviewStats.total !== 1 ? 's' : ''}</span>
                                </div>
                            )}

                            {/* Formulario para crear reseña */}
                            {isAuthenticated && !userHasReviewed && !reviewMessage && (
                                <form className="review-form" onSubmit={handleSubmitReview}>
                                    <h3>Deja tu reseña</h3>
                                    <div className="review-rating-selector">
                                        <span>Tu calificación:</span>
                                        <div className="star-selector">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-btn ${star <= (hoverRating || newRating) ? 'active' : ''}`}
                                                    onClick={() => setNewRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                >
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        className="review-textarea"
                                        placeholder="Cuéntanos tu experiencia con este producto (opcional)"
                                        value={newComentario}
                                        onChange={(e) => setNewComentario(e.target.value)}
                                        maxLength={1000}
                                        rows={4}
                                    />
                                    {reviewError && <p className="review-error">{reviewError}</p>}
                                    <button type="submit" className="btn-submit-review" disabled={submittingReview || !newRating}>
                                        {submittingReview ? 'Enviando...' : 'Enviar reseña'}
                                    </button>
                                </form>
                            )}

                            {reviewMessage && (
                                <div className="review-success-msg">
                                    <FaCheck /> {reviewMessage}
                                </div>
                            )}

                            {userHasReviewed && !reviewMessage && (
                                <p className="review-already">Ya enviaste una reseña para este producto.</p>
                            )}

                            {!isAuthenticated && (
                                <p className="review-login-prompt">
                                    <button className="link-btn" onClick={() => navigate('/login')}>Inicia sesión</button> para dejar una reseña.
                                </p>
                            )}

                            {/* Lista de reseñas */}
                            {reviews.length > 0 ? (
                                <div className="reviews-list">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="review-card">
                                            <div className="review-card-header">
                                                <div className="review-user">
                                                    <FaUser className="review-user-icon" />
                                                    <span>{review.usuario?.primerNombre} {review.usuario?.apellidoPaterno}</span>
                                                </div>
                                                <div className="review-stars">{renderStars(review.rating)}</div>
                                            </div>
                                            {review.comentario && (
                                                <p className="review-comment">{review.comentario}</p>
                                            )}
                                            <span className="review-date">
                                                {new Date(review.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-reviews">Este producto aún no tiene reseñas aprobadas.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Productos recomendados */}
            {productosRecomendados.length > 0 && (
                <div className="productos-recomendados-section">
                    <div className="recomendados-header">
                        <h2>También te puede interesar</h2>
                        <p>Productos similares en {producto.categoria}</p>
                    </div>
                    <div className="recomendados-grid">
                        {productosRecomendados.map((prod) => (
                            <ProductCard
                                key={prod.id}
                                producto={prod}
                                viewMode="grid"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetalleProducto;
