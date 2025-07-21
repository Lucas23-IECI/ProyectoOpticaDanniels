import { useState } from 'react';
import '@styles/image-components.css';

const ImageWithFallback = ({ src, alt, fallbackSrc, className, style, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    const defaultFallback = fallbackSrc || '/LogoOficial.png';

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        if (imageSrc !== defaultFallback) {
            console.warn(`Failed to load image: ${imageSrc}, using fallback`);
            setImageSrc(defaultFallback);
        }
    };

    return (
        <div className={`image-container ${className || ''}`} style={style}>
            {isLoading && (
                <div className="image-loading">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <img
                src={imageSrc}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}
                {...props}
            />
        </div>
    );
};

export default ImageWithFallback;
