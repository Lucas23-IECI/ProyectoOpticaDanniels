import { FaWhatsapp } from 'react-icons/fa';
import '@styles/whatsapp-float.css';

const WhatsAppFloat = () => {
    const whatsappUrl = "https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20información%20sobre%20sus%20servicios";

    return (
        <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Contactar por WhatsApp"
        >
            <FaWhatsapp className="whatsapp-icon" />
            <span className="whatsapp-text">WhatsApp</span>
        </a>
    );
};

export default WhatsAppFloat;
