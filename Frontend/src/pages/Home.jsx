import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { getProductos } from '@services/producto.service';
import { WishlistProvider } from '@context/WishlistContext';
import SocialFloat from '@components/SocialFloat';
import HeroSection from '@components/home/HeroSection';
import ValoresPrincipales from '@components/home/ValoresPrincipales';
import '@styles/home.css';

const ProductosDestacados = lazy(() => import('@components/home/ProductosDestacados'));
const ServiciosEspecializados = lazy(() => import('@components/home/ServiciosEspecializados'));
const TestimoniosClientes = lazy(() => import('@components/home/TestimoniosClientes'));
const UbicacionContacto = lazy(() => import('@components/home/UbicacionContacto'));
const CallToActionFinal = lazy(() => import('@components/home/CallToActionFinal'));

function Home() {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductosDestacados = async () => {
            try {
                const productosData = await getProductos();
                const destacados = productosData.slice(0, 6);
                setProductosDestacados(destacados);
            } catch (error) {
                console.error('Error al cargar productos destacados:', error);
                setProductosDestacados([]);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosDestacados();
    }, []);

    const LoadingComponent = () => (
        <div className="section-loading">
            <div className="loading-spinner"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="home-loading">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <WishlistProvider>
            <div className="home-container">
                <HeroSection />
                
                <ValoresPrincipales />
                
                <Suspense fallback={<LoadingComponent />}>
                    <ProductosDestacados productos={productosDestacados} />
                </Suspense>
                
                <Suspense fallback={<LoadingComponent />}>
                    <ServiciosEspecializados />
                </Suspense>
                

                
                <Suspense fallback={<LoadingComponent />}>
                    <TestimoniosClientes />
                </Suspense>
                
                <Suspense fallback={<LoadingComponent />}>
                    <UbicacionContacto />
                </Suspense>
                
                <Suspense fallback={<LoadingComponent />}>
                    <CallToActionFinal />
                </Suspense>
                
                <SocialFloat />
            </div>
        </WishlistProvider>
    );
}

export default Home;
