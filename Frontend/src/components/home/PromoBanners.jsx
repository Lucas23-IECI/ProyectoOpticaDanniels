import { Link } from 'react-router-dom';
import '../../styles/home/promo-banners.css';

const PromoBanners = () => {
    return (
        <section className="eco-promo">
            <div className="eco-promo-inner">
                <div className="eco-promo-grid">
                    <Link to="/agendar-cita" className="eco-promo-card eco-promo-card--primary">
                        <div className="eco-promo-content">
                            <h3>Examen Visual Gratuito</h3>
                            <p>Agenda tu hora con nuestros profesionales</p>
                            <span className="eco-promo-btn">Agendar cita →</span>
                        </div>
                        <div className="eco-promo-bg">
                            <img src="/images/promo/examen-visual.jpg" alt="Examen visual" loading="lazy" />
                        </div>
                    </Link>

                    <Link to="/productos?categoria=sol" className="eco-promo-card eco-promo-card--secondary">
                        <div className="eco-promo-content">
                            <h3>Lentes de Sol</h3>
                            <p>Protección UV con las mejores marcas</p>
                            <span className="eco-promo-btn">Ver colección →</span>
                        </div>
                        <div className="eco-promo-bg">
                            <img src="/images/promo/lentes-sol-lifestyle.jpg" alt="Lentes de sol" loading="lazy" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PromoBanners;
