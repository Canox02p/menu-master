import { useState, useEffect } from 'react';

// Mock de datos para simular una API
const mockCategorias = [
    { id: 1, nombre: 'Entradas', descripcion: 'Aperitivos para abrir el apetito.' },
    { id: 2, nombre: 'Platos Fuertes', descripcion: 'Los protagonistas de la casa.' },
    { id: 3, nombre: 'Postres', descripcion: 'El toque dulce para finalizar.' },
    { id: 4, nombre: 'Bebidas', descripcion: 'Refrescos, jugos y más.' },
    { id: 5, nombre: 'Promociones', descripcion: 'Combos y ofertas especiales.' },
];

const mockProductos = {
    1: [ // Entradas
        { id: 101, nombre: 'Papas Fritas', precio: 5.99, stock: 50 },
        { id: 102, nombre: 'Aros de Cebolla', precio: 6.99, stock: 40 },
        { id: 103, nombre: 'Nachos con Queso', precio: 8.99, stock: 30 },
    ],
    2: [ // Platos Fuertes
        { id: 201, nombre: 'Hamburguesa Clásica', precio: 12.99, stock: 25 },
        { id: 202, nombre: 'Pizza Pepperoni', precio: 15.99, stock: 20 },
        { id: 203, nombre: 'Ensalada César', precio: 10.99, stock: 35 },
    ],
    3: [ // Postres
        { id: 301, nombre: 'Torta de Chocolate', precio: 7.99, stock: 15 },
        { id: 302, nombre: 'Helado de Vainilla', precio: 4.99, stock: 25 },
    ],
    4: [], // Bebidas (vacío para mostrar el caso)
    5: [ // Promociones
        { id: 501, nombre: 'Combo Hamburguesa + Papas + Bebida', precio: 18.99, stock: 100 },
    ]
};

export const useMenuData = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategorias = () => {
            try {
                // Simula la llamada a la API para categorías
                setCategorias(mockCategorias);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    // Nueva función para obtener productos por categoría
    const getProductosPorCategoria = (categoriaId) => {
        // Simula la llamada a la API para productos
        return mockProductos[categoriaId] || [];
    };

    return { categorias, loading, getProductosPorCategoria };
};
