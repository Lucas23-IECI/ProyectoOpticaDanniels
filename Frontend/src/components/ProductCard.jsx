import '@styles/productos.css';
import WishlistButton from './WishlistButton';

const ProductCard = ({ producto }) => {
    const precioConDescuento = producto.oferta
        ? producto.precio * (1 - producto.descuento / 100)
        : producto.precio;

    return (
        <div className="product-card">
            <div className="product-image">
                <img
                    src={producto.imagen_url || 'https://via.placeholder.com/250x250.png?text=Producto'}
                    alt={producto.nombre}
                />
                {producto.oferta && <span className="product-badge">Oferta</span>}
                <WishlistButton producto={producto} size="medium" />
            </div>
            <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <p className="product-brand">{producto.marca}</p>
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
    );
};

export default ProductCard;
