import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductos } from "@services/producto.service";
import "@styles/detalleProducto.css";

function DetalleProducto() {
    const { nombreProducto } = useParams();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const limpiarNombre = (nombre) =>
                    nombre.toLowerCase().replace(/[\s-]+/g, "");

                const nombreBuscado = limpiarNombre(decodeURIComponent(nombreProducto));
                const productos = await getProductos();
                const productoEncontrado = productos.find(
                    (p) => limpiarNombre(p.nombre) === nombreBuscado
                );

                if (productoEncontrado) {
                    setProducto(productoEncontrado);
                }
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };

        fetchProducto();
    }, [nombreProducto]);
    

    if (!producto) {
        return <p>Cargando producto...</p>;
    }

    return (
        <div className="detalle-producto">
            <div className="imagen">
                <img src={producto.imagen_url || "https://via.placeholder.com/500"} alt={producto.nombre} />
            </div>
            <div className="info">
                <h1>{producto.nombre}</h1>
                <div className="precio">${parseFloat(producto.precio).toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CLP</div>
                <p>Marca: {producto.marca}</p>
                <p className="descripcion">{producto.descripcion}</p>
                <div className="botones">
                    <button>Agregar al carrito</button>
                    <button>Comprar ahora</button>
                </div>
            </div>
        </div>
    );
}

export default DetalleProducto;
