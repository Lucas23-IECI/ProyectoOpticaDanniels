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

export async function updateProfile(userData) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    try {
        const response = await axios.put('/auth/profile', userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error al actualizar el perfil');
    }
}

export async function forgotPassword(email) {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
}

export async function resetPassword(token, newPassword) {
    const response = await axios.post('/auth/reset-password', { token, newPassword });
    return response.data;
}

