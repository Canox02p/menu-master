// src/hooks/usePedidosCocina.js
import { useState, useEffect, useCallback } from 'react';
import { cocinaService } from '../services/cocinaService';

export const usePedidosCocina = () => {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);

    const cargarPedidos = useCallback(async () => {
        try {
            const data = await cocinaService.getPedidos();
            setPedidos(data);
        } catch (err) {
            console.error("Error sincronizando con MongoDB:", err);
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    }, []);

    // Deslizar para actualizar en el celular
    const onRefresh = useCallback(() => {
        setRefrescando(true);
        cargarPedidos();
    }, [cargarPedidos]);

    useEffect(() => {
        cargarPedidos();
        const intervalo = setInterval(cargarPedidos, 10000); // Actualización cada 10 segundos
        return () => clearInterval(intervalo);
    }, [cargarPedidos]);

    // Misma lógica de tu web
    const actualizarEstado = async (id, nuevoEstado) => {
        await cocinaService.cambiarEstado(id, nuevoEstado);
        cargarPedidos(); // Recarga la lista tras el cambio
    };

    // Función de tu web incorporada
    const eliminar = async (id) => {
        await cocinaService.cancelar(id);
        cargarPedidos(); // Quita el pedido de la pantalla
    };

    return {
        pedidos,
        cargando,
        refrescando,
        onRefresh,
        actualizarEstado,
        eliminar
    };
};