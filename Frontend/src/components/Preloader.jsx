import { useEffect, useState } from 'react';
import '@styles/preloader.css';

const Preloader = ({ onFinish }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsVisible(false);
                        onFinish();
                    }, 300);
                    return 100;
                }
                return prev + Math.random() * 20;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className="preloader">
            <div className="preloader-content">
                <div className="preloader-logo">
                    <img src="/LogoOficial.png" alt="Óptica Danniels" />
                </div>
                <div className="preloader-progress">
                    <div 
                        className="preloader-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="preloader-text">Cargando...</p>
            </div>
        </div>
    );
};

export default Preloader;
