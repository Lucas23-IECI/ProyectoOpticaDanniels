import { FaTimes, FaTrash, FaSpinner } from 'react-icons/fa';
import useDeleteProducto from '@hooks/productos/useDeleteProducto';
import '@styles/crearProducto.css';

const ConfirmarEliminarPopup = ({ show, setShow, producto, onProductoDeleted }) => {
    const { handleDelete, loading } = useDeleteProducto((productoId) => {
        setShow(false);
        if (onProductoDeleted) onProductoDeleted(productoId);
    });

    const handleConfirm = () => {
        if (producto) {
            handleDelete(producto.id, producto.nombre);
        }
    };

    const handleClose = () => {
        setShow(false);
    };

    if (!show || !producto) return null;

    return (
        <div className="crear-producto-overlay">
            <div className="crear-producto-modal" style={{ maxWidth: '500px' }}>
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

                <div className="crear-producto-form" style={{ padding: '30px', textAlign: 'center' }}>
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

                    <div className="form-actions" style={{ marginTop: '25px', borderTop: 'none' }}>
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
