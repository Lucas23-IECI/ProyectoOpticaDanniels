import { FaShieldAlt, FaTruck, FaUserMd, FaClock } from 'react-icons/fa';

const ValoresPrincipales = () => {
    const beneficios = [
        {
            id: 'garantia',
            icono: <FaShieldAlt />,
            titulo: 'Garantía Óptica',
            descripcion: 'En todos nuestros productos'
        },
        {
            id: 'envio',
            icono: <FaTruck />,
            titulo: 'Despacho a Domicilio',
            descripcion: 'A todo Chile'
        },
        {
            id: 'profesional',
            icono: <FaUserMd />,
            titulo: 'Atención Profesional',
            descripcion: '30+ años de experiencia'
        },
        {
            id: 'horario',
            icono: <FaClock />,
            titulo: 'WhatsApp 24/7',
            descripcion: 'Consultas por WhatsApp'
        }
    ];

    return (
        <section className="eco-benefits">
            <div className="eco-benefits-inner">
                {beneficios.map((b) => (
                    <div key={b.id} className="eco-benefit-item">
                        <div className="eco-benefit-icon">{b.icono}</div>
                        <div className="eco-benefit-text">
                            <strong>{b.titulo}</strong>
                            <span>{b.descripcion}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ValoresPrincipales;
