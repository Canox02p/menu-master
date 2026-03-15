// src/services/cocinaService.js
import { ENDPOINTS } from '../core/api';

export const cocinaService = {
    getPedidos: async () => {
        const res = await fetch(`${ENDPOINTS.pedidos}/cocina`);
        if (!res.ok) throw new Error('Error al obtener pedidos');
        return await res.json();
    },

    cambiarEstado: async (id, nuevoEstado) => {
        const res = await fetch(`${ENDPOINTS.pedidos}/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!res.ok) throw new Error('Error al cambiar el estado');
        return await res.json();
    },

    cancelar: async (id) => {
        const res = await fetch(`${ENDPOINTS.pedidos}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar el pedido');
        return await res.json();
    }
};