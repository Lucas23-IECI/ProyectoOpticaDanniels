import { useEffect, useState } from 'react';
import useGetProductos from '@hooks/productos/useGetProductos';
import CrearProductoPopup from '@components/CrearProductoPopup';

const Productos = () => {
    const [categoria, setCategoria] = useState('');
    const [marca, setMarca] = useState('');
    const [filtros, setFiltros] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    const { productos, loading, error, fetchProductos } = useGetProductos();

    const handleBuscar = () => {
        const nuevosFiltros = {};
        if (categoria) nuevosFiltros.categoria = categoria;
        if (marca) nuevosFiltros.marca = marca;
        setFiltros(nuevosFiltros);
        fetchProductos(nuevosFiltros);
    };

    const handleProductoCreado = () => {
        fetchProductos(filtros);
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Catálogo de Productos</h1>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Categoría"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                />
                <button onClick={handleBuscar}>Buscar</button>
                <button onClick={() => setShowPopup(true)}>Nuevo Producto</button>
            </div>

            {loading && <p>Cargando productos...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.length === 0 ? (
                        <tr>
                            <td colSpan="6" align="center">No se encontraron productos</td>
                        </tr>
                    ) : (
                        productos.map(prod => (
                            <tr key={prod.id}>
                                <td>{prod.id}</td>
                                <td>{prod.nombre}</td>
                                <td>{prod.marca}</td>
                                <td>${parseFloat(prod.precio).toLocaleString('es-CL')}</td>
                                <td>{prod.stock}</td>
                                <td>{prod.categoria}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <CrearProductoPopup show={showPopup} setShow={setShowPopup} onSuccess={handleProductoCreado} />
        </main>
    );
};

export default Productos;
