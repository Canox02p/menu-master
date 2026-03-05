const API_URL = 'http://localhost:3000/pedidos';

export const cocinaService = {
    // Trae los pedidos para el monitor de cocina
    getPedidos: () => fetch(`${API_URL}/cocina`).then(res => res.json()),

    // Cambia el estado (Tomar -> EN_PROCESO, Terminar -> LISTO)
    cambiarEstado: (id, nuevoEstado) =>
        fetch(`${API_URL}/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        }),

    // Borra el pedido al cancelar
    cancelar: (id) => fetch(`${API_URL}/${id}`, { method: 'DELETE' })
};