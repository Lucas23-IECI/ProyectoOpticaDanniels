import { useWishlist } from '../hooks/useWishlist';
import { WishlistContext } from './WishlistContext';

export const WishlistProvider = ({ children }) => {
    const wishlistHook = useWishlist();

    return (
        <WishlistContext.Provider value={wishlistHook}>
            {children}
        </WishlistContext.Provider>
    );
};
