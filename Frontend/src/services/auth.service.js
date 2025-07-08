import axios from './root.service.js';

export async function login(data) {
    const response = await axios.post('/auth/login', data);
    return response.data;
}

export async function register(data) {
    const response = await axios.post('/auth/register', data);
    return response.data;
}

export async function logout() {
    const response = await axios.post('/auth/logout');
    return response.data;
}

export async function getProfile() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await axios.get('/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        return null;
    }
}

