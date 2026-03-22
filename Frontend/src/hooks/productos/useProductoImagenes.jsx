import { useState, useCallback } from "react";
import {
    getImagenesProducto,
    agregarImagenesProducto,
    eliminarImagenProducto,
    reordenarImagenesProducto,
    establecerImagenPrincipal,
} from "@services/producto.service";

const useProductoImagenes = (productoId) => {
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(false);

    const cargar = useCallback(async () => {
        if (!productoId) return;
        setLoading(true);
        try {
            const data = await getImagenesProducto(productoId);
            setImagenes(data);
        } finally {
            setLoading(false);
        }
    }, [productoId]);

    const agregar = useCallback(async (archivos) => {
        setLoading(true);
        try {
            const data = await agregarImagenesProducto(productoId, archivos);
            setImagenes(data);
            return data;
        } finally {
            setLoading(false);
        }
    }, [productoId]);

    const eliminar = useCallback(async (imagenId) => {
        setLoading(true);
        try {
            await eliminarImagenProducto(imagenId);
            setImagenes((prev) => prev.filter((img) => img.id !== imagenId));
        } finally {
            setLoading(false);
        }
    }, []);

    const reordenar = useCallback(async (ordenIds) => {
        setLoading(true);
        try {
            const data = await reordenarImagenesProducto(productoId, ordenIds);
            setImagenes(data);
        } finally {
            setLoading(false);
        }
    }, [productoId]);

    const setPrincipal = useCallback(async (imagenId) => {
        setLoading(true);
        try {
            await establecerImagenPrincipal(imagenId);
            setImagenes((prev) =>
                prev.map((img) => ({ ...img, es_principal: img.id === imagenId }))
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return { imagenes, loading, cargar, agregar, eliminar, reordenar, setPrincipal };
};

export default useProductoImagenes;
