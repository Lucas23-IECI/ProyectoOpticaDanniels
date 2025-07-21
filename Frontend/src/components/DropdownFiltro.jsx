import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "@styles/dropdownFiltro.css";

const DropdownFiltro = ({
    id,
    titulo,
    tipo,
    opciones = [],
    seleccion,
    onSeleccion,
    precioMin,
    precioMax,
    setPrecioMin,
    setPrecioMax,
    dropdownActivo,
    setDropdownActivo,
}) => {
    const abierto = dropdownActivo === id;
    const [inputMin, setInputMin] = useState(precioMin);
    const [inputMax, setInputMax] = useState(precioMax);
    const debounceRef = useRef(null);

    const tieneSeleccion = () => {
        if (tipo === "precio") {
            return precioMin || precioMax;
        }
        return seleccion && seleccion !== "";
    };

    const toggleDropdown = () => {
        setDropdownActivo(abierto ? null : id);
    };

    const manejarCheckbox = (valor) => {
        onSeleccion(valor === seleccion ? "" : valor);
        setDropdownActivo(null);
    };

    const manejarSelect = (e) => {
        onSeleccion(e.target.value);
        setDropdownActivo(null);
    };

    const restablecerPrecio = () => {
        setInputMin("");
        setInputMax("");
        setPrecioMin("");
        setPrecioMax("");
    };

    useEffect(() => {
        setInputMin(precioMin);
        setInputMax(precioMax);
    }, [precioMin, precioMax]);

    useEffect(() => {
        if (tipo === "precio") {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                const min = Math.max(parseInt(inputMin) || 0, 0);
                const max = Math.max(parseInt(inputMax) || 0, 0);

                if (min > max && max !== 0) {
                    setPrecioMin("");
                    setPrecioMax("");
                    setDropdownActivo(null);
                } else {
                    setPrecioMin(min ? String(min) : "");
                    setPrecioMax(max ? String(max) : "");
                }
            }, 1000);
        }
    }, [inputMin, inputMax, tipo, setPrecioMin, setPrecioMax, setDropdownActivo]);

    return (
        <div className={`dropdown-filtro ${abierto ? "abierto" : ""} ${tieneSeleccion() ? "activo" : ""}`}>
            <button
                type="button"
                className="dropdown-titulo"
                onClick={toggleDropdown}
            >
                {titulo} 
                {tieneSeleccion() && <span className="filtro-activo-indicador">●</span>}
                {abierto ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {abierto && (
                <div className="dropdown-contenido">
                    {tipo === "checkbox" && (
                        <>
                            <ul className="dropdown-opciones">
                                {opciones.map((opcion) => (
                                    <li key={opcion.valor}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={seleccion === opcion.valor}
                                                onChange={() => manejarCheckbox(opcion.valor)}
                                            />
                                            {opcion.etiqueta}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                className="restablecer-boton"
                                onClick={() => onSeleccion("")}
                            >
                                Restablecer
                            </button>
                        </>
                    )}

                    {tipo === "precio" && (
                        <>
                            <div className="dropdown-precio">
                                <div className="precio-item">
                                    <span>$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        placeholder="Mín"
                                        value={inputMin}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, "");
                                            setInputMin(value);
                                        }}
                                    />
                                </div>
                                <div className="precio-item">
                                    <span>$</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        placeholder="Máx"
                                        value={inputMax}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d]/g, "");
                                            setInputMax(value);
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="restablecer-boton"
                                onClick={restablecerPrecio}
                            >
                                Restablecer
                            </button>
                        </>
                    )}

                    {tipo === "select" && (
                        <select
                            value={seleccion}
                            onChange={manejarSelect}
                            className="dropdown-select"
                        >
                            {opciones.map((opcion) => (
                                <option key={opcion.valor} value={opcion.valor}>
                                    {opcion.etiqueta}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownFiltro;
