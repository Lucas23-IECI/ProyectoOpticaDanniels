import { FaSlidersH } from 'react-icons/fa';
import '@styles/productos/horizontal-filters.css';

const SORT_OPTIONS = [
    { value: '',               label: 'Más relevantes' },
    { value: 'precio_ASC',     label: 'Precio: menor a mayor' },
    { value: 'precio_DESC',    label: 'Precio: mayor a menor' },
    { value: 'nombre_ASC',     label: 'Nombre: A-Z' },
    { value: 'nombre_DESC',    label: 'Nombre: Z-A' },
    { value: 'createdAt_DESC', label: 'Novedades' },
];

const HorizontalFilterBar = ({
    filtros,
    searchInput,
    orden,
    onOrdenChange,
    gridColumns,
    onGridColumnsChange,
    totalProductos,
    onMobileFilterOpen,
}) => {
    const activeFilterCount = Object.values(filtros).filter(Boolean).length + (searchInput ? 1 : 0);

    return (
        <div className="hfb-wrapper">
            <div className="hfb-inner">
                <span className="hfb-count">
                    {totalProductos != null ? `${totalProductos} productos` : ''}
                </span>
                <div className="hfb-spacer" />
                <div className="hfb-right-controls">
                    <div className="hfb-sort-wrapper">
                        <span className="hfb-sort-label">Ordenar por:</span>
                        <select
                            className="hfb-sort-select"
                            value={orden}
                            onChange={(e) => onOrdenChange(e.target.value)}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="hfb-sep" />
                    <div className="hfb-grid-toggle">
                        <button
                            className={`hfb-cols-btn ${gridColumns === 3 ? 'active' : ''}`}
                            onClick={() => onGridColumnsChange(3)}
                            title="3 columnas"
                        >3</button>
                        <button
                            className={`hfb-cols-btn ${gridColumns === 4 ? 'active' : ''}`}
                            onClick={() => onGridColumnsChange(4)}
                            title="4 columnas"
                        >4</button>
                    </div>
                    <div className="hfb-sep" />
                    <button
                        className={`hfb-filter-trigger ${activeFilterCount > 0 ? 'has-filters' : ''}`}
                        onClick={onMobileFilterOpen}
                    >
                        <FaSlidersH />
                        <span>Filtros</span>
                        {activeFilterCount > 0 && (
                            <span className="hfb-filter-count">{activeFilterCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HorizontalFilterBar;

