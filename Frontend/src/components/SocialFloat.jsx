import { useState, useEffect } from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import '@styles/social-float.css';

const SocialFloat = () => {
    const [isNearFooter, setIsNearFooter] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('.footer-container');
            if (!footer) return;

            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Si el footer está visible en pantalla o cerca de estarlo
            const footerIsNear = footerRect.top <= windowHeight + 100;
            setIsNearFooter(footerIsNear);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Ejecutar una vez al cargar

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const socialLinks = [
        {
            name: 'WhatsApp',
            url: 'https://api.whatsapp.com/send?phone=56937692691&text=Hola!%20Quisiera%20información%20sobre%20sus%20servicios',
            icon: <FaWhatsapp />,
            color: '#25d366',
            hoverColor: '#128c7e'
        },
        {
            name: 'Facebook',
            url: 'https://facebook.com/opticadanniels',
            icon: <FaFacebook />,
            color: '#1877f2',
            hoverColor: '#165dd8'
        },
        {
            name: 'Instagram',
            url: 'https://instagram.com/opticadanniels',
            icon: <FaInstagram />,
            color: '#e4405f',
            hoverColor: '#c13584'
        }
    ];

    return (
        <div className={`social-float-container ${isNearFooter ? 'hidden-near-footer' : ''}`}>
            {socialLinks.map((social, index) => (
                <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-float social-${social.name.toLowerCase()}`}
                    aria-label={`Contactar por ${social.name}`}
                    style={{
                        '--social-color': social.color,
                        '--social-hover-color': social.hoverColor,
                        '--animation-delay': `${index * 0.1}s`
                    }}
                >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-text">{social.name}</span>
                </a>
            ))}
        </div>
    );
};

export default SocialFloat;
