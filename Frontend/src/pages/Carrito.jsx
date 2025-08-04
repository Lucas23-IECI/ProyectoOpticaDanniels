import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { useCart } from '@context/CartContext';
import { useAuth } from '@hooks/useAuth';
import '@styles/carrito.css';

const Carrito = () => {
    const { 
        cart, 
        getTotalItems, 
        getTotalPrice, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
    } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    
    const formatPrice = (price) => {
        return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };
    
    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };
    
    const handleCheckout = () => {
        // Aquí irá la navegación al checkout cuando esté implementado
        console.log('Proceder al checkout');
    };
    
    // Si no está autenticado, redirigir
    if (!isAuthenticated) {
        return (
            <div className="carrito-container">
                <div className="carrito-not-authenticated">
                    <FaShoppingCart className="cart-icon-large" />
                    <h2>Inicia sesión para ver tu carrito</h2>
                    <p>Necesitas estar autenticado para gestionar tu carrito de compras</p>
                    <button 
                        className="btn-login"
                        onClick={() => navigate('/auth')}
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="carrito-container">
            <div className="carrito-header">
                <button 
                    className="btn-back"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    Volver
                </button>
                
                <div className="carrito-title">
                    <h1>
                        <FaShoppingCart />
                        Mi Carrito
                    </h1>
                    <p>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
                </div>
                
                {cart.length > 0 && (
                    <button 
                        className="btn-clear-cart"
                        onClick={clearCart}
                    >
                        <FaTrash />
                        Vaciar carrito
                    </button>
                )}
            </div>
            
            {cart.length === 0 ? (
                <div className="carrito-empty">
                    <FaShoppingCart className="empty-icon" />
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega algunos productos para comenzar tu compra</p>
                    <button 
                        className="btn-browse-products"
                        onClick={() => navigate('/productos')}
                    >
                        Ver productos
                    </button>
                </div>
            ) : (
                <div className="carrito-content">
                    <div className="carrito-items">
                        {cart.map((item) => (
                            <div key={item.id} className="carrito-item">
                                <div className="item-image">
                                    <img 
                                        src={item.imagen_url} 
                                        alt={item.nombre}
                                        loading="lazy"
                                    />
                                </div>
                                
                                <div className="item-info">
                                    <h3 className="item-name">{item.nombre}</h3>
                                    <p className="item-brand">{item.marca}</p>
                                    <p className="item-category">{item.categoria}</p>
                                    
                                    <div className="item-price-info">
                                        {item.oferta ? (
                                            <div className="price-with-offer">
                                                <span className="original-price">
                                                    {formatPrice(item.precio)}
                                                </span>
                                                <span className="offer-price">
                                                    {formatPrice(item.precio * (1 - item.descuento / 100))}
                                                </span>
                                                <span className="discount-badge">
                                                    -{item.descuento}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="regular-price">
                                                {formatPrice(item.precio)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="item-controls">
                                    <div className="quantity-section">
                                        <label>Cantidad:</label>
                                        <div className="quantity-controls">
                                            <button 
                                                className="qty-btn decrease"
                                                onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="quantity">{item.cantidad}</span>
                                            <button 
                                                className="qty-btn increase"
                                                onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                                                disabled={item.cantidad >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="stock-info">
                                            Stock disponible: {item.stock}
                                        </p>
                                    </div>
                                    
                                    <div className="item-total">
                                        <label>Subtotal:</label>
                                        <span className="subtotal-price">
                                            {formatPrice(item.precio * item.cantidad)}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        className="btn-remove-item"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <FaTrash />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="carrito-summary">
                        <div className="summary-card">
                            <h3>Resumen del pedido</h3>
                            
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Productos ({totalItems})</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Envío</span>
                                    <span>Por calcular</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                            
                            <button 
                                className="btn-checkout"
                                onClick={handleCheckout}
                            >
                                <FaCreditCard />
                                Proceder al pago
                            </button>
                            
                            <button 
                                className="btn-continue-shopping"
                                onClick={() => navigate('/productos')}
                            >
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carrito;