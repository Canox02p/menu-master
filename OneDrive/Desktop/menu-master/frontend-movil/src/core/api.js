// frontend-movil/src/core/api.js
const IP_COMPUTADORA = '10.40.207.66';
const PUERTO = '3000';
export const API_URL = `http://${IP_COMPUTADORA}:${PUERTO}`;

export const ENDPOINTS = {
    mesas: `${API_URL}/mesas`,
    productos: `${API_URL}/productos`,
    pedidos: `${API_URL}/pedidos`,
    ventas: `${API_URL}/ventas`,
    usuarios: `${API_URL}/usuarios`
};