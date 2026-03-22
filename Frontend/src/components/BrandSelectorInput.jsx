import { useState, useEffect, useRef } from 'react';
import useMarcas from '@hooks/useMarcas';

/**
 * Selector estilizado de marcas de lentes.
 * Muestra un dropdown con logo + nombre para cada marca conocida,
 * más una opción "Otra marca..." que habilita un input de texto libre.
 *
 * Props:
 *   value     {string}   — valor actual (formData.marca)
 *   onChange  {function} — handler que recibe un evento sintético {target:{name,value}}
 *   error     {string}   — mensaje de error a mostrar
 *   name      {string}   — nombre del campo (default: 'marca')
 */
const BrandSelectorInput = ({ value, onChange, error, name = 'marca' }) => {
    const { marcas, loading } = useMarcas();
    const [open, setOpen] = useState(false);
    const [userChoseOtra, setUserChoseOtra] = useState(false);
    const [searchText, setSearchText] = useState('');
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    // Marca seleccionada (si coincide con alguna conocida)
    const selectedMarca = marcas.find(
        (m) => m.nombre.toLowerCase() === (value || '').toLowerCase()
    );

    // Modo "otra marca": usuario eligió explícitamente O el valor no está en la lista
    const isOtra = !loading && (userChoseOtra || (!!value && !selectedMarca));

    // Cuando el valor cambia a una marca conocida (p.ej. al abrir EditarProducto),
    // salir del modo "otra" automáticamente
    useEffect(() => {
        if (selectedMarca) {
            setUserChoseOtra(false);
        }
    }, [selectedMarca]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
                setSearchText('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Focus en el buscador al abrir dropdown
    useEffect(() => {
        if (open && searchRef.current) {
            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [open]);

    // ── Handlers ──────────────────────────────────────────────
    const handleSelect = (marca) => {
        setUserChoseOtra(false);
        setSearchText('');
        setOpen(false);
        onChange({ target: { name, value: marca.nombre } });
    };

    const handleSelectOtra = () => {
        setUserChoseOtra(true);
        setOpen(false);
        setSearchText('');
        onChange({ target: { name, value: '' } });
    };

    const handleOtraChange = (e) => {
        onChange({ target: { name, value: e.target.value } });
    };

    const handleClearOtra = () => {
        setUserChoseOtra(false);
        onChange({ target: { name, value: '' } });
    };

    const filteredMarcas = marcas.filter((m) =>
        m.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="brand-selector" ref={dropdownRef}>
            {!isOtra ? (
                /* ── Trigger button (selector mode) ── */
                <button
                    type="button"
                    className={`brand-trigger${error ? ' error' : ''}${open ? ' open' : ''}`}
                    onClick={() => setOpen((v) => !v)}
                >
                    {selectedMarca ? (
                        <span className="brand-pill">
                            <img
                                src={selectedMarca.logo_path}
                                alt={selectedMarca.nombre}
                                className="brand-pill-logo"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="brand-pill-name">{selectedMarca.nombre}</span>
                        </span>
                    ) : (
                        <span className="brand-placeholder">
                            {loading ? 'Cargando marcas...' : 'Selecciona una marca'}
                        </span>
                    )}
                    <svg
                        className={`brand-chevron${open ? ' rotated' : ''}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            ) : (
                /* ── Otra marca: text input mode ── */
                <div className="brand-custom-wrapper">
                    <input
                        type="text"
                        className={`brand-custom-input${error ? ' error' : ''}`}
                        placeholder="Escribe el nombre de la marca"
                        value={value}
                        onChange={handleOtraChange}
                        autoFocus
                        maxLength={50}
                    />
                    <button
                        type="button"
                        className="brand-back-btn"
                        onClick={handleClearOtra}
                        title="Volver al selector"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ── Dropdown panel ── */}
            {open && (
                <div className="brand-dropdown">
                    <div className="brand-search-wrap">
                        <input
                            ref={searchRef}
                            type="text"
                            className="brand-search-input"
                            placeholder="Buscar marca..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <ul className="brand-options-list">
                        {filteredMarcas.map((marca) => (
                            <li key={marca.id}>
                                <button
                                    type="button"
                                    className={`brand-option${selectedMarca?.id === marca.id ? ' selected' : ''}`}
                                    onClick={() => handleSelect(marca)}
                                >
                                    <img
                                        src={marca.logo_path}
                                        alt={marca.nombre}
                                        className="brand-option-logo"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <span className="brand-option-name">{marca.nombre}</span>
                                    {selectedMarca?.id === marca.id && (
                                        <span className="brand-option-check">✓</span>
                                    )}
                                </button>
                            </li>
                        ))}
                        {filteredMarcas.length === 0 && (
                            <li className="brand-no-results">No se encontraron marcas</li>
                        )}
                    </ul>

                    <button
                        type="button"
                        className="brand-otra-option"
                        onClick={handleSelectOtra}
                    >
                        + Otra marca...
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrandSelectorInput;
