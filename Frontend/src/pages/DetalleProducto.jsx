import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductos } from "@services/producto.service";
import { 
    FaArrowLeft, FaShoppingCart, FaHeart, FaShare, FaFire, 
    FaTag, FaShieldAlt, FaTruck, FaUndo, FaStar, FaCheck,
    FaPlus, FaMinus, FaEye, FaSpinner
} from "react-icons/fa";
import ProductCard from "@components/ProductCard";
import LazyImage from "@components/LazyImage";
import "@styles/detalleProducto.css";

function DetalleProducto() {
    const { nombreProducto } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [imagenActual, setImagenActual] = useState(0);
    const [wishlistAdded, setWishlistAdded] = useState(false);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoading(true);
                const limpiarNombre = (nombre) =>
                    nombre.toLowerCase().replace(/[\s-]+/g, "");

                const nombreBuscado = limpiarNombre(decodeURIComponent(nombreProducto));
                const productos = await getProductos();
                const productoEncontrado = productos.find(
                    (p) => limpiarNombre(p.nombre) === nombreBuscado
                );

                if (productoEncontrado) {
                    setProducto(productoEncontrado);
                    
                    // Obtener productos recomendados (misma categoría, excluyendo el actual)
                    const recomendados = productos
                        .filter(p => 
                            p.categoria === productoEncontrado.categoria && 
                            p.id !== productoEncontrado.id &&
                            p.activo
                        )
                        .slice(0, 4);
                    setProductosRecomendados(recomendados);
                }
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [nombreProducto]);

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
        setWishlistAdded(!wishlistAdded);
        // Aquí iría la lógica para añadir/quitar de wishlist
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

    const handleGoBack = () => {
        navigate(-1);
    };

    const getStockStatus = () => {
        if (producto.stock === 0) return { text: 'Sin stock', class: 'out-of-stock', available: false };
        if (producto.stock <= 5) return { text: 'Últimas unidades', class: 'low-stock', available: true };
        return { text: 'Disponible', class: 'in-stock', available: true };
    };

    if (loading) {
        return (
            <div className="detalle-loading-container">
                <div className="detalle-loading">
                    <FaSpinner className="spinner" />
                    <h3>Cargando producto...</h3>
                    <p>Un momento por favor</p>
                </div>
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
            {/* Header con navegación */}
            <div className="detalle-header-modern">
                <button className="btn-back-modern" onClick={handleGoBack}>
                    <FaArrowLeft />
                    <span>Volver</span>
                </button>
                <div className="header-actions">
                    <button className="action-icon" onClick={handleShare}>
                        <FaShare />
                    </button>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="detalle-main-content">
                {/* Galería de imágenes */}
                <div className="producto-gallery">
                    <div className="main-image">
                        <LazyImage
                            src={producto.imagen_url}
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
                    </div>
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
                        
                        {/* Rating simulado */}
                        <div className="producto-rating">
                            <div className="stars">
                                <FaStar className="star active" />
                                <FaStar className="star active" />
                                <FaStar className="star active" />
                                <FaStar className="star active" />
                                <FaStar className="star" />
                            </div>
                            <span className="rating-text">(4.2) • 127 reseñas</span>
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

                    {/* Descripción */}
                    <div className="producto-description-modern">
                        <h3>Descripción</h3>
                        <p>{producto.descripcion}</p>
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
                                <button className="btn-add-cart">
                                    <FaShoppingCart />
                                    Añadir al carrito
                                </button>
                                <button 
                                    className={`btn-wishlist ${wishlistAdded ? 'active' : ''}`}
                                    onClick={handleAddToWishlist}
                                >
                                    <FaHeart />
                                </button>
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
