import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useBuscarProductosRapido from '@hooks/productos/useBuscarProductosRapido';
import '@styles/barraBusqueda.css';

const BarraBusqueda = () => {
    const [busqueda, setBusqueda] = useState('');
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
        }, 400);

        return () => clearTimeout(delay);
    }, [busqueda, buscarAutocomplete]);

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

    return (
        <div className="barra-busqueda">
            <form onSubmit={manejarSubmit}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onFocus={() => {
                        if (busqueda.trim()) setMostrarResultados(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => setMostrarResultados(false), 300);
                    }}
                />
            </form>

            {mostrarResultados && (
                <div className="resultados-busqueda">
                    {resultados.length > 0 && <p className="titulo-seccion">PRODUCTOS</p>}
                    {resultados.map((producto) => (
                        <Link
                            key={producto.id}
                            to={`/productos/${producto.nombre
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[áéíóú]/g, (m) => ({
                                    á: 'a',
                                    é: 'e',
                                    í: 'i',
                                    ó: 'o',
                                    ú: 'u'
                                }[m]))}`}
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
