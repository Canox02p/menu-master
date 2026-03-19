import { useState, useEffect } from 'react';

export const usePedidosCocina = () => {
    const [pedidos, setPedidos] = useState([]);
    const API_URL = 'http://localhost:3000/pedidos';

    const cargarPedidos = async () => {
        try {
            const res = await fetch(`${API_URL}/cocina`);
            const data = await res.json();
            setPedidos(data);
        } catch (err) {
            console.error("Error cargando pedidos:", err);
        }
    };

    useEffect(() => {
        cargarPedidos();
        const intervalo = setInterval(cargarPedidos, 5000);
        return () => clearInterval(intervalo);
    }, []);

    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            const res = await fetch(`${API_URL}/${id}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (res.ok) cargarPedidos();
        } catch (err) {
            console.error("Error al actualizar:", err);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Cancelar este pedido?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) cargarPedidos();
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    return { pedidos, actualizarEstado, eliminar };
};