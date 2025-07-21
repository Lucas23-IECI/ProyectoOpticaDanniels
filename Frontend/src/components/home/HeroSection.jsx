import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaWhatsapp, FaEye, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const slides = [
        {
            id: 1,
            title: "30 AÑOS MEJORANDO LA VISIÓN DE NUESTRA GENTE",
            subtitle: "NO SOLO CUIDADO, UNA MEJOR EXPERIENCIA",
            description: "Tu visión te conecta con el mundo. Te permite conocer, mirar, observar y disfrutar. No importa cuál sea tu dificultad óptica, tus necesidades o tus gustos; en Óptica Danniels encontraremos la solución más adecuada para ti.",
            image: `${import.meta.env.BASE_URL}images/hero/banner-principal.jpg`,
            cta: {
                primary: { text: "Ver Productos", link: "/productos" },
                secondary: { text: "Cotizar Receta", link: "#contacto" }
            }
        },
        {
            id: 2,
            title: "30 AÑOS MEJORANDO LA VISIÓN DE NUESTRA GENTE",
            subtitle: "NO SOLO CUIDADO, UNA MEJOR EXPERIENCIA", 
            description: "Nuestros profesionales te brindan un asesoramiento personalizado, siguen estrictamente las indicaciones del oftalmólogo y encuentran la mejor alternativa para tu necesidad visual.",
            image: `${import.meta.env.BASE_URL}images/hero/banner-experiencia.jpg`,
            cta: {
                primary: { text: "Conocer Servicios", link: "#servicios" },
                secondary: { text: "WhatsApp", link: "https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20saber%20mas%20sobre%20sus%20productos" }
            }
        },
        {
            id: 3,
            title: "30 AÑOS MEJORANDO LA VISIÓN DE NUESTRA GENTE",
            subtitle: "LA MEJOR TECNOLOGÍA APLICADA A LOS CRISTALES",
            description: "Lentes para niños, modelos especialmente diseñados para deportes extremos, lentes de sol que imponen tendencia y la mejor tecnología aplicada a los cristales.",
            image: `${import.meta.env.BASE_URL}images/hero/banner-30-anos.jpg`,
            cta: {
                primary: { text: "Ver Catálogo", link: "/productos" },
                secondary: { text: "Contactar", link: "#contacto" }
            }
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isTransitioning) {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }
        }, 6000);

        return () => clearInterval(interval);
    }, [slides.length, isTransitioning]);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsTransitioning(false), 1500);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsTransitioning(false), 1500);
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 1500);
    };

    return (
        <section className="hero-section">
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div 
                        key={index}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <div 
                            className="hero-background"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
                            }}
                        >
                            <div className="hero-content">
                                <div className="hero-text">
                                    <div className="hero-logo">OPTICA DANNIELS</div>
                                    <h1 className="hero-title">
                                        {slide.title}
                                    </h1>
                                    <h2 className="hero-subtitle">
                                        {slide.subtitle}
                                    </h2>
                                    <p className="hero-description">
                                        {slide.description}
                                    </p>
                                    <div className="hero-actions">
                                        {slide.cta.primary.link.startsWith('#') ? (
                                            <a 
                                                href={slide.cta.primary.link}
                                                className="btn btn-primary hero-btn-primary"
                                            >
                                                <FaEye />
                                                {slide.cta.primary.text}
                                            </a>
                                        ) : (
                                            <Link 
                                                to={slide.cta.primary.link}
                                                className="btn btn-primary hero-btn-primary"
                                            >
                                                <FaEye />
                                                {slide.cta.primary.text}
                                            </Link>
                                        )}
                                        {slide.cta.secondary.link.startsWith('http') ? (
                                            <a 
                                                href={slide.cta.secondary.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary hero-btn-secondary"
                                            >
                                                <FaWhatsapp />
                                                {slide.cta.secondary.text}
                                            </a>
                                        ) : slide.cta.secondary.link.startsWith('#') ? (
                                            <a 
                                                href={slide.cta.secondary.link}
                                                className="btn btn-secondary hero-btn-secondary"
                                            >
                                                <FaWhatsapp />
                                                {slide.cta.secondary.text}
                                            </a>
                                        ) : (
                                            <Link 
                                                to={slide.cta.secondary.link}
                                                className="btn btn-secondary hero-btn-secondary"
                                            >
                                                <FaWhatsapp />
                                                {slide.cta.secondary.text}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button 
                    className={`hero-nav hero-nav-prev ${isTransitioning ? 'disabled' : ''}`}
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    aria-label="Slide anterior"
                >
                    <FaChevronLeft />
                </button>
                <button 
                    className={`hero-nav hero-nav-next ${isTransitioning ? 'disabled' : ''}`}
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    aria-label="Siguiente slide"
                >
                    <FaChevronRight />
                </button>

                <div className="hero-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-indicator ${index === currentSlide ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
                            onClick={() => goToSlide(index)}
                            disabled={isTransitioning}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="hero-contact-bar">
                <div className="hero-contact-content">
                    <div className="contact-info-wrapper">
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <span>Galería Paseo Madero - Chiguayante</span>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <span>+56 9 3769 2691</span>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span>contacto@opticadanniels.cl</span>
                        </div>
                    </div>
                    <div className="whatsapp-wrapper">
                        <a 
                            href="https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20saber%20mas%20sobre%20sus%20productos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-contact"
                        >
                            <FaWhatsapp className="contact-icon" />
                            <span>Consultar por WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
