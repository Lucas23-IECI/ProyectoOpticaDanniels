import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const slides = [
        {
            id: 1,
            image: `${import.meta.env.BASE_URL}images/hero/hero-mujer-lentes.jpg`,
            title: "Nuevas Colecciones",
            subtitle: "Lentes Ópticos y de Sol",
            cta: { text: "Ver Productos", link: "/productos" },
            align: 'left'
        },
        {
            id: 2,
            image: `${import.meta.env.BASE_URL}images/hero/hero-hombre-sol.jpg`,
            title: "Agenda tu Examen Visual",
            subtitle: "Profesionales con 30+ años de experiencia",
            cta: { text: "Agendar Cita", link: "/agendar-cita" },
            align: 'right'
        },
        {
            id: 3,
            image: `${import.meta.env.BASE_URL}images/hero/hero-familia-vision.jpg`,
            title: "Lentes de Sol",
            subtitle: "Las mejores marcas al mejor precio",
            cta: { text: "Ver Colección", link: "/productos?categoria=sol" },
            align: 'left'
        }
    ];

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning, slides.length]);

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <section className="eco-hero">
            <div className="eco-hero-slider">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`eco-hero-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <div
                            className="eco-hero-bg"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        <div className={`eco-hero-overlay eco-hero-overlay--${slide.align}`}>
                            <div className="eco-hero-text">
                                <h2 className="eco-hero-title">{slide.title}</h2>
                                <p className="eco-hero-subtitle">{slide.subtitle}</p>
                                <Link to={slide.cta.link} className="eco-hero-btn">
                                    {slide.cta.text}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    className="eco-hero-nav eco-hero-nav--prev"
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    aria-label="Anterior"
                >
                    <FaChevronLeft />
                </button>
                <button
                    className="eco-hero-nav eco-hero-nav--next"
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    aria-label="Siguiente"
                >
                    <FaChevronRight />
                </button>

                <div className="eco-hero-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`eco-hero-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
