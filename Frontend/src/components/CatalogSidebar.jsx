import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTimes, FaSearch } from "react-icons/fa";

const CATEGORIAS_MAP = {
    opticos: "Ópticos",
    sol: "Sol",
    accesorios: "Accesorios",
};

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="filter-section">
            <button className="filter-section-header" onClick={() => setOpen(!open)}>
                <span>{title}</span>
                {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
            {open && <div className="filter-section-body">{children}</div>}
        </div>
    );
};

const CheckboxList = ({ items, selected, onChange, showCount = true }) => {
    if (!items || items.length === 0) return <p className="filter-empty">Sin opciones</p>;
    return (
        <ul className="filter-checkbox-list">
            {items.map((item) => {
                const value = typeof item === "string" ? item : item.valor;
                const count = typeof item === "string" ? null : item.count;
                const isActive = selected === value;
                return (
                    <li key={value}>
                        <label className={`filter-checkbox-label ${isActive ? "active" : ""}`}>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => onChange(isActive ? "" : value)}
                            />
                            <span className="filter-checkbox-text">{value}</span>
                            {showCount && count != null && (
                                <span className="filter-count-badge">{count}</span>
                            )}
                        </label>
                    </li>
                );
            })}
        </ul>
    );
};

const CatalogSidebar = ({
    filtros,
    facetas,
    onFiltroChange,
    onClearAll,
    onClose,
    isMobileOpen,
    searchInput = '',
    onSearchChange,
}) => {
    const handleChange = (key) => (value) => {
        onFiltroChange(key, value);
    };

    const activeCount = Object.values(filtros).filter(
        (v) => v !== "" && v !== undefined && v !== null
    ).length;

    return (
        <>
            {isMobileOpen && <div className="catalog-overlay" onClick={onClose} />}
            <aside className={`catalog-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-header">
                    <h3>Filtros</h3>
                    <div className="sidebar-header-actions">
                        {activeCount > 0 && (
                            <button className="sidebar-clear-btn" onClick={onClearAll}>
                                Limpiar ({activeCount})
                            </button>
                        )}
                        <button className="sidebar-close-btn" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="sidebar-filters">
                    {onSearchChange && (
                        <div className="sidebar-search">
                            <FaSearch className="sidebar-search-icon" />
                            <input
                                type="text"
                                className="sidebar-search-input"
                                placeholder="Buscar productos..."
                                value={searchInput}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    )}
                    <FilterSection title="Categoría">
                        <CheckboxList
                            items={(facetas.categorias || []).map((f) => ({
                                ...f,
                                valor: f.valor,
                                displayLabel: CATEGORIAS_MAP[f.valor] || f.valor,
                            }))}
                            selected={filtros.categoria}
                            onChange={handleChange("categoria")}
                        />
                    </FilterSection>

                    <FilterSection title="Subcategoría" defaultOpen={!!filtros.subcategoria}>
                        <CheckboxList
                            items={facetas.subcategorias || []}
                            selected={filtros.subcategoria}
                            onChange={handleChange("subcategoria")}
                        />
                    </FilterSection>

                    <FilterSection title="Marca">
                        <CheckboxList
                            items={facetas.marcas || []}
                            selected={filtros.marca}
                            onChange={handleChange("marca")}
                        />
                    </FilterSection>

                    <FilterSection title="Género">
                        <CheckboxList
                            items={facetas.generos || []}
                            selected={filtros.genero}
                            onChange={handleChange("genero")}
                        />
                    </FilterSection>

                    <FilterSection title="Precio" defaultOpen={!!(filtros.precio_min || filtros.precio_max)}>
                        <div className="filter-price-range">
                            <div className="price-inputs">
                                <div className="price-input-group">
                                    <span className="price-prefix">$</span>
                                    <input
                                        type="number"
                                        placeholder={facetas.precioRango?.min || "Min"}
                                        value={filtros.precio_min || ""}
                                        onChange={(e) => onFiltroChange("precio_min", e.target.value)}
                                        min={0}
                                    />
                                </div>
                                <span className="price-separator">—</span>
                                <div className="price-input-group">
                                    <span className="price-prefix">$</span>
                                    <input
                                        type="number"
                                        placeholder={facetas.precioRango?.max || "Max"}
                                        value={filtros.precio_max || ""}
                                        onChange={(e) => onFiltroChange("precio_max", e.target.value)}
                                        min={0}
                                    />
                                </div>
                            </div>
                            {facetas.precioRango && (
                                <p className="price-range-hint">
                                    ${facetas.precioRango.min?.toLocaleString()} – ${facetas.precioRango.max?.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </FilterSection>

                    <FilterSection title="Forma" defaultOpen={!!filtros.forma}>
                        <CheckboxList
                            items={facetas.formas || []}
                            selected={filtros.forma}
                            onChange={handleChange("forma")}
                        />
                    </FilterSection>

                    <FilterSection title="Material" defaultOpen={!!filtros.material}>
                        <CheckboxList
                            items={facetas.materiales || []}
                            selected={filtros.material}
                            onChange={handleChange("material")}
                        />
                    </FilterSection>

                    <FilterSection title="Color Armazón" defaultOpen={!!filtros.color_armazon}>
                        <CheckboxList
                            items={facetas.coloresArmazon || []}
                            selected={filtros.color_armazon}
                            onChange={handleChange("color_armazon")}
                        />
                    </FilterSection>

                    <FilterSection title="Color Cristal" defaultOpen={!!filtros.color_cristal}>
                        <CheckboxList
                            items={facetas.coloresCristal || []}
                            selected={filtros.color_cristal}
                            onChange={handleChange("color_cristal")}
                        />
                    </FilterSection>

                    <FilterSection title="Polarizado" defaultOpen={!!filtros.polarizado}>
                        <CheckboxList
                            items={(facetas.polarizado || []).map((p) => ({
                                valor: p.valor,
                                count: p.count,
                            }))}
                            selected={
                                filtros.polarizado === "true"
                                    ? "Sí"
                                    : filtros.polarizado === "false"
                                    ? "No"
                                    : ""
                            }
                            onChange={(val) => {
                                if (val === "Sí") onFiltroChange("polarizado", "true");
                                else if (val === "No") onFiltroChange("polarizado", "false");
                                else onFiltroChange("polarizado", "");
                            }}
                        />
                    </FilterSection>

                    <FilterSection title="Tipo de Cristal" defaultOpen={!!filtros.tipo_cristal}>
                        <CheckboxList
                            items={facetas.tiposCristal || []}
                            selected={filtros.tipo_cristal}
                            onChange={handleChange("tipo_cristal")}
                        />
                    </FilterSection>

                    <FilterSection title="Disponibilidad" defaultOpen={!!filtros.disponibilidad}>
                        <CheckboxList
                            items={[
                                { valor: "disponible", count: null },
                                { valor: "agotado", count: null },
                            ]}
                            selected={filtros.disponibilidad}
                            onChange={handleChange("disponibilidad")}
                            showCount={false}
                        />
                    </FilterSection>
                </div>
            </aside>
        </>
    );
};

export default CatalogSidebar;
