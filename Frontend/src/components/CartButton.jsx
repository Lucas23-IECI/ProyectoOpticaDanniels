import { useState } from 'react';
import { FaShoppingCart, FaCheck, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '@context/CartContext';
import { useAuth } from '@hooks/useAuth';

const CartButton = ({ 
    producto, 
    size = 'medium', 
    showQuantity = false,
    className = '',
    disabled = false 
}) => {
    const { 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        isInCart, 
        getItemQuantity,
        cartVersion // Para forzar re-renders
    } = useCart();
    
    const { isAuthenticated } = useAuth();
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);
    
    const inCart = isInCart(producto.id);
    const currentQuantity = getItemQuantity(producto.id);
    const isOutOfStock = producto.stock === 0;
    
    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (isOutOfStock || disabled) return;
        
        addToCart(producto, 1);
        
        // Mostrar feedback visual
        setShowAddedFeedback(true);
        setTimeout(() => setShowAddedFeedback(false), 1500);
    };
    
    const handleRemoveFromCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeFromCart(producto.id);
    };
    
    const handleQuantityChange = (e, newQuantity) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (newQuantity <= 0) {
            removeFromCart(producto.id);
        } else if (newQuantity <= producto.stock) {
            updateQuantity(producto.id, newQuantity);
        }
    };
    
    const incrementQuantity = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const newQuantity = currentQuantity + 1;
        if (newQuantity <= producto.stock) {
            updateQuantity(producto.id, newQuantity);
        }
    };
    
    const decrementQuantity = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const newQuantity = currentQuantity - 1;
        if (newQuantity <= 0) {
            removeFromCart(producto.id);
        } else {
            updateQuantity(producto.id, newQuantity);
        }
    };
    
    // Si no está autenticado, no mostramos el botón
    if (!isAuthenticated) {
        return null;
    }
    
    // Si el producto está agotado
    if (isOutOfStock) {
        return (
            <button 
                className={`cart-btn cart-btn-${size} out-of-stock ${className}`}
                disabled={true}
                title="Producto agotado"
            >
                <FaShoppingCart />
                <span>Agotado</span>
            </button>
        );
    }
    
    // Si está en el carrito y queremos mostrar cantidad
    if (inCart && showQuantity) {
        return (
            <div 
                className={`cart-quantity-controls cart-controls-${size} ${className}`}
                key={`controls-${producto.id}-v${cartVersion}-${currentQuantity}`} // Key dinámica
            >
                <button 
                    className="quantity-btn decrease"
                    onClick={decrementQuantity}
                    title="Disminuir cantidad"
                >
                    <FaMinus />
                </button>
                
                <span className="quantity-display">
                    {currentQuantity}
                </span>
                
                <button 
                    className="quantity-btn increase"
                    onClick={incrementQuantity}
                    disabled={currentQuantity >= producto.stock}
                    title="Aumentar cantidad"
                >
                    <FaPlus />
                </button>
                
                <button 
                    className="remove-from-cart-btn"
                    onClick={handleRemoveFromCart}
                    title="Eliminar del carrito"
                >
                    ×
                </button>
            </div>
        );
    }
    
    // Si está en el carrito pero no mostramos cantidad
    if (inCart) {
        return (
            <button 
                className={`cart-btn cart-btn-${size} in-cart ${className}`}
                onClick={handleRemoveFromCart}
                title={`En carrito (${currentQuantity}) - Click para eliminar`}
                key={`btn-${producto.id}-v${cartVersion}-${currentQuantity}`} // Key dinámica
            >
                <FaCheck />
                <span>En carrito ({currentQuantity})</span>
            </button>
        );
    }
    
    // Botón normal para agregar al carrito
    return (
        <button 
            className={`cart-btn cart-btn-${size} ${showAddedFeedback ? 'added' : ''} ${className}`}
            onClick={handleAddToCart}
            disabled={disabled}
            title="Agregar al carrito"
            key={`add-${producto.id}-v${cartVersion}`} // Key dinámica
        >
            {showAddedFeedback ? (
                <>
                    <FaCheck />
                    <span>¡Agregado!</span>
                </>
            ) : (
                <>
                    <FaShoppingCart />
                    <span>Agregar</span>
                </>
            )}
        </button>
    );
};

export default CartButton;