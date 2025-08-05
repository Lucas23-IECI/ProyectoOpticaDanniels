import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useBuscarProductosRapido from '@hooks/productos/useBuscarProductosRapido';
import { formatearNombreParaURL } from '@helpers/formatData';
import '@styles/barraBusqueda.css';

const BarraBusqueda = () => {
    const [busqueda, setBusqueda] = useState('');
    const [expandida, setExpandida] = useState(false);
    const { resultados, cargando, buscar } = useBuscarProductosRapido();
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const navegar = useNavigate();

    const buscarAutocomplete = useCallback((termino) => {
        if (termino.trim() !== '') {
            buscar(termino);
            setMostrarResultados(true);
        } else {
            setMostrarResultados(false);
        }
    }, [buscar]);

    useEffect(() => {
        const delay = setTimeout(() => {
            buscarAutocomplete(busqueda);
        }, 750);

        return () => clearTimeout(delay);
    }, [busqueda, buscarAutocomplete]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (expandida && !event.target.closest('.barra-busqueda')) {
                setExpandida(false);
                setBusqueda('');
                setMostrarResultados(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [expandida]);

    const manejarBuscar = () => {
        if (busqueda.trim() !== '') {
            navegar(`/buscar?query=${encodeURIComponent(busqueda.trim())}`);
            setMostrarResultados(false);
        }
    };

    const manejarSubmit = (e) => {
        e.preventDefault();
        manejarBuscar();
    };

    const toggleBusqueda = () => {
        setExpandida(!expandida);
        if (!expandida) {
            setTimeout(() => {
                const input = document.querySelector('.navbar .barra-busqueda input');
                if (input) input.focus();
            }, 100);
        } else {
            setBusqueda('');
            setMostrarResultados(false);
        }
    };

    return (
        <div className={`barra-busqueda ${expandida ? 'expandida' : 'colapsada'}`}>
            <button 
                type="button" 
                className="icono-busqueda"
                onClick={toggleBusqueda}
                style={{ display: expandida ? 'none' : 'flex' }}
            >
                <i className="fas fa-search"></i>
            </button>
            
            <form onSubmit={manejarSubmit} style={{ width: '100%' }}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onFocus={() => {
                        if (busqueda.trim()) setMostrarResultados(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setMostrarResultados(false);
                            if (!busqueda.trim()) {
                                setExpandida(false);
                            }
                        }, 300);
                    }}
                />
            </form>

            {mostrarResultados && (
                <div className="resultados-busqueda">
                    {resultados.length > 0 && <p className="titulo-seccion">PRODUCTOS</p>}
                    {resultados.map((producto) => (
                        <Link
                            key={producto.id}
                            to={`/productos/${formatearNombreParaURL(producto.nombre)}`}
                            className="resultado-item"
                        >
                            <div className="resultado-info">
                                <p className="resultado-nombre">{producto.nombre}</p>
                                <p className="resultado-precio">
                                    ${parseFloat(producto.precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CLP
                                </p>
                            </div>
                        </Link>
                    ))}

                    {busqueda.trim() && (
                        <div
                            className="resultado-item resultado-buscar-todo"
                            onMouseDown={manejarBuscar}
                        >
                            Buscar “{busqueda}”
                        </div>
                    )}
                </div>
            )}

            {cargando && <div className="cargando">Buscando...</div>}
        </div>
    );
};

export default BarraBusqueda;
