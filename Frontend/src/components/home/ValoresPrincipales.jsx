import { FaGraduationCap, FaChild, FaHandshake, FaTools, FaEye, FaAward } from 'react-icons/fa';

const ValoresPrincipales = () => {
    const valores = [
        {
            id: 'experiencia',
            titulo: 'EXPERIENCIA',
            descripcion: 'Te asesoramos para tomar la mejor decisión, 30 años de experiencia.',
            icono: <FaGraduationCap />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/experiencia-icon.jpg`,
            destacado: true
        },
        {
            id: 'infantil',
            titulo: 'INFANTIL',
            descripcion: 'Es muy importante el cuidado desde temprana edad en los niños y niñas.',
            icono: <FaChild />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/infantil-icon.jpg`
        },
        {
            id: 'convenios',
            titulo: 'CONVENIOS',
            descripcion: 'Tenemos distintos convenios para que seas beneficiado.',
            icono: <FaHandshake />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/convenios-icon.jpg`
        },
        {
            id: 'reparaciones',
            titulo: 'REPARACIONES',
            descripcion: 'Consulta por alternativas disponibles en nuestra tienda.',
            icono: <FaTools />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/reparaciones-icon.jpg`
        },
        {
            id: 'calidad',
            titulo: 'CALIDAD',
            descripcion: 'Trabajamos con los mejores laboratorios y tecnología avanzada.',
            icono: <FaAward />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/calidad-icon.jpg`
        },
        {
            id: 'vision',
            titulo: 'TU VISIÓN ES NUESTRA VISIÓN',
            descripcion: 'Un servicio que va más allá de una venta, una experiencia de calidad.',
            icono: <FaEye />,
            imagen: `${import.meta.env.BASE_URL}images/servicios/asesoria-icon.jpg`,
            destacado: true
        }
    ];

    return (
        <section className="valores-principales">
            <div className="container">
                <div className="valores-header">
                    <h2 className="valores-title">¿Por qué elegir Óptica Danniels?</h2>
                    <p className="valores-subtitle">
                        Más de tres décadas perfeccionando el arte del cuidado visual
                    </p>
                </div>

                <div className="valores-grid">
                    {valores.map((valor) => (
                        <div 
                            key={valor.id} 
                            className={`valor-card ${valor.destacado ? 'destacado' : ''}`}
                        >
                            <div className="valor-icon">
                                {valor.icono}
                            </div>
                            <div className="valor-content">
                                <h3 className="valor-titulo">{valor.titulo}</h3>
                                <p className="valor-descripcion">{valor.descripcion}</p>
                            </div>
                            <div 
                                className="valor-background"
                                style={{ backgroundImage: `url(${valor.imagen})` }}
                            />
                        </div>
                    ))}
                </div>

                <div className="estadisticas">
                    <div className="estadistica">
                        <div className="estadistica-numero">30+</div>
                        <div className="estadistica-texto">Años de Experiencia</div>
                    </div>
                    <div className="estadistica">
                        <div className="estadistica-numero">5</div>
                        <div className="estadistica-texto">Sucursales</div>
                    </div>
                    <div className="estadistica">
                        <div className="estadistica-numero">1000+</div>
                        <div className="estadistica-texto">Clientes Satisfechos</div>
                    </div>
                    <div className="estadistica">
                        <div className="estadistica-numero">24/7</div>
                        <div className="estadistica-texto">Atención WhatsApp</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValoresPrincipales;
