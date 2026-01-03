import { useAuth } from '@context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ 
    children, 
    allowedRoles = [], 
    requireAuth = true, 
    redirectTo = '/auth' 
}) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontSize: '1.2rem',
                color: 'var(--text-secondary)'
            }}>
                Verificando sesión...
            </div>
        );
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (!requireAuth && isAuthenticated) {
        const from = location.state?.from?.pathname || '/productos';
        return <Navigate to={from} replace />;
    }

    if (requireAuth && allowedRoles.length > 0 && user && !allowedRoles.includes(user.rol)) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontSize: '1.2rem',
                color: 'var(--error-color)'
            }}>
                No tienes permisos para acceder a esta página
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
