import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { decodeToken, clearTokenCache } from '@helpers/jwt.helper';

export const useTokenExpiration = () => {
    const navigate = useNavigate();
    const { setUser, isAuthenticated } = useAuth();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearTokenCache();
        
        setUser(null);
        
        navigate('/login');
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
        } catch (error) {
            console.error('Error verificando expiración del token:', error);
            handleLogout();
        }
    }, [isAuthenticated, handleLogout]);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Verificar token al cargar
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        // Verificar expiración cada 60 segundos (JWT exp = 24h)
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60_000);
        return () => clearInterval(interval);
    }, [isAuthenticated, handleLogout, checkTokenExpiration]);

    return { handleLogout, checkTokenExpiration };
};
