import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useGetProductos from "@hooks/productos/useGetProductos";
import useGetFacetas from "@hooks/productos/useGetFacetas";
import { formatearNombreParaURL } from "@helpers/formatData";
import ProductCard from "@components/ProductCard";
import CatalogSidebar from "@components/CatalogSidebar";
import ActiveFilterChips from "@components/ActiveFilterChips";
import { ProductGridSkeleton } from "@components/ProductCardSkeleton";
import QuickViewModal from "@components/QuickViewModal";
import RecentlyViewed, { addToRecentlyViewed } from "@components/RecentlyViewed";
import Breadcrumbs from "@components/Breadcrumbs";
import SugerenciasBusqueda from "@components/SugerenciasBusqueda";
import "@styles/productos.css";
import { FaFilter, FaTimes, FaSearch, FaSort, FaEyeSlash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 16;

const SORT_OPTIONS = [
    { value: "", label: "Más relevantes" },
    { value: "precio_ASC", label: "Precio: menor a mayor" },
    { value: "precio_DESC", label: "Precio: mayor a menor" },
    { value: "nombre_ASC", label: "Nombre: A-Z" },
    { value: "nombre_DESC", label: "Nombre: Z-A" },
    { value: "createdAt_DESC", label: "Novedades" },
];

// Keys for filtros that map directly to query params
const FILTER_KEYS = [
    "categoria", "subcategoria", "marca", "genero", "forma", "material",
    "color_armazon", "color_cristal", "polarizado", "tipo_cristal",
    "disponibilidad", "precio_min", "precio_max",
];

const readFiltersFromParams = (sp) => {
    const f = {};
    FILTER_KEYS.forEach((k) => {
        const v = sp.get(k);
        if (v) f[k] = v;
    });
    return f;
};

const Productos = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // URL is the single source of truth — derive all state from it
    const filtros = useMemo(() => readFiltersFromParams(searchParams), [searchParams]);
    const orden = searchParams.get("orden") || "";
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const searchFromUrl = searchParams.get("busqueda") || "";

    // Local search input (for responsive typing, debounced sync to URL)
    const [searchInput, setSearchInput] = useState(searchFromUrl);
    const debounceRef = useRef(null);

    // Sync local input when URL changes externally (navbar, chips, etc.)
    useEffect(() => {
        setSearchInput(searchFromUrl);
    }, [searchFromUrl]);

    // UI state
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    const { productos, paginacion, loading, fetchProductos } = useGetProductos();
    const { facetas, fetchFacetas } = useGetFacetas();

    // Fetch data whenever URL params change
    useEffect(() => {
        const params = { activo: true, page: currentPage, limit: ITEMS_PER_PAGE };
        if (searchFromUrl.trim()) params.nombre = searchFromUrl.trim();
        if (orden) params.orden = orden;
        FILTER_KEYS.forEach((k) => { if (filtros[k]) params[k] = filtros[k]; });
        fetchProductos(params);
        fetchFacetas(params);
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter handler — updates URL directly
    const handleFiltroChange = useCallback((key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value === "" || value === undefined || value === null) {
            next.delete(key);
        } else {
            next.set(key, value);
        }
        next.delete("page");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    const clearAllFilters = useCallback(() => {
        setSearchParams({}, { replace: true });
        setSearchInput("");
    }, [setSearchParams]);

    const removeFilter = useCallback((key) => {
        const next = new URLSearchParams(searchParams);
        if (key === "nombre") {
            next.delete("busqueda");
            setSearchInput("");
        } else {
            next.delete(key);
        }
        next.delete("page");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    // Search input with debounce
    const handleSearchChange = useCallback((value) => {
        setSearchInput(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const next = new URLSearchParams(searchParams);
            if (value.trim()) next.set("busqueda", value.trim());
            else next.delete("busqueda");
            next.delete("page");
            setSearchParams(next, { replace: true });
        }, 400);
    }, [searchParams, setSearchParams]);

    // Sort handler
    const handleOrdenChange = useCallback((value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set("orden", value);
        else next.delete("orden");
        next.delete("page");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    // Page handler
    const handlePageChange = useCallback((page) => {
        const next = new URLSearchParams(searchParams);
        if (page > 1) next.set("page", String(page));
        else next.delete("page");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    // For chips display
    const chipsData = useMemo(() => {
        const data = { ...filtros };
        if (searchFromUrl.trim()) data.nombre = searchFromUrl.trim();
        return data;
    }, [filtros, searchFromUrl]);

    const activeFilterCount = Object.keys(chipsData).length;

    // QuickView handler
    const handleQuickView = useCallback((producto) => {
        addToRecentlyViewed(producto);
        setQuickViewProduct(producto);
    }, []);

    // Breadcrumb trail
    const breadcrumbTrail = useMemo(() => {
        const trail = [{ label: "Productos", path: "/productos", isLast: !filtros.categoria }];
        if (filtros.categoria) {
            const catLabel = filtros.categoria === "opticos" ? "Ópticos" : filtros.categoria === "sol" ? "Sol" : "Accesorios";
            trail.push({
                label: catLabel,
                path: `/productos?categoria=${filtros.categoria}`,
                isLast: !filtros.subcategoria,
            });
        }
        if (filtros.subcategoria) {
            trail.push({ label: filtros.subcategoria, path: "#", isLast: true });
        }
        return trail;
    }, [filtros.categoria, filtros.subcategoria]);

    const displayedProducts = productos || [];

    return (
        <div className="catalog-container">
            {/* Header: breadcrumbs + title + search + sort */}
            <div className="catalog-topbar">
                <Breadcrumbs customTrail={breadcrumbTrail} />

                <div className="topbar-controls">
                    <div className="topbar-left">
                        <button
                            className="mobile-filter-btn"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FaFilter />
                            Filtrar
                            {activeFilterCount > 0 && (
                                <span className="mobile-filter-badge">{activeFilterCount}</span>
                            )}
                        </button>

                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchInput}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="search-input"
                            />
                            {searchInput && (
                                <button className="clear-search" onClick={() => handleSearchChange("")}>
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="topbar-right">
                        {paginacion && (
                            <span className="results-count">
                                {paginacion.total} producto{paginacion.total !== 1 ? "s" : ""}
                            </span>
                        )}
                        <div className="sort-control">
                            <FaSort className="sort-icon" />
                            <select
                                value={orden}
                                onChange={(e) => handleOrdenChange(e.target.value)}
                                className="sort-select"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <ActiveFilterChips filtros={chipsData} onRemove={removeFilter} onClearAll={clearAllFilters} />
            </div>

            {/* Main layout: sidebar + grid */}
            <div className="catalog-layout">
                <CatalogSidebar
                    filtros={filtros}
                    facetas={facetas}
                    onFiltroChange={handleFiltroChange}
                    onClearAll={clearAllFilters}
                    onClose={() => setSidebarOpen(false)}
                    isMobileOpen={sidebarOpen}
                />

                <main className="catalog-main">
                    {loading ? (
                        <ProductGridSkeleton count={ITEMS_PER_PAGE} />
                    ) : displayedProducts.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {displayedProducts.map((producto) => (
                                    <Link
                                        key={producto.id}
                                        to={`/productos/${formatearNombreParaURL(producto.nombre)}`}
                                        className="product-link"
                                        onClick={() => addToRecentlyViewed(producto)}
                                    >
                                        <ProductCard producto={producto} viewMode="grid" />
                                    </Link>
                                ))}
                            </div>

                            {paginacion && paginacion.paginas > 1 && (
                                <div className="pagination-controls">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage <= 1}
                                    >
                                        <FaChevronLeft />
                                        <span>Anterior</span>
                                    </button>

                                    <div className="pagination-pages">
                                        {(() => {
                                            const pages = [];
                                            const total = paginacion.paginas;
                                            const current = paginacion.pagina;
                                            pages.push(1);
                                            if (current > 3) pages.push("...");
                                            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                                                pages.push(i);
                                            }
                                            if (current < total - 2) pages.push("...");
                                            if (total > 1) pages.push(total);
                                            return pages.map((page, idx) =>
                                                page === "..." ? (
                                                    <span key={`e-${idx}`} className="pagination-ellipsis">...</span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        className={`pagination-page ${page === current ? "active" : ""}`}
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            );
                                        })()}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(Math.min(paginacion.paginas, currentPage + 1))}
                                        disabled={currentPage >= paginacion.paginas}
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
                            {activeFilterCount > 0 ? (
                                <>
                                    <h3>No se encontraron productos</h3>
                                    <p>No hay productos que coincidan con los filtros aplicados</p>
                                    {searchFromUrl && (
                                        <SugerenciasBusqueda
                                            terminoBusqueda={searchFromUrl}
                                            onSugerenciaClick={(sug) => {
                                                const next = new URLSearchParams();
                                                next.set("busqueda", sug);
                                                setSearchParams(next, { replace: true });
                                                setSearchInput(sug);
                                            }}
                                        />
                                    )}
                                    <button className="empty-state-btn" onClick={clearAllFilters}>
                                        Limpiar filtros y ver todos
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3>Catálogo vacío</h3>
                                    <p>Aún no hay productos disponibles en el catálogo</p>
                                </>
                            )}
                        </div>
                    )}

                    <RecentlyViewed />
                </main>
            </div>

            {quickViewProduct && (
                <QuickViewModal producto={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
            )}
        </div>
    );
};

export default Productos;