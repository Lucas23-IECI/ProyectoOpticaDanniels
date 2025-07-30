import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useGetProductos from "@hooks/productos/useGetProductos";
import DropdownFiltro from "@components/DropdownFiltro";
import ProductCard from "@components/ProductCard";
import DropdownCategorias from "@components/DropdownCategorias";
import "@styles/productos.css";
import { Link } from "react-router-dom";
import { FaFilter, FaTimes, FaEye, FaHeart, FaShoppingCart, FaStar, FaSearch, FaTh, FaList, FaSort, FaTags, FaEyeSlash } from 'react-icons/fa';

const Productos = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [categoria, setCategoria] = useState(searchParams.get("categoria") || "");
    const [subcategoria, setSubcategoria] = useState(searchParams.get("subcategoria") || "");
    const [disponibilidad, setDisponibilidad] = useState(searchParams.get("disponibilidad") || "");
    const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") || "");
    const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") || "");
    const [orden, setOrden] = useState(searchParams.get("orden") || "");
    const [dropdownActivo, setDropdownActivo] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("busqueda") || "");
    
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [isFilteringDebounced, setIsFilteringDebounced] = useState(false);

    
    const filtrosIniciales = {
        categoria: searchParams.get("categoria") || "",
        subcategoria: searchParams.get("subcategoria") || "",
        disponibilidad: searchParams.get("disponibilidad") || "",
        precioMin: searchParams.get("precioMin") || "",
        precioMax: searchParams.get("precioMax") || "",
        orden: searchParams.get("orden") || "",
        busqueda: searchParams.get("busqueda") || ""
    };

    const filtrosBackend = {};
    // Siempre filtrar solo productos activos para clientes
    filtrosBackend.activo = true;
    
    if (filtrosIniciales.categoria && filtrosIniciales.categoria.trim()) {
        filtrosBackend.categoria = filtrosIniciales.categoria.trim();
    }
    if (filtrosIniciales.subcategoria && filtrosIniciales.subcategoria.trim()) {
        filtrosBackend.subcategoria = filtrosIniciales.subcategoria.trim();
    }
    if (filtrosIniciales.precioMin && filtrosIniciales.precioMin.trim()) {
        filtrosBackend.precio_min = filtrosIniciales.precioMin.trim();
    }
    if (filtrosIniciales.precioMax && filtrosIniciales.precioMax.trim()) {
        filtrosBackend.precio_max = filtrosIniciales.precioMax.trim();
    }
    // Solo aplicar filtro de disponibilidad si el usuario lo selecciona explícitamente
    if (filtrosIniciales.disponibilidad && filtrosIniciales.disponibilidad.trim()) {
        if (filtrosIniciales.disponibilidad === "en_stock") {
            // Ya está filtrado por activo=true, no necesitamos hacer nada más
        } else if (filtrosIniciales.disponibilidad === "agotado") {
            // Para productos agotados, quitamos el filtro de activo
            delete filtrosBackend.activo;
        }
    }
    if (filtrosIniciales.orden && filtrosIniciales.orden.trim()) {
        filtrosBackend.orden = filtrosIniciales.orden.trim();
    }
    if (filtrosIniciales.busqueda && filtrosIniciales.busqueda.trim()) {
        filtrosBackend.nombre = filtrosIniciales.busqueda.trim();
    }

    const { productos, fetchProductos } = useGetProductos(filtrosBackend);
    const debounceRef = useRef(null);

    const actualizarURL = useCallback((filtros) => {
        const params = new URLSearchParams();
        
        if (filtros.categoria && filtros.categoria.trim()) params.set("categoria", filtros.categoria.trim());
        if (filtros.subcategoria && filtros.subcategoria.trim()) params.set("subcategoria", filtros.subcategoria.trim());
        if (filtros.disponibilidad && filtros.disponibilidad.trim()) params.set("disponibilidad", filtros.disponibilidad.trim());
        if (filtros.precioMin && filtros.precioMin.trim()) params.set("precioMin", filtros.precioMin.trim());
        if (filtros.precioMax && filtros.precioMax.trim()) params.set("precioMax", filtros.precioMax.trim());
        if (filtros.orden && filtros.orden.trim()) params.set("orden", filtros.orden.trim());
        if (filtros.busqueda && filtros.busqueda.trim()) params.set("busqueda", filtros.busqueda.trim());
        
        setSearchParams(params);
    }, [setSearchParams]);

    const obtenerProductosConDebounce = useCallback((filtros) => {
        setIsFilteringDebounced(true);
        
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setIsTransitioning(true);
                setLoading(true);
                
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

                await new Promise(resolve => setTimeout(resolve, 100));
                
                await fetchProductos(paramsFiltros);
                setDisplayedProducts(productos);
                
            } catch (error) {
                console.error("Error al obtener productos:", error);
            } finally {
                setLoading(false);
                setIsTransitioning(false);
                setIsFilteringDebounced(false);
            }
        }, 300);
    }, [fetchProductos, productos]);

    useEffect(() => {
        if (!isTransitioning) {
            setDisplayedProducts(productos);
        }
    }, [productos, isTransitioning]);

    useEffect(() => {
        const filtros = {
            categoria,
            subcategoria,
            disponibilidad,
            precioMin,
            precioMax,
            orden,
            busqueda: searchTerm
        };

        const hayFiltrosActivos = categoria || subcategoria || disponibilidad || precioMin || precioMax || orden || searchTerm;
        if (hayFiltrosActivos) {
            actualizarURL(filtros);
        }

        if (hayFiltrosActivos) {
            obtenerProductosConDebounce(filtros);
        } else {
            const cargarTodosLosProductos = async () => {
                try {
                    setLoading(true);
                    // Siempre cargar solo productos activos para clientes
                    await fetchProductos({ activo: true });
                } catch (error) {
                    console.error("Error al cargar productos:", error);
                } finally {
                    setLoading(false);
                }
            };
            cargarTodosLosProductos();
        }
    }, [categoria, subcategoria, disponibilidad, precioMin, precioMax, orden, searchTerm, actualizarURL, obtenerProductosConDebounce, fetchProductos]);

    const restablecerFiltros = useCallback(() => {
        setCategoria("");
        setSubcategoria("");
        setDisponibilidad("");
        setPrecioMin("");
        setPrecioMax("");
        setOrden("");
        setSearchTerm("");
        setSearchParams({});
    }, [setSearchParams]);

    const activeFiltersCount = [categoria, subcategoria, disponibilidad, precioMin, precioMax, orden, searchTerm].filter(Boolean).length;

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <div className="catalog-hero">
                    <h1>Catálogo de Productos</h1>
                    <p>Descubre nuestra amplia selección de lentes y accesorios ópticos</p>
                </div>
                
                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                type="button"
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
                </div>

                <div className="controls-right">
                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <FaTh />
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <FaList />
                        </button>
                    </div>

                    <div className="sort-control">
                        <FaSort className="sort-icon" />
                        <select 
                            value={orden} 
                            onChange={(e) => setOrden(e.target.value)}
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
                                onCategoriaChange={setCategoria}
                                onSubcategoriaChange={setSubcategoria}
                                placeholder="Todas las categorías"
                            />
                        </div>

                        <div className="filter-section">
                            <h4>Disponibilidad</h4>
                            <DropdownFiltro
                                id="disponibilidad"
                                titulo="Disponibilidad"
                                tipo="checkbox"
                                opciones={[
                                    { valor: "en_stock", etiqueta: "En existencia" },
                                    { valor: "agotado", etiqueta: "Agotado" },
                                ]}
                                seleccion={disponibilidad}
                                onSeleccion={(valor) => setDisponibilidad(valor)}
                                dropdownActivo={dropdownActivo}
                                setDropdownActivo={setDropdownActivo}
                            />
                        </div>

                        <div className="filter-section">
                            <h4>Rango de Precio</h4>
                            <DropdownFiltro
                                id="precio"
                                titulo="Precio"
                                tipo="precio"
                                precioMin={precioMin}
                                precioMax={precioMax}
                                setPrecioMin={setPrecioMin}
                                setPrecioMax={setPrecioMax}
                                dropdownActivo={dropdownActivo}
                                setDropdownActivo={setDropdownActivo}
                            />
                        </div>
                    </div>
                </div>

                <div className="catalog-main">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Cargando productos...</p>
                        </div>
                    ) : Array.isArray(displayedProducts || productos) && (displayedProducts || productos).length > 0 ? (
                        <>
                            <div className="results-info">
                                <p>Mostrando {(displayedProducts || productos).length} producto{(displayedProducts || productos).length !== 1 ? 's' : ''}</p>
                                {isFilteringDebounced && (
                                    <div className="filtering-indicator">
                                        <div className="mini-spinner"></div>
                                        <span>Filtrando...</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
                                {(displayedProducts || productos).map((producto) => (
                                    <Link
                                        key={producto.id}
                                        to={`/productos/${producto.nombre
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}
                                        className="product-link"
                                    >
                                        <ProductCard 
                                            producto={producto} 
                                            viewMode={viewMode}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <FaEyeSlash className="empty-icon" />
                            {activeFiltersCount > 0 ? (
                                <>
                                    <h3>No se encontraron productos</h3>
                                    <p>No hay productos que coincidan con los filtros aplicados</p>
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
