import { useState, useCallback, useRef } from 'react';
import { getProductos } from '@services/producto.service';

const useBuscarProductosRapido = () => {
    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const ultimaBusquedaRef = useRef('');
    const debounceRef = useRef(null);

    const buscar = useCallback(async (nombre) => {
        if (!nombre) {
            setResultados([]);
            ultimaBusquedaRef.current = '';
            return;
        }

        if (ultimaBusquedaRef.current === nombre) {
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(async () => {
            try {
                setCargando(true);
                ultimaBusquedaRef.current = nombre;
                
                const data = await getProductos({ nombre, activo: true, limit: 5 });
                setResultados(data);
                setError('');
            } catch (err) {
                console.error('Error en búsqueda rápida:', err);
                setError('Error al buscar productos');
                setResultados([]);
            } finally {
                setCargando(false);
            }
        }, 750);
    }, []);

    return { resultados, cargando, error, buscar };
};

export default useBuscarProductosRapido;
