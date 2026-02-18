import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useGetProductos from "@hooks/productos/useGetProductos";
import { formatearNombreParaURL } from "@helpers/formatData";
import DropdownFiltro from "@components/DropdownFiltro";
import ProductCard from "@components/ProductCard";
import DropdownCategorias from "@components/DropdownCategorias";
import "@styles/productos.css";
import { Link } from "react-router-dom";
import { FaFilter, FaTimes, FaEye, FaHeart, FaShoppingCart, FaStar, FaSearch, FaTh, FaList, FaSort, FaTags, FaEyeSlash, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SugerenciasBusqueda from "@components/SugerenciasBusqueda";
import FiltrosAvanzados from "@components/FiltrosAvanzados";

const Productos = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [categoria, setCategoria] = useState(searchParams.get("categoria") || "");
    const [subcategoria, setSubcategoria] = useState(searchParams.get("subcategoria") || "");
    const [disponibilidad, setDisponibilidad] = useState(searchParams.get("disponibilidad") || "");
    const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") || "");
    const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") || "");
    const [orden, setOrden] = useState(searchParams.get("orden") || "");
    const [dropdownActivo, setDropdownActivo] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("busqueda") || "");
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
    const ITEMS_PER_PAGE = 12;
    
    const [isFilteringDebounced, setIsFilteringDebounced] = useState(false);

    // Filtros avanzados
    const [filtrosAvanzados, setFiltrosAvanzados] = useState({
        forma: [],
        marca: [],
        genero: [],
        material: [],
        color: [],
        tamaño: []
    });

    const { productos, paginacion, fetchProductos } = useGetProductos({ activo: true });
    const debounceRef = useRef(null);

    const actualizarURL = useCallback((filtros) => {
        const params = new URLSearchParams();
        if (filtros.categoria) params.set("categoria", filtros.categoria);
        if (filtros.subcategoria) params.set("subcategoria", filtros.subcategoria);
        if (filtros.disponibilidad) params.set("disponibilidad", filtros.disponibilidad);
        if (filtros.precioMin) params.set("precioMin", filtros.precioMin);
        if (filtros.precioMax) params.set("precioMax", filtros.precioMax);
        if (filtros.orden) params.set("orden", filtros.orden);
        if (filtros.busqueda) params.set("busqueda", filtros.busqueda);
        if (filtros.page && filtros.page > 1) params.set("page", String(filtros.page));
        
        setSearchParams(params);
    }, [setSearchParams]);

    const obtenerProductosConDebounce = useCallback((filtros) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                setIsFilteringDebounced(true);
                
                const paramsFiltros = {};
                // Siempre filtrar solo productos activos para clientes
                paramsFiltros.activo = true;
                
                if (filtros.categoria && filtros.categoria.trim()) paramsFiltros.categoria = filtros.categoria.trim();
                if (filtros.subcategoria && filtros.subcategoria.trim()) paramsFiltros.subcategoria = filtros.subcategoria.trim();
                if (filtros.precioMin && filtros.precioMin.trim()) paramsFiltros.precio_min = filtros.precioMin.trim();
                if (filtros.precioMax && filtros.precioMax.trim()) paramsFiltros.precio_max = filtros.precioMax.trim();
                // Solo aplicar filtro de disponibilidad si el usuario lo selecciona explícitamente
                if (filtros.disponibilidad && filtros.disponibilidad.trim()) {
                    if (filtros.disponibilidad === "en_stock") {
                        // Ya está filtrado por activo=true, no necesitamos hacer nada más
                    } else if (filtros.disponibilidad === "agotado") {
                        // Para productos agotados, quitamos el filtro de activo
                        delete paramsFiltros.activo;
                    }
                }
                if (filtros.orden && filtros.orden.trim()) paramsFiltros.orden = filtros.orden.trim();
                
                if (filtros.busqueda && filtros.busqueda.trim() !== '') {
                    paramsFiltros.nombre = filtros.busqueda.trim();
                }

                paramsFiltros.page = filtros.page || 1;
                paramsFiltros.limit = ITEMS_PER_PAGE;

                await fetchProductos(paramsFiltros);
                
            } catch (error) {
                console.error("Error al obtener productos:", error);
            } finally {
                setLoading(false);
                setIsFilteringDebounced(false);
            }
        }, 750);
    }, [fetchProductos]);

    const displayedProducts = useMemo(() => {
        return productos || [];
    }, [productos]);

    useEffect(() => {
        const filtros = {
            categoria,
            subcategoria,
            disponibilidad,
            precioMin,
            precioMax,
            orden,
            busqueda: searchTerm,
            page: currentPage
        };

        const hayFiltrosActivos = categoria || subcategoria || disponibilidad || precioMin || precioMax || orden || searchTerm;
        
        if (hayFiltrosActivos) {
            actualizarURL(filtros);
            obtenerProductosConDebounce(filtros);
        } else {
            const cargarTodosLosProductos = async () => {
                try {
                    setLoading(true);
                    await fetchProductos({ activo: true, page: currentPage, limit: ITEMS_PER_PAGE });
                } catch (error) {
                    console.error("Error al cargar productos:", error);
                } finally {
                    setLoading(false);
                }
            };
            cargarTodosLosProductos();
        }
    }, [categoria, subcategoria, disponibilidad, precioMin, precioMax, orden, searchTerm, currentPage, actualizarURL, obtenerProductosConDebounce, fetchProductos]);

    const restablecerFiltros = useCallback(() => {
        setCategoria("");
        setSubcategoria("");
        setDisponibilidad("");
        setPrecioMin("");
        setPrecioMax("");
        setOrden("");
        setSearchTerm("");
        setCurrentPage(1);
        setFiltrosAvanzados({
            forma: [],
            marca: [],
            genero: [],
            material: [],
            color: [],
            tamaño: []
        });
        setSearchParams({});
    }, [setSearchParams]);

    const handleFiltroAvanzadoChange = useCallback((campo, valores) => {
        setFiltrosAvanzados(prev => ({
            ...prev,
            [campo]: valores
        }));
    }, []);

    const limpiarFiltrosAvanzados = useCallback(() => {
        setFiltrosAvanzados({
            forma: [],
            marca: [],
            genero: [],
            material: [],
            color: [],
            tamaño: []
        });
    }, []);

    const activeFiltersCount = [categoria, subcategoria, disponibilidad, precioMin, precioMax, orden, searchTerm].filter(Boolean).length;

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <div className="catalog-hero">
                    <h1>Catálogo de Productos</h1>
                    <p>Encuentra los mejores productos para tu cuidado visual</p>
                </div>
            </div>

            <div className="catalog-controls">
                <div className="controls-left">
                    <button 
                        className={`filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="filter-count">{activeFiltersCount}</span>
                        )}
                    </button>
                    
                    {activeFiltersCount > 0 && (
                        <button 
                            onClick={() => restablecerFiltros()} 
                            className="clear-filters"
                            disabled={loading}
                            title="Limpiar todos los filtros"
                        >
                            <FaTimes />
                            {loading ? 'Limpiando...' : 'Limpiar filtros'}
                        </button>
                    )}

                    <button 
                        className={`advanced-filter-toggle ${showAdvancedFilters ? 'active' : ''}`}
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        title="Filtros avanzados"
                    >
                        <FaCog />
                        Avanzados
                    </button>
                </div>

                <div className="controls-center">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSearchTerm("");
                                }}
                                className="clear-search"
                                title="Limpiar búsqueda"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>

                <div className="controls-right">
                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Vista de cuadrícula"
                        >
                            <FaTh />
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="Vista de lista"
                        >
                            <FaList />
                        </button>
                    </div>

                    <div className="sort-control">
                        <FaSort className="sort-icon" />
                        <select 
                            value={orden} 
                            onChange={(e) => { setOrden(e.target.value); setCurrentPage(1); }}
                            className="sort-select"
                        >
                            <option value="">Más relevantes</option>
                            <option value="precio_ASC">Precio: menor a mayor</option>
                            <option value="precio_DESC">Precio: mayor a menor</option>
                            <option value="nombre_ASC">Nombre: A-Z</option>
                            <option value="nombre_DESC">Nombre: Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="catalog-content">
                <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                    <div className="filters-header">
                        <h3>Filtros</h3>
                        <button 
                            onClick={() => setShowFilters(false)}
                            className="close-filters"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="filters-content">
                        <div className="filter-section">
                            <h4>Categorías</h4>
                            <DropdownCategorias
                                selectedCategoria={categoria}
                                selectedSubcategoria={subcategoria}
                                onCategoriaChange={(val) => { setCategoria(val); setCurrentPage(1); }}
                                onSubcategoriaChange={(val) => { setSubcategoria(val); setCurrentPage(1); }}
                                placeholder="Todas las categorías"
                                dropdownActivo={dropdownActivo}
                                setDropdownActivo={setDropdownActivo}
                                id="productos"
                            />
                        </div>

                        <div className="filter-section">
                            <h4>Disponibilidad</h4>
                            <DropdownFiltro
                                titulo="Disponibilidad"
                                tipo="checkbox"
                                opciones={[
                                    { valor: "en_stock", etiqueta: "En existencia" },
                                    { valor: "agotado", etiqueta: "Agotado" },
                                ]}
                                seleccion={disponibilidad}
                                onSeleccion={(valor) => { setDisponibilidad(valor); setCurrentPage(1); }}
                                dropdownActivo={dropdownActivo}
                                setDropdownActivo={setDropdownActivo}
                                id="disponibilidad"
                            />
                        </div>

                        <div className="filter-section">
                            <h4>Rango de Precio</h4>
                            <DropdownFiltro
                                titulo="Precio"
                                tipo="precio"
                                precioMin={precioMin}
                                precioMax={precioMax}
                                setPrecioMin={setPrecioMin}
                                setPrecioMax={setPrecioMax}
                                dropdownActivo={dropdownActivo}
                                setDropdownActivo={setDropdownActivo}
                                id="precio"
                            />
                        </div>

                        {showAdvancedFilters && (
                            <div className="advanced-filters-section">
                                <FiltrosAvanzados
                                    filtros={filtrosAvanzados}
                                    onFiltroChange={handleFiltroAvanzadoChange}
                                    onLimpiarFiltros={limpiarFiltrosAvanzados}
                                    productosData={productos || []}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="catalog-main">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Cargando productos...</p>
                        </div>
                    ) : Array.isArray(displayedProducts) && displayedProducts.length > 0 ? (
                        <>
                            <div className="results-info">
                                <p>
                                    Mostrando {displayedProducts.length} de {paginacion?.total || displayedProducts.length} producto{(paginacion?.total || displayedProducts.length) !== 1 ? 's' : ''}
                                    {paginacion && paginacion.paginas > 1 && (
                                        <span className="page-indicator"> — Página {paginacion.pagina} de {paginacion.paginas}</span>
                                    )}
                                </p>
                                {isFilteringDebounced && (
                                    <div className="filtering-indicator">
                                        <div className="mini-spinner"></div>
                                        <span>Filtrando...</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                                {displayedProducts.map((producto) => (
                                    <Link
                                        key={producto.id}
                                        to={`/productos/${formatearNombreParaURL(producto.nombre)}`}
                                        className="product-link"
                                    >
                                        <ProductCard 
                                            producto={producto} 
                                            viewMode={viewMode}
                                        />
                                    </Link>
                                ))}
                            </div>

                            {paginacion && paginacion.paginas > 1 && (
                                <div className="pagination-controls">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage <= 1 || loading}
                                        title="Página anterior"
                                    >
                                        <FaChevronLeft />
                                        <span>Anterior</span>
                                    </button>

                                    <div className="pagination-pages">
                                        {(() => {
                                            const pages = [];
                                            const total = paginacion.paginas;
                                            const current = paginacion.pagina;
                                            
                                            // Always show first page
                                            pages.push(1);
                                            
                                            if (current > 3) pages.push('...');
                                            
                                            // Pages around current
                                            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                                                pages.push(i);
                                            }
                                            
                                            if (current < total - 2) pages.push('...');
                                            
                                            // Always show last page
                                            if (total > 1) pages.push(total);
                                            
                                            return pages.map((page, idx) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">...</span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        className={`pagination-page ${page === current ? 'active' : ''}`}
                                                        onClick={() => setCurrentPage(page)}
                                                        disabled={loading}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ));
                                        })()}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.min(paginacion.paginas, prev + 1))}
                                        disabled={currentPage >= paginacion.paginas || loading}
                                        title="Página siguiente"
                                    >
                                        <span>Siguiente</span>
                                        <FaChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <FaEyeSlash className="empty-icon" />
                            {activeFiltersCount > 0 ? (
                                <>
                                    <h3>No se encontraron productos</h3>
                                    <p>No hay productos que coincidan con los filtros aplicados</p>
                                    {searchTerm && (
                                        <SugerenciasBusqueda 
                                            terminoBusqueda={searchTerm}
                                            onSugerenciaClick={(sugerencia) => {
                                                setSearchTerm(sugerencia);
                                                // Limpiar otros filtros y buscar solo con la sugerencia
                                                setCategoria("");
                                                setSubcategoria("");
                                                setDisponibilidad("");
                                                setPrecioMin("");
                                                setPrecioMax("");
                                                setOrden("");
                                            }}
                                        />
                                    )}
                                    <button 
                                        onClick={() => restablecerFiltros()} 
                                        className="empty-state-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Limpiar filtros y ver todos'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>Catálogo vacío</h3>
                                    <p>Aún no hay productos disponibles en el catálogo</p>
                                    <button 
                                        onClick={() => restablecerFiltros()} 
                                        className="empty-state-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Recargar productos'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Productos;