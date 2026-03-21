import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import ProductList from '../components/ProductList';
import '../styles/Menu.css';

const CategoriaCard = ({ categoria, onSelect }) => {
    return (
        <div className="categoria-card" onClick={() => onSelect(categoria)}>
            <h3>{categoria.nombre}</h3>
            <p>{categoria.descripcion}</p>
            <footer>
                {/* */}
                <button
                    className="btn-explorar"
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-primario)',
                        color: 'var(--color-primario)'
                    }}
                >
                    Explorar
                </button>
            </footer>
        </div>
    );
};

export default function Menu() {
    const { categorias, loading, getProductosPorCategoria, recargar } = useMenuData();
    const [vistaActual, setVistaActual] = useState('categorias');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const handleSelectCategoria = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setVistaActual('productos');
    };

    const handleBackToCategorias = () => {
        setVistaActual('categorias');
        setCategoriaSeleccionada(null);
    };

    if (vistaActual === 'productos') {
        const productos = getProductosPorCategoria(categoriaSeleccionada.id);
        return (
            <ProductList
                categoria={categoriaSeleccionada}
                productos={productos}
                onBack={handleBackToCategorias}
                recargar={recargar}
            />
        );
    }

    return (
        <div className="menu-layout">
            <div className="menu-header">
                <h1>Gestión de Menú</h1>
                <p>Organiza tus productos por categorías para un fácil acceso.</p>
            </div>

            {loading ? (
                <p style={{ color: 'var(--color-primario)' }}>Cargando categorías...</p>
            ) : (
                <div className="categorias-grid">
                    {categorias.map(cat => (
                        <CategoriaCard key={cat.id} categoria={cat} onSelect={handleSelectCategoria} />
                    ))}
                </div>
            )}
        </div>
    );
}