import React, { useMemo } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import '../styles/Inventario.css';

// Este componente ya existe y lo podemos reutilizar para la tabla.
// Sin embargo, para no crear una dependencia directa, lo redefinimos aquí.
const StockIndicator = ({ stock }) => {
    const stockStatus = stock > 20 ? 'high' : stock > 10 ? 'medium' : 'low';
    const statusMap = {
        high: { className: 'stock-high', label: 'Alto' },
        medium: { className: 'stock-medium', label: 'Medio' },
        low: { className: 'stock-low', label: 'Bajo' },
    };
    const currentStatus = statusMap[stockStatus];

    return (
        <span className={`stock-indicator ${currentStatus.className}`}>
            {currentStatus.label}
        </span>
    );
};

export default function Inventario() {
    const { categorias, getProductosPorCategoria } = useMenuData();

    // Unimos todos los productos de todas las categorías en una sola lista
    const todosLosProductos = useMemo(() => {
        return categorias.flatMap(cat => getProductosPorCategoria(cat.id));
    }, [categorias, getProductosPorCategoria]);

    // Calculamos las métricas para las tarjetas de resumen
    const summary = useMemo(() => {
        const totalProductos = todosLosProductos.length;
        const conStockBajo = todosLosProductos.filter(p => p.stock <= 10).length;
        const sinStock = todosLosProductos.filter(p => p.stock === 0).length;
        return { totalProductos, conStockBajo, sinStock };
    }, [todosLosProductos]);

    return (
        <div className="inventario-layout">
            <div className="inventario-header">
                <h1>Control de Inventario</h1>
                <p>Supervisa el stock de todos tus productos en un solo lugar.</p>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="summary-cards">
                <div className="summary-card">
                    <h3>Total de Productos</h3>
                    <div className="value">{summary.totalProductos}</div>
                </div>
                <div className="summary-card">
                    <h3>Con Stock Bajo (≤10)</h3>
                    <div className="value low-stock">{summary.conStockBajo}</div>
                </div>
                <div className="summary-card">
                    <h3>Agotados</h3>
                    <div className="value low-stock">{summary.sinStock}</div>
                </div>
            </div>

            {/* Tabla de Productos */}
            <div className="inventario-table-container">
                <table className="inventario-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock Actual</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todosLosProductos.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.nombre}</td>
                                <td>{producto.stock} unidades</td>
                                <td><StockIndicator stock={producto.stock} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
