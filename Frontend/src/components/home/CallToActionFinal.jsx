import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEye, FaEnvelope, FaPhone, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const CallToActionFinal = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
            }, 3000);
        }, 1000);
    };

    const whatsappMessage = `Hola! Quisiera cotizar mi receta oftalmológica con ustedes. 

Nombre: ${formData.nombre || '[Por completar]'}
Teléfono: ${formData.telefono || '[Por completar]'}
Email: ${formData.email || '[Por completar]'}
Mensaje: ${formData.mensaje || 'Solicito cotización'}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=56937692691&text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <section className="call-to-action-final">
            <div className="container">
                <div className="cta-content">
                    <div className="cta-header">
                        <h2 className="cta-title">Cotiza tu Receta con Nosotros</h2>
                        <p className="cta-subtitle">
                            Obtén la mejor asesoría profesional y los precios más competitivos del mercado
                        </p>
                    </div>

                    <div className="cta-main">
                        <div className="formulario-contacto">
                            <h3>Formulario de Contacto</h3>
                            <p>Llena el formulario y nos contactaremos contigo</p>
                            
                            {isSubmitted ? (
                                <div className="form-success">
                                    <FaCheckCircle className="success-icon" />
                                    <h4>¡Mensaje enviado exitosamente!</h4>
                                    <p>Nos contactaremos contigo pronto</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="contacto-field">
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Tu nombre completo"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="contacto-field">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Tu correo electrónico"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="contacto-field">
                                        <input
                                            type="tel"
                                            name="telefono"
                                            placeholder="Tu número de teléfono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="contacto-field">
                                        <textarea
                                            name="mensaje"
                                            placeholder="Cuéntanos sobre tu receta o consulta..."
                                            value={formData.mensaje}
                                            onChange={handleInputChange}
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary form-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner"></div>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <FaEnvelope />
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="contacto-directo">
                            <h3>Contacto Directo</h3>
                            <p>¿Prefieres contactarnos directamente? Usa cualquiera de estas opciones:</p>
                            
                            <div className="contacto-opciones">
                                <a 
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-whatsapp contacto-btn"
                                >
                                    <FaWhatsapp />
                                    <div className="btn-content">
                                        <span className="btn-title">WhatsApp</span>
                                        <span className="btn-subtitle">Respuesta inmediata</span>
                                    </div>
                                </a>

                                <a 
                                    href="tel:+56937692691"
                                    className="btn btn-phone contacto-btn"
                                >
                                    <FaPhone />
                                    <div className="btn-content">
                                        <span className="btn-title">Llamar</span>
                                        <span className="btn-subtitle">+56 9 3769 2691</span>
                                    </div>
                                </a>

                                <a 
                                    href="mailto:contacto@opticadanniels.cl"
                                    className="btn btn-email contacto-btn"
                                >
                                    <FaEnvelope />
                                    <div className="btn-content">
                                        <span className="btn-title">Email</span>
                                        <span className="btn-subtitle">contacto@opticadanniels.cl</span>
                                    </div>
                                </a>
                            </div>

                            <div className="beneficios-contacto">
                                <h4>¿Por qué elegirnos?</h4>
                                <ul>
                                    <li>✓ 30 años de experiencia</li>
                                    <li>✓ Asesoramiento personalizado</li>
                                    <li>✓ Mejores laboratorios</li>
                                    <li>✓ Precios competitivos</li>
                                    <li>✓ Garantía de calidad</li>
                                    <li>✓ Atención familiar</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="cta-final">
                        <div className="cta-final-content">
                            <h3>Tu Visión es Nuestra Visión</h3>
                            <p>
                                No importa cuál sea tu dificultad óptica, tus necesidades o tus gustos; 
                                en Óptica Danniels encontraremos la solución más adecuada para ti.
                            </p>
                            <div className="cta-final-buttons">
                                <Link 
                                    to="/productos"
                                    className="btn btn-primary"
                                >
                                    <FaEye />
                                    Explorar Productos
                                </Link>
                                <Link 
                                    to="/quienes-somos"
                                    className="btn btn-outline"
                                >
                                    <FaInfoCircle />
                                    Conoce Más
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cta-background">
                <div className="cta-pattern"></div>
            </div>
        </section>
    );
};

export default CallToActionFinal;
