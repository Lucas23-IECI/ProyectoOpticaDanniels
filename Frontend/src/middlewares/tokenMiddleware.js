import { decodeToken } from '@helpers/jwt.helper';

/**
 * Middleware para validar y agregar token a las peticiones
 */
export const tokenMiddleware = {
    addTokenToRequest: (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        
        return config;
    },

    validateTokenBeforeRequest: async (config) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return config;
        }

        try {
            const decodedToken = await decodeToken(token);
            
            if (!decodedToken) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return config;
            }

            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp <= currentTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return config;
            }

            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
            
        } catch (error) {
            console.error('Error validando token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        
        return config;
    },

    checkPermissions: async (requiredRole = null) => {
        const token = localStorage.getItem('token');
        
        if (!token) return false;

        try {
            const decodedToken = await decodeToken(token);
            
            if (!decodedToken) return false;

            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp <= currentTime) return false;

            if (requiredRole && decodedToken.rol !== requiredRole) return false;

            return true;
        } catch {
            return false;
        }
    }
};

export default tokenMiddleware;
