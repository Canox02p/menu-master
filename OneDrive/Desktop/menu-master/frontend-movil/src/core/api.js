
const IP_COMPUTADORA = ' 192.168.68.130';
const PUERTO = '3000';
export const API_URL = `http://${IP_COMPUTADORA}:${PUERTO}`;

export const ENDPOINTS = {
    mesas: `${API_URL}/mesas`,
    productos: `${API_URL}/productos`,
    pedidos: `${API_URL}/pedidos`,
    pedidosActivos: `${API_URL}/pedidos/activos`,
    ventas: `${API_URL}/ventas`,
    usuarios: `${API_URL}/usuarios`
};