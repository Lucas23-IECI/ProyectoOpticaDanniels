import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSugerenciasBusqueda } from '@services/producto.service';
import '@styles/sugerenciasBusqueda.css';

const SugerenciasBusqueda = ({ terminoBusqueda, onSugerenciaClick }) => {
    const [sugerencias, setSugerencias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerSugerencias = async () => {
            if (!terminoBusqueda || terminoBusqueda.trim().length < 2) {
                setSugerencias([]);
                return;
            }

            setCargando(true);
            try {
                const sugerenciasData = await obtenerSugerenciasBusqueda(terminoBusqueda);
                setSugerencias(sugerenciasData);
            } catch (error) {
                console.error('Error obteniendo sugerencias:', error);
                setSugerencias([]);
            } finally {
                setCargando(false);
            }
        };

        // Debounce para no hacer muchas peticiones
        const timeoutId = setTimeout(obtenerSugerencias, 300);
        return () => clearTimeout(timeoutId);
    }, [terminoBusqueda]);

    const handleSugerenciaClick = (sugerencia) => {
        if (onSugerenciaClick) {
            onSugerenciaClick(sugerencia);
        } else {
            navigate(`/buscar?query=${encodeURIComponent(sugerencia)}`);
        }
    };

    if (!terminoBusqueda || terminoBusqueda.trim().length < 2) {
        return null;
    }

    if (sugerencias.length === 0 && !cargando) {
        return null;
    }

    return (
        <div className="sugerencias-busqueda">
            <div className="sugerencias-header">
                <span className="sugerencias-texto">¿Quisiste decir...</span>
            </div>
            <div className="sugerencias-lista">
                {cargando ? (
                    <div className="sugerencias-cargando">
                        <div className="spinner"></div>
                        <span>Buscando sugerencias...</span>
                    </div>
                ) : sugerencias.length > 0 ? (
                    sugerencias.map((sugerencia, index) => (
                        <button
                            key={index}
                            className="sugerencia-item"
                            onClick={() => handleSugerenciaClick(sugerencia)}
                        >
                            <span className="sugerencia-texto">{sugerencia}</span>
                            <i className="fas fa-search sugerencia-icono"></i>
                        </button>
                    ))
                ) : (
                    <div className="sugerencias-vacio">
                        <span>No se encontraron sugerencias para "{terminoBusqueda}"</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SugerenciasBusqueda; 