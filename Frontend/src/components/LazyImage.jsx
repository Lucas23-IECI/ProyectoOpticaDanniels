import { useState, useRef, useEffect, memo } from 'react';
import '../styles/lazyImage.css';

const LazyImage = memo(({ src, alt, className = '', placeholder = null, onLoad = null }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const currentRef = imgRef.current;
        
        if (!currentRef) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observerRef.current?.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        observerRef.current.observe(currentRef);

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    const getImageSrc = () => {
        if (!src) return null;
        
        if (src.startsWith('data:image') || src.startsWith('http')) {
            return src;
        }
        
        return `http://localhost:3000/api/productos/imagen/${src}`;
    };

    if (!src && !placeholder) {
        return (
            <div className={`lazy-image-container ${className}`}>
                <div className="image-placeholder">
                    <div className="placeholder-skeleton">
                        <div className="skeleton-shimmer"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={imgRef} className={`lazy-image-container ${className}`}>
            {!isInView ? (
                <div className="image-placeholder">
                    {placeholder || (
                        <div className="placeholder-skeleton">
                            <div className="skeleton-shimmer"></div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {!isLoaded && (
                        <div className="image-placeholder">
                            <div className="placeholder-skeleton">
                                <div className="skeleton-shimmer"></div>
                            </div>
                        </div>
                    )}
                    
                    {hasError ? (
                        <div className="image-error">
                            <div className="error-icon">📷</div>
                            <span>Error al cargar imagen</span>
                        </div>
                    ) : (
                        <img
                            src={getImageSrc()}
                            alt={alt}
                            className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
                            onLoad={handleLoad}
                            onError={handleError}
                            loading="lazy"
                        />
                    )}
                </>
            )}
        </div>
    );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
