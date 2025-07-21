import { getNombreCompleto } from './nameHelpers';

export const debugWishlist = () => {
    console.log('=== WISHLIST DEBUG ===');
    console.log('Fecha:', new Date().toLocaleString());
    
    const allKeys = Object.keys(localStorage);
    const wishlistKeys = allKeys.filter(key => key.includes('optica-danniels-wishlist'));
    
    console.log('Claves de wishlist encontradas:', wishlistKeys);
    
    wishlistKeys.forEach(key => {
        const value = localStorage.getItem(key);
        try {
            const parsed = JSON.parse(value);
            console.log(`${key}:`, parsed, `(${parsed.length} items)`);
        } catch {
            console.log(`${key}:`, value, '(raw value)');
        }
    });
    
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            console.log('Usuario actual:', getNombreCompleto(user), `(${user.rut})`);
        } catch {
            console.log('Usuario actual:', currentUser);
        }
    } else {
        console.log('Usuario actual: No autenticado');
    }
    
    console.log('=== FIN DEBUG ===');
};

export const debugWishlistStep = (step, userRut, wishlistItems) => {
    console.log(`🔍 [${step}] Usuario: ${userRut || 'guest'} | Items: ${wishlistItems.length}`);
    if (wishlistItems.length > 0) {
        console.log('   Productos:', wishlistItems.map(item => item.nombre || item.id));
    }
};

export const clearAllWishlists = () => {
    const allKeys = Object.keys(localStorage);
    const wishlistKeys = allKeys.filter(key => key.includes('optica-danniels-wishlist'));
    
    console.log('Limpiando wishlists:', wishlistKeys);
    wishlistKeys.forEach(key => {
        localStorage.removeItem(key);
    });
    
    console.log('✅ Todas las wishlists han sido limpiadas');
};

export const createTestWishlist = (userRut) => {
    const testProducts = [
        { id: 1, nombre: 'Producto Test 1', precio: 100 },
        { id: 2, nombre: 'Producto Test 2', precio: 200 }
    ];
    
    const key = userRut ? `optica-danniels-wishlist-${userRut}` : 'optica-danniels-wishlist-guest';
    localStorage.setItem(key, JSON.stringify(testProducts));
    
    console.log(`✅ Wishlist de prueba creada para ${userRut || 'guest'}`);
    return testProducts;
};

export const simulateProductos = () => {
    return [
        {
            id: 1,
            nombre: 'Producto de prueba 1',
            precio: 100,
            imagen: 'test1.jpg'
        },
        {
            id: 2,
            nombre: 'Producto de prueba 2',
            precio: 200,
            imagen: 'test2.jpg'
        },
        {
            id: 3,
            nombre: 'Producto de prueba 3',
            precio: 300,
            imagen: 'test3.jpg'
        }
    ];
};
