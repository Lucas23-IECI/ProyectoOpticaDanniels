import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '@styles/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section footer-about">
                    <div className="footer-logo">
                        <img src="/LogoOficial.png" alt="Óptica Danniels" className="footer-logo-img" />
                        <h3>Óptica Danniels</h3>
                    </div>
                    <p className="footer-description">
                        Con más de 30 años de experiencia, somos tu mejor aliado en el cuidado de la salud visual. 
                        Ofrecemos productos de la más alta calidad y un servicio profesional personalizado.
                    </p>
                    <div className="footer-social">
                        <a href="#" className="social-link facebook" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="#" className="social-link instagram" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" className="social-link whatsapp" aria-label="WhatsApp">
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>

                {/* Enlaces Rápidos */}
                <div className="footer-section footer-links">
                    <h4>Enlaces Rápidos</h4>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/productos">Productos</Link></li>
                        <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                        {isAuthenticated && (
                            <>
                                <li><Link to="/favoritos">Favoritos</Link></li>
                                <li><Link to="/carrito">Carrito</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Servicios */}
                <div className="footer-section footer-services">
                    <h4>Nuestros Servicios</h4>
                    <ul>
                        <li>Consultas Especializadas</li>
                        <li>Atención Infantil</li>
                        <li>Montaje de Cristales</li>
                        <li>Reparaciones</li>
                        <li>Prótesis Auditiva</li>
                        <li>Convenios Especiales</li>
                    </ul>
                </div>

                {/* Información de Contacto */}
                <div className="footer-section footer-contact">
                    <h4>Contacto</h4>
                    <div className="contact-info">
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <span>Visítanos en nuestra tienda<br />¡Te esperamos!</span>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <span>Llámanos para consultas</span>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span>Contáctanos por email</span>
                        </div>
                        <div className="contact-item">
                            <FaClock className="contact-icon" />
                            <span>Lun - Vie: 9:00 - 19:00<br />Sáb: 9:00 - 14:00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de Copyright */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; {currentYear} Óptica Danniels. Todos los derechos reservados.</p>
                    <div className="footer-legal">
                        <Link to="/privacidad">Política de Privacidad</Link>
                        <Link to="/terminos">Términos y Condiciones</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;