import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { ENDPOINTS } from '../core/api';

export const usePedidoMesa = (mesa, onClose) => {
    const [productos, setProductos] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState('Todo');
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);

    // 1. OBTENER MENÚ
    const cargarMenu = async () => {
        try {
            const respuesta = await fetch(ENDPOINTS.productos);
            const datos = await respuesta.json();
            if (Array.isArray(datos)) {
                setProductos(datos.map(p => ({ ...p, precio: parseFloat(p.precio) || 0 })));
            } else {
                setProductos([]);
            }
        } catch (error) {
            Alert.alert("Error de Conexión", error.message);
            setProductos([]);
        }
    };

    // 2. CATEGORÍAS Y FILTROS
    const productosSeguros = Array.isArray(productos) ? productos : [];
    const categoriasDinamicas = ['Todo', ...new Set(productosSeguros.map(p => p.categoria).filter(Boolean))];

    const productosFiltrados = productosSeguros.filter(p => {
        const coincideCategoria = categoriaActiva === 'Todo' || p.categoria === categoriaActiva;
        const coincideTexto = (p.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
        return coincideCategoria && coincideTexto;
    });

    // 3. MANEJO DEL CARRITO
    const agregarAlCarrito = (prod) => {
        const existe = carrito.find(item => item.id === prod.id);
        if (existe) {
            setCarrito(carrito.map(item => item.id === prod.id ? { ...item, cant: item.cant + 1 } : item));
        } else {
            setCarrito([...carrito, { ...prod, cant: 1 }]);
        }
    };

    const quitarDelCarrito = (prod) => {
        const existe = carrito.find(item => item.id === prod.id);
        if (existe.cant === 1) {
            setCarrito(carrito.filter(item => item.id !== prod.id));
        } else {
            setCarrito(carrito.map(item => item.id === prod.id ? { ...item, cant: item.cant - 1 } : item));
        }
    };

    const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cant), 0);

    // 4. ENVÍO AL BACKEND
    const enviarPedido = async () => {
        if (carrito.length === 0) return;
        setCargando(true);

        try {
            const pedidoAEnviar = {
                id_mesa: mesa?._id || "65e123456789abcdef000001",
                id_mesero: "65e123456789abcdef000000",
                estado: "EN_COCINA",
                productos: carrito.map(item => ({
                    id_producto: item.id, nombre: item.nombre, precio_unitario: item.precio,
                    cantidad: item.cant, subtotal: item.precio * item.cant, estado: "ACTIVO"
                })),
                total: totalCarrito, permite_division: true
            };

            const respuesta = await fetch(ENDPOINTS.pedidos, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoAEnviar)
            });

            if (!respuesta.ok) throw new Error('Error al procesar el pedido');

            Alert.alert("¡Éxito!", `Orden enviada a cocina.`);
            setCarrito([]);
            setBusqueda('');
            onClose();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setCargando(false);
        }
    };

    return {
        busqueda, setBusqueda, categoriaActiva, setCategoriaActiva,
        categoriasDinamicas, productosFiltrados, carrito, cargando, totalCarrito,
        agregarAlCarrito, quitarDelCarrito, enviarPedido, cargarMenu
    };
};