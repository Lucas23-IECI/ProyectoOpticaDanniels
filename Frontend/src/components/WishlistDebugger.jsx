import React from 'react';
import { useWishlistContext } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import { getNombreCompleto } from '../helpers/nameHelpers';
import { clearAllWishlists } from '../utils/wishlistDebug';

const WishlistDebugger = () => {
    const { wishlist, debugWishlist, wishlistCount, isLoading } = useWishlistContext();
    const { user, isAuthenticated } = useAuth();

    const handleDebug = () => {
        debugWishlist();
    };

    const handleClearAll = () => {
        if (window.confirm('¿Estás seguro de que quieres limpiar todas las wishlists?')) {
            clearAllWishlists();
            window.location.reload();
        }
    };

    return (
        <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            background: '#f0f0f0', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '5px',
            zIndex: 9999,
            fontSize: '12px'
        }}>
            <h4>Wishlist Debug</h4>
            <p><strong>Usuario:</strong> {isAuthenticated ? getNombreCompleto(user) : 'No autenticado'}</p>
            <p><strong>ID Usuario:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Wishlist Count:</strong> {wishlistCount}</p>
            <p><strong>Wishlist Items:</strong> {wishlist.length}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Sí' : 'No'}</p>
            <button onClick={handleDebug} style={{ marginRight: '5px' }}>
                Debug Console
            </button>
            <button onClick={handleClearAll} style={{ background: 'red', color: 'white' }}>
                Clear All
            </button>
        </div>
    );
};

export default WishlistDebugger;
