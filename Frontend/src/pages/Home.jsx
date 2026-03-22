import { useState, useEffect, lazy, Suspense } from 'react';
import { getProductos } from '@services/producto.service';
import { WishlistProvider } from '@context/WishlistProvider';
import SocialFloat from '@components/SocialFloat';
import HeroSection from '@components/home/HeroSection';
import ValoresPrincipales from '@components/home/ValoresPrincipales';
import CategoriasDestacadas from '@components/home/CategoriasDestacadas';
import '@styles/home.css';

const ProductosDestacados = lazy(() => import('@components/home/ProductosDestacados'));
const PromoBanners = lazy(() => import('@components/home/PromoBanners'));
const ServiciosEspecializados = lazy(() => import('@components/home/ServiciosEspecializados'));
const UbicacionContacto = lazy(() => import('@components/home/UbicacionContacto'));
const CallToActionFinal = lazy(() => import('@components/home/CallToActionFinal'));

function Home() {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductosDestacados = async () => {
            try {
                // Solo cargar productos activos para clientes
                const result = await getProductos({ activo: true, limit: 6 });
                const destacados = result?.productos || [];
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

                <CategoriasDestacadas />

                <Suspense fallback={<LoadingComponent />}>
                    <ProductosDestacados productos={productosDestacados} />
                </Suspense>

                <Suspense fallback={<LoadingComponent />}>
                    <PromoBanners />
                </Suspense>

                <Suspense fallback={<LoadingComponent />}>
                    <ServiciosEspecializados />
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
