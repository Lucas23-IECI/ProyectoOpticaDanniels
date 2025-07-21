import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaFacebook, FaInstagram } from 'react-icons/fa';
import '@styles/contacto.css';

function Contacto() {
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
                            <div className="direccion-principal">
                                <div className="direccion-header">
                                    <FaMapMarkerAlt className="ubicacion-icon" />
                                    <h3>Nuestra Ubicación</h3>
                                </div>
                                <div className="direccion-detalles">
                                    <p className="direccion-nombre">Óptica Danniels</p>
                                    <p className="direccion-calle">Av. Manuel Rodriguez 426</p>
                                    <p className="direccion-ciudad">Chiguayante - Bio-Bio, Chile</p>
                                    <p className="direccion-lugar">Galería Paseo Madero</p>
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

            <section className="mapa-section">
                <div className="container">
                    <h3>¿Cómo llegar?</h3>
                    <div className="mapa-container">
                        <div className="mapa-wrapper">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.123456789!2d-73.0123456!3d-36.8123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.%20Manuel%20Rodriguez%20426%2C%20Chiguayante%2C%20Chile!5e0!3m2!1ses!2scl!4v1234567890123"
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
                            <a 
                                href="https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20agendar%20una%20cita"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <FaWhatsapp />
                                Agendar Cita
                            </a>
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
