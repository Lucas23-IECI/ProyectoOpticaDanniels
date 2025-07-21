import { useState, useEffect } from 'react';
import '@styles/quienes-somos.css';

function QuienesSomos() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="quienes-somos-loading">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="quienes-somos-container">
            <section className="quienes-somos-hero">
                <div className="hero-content">
                    <h1>Quiénes Somos</h1>
                    <p className="hero-subtitle">
                        Más de 20 años cuidando tu visión con excelencia y profesionalismo
                    </p>
                </div>
                <div className="hero-image">
                    <img 
                        src={`${import.meta.env.BASE_URL}images/quienes-somos/hero-about.jpg`}
                        alt="Equipo de Óptica Danniels"
                        className="hero-img"
                        onError={(e) => {
                            e.target.src = '/LogoOficial.png';
                        }}
                    />
                </div>
            </section>

            <section className="nuestra-historia">
                <div className="container">
                    <div className="historia-content">
                        <div className="historia-text">
                            <h2>Nuestra Historia</h2>
                            <p>
                                Óptica Danniels nació en el año 2003 con el sueño de ofrecer soluciones 
                                visuales de calidad a nuestra comunidad. Desde nuestros humildes comienzos 
                                como una pequeña óptica familiar, hemos crecido hasta convertirnos en un 
                                referente en el cuidado de la visión.
                            </p>
                            <p>
                                A lo largo de estos años, hemos mantenido nuestro compromiso con la 
                                excelencia, incorporando la última tecnología en diagnóstico y tratamiento 
                                visual, siempre con el trato cercano y personalizado que nos caracteriza.
                            </p>
                        </div>
                        <div className="historia-image">
                            <img 
                                src={`${import.meta.env.BASE_URL}images/quienes-somos/historia-timeline.jpg`}
                                alt="Historia de Óptica Danniels"
                                className="historia-img"
                                onError={(e) => {
                                    e.target.src = '/LogoOficial.png';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mision-vision">
                <div className="container">
                    <div className="mision-vision-grid">
                        <div className="mision-card">
                            <div className="card-icon">
                                <i className="fas fa-bullseye"></i>
                            </div>
                            <h3>Misión</h3>
                            <p>
                                Contribuir al cuidado visual mediante la entrega de soluciones ópticas confiables, 
                                integrando productos de calidad con un servicio profesional, cercano y personalizado, 
                                orientado a satisfacer las necesidades específicas de cada cliente de manera oportuna y efectiva.
                            </p>
                        </div>
                        <div className="vision-card">
                            <div className="card-icon">
                                <i className="fas fa-eye"></i>
                            </div>
                            <h3>Visión</h3>
                            <p>
                                Consolidarse como una óptica de referencia a nivel nacional, reconocida por su compromiso 
                                con la salud visual, la calidad de sus servicios y su capacidad para incorporar nuevas 
                                formas de atención, manteniendo en todo momento un enfoque centrado en las personas.
                            </p>
                        </div>
                        <div className="objetivo-card">
                            <div className="card-icon">
                                <i className="fas fa-target"></i>
                            </div>
                            <h3>Objetivo General</h3>
                            <p>
                                Promover el bienestar visual de la población a través de servicios especializados de 
                                evaluación y la oferta de productos ópticos adecuados, asegurando un proceso de atención 
                                eficiente, accesible y orientado a generar confianza y satisfacción en cada cliente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="nuestros-valores">
                <div className="container">
                    <h2>Nuestros Valores</h2>
                    <div className="valores-grid">
                        <div className="valor-item">
                            <div className="valor-icon">
                                <i className="fas fa-award"></i>
                            </div>
                            <h4>Excelencia</h4>
                            <p>Buscamos la perfección en cada servicio que ofrecemos</p>
                        </div>
                        <div className="valor-item">
                            <div className="valor-icon">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h4>Confianza</h4>
                            <p>Construimos relaciones duraderas basadas en la transparencia</p>
                        </div>
                        <div className="valor-item">
                            <div className="valor-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h4>Compromiso</h4>
                            <p>Dedicados al bienestar y satisfacción de nuestros clientes</p>
                        </div>
                        <div className="valor-item">
                            <div className="valor-icon">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <h4>Innovación</h4>
                            <p>Incorporamos la última tecnología para mejores resultados</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="nuestro-equipo">
                <div className="container">
                    <h2>Nuestro Equipo</h2>
                    <p className="equipo-intro">
                        Contamos con un equipo de profesionales altamente capacitados y comprometidos 
                        con brindar el mejor cuidado para tu visión.
                    </p>
                    <div className="equipo-grid">
                        <div className="equipo-member">
                            <div className="member-image">
                                <img 
                                    src={`${import.meta.env.BASE_URL}images/quienes-somos/team-optometrista.jpg`}
                                    alt="Optometrista especializado"
                                    className="member-img"
                                    onError={(e) => {
                                        e.target.src = '/LogoOficial.png';
                                    }}
                                />
                            </div>
                            <div className="member-info">
                                <h4>Optometristas Especializados</h4>
                                <p>
                                    Profesionales certificados con años de experiencia en el 
                                    diagnóstico y tratamiento de problemas visuales.
                                </p>
                            </div>
                        </div>
                        <div className="equipo-member">
                            <div className="member-image">
                                <img 
                                    src={`${import.meta.env.BASE_URL}images/quienes-somos/team-atencion.jpg`}
                                    alt="Equipo de atención al cliente"
                                    className="member-img"
                                    onError={(e) => {
                                        e.target.src = '/LogoOficial.png';
                                    }}
                                />
                            </div>
                            <div className="member-info">
                                <h4>Equipo de Atención</h4>
                                <p>
                                    Personal capacitado para brindar asesoramiento personalizado 
                                    y acompañarte en la elección perfecta para ti.
                                </p>
                            </div>
                        </div>
                        <div className="equipo-member">
                            <div className="member-image">
                                <img 
                                    src={`${import.meta.env.BASE_URL}images/quienes-somos/team-tecnico.jpg`}
                                    alt="Técnicos especializados"
                                    className="member-img"
                                    onError={(e) => {
                                        e.target.src = '/LogoOficial.png';
                                    }}
                                />
                            </div>
                            <div className="member-info">
                                <h4>Técnicos Especializados</h4>
                                <p>
                                    Expertos en montaje, ajuste y mantenimiento de lentes, 
                                    garantizando la máxima comodidad y funcionalidad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="certificaciones">
                <div className="container">
                    <h2>Certificaciones y Reconocimientos</h2>
                    <div className="certificaciones-grid">
                        <div className="certificacion-item">
                            <div className="cert-icon">
                                <i className="fas fa-certificate"></i>
                            </div>
                            <h4>Certificación Profesional</h4>
                            <p>Avalados por el Colegio de Ópticos-Optometristas</p>
                        </div>
                        <div className="certificacion-item">
                            <div className="cert-icon">
                                <i className="fas fa-medal"></i>
                            </div>
                            <h4>Reconocimiento de Calidad</h4>
                            <p>Premio a la Excelencia en Atención al Cliente 2023</p>
                        </div>
                        <div className="certificacion-item">
                            <div className="cert-icon">
                                <i className="fas fa-star"></i>
                            </div>
                            <h4>Acreditación Técnica</h4>
                            <p>Certificados en equipos de diagnóstico de última generación</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-quienes-somos">
                <div className="container">
                    <div className="cta-content">
                        <h2>¿Listo para cuidar tu visión?</h2>
                        <p>
                            Ven a conocernos y descubre por qué somos la opción preferida 
                            de miles de clientes satisfechos.
                        </p>
                        <div className="cta-buttons">
                            <button className="btn btn-primary">
                                Agendar Cita
                            </button>
                            <button className="btn btn-secondary">
                                Ver Productos
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default QuienesSomos;
