import { useEffect, useState } from "react";
import useGetProductos from "@hooks/productos/useGetProductos";
import DropdownFiltro from "@components/DropdownFiltro";
import "@styles/productos.css";
import { Link } from "react-router-dom";

const Productos = () => {
    const [loading, setLoading] = useState(false);
    const [disponibilidad, setDisponibilidad] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [orden, setOrden] = useState("");
    const [dropdownActivo, setDropdownActivo] = useState(null);

    const { productos, fetchProductos } = useGetProductos();

    const obtenerProductos = async () => {
        setLoading(true);
        try {
            const filtros = {};
            if (precioMin) filtros.precio_min = precioMin;
            if (precioMax) filtros.precio_max = precioMax;
            if (disponibilidad) filtros.activo = disponibilidad === "en_stock";
            if (orden) filtros.orden = orden;

            await fetchProductos(filtros); 
        } catch (error) {
            console.error("Error al obtener productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, [disponibilidad, precioMin, precioMax, orden]);

    const restablecerFiltros = () => {
        setDisponibilidad("");
        setPrecioMin("");
        setPrecioMax("");
        setOrden("");
    };

    return (
        <div className="resultados-container">
            <h1 className="resultados-titulo">Catálogo de Productos</h1>

            <div className="filtros-barra">
                <DropdownFiltro
                    id="disponibilidad"
                    titulo="Disponibilidad"
                    tipo="checkbox"
                    opciones={[
                        { valor: "en_stock", etiqueta: "En existencia" },
                        { valor: "agotado", etiqueta: "Agotado" },
                    ]}
                    seleccion={disponibilidad}
                    onSeleccion={(valor) => setDisponibilidad(valor)}
                    dropdownActivo={dropdownActivo}
                    setDropdownActivo={setDropdownActivo}
                />

                <DropdownFiltro
                    id="precio"
                    titulo="Precio"
                    tipo="precio"
                    precioMin={precioMin}
                    precioMax={precioMax}
                    setPrecioMin={setPrecioMin}
                    setPrecioMax={setPrecioMax}
                    dropdownActivo={dropdownActivo}
                    setDropdownActivo={setDropdownActivo}
                />

                <DropdownFiltro
                    id="orden"
                    titulo="Ordenar por"
                    tipo="select"
                    opciones={[
                        { valor: "", etiqueta: "Relevancia" },
                        { valor: "precio_ASC", etiqueta: "Precio, menor a mayor" },
                        { valor: "precio_DESC", etiqueta: "Precio, mayor a menor" },
                    ]}
                    seleccion={orden}
                    onSeleccion={(valor) => setOrden(valor)}
                    dropdownActivo={dropdownActivo}
                    setDropdownActivo={setDropdownActivo}
                />
            </div>

            {loading ? (
                <p className="cargando">Cargando productos...</p>
            ) : Array.isArray(productos) && productos.length > 0 ? (
                <div className="lista-productos">
                    {productos.map((producto) => (
                        <Link
                            key={producto.id}
                            to={`/productos/${producto.nombre
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            className="producto-item"
                        >
                            <div className="producto-imagen">
                                <img
                                    src={producto.imagen_url || "https://via.placeholder.com/300"}
                                    alt={producto.nombre}
                                />
                            </div>
                            <div className="producto-info">
                                <p className="producto-nombre">{producto.nombre}</p>
                                <p className="producto-precio">
                                    ${parseFloat(producto.precio).toLocaleString("es-CL")} CLP
                                </p>
                                <p className="producto-marca">{producto.marca}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="no-resultados">
                    <p>No hay productos disponibles.</p>
                    <button onClick={restablecerFiltros} className="restablecer-boton">
                        Restablecer filtros
                    </button>
                </div>
            )}
        </div>
    );
};

export default Productos;
