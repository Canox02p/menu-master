// src/lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://menu-master-api.onrender.com';

// Función auxiliar para obtener headers con token (Principio de Responsabilidad Única)
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
                body: JSON.stringify({ email, password_hash }),
            });
            if (!res.ok) throw new Error('Credenciales incorrectas');
            return res.json(); // Retorna { user, token }
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
    },

    // --- MÓDULO DE INVENTARIO (MySQL via PHP) ---
    productos: {
        getAll: async () => {
            const res = await fetch(`${BASE_URL}/productos`, { headers: await getHeaders() });
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