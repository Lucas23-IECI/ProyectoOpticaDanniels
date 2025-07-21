import React from 'react';
import { useWishlist } from '@hooks/useWishlist';
import { useAuth } from '@hooks/useAuth';

const PruebaWishlist = () => {
    const { wishlist, addToWishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { user, refreshUser } = useAuth();

    const productosPrueba = [
        { id: 1, nombre: 'Gafas de Sol Ray-Ban', precio: 150 },
        { id: 2, nombre: 'Lentes Oakley', precio: 200 },
        { id: 3, nombre: 'Marcos Gucci', precio: 300 }
    ];

    const mostrarEstadoLocalStorage = () => {
        console.log('=== ESTADO DEL LOCALSTORAGE ===');
        const keys = Object.keys(localStorage);
        const wishlistKeys = keys.filter(key => key.includes('wishlist'));
        
        wishlistKeys.forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        });
        
        console.log(`Usuario actual: ${user?.rut || 'guest'}`);
        console.log(`Wishlist actual: ${JSON.stringify(wishlist)}`);
    };

    const mostrarEstadoCompleto = () => {
        console.log('=== ESTADO COMPLETO DEL LOCALSTORAGE ===');
        const keys = Object.keys(localStorage);
        const wishlistKeys = keys.filter(key => key.includes('wishlist'));
        
        console.log('🔍 Todas las claves de wishlist encontradas:', wishlistKeys);
        
        wishlistKeys.forEach(key => {
            const value = localStorage.getItem(key);
            try {
                const parsed = JSON.parse(value);
                console.log(`📋 ${key}: ${parsed.length} items`, parsed);
            } catch {
                console.log(`📋 ${key}: ERROR al parsear`);
            }
        });
        
        console.log('👤 Usuario actual:', user?.rut || 'guest');
        console.log('❤️ Wishlist en memoria:', wishlist.length, 'items');
        console.log('🔄 Wishlist productos:', wishlist.map(p => p.nombre));
        console.log('=== FIN DEL ESTADO ===');
    };

    const limpiarTodoLocalStorage = () => {
        const keys = Object.keys(localStorage);
        const wishlistKeys = keys.filter(key => key.includes('wishlist'));
        
        wishlistKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('🗑️ TODAS las wishlists eliminadas del localStorage');
        console.log('🔄 Recarga la página para ver el efecto');
    };

    const crearWishlistsPrueba = () => {
        const testData = {
            '12345678-9': [
                { id: 1, nombre: 'Producto Usuario 1A', precio: 100 },
                { id: 2, nombre: 'Producto Usuario 1B', precio: 150 }
            ],
            '98765432-1': [
                { id: 3, nombre: 'Producto Usuario 2A', precio: 200 },
                { id: 4, nombre: 'Producto Usuario 2B', precio: 250 }
            ],
            'guest': [
                { id: 5, nombre: 'Producto Guest A', precio: 50 },
                { id: 6, nombre: 'Producto Guest B', precio: 75 }
            ]
        };

        Object.entries(testData).forEach(([userRut, products]) => {
            const key = userRut === 'guest' ? 'optica-danniels-wishlist-guest' : `optica-danniels-wishlist-${userRut}`;
            localStorage.setItem(key, JSON.stringify(products));
        });

        console.log('✅ Wishlists de prueba creadas para múltiples usuarios');
        mostrarEstadoCompleto();
    };

    const simularLogin = () => {
        const usuarioTest = {
            rut: '12345678-9',
            nombre: 'Usuario Test',
            email: 'test@test.com'
        };
        
        localStorage.setItem('token', 'fake-token-for-testing');
        localStorage.setItem('user', JSON.stringify(usuarioTest));
        
        refreshUser();
        
        console.log('🔐 Login simulado para usuario:', usuarioTest.rut);
    };

    const simularLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        refreshUser();
        
        console.log('🚪 Logout simulado');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🧪 Prueba de Wishlist</h1>
            
            <div style={{ 
                background: '#f0f0f0', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px' 
            }}>
                <h2>Estado Actual</h2>
                <p><strong>👤 Usuario:</strong> {user?.rut || 'No logueado (guest)'}</p>
                <p><strong>❤️ Wishlist:</strong> {wishlist.length} productos</p>
                <p><strong>📝 Productos:</strong> {wishlist.map(p => p.nombre).join(', ') || 'Ninguno'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={mostrarEstadoLocalStorage}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        marginRight: '10px'
                    }}
                >
                    🔍 Ver LocalStorage
                </button>
                <button 
                    onClick={mostrarEstadoCompleto}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#17a2b8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        marginRight: '10px'
                    }}
                >
                    🔍 Ver Estado Completo
                </button>
                <button 
                    onClick={clearWishlist}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        marginRight: '10px'
                    }}
                >
                    🗑️ Limpiar Wishlist
                </button>
                <button 
                    onClick={limpiarTodoLocalStorage}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        marginRight: '10px'
                    }}
                >
                    🗑️ Limpiar Todo
                </button>
                <button 
                    onClick={crearWishlistsPrueba}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        marginRight: '10px'
                    }}
                >
                    🧪 Crear Wishlists Test
                </button>
                <button 
                    onClick={simularLogin}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        marginRight: '10px'
                    }}
                >
                    🔐 Simular Login
                </button>
                <button 
                    onClick={simularLogout}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px'
                    }}
                >
                    🚪 Simular Logout
                </button>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px' 
            }}>
                {productosPrueba.map(producto => {
                    const estaEnWishlist = wishlist.some(item => item.id === producto.id);
                    
                    return (
                        <div 
                            key={producto.id} 
                            style={{ 
                                border: '2px solid #ddd', 
                                padding: '20px', 
                                borderRadius: '8px',
                                background: estaEnWishlist ? '#e8f5e8' : 'white'
                            }}
                        >
                            <h3>{producto.nombre}</h3>
                            <p><strong>Precio:</strong> ${producto.precio}</p>
                            <button 
                                onClick={() => {
                                    if (estaEnWishlist) {
                                        removeFromWishlist(producto.id);
                                    } else {
                                        addToWishlist(producto);
                                    }
                                }}
                                style={{ 
                                    padding: '10px 20px', 
                                    background: estaEnWishlist ? '#dc3545' : '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {estaEnWishlist ? '💔 Quitar de Favoritos' : '❤️ Agregar a Favoritos'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                background: '#fff3cd', 
                borderRadius: '8px' 
            }}>
                <h3>🔬 Instrucciones de Prueba</h3>
                <ol>
                    <li><strong>Crea datos de prueba</strong> haciendo clic en "Crear Wishlists Test"</li>
                    <li><strong>Verifica el estado completo</strong> con "Ver Estado Completo"</li>
                    <li><strong>Simula logout</strong> para estar como guest</li>
                    <li><strong>Agrega productos</strong> a la wishlist como guest</li>
                    <li><strong>Simula login</strong> - la wishlist debería cambiar automáticamente</li>
                    <li><strong>Agrega productos</strong> como usuario logueado</li>
                    <li><strong>Simula logout</strong> - debería volver a la wishlist de guest</li>
                    <li><strong>Simula login</strong> - debería volver a la wishlist del usuario</li>
                </ol>
                <p><strong>🎯 Objetivo:</strong> Verificar que la wishlist cambie automáticamente sin necesidad de F5</p>
            </div>
        </div>
    );
};

export default PruebaWishlist;
