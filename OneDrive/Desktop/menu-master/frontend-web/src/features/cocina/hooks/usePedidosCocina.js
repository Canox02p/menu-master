import { useState, useEffect } from 'react';
// IMPORTANTE: Subimos tres niveles para salir hasta src/ y luego entrar a services/
import { cocinaService } from '../../../services/cocinaService';

export const usePedidosCocina = () => {
    const [pedidos, setPedidos] = useState([]);

    const cargarPedidos = async () => {
        try {
            const data = await cocinaService.getPedidos();
            setPedidos(data);
        } catch (err) {
            console.error("Error sincronizando con MongoDB:", err);
        }
    };

    useEffect(() => {
        cargarPedidos();
        const intervalo = setInterval(cargarPedidos, 10000); // Actualización cada 10 segundos
        return () => clearInterval(intervalo);
    }, []);

    const actualizarEstado = async (id, nuevoEstado) => {
        await cocinaService.cambiarEstado(id, nuevoEstado);
        cargarPedidos(); // Recarga la lista tras el cambio
    };

    const eliminar = async (id) => {
        await cocinaService.cancelar(id);
        cargarPedidos(); // Quita el pedido de la pantalla
    };

    return { pedidos, actualizarEstado, eliminar };
};