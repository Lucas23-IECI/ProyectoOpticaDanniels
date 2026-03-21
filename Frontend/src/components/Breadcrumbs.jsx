import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";
import "@styles/breadcrumbs.css";

const ROUTE_LABELS = {
    'productos': 'Productos',
    'carrito': 'Carrito',
    'checkout': 'Checkout',
    'resultado': 'Resultado',
    'contacto': 'Contacto',
    'agendar-cita': 'Agendar Cita',
    'quienes-somos': 'Quiénes Somos',
    'faq': 'Preguntas Frecuentes',
    'privacidad': 'Privacidad',
    'terminos': 'Términos',
    'favoritos': 'Favoritos',
    'buscar': 'Búsqueda',
    'perfil': 'Mi Perfil',
    'mis-compras': 'Mis Compras',
    'admin': 'Administración',
};

function Breadcrumbs({ customTrail }) {
    const location = useLocation();

    if (location.pathname === '/') return null;

    const pathSegments = location.pathname.split('/').filter(Boolean);

    const crumbs = customTrail || pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = ROUTE_LABELS[segment] || decodeURIComponent(segment).replace(/-/g, ' ');
        const isLast = index === pathSegments.length - 1;
        return { label, path, isLast };
    });

    return (
        <nav className="breadcrumbs" aria-label="Navegación de migas de pan">
            <ol className="breadcrumbs-list">
                <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link">
                        <FaHome />
                        <span>Inicio</span>
                    </Link>
                </li>
                {crumbs.map((crumb, i) => (
                    <li key={i} className="breadcrumb-item">
                        <FaChevronRight className="breadcrumb-separator" />
                        {crumb.isLast ? (
                            <span className="breadcrumb-current" aria-current="page">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link to={crumb.path} className="breadcrumb-link">
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
