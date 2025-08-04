import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaEye } from 'react-icons/fa';
import { useCart } from '@context/CartContext';
import { useAuth } from '@hooks/useAuth';
import '@styles/cartIcon.css';

const CartIcon = () => {
    const { 
        cart, 
        getTotalPrice, 
        getTotalItems,
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartVersion // Para forzar re-renders
    } = useCart();
    
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    
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
        setIsOpen(false);
        // Aquí irá la navegación al checkout cuando esté implementado
        console.log('Ir al checkout');
    };
    
    const handleViewCart = () => {
        setIsOpen(false);
        navigate('/carrito');
    };
    
    // No mostrar si no está autenticado
    if (!isAuthenticated) {
        return null;
    }
    
    return (
        <div 
            className="cart-icon-container" 
            ref={dropdownRef} 
            key={`cart-v${cartVersion}-${totalItems}`} // Key dinámica para forzar re-renders
        >
            <button 
                className="cart-icon-btn"
                onClick={() => setIsOpen(!isOpen)}
                title="Ver carrito"
            >
                <FaShoppingCart />
                {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                )}
            </button>
            
            {isOpen && (
                <div className="cart-dropdown">
                    <div className="cart-header">
                        <h3>Carrito de compras</h3>
                        {cart.length > 0 && (
                            <button 
                                className="clear-cart-btn"
                                onClick={clearCart}
                                title="Vaciar carrito"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                    
                    <div className="cart-content">
                        {cart.length === 0 ? (
                            <div className="cart-empty">
                                <FaShoppingCart className="empty-icon" />
                                <p>Tu carrito está vacío</p>
                                <button 
                                    className="btn-browse"
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate('/productos');
                                    }}
                                >
                                    Ver productos
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map((item) => (
                                        <div key={`item-${item.id}-v${cartVersion}`} className="cart-item">
                                            <div className="item-image">
                                                <img 
                                                    src={item.imagen_url} 
                                                    alt={item.nombre}
                                                    loading="lazy"
                                                />
                                            </div>
                                            
                                            <div className="item-details">
                                                <h4 className="item-name">{item.nombre}</h4>
                                                <p className="item-brand">{item.marca}</p>
                                                <p className="item-price">
                                                    {formatPrice(item.precio)}
                                                </p>
                                            </div>
                                            
                                            <div className="item-controls">
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
                                                
                                                <button 
                                                    className="remove-item-btn"
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Eliminar producto"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="cart-footer">
                                    <div className="cart-total">
                                        <span className="total-label">Total:</span>
                                        <span className="total-price">{formatPrice(totalPrice)}</span>
                                    </div>
                                    
                                    <div className="cart-actions">
                                        <button 
                                            className="btn-view-cart"
                                            onClick={handleViewCart}
                                        >
                                            <FaEye />
                                            Ver carrito
                                        </button>
                                        <button 
                                            className="btn-checkout"
                                            onClick={handleCheckout}
                                        >
                                            Finalizar compra
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartIcon;