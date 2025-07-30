import axios from './root.service.js';

export async function getUsers() {
    const response = await axios.get('/user/');
    return response.data.data;
}

export async function getUser(query) {
    const { id, rut, email } = query;
    const params = new URLSearchParams();
    if (id) params.append('id', id);
    if (rut) params.append('rut', rut);
    if (email) params.append('email', email);
    
    const response = await axios.get(`/user/detail/?${params.toString()}`);
    return response.data.data;
}

export async function createUser(userData) {
    const response = await axios.post('/auth/register', userData);
    return response.data.data;
}

export async function updateUser(data, query) {
    const { id, rut, email } = query;
    const params = new URLSearchParams();
    if (id) params.append('id', id);
    if (rut) params.append('rut', rut);
    if (email) params.append('email', email);
    
    const response = await axios.patch(`/user/detail/?${params.toString()}`, data);
    return response.data.data;
}

export async function deleteUser(query) {
    const { id, rut, email } = query;
    const params = new URLSearchParams();
    if (id) params.append('id', id);
    if (rut) params.append('rut', rut);
    if (email) params.append('email', email);
    
    const response = await axios.delete(`/user/detail/?${params.toString()}`);
    return response.data;
}
