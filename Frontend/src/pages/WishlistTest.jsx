import React from 'react';
import { useWishlist } from '@hooks/useWishlist';
import { useAuth } from '@hooks/useAuth';
import { debugWishlist, clearAllWishlists, simulateProductos, createTestWishlist } from '@helpers/wishlistDebug';

const WishlistTest = () => {
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist } = useWishlist();
    const { user } = useAuth();
    const productos = simulateProductos();

    const handleCreateTestWishlist = () => {
        const userRut = user?.rut;
        createTestWishlist(userRut);
        debugWishlist();
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Prueba de Wishlist</h1>
            
            <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
                <h3>Estado actual</h3>
                <p><strong>Usuario:</strong> {user ? `${user.nombreCompleto} (${user.rut})` : 'No autenticado'}</p>
                <p><strong>Rol:</strong> {user?.rol || 'Guest'}</p>
                <p><strong>Items en wishlist:</strong> {wishlist.length}</p>
                <p><strong>Productos:</strong> {wishlist.map(item => item.nombre || item.id).join(', ') || 'Ninguno'}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={debugWishlist} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Debug Wishlist
                </button>
                <button onClick={clearAllWishlists} style={{ padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Limpiar todas las wishlists
                </button>
                <button onClick={clearWishlist} style={{ padding: '10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>
                    Limpiar wishlist actual
                </button>
                <button onClick={handleCreateTestWishlist} style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Crear wishlist de prueba
                </button>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3>Productos de prueba</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                    {productos.map(producto => (
                        <div key={producto.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h4>{producto.nombre}</h4>
                            <p>Precio: ${producto.precio}</p>
                            <button 
                                onClick={() => isInWishlist(producto.id) ? removeFromWishlist(producto.id) : addToWishlist(producto)}
                                style={{ 
                                    padding: '8px 16px', 
                                    background: isInWishlist(producto.id) ? '#dc3545' : '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {isInWishlist(producto.id) ? '💔 Quitar de favoritos' : '❤️ Agregar a favoritos'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3>Wishlist actual</h3>
                {wishlist.length === 0 ? (
                    <p>No hay productos en la wishlist</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                        {wishlist.map(item => (
                            <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#f8f9fa' }}>
                                <h4>{item.nombre}</h4>
                                <p>Precio: ${item.precio}</p>
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    style={{ 
                                        padding: '8px 16px', 
                                        background: '#dc3545', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    💔 Quitar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistTest;
