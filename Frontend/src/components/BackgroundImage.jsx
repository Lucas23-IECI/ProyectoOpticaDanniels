import { useState, useEffect } from 'react';
import '@styles/image-components.css';

const BackgroundImage = ({ src, fallbackSrc, className, style, overlay, children, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
        if (!src) {
            setIsLoading(false);
            setHasError(true);
            return;
        }

        const img = new Image();
        
        img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
            setHasError(false);
        };
        
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            if (fallbackSrc && src !== fallbackSrc) {
                setImageSrc(fallbackSrc);
            } else {
                setHasError(true);
            }
            setIsLoading(false);
        };
        
        img.src = src;
    }, [src, fallbackSrc]);

    const backgroundStyle = {
        ...style,
        backgroundColor: hasError ? '#f0f0f0' : 'transparent',
        backgroundImage: hasError ? 'none' : 
            (overlay && imageSrc ? `${overlay}, url(${imageSrc})` : 
             imageSrc ? `url(${imageSrc})` : 'none'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div 
            className={`background-image-container ${className || ''}`}
            style={backgroundStyle}
            {...props}
        >
            {isLoading && (
                <div className="background-loading">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {children}
        </div>
    );
};

export default BackgroundImage;
