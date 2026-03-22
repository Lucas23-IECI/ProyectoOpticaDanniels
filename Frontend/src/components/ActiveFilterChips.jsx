import { FaTimes } from "react-icons/fa";

const LABEL_MAP = {
    categoria: "Categoría",
    subcategoria: "Subcategoría",
    marca: "Marca",
    genero: "Género",
    forma: "Forma",
    material: "Material",
    color_armazon: "Color Armazón",
    color_cristal: "Color Cristal",
    polarizado: "Polarizado",
    tipo_cristal: "Tipo Cristal",
    disponibilidad: "Disponibilidad",
    precio_min: "Precio mín.",
    precio_max: "Precio máx.",
    nombre: "Búsqueda",
};

const ActiveFilterChips = ({ filtros, onRemove, onClearAll }) => {
    const activeFilters = Object.entries(filtros).filter(
        ([, v]) => v !== "" && v !== undefined && v !== null
    );

    if (activeFilters.length === 0) return null;

    return (
        <div className="active-chips">
            {activeFilters.map(([key, value]) => {
                let displayValue = value;
                if (key === "polarizado") displayValue = value === "true" ? "Sí" : "No";
                if (key === "precio_min") displayValue = `$${Number(value).toLocaleString()}+`;
                if (key === "precio_max") displayValue = `Hasta $${Number(value).toLocaleString()}`;

                return (
                    <button key={key} className="chip" onClick={() => onRemove(key)}>
                        <span className="chip-label">{LABEL_MAP[key] || key}:</span>
                        <span className="chip-value">{displayValue}</span>
                        <FaTimes size={10} />
                    </button>
                );
            })}
            {activeFilters.length > 1 && (
                <button className="chip chip-clear" onClick={onClearAll}>
                    Limpiar todos
                    <FaTimes size={10} />
                </button>
            )}
        </div>
    );
};

export default ActiveFilterChips;
