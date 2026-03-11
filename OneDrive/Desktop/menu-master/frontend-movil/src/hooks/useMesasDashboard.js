import { useState, useEffect } from 'react';
import { Alert } from 'react-native'; // O importalo de tu librería web si esto es React Web
import { ENDPOINTS } from '../core/api';

export const useMesasDashboard = () => {
    const [mesas, setMesas] = useState([]);
    const [pedidosRecientes, setPedidosRecientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            // 🚀 Hacemos las dos peticiones en paralelo para mayor velocidad
            const [resMesas, resPedidos] = await Promise.all([
                fetch(ENDPOINTS.mesas),
                fetch(ENDPOINTS.pedidos) // Asumiendo que este endpoint trae el historial
            ]);

            const dataMesas = await resMesas.json();
            const dataPedidos = await resPedidos.json();

            // 🛡️ Blindaje de datos
            setMesas(Array.isArray(dataMesas) ? dataMesas : []);

            // Si el backend te devuelve un objeto con "pedidos", ajústalo. Si es un array directo, déjalo así.
            const listaPedidos = Array.isArray(dataPedidos) ? dataPedidos : (dataPedidos.pedidos || []);

            // Tomamos solo los últimos 5 pedidos para la tabla de "Recientes"
            setPedidosRecientes(listaPedidos.slice(0, 5));

        } catch (error) {
            console.error("Error cargando dashboard:", error);
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor para traer las mesas.");
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