import { FaEyeDropper, FaUserMd, FaHandsHelping, FaTools, FaCogs, FaHeartbeat } from 'react-icons/fa';

const ServiciosEspecializados = () => {
    const servicios = [
        {
            id: 'montaje',
            titulo: 'Montaje de Cristales',
            descripcion: 'Trabajamos con los mejores laboratorios para ofrecerte cristales de la más alta calidad con la tecnología más avanzada.',
            icono: <FaCogs />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/montaje-cristales.jpg`,
            caracteristicas: [
                'Laboratorios certificados',
                'Tecnología avanzada',
                'Garantía de calidad',
                'Tiempos de entrega optimizados'
            ]
        },
        {
            id: 'asesoria',
            titulo: 'Asesoramiento Profesional',
            descripcion: 'Nuestros profesionales capacitados te brindan asesoramiento personalizado siguiendo las indicaciones de tu oftalmólogo.',
            icono: <FaUserMd />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/asesoria-profesional.jpg`,
            caracteristicas: [
                'Profesionales capacitados',
                'Asesoramiento personalizado',
                'Seguimiento oftalmológico',
                'Experiencia de 30 años'
            ]
        },
        {
            id: 'reparaciones',
            titulo: 'Reparaciones Especializadas',
            descripcion: 'Consulta por las alternativas disponibles en nuestra tienda. Reparamos y mantenemos tus lentes con el máximo cuidado.',
            icono: <FaTools />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/reparaciones.jpg`,
            caracteristicas: [
                'Reparación de marcos',
                'Cambio de patillas',
                'Ajuste de lentes',
                'Mantenimiento preventivo'
            ]
        },
        {
            id: 'infantil',
            titulo: 'Atención Infantil Especializada',
            descripcion: 'Es muy importante el cuidado desde temprana edad. Ofrecemos atención especializada para niños y niñas.',
            icono: <FaHeartbeat />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/atencion-infantil.jpg`,
            caracteristicas: [
                'Marcos resistentes para niños',
                'Diseños atractivos',
                'Materiales seguros',
                'Asesoramiento para padres'
            ]
        },
        {
            id: 'protesis',
            titulo: 'Prótesis Auditivas',
            descripcion: 'Nos especializamos en prótesis auditivas y audífonos para personas con capacidad auditiva disminuida.',
            icono: <FaEyeDropper />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/protesis-auditiva.jpg`,
            caracteristicas: [
                'Audífonos de última generación',
                'Adaptación personalizada',
                'Seguimiento continuo',
                'Garantía y mantenimiento'
            ]
        },
        {
            id: 'convenios',
            titulo: 'Convenios Institucionales',
            descripcion: 'Tenemos convenios con colegios, municipalidades, hospitales y centros asistenciales para beneficiar a más personas.',
            icono: <FaHandsHelping />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/convenios.jpg`,
            caracteristicas: [
                'Descuentos especiales',
                'Facilidades de pago',
                'Atención preferencial',
                'Planes corporativos'
            ]
        }
    ];

    return (
        <section className="servicios-especializados" id="servicios">
            <div className="container">
                <div className="servicios-header">
                    <h2 className="servicios-title">Nuestros Servicios Especializados</h2>
                    <p className="servicios-subtitle">
                        Un servicio que va más allá de una venta, una experiencia de calidad para tus ojos
                    </p>
                </div>

                <div className="servicios-grid">
                    {servicios.map((servicio) => (
                        <div key={servicio.id} className="servicio-card">
                            <div className="servicio-header">
                                <div className="servicio-icon">
                                    {servicio.icono}
                                </div>
                                <h3 className="servicio-titulo">{servicio.titulo}</h3>
                            </div>
                            
                            <div className="servicio-content">
                                <p className="servicio-descripcion">{servicio.descripcion}</p>
                                
                                <ul className="servicio-caracteristicas">
                                    {servicio.caracteristicas.map((caracteristica, index) => (
                                        <li key={index}>{caracteristica}</li>
                                    ))}
                                </ul>
                            </div>

                            <div 
                                className="servicio-background"
                                style={{ backgroundImage: `url(${servicio.imagen})` }}
                            />
                        </div>
                    ))}
                </div>

                <div className="diferenciadores">
                    <h3>¿Qué nos diferencia?</h3>
                    <div className="diferenciadores-grid">
                        <div className="diferenciador">
                            <h4>Un camino recorrido que aún no se termina</h4>
                            <p>30 años de experiencia entregando un servicio de calidad, amable y eficiente.</p>
                        </div>
                        <div className="diferenciador">
                            <h4>Más que una venta, una experiencia</h4>
                            <p>Nuestro servicio va más allá de vender lentes, creamos experiencias de calidad.</p>
                        </div>
                        <div className="diferenciador">
                            <h4>Tecnología y tradición</h4>
                            <p>Combinamos la mejor tecnología con la calidez del servicio familiar tradicional.</p>
                        </div>
                    </div>
                </div>

                <div className="servicios-cta">
                    <div className="cta-content">
                        <h3>¿Necesitas asesoramiento especializado?</h3>
                        <p>Contáctanos y te ayudaremos a encontrar la mejor solución para tu visión</p>
                        <a 
                            href="https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Necesito%20asesoramiento%20especializado"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Consultar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiciosEspecializados;
