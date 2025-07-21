import React from 'react';
import { useWishlist } from '@hooks/useWishlist';
import { useAuth } from '@hooks/useAuth';

const TestSimple = () => {
    const { wishlist, addToWishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { user } = useAuth();

    const testProduct = {
        id: 999,
        nombre: 'Producto de Prueba',
        precio: 100
    };

    const debugLocalStorage = () => {
        console.log('=== DEBUG LOCALSTORAGE ===');
        const allKeys = Object.keys(localStorage);
        const wishlistKeys = allKeys.filter(key => key.includes('wishlist'));
        
        wishlistKeys.forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        });
        
        console.log('Usuario actual:', user?.rut || 'guest');
        console.log('Wishlist en memoria:', wishlist);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Test Simple - Wishlist</h1>
            
            <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px' }}>
                <p><strong>Usuario:</strong> {user?.rut || 'guest'}</p>
                <p><strong>Wishlist:</strong> {wishlist.length} items</p>
                <p><strong>Productos:</strong> {wishlist.map(item => item.nombre).join(', ') || 'Ninguno'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => addToWishlist(testProduct)}
                    style={{ marginRight: '10px', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Agregar Producto de Prueba
                </button>
                <button 
                    onClick={() => removeFromWishlist(testProduct.id)}
                    style={{ marginRight: '10px', padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Remover Producto de Prueba
                </button>
                <button 
                    onClick={clearWishlist}
                    style={{ marginRight: '10px', padding: '10px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
                >
                    Limpiar Wishlist
                </button>
                <button 
                    onClick={debugLocalStorage}
                    style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Debug LocalStorage
                </button>
            </div>

            <div>
                <h3>Instrucciones de Prueba:</h3>
                <ol>
                    <li>Logueate con un usuario</li>
                    <li>Agrega el producto de prueba</li>
                    <li>Haz debug para ver que se guardó</li>
                    <li>Cierra sesión</li>
                    <li>Vuelve a loguear con el mismo usuario</li>
                    <li>Verifica que el producto sigue ahí</li>
                </ol>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Wishlist Actual:</h3>
                {wishlist.length === 0 ? (
                    <p>No hay productos en la wishlist</p>
                ) : (
                    <ul>
                        {wishlist.map(item => (
                            <li key={item.id}>{item.nombre} - ${item.precio}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TestSimple;
