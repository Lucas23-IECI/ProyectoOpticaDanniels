import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaFacebook, FaInstagram, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';
import { enviarMensajeContacto } from '@services/contacto.service';
import '@styles/contacto.css';

function Contacto() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '', email: '', telefono: '', asunto: '', mensaje: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        try {
            await enviarMensajeContacto(formData);
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
            }, 4000);
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Error al enviar el mensaje. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const horarios = [
        { dia: 'Lunes a Viernes', horario: '9:00 - 19:00' },
        { dia: 'Sábados', horario: '9:00 - 14:00' },
        { dia: 'Domingos', horario: 'Cerrado' }
    ];

    const formasContacto = [
        {
            tipo: 'Teléfono',
            valor: '9 3769 2691',
            icono: <FaPhone />,
            enlace: 'tel:+56937692691',
            descripcion: 'Llámanos directamente'
        },
        {
            tipo: 'WhatsApp',
            valor: '+56 9 3769 2691',
            icono: <FaWhatsapp />,
            enlace: 'https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20información%20sobre%20sus%20servicios',
            descripcion: 'Chat directo'
        },
        {
            tipo: 'Email',
            valor: 'contacto@opticadanniels.cl',
            icono: <FaEnvelope />,
            enlace: 'mailto:contacto@opticadanniels.cl',
            descripcion: 'Escríbenos un correo'
        }
    ];

    const redesSociales = [
        {
            red: 'Facebook',
            url: 'https://www.facebook.com/OpticaDanniels/',
            icono: <FaFacebook />,
            usuario: '@OpticaDanniels'
        },
        {
            red: 'Instagram',
            url: 'https://instagram.com/opticadanniels',
            icono: <FaInstagram />,
            usuario: '@opticadanniels'
        }
    ];

    return (
        <div className="contacto-container">
            <section className="contacto-hero">
                <div className="hero-content">
                    <h1>Contacto</h1>
                    <p className="hero-subtitle">
                        Estamos aquí para ayudarte con cualquier consulta sobre tu visión
                    </p>
                </div>
            </section>

            <section className="contacto-info">
                <div className="container">
                                            <div className="contacto-grid">
                        <div className="ubicacion-info">
                            <div className="contacto-direccion-principal">
                                <div className="contacto-direccion-header">
                                    <FaMapMarkerAlt className="contacto-ubicacion-icon" />
                                    <h3>Nuestra Ubicación</h3>
                                </div>
                                <div className="contacto-direccion-detalles">
                                    <p className="contacto-direccion-nombre">Óptica Danniels</p>
                                    <p className="contacto-direccion-calle">Av. Manuel Rodriguez 426</p>
                                    <p className="contacto-direccion-ciudad">Chiguayante - Bio-Bio, Chile</p>
                                    <p className="contacto-direccion-lugar">Galería Paseo Madero</p>
                                </div>
                            </div>

                            <div className="horarios">
                                <div className="horarios-header">
                                    <FaClock className="horarios-icon" />
                                    <h3>Horarios de Atención</h3>
                                </div>
                                <div className="horarios-lista">
                                    {horarios.map((horario, index) => (
                                        <div key={index} className="horario-item">
                                            <span className="horario-dia">{horario.dia}</span>
                                            <span className="horario-tiempo">{horario.horario}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="contacto-metodos">
                            <h3>Formas de Contacto</h3>
                            <div className="contacto-grid">
                                {formasContacto.map((contacto, index) => (
                                    <a 
                                        key={index}
                                        href={contacto.enlace}
                                        target={contacto.enlace.startsWith('http') ? '_blank' : '_self'}
                                        rel={contacto.enlace.startsWith('http') ? 'noopener noreferrer' : ''}
                                        className="contacto-card"
                                    >
                                        <div className="contacto-icon">
                                            {contacto.icono}
                                        </div>
                                        <div className="contacto-content">
                                            <h4>{contacto.tipo}</h4>
                                            <p className="contacto-valor">{contacto.valor}</p>
                                            <span className="contacto-descripcion">{contacto.descripcion}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="redes-sociales">
                                <h4>Síguenos en nuestras redes</h4>
                                <div className="redes-grid">
                                    {redesSociales.map((red, index) => (
                                        <a 
                                            key={index}
                                            href={red.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="red-social"
                                        >
                                            <div className="red-icon">
                                                {red.icono}
                                            </div>
                                            <div className="red-info">
                                                <span className="red-nombre">{red.red}</span>
                                                <span className="red-usuario">{red.usuario}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contacto-formulario-section">
                <div className="container">
                    <h3>Envíanos un Mensaje</h3>
                    <p className="form-intro">Completa el formulario y te responderemos a la brevedad.</p>

                    {isSubmitted ? (
                        <div className="contacto-form-success">
                            <FaCheckCircle className="success-icon" />
                            <h4>¡Mensaje enviado exitosamente!</h4>
                            <p>Nos contactaremos contigo pronto.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contacto-form-grid">
                            {formError && (
                                <div className="contacto-form-error">
                                    <FaExclamationTriangle />
                                    <span>{formError}</span>
                                </div>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="ct-nombre">Nombre *</label>
                                    <input id="ct-nombre" type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required minLength={2} maxLength={100} placeholder="Tu nombre completo" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ct-email">Email *</label>
                                    <input id="ct-email" type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="correo@ejemplo.com" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="ct-telefono">Teléfono</label>
                                    <input id="ct-telefono" type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+56 9 1234 5678" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="ct-asunto">Asunto *</label>
                                    <input id="ct-asunto" type="text" name="asunto" value={formData.asunto} onChange={handleInputChange} required maxLength={200} placeholder="Motivo de tu consulta" />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="ct-mensaje">Mensaje *</label>
                                <textarea id="ct-mensaje" name="mensaje" value={formData.mensaje} onChange={handleInputChange} required minLength={10} maxLength={2000} rows="5" placeholder="Cuéntanos en qué podemos ayudarte..." />
                            </div>
                            <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? (<><div className="spinner"></div>Enviando...</>) : (<><FaPaperPlane /> Enviar Mensaje</>)}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <section className="mapa-section">
                <div className="container">
                    <h3>¿Cómo llegar?</h3>
                    <div className="mapa-container">
                        <div className="mapa-wrapper">
                            <iframe
                                src="https://www.openstreetmap.org/export/embed.html?bbox=-73.032, -36.936, -73.022, -36.916&layer=mapnik&marker=-36.926,-73.029"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación Óptica Danniels"
                            ></iframe>
                        </div>
                        <div className="mapa-info">
                            <h4>Galería Paseo Madero</h4>
                            <p>Av. Manuel Rodriguez 426, Chiguayante</p>
                            <a 
                                href="https://maps.google.com/?q=Av.+Manuel+Rodriguez+426,+Chiguayante,+Chile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <FaMapMarkerAlt />
                                Ver en Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contacto-cta">
                <div className="container">
                    <div className="cta-content">
                        <h3>¿Listo para mejorar tu visión?</h3>
                        <p>
                            Contáctanos hoy mismo y descubre cómo podemos ayudarte a ver mejor
                        </p>
                        <div className="cta-buttons">
                            <button 
                                onClick={() => navigate('/agendar-cita')}
                                className="btn btn-primary"
                            >
                                <FaCalendarAlt />
                                Agendar Cita
                            </button>
                            <a 
                                href="tel:+56937692691"
                                className="btn btn-secondary"
                            >
                                <FaPhone />
                                Llamar Ahora
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contacto;
