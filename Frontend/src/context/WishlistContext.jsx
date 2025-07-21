import React, { createContext, useContext } from 'react';
import { useWishlist } from '../hooks/useWishlist';

export const WishlistContext = createContext();

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlistContext debe usarse dentro de WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const wishlistHook = useWishlist();

    return (
        <WishlistContext.Provider value={wishlistHook}>
            {children}
        </WishlistContext.Provider>
    );
};
