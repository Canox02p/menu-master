import { useState, useEffect, useCallback } from 'react';

export const useMenuData = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventario = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/productos');
            const data = await res.json();
            setProductos(data);
            const categoriasUnicas = new Map();
            data.forEach(prod => {
                const catNombre = prod.categoria || 'Sin Categoría';

                if (!categoriasUnicas.has(catNombre)) {
                    categoriasUnicas.set(catNombre, {
                        id: catNombre,
                        nombre: catNombre,
                        descripcion: `Explora los productos de ${catNombre.toLowerCase()}.`
                    });
                }
            });

            setCategorias(Array.from(categoriasUnicas.values()));

        } catch (error) {
            console.error('Error al cargar los productos de la base de datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventario();
    }, []);

    const getProductosPorCategoria = useCallback((categoriaId) => {
        return productos.filter(p => (p.categoria || 'Sin Categoría') === categoriaId);
    }, [productos]);

    return {
        categorias,
        loading,
        getProductosPorCategoria,
        recargar: fetchInventario
    };
};