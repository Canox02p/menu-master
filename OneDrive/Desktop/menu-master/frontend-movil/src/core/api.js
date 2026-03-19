<<<<<<< HEAD
const IP_COMPUTADORA = '192.168.3.35';
=======
const IP_COMPUTADORA = '192.168.68.108';
>>>>>>> a5f7b51ec0879ea402967616f854198416550185
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