import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { showErrorAlert } from '@helpers/sweetAlert';
import { decodeToken, clearTokenCache } from '@helpers/jwt.helper';

export const useTokenExpiration = () => {
    const navigate = useNavigate();
    const { setUser, isAuthenticated } = useAuth();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearTokenCache();
        
        setUser(null);
        
        showErrorAlert(
            "Sesión expirada", 
            "Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente."
        );
        
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

            const timeUntilExpiration = tokenExpiration - currentTime;
            const fiveMinutes = 5 * 60;

            if (timeUntilExpiration <= fiveMinutes && timeUntilExpiration > 0) {
                const minutesLeft = Math.ceil(timeUntilExpiration / 60);
                showErrorAlert(
                    "Sesión por expirar", 
                    `Tu sesión expirará en ${minutesLeft} minuto(s). Guarda tu trabajo.`
                );
            }
        } catch (error) {
            console.error('Error verificando expiración del token:', error);
            handleLogout();
        }
    }, [isAuthenticated, handleLogout]);

    useEffect(() => {
        if (!isAuthenticated) return;

        checkTokenExpiration();

        const interval = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(interval);
    }, [isAuthenticated, checkTokenExpiration]);

    return { handleLogout, checkTokenExpiration };
};
