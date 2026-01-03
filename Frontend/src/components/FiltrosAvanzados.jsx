import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import '@styles/filtrosAvanzados.css';

const FiltrosAvanzados = ({
    filtros,
    onFiltroChange,
    onLimpiarFiltros,
    productosData = [] // Para generar filtros dinámicos
}) => {
    const [seccionesAbiertas, setSeccionesAbiertas] = useState({
        forma: false,
        marca: false,
        genero: false,
        material: false,
        color: false,
        tamaño: false
    });

    // Generar opciones dinámicas basadas en los productos
    const generarOpciones = (campo) => {
        const valores = [...new Set(
            productosData
                .map(producto => producto[campo])
                .filter(valor => valor && valor.trim())
        )].sort();
        return valores;
    };

    const toggleSeccion = (seccion) => {
        setSeccionesAbiertas(prev => ({
            ...prev,
            [seccion]: !prev[seccion]
        }));
    };

    const handleCheckboxChange = (campo, valor) => {
        const valoresActuales = filtros[campo] || [];
        const nuevosValores = valoresActuales.includes(valor)
            ? valoresActuales.filter(v => v !== valor)
            : [...valoresActuales, valor];

        onFiltroChange(campo, nuevosValores);
    };

    // Opciones predefinidas para algunos filtros
    const opcionesForma = [
        'Aviador', 'Wayfarer', 'Redondo', 'Cuadrado', 'Ovalado',
        'Gato', 'Mariposa', 'Clubmaster', 'Sport', 'Sin marco', 'Medio marco'
    ];

    const opcionesGenero = ['Masculino', 'Femenino', 'Unisex', 'Niños'];

    const opcionesMaterial = [
        'Acetato', 'Metal', 'Titanio', 'Acero inoxidable',
        'Aluminio', 'Plástico', 'TR90', 'Carbono'
    ];

    const opcionesColor = [
        'Negro', 'Marrón', 'Dorado', 'Plateado', 'Azul', 'Verde',
        'Rojo', 'Rosa', 'Transparente', 'Carey', 'Multicolor'
    ];

    const opcionesTamaño = ['Pequeño', 'Mediano', 'Grande', 'Extra Grande'];

    const renderSeccionFiltro = (titulo, campo, opciones, icono = null) => {
        const abierta = seccionesAbiertas[campo];
        const valoresSeleccionados = filtros[campo] || [];
        const tieneSeleccion = valoresSeleccionados.length > 0;

        return (
            <div className="filtro-seccion">
                <button
                    className={`filtro-header ${tieneSeleccion ? 'con-seleccion' : ''}`}
                    onClick={() => toggleSeccion(campo)}
                >
                    <div className="filtro-titulo">
                        {icono && <span className="filtro-icono">{icono}</span>}
                        <span>{titulo}</span>
                        {tieneSeleccion && (
                            <span className="contador-seleccion">({valoresSeleccionados.length})</span>
                        )}
                    </div>
                    {abierta ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {abierta && (
                    <div className="filtro-contenido">
                        <div className="opciones-grid">
                            {opciones.map(opcion => (
                                <label key={opcion} className="opcion-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={valoresSeleccionados.includes(opcion)}
                                        onChange={() => handleCheckboxChange(campo, opcion)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="opcion-texto">{opcion}</span>
                                </label>
                            ))}
                        </div>
                        {tieneSeleccion && (
                            <button
                                className="limpiar-seccion"
                                onClick={() => onFiltroChange(campo, [])}
                            >
                                <FaTimes />
                                Limpiar {titulo.toLowerCase()}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="filtros-avanzados">
            <div className="filtros-avanzados-header">
                <h4>Filtros Avanzados</h4>
                <button
                    className="limpiar-todos"
                    onClick={onLimpiarFiltros}
                >
                    <FaTimes />
                    Limpiar todo
                </button>
            </div>

            <div className="filtros-avanzados-contenido">
                {renderSeccionFiltro('Forma', 'forma', opcionesForma, '👓')}
                {renderSeccionFiltro('Marca', 'marca', generarOpciones('marca'), '🏷️')}
                {renderSeccionFiltro('Género', 'genero', opcionesGenero, '👥')}
                {renderSeccionFiltro('Material', 'material', opcionesMaterial, '🔨')}
                {renderSeccionFiltro('Color', 'color', opcionesColor, '🎨')}
                {renderSeccionFiltro('Tamaño', 'tamaño', opcionesTamaño, '📏')}
            </div>
        </div>
    );
};

export default FiltrosAvanzados;