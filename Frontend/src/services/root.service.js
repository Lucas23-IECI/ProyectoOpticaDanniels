import axios from 'axios';
// import { showErrorAlert } from '@helpers/sweetAlert'; // No necesario - sesión indefinida
import { tokenMiddleware } from '@middlewares/tokenMiddleware';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    async (config) => {
        return await tokenMiddleware.validateTokenBeforeRequest(config);
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isLoginPage = window.location.pathname === '/auth' || 
                               window.location.pathname === '/login' ||
                               window.location.pathname === '/register';
            
            if (!isLoginPage) {
                // Sesión indefinida - solo redirigir sin mostrar alerta molesta
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                window.location.href = '/auth';
            }
        }
        
        return Promise.reject(error);
    }
);

export default instance;
