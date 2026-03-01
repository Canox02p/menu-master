import { COLORES_RESTO } from './theme';

export const obtenerColorTexto = (estado) => {
    switch (estado.toLowerCase()) {
        case 'libre': return COLORES_RESTO.bordeLibre;
        case 'ocupada': return COLORES_RESTO.bordeOcupada;
        case 'reservada': return COLORES_RESTO.bordeReservada;
        default: return COLORES_RESTO.bordeInactiva;
    }
};