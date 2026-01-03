import { createContext, useContext } from 'react';

export const WishlistContext = createContext();

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlistContext debe usarse dentro de WishlistProvider');
    }
    return context;
};
