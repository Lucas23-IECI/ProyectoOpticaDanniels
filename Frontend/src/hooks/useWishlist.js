import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@context/AuthContext';
import {
    getWishlist as getWishlistAPI,
    addToWishlist as addToWishlistAPI,
    removeFromWishlist as removeFromWishlistAPI,
} from '../services/wishlist.service';

const WISHLIST_GUEST_KEY = 'optica-danniels-wishlist-guest';

/**
 * Hook de wishlist híbrido:
 * - Usuario autenticado → API backend (fuente de verdad)
 * - Invitado → localStorage
 */
export const useWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const previousAuthRef = useRef(null);
    const isInitialized = useRef(false);

    // ───────────────────────────────────────
    // Cargar wishlist según modo (API o guest)
    // ───────────────────────────────────────
    const loadWishlist = useCallback(async () => {
        if (authLoading) return;

        setLoadingWishlist(true);
        try {
            if (isAuthenticated) {
                // Modo API: obtener desde backend
                const items = await getWishlistAPI();
                // Los items vienen con producto cargado (eager), extraer datos del producto
                const mapped = items.map(item => ({
                    id: item.producto?.id || item.productoId,
                    nombre: item.producto?.nombre,
                    precio: item.producto?.precio,
                    imagen_url: item.producto?.imagen_url,
                    marca: item.producto?.marca,
                    categoria: item.producto?.categoria,
                    oferta: item.producto?.oferta,
                    descuento: item.producto?.descuento,
                    stock: item.producto?.stock,
                    activo: item.producto?.activo,
                    wishlistItemId: item.id,
                }));
                setWishlist(mapped);
            } else {
                // Modo guest: localStorage
                const saved = localStorage.getItem(WISHLIST_GUEST_KEY);
                if (saved) {
                    try {
                        setWishlist(JSON.parse(saved));
                    } catch {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }
            }
        } catch (error) {
            console.error('Error al cargar wishlist:', error);
            setWishlist([]);
        } finally {
            setLoadingWishlist(false);
            isInitialized.current = true;
        }
    }, [isAuthenticated, authLoading]);

    // Cargar al montar y cuando cambia el estado de autenticación
    useEffect(() => {
        if (authLoading) return;

        const authState = isAuthenticated ? user?.id : 'guest';
        if (authState !== previousAuthRef.current || !isInitialized.current) {
            previousAuthRef.current = authState;
            loadWishlist();
        }
    }, [isAuthenticated, user?.id, authLoading, loadWishlist]);

    // Persistir wishlist de invitado en localStorage
    useEffect(() => {
        if (authLoading || !isInitialized.current || isAuthenticated) return;
        localStorage.setItem(WISHLIST_GUEST_KEY, JSON.stringify(wishlist));
    }, [wishlist, isAuthenticated, authLoading]);

    // Escuchar evento de producto eliminado (admin)
    useEffect(() => {
        const handleProductoEliminado = (event) => {
            const { productoId } = event.detail;
            setWishlist(prev => prev.filter(item => item.id !== productoId));
        };

        window.addEventListener('productoEliminado', handleProductoEliminado);
        return () => window.removeEventListener('productoEliminado', handleProductoEliminado);
    }, []);

    // ───────────────────────────────────────
    // Acciones
    // ───────────────────────────────────────
    const addToWishlist = useCallback(async (producto) => {
        // Optimistic update
        setWishlist(prev => {
            if (prev.some(item => item.id === producto.id)) return prev;
            return [...prev, producto];
        });

        if (isAuthenticated) {
            try {
                await addToWishlistAPI(producto.id);
            } catch (error) {
                // Rollback on failure
                setWishlist(prev => prev.filter(item => item.id !== producto.id));
                console.error('Error al agregar a wishlist:', error.message);
            }
        }
    }, [isAuthenticated]);

    const removeFromWishlist = useCallback(async (productoId) => {
        // Keep for rollback
        const previousWishlist = wishlist;

        // Optimistic update
        setWishlist(prev => prev.filter(item => item.id !== productoId));

        if (isAuthenticated) {
            try {
                await removeFromWishlistAPI(productoId);
            } catch (error) {
                // Rollback on failure
                setWishlist(previousWishlist);
                console.error('Error al eliminar de wishlist:', error.message);
            }
        }
    }, [isAuthenticated, wishlist]);

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

    const clearWishlist = useCallback(async () => {
        if (isAuthenticated) {
            // Remove all one by one (no bulk endpoint)
            const promises = wishlist.map(item => removeFromWishlistAPI(item.id).catch(() => {}));
            await Promise.all(promises);
        }
        setWishlist([]);
    }, [isAuthenticated, wishlist]);

    const forceReloadWishlist = useCallback(() => {
        isInitialized.current = false;
        loadWishlist();
    }, [loadWishlist]);

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        forceReloadWishlist,
        loadingWishlist,
        wishlistCount: wishlist.length,
    };
};
