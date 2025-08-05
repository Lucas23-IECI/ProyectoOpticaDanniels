import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '@services/producto.service';
import { 
    FaArrowLeft, FaEdit, FaTrash, FaTag, FaBox, FaWarehouse, 
    FaDollarSign, FaPercent, FaEye, FaEyeSlash, FaImage,
    FaSpinner, FaCalendarAlt, FaBarcode
} from 'react-icons/fa';
import LazyImage from './LazyImage';
import '@styles/productoDetalle.css';

const ProductoDetalle = ({ producto: productoProps, onEdit, onDelete, showActions = true, onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(productoProps || null);
    const [loading, setLoading] = useState(!productoProps);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProductoById(id);
                setProducto(data);
            } catch (error) {
                console.error('Error al cargar producto:', error);
                setError('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };

        if (id && !productoProps) {
            cargarProducto();
        }
    }, [id, productoProps]);

    const formatearPrecio = (precio) => {
        if (!precio) return '$0';
        return `$${precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleVolver = () => {
        if (onClose) {
            onClose();
        } else {
            // Verificar si hay historial previo y si es una página válida
            if (window.history.length > 1) {
                // Intentar volver al historial anterior
                navigate(-1);
            } else {
                // Si no hay historial, ir directamente a productos
                navigate('/productos');
            }
        }
    };

    const handleEditar = () => {
        if (onEdit) {
            onEdit(producto);
        }
    };

    const handleEliminar = () => {
        if (onDelete) {
            onDelete(producto);
        }
    };

    if (loading) {
        return (
            <div className="detalle-container">
                <div className="detalle-loading">
                    <FaSpinner className="spinner" />
                    <p>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detalle-container">
                <div className="detalle-error">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={handleVolver}>
                        <FaArrowLeft /> Volver
                    </button>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="detalle-container">
                <div className="detalle-error">
                    <p>Producto no encontrado</p>
                    <button className="btn btn-primary" onClick={handleVolver}>
                        <FaArrowLeft /> Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="detalle-container">
            <div className="detalle-header">
                <button className="btn btn-secondary" onClick={handleVolver}>
                    <FaArrowLeft /> Volver
                </button>
                
                {showActions && (
                    <div className="detalle-actions">
                        <button className="btn btn-primary" onClick={handleEditar}>
                            <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger" onClick={handleEliminar}>
                            <FaTrash /> Eliminar
                        </button>
                    </div>
                )}
            </div>

            <div className="detalle-content">
                <div className="detalle-imagen-section">
                    <div className="imagen-container">
                        <LazyImage
                            src={producto.imagen_url}
                            alt={producto.nombre}
                            className="product-detail"
                            placeholder={
                                <div className="imagen-placeholder">
                                    <FaImage />
                                    <p>Sin imagen</p>
                                </div>
                            }
                        />
                    </div>
                    
                    <div className="imagen-info">
                        <div className="badges-container">
                            {producto.oferta && (
                                <span className="badge badge-offer">
                                    <FaPercent /> {producto.descuento}% OFF
                                </span>
                            )}
                            <span className={`badge ${producto.activo ? 'badge-active' : 'badge-inactive'}`}>
                                {producto.activo ? (
                                    <><FaEye /> Activo</>
                                ) : (
                                    <><FaEyeSlash /> Inactivo</>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detalle-info-section">
                    <div className="info-header">
                        <h1 className="producto-titulo">{producto.nombre}</h1>
                        <div className="precio-principal">
                            {producto.oferta && producto.descuento > 0 ? (
                                <div className="precio-oferta">
                                    <span className="precio-original">
                                        {formatearPrecio(producto.precio)}
                                    </span>
                                    <span className="precio-descuento">
                                        {formatearPrecio(producto.precio * (1 - producto.descuento / 100))}
                                    </span>
                                </div>
                            ) : (
                                <span className="precio-normal">
                                    {formatearPrecio(producto.precio)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-card-header">
                                <FaTag className="info-icon" />
                                <h3>Información General</h3>
                            </div>
                            <div className="info-card-content">
                                <div className="info-row">
                                    <span className="info-label">Marca:</span>
                                    <span className="info-value">{producto.marca}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Categoría:</span>
                                    <span className="info-value">{producto.categoria}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Código SKU:</span>
                                    <span className="info-value codigo-sku">
                                        <FaBarcode /> {producto.codigoSKU}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-card-header">
                                <FaDollarSign className="info-icon" />
                                <h3>Información Comercial</h3>
                            </div>
                            <div className="info-card-content">
                                <div className="info-row">
                                    <span className="info-label">Precio:</span>
                                    <span className="info-value precio-valor">
                                        {formatearPrecio(producto.precio)}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Descuento:</span>
                                    <span className="info-value">
                                        {producto.descuento}%
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">En oferta:</span>
                                    <span className={`info-value ${producto.oferta ? 'text-success' : 'text-muted'}`}>
                                        {producto.oferta ? 'Sí' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-card-header">
                                <FaWarehouse className="info-icon" />
                                <h3>Inventario</h3>
                            </div>
                            <div className="info-card-content">
                                <div className="info-row">
                                    <span className="info-label">Stock:</span>
                                    <span className={`info-value stock-valor ${producto.stock < 10 ? 'stock-bajo' : 'stock-normal'}`}>
                                        <FaBox /> {producto.stock} unidades
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Estado:</span>
                                    <span className={`info-value ${producto.activo ? 'text-success' : 'text-danger'}`}>
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-card-header">
                                <FaCalendarAlt className="info-icon" />
                                <h3>Fechas</h3>
                            </div>
                            <div className="info-card-content">
                                <div className="info-row">
                                    <span className="info-label">Creado:</span>
                                    <span className="info-value">
                                        {formatearFecha(producto.createdAt)}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Actualizado:</span>
                                    <span className="info-value">
                                        {formatearFecha(producto.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {producto.descripcion && (
                        <div className="descripcion-section">
                            <h3>Descripción</h3>
                            <div className="descripcion-content">
                                <p>{producto.descripcion}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;
