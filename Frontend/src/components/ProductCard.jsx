import '@styles/productos.css';
import WishlistButton from './WishlistButton';
import LazyImage from './LazyImage';

const ProductCard = ({ producto, viewMode = 'grid' }) => {
    const precioConDescuento = producto.oferta
        ? producto.precio * (1 - producto.descuento / 100)
        : producto.precio;

    const cardClasses = `product-card ${viewMode === 'list' ? 'list-mode' : 'grid-mode'}`;

    return (
        <div className={cardClasses}>
            <div className="product-image">
                <LazyImage
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="product-img"
                    placeholder={
                        <div className="image-skeleton">
                            <div className="skeleton-shimmer"></div>
                        </div>
                    }
                />
                {producto.oferta && <span className="product-badge">Oferta</span>}
                <WishlistButton producto={producto} size="medium" />
            </div>
            <div className="product-info">
                <div className="product-main-details">
                    <h3 className="product-name">{producto.nombre}</h3>
                    <p className="product-brand">{producto.marca}</p>
                    {viewMode === 'list' && (
                        <p className="product-category">{producto.categoria}</p>
                    )}
                </div>
                <div className="product-pricing">
                    {producto.oferta ? (
                        <>
                            <p className="product-old-price">
                                ${parseFloat(producto.precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </p>
                            <p className="product-new-price">
                                A partir de ${precioConDescuento.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CLP
                            </p>
                        </>
                    ) : (
                        <p className="product-price">
                            ${parseFloat(producto.precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CLP
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
