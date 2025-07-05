import { useState } from 'react';
import { getProductos } from '@services/producto.service';

const useBuscarProductosRapido = () => {
    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const buscar = async (nombre) => {
        if (!nombre) {
            setResultados([]);
            return;
        }

        try {
            setCargando(true);
            const data = await getProductos({ nombre, limit: 5 });
            setResultados(data);
            setError('');
        } catch (err) {
            console.error('Error en búsqueda rápida:', err);
            setError('Error al buscar productos');
            setResultados([]);
        } finally {
            setCargando(false);
        }
    };

    return { resultados, cargando, error, buscar };
};

export default useBuscarProductosRapido;
