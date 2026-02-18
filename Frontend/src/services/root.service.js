import axios from 'axios';
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
            const basePath = import.meta.env.BASE_URL || '/';
            const currentPath = window.location.pathname;
            const isLoginPage = currentPath === `${basePath}login` ||
                currentPath === `${basePath}register`;

            if (!isLoginPage) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                window.location.href = `${basePath}login`;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
