import React from 'react';
import { useWishlistContext } from '../context/WishlistContext';
import '../styles/wishlistButton.css';

const WishlistButton = ({ producto, size = 'medium' }) => {
    const { toggleWishlist, isInWishlist } = useWishlistContext();
    
    const isFavorite = isInWishlist(producto.id);
    
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(producto);
    };

    return (
        <button
            className={`wishlist-btn ${size} ${isFavorite ? 'active' : ''}`}
            onClick={handleClick}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor" 
                strokeWidth="2"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        </button>
    );
};

export default WishlistButton;
