import { useState, useEffect } from 'react';
import { getProductos } from '@services/producto.service';
import CrearProductoPopup from '@components/CrearProductoPopup';
import EditarProductoPopup from '@components/EditarProductoPopup';
import ConfirmarEliminarPopup from '@components/ConfirmarEliminarPopup';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTag, FaBox } from 'react-icons/fa';
import '@styles/admin.css';

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        categoria: '',
        activo: '',
        busqueda: ''
    });

    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        const cargarProductosIniciales = async () => {
            try {
                setLoading(true);
                const data = await getProductos({ limit: 100 });
                setProductos(data);
            } catch (error) {
                console.error('Error al cargar productos iniciales:', error);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosIniciales();
    }, []);

    useEffect(() => {
        const hayFiltros = Object.values(filtros).some(value => value && value.trim() !== '');
        
        if (!hayFiltros) {
            return;
        }

        const cargarProductos = async () => {
            try {
                setLoading(true);
                
                const filtrosLimpios = Object.entries(filtros).reduce((acc, [key, value]) => {
                    if (value && value.trim() !== '') {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                
                filtrosLimpios.limit = 100;
                
                const data = await getProductos(filtrosLimpios);
                setProductos(data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [filtros]);

    const handleProductoCreado = (nuevoProducto) => {
        setProductos(prev => [nuevoProducto, ...prev]);
    };

    const handleProductoActualizado = (productoActualizado) => {
        setProductos(prev => 
            prev.map(p => p.id === productoActualizado.id ? productoActualizado : p)
        );
        setProductoSeleccionado(null);
    };

    const handleProductoEliminado = (productoId) => {
        setProductos(prev => prev.filter(p => p.id !== productoId));
        setProductoSeleccionado(null);
    };

    const handleEditar = (producto) => {
        setProductoSeleccionado(producto);
        setShowEditarModal(true);
    };

    const handleEliminar = (producto) => {
        setProductoSeleccionado(producto);
        setShowEliminarModal(true);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(price);
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const limpiarFiltros = async () => {
        setFiltros({
            categoria: '',
            activo: '',
            busqueda: ''
        });
        
        try {
            setLoading(true);
            const data = await getProductos({ limit: 100 });
            setProductos(data);
        } catch (error) {
            console.error('Error al recargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const hayFiltrosActivos = Object.values(filtros).some(value => value && value.trim() !== '');

    const productosAMostrar = productos.filter(producto => {
        const matchesBusqueda = !filtros.busqueda || 
            producto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            producto.codigoSKU.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            producto.marca.toLowerCase().includes(filtros.busqueda.toLowerCase());
        
        const matchesCategoria = !filtros.categoria || producto.categoria === filtros.categoria;
        
        const matchesActivo = filtros.activo === '' || 
            (filtros.activo === 'true' && producto.activo) ||
            (filtros.activo === 'false' && !producto.activo);

        return matchesBusqueda && matchesCategoria && matchesActivo;
    });

    return (
        <div className="admin-productos">
            <div className="admin-header">
                <h1>📦 Administración de Productos</h1>
                <button 
                    className="btn-crear-producto"
                    onClick={() => setShowCrearModal(true)}
                >
                    <FaPlus /> Crear Producto
                </button>
            </div>

            <div className="filtros-section">
                <div className="filtros-row">
                    <div className="filtro-group">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            name="busqueda"
                            value={filtros.busqueda}
                            onChange={handleFiltroChange}
                            placeholder="Nombre, SKU o marca..."
                        />
                    </div>
                    
                    <div className="filtro-group">
                        <label>Categoría:</label>
                        <select
                            name="categoria"
                            value={filtros.categoria}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todas</option>
                            <option value="opticos">👓 Lentes Ópticos</option>
                            <option value="sol">🕶️ Lentes de Sol</option>
                            <option value="accesorios">🧰 Accesorios</option>
                        </select>
                    </div>
                    
                    <div className="filtro-group">
                        <label>Estado:</label>
                        <select
                            name="activo"
                            value={filtros.activo}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>

                    {hayFiltrosActivos && (
                        <div className="filtro-group">
                            <button 
                                className="btn-limpiar-filtros"
                                onClick={limpiarFiltros}
                                title="Limpiar filtros y mostrar todos los productos"
                            >
                                🗑️ Limpiar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="productos-stats">
                <div className="stat-card">
                    <FaBox />
                    <span>Total: {productos.length}</span>
                </div>
                <div className="stat-card">
                    <FaEye />
                    <span>Activos: {productos.filter(p => p.activo).length}</span>
                </div>
                <div className="stat-card">
                    <FaTag />
                    <span>En oferta: {productos.filter(p => p.oferta).length}</span>
                </div>
                <div className="stat-card">
                    <FaEyeSlash />
                    <span>Inactivos: {productos.filter(p => !p.activo).length}</span>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <p>Cargando productos...</p>
                </div>
            ) : productosAMostrar.length === 0 ? (
                <div className="empty-state">
                    <FaBox size={64} />
                    <h3>No hay productos</h3>
                    {hayFiltrosActivos ? (
                        <p>No se encontraron productos con los filtros aplicados.</p>
                    ) : (
                        <p>Aún no has creado ningún producto. ¡Crea tu primer producto!</p>
                    )}
                    {hayFiltrosActivos && (
                        <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
                            🗑️ Limpiar filtros
                        </button>
                    )}
                </div>
            ) : (
                <div className="productos-grid">
                    {productosAMostrar.map(producto => (
                        <div key={producto.id} className="produto-card">
                            <div className="produto-imagen">
                                {producto.imagen_url ? (
                                    <img 
                                        src={producto.imagen_url} 
                                        alt={producto.nombre}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="sin-imagen" style={{ display: producto.imagen_url ? 'none' : 'flex' }}>
                                    <FaBox size={40} />
                                    <span>Sin imagen</span>
                                </div>
                                
                                <div className="produto-badges">
                                    {!producto.activo && (
                                        <span className="badge inactivo">Inactivo</span>
                                    )}
                                    {producto.oferta && (
                                        <span className="badge oferta">Oferta</span>
                                    )}
                                    {producto.stock === 0 && (
                                        <span className="badge sin-stock">Sin stock</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="produto-info">
                                <h3>{producto.nombre}</h3>
                                <p className="produto-marca">{producto.marca}</p>
                                <p className="produto-sku">SKU: {producto.codigoSKU}</p>
                                <p className="produto-precio">{formatPrice(producto.precio)}</p>
                                <p className="produto-stock">Stock: {producto.stock}</p>
                            </div>
                            
                            <div className="produto-actions">
                                <button 
                                    className="btn-action edit"
                                    onClick={() => handleEditar(producto)}
                                    title="Editar producto"
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    className="btn-action delete"
                                    onClick={() => handleEliminar(producto)}
                                    title="Eliminar producto"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CrearProductoPopup
                show={showCrearModal}
                setShow={setShowCrearModal}
                onProductoCreated={handleProductoCreado}
            />

            <EditarProductoPopup
                show={showEditarModal}
                setShow={setShowEditarModal}
                producto={productoSeleccionado}
                onProductoUpdated={handleProductoActualizado}
            />

            <ConfirmarEliminarPopup
                show={showEliminarModal}
                setShow={setShowEliminarModal}
                producto={productoSeleccionado}
                onProductoDeleted={handleProductoEliminado}
            />
        </div>
    );
};

export default AdminProductos;