import { FaTimes, FaTrash, FaSpinner } from 'react-icons/fa';
import { useEffect } from 'react';
import useDeleteProducto from '@hooks/productos/useDeleteProducto';
import '@styles/crearProducto.css';

const ConfirmarEliminarPopup = ({ show, setShow, producto, onConfirm, onProductoDeleted }) => {
    const { handleDelete, loading } = useDeleteProducto((productoId) => {
        setShow(false);
        if (onProductoDeleted) onProductoDeleted(productoId);
    });

    useEffect(() => {
        if (show) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [show]);

    const handleConfirm = async () => {
        if (producto) {
            try {
                await handleDelete(producto.id, producto.nombre);
                if (onConfirm) await onConfirm();
            } catch (error) {
                console.error('Error en confirmación:', error);
            }
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    if (!show || !producto) return null;

    return (
        <div className="crear-producto-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        }} onClick={handleClose}>
            <div className="crear-producto-modal" style={{ 
                position: 'relative',
                maxWidth: '500px',
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                background: 'white'
            }} onClick={(e) => e.stopPropagation()}>
                <div className="crear-producto-header" style={{ background: 'linear-gradient(135deg, var(--error-color) 0%, #d32f2f 100%)' }}>
                    <h2>🗑️ Eliminar Producto</h2>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                        type="button"
                        disabled={loading}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="crear-producto-form" style={{ 
                    padding: '30px', 
                    textAlign: 'center',
                    overflowY: 'auto',
                    maxHeight: 'calc(90vh - 80px)'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        {producto.imagen_url && (
                            <img 
                                src={producto.imagen_url} 
                                alt={producto.nombre}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    margin: '0 auto 15px',
                                    display: 'block',
                                    border: '3px solid var(--error-color)'
                                }}
                            />
                        )}
                        
                        <h3 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>
                            ¿Estás seguro de que deseas eliminar este producto?
                        </h3>
                        
                        <div style={{
                            background: 'rgba(244, 67, 54, 0.05)',
                            border: '2px solid rgba(244, 67, 54, 0.2)',
                            borderRadius: '12px',
                            padding: '15px',
                            marginBottom: '20px'
                        }}>
                            <p style={{ fontWeight: '600', color: 'var(--error-color)', margin: '0 0 5px 0' }}>
                                {producto.nombre}
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0' }}>
                                SKU: {producto.codigoSKU} • Stock: {producto.stock}
                            </p>
                        </div>
                        
                        <p style={{ color: 'var(--text-color)', fontSize: '14px', lineHeight: '1.5' }}>
                            <strong>⚠️ Esta acción no se puede deshacer.</strong><br />
                            El producto será eliminado permanentemente del sistema.
                        </p>
                    </div>

                    <div className="form-actions" style={{ 
                        marginTop: '25px', 
                        borderTop: 'none', 
                        justifyContent: 'center !important',
                        display: 'flex',
                        gap: '16px'
                    }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="btn-create"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                                borderColor: 'transparent'
                            }}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Eliminando...
                                </>
                            ) : (
                                <>
                                    <FaTrash />
                                    Eliminar Producto
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarEliminarPopup;
