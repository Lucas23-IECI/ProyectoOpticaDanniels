import { useState, useEffect } from 'react';

const WISHLIST_KEY = 'optica-danniels-wishlist';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    // Cargar wishlist desde localStorage al inicializar
    useEffect(() => {
        const savedWishlist = localStorage.getItem(WISHLIST_KEY);
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (error) {
                console.error('Error al cargar wishlist:', error);
                setWishlist([]);
            }
        }
    }, []);

    // Guardar wishlist en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    // Agregar producto a wishlist
    const addToWishlist = (producto) => {
        setWishlist(prev => {
            if (!prev.some(item => item.id === producto.id)) {
                return [...prev, producto];
            }
            return prev;
        });
    };

    // Remover producto de wishlist
    const removeFromWishlist = (productoId) => {
        setWishlist(prev => prev.filter(item => item.id !== productoId));
    };

    // Toggle producto en wishlist
    const toggleWishlist = (producto) => {
        if (isInWishlist(producto.id)) {
            removeFromWishlist(producto.id);
        } else {
            addToWishlist(producto);
        }
    };

    // Verificar si producto está en wishlist
    const isInWishlist = (productoId) => {
        return wishlist.some(item => item.id === productoId);
    };

    // Limpiar wishlist
    const clearWishlist = () => {
        setWishlist([]);
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length
    };
};
