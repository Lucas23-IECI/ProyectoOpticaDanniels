import { useState, useEffect, useRef } from 'react';
import { getProductos } from '@services/producto.service';
import CrearProductoPopup from '@components/CrearProductoPopup';
import EditarProductoPopup from '@components/EditarProductoPopup';
import ConfirmarEliminarPopup from '@components/ConfirmarEliminarPopup';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTag, FaBox } from 'react-icons/fa';
import '@styles/admin.css';

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marcasDisponibles, setMarcasDisponibles] = useState([]);
    const [filtros, setFiltros] = useState({
        categoria: '',
        activo: '',
        busqueda: '',
        tipoBusqueda: 'nombre',
        marca: ''
    });
    const debounceRef = useRef(null);

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
        const cargarMarcas = async () => {
            try {
                const data = await getProductos({ limit: 1000 });
                const marcas = [...new Set(data.map(p => p.marca).filter(m => m && m.trim()))].sort();
                setMarcasDisponibles(marcas);
            } catch (error) {
                console.error('Error al cargar marcas:', error);
            }
        };
        
        cargarMarcas();
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        

        const hasTextSearch = filtros.busqueda && filtros.busqueda.trim() !== '';
        const delay = hasTextSearch ? 500 : 0; 
        
        debounceRef.current = setTimeout(() => {
            const cargarProductos = async () => {
                try {
                    setLoading(true);
                    
                    const filtrosParaServidor = {};
                    
                    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
                        if (filtros.tipoBusqueda === 'nombre') {
                            filtrosParaServidor.nombre = filtros.busqueda.trim();
                        } else if (filtros.tipoBusqueda === 'sku') {
                            filtrosParaServidor.codigoSKU = filtros.busqueda.trim();
                        }
                    }
                    
                    if (filtros.categoria && filtros.categoria !== '') {
                        filtrosParaServidor.categoria = filtros.categoria;
                    }
                    
                    if (filtros.activo && filtros.activo !== '') {
                        filtrosParaServidor.activo = filtros.activo === 'true';
                    }
                    
                    if (filtros.marca && filtros.marca !== '') {
                        filtrosParaServidor.marca = filtros.marca;
                    }
                    
                    filtrosParaServidor.limit = 100;
                    
                    const data = await getProductos(filtrosParaServidor);
                    setProductos(data);
                } catch (error) {
                    console.error('Error al cargar productos:', error);
                    setProductos([]);
                } finally {
                    setLoading(false);
                }
            };

            cargarProductos();
        }, delay);
        
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [filtros]);

    const handleProductoCreado = (nuevoProducto) => {
        if (nuevoProducto && nuevoProducto.id) {
            setProductos(prev => [nuevoProducto, ...prev]);
        }
    };

    const handleProductoActualizado = (productoActualizado) => {
        if (productoActualizado && productoActualizado.id) {
            setProductos(prev => 
                prev.map(p => p.id === productoActualizado.id ? productoActualizado : p)
            );
        }
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
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
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
            busqueda: '',
            tipoBusqueda: 'nombre',
            marca: ''
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

    const productosAMostrar = productos;

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
                        <label>Buscar por:</label>
                        <select
                            name="tipoBusqueda"
                            value={filtros.tipoBusqueda}
                            onChange={handleFiltroChange}
                        >
                            <option value="nombre">Nombre</option>
                            <option value="sku">SKU</option>
                        </select>
                    </div>
                    
                    <div className="filtro-group">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            name="busqueda"
                            value={filtros.busqueda}
                            onChange={handleFiltroChange}
                            placeholder={filtros.tipoBusqueda === 'nombre' ? 'Nombre del producto...' : 'Código SKU...'}
                        />
                    </div>
                    
                    <div className="filtro-group">
                        <label>Marca:</label>
                        <select
                            name="marca"
                            value={filtros.marca}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todas</option>
                            {marcasDisponibles.map(marca => (
                                <option key={marca} value={marca}>{marca}</option>
                            ))}
                        </select>
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
                    {productosAMostrar.filter(producto => producto && producto.id).map(producto => (
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