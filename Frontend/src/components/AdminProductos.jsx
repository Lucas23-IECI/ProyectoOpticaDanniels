import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaTh, FaList, FaTable,
    FaArrowLeft, FaArrowRight, FaSort, FaSortUp, FaSortDown, FaSpinner,
    FaBox, FaDollarSign, FaPercent, FaEyeSlash, FaImage, FaTimes, FaSync
} from 'react-icons/fa';
import { getAllProductos } from '@services/producto.service';
import CrearProductoPopup from './CrearProductoPopup';
import EditarProductoPopup from './EditarProductoPopup';
import ProductoDetalle from './ProductoDetalle';
import ConfirmarEliminarPopup from './ConfirmarEliminarPopup';
import LazyImage from './LazyImage';
import DropdownCategorias from './DropdownCategorias';
import CategoriasNav from './CategoriasNav';
import { formatearCategoriaCorta, getCategoriaIcon } from '../constants/categorias.js';
import '@styles/adminProductosV2.css';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];
const SORT_OPTIONS = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio', label: 'Precio' },
    { value: 'stock', label: 'Stock' },
    { value: 'categoria', label: 'Categoría' },
    { value: 'marca', label: 'Marca' },
    { value: 'createdAt', label: 'Fecha creación' },
    { value: 'updatedAt', label: 'Última actualización' }
];

