import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaEye, FaHeart } from 'react-icons/fa';
import ProductCard from '@components/ProductCard';
import { getAllCategorias } from '../../constants/categorias';

const ProductosDestacados = ({ productos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 4;
    const categorias = getAllCategorias();

    const nextSlide = () => {
        if (currentIndex < productos.length - itemsToShow) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const canGoNext = currentIndex < productos.length - itemsToShow;
    const canGoPrev = currentIndex > 0;

    const productosPorCategoria = categorias.map(categoria => {
        const productosCategoria = productos.filter(producto => 
            producto.categoria === categoria.id
        );
        return {
            categoria,
            productos: productosCategoria.slice(0, 2) 
        };
    }).filter(grupo => grupo.productos.length > 0);

    return (
        <section className="productos-destacados" id="productos">
            <div className="container">
                <div className="productos-header">
                    <h2 className="productos-title">Nuestros Productos</h2>
                    <p className="productos-subtitle">
                        Descubre nuestra selección de lentes y accesorios de las mejores marcas
                    </p>
                </div>

                <div className="productos-carousel">
                    <div className="carousel-header">
                        <h3>Productos Destacados</h3>
                        <div className="carousel-controls">
                            <button 
                                className={`carousel-btn prev ${!canGoPrev ? 'disabled' : ''}`}
                                onClick={prevSlide}
                                disabled={!canGoPrev}
                            >
                                <FaChevronLeft />
                            </button>
                            <button 
                                className={`carousel-btn next ${!canGoNext ? 'disabled' : ''}`}
                                onClick={nextSlide}
                                disabled={!canGoNext}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>

                    <div className="productos-carousel-container">
                        <div 
                            className="productos-carousel-track"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
                            }}
                        >
                            {productos.map((producto) => (
                                <div key={producto.id} className="carousel-item">
                                    <ProductCard 
                                        producto={producto}
                                        showWishlist={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="carousel-indicators">
                        {Array.from({ length: Math.ceil(productos.length / itemsToShow) }).map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === Math.floor(currentIndex / itemsToShow) ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index * itemsToShow)}
                            />
                        ))}
                    </div>
                </div>

                <div className="categorias-productos">
                    <h3>Explora por Categorías</h3>
                    <div className="categorias-grid">
                        {categorias.map((categoria) => (
                            <Link 
                                key={categoria.id}
                                to={`/productos?categoria=${categoria.id}`}
                                className="categoria-card"
                            >
                                <div className="categoria-icon">
                                    <span className="categoria-emoji">{categoria.icono}</span>
                                </div>
                                <div className="categoria-info">
                                    <h4>{categoria.nombre}</h4>
                                    <p>{categoria.descripcion}</p>
                                    <span className="categoria-count">
                                        {productos.filter(p => p.categoria === categoria.id).length} productos
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {productosPorCategoria.length > 0 && (
                    <div className="productos-por-categoria">
                        {productosPorCategoria.map((grupo) => (
                            <div key={grupo.categoria.id} className="categoria-seccion">
                                <div className="categoria-header">
                                    <h4>
                                        <span className="categoria-icon-small">{grupo.categoria.icono}</span>
                                        {grupo.categoria.nombre}
                                    </h4>
                                    <Link 
                                        to={`/productos?categoria=${grupo.categoria.id}`}
                                        className="ver-todos-link"
                                    >
                                        Ver todos <FaEye />
                                    </Link>
                                </div>
                                <div className="productos-grid-mini">
                                    {grupo.productos.map((producto) => (
                                        <div key={producto.id} className="producto-mini">
                                            <ProductCard 
                                                producto={producto}
                                                compact={true}
                                                showWishlist={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="productos-ver-todo">
                    <Link to="/productos" className="btn btn-primary">
                        <FaEye />
                        Ver Todo
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductosDestacados;
