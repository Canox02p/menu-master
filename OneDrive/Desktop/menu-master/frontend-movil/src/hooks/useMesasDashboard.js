import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { ENDPOINTS } from '../core/api';

export const useMesasDashboard = () => {
    const [mesas, setMesas] = useState([]);
    const [pedidosRecientes, setPedidosRecientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            // 🚀 Hacemos las dos peticiones con las rutas correctas
            const [resMesas, resPedidos] = await Promise.all([
                fetch(ENDPOINTS.mesas),
                fetch(ENDPOINTS.pedidosActivos) // 🔥 Usamos la nueva ruta aquí
            ]);

            const dataMesas = await resMesas.json();
            const dataPedidos = await resPedidos.json();

            // 🛡️ Blindaje de datos
            setMesas(Array.isArray(dataMesas) ? dataMesas : []);

            const listaPedidos = Array.isArray(dataPedidos) ? dataPedidos : (dataPedidos.pedidos || []);
            setPedidosRecientes(listaPedidos.slice(0, 5));

        } catch (error) {
            console.error("Error cargando dashboard:", error);
            // Si el servidor falla, mostramos esto en consola para depurar
        } finally {
            setCargando(false);
        }
    };

    // Que se ejecute automáticamente cuando la pantalla se abre
    useEffect(() => {
        cargarDatos();
    }, []);

    return {
        mesas,
        pedidosRecientes,
        cargando,
        recargarDatos: cargarDatos
    };
};