import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';

const CartContext = createContext();

const CART_KEY_BASE = 'optica-danniels-cart';

// Tipos de acciones
const CART_ACTIONS = {
    LOAD_CART: 'LOAD_CART',
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART'
};

// Reducer del carrito - Patrón usado por sitios exitosos
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.LOAD_CART:
            return {
                ...state,
                items: action.payload.items || [],
                version: state.version + 1
            };

        case CART_ACTIONS.ADD_ITEM: {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            let newItems;
            
            if (existingItem) {
                newItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, cantidad: item.cantidad + (action.payload.cantidad || 1) }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, cantidad: action.payload.cantidad || 1 }];
            }

            // Guardar inmediatamente en localStorage
            localStorage.setItem(action.payload.cartKey, JSON.stringify(newItems));
            
            return {
                ...state,
                items: newItems,
                version: state.version + 1
            };
        }

        case CART_ACTIONS.REMOVE_ITEM: {
            const newItems = state.items.filter(item => item.id !== action.payload.productId);
            
            // Guardar inmediatamente en localStorage
            localStorage.setItem(action.payload.cartKey, JSON.stringify(newItems));
            
            return {
                ...state,
                items: newItems,
                version: state.version + 1
            };
        }

        case CART_ACTIONS.UPDATE_QUANTITY: {
            let newItems;
            
            if (action.payload.cantidad <= 0) {
                newItems = state.items.filter(item => item.id !== action.payload.productId);
            } else {
                newItems = state.items.map(item =>
                    item.id === action.payload.productId
                        ? { ...item, cantidad: action.payload.cantidad }
                        : item
                );
            }

            // Guardar inmediatamente en localStorage
            localStorage.setItem(action.payload.cartKey, JSON.stringify(newItems));
            
            return {
                ...state,
                items: newItems,
                version: state.version + 1
            };
        }

        case CART_ACTIONS.CLEAR_CART: {
            // Guardar inmediatamente en localStorage
            localStorage.setItem(action.payload.cartKey, JSON.stringify([]));
            
            return {
                ...state,
                items: [],
                version: state.version + 1
            };
        }

        default:
            return state;
    }
};

// Provider del carrito
export const CartProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        version: 0
    });

    // Función para obtener la clave del carrito
    const getCartKey = () => {
        const userRut = user?.rut;
        return userRut ? `${CART_KEY_BASE}-${userRut}` : `${CART_KEY_BASE}-guest`;
    };

    // Cargar carrito al cambiar usuario o al inicializar
    useEffect(() => {
        const cartKey = getCartKey();
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart);
                dispatch({
                    type: CART_ACTIONS.LOAD_CART,
                    payload: { items }
                });
            } catch (error) {
                console.error('Error loading cart:', error);
                localStorage.setItem(cartKey, JSON.stringify([]));
            }
        }
    }, [user?.rut, isAuthenticated]);

    // Funciones del carrito
    const addToCart = (producto, cantidad = 1) => {
        dispatch({
            type: CART_ACTIONS.ADD_ITEM,
            payload: { ...producto, cantidad, cartKey: getCartKey() }
        });
    };

    const removeFromCart = (productId) => {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload: { productId, cartKey: getCartKey() }
        });
    };

    const updateQuantity = (productId, cantidad) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { productId, cantidad, cartKey: getCartKey() }
        });
    };

    const clearCart = () => {
        dispatch({
            type: CART_ACTIONS.CLEAR_CART,
            payload: { cartKey: getCartKey() }
        });
    };

    // Funciones de utilidad
    const isInCart = (productId) => {
        return state.items.some(item => item.id === productId);
    };

    const getItemQuantity = (productId) => {
        const item = state.items.find(item => item.id === productId);
        return item ? item.cantidad : 0;
    };

    const getTotalPrice = () => {
        return state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.cantidad, 0);
    };

    const value = {
        // Estado
        cart: state.items,
        cartVersion: state.version, // Para forzar re-renders
        
        // Funciones
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        getTotalPrice,
        getTotalItems,
        
        // Métricas
        cartCount: state.items.length,
        totalItems: getTotalItems()
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de CartProvider');
    }
    return context;
};

export default CartContext;