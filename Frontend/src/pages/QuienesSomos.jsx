import { useNavigate } from 'react-router-dom';
import '@styles/quienes-somos.css';

function QuienesSomos() {
    const navigate = useNavigate();
    const base = import.meta.env.BASE_URL;

    return (
        <div className="qs-page">
            {/* Hero — inspired by reference: label + big title + italic accent + description */}
            <section className="qs-hero">
                <img
                    src={`${base}images/FotosGenerales/MasLentesDeSol.png`}
                    alt="Óptica Danniels"
                    className="qs-hero-img"
                />
                <div className="qs-hero-overlay" />
                <div className="qs-hero-content">
                    <span className="qs-hero-label">Óptica Danniels</span>
                    <h1>Cuidamos tu visión con <em>excelencia y calidez</em></h1>
                    <p>
                        Más de 30 años ofreciendo soluciones ópticas de calidad. Desde nuestra fundación
                        en 2003, hemos atendido a miles de familias con un trato cercano y profesional.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="qs-stats">
                <div className="qs-stats-inner">
                    <div className="qs-stat">
                        <span className="qs-stat-number">30+</span>
                        <span className="qs-stat-label">Años de experiencia</span>
                    </div>
                    <div className="qs-stat">
                        <span className="qs-stat-number">5.000+</span>
                        <span className="qs-stat-label">Clientes satisfechos</span>
                    </div>
                    <div className="qs-stat">
                        <span className="qs-stat-number">100%</span>
                        <span className="qs-stat-label">Profesionales certificados</span>
                    </div>
                    <div className="qs-stat">
                        <span className="qs-stat-number">∞</span>
                        <span className="qs-stat-label">Compromiso con tu visión</span>
                    </div>
                </div>
            </section>

            {/* Nuestra Historia — photo + text side by side */}
            <section className="qs-historia">
                <div className="qs-historia-inner">
                    <div className="qs-historia-img-wrap">
                        <img
                            src={`${base}images/FotosGenerales/PersonasConLentesDeSol.png`}
                            alt="Historia de Óptica Danniels"
                            className="qs-historia-img"
                        />
                    </div>
                    <div className="qs-historia-text">
                        <span className="qs-section-label">Nuestra Historia</span>
                        <h2>De una pequeña óptica familiar a un referente regional</h2>
                        <p>
                            Óptica Danniels nació en el año 2003 con el sueño de ofrecer soluciones visuales
                            de calidad a nuestra comunidad. Desde nuestros humildes comienzos, hemos crecido
                            hasta convertirnos en un referente en el cuidado de la visión.
                        </p>
                        <p>
                            A lo largo de estos años, hemos mantenido nuestro compromiso con la excelencia,
                            incorporando la última tecnología en diagnóstico y tratamiento visual, siempre
                            con el trato cercano y personalizado que nos caracteriza.
                        </p>
                    </div>
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="qs-mv">
                <div className="qs-mv-inner">
                    <div className="qs-mv-card">
                        <div className="qs-mv-icon">
                            <i className="fas fa-bullseye"></i>
                        </div>
                        <h2>Misión</h2>
                        <p>
                            Contribuir al cuidado visual mediante soluciones ópticas confiables,
                            integrando productos de calidad con un servicio profesional, cercano
                            y personalizado para cada cliente.
                        </p>
                    </div>
                    <div className="qs-mv-divider" />
                    <div className="qs-mv-card">
                        <div className="qs-mv-icon">
                            <i className="fas fa-eye"></i>
                        </div>
                        <h2>Visión</h2>
                        <p>
                            Consolidarnos como una óptica de referencia a nivel nacional, reconocida
                            por nuestro compromiso con la salud visual y la capacidad de incorporar
                            nuevas formas de atención centradas en las personas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Qué nos diferencia — 3 feature blocks */}
            <section className="qs-features">
                <div className="qs-features-inner">
                    <div className="qs-features-header">
                        <span className="qs-section-label">¿Por Qué Elegirnos?</span>
                        <h2>Lo que nos hace diferentes</h2>
                    </div>
                    <div className="qs-features-grid">
                        <div className="qs-feature">
                            <div className="qs-feature-icon">
                                <i className="fas fa-microscope"></i>
                            </div>
                            <h3>Tecnología Avanzada</h3>
                            <p>
                                Equipos de diagnóstico de última generación para evaluaciones
                                visuales precisas y confiables.
                            </p>
                        </div>
                        <div className="qs-feature">
                            <div className="qs-feature-icon">
                                <i className="fas fa-user-md"></i>
                            </div>
                            <h3>Profesionales Certificados</h3>
                            <p>
                                Optometristas con años de experiencia y formación continua
                                en las últimas técnicas de cuidado visual.
                            </p>
                        </div>
                        <div className="qs-feature">
                            <div className="qs-feature-icon">
                                <i className="fas fa-hand-holding-heart"></i>
                            </div>
                            <h3>Atención Personalizada</h3>
                            <p>
                                Cada cliente es único. Te asesoramos para encontrar la solución
                                óptica perfecta según tus necesidades.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Equipo — photo banner with overlay text */}
            <section className="qs-equipo">
                <img
                    src={`${base}images/FotosGenerales/PruebaOptometrica.png`}
                    alt="Equipo profesional"
                    className="qs-equipo-img"
                />
                <div className="qs-equipo-overlay" />
                <div className="qs-equipo-content">
                    <span className="qs-section-label qs-label-light">Nuestro Equipo</span>
                    <h2>Profesionales comprometidos con tu bienestar visual</h2>
                    <p>
                        Contamos con optometristas especializados, asesores capacitados y técnicos
                        expertos en montaje y ajuste de lentes. Un equipo dedicado a brindarte
                        la mejor experiencia en cada visita.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="qs-cta">
                <img
                    src={`${base}images/FotosGenerales/MujerLentesDeSol.png`}
                    alt=""
                    className="qs-cta-img"
                />
                <div className="qs-cta-overlay" />
                <div className="qs-cta-content">
                    <h2>¿Listo para cuidar tu visión?</h2>
                    <p>Ven a conocernos y descubre por qué somos la opción preferida de miles de clientes.</p>
                    <div className="qs-cta-buttons">
                        <button className="qs-btn-primary" onClick={() => navigate('/agendar-cita')}>
                            Agendar Cita
                        </button>
                        <button className="qs-btn-secondary" onClick={() => navigate('/productos')}>
                            Ver Productos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default QuienesSomos;