const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list',
    TABLE: 'table'
};

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [totalItems, setTotalItems] = useState(0);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        categoria: '',
        subcategoria: '',
        marca: '',
        activo: '',
        oferta: '',
        stock_min: '',
        stock_max: '',
        precio_min: '',
        precio_max: ''
    });
    
    const [sortBy, setSortBy] = useState('nombre');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
    const [showFilters, setShowFilters] = useState(false);
    
    const [scrollPosition, setScrollPosition] = useState(0);
    
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    
    const [modoEdicion, setModoEdicion] = useState(false);
    
    const [marcas, setMarcas] = useState([]);
    const [dropdownActivo, setDropdownActivo] = useState(null);

    useEffect(() => {
        if (showDetalleModal) {
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
    }, [showDetalleModal]);

    const cargarProductos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = {
                page: currentPage,
                limit: itemsPerPage,
                ...filters
            };
            
            if (searchTerm) {
                queryParams.nombre = searchTerm;
            }
            
            const data = await getAllProductos(queryParams);
            
            if (data && data.productos) {
                setProductos(data.productos);
                setTotalItems(data.total || data.productos.length);
            } else {
                setProductos([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar productos');
            setProductos([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm, filters]);

    const cargarMarcas = useCallback(async () => {
        try {
            const data = await getAllProductos({ limit: 1000 });
            if (data && data.productos) {
                const marcasUnicas = [...new Set(data.productos.map(p => p.marca).filter(Boolean))];
                setMarcas(marcasUnicas);
            }
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        }
    }, []);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    useEffect(() => {
        cargarMarcas();
    }, [cargarMarcas]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [searchTerm, filters, currentPage]);

    const productosProcessados = useMemo(() => {
        let resultado = [...productos];
        
        if (searchTerm) {
            const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
            resultado = resultado.filter(producto => {
                const searchableText = [
                    producto.nombre,
                    producto.marca,
                    producto.categoria,
                    producto.codigoSKU
                ].join(' ').toLowerCase();
                
                return searchWords.every(word => 
                    searchableText.includes(word)
                );
            });
        }
        
        resultado.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return resultado;
    }, [productos, searchTerm, sortBy, sortOrder]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleVerDetalle = (producto) => {
        setProductoSeleccionado(producto);
        setShowDetalleModal(true);
    };

    const handleEditarProducto = (producto) => {
        setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
        setProductoSeleccionado(producto);
        setShowDetalleModal(false);
        setModoEdicion(true);
    };

    const handleEliminarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setShowEliminarModal(true);
    };

    const handleConfirmarEliminar = async () => {
        try {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            setProductos(prevProductos => 
                prevProductos.filter(producto => producto.id !== productoSeleccionado.id)
            );
            setTotalItems(prev => prev - 1);
            
            window.dispatchEvent(new CustomEvent('productoEliminado', { 
                detail: { productoId: productoSeleccionado.id } 
            }));
            
            setShowEliminarModal(false);
            setProductoSeleccionado(null);
            
            setTimeout(() => {
                window.scrollTo(0, scrollPosition);
            }, 100);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const handleProductoCreado = (nuevoProducto) => {
        setProductos(prevProductos => [nuevoProducto, ...prevProductos]);
        setTotalItems(prev => prev + 1);
        
        if (nuevoProducto.marca && !marcas.includes(nuevoProducto.marca)) {
            setMarcas(prev => [...prev, nuevoProducto.marca].sort());
        }
    };

    const handleCancelarEdicion = () => {
        setModoEdicion(false);
        setProductoSeleccionado(null);
        
        setTimeout(() => {
            window.scrollTo(0, scrollPosition);
        }, 100);
    };

    const handleProductoActualizado = (productoActualizado) => {
        setProductos(prevProductos => 
            prevProductos.map(producto => 
                producto.id === productoActualizado.id ? productoActualizado : producto
            )
        );
        
        if (productoSeleccionado && productoSeleccionado.id === productoActualizado.id) {
            setProductoSeleccionado(productoActualizado);
        }
        
        setModoEdicion(false);
        
        setTimeout(() => {
            window.scrollTo(0, scrollPosition);
        }, 100);
        
        if (productoActualizado.marca && !marcas.includes(productoActualizado.marca)) {
            setMarcas(prev => [...prev, productoActualizado.marca].sort());
        }
    };

    const limpiarFiltros = () => {
        setSearchTerm('');
        setFilters({
            categoria: '',
            marca: '',
            activo: '',
            oferta: '',
            stock_min: '',
            stock_max: '',
            precio_min: '',
            precio_max: ''
        });
    };

    const formatearPrecio = (precio) => {
        if (!precio) return '$0';
        return `$${precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return <FaSort className="sort-icon" />;
        return sortOrder === 'asc' ? 
            <FaSortUp className="sort-icon active" /> : 
            <FaSortDown className="sort-icon active" />;
    };

    return (
        <div className="admin-productos-v2">
            {modoEdicion && productoSeleccionado && (
                <EditarProductoPopup
                    show={true}
                    setShow={handleCancelarEdicion}
                    producto={productoSeleccionado}
                    onProductoUpdated={handleProductoActualizado}
                />
            )}
            
            {!modoEdicion && (
                <>
                    <div className="admin-header">
                        <div className="header-title">
                            <h1>Administración de Productos</h1>
                            <span className="productos-count">
                                {loading ? 'Cargando...' : `${totalItems} productos`}
                            </span>
                        </div>
                
                <div className="header-actions">
                    <button 
                        className="btn btn-refresh"
                        onClick={cargarProductos}
                        disabled={loading}
                    >
                        <FaSync className={loading ? 'spinning' : ''} />
                        Actualizar
                    </button>
                    
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCrearModal(true)}
                    >
                        <FaPlus /> Crear Producto
                    </button>
                </div>
            </div>

            <CategoriasNav 
                categoriaActual={filters.categoria}
                subcategoriaActual={filters.subcategoria}
                onCategoriaChange={(categoria) => handleFilterChange('categoria', categoria)}
                onSubcategoriaChange={(subcategoria) => handleFilterChange('subcategoria', subcategoria)}
                onReset={() => {
                    handleFilterChange('categoria', '');
                    handleFilterChange('subcategoria', '');
                }}
            />

            <div className="search-filters-bar">
                <div className="search-section">
                    <div className="search-input-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    
                    <button 
                        className={`btn btn-filter ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> Filtros
                    </button>
                </div>

                <div className="view-controls">
                    <div className="view-mode-buttons">
                        <button 
                            className={`btn btn-view ${viewMode === VIEW_MODES.GRID ? 'active' : ''}`}
                            onClick={() => setViewMode(VIEW_MODES.GRID)}
                            title="Vista cuadriculada"
                        >
                            <FaTh />
                        </button>
                        <button 
                            className={`btn btn-view ${viewMode === VIEW_MODES.LIST ? 'active' : ''}`}
                            onClick={() => setViewMode(VIEW_MODES.LIST)}
                            title="Vista lista"
                        >
                            <FaList />
                        </button>
                        <button 
                            className={`btn btn-view ${viewMode === VIEW_MODES.TABLE ? 'active' : ''}`}
                            onClick={() => setViewMode(VIEW_MODES.TABLE)}
                            title="Vista tabla"
                        >
                            <FaTable />
                        </button>
                    </div>
                    
                    <div className="items-per-page">
                        <label>Mostrar:</label>
                        <select 
                            value={itemsPerPage} 
                            onChange={handleItemsPerPageChange}
                            className="items-select"
                        >
                            {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="filters-panel">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Categoría y Subcategoría:</label>
                            <DropdownCategorias
                                selectedCategoria={filters.categoria}
                                selectedSubcategoria={filters.subcategoria}
                                onCategoriaChange={(categoria) => handleFilterChange('categoria', categoria)}
                                onSubcategoriaChange={(subcategoria) => handleFilterChange('subcategoria', subcategoria)}
                                placeholder="Todas las categorías"
                                dropdownActivo={dropdownActivo}
                                setDropdownActivo={setDropdownActivo}
                                id="admin-productos"
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>Marca:</label>
                            <select 
                                value={filters.marca} 
                                onChange={(e) => handleFilterChange('marca', e.target.value)}
                            >
                                <option value="">Todas las marcas</option>
                                {marcas.map(marca => (
                                    <option key={marca} value={marca}>{marca}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label>Estado:</label>
                            <select 
                                value={filters.activo} 
                                onChange={(e) => handleFilterChange('activo', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label>En oferta:</label>
                            <select 
                                value={filters.oferta} 
                                onChange={(e) => handleFilterChange('oferta', e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="true">En oferta</option>
                                <option value="false">Sin oferta</option>
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <label>Stock mínimo:</label>
                            <input 
                                type="number" 
                                placeholder="Min"
                                value={filters.stock_min}
                                onChange={(e) => handleFilterChange('stock_min', e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>Stock máximo:</label>
                            <input 
                                type="number" 
                                placeholder="Max"
                                value={filters.stock_max}
                                onChange={(e) => handleFilterChange('stock_max', e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>Precio mínimo:</label>
                            <input 
                                type="number" 
                                placeholder="Min"
                                value={filters.precio_min}
                                onChange={(e) => handleFilterChange('precio_min', e.target.value)}
                            />
                        </div>
                        
                        <div className="filter-group">
                            <label>Precio máximo:</label>
                            <input 
                                type="number" 
                                placeholder="Max"
                                value={filters.precio_max}
                                onChange={(e) => handleFilterChange('precio_max', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="filters-actions">
                        <button className="btn btn-secondary" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            <div className="sort-bar">
                <div className="sort-section">
                    <span>Ordenar por:</span>
                    {SORT_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            className={`btn btn-sort ${sortBy === option.value ? 'active' : ''}`}
                            onClick={() => handleSortChange(option.value)}
                        >
                            {option.label}
                            {getSortIcon(option.value)}
                        </button>
                    ))}
                </div>
                
                <div className="results-info">
                    Mostrando {startIndex + 1}-{endIndex} de {totalItems} productos
                </div>
            </div>

            <div className="productos-content">
                {loading && (
                    <div className="loading-container">
                        <FaSpinner className="spinner" />
                        <p>Cargando productos...</p>
                    </div>
                )}
                
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={cargarProductos}>
                            Reintentar
                        </button>
                    </div>
                )}
                
                {!loading && !error && productosProcessados.length === 0 && (
                    <div className="empty-container">
                        <p>No se encontraron productos</p>
                        <button className="btn btn-primary" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    </div>
                )}
                
                {!loading && !error && productosProcessados.length > 0 && (
                    <>
                        {viewMode === VIEW_MODES.GRID && (
                            <div className="productos-grid">
                                {productosProcessados.map(producto => (
                                    <ProductCard
                                        key={producto.id}
                                        producto={producto}
                                        onVerDetalle={handleVerDetalle}
                                        onEditar={handleEditarProducto}
                                        onEliminar={handleEliminarProducto}
                                        formatearPrecio={formatearPrecio}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {viewMode === VIEW_MODES.LIST && (
                            <div className="productos-list">
                                {productosProcessados.map(producto => (
                                    <ProductListItem
                                        key={producto.id}
                                        producto={producto}
                                        onVerDetalle={handleVerDetalle}
                                        onEditar={handleEditarProducto}
                                        onEliminar={handleEliminarProducto}
                                        formatearPrecio={formatearPrecio}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {viewMode === VIEW_MODES.TABLE && (
                            <div className="productos-table-container">
                                <ProductTable
                                    productos={productosProcessados}
                                    onVerDetalle={handleVerDetalle}
                                    onEditar={handleEditarProducto}
                                    onEliminar={handleEliminarProducto}
                                    formatearPrecio={formatearPrecio}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            )}

                    {showCrearModal && (
                        <CrearProductoPopup
                            show={showCrearModal}
                            setShow={setShowCrearModal}
                            onProductoCreated={handleProductoCreado}
                        />
                    )}
                    
                    {showDetalleModal && (
                        <div className="modal-overlay" 
                            style={{
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
                            }}
                            onClick={() => setShowDetalleModal(false)}>
                            <div className="modal-content detalle-modal" 
                                style={{
                                    position: 'relative',
                                    maxWidth: '1200px',
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '90vh',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                    overflow: 'hidden',
                                    background: 'white'
                                }}
                                onClick={e => e.stopPropagation()}>
                                <button 
                                    className="modal-close"
                                    onClick={() => setShowDetalleModal(false)}
                                >
                                    <FaTimes />
                                </button>
                                <ProductoDetalle
                                    producto={productoSeleccionado}
                                    onEdit={handleEditarProducto}
                                    onDelete={handleEliminarProducto}
                                    showActions={true}
                                    onClose={() => setShowDetalleModal(false)}
                                />
                            </div>
                        </div>
                    )}
                    
                    {showEliminarModal && (
                        <ConfirmarEliminarPopup
                            show={showEliminarModal}
                            setShow={setShowEliminarModal}
                            producto={productoSeleccionado}
                            onConfirm={handleConfirmarEliminar}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const ProductCard = ({ producto, onVerDetalle, onEditar, onEliminar, formatearPrecio }) => {
    const precioConDescuento = producto.oferta && producto.descuento > 0 ?
        producto.precio * (1 - producto.descuento / 100) : null;

    return (
        <div className="product-card">
            <div className="product-image-container">
                <LazyImage
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="product-card"
                    placeholder={
                        <div className="product-image-placeholder">
                            <FaImage />
                        </div>
                    }
                />
                
                <div className="product-badges">
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
                
                <div className="product-overlay">
                    <div className="product-actions">
                        <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => onVerDetalle(producto)}
                            title="Ver detalle"
                        >
                            <FaEye />
                        </button>
                        <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => onEditar(producto)}
                            title="Editar"
                        >
                            <FaEdit />
                        </button>
                        <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => onEliminar(producto)}
                            title="Eliminar"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <p className="product-brand">{producto.marca}</p>
                <p className="product-category">
                    {getCategoriaIcon(producto.categoria)} {formatearCategoriaCorta(producto.categoria, producto.subcategoria)}
                </p>
                
                <div className="product-price-container">
                    {precioConDescuento ? (
                        <div className="price-with-discount">
                            <span className="price-original">{formatearPrecio(producto.precio)}</span>
                            <span className="price-discount">{formatearPrecio(precioConDescuento)}</span>
                        </div>
                    ) : (
                        <span className="price-normal">{formatearPrecio(producto.precio)}</span>
                    )}
                </div>
                
                <div className="product-stock">
                    <FaBox className="stock-icon" />
                    <span className={`stock-value ${producto.stock < 10 ? 'low-stock' : ''}`}>
                        {producto.stock} unidades
                    </span>
                </div>
            </div>
        </div>
    );
};

const ProductListItem = ({ producto, onVerDetalle, onEditar, onEliminar, formatearPrecio }) => {
    const precioConDescuento = producto.oferta && producto.descuento > 0 ?
        producto.precio * (1 - producto.descuento / 100) : null;

    return (
        <div className="product-list-item">
            <div className="product-image-container">
                <LazyImage
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="product-thumbnail"
                    placeholder={
                        <div className="product-image-placeholder">
                            <FaImage />
                        </div>
                    }
                />
            </div>
            
            <div className="product-info">
                <div className="product-main-info">
                    <h3 className="product-name">{producto.nombre}</h3>
                    <div className="product-meta">
                        <span className="product-brand">{producto.marca}</span>
                        <span className="product-category">
                            {getCategoriaIcon(producto.categoria)} {formatearCategoriaCorta(producto.categoria, producto.subcategoria)}
                        </span>
                        <span className="product-sku">{producto.codigoSKU}</span>
                    </div>
                </div>
                
                <div className="product-price-info">
                    {precioConDescuento ? (
                        <div className="price-with-discount">
                            <span className="price-original">{formatearPrecio(producto.precio)}</span>
                            <span className="price-discount">{formatearPrecio(precioConDescuento)}</span>
                        </div>
                    ) : (
                        <span className="price-normal">{formatearPrecio(producto.precio)}</span>
                    )}
                </div>
                
                <div className="product-stock-info">
                    <span className={`stock-value ${producto.stock < 10 ? 'low-stock' : ''}`}>
                        Stock: {producto.stock}
                    </span>
                </div>
            </div>
            
            <div className="product-badges">
                {producto.oferta && (
                    <span className="badge badge-offer">
                        -{producto.descuento}%
                    </span>
                )}
                <span className={`badge ${producto.activo ? 'badge-active' : 'badge-inactive'}`}>
                    {producto.activo ? 'Activo' : 'Inactivo'}
                </span>
            </div>
            
            <div className="product-actions">
                <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => onVerDetalle(producto)}
                    title="Ver detalle"
                >
                    <FaEye />
                </button>
                <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEditar(producto)}
                    title="Editar"
                >
                    <FaEdit />
                </button>
                <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onEliminar(producto)}
                    title="Eliminar"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

const ProductTable = ({ productos, onVerDetalle, onEditar, onEliminar, formatearPrecio }) => {
    return (
        <table className="products-table">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Categoría / Subcategoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {productos.map(producto => (
                    <ProductTableRow
                        key={producto.id}
                        producto={producto}
                        onVerDetalle={onVerDetalle}
                        onEditar={onEditar}
                        onEliminar={onEliminar}
                        formatearPrecio={formatearPrecio}
                    />
                ))}
            </tbody>
        </table>
    );
};

const ProductTableRow = ({ producto, onVerDetalle, onEditar, onEliminar, formatearPrecio }) => {
    const precioConDescuento = producto.oferta && producto.descuento > 0 ?
        producto.precio * (1 - producto.descuento / 100) : null;

    return (
        <tr className="product-table-row">
            <td>
                <div className="table-image-container">
                    <LazyImage
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="product-thumbnail"
                        placeholder={
                            <div className="table-image-placeholder">
                                <FaImage />
                            </div>
                        }
                    />
                </div>
            </td>
            <td>
                <div className="product-name-cell">
                    <strong>{producto.nombre}</strong>
                    <small>{producto.codigoSKU}</small>
                </div>
            </td>
            <td>{producto.marca}</td>
            <td>
                <div className="category-cell">
                    {getCategoriaIcon(producto.categoria)} {formatearCategoriaCorta(producto.categoria, producto.subcategoria)}
                </div>
            </td>
            <td>
                <div className="price-cell">
                    {precioConDescuento ? (
                        <div className="price-with-discount">
                            <span className="price-original">{formatearPrecio(producto.precio)}</span>
                            <span className="price-discount">{formatearPrecio(precioConDescuento)}</span>
                        </div>
                    ) : (
                        <span className="price-normal">{formatearPrecio(producto.precio)}</span>
                    )}
                    {producto.oferta && (
                        <span className="discount-badge">-{producto.descuento}%</span>
                    )}
                </div>
            </td>
            <td>
                <span className={`stock-value ${producto.stock < 10 ? 'low-stock' : ''}`}>
                    {producto.stock}
                </span>
            </td>
            <td>
                <div className="status-cell">
                    <span className={`badge ${producto.activo ? 'badge-active' : 'badge-inactive'}`}>
                        {producto.activo ? (
                            <><FaEye /> Activo</>
                        ) : (
                            <><FaEyeSlash /> Inactivo</>
                        )}
                    </span>
                </div>
            </td>
            <td>
                <div className="table-actions">
                    <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => onVerDetalle(producto)}
                        title="Ver detalle"
                    >
                        <FaEye />
                    </button>
                    <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEditar(producto)}
                        title="Editar"
                    >
                        <FaEdit />
                    </button>
                    <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onEliminar(producto)}
                        title="Eliminar"
                    >
                        <FaTrash />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 7;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="pagination">
            <div className="pagination-info">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} productos
            </div>
            
            <div className="pagination-controls">
                <button 
                    className="btn btn-pagination"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeft /> Anterior
                </button>
                
                <div className="page-numbers">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            className={`btn btn-page ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                            onClick={() => page !== '...' && onPageChange(page)}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                
                <button 
                    className="btn btn-pagination"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default AdminProductos;