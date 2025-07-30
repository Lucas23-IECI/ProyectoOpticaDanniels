import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProductos } from "@services/producto.service";
import ProductCard from "@components/ProductCard";
import DropdownFiltro from "@components/DropdownFiltro";
import { FaSearch, FaFilter, FaTimes, FaTh, FaList, FaSort, FaEyeSlash } from "react-icons/fa";
import "@styles/productos.css";

const BusquedaResultados = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const [busqueda, setBusqueda] = useState(query);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const debounceRef = useRef(null);
    const filtrosDebounceRef = useRef(null);
    const lastSearchRef = useRef("");

    const [disponibilidad, setDisponibilidad] = useState(searchParams.get("disponibilidad") || "");
    const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") || "");
    const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") || "");
    const [orden, setOrden] = useState(searchParams.get("orden") || "");
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const [dropdownActivo, setDropdownActivo] = useState(null);

    const actualizarURL = useCallback((filtros) => {
        const params = new URLSearchParams();
        if (filtros.query) params.set("query", filtros.query);
        if (filtros.disponibilidad) params.set("disponibilidad", filtros.disponibilidad);
        if (filtros.precioMin) params.set("precioMin", filtros.precioMin);
        if (filtros.precioMax) params.set("precioMax", filtros.precioMax);
        if (filtros.orden) params.set("orden", filtros.orden);
        
        setSearchParams(params);
    }, [setSearchParams]);

    const buscarProductos = useCallback(async (searchQuery, filtrosAdicionales = {}) => {
        if (lastSearchRef.current === searchQuery && Object.keys(filtrosAdicionales).length === 0) {
            return;
        }
        
        lastSearchRef.current = searchQuery;
        setCargando(true);
        setProductos([]);
        
        if (import.meta.env.DEV) {
            console.log('🔍 Buscando productos con query:', searchQuery, 'y filtros:', filtrosAdicionales);
        }
        
        try {
            const filtros = { nombre: searchQuery, activo: true, ...filtrosAdicionales };
            if (filtros.precioMin) filtros.precio_min = filtros.precioMin;
            if (filtros.precioMax) filtros.precio_max = filtros.precioMax;
            // Solo aplicar filtro de disponibilidad si el usuario lo selecciona explícitamente
            if (filtros.disponibilidad) {
                if (filtros.disponibilidad === "en_stock") {
                    // Ya está filtrado por activo=true, no necesitamos hacer nada más
                } else if (filtros.disponibilidad === "agotado") {
                    // Para productos agotados, quitamos el filtro de activo
                    delete filtros.activo;
                }
            }

            const resultados = await getProductos(filtros);
            setProductos(resultados);
        } catch (error) {
            console.error("Error al buscar productos:", error);
            setProductos([]);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (busqueda.trim() !== "" && busqueda.trim() !== query) {
                const filtros = {
                    query: busqueda.trim(),
                    disponibilidad,
                    precioMin,
                    precioMax,
                    orden
                };
                actualizarURL(filtros);
            }
        }, 1000);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [busqueda, query, disponibilidad, precioMin, precioMax, orden, actualizarURL]);

    useEffect(() => {
        if (filtrosDebounceRef.current) {
            clearTimeout(filtrosDebounceRef.current);
        }

        filtrosDebounceRef.current = setTimeout(() => {
            if (query.trim() !== "") {
                const filtrosAdicionales = {};
                if (precioMin) filtrosAdicionales.precioMin = precioMin;
                if (precioMax) filtrosAdicionales.precioMax = precioMax;
                if (disponibilidad) filtrosAdicionales.disponibilidad = disponibilidad;
                if (orden) filtrosAdicionales.orden = orden;

                buscarProductos(query, filtrosAdicionales);
            }
        }, 1000);

        return () => {
            if (filtrosDebounceRef.current) {
                clearTimeout(filtrosDebounceRef.current);
            }
        };
    }, [query, precioMin, precioMax, disponibilidad, orden, buscarProductos]);

    useEffect(() => {
        if (query.trim() !== "") {
            buscarProductos(query);
        } else {
            setProductos([]);
            setCargando(false);
            lastSearchRef.current = "";
        }
    }, [query, buscarProductos]);

    useEffect(() => {
        setBusqueda(query);
    }, [query]);

    const handleBuscar = (e) => {
        e.preventDefault();
        if (busqueda.trim() !== "") {
            const filtros = {
                query: busqueda.trim(),
                disponibilidad,
                precioMin,
                precioMax,
                orden
            };
            actualizarURL(filtros);
        }
    };

    const restablecerFiltros = () => {
        setDisponibilidad("");
        setPrecioMin("");
        setPrecioMax("");
        setOrden("");
        const filtros = {
            query: busqueda.trim()
        };
        actualizarURL(filtros);
    };

    const activeFiltersCount = [disponibilidad, precioMin, precioMax, orden].filter(Boolean).length;

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <div className="catalog-hero">
                    <h1>Resultados de búsqueda</h1>
                    <p>Encuentra exactamente lo que buscas en nuestro catálogo</p>
                </div>
                
                <div className="search-bar">
                    <form onSubmit={handleBuscar} className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="search-input"
                        />
                        {busqueda && (
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBusqueda("");
                                }}
                                className="clear-search"
                                title="Limpiar búsqueda"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </form>
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
                        <button onClick={restablecerFiltros} className="clear-filters">
                            <FaTimes />
                            Limpiar filtros
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
                        <h3>Filtros de búsqueda</h3>
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowFilters(false);
                            }}
                            className="close-filters"
                            title="Cerrar filtros"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="filters-content">
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
                    {cargando ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Buscando productos...</p>
                        </div>
                    ) : productos.length > 0 ? (
                        <>
                            <div className="results-info">
                                <p>Mostrando {productos.length} resultado{productos.length !== 1 ? 's' : ''} para "{query}"</p>
                            </div>
                            
                            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                                {productos.map((producto) => (
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
                            <h3>No se encontraron productos</h3>
                            <p>No hay resultados para "{query}". Intenta con otros términos de búsqueda.</p>
                            <Link to="/productos" className="empty-state-btn">
                                Ver todos los productos
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusquedaResultados;
