import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaFacebook, FaInstagram, FaStore, FaBusinessTime, FaPhoneAlt, FaComments, FaMailBulk } from 'react-icons/fa';

const UbicacionContacto = () => {
    const horarios = [
        { dia: 'Lunes a Viernes', horario: '9:00 - 19:00' },
        { dia: 'Sábados', horario: '9:00 - 14:00' },
        { dia: 'Domingos', horario: 'Cerrado' }
    ];

    const formasContacto = [
        {
            tipo: 'Teléfono',
            valor: '9 3769 2691',
            icono: <FaPhoneAlt />,
            enlace: 'tel:937692691',
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
            icono: <FaMailBulk />,
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
        <section className="ubicacion-contacto" id="contacto">
            <div className="container">
                <div className="ubicacion-header">
                    <h2 className="ubicacion-title">
                        <a href="#como-llegar" className="title-link">
                            Encuéntranos
                        </a>
                    </h2>
                    <p className="ubicacion-subtitle">
                        Galería Paseo Madero - Chiguayante
                    </p>
                </div>

                <div className="ubicacion-content">
                    <div className="ubicacion-info">
                        <div className="direccion-principal">
                            <div className="direccion-header">
                                <FaStore className="ubicacion-icon" />
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
                                <FaBusinessTime className="horarios-icon" />
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
                            <div className="horario-especial">
                                <img 
                                    src={`${import.meta.env.BASE_URL}images/ubicacion/horario.jpg`}
                                    alt="Horarios de atención"
                                    className="horario-imagen"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="contacto-info">
                        <h3>Formas de Contacto</h3>
                        <div className="home-contacto-grid">
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

                <div className="agradecimiento">
                    <blockquote>
                        "En agradecimiento a ustedes, nuestros fieles clientes, es que continuamos 
                        entregando un servicio que va más allá de una venta, pues se trata de una 
                        experiencia de calidad en el servicio para sus ojos."
                    </blockquote>
                    <cite>- Familia Óptica Danniels</cite>
                </div>
            </div>

            <div className="mapa-section-full" id="como-llegar">
                <div className="container">
                    <div className="mapa-container">
                        <h3>¿Cómo llegar?</h3>
                    </div>
                </div>
                <div className="mapa-estatico">
                    <div className="mapa-frame">
                        <div className="mapa-background">
                            <img 
                                src={`${import.meta.env.BASE_URL}images/ubicacion/foto-mapa.png`} 
                                alt="Mapa de ubicación Chiguayante"
                                className="mapa-imagen"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div className="mapa-calles">
                                <div className="calle horizontal calle-1"></div>
                                <div className="calle horizontal calle-2"></div>
                                <div className="calle vertical calle-3"></div>
                                <div className="calle vertical calle-4"></div>
                            </div>
                            <div className="mapa-zonas">
                                <div className="zona parque"></div>
                                <div className="zona comercial"></div>
                                <div className="zona residencial"></div>
                            </div>
                        </div>
                        <div className="mapa-overlay">
                            <a 
                                href="https://maps.google.com/?q=Av.+Manuel+Rodriguez+426,+Chiguayante,+Chile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="direccion-pin"
                            >
                                <FaMapMarkerAlt className="pin-icon" />
                                <div className="pin-info">
                                    <h4>Óptica Danniels</h4>
                                    <p>Galería Paseo Madero</p>
                                    <p>Av. Manuel Rodriguez 426</p>
                                    <p>Chiguayante, Chile</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="mapa-controles">
                        <a 
                            href="https://maps.google.com/?q=Av.+Manuel+Rodriguez+426,+Chiguayante,+Chile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <FaMapMarkerAlt />
                            Ver en Google Maps
                        </a>
                        <a 
                            href="https://www.google.com/maps/dir//Av.+Manuel+Rodriguez+426,+Chiguayante,+Chile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            Cómo llegar
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UbicacionContacto;
