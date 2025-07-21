import React from 'react';
import { useWishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import '../styles/wishlist.css';

const Wishlist = () => {
    const { wishlist, clearWishlist, wishlistCount } = useWishlistContext();

    if (wishlistCount === 0) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <h1>Mis Favoritos</h1>
                    <div className="wishlist-empty">
                        <div className="empty-icon">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <h2>No tienes favoritos aún</h2>
                        <p>Agrega productos a tu lista de favoritos para encontrarlos fácilmente más tarde.</p>
                        <a href="/productos" className="btn btn-primary">
                            Explorar Productos
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="wishlist-header">
                    <h1>Mis Favoritos</h1>
                    <p>{wishlistCount} {wishlistCount === 1 ? 'producto' : 'productos'} en tu lista</p>
                    <button 
                        className="btn btn-secondary"
                        onClick={clearWishlist}
                    >
                        Limpiar Lista
                    </button>
                </div>
                
                <div className="wishlist-grid">
                    {wishlist.map(producto => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
