// src/lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://menu-master-api.onrender.com';

// Función auxiliar para obtener headers con token
const getHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const api = {
    // --- AUTENTICACIÓN ---
    auth: {
        login: async (email: string, password_hash: string) => {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: password_hash }),
            });
            if (!res.ok) throw new Error('Credenciales incorrectas');
            return res.json();
        },
    },

    // --- MÓDULO DE MESAS (MongoDB) ---
    mesas: {
        getAll: async () => {
            const res = await fetch(`${BASE_URL}/mesas`, { headers: await getHeaders() });
            return res.json();
        },
        updateEstado: async (id: string, estado: 'LIBRE' | 'OCUPADA' | 'RESERVADA') => {
            const res = await fetch(`${BASE_URL}/mesas/${id}/estado`, {
                method: 'PATCH',
                headers: await getHeaders(),
                body: JSON.stringify({ estado }),
            });
            return res.json();
        },
    },

    // --- MÓDULO DE PEDIDOS (Operativa Híbrida) ---
    pedidos: {
        crear: async (data: object) => {
            const res = await fetch(`${BASE_URL}/pedidos`, {
                method: 'POST',
                headers: await getHeaders(),
                body: JSON.stringify(data),
            });
            return res.json();
        },
        getCocina: async () => {
            const res = await fetch(`${BASE_URL}/pedidos/cocina`, { headers: await getHeaders() });
            return res.json();
        },
        getActivos: async () => {
            const res = await fetch(`${BASE_URL}/pedidos/activos`, { headers: await getHeaders() });
            return res.json();
        },
        updateEstado: async (id: string, estado: string) => {
            const res = await fetch(`${BASE_URL}/pedidos/${id}/estado`, {
                method: 'PATCH',
                headers: await getHeaders(),
                body: JSON.stringify({ estado }),
            });
            return res.json();
        },
    },

    // --- MÓDULO DE VENTAS (MongoDB) ---
    ventas: {
        crear: async (data: object) => {
            const res = await fetch(`${BASE_URL}/ventas`, {
                method: 'POST',
                headers: await getHeaders(),
                body: JSON.stringify(data),
            });
            return res.json();
        },
    },

    // --- MÓDULO DE INVENTARIO (MySQL via PHP) ---
    productos: {
        getAll: async () => {
            const res = await fetch(`${BASE_URL}/productos`, { headers: await getHeaders() });
            return res.json();
        },

        // MODIFICADO: Ahora extrae el producto correcto del arreglo general
        getById: async (id: string) => {
            const res = await fetch(`${BASE_URL}/productos`, { headers: await getHeaders() });
            if (!res.ok) throw new Error(`Error de conexión al buscar producto`);
            const todosLosProductos = await res.json();
            const producto = todosLosProductos.find((p: any) => String(p.id) === String(id) || String(p.id_producto) === String(id));
            if (!producto) throw new Error(`No se encontró el producto con ID ${id}`);
            return producto;
        },

        create: async (data: object) => {
            const res = await fetch(`${BASE_URL}/productos`, {
                method: 'POST',
                headers: await getHeaders(),
                body: JSON.stringify(data),
            });
            return res.json();
        },
        update: async (id: string, data: object) => {
            const res = await fetch(`${BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: await getHeaders(),
                body: JSON.stringify(data),
            });
            return res.json();
        },
        delete: async (id: string) => {
            const res = await fetch(`${BASE_URL}/productos/${id}`, {
                method: 'DELETE',
                headers: await getHeaders()
            });
            return res.json();
        },

        // MODIFICADO: Versión súper optimizada que descarga el catálogo 1 sola vez por orden
        descontarInventarioPorPedido: async (itemsPedido: { id_producto: string; cantidad: number }[]) => {
            try {
                // 1. Descargar catálogo completo una sola vez
                const res = await fetch(`${BASE_URL}/productos`, { headers: await getHeaders() });
                const todosLosProductos = await res.json();

                // 2. Procesar todos los descuentos en paralelo
                await Promise.all(
                    itemsPedido.map(async (pedidoItem) => {
                        // Buscar el producto en el catálogo descargado
                        const productoActual = todosLosProductos.find((p: any) =>
                            String(p.id) === String(pedidoItem.id_producto) ||
                            String(p.id_producto) === String(pedidoItem.id_producto)
                        );

                        if (!productoActual) {
                            console.warn(`Producto ${pedidoItem.id_producto} no encontrado para descontar`);
                            return;
                        }

                        // Calcular el nuevo stock evitando números negativos
                        const nuevoStock = Math.max(0, (Number(productoActual.stock) || 0) - pedidoItem.cantidad);

                        // Enviar la actualización completa a PHP
                        await api.productos.update(pedidoItem.id_producto, {
                            nombre: productoActual.nombre,
                            descripcion: productoActual.descripcion || '',
                            precio: productoActual.precio,
                            stock: nuevoStock,
                            id_categoria: productoActual.id_categoria
                        });
                    })
                );
            } catch (error) {
                console.error("Error global al intentar descontar el inventario:", error);
            }
        }
    },

    // --- ADMINISTRACIÓN Y USUARIOS ---
    stats: {
        getCompleto: async () => {
            const res = await fetch(`${BASE_URL}/admin/stats-completo`, { headers: await getHeaders() });
            return res.json();
        },
    },
    usuarios: {
        getAll: async () => {
            const res = await fetch(`${BASE_URL}/usuarios`, { headers: await getHeaders() });
            return res.json();
        },
    }
};