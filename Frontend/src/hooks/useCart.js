import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

const CART_KEY_BASE = 'optica-danniels-cart';

export const useCart = () => {
    const [cart, setCart] = useState([]);
    const { user, loading } = useAuth();
    const currentUserRef = useRef(null);
    const hasLoadedInitial = useRef(false);
    const skipNextSave = useRef(false);

    const getCartKey = useCallback(() => {
        const userRut = user?.rut;
        if (userRut) {
            return `${CART_KEY_BASE}-${userRut}`;
        }
        return `${CART_KEY_BASE}-guest`;
    }, [user?.rut]);

    useEffect(() => {
        if (loading) return;
        
        const currentUserRut = user?.rut || null;
        const hasUserChanged = currentUserRef.current !== currentUserRut;
        
        if (hasUserChanged || !hasLoadedInitial.current) {
            currentUserRef.current = currentUserRut;
            hasLoadedInitial.current = true;
            
            skipNextSave.current = true;
            
            const cartKey = getCartKey();
            const savedCart = localStorage.getItem(cartKey);
            
            if (savedCart && savedCart !== '[]') {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    setCart(parsedCart);
                } catch {
                    setCart([]);
                }
            } else {
                setCart([]);
            }
        }
    }, [user?.rut, loading, getCartKey]);

    useEffect(() => {
        if (loading || !hasLoadedInitial.current) return;
        
        if (skipNextSave.current) {
            skipNextSave.current = false;
            return;
        }
        
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart, getCartKey, loading]);

    const addToCart = useCallback((producto, cantidad = 1) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === producto.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }
            return [...prev, { ...producto, cantidad }];
        });
    }, []);

    const removeFromCart = useCallback((productoId) => {
        setCart(prev => prev.filter(item => item.id !== productoId));
    }, []);

    const updateQuantity = useCallback((productoId, cantidad) => {
        if (cantidad <= 0) {
            removeFromCart(productoId);
            return;
        }
        
        setCart(prev => prev.map(item =>
            item.id === productoId
                ? { ...item, cantidad }
                : item
        ));
    }, [removeFromCart]);

    const isInCart = useCallback((productoId) => {
        return cart.some(item => item.id === productoId);
    }, [cart]);

    const getItemQuantity = useCallback((productoId) => {
        const item = cart.find(item => item.id === productoId);
        return item ? item.cantidad : 0;
    }, [cart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }, [cart]);

    const getTotalItems = useCallback(() => {
        return cart.reduce((total, item) => total + item.cantidad, 0);
    }, [cart]);

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
        getItemQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        cartCount: cart.length
    };
};
