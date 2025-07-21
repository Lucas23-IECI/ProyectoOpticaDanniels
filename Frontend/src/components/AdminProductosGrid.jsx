import { useState, useEffect, useRef, useCallback } from 'react';
import { getProductos } from '@services/producto.service';
import CrearProductoPopup from '@components/CrearProductoPopup';
import EditarProductoPopup from '@components/EditarProductoPopup';
import ConfirmarEliminarPopup from '@components/ConfirmarEliminarPopup';
import { 
    FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTag, FaBox, 
    FaSearch, FaFilter, FaTh, FaList, FaTable, FaChevronLeft, 
    FaChevronRight, FaSpinner, FaSort, FaSortUp, FaSortDown,
    FaImage, FaDollarSign, FaWarehouse, FaPercent
} from 'react-icons/fa';
import '@styles/adminProductosGrid.css';

const AdminProductosGrid = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProductos, setTotalProductos] = useState(0);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    
    const [filtros, setFiltros] = useState({
        busqueda: '',
        categoria: '',
        marca: '',
        activo: '',
        oferta: '',
        precioMin: '',
        precioMax: '',
        stockMin: '',
        stockMax: ''
    });
    const [ordenamiento, setOrdenamiento] = useState({
        campo: 'nombre',
        direccion: 'asc'
    });
    
    const [vistaActual, setVistaActual] = useState('grid');
    const [showFiltros, setShowFiltros] = useState(false);
    
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [marcasDisponibles, setMarcasDisponibles] = useState([]);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    const debounceRef = useRef(null);
    const scrollRef = useRef(null);

    const cargarProductos = useCallback(async (resetPagina = false) => {
        try {
            setLoading(true);
            setError(null);
            
            const pagina = resetPagina ? 1 : currentPage;
            
            const params = {
                page: pagina,
                limit: itemsPerPage,
                search: filtros.busqueda.trim(),
                categoria: filtros.categoria,
                marca: filtros.marca,
                activo: filtros.activo,
                oferta: filtros.oferta,
                precioMin: filtros.precioMin,
                precioMax: filtros.precioMax,
                stockMin: filtros.stockMin,
                stockMax: filtros.stockMax,
                sortBy: ordenamiento.campo,
                sortOrder: ordenamiento.direccion
            };

            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null || params[key] === undefined) {
                    delete params[key];
                }
            });
            
            const response = await getProductos(params);
            
            if (response && response.data) {
                setProductos(response.data);
                setTotalProductos(response.total || 0);
                setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
                
                if (resetPagina) {
                    setCurrentPage(1);
                }
            } else {
                setProductos([]);
                setTotalProductos(0);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar productos');
            setProductos([]);
            setTotalProductos(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, filtros, ordenamiento]);

    const cargarDatosAuxiliares = useCallback(async () => {
        try {
            const response = await getProductos({ limit: 1000 });
            const productos = response.data || response || [];

            const marcas = [...new Set(productos.map(p => p.marca).filter(m => m && m.trim()))].sort();
            setMarcasDisponibles(marcas);

            const categorias = [...new Set(productos.map(p => p.categoria).filter(c => c && c.trim()))].sort();
            setCategoriasDisponibles(categorias);
        } catch (error) {
            console.error('Error al cargar datos auxiliares:', error);
        }
    }, []);

    useEffect(() => {
        cargarDatosAuxiliares();
    }, [cargarDatosAuxiliares]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            cargarProductos(true);
        }, 300);
        
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [filtros, ordenamiento, itemsPerPage, cargarProductos]);

    useEffect(() => {
        if (currentPage > 1) {
            cargarProductos(false);
        }
    }, [currentPage, cargarProductos]);

    const handleFiltroChange = useCallback((campo, valor) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    }, []);

    const handleOrdenamientoChange = useCallback((campo) => {
        setOrdenamiento(prev => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const limpiarFiltros = useCallback(() => {
        setFiltros({
            busqueda: '',
            categoria: '',
            marca: '',
            activo: '',
            oferta: '',
            precioMin: '',
            precioMax: '',
            stockMin: '',
            stockMax: ''
        });
    }, []);

    const formatearPrecio = (precio) => {
        if (!precio) return '$0';
        return `$${precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    const getOrdenIcon = (campo) => {
        if (ordenamiento.campo !== campo) return <FaSort />;
        return ordenamiento.direccion === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const handleCrearProducto = () => {
        setShowCrearModal(true);
    };

    const handleEditarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setShowEditarModal(true);
    };

    const handleEliminarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setShowEliminarModal(true);
    };

    const handleProductoCreado = () => {
        cargarProductos(false);
    };

    const handleProductoActualizado = (productoActualizado) => {
        setProductos(prev => 
            prev.map(p => p.id === productoActualizado.id ? productoActualizado : p)
        );
    };

    const handleProductoEliminado = async () => {
        try {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            setProductos(prevProductos => 
                prevProductos.filter(producto => producto.id !== productoSeleccionado.id)
            );
            setTotalProductos(prev => prev - 1);
            
            window.dispatchEvent(new CustomEvent('productoEliminado', { 
                detail: { productoId: productoSeleccionado.id } 
            }));
            
            setShowEliminarModal(false);
            setProductoSeleccionado(null);
            
            await cargarProductos(false);
            
            setTimeout(() => {
                window.scrollTo(0, scrollPosition);
            }, 100);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
            setCurrentPage(nuevaPagina);
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const renderHeader = () => (
        <div className="admin-header">
            <div className="header-title">
                <FaBox className="header-icon" />
                <h1>Administración de Productos</h1>
                <span className="product-count">({totalProductos} productos)</span>
            </div>
            
            <div className="header-actions">
                <button 
                    className="btn btn-primary"
                    onClick={handleCrearProducto}
                >
                    <FaPlus /> Crear Producto
                </button>
                
                <div className="view-controls">
                    <button 
                        className={`btn ${vistaActual === 'grid' ? 'active' : ''}`}
                        onClick={() => setVistaActual('grid')}
                        title="Vista Cuadriculada"
                    >
                        <FaTh />
                    </button>
                    <button 
                        className={`btn ${vistaActual === 'list' ? 'active' : ''}`}
                        onClick={() => setVistaActual('list')}
                        title="Vista Lista"
                    >
                        <FaList />
                    </button>
                    <button 
                        className={`btn ${vistaActual === 'table' ? 'active' : ''}`}
                        onClick={() => setVistaActual('table')}
                        title="Vista Tabla"
                    >
                        <FaTable />
                    </button>
                </div>
                
                <button 
                    className={`btn ${showFiltros ? 'active' : ''}`}
                    onClick={() => setShowFiltros(!showFiltros)}
                >
                    <FaFilter /> Filtros
                </button>
            </div>
        </div>
    );

    const renderFiltros = () => (
        <div className={`filtros-container ${showFiltros ? 'active' : ''}`}>
            <div className="filtros-grid">
                <div className="filtro-group">
                    <label>Buscar:</label>
                    <div className="search-input-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, SKU, marca..."
                            value={filtros.busqueda}
                            onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="filtro-group">
                    <label>Categoría:</label>
                    <select 
                        value={filtros.categoria}
                        onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categoriasDisponibles.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filtro-group">
                    <label>Marca:</label>
                    <select 
                        value={filtros.marca}
                        onChange={(e) => handleFiltroChange('marca', e.target.value)}
                    >
                        <option value="">Todas las marcas</option>
                        {marcasDisponibles.map(marca => (
                            <option key={marca} value={marca}>{marca}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filtro-group">
                    <label>Estado:</label>
                    <select 
                        value={filtros.activo}
                        onChange={(e) => handleFiltroChange('activo', e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
                
                <div className="filtro-group">
                    <label>Oferta:</label>
                    <select 
                        value={filtros.oferta}
                        onChange={(e) => handleFiltroChange('oferta', e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="true">En oferta</option>
                        <option value="false">Sin oferta</option>
                    </select>
                </div>
                
                <div className="filtro-group">
                    <label>Precio min:</label>
                    <input
                        type="number"
                        placeholder="$0"
                        value={filtros.precioMin}
                        onChange={(e) => handleFiltroChange('precioMin', e.target.value)}
                    />
                </div>
                
                <div className="filtro-group">
                    <label>Precio max:</label>
                    <input
                        type="number"
                        placeholder="$999999"
                        value={filtros.precioMax}
                        onChange={(e) => handleFiltroChange('precioMax', e.target.value)}
                    />
                </div>
                
                <div className="filtro-group">
                    <label>Stock min:</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={filtros.stockMin}
                        onChange={(e) => handleFiltroChange('stockMin', e.target.value)}
                    />
                </div>
                
                <div className="filtro-actions">
                    <button 
                        className="btn btn-secondary"
                        onClick={limpiarFiltros}
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPaginacion = () => (
        <div className="pagination-container">
            <div className="pagination-info">
                <span>Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalProductos)} de {totalProductos} productos</span>
                
                <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    className="items-per-page"
                >
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                </select>
            </div>
            
            <div className="pagination-controls">
                <button 
                    className="btn"
                    onClick={() => cambiarPagina(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft />
                </button>
                
                <div className="pagination-numbers">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <button
                                key={pageNum}
                                className={`btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => cambiarPagina(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
                
                <button 
                    className="btn"
                    onClick={() => cambiarPagina(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
    const renderVistaGrid = () => (
        <div className="productos-grid">
            {productos.map(producto => (
                <div key={producto.id} className="producto-card">
                    <div className="producto-image-container">
                        {producto.imagen_url ? (
                            <img 
                                src={producto.imagen_url} 
                                alt={producto.nombre}
                                className="producto-image"
                            />
                        ) : (
                            <div className="producto-image-placeholder">
                                <FaImage />
                            </div>
                        )}
                        
                        <div className="producto-badges">
                            {producto.oferta && (
                                <span className="badge badge-offer">
                                    -{producto.descuento}%
                                </span>
                            )}
                            {!producto.activo && (
                                <span className="badge badge-inactive">
                                    Inactivo
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="producto-info">
                        <h3 className="producto-nombre">{producto.nombre}</h3>
                        <p className="producto-marca">{producto.marca}</p>
                        <p className="producto-categoria">{producto.categoria}</p>
                        
                        <div className="producto-details">
                            <div className="detail-item">
                                <FaDollarSign />
                                <span>{formatearPrecio(producto.precio)}</span>
                            </div>
                            <div className="detail-item">
                                <FaWarehouse />
                                <span>{producto.stock}</span>
                            </div>
                            <div className="detail-item">
                                <FaTag />
                                <span>{producto.codigoSKU}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="producto-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => handleEditarProducto(producto)}
                            title="Editar producto"
                        >
                            <FaEdit />
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={() => handleEliminarProducto(producto)}
                            title="Eliminar producto"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderVistaList = () => (
        <div className="productos-list">
            {productos.map(producto => (
                <div key={producto.id} className="producto-list-item">
                    <div className="producto-list-image">
                        {producto.imagen_url ? (
                            <img 
                                src={producto.imagen_url} 
                                alt={producto.nombre}
                            />
                        ) : (
                            <div className="image-placeholder">
                                <FaImage />
                            </div>
                        )}
                    </div>
                    
                    <div className="producto-list-info">
                        <div className="info-main">
                            <h3>{producto.nombre}</h3>
                            <p className="marca">{producto.marca}</p>
                            <p className="categoria">{producto.categoria}</p>
                        </div>
                        
                        <div className="info-details">
                            <span className="precio">{formatearPrecio(producto.precio)}</span>
                            <span className="stock">Stock: {producto.stock}</span>
                            <span className="sku">SKU: {producto.codigoSKU}</span>
                        </div>
                        
                        <div className="info-status">
                            {producto.oferta && (
                                <span className="badge badge-offer">
                                    -{producto.descuento}%
                                </span>
                            )}
                            <span className={`badge ${producto.activo ? 'badge-active' : 'badge-inactive'}`}>
                                {producto.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="producto-list-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => handleEditarProducto(producto)}
                        >
                            <FaEdit />
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={() => handleEliminarProducto(producto)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderVistaTable = () => (
        <div className="productos-table-container">
            <table className="productos-table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th onClick={() => handleOrdenamientoChange('nombre')}>
                            Nombre {getOrdenIcon('nombre')}
                        </th>
                        <th onClick={() => handleOrdenamientoChange('marca')}>
                            Marca {getOrdenIcon('marca')}
                        </th>
                        <th onClick={() => handleOrdenamientoChange('categoria')}>
                            Categoría {getOrdenIcon('categoria')}
                        </th>
                        <th onClick={() => handleOrdenamientoChange('precio')}>
                            Precio {getOrdenIcon('precio')}
                        </th>
                        <th onClick={() => handleOrdenamientoChange('stock')}>
                            Stock {getOrdenIcon('stock')}
                        </th>
                        <th>SKU</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.id}>
                            <td>
                                {producto.imagen_url ? (
                                    <img 
                                        src={producto.imagen_url} 
                                        alt={producto.nombre}
                                        className="table-image"
                                    />
                                ) : (
                                    <div className="table-image-placeholder">
                                        <FaImage />
                                    </div>
                                )}
                            </td>
                            <td>
                                <div className="table-name-container">
                                    <span className="table-name">{producto.nombre}</span>
                                    {producto.oferta && (
                                        <span className="table-offer">
                                            -{producto.descuento}%
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>{producto.marca}</td>
                            <td>{producto.categoria}</td>
                            <td className="table-price">{formatearPrecio(producto.precio)}</td>
                            <td className="table-stock">
                                <span className={`stock-badge ${producto.stock < 10 ? 'low-stock' : ''}`}>
                                    {producto.stock}
                                </span>
                            </td>
                            <td className="table-sku">{producto.codigoSKU}</td>
                            <td>
                                <span className={`status-badge ${producto.activo ? 'active' : 'inactive'}`}>
                                    {producto.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleEditarProducto(producto)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleEliminarProducto(producto)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderContenido = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <FaSpinner className="spinner" />
                    <p>Cargando productos...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-container">
                    <p>Error: {error}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => cargarProductos(true)}
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        if (productos.length === 0) {
            return (
                <div className="empty-container">
                    <FaBox className="empty-icon" />
                    <p>No se encontraron productos</p>
                    <button 
                        className="btn btn-primary"
                        onClick={handleCrearProducto}
                    >
                        Crear primer producto
                    </button>
                </div>
            );
        }

        switch (vistaActual) {
            case 'list':
                return renderVistaList();
            case 'table':
                return renderVistaTable();
            default:
                return renderVistaGrid();
        }
    };

    return (
        <div className="admin-productos-container" ref={scrollRef}>
            {renderHeader()}
            {renderFiltros()}
            {renderContenido()}
            {!loading && productos.length > 0 && renderPaginacion()}

            {showCrearModal && (
                <CrearProductoPopup 
                    show={showCrearModal}
                    setShow={setShowCrearModal}
                    onProductoCreated={handleProductoCreado}
                />
            )}
            
            {showEditarModal && (
                <EditarProductoPopup 
                    show={showEditarModal}
                    setShow={setShowEditarModal}
                    producto={productoSeleccionado}
                    onProductoUpdated={handleProductoActualizado}
                />
            )}
            
            {showEliminarModal && (
                <ConfirmarEliminarPopup 
                    show={showEliminarModal}
                    setShow={setShowEliminarModal}
                    producto={productoSeleccionado}
                    onConfirm={handleProductoEliminado}
                />
            )}
        </div>
    );
};

export default AdminProductosGrid;
