import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '@components/ProductCard';

const ProductosDestacados = ({ productos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 4;

    const nextSlide = useCallback(() => {
        if (currentIndex < productos.length - itemsToShow) {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, productos.length]);

    const prevSlide = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const canGoNext = currentIndex < productos.length - itemsToShow;
    const canGoPrev = currentIndex > 0;

    return (
        <section className="eco-productos" id="productos">
            <div className="eco-productos-inner">
                <div className="eco-productos-header">
                    <h2>Productos Destacados</h2>
                    <Link to="/productos" className="eco-productos-vertodo">
                        Ver todo el catálogo →
                    </Link>
                </div>

                <div className="eco-productos-carousel">
                    {canGoPrev && (
                        <button className="eco-carousel-arrow eco-carousel-arrow--prev" onClick={prevSlide}>
                            <FaChevronLeft />
                        </button>
                    )}

                    <div className="eco-carousel-viewport">
                        <div
                            className="eco-carousel-track"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
                            }}
                        >
                            {productos.map((producto) => (
                                <div key={producto.id} className="eco-carousel-item">
                                    <ProductCard producto={producto} showWishlist={true} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {canGoNext && (
                        <button className="eco-carousel-arrow eco-carousel-arrow--next" onClick={nextSlide}>
                            <FaChevronRight />
                        </button>
                    )}
                </div>

                <div className="eco-carousel-dots">
                    {Array.from({ length: Math.max(1, productos.length - itemsToShow + 1) }).map((_, i) => (
                        <button
                            key={i}
                            className={`eco-dot ${i === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductosDestacados;
