import { Link } from 'react-router-dom';
import { FaTag, FaFire, FaShoppingCart } from 'react-icons/fa';
import '../../styles/home/promo-banners.css';

const PromoBanners = () => {
    return (
        <section className="promo-section">
            <div className="promo-section-inner">
                <div className="promo-section-header">
                    <span className="promo-section-badge"><FaFire /> Promociones</span>
                    <h2 className="promo-section-title">Ofertas Especiales</h2>
                    <p className="promo-section-subtitle">Aprovecha nuestras promociones por tiempo limitado</p>
                </div>
                <div className="promo-cards-grid">
                    {/* Promo 1: Gafas 2x */}
                    <div className="promo-card promo-card--sky">
                        <div className="promo-card-tag">
                            <FaTag /> Oferta
                        </div>
                        <div className="promo-card-content">
                            <h3 className="promo-card-title">GAFAS 2x</h3>
                            <div className="promo-card-price">
                                <span className="promo-price-symbol">$</span>
                                <span className="promo-price-amount">39.990</span>
                            </div>
                            <p className="promo-card-desc">Renueva tu estilo y ahorra</p>
                            <span className="promo-card-stock"><FaFire /> ¡STOCK LIMITADO!</span>
                        </div>
                        <Link to="/productos?categoria=sol" className="promo-card-btn">
                            <FaShoppingCart /> COMPRA AQUÍ
                        </Link>
                    </div>

                    {/* Promo 2: 2 Pares Completos */}
                    <div className="promo-card promo-card--warm">
                        <div className="promo-card-tag promo-card-tag--hot">
                            <FaFire /> Top Venta
                        </div>
                        <div className="promo-card-content">
                            <h3 className="promo-card-title">2 Pares de Lentes Completos</h3>
                            <p className="promo-card-detail">Armazón + Cristales Orgánicos con Antirreflejo</p>
                            <div className="promo-card-price">
                                <span className="promo-price-symbol">$</span>
                                <span className="promo-price-amount">69.990</span>
                            </div>
                        </div>
                        <Link to="/productos?categoria=opticos" className="promo-card-btn promo-card-btn--dark">
                            <FaShoppingCart /> COMPRA AQUÍ
                        </Link>
                    </div>

                    {/* Promo 3: Examen visual */}
                    <Link to="/agendar-cita" className="promo-card promo-card--blue">
                        <div className="promo-card-tag promo-card-tag--free">
                            ✓ Gratis
                        </div>
                        <div className="promo-card-content">
                            <h3 className="promo-card-title">Examen Visual Gratuito</h3>
                            <p className="promo-card-desc">Agenda tu hora con nuestros profesionales ópticos</p>
                        </div>
                        <span className="promo-card-btn promo-card-btn--white">
                            Agendar cita →
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PromoBanners;
