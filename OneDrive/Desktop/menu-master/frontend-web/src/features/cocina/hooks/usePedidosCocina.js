import { useState } from 'react';
// Importamos los datos de ejemplo que creamos
import { mockPedidosCocina } from '../data/mock-pedidos';

export const usePedidosCocina = () => {
    // El estado inicial ahora contiene nuestros pedidos de ejemplo
    const [pedidos, setPedidos] = useState(mockPedidosCocina);

    // Ya no necesitamos `useEffect` porque no cargamos datos de un servidor.

    // Esta función ahora actualiza el estado localmente
    const actualizarEstado = (id, nuevoEstado) => {
        setPedidos(currentPedidos =>
            currentPedidos.map(p =>
                p._id === id ? { ...p, estado: nuevoEstado } : p
            )
        );
    };

    // Esta función ahora elimina el pedido del estado local
    const eliminar = (id) => {
        setPedidos(currentPedidos =>
            currentPedidos.filter(p => p._id !== id)
        );
    };

    return { pedidos, actualizarEstado, eliminar };
};
