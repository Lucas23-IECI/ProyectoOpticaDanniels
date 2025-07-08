import axios from './root.service.js';

export async function getUsers() {
    const response = await axios.get('/user/');
    return response.data.data;
}

export async function updateUser(data, rut) {
    const response = await axios.patch(`/user/detail/?rut=${rut}`, data);
    return response.data.data;
}

export async function deleteUser(rut) {
    const response = await axios.delete(`/user/detail/?rut=${rut}`);
    return response.data;
}
