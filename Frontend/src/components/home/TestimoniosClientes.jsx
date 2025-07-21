import { useState } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimoniosClientes = () => {
    const [currentTestimonio, setCurrentTestimonio] = useState(0);

    const testimonios = [
        {
            id: 1,
            nombre: 'María González',
            edad: '45 años',
            ubicacion: 'Concepción',
            testimonio: 'Excelente atención, más de 10 años siendo cliente de Óptica Danniels. Siempre encuentro lo que necesito y el asesoramiento es excepcional. Los recomiendo 100%.',
            calificacion: 5,
            servicio: 'Lentes Progresivos',
            imagen: `${import.meta.env.BASE_URL}images/testimonios/cliente-1.jpg`
        },
        {
            id: 2,
            nombre: 'Carlos Muñoz',
            edad: '38 años',
            ubicacion: 'Chiguayante',
            testimonio: 'Llevé a mi hijo de 8 años para sus primeros lentes y la atención fue increíble. Se tomaron el tiempo para explicarle todo y elegir el marco perfecto. Muy profesionales.',
            calificacion: 5,
            servicio: 'Atención Infantil',
            imagen: `${import.meta.env.BASE_URL}images/testimonios/cliente-2.jpg`
        },
        {
            id: 3,
            nombre: 'Ana Soto',
            edad: '52 años',
            ubicacion: 'Tomé',
            testimonio: 'Gracias al convenio con mi empresa pude acceder a lentes de excelente calidad a un precio muy conveniente. 30 años de experiencia se notan en cada detalle.',
            calificacion: 5,
            servicio: 'Convenio Empresarial',
            imagen: `${import.meta.env.BASE_URL}images/testimonios/cliente-3.jpg`
        },
        {
            id: 4,
            nombre: 'Roberto Fernández',
            edad: '60 años',
            ubicacion: 'Concepción',
            testimonio: 'Tenía un problema complejo con mis lentes bifocales y en Óptica Danniels lo resolvieron perfectamente. Su experiencia realmente marca la diferencia.',
            calificacion: 5,
            servicio: 'Reparación Especializada',
            imagen: `${import.meta.env.BASE_URL}images/testimonios/cliente-4.jpg`
        },
        {
            id: 5,
            nombre: 'Patricia López',
            edad: '41 años',
            ubicacion: 'Arauco',
            testimonio: 'Necesitaba lentes de sol para mi trabajo al aire libre y me asesoraron perfectamente. Calidad excepcional y atención personalizada como en ningún otro lugar.',
            calificacion: 5,
            servicio: 'Lentes de Sol',
            imagen: `${import.meta.env.BASE_URL}images/testimonios/cliente-5.jpg`
        }
    ];

    const nextTestimonio = () => {
        setCurrentTestimonio((prev) => (prev + 1) % testimonios.length);
    };

    const prevTestimonio = () => {
        setCurrentTestimonio((prev) => (prev - 1 + testimonios.length) % testimonios.length);
    };

    const testimonioActual = testimonios[currentTestimonio];

    const renderStars = (calificacion) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar 
                key={index} 
                className={index < calificacion ? 'star-filled' : 'star-empty'} 
            />
        ));
    };

    return (
        <section className="testimonios-clientes">
            <div className="container">
                <div className="testimonios-header">
                    <h2 className="testimonios-title">Lo que dicen nuestros clientes</h2>
                    <p className="testimonios-subtitle">
                        30 años creando experiencias memorables
                    </p>
                </div>

                <div className="testimonios-carousel">
                    <div className="testimonio-principal">
                        <div className="testimonio-card">
                            <div className="testimonio-header">
                                <div className="cliente-info">
                                    <div 
                                        className="cliente-imagen"
                                        style={{ backgroundImage: `url(${testimonioActual.imagen})` }}
                                    />
                                    <div className="cliente-datos">
                                        <h4 className="cliente-nombre">{testimonioActual.nombre}</h4>
                                        <p className="cliente-ubicacion">{testimonioActual.ubicacion}</p>
                                        <div className="cliente-calificacion">
                                            {renderStars(testimonioActual.calificacion)}
                                        </div>
                                    </div>
                                </div>
                                <div className="servicio-badge">
                                    {testimonioActual.servicio}
                                </div>
                            </div>

                            <div className="testimonio-content">
                                <FaQuoteLeft className="quote-icon" />
                                <p className="testimonio-texto">
                                    {testimonioActual.testimonio}
                                </p>
                            </div>
                        </div>

                        <div className="testimonio-controls">
                            <button 
                                className="testimonio-nav prev" 
                                onClick={prevTestimonio}
                                aria-label="Testimonio anterior"
                            >
                                <FaChevronLeft />
                            </button>
                            <button 
                                className="testimonio-nav next" 
                                onClick={nextTestimonio}
                                aria-label="Siguiente testimonio"
                            >
                                <FaChevronRight />
                            </button>
                        </div>

                        <div className="testimonio-indicators">
                            {testimonios.map((_, index) => (
                                <button
                                    key={index}
                                    className={`testimonio-indicator ${index === currentTestimonio ? 'active' : ''}`}
                                    onClick={() => setCurrentTestimonio(index)}
                                    aria-label={`Ver testimonio ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="satisfaccion-stats">
                    <div className="stat">
                        <div className="stat-numero">98%</div>
                        <div className="stat-texto">Clientes Satisfechos</div>
                    </div>
                    <div className="stat">
                        <div className="stat-numero">1000+</div>
                        <div className="stat-texto">Familias Atendidas</div>
                    </div>
                    <div className="stat">
                        <div className="stat-numero">4.9</div>
                        <div className="stat-texto">Calificación Promedio</div>
                    </div>
                    <div className="stat">
                        <div className="stat-numero">30</div>
                        <div className="stat-texto">Años de Experiencia</div>
                    </div>
                </div>

                <div className="testimonios-grid">
                    <h3>Más opiniones de nuestros clientes</h3>
                    <div className="testimonios-mini-grid">
                        {testimonios.map((testimonio) => (
                            <div 
                                key={testimonio.id} 
                                className={`testimonio-mini ${testimonio.id === testimonioActual.id ? 'active' : ''}`}
                                onClick={() => setCurrentTestimonio(testimonio.id - 1)}
                            >
                                <div className="mini-header">
                                    <div className="mini-nombre">{testimonio.nombre}</div>
                                    <div className="mini-calificacion">
                                        {renderStars(testimonio.calificacion)}
                                    </div>
                                </div>
                                <p className="mini-testimonio">
                                    {testimonio.testimonio.substring(0, 100)}...
                                </p>
                                <div className="mini-servicio">{testimonio.servicio}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="testimonios-cta">
                    <h3>¿Quieres ser parte de nuestras historias de éxito?</h3>
                    <p>Únete a los miles de clientes satisfechos que confían en nuestra experiencia</p>
                    <a 
                        href="https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quiero%20conocer%20más%20sobre%20sus%20servicios"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Contáctanos Ahora
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TestimoniosClientes;
