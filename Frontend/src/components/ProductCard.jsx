import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaTag, FaFire, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '@hooks/useAuth';
import { formatearNombreParaURL } from '@helpers/formatData';
import '@styles/productos/product-card.css';
import '@styles/cartButton.css';
import WishlistButton from './WishlistButton';
import CartButton from './CartButton';
import LazyImage from './LazyImage';

const ProductCard = ({ 
    producto, 
    viewMode = 'grid', 
    onVerDetalle, 
    onEditar, 
    onEliminar, 
    formatearPrecio 
}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const { isAuthenticated } = useAuth();
    
    // Detectar si estamos en modo administración
    const isAdminMode = !!(onVerDetalle || onEditar || onEliminar);
    
    const precioConDescuento = producto.oferta
        ? producto.precio * (1 - producto.descuento / 100)
        : producto.precio;

    const cardClasses = `product-card-modern ${viewMode}-mode ${isAdminMode ? 'admin-mode' : ''}`;

    const formatPrice = (price) => {
        if (formatearPrecio) {
            return formatearPrecio(price);
        }
        return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const handleViewProduct = () => {
        if (onVerDetalle) {
            onVerDetalle(producto);
        } else {
            const nombreFormateado = formatearNombreParaURL(producto.nombre);
            navigate(`/productos/${nombreFormateado}`);
        }
    };

    const handleEditProduct = (e) => {
        e.stopPropagation();
        if (onEditar) {
            onEditar(producto);
        }
    };

    const handleDeleteProduct = (e) => {
        e.stopPropagation();
        if (onEliminar) {
            onEliminar(producto);
        }
    };

    const getStockStatus = () => {
        if (producto.stock === 0) return { text: 'Sin stock', class: 'out-of-stock' };
        if (producto.stock <= 5) return { text: 'Últimas unidades', class: 'low-stock' };
        return { text: 'Disponible', class: 'in-stock' };
    };

    const stockStatus = getStockStatus();

    return (
        <div 
            className={cardClasses}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-image-container">
                <div className="product-image">
                    <LazyImage
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="product-img"
                        placeholder={
                            <div className="image-skeleton-modern">
                                <div className="skeleton-shimmer"></div>
                                <FaTag />
                            </div>
                        }
                    />
                    
                    {/* Overlay con acciones - Solo aparece al hacer hover */}
                    <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
                        <div className="overlay-actions">
                            <button 
                                className="action-btn primary"
                                onClick={handleViewProduct}
                            >
                                <FaEye />
                                <span>{isAdminMode ? 'Ver detalle' : 'Ver producto'}</span>
                            </button>
                            
                            {isAdminMode ? (
                                <>
                                    {onEditar && (
                                        <button 
                                            className="action-btn secondary"
                                            onClick={handleEditProduct}
                                        >
                                            <FaEdit />
                                            <span>Editar</span>
                                        </button>
                                    )}
                                    {onEliminar && (
                                        <button 
                                            className="action-btn danger"
                                            onClick={handleDeleteProduct}
                                        >
                                            <FaTrash />
                                            <span>Eliminar</span>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <CartButton 
                                    producto={producto}
                                    size="medium"
                                    className="action-btn secondary"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="product-badges-modern">
                    {producto.oferta && (
                        <span className="badge-modern offer">
                            <FaFire />
                            -{producto.descuento}%
                        </span>
                    )}
                    {producto.stock === 0 && (
                        <span className="badge-modern out-of-stock">
                            Sin stock
                        </span>
                    )}
                    {producto.stock > 0 && producto.stock <= 5 && (
                        <span className="badge-modern low-stock">
                            <FaFire />
                            ¡Últimas!
                        </span>
                    )}
                    {!producto.activo && (
                        <span className="badge-modern inactive">
                            Inactivo
                        </span>
                    )}
                </div>

                {/* Wishlist - Solo en modo cliente y si está autenticado */}
                {!isAdminMode && isAuthenticated && (
                    <div className="wishlist-container-modern">
                        <WishlistButton producto={producto} size="medium" />
                    </div>
                )}
            </div>

            <div className="product-content-modern">
                <div className="product-header-modern">
                    <div className="product-brand-modern">{producto.marca}</div>
                    <h3 className="product-name-modern">{producto.nombre}</h3>
                </div>

                <div className="product-meta-modern">
                    <span className="product-category-modern">
                        <FaTag />
                        {producto.categoria}
                    </span>
                    {isAdminMode && (
                        <div className="admin-info">
                            <span className="sku-info">SKU: {producto.codigoSKU}</span>
                        </div>
                    )}
                </div>

                <div className="product-footer-modern">
                    <div className="pricing-modern">
                        {producto.oferta ? (
                            <div className="price-with-discount">
                                <span className="original-price">{formatPrice(producto.precio)}</span>
                                <span className="discount-price">{formatPrice(precioConDescuento)}</span>
                            </div>
                        ) : (
                            <span className="regular-price">{formatPrice(producto.precio)}</span>
                        )}
                    </div>

                    <div className="stock-info-modern">
                        <span className={`stock-status ${stockStatus.class}`}>
                            {stockStatus.text}
                            {isAdminMode && <span> ({producto.stock})</span>}
                        </span>
                    </div>
                </div>

                {/* Botones de acción para modo lista admin */}
                {viewMode === 'list' && isAdminMode && (
                    <div className="product-actions-modern admin-actions">
                        <button 
                            className="btn-modern primary"
                            onClick={handleViewProduct}
                        >
                            <FaEye />
                            Ver detalle
                        </button>
                        {onEditar && (
                            <button 
                                className="btn-modern secondary"
                                onClick={handleEditProduct}
                            >
                                <FaEdit />
                                Editar
                            </button>
                        )}
                        {onEliminar && (
                            <button 
                                className="btn-modern danger"
                                onClick={handleDeleteProduct}
                            >
                                <FaTrash />
                                Eliminar
                            </button>
                        )}
                    </div>
                )}

                {/* Botones de acción para modo grid admin - Siempre visibles */}
                {viewMode === 'grid' && isAdminMode && (
                    <div className="grid-admin-actions">
                        <button 
                            className="btn-modern small primary"
                            onClick={handleViewProduct}
                            title="Ver detalle"
                        >
                            <FaEye />
                        </button>
                        {onEditar && (
                            <button 
                                className="btn-modern small secondary"
                                onClick={handleEditProduct}
                                title="Editar"
                            >
                                <FaEdit />
                            </button>
                        )}
                        {onEliminar && (
                            <button 
                                className="btn-modern small danger"
                                onClick={handleDeleteProduct}
                                title="Eliminar"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
