import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
// import { showErrorAlert } from '@helpers/sweetAlert'; // No necesario - sesión indefinida
import { decodeToken, clearTokenCache } from '@helpers/jwt.helper';

export const useTokenExpiration = () => {
    const navigate = useNavigate();
    const { setUser, isAuthenticated } = useAuth();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearTokenCache();
        
        setUser(null);
        
        // Sesión indefinida - no mostrar alertas molestas
        
        navigate('/auth');
    }, [navigate, setUser]);

    const checkTokenExpiration = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            const decodedToken = await decodeToken(token);
            if (!decodedToken) {
                handleLogout();
                return;
            }

            const currentTime = Date.now() / 1000;
            const tokenExpiration = decodedToken.exp;

            if (currentTime >= tokenExpiration) {
                handleLogout();
                return;
            }

            // Sesión indefinida - no mostrar avisos de expiración
        } catch (error) {
            console.error('Error verificando expiración del token:', error);
            // handleLogout(); // No auto-logout en sesión indefinida
        }
    }, [isAuthenticated, handleLogout]);

    useEffect(() => {
        // Sesión indefinida - no verificar expiración automáticamente
        // Solo verificar si hay token válido una vez al cargar
        if (!isAuthenticated) return;

        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
        }
    }, [isAuthenticated, handleLogout]);

    return { handleLogout, checkTokenExpiration };
};
