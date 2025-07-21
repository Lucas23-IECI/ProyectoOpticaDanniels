import React from 'react';
import { useWishlist } from '@hooks/useWishlist';
import { useCart } from '@hooks/useCart';
import { useAuth } from '@hooks/useAuth';

const TestFinal = () => {
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist } = useWishlist();
    const { cart, addToCart, removeFromCart, updateQuantity, isInCart, getItemQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
    const { user } = useAuth();

    const productos = [
        { id: 1, nombre: 'Producto 1', precio: 100 },
        { id: 2, nombre: 'Producto 2', precio: 200 },
        { id: 3, nombre: 'Producto 3', precio: 300 }
    ];

    const debugStorage = () => {
        console.log('=== STORAGE DEBUG ===');
        console.log('Usuario actual:', user?.rut || 'guest');
        
        const allKeys = Object.keys(localStorage);
        const wishlistKeys = allKeys.filter(key => key.includes('wishlist'));
        const cartKeys = allKeys.filter(key => key.includes('cart'));
        
        console.log('Wishlist keys:', wishlistKeys);
        wishlistKeys.forEach(key => {
            console.log(`${key}:`, JSON.parse(localStorage.getItem(key) || '[]'));
        });
        
        console.log('Cart keys:', cartKeys);
        cartKeys.forEach(key => {
            console.log(`${key}:`, JSON.parse(localStorage.getItem(key) || '[]'));
        });
    };

    const clearAllStorage = () => {
        const allKeys = Object.keys(localStorage);
        const storageKeys = allKeys.filter(key => key.includes('wishlist') || key.includes('cart'));
        storageKeys.forEach(key => localStorage.removeItem(key));
        console.log('Storage limpiado');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Test Final - Wishlist & Cart</h1>
            
            <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>Estado actual</h3>
                <p><strong>Usuario:</strong> {user ? `${user.nombreCompleto} (${user.rut})` : 'No logueado'}</p>
                <p><strong>Wishlist:</strong> {wishlist.length} productos</p>
                <p><strong>Cart:</strong> {cart.length} productos únicos, {getTotalItems()} items total</p>
                <p><strong>Total:</strong> ${getTotalPrice()}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={debugStorage} style={{ marginRight: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Debug Storage
                </button>
                <button onClick={clearAllStorage} style={{ marginRight: '10px', padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Clear All Storage
                </button>
                <button onClick={clearWishlist} style={{ marginRight: '10px', padding: '10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>
                    Clear Wishlist
                </button>
                <button onClick={clearCart} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Clear Cart
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {productos.map(producto => (
                    <div key={producto.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h4>{producto.nombre}</h4>
                        <p>Precio: ${producto.precio}</p>
                        
                        <div style={{ marginBottom: '10px' }}>
                            <button 
                                onClick={() => isInWishlist(producto.id) ? removeFromWishlist(producto.id) : addToWishlist(producto)}
                                style={{ 
                                    padding: '5px 10px', 
                                    marginRight: '10px',
                                    background: isInWishlist(producto.id) ? '#dc3545' : '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px' 
                                }}
                            >
                                {isInWishlist(producto.id) ? '💔 Remove Wishlist' : '❤️ Add Wishlist'}
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button 
                                onClick={() => addToCart(producto, 1)}
                                style={{ 
                                    padding: '5px 10px', 
                                    background: '#007bff', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px' 
                                }}
                            >
                                🛒 Add to Cart
                            </button>
                            
                            {isInCart(producto.id) && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <button 
                                        onClick={() => updateQuantity(producto.id, getItemQuantity(producto.id) - 1)}
                                        style={{ padding: '2px 6px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}
                                    >
                                        -
                                    </button>
                                    <span>{getItemQuantity(producto.id)}</span>
                                    <button 
                                        onClick={() => updateQuantity(producto.id, getItemQuantity(producto.id) + 1)}
                                        style={{ padding: '2px 6px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}
                                    >
                                        +
                                    </button>
                                    <button 
                                        onClick={() => removeFromCart(producto.id)}
                                        style={{ padding: '2px 6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h3>Wishlist ({wishlist.length})</h3>
                    {wishlist.length === 0 ? (
                        <p>No hay productos en wishlist</p>
                    ) : (
                        wishlist.map(item => (
                            <div key={item.id} style={{ padding: '10px', background: '#f8f9fa', marginBottom: '5px', borderRadius: '4px' }}>
                                {item.nombre} - ${item.precio}
                            </div>
                        ))
                    )}
                </div>
                
                <div>
                    <h3>Cart ({cart.length} productos, {getTotalItems()} items)</h3>
                    {cart.length === 0 ? (
                        <p>No hay productos en cart</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} style={{ padding: '10px', background: '#f8f9fa', marginBottom: '5px', borderRadius: '4px' }}>
                                {item.nombre} - ${item.precio} x {item.cantidad} = ${item.precio * item.cantidad}
                            </div>
                        ))
                    )}
                    {cart.length > 0 && (
                        <div style={{ marginTop: '10px', padding: '10px', background: '#d4edda', borderRadius: '4px', fontWeight: 'bold' }}>
                            Total: ${getTotalPrice()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestFinal;
