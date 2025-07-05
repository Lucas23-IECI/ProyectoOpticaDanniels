import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProductos } from "@services/producto.service";
import { FaSearch } from "react-icons/fa";
import DropdownFiltro from "@components/DropdownFiltro";
import "@styles/busquedaResultados.css";

const BusquedaResultados = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const [busqueda, setBusqueda] = useState(query);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const [disponibilidad, setDisponibilidad] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [orden, setOrden] = useState("");

    const [dropdownActivo, setDropdownActivo] = useState(null);

    useEffect(() => {
        setBusqueda(query);
        const buscarProductos = async () => {
            setCargando(true);
            setProductos([]);
            try {
                const filtros = { nombre: query };
                if (precioMin) filtros.precio_min = precioMin;
                if (precioMax) filtros.precio_max = precioMax;
                if (disponibilidad) filtros.activo = disponibilidad === "en_stock";
                if (orden) filtros.orden = orden;

                const resultados = await getProductos(filtros);
                setProductos(resultados);
            } catch (error) {
                console.error("Error al buscar productos:", error);
                setProductos([]);
            } finally {
                setCargando(false);
            }
        };

        if (query.trim() !== "") {
            buscarProductos();
        } else {
            setProductos([]);
        }
    }, [query, disponibilidad, precioMin, precioMax, orden]);

    const handleBuscar = (e) => {
        e.preventDefault();
        if (busqueda.trim() !== "") {
            setSearchParams({ query: busqueda.trim() });
        }
    };

    const restablecerFiltros = () => {
        setDisponibilidad("");
        setPrecioMin("");
        setPrecioMax("");
        setOrden("");
        setSearchParams({ query: busqueda.trim() });
    };

    return (
        <div className="resultados-container">
            <h1 className="resultados-titulo">Resultados de búsqueda</h1>

            <form onSubmit={handleBuscar} className="busqueda-barra">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit" aria-label="Buscar">
                    <FaSearch />
                </button>
            </form>

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

            {cargando ? (
                <p className="cargando">Cargando productos...</p>
            ) : productos.length === 0 ? (
                <div className="no-resultados">
                    <p>No se encontraron productos que coincidan con los filtros aplicados.</p>
                    <button onClick={restablecerFiltros} className="restablecer-boton">
                        Restablecer filtros
                    </button>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default BusquedaResultados;
