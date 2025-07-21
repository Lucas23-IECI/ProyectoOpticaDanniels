import { Link } from 'react-router-dom';

const HistoriaEmpresa = () => {
    return (
        <section className="historia-empresa">
            <div className="container">
                <div className="historia-header">
                    <h2 className="historia-title">Nuestra Historia</h2>
                    <p className="historia-subtitle">
                        30 años mejorando la visión de nuestra gente
                    </p>
                    <Link to="/quienes-somos" className="btn-conoce-mas">
                        Conoce más sobre nosotros
                    </Link>
                </div>

                <div className="historia-intro">
                    <div className="intro-content">
                        <h3>Quiénes Somos</h3>
                        <p>
                            Óptica Danniels nace hace 30 años con el compromiso de brindar 
                            la mejor atención en salud visual. Somos una empresa familiar 
                            que ha crecido junto a nuestra comunidad, expandiéndonos desde 
                            Angol hasta convertirmos en referente en la Región del Biobío.
                        </p>
                        <p>
                            Hoy, la familia Óptica Danniels continúa entregando un servicio 
                            funcional, tanto en el montaje de cristales y trabajo con los 
                            mejores laboratorios, como en la asesoría en armazones; capacitados 
                            en años de servicio al cliente y dedicación a este rubro.
                        </p>
                    </div>
                    <div className="intro-image">
                        <img 
                            src={`${import.meta.env.BASE_URL}images/historia/familia-danniels.jpg`} 
                            alt="Familia Óptica Danniels"
                            onError={(e) => {
                                e.target.src = '/LogoOficial.png';
                            }}
                        />
                    </div>
                </div>

                <div className="mision-vision-objetivo">
                    <div className="mision">
                        <h3>Misión</h3>
                        <p>
                            Contribuir al cuidado visual mediante la entrega de soluciones ópticas confiables, 
                            integrando productos de calidad con un servicio profesional, cercano y personalizado, 
                            orientado a satisfacer las necesidades específicas de cada cliente de manera oportuna y efectiva.
                        </p>
                    </div>

                    <div className="vision">
                        <h3>Visión</h3>
                        <p>
                            Consolidarse como una óptica de referencia a nivel nacional, reconocida por su compromiso 
                            con la salud visual, la calidad de sus servicios y su capacidad para incorporar nuevas 
                            formas de atención, manteniendo en todo momento un enfoque centrado en las personas.
                        </p>
                    </div>

                    <div className="objetivo">
                        <h3>Objetivo General</h3>
                        <p>
                            Promover el bienestar visual de la población a través de servicios especializados de 
                            evaluación y la oferta de productos ópticos adecuados, asegurando un proceso de atención 
                            eficiente, accesible y orientado a generar confianza y satisfacción en cada cliente.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HistoriaEmpresa;
