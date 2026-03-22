import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '@styles/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="eco-footer">
            <div className="eco-footer-main">
                <div className="eco-footer-inner">
                    {/* Brand */}
                    <div className="eco-footer-col eco-footer-brand">
                        <div className="eco-footer-logo">
                            <img src="LogoOficial.png" alt="Óptica Danniels" />
                            <span>Óptica Danniels</span>
                        </div>
                        <p>Más de 30 años cuidando tu salud visual con profesionalismo y calidad.</p>
                        <div className="eco-footer-social">
                            <a href="https://facebook.com/opticadanniels" aria-label="Facebook"><FaFacebook /></a>
                            <a href="https://instagram.com/opticadanniels" aria-label="Instagram"><FaInstagram /></a>
                            <a href="https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20información%20sobre%20sus%20servicios" aria-label="WhatsApp"><FaWhatsapp /></a>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="eco-footer-col">
                        <h4>Productos</h4>
                        <ul>
                            <li><Link to="/productos?categoria=opticos">Lentes Ópticos</Link></li>
                            <li><Link to="/productos?categoria=sol">Lentes de Sol</Link></li>
                            <li><Link to="/productos?categoria=accesorios">Accesorios</Link></li>
                            <li><Link to="/productos">Ver catálogo</Link></li>
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div className="eco-footer-col">
                        <h4>Servicios</h4>
                        <ul>
                            <li><Link to="/agendar-cita">Examen Visual</Link></li>
                            <li>Montaje de Cristales</li>
                            <li>Reparaciones</li>
                            <li>Atención Infantil</li>
                            <li>Convenios</li>
                        </ul>
                    </div>

                    {/* Empresa */}
                    <div className="eco-footer-col">
                        <h4>Empresa</h4>
                        <ul>
                            <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
                            <li><Link to="/contacto">Contacto y Tiendas</Link></li>
                            <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="eco-footer-col">
                        <h4>Contacto</h4>
                        <div className="eco-footer-contact">
                            <div><FaPhone /> <span>+56 9 3769 2691</span></div>
                            <div><FaEnvelope /> <span>contacto@opticadanniels.cl</span></div>
                            <div><FaClock /> <span>Lun-Vie 10:30-12:30 / 15:30-19:00 · Sáb 10:30-13:30</span></div>
                            <div><FaMapMarkerAlt /> <span>Visítanos en tienda</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="eco-footer-bottom">
                <div className="eco-footer-bottom-inner">
                    <p>&copy; {currentYear} Óptica Danniels. Todos los derechos reservados.</p>
                    <div className="eco-footer-legal">
                        <Link to="/privacidad">Privacidad</Link>
                        <Link to="/terminos">Términos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;