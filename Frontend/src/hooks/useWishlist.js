import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { getAllProductos } from '../services/producto.service';

const WISHLIST_KEY_BASE = 'optica-danniels-wishlist';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const { user, loading, isAuthenticated, userChangeFlag } = useAuth();
    const previousUserRef = useRef(undefined);
    const isInitialized = useRef(false);
    const justLoaded = useRef(false);

    const getWishlistKey = useCallback(() => {
        const userRut = user?.rut;
        if (userRut) {
            return `${WISHLIST_KEY_BASE}-${userRut}`;
        }
        return `${WISHLIST_KEY_BASE}-guest`;
    }, [user?.rut]);

    const forceReloadWishlist = useCallback(() => {
        const currentUserRut = user?.rut || null;
        const wishlistKey = currentUserRut ? `${WISHLIST_KEY_BASE}-${currentUserRut}` : `${WISHLIST_KEY_BASE}-guest`;
        const savedWishlist = localStorage.getItem(wishlistKey);
        
        if (savedWishlist && savedWishlist !== '[]') {
            try {
                const parsedWishlist = JSON.parse(savedWishlist);
                setWishlist(parsedWishlist);
            } catch {
                setWishlist([]);
            }
        } else {
            setWishlist([]);
        }
        
        isInitialized.current = true;
        justLoaded.current = true;
        
        setTimeout(() => {
            justLoaded.current = false;
        }, 100);
    }, [user]);

    const validateWishlistProducts = useCallback(async () => {
        if (wishlist.length === 0) return;
        
        try {
            const response = await getAllProductos();
            const allProducts = response.productos || [];
            const existingProductIds = new Set(allProducts.map(p => p.id));
            
            const validWishlist = wishlist.filter(item => existingProductIds.has(item.id));
            
            if (validWishlist.length !== wishlist.length) {
                console.log(`Removiendo ${wishlist.length - validWishlist.length} productos eliminados de favoritos`);
                setWishlist(validWishlist);
                
                const wishlistKey = getWishlistKey();
                localStorage.setItem(wishlistKey, JSON.stringify(validWishlist));
            }
        } catch (error) {
            console.error('Error validando productos en wishlist:', error);
        }
    }, [wishlist, getWishlistKey]);

    
    useEffect(() => {
        if (wishlist.length > 0 && isInitialized.current && !justLoaded.current) {
            validateWishlistProducts();
        }
    }, [wishlist.length, validateWishlistProducts]);

    useEffect(() => {
        if (wishlist.length > 0) {
            validateWishlistProducts();
        }
    }, [validateWishlistProducts]);

    useEffect(() => {
        if (loading) return;
        
        const currentUserRut = user?.rut || null;
        const previousUserRut = previousUserRef.current;

        const userChanged = currentUserRut !== previousUserRut;
        const shouldLoad = !isInitialized.current || userChanged;
        
        if (shouldLoad) {
            previousUserRef.current = currentUserRut;
            
            forceReloadWishlist();
        }
    }, [user?.rut, user, isAuthenticated, userChangeFlag, forceReloadWishlist, loading]);

    useEffect(() => {
        const handleUserChanged = () => {
            setTimeout(() => {
                forceReloadWishlist();
            }, 50);
        };

        window.addEventListener('userChanged', handleUserChanged);
        return () => window.removeEventListener('userChanged', handleUserChanged);
    }, [forceReloadWishlist]);

    useEffect(() => {
        const handleProductoEliminado = (event) => {
            const { productoId } = event.detail;
            setWishlist(prev => {
                const newWishlist = prev.filter(item => item.id !== productoId);
                const wishlistKey = getWishlistKey();
                localStorage.setItem(wishlistKey, JSON.stringify(newWishlist));
                return newWishlist;
            });
        };

        window.addEventListener('productoEliminado', handleProductoEliminado);
        return () => window.removeEventListener('productoEliminado', handleProductoEliminado);
    }, [getWishlistKey]);

    useEffect(() => {
        if (userChangeFlag > 0) {
            setTimeout(() => {
                forceReloadWishlist();
            }, 100);
        }
    }, [userChangeFlag, forceReloadWishlist]);

    useEffect(() => {
        if (loading || !isInitialized.current || justLoaded.current) {
            return;
        }
        
        const wishlistKey = getWishlistKey();
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }, [wishlist, getWishlistKey, loading]);

    const addToWishlist = useCallback((producto) => {
        setWishlist(prev => {
            if (!prev.some(item => item.id === producto.id)) {
                return [...prev, producto];
            }
            return prev;
        });
    }, []);

    const removeFromWishlist = useCallback((productoId) => {
        setWishlist(prev => prev.filter(item => item.id !== productoId));
    }, []);

    const toggleWishlist = useCallback((producto) => {
        if (wishlist.some(item => item.id === producto.id)) {
            removeFromWishlist(producto.id);
        } else {
            addToWishlist(producto);
        }
    }, [wishlist, addToWishlist, removeFromWishlist]);

    const isInWishlist = useCallback((productoId) => {
        return wishlist.some(item => item.id === productoId);
    }, [wishlist]);

    const clearWishlist = useCallback(() => {
        setWishlist([]);
    }, []);

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        forceReloadWishlist,
        validateWishlistProducts,
        wishlistCount: wishlist.length
    };
};
