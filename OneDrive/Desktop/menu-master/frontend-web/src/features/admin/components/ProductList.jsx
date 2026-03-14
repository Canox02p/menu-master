import React from 'react';
import './ProductList.css';

const ProductRow = ({ producto }) => {
    const stockStatus = producto.stock > 20 ? 'high' : producto.stock > 10 ? 'medium' : 'low';
    return (
        <tr className="product-row">
            <td>{producto.nombre}</td>
            <td>${producto.precio.toFixed(2)}</td>
            <td>
                <span className={`stock-indicator stock-${stockStatus}`}>
                    {producto.stock} en stock
                </span>
            </td>
            <td className="product-actions">
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Eliminar</button>
            </td>
        </tr>
    );
};

export default function ProductList({ categoria, productos, onBack }) {
    return (
        <div className="product-list-layout">
            <div className="product-list-header">
                <button onClick={onBack} className="btn-back">
                    &larr; Volver a Categorías
                </button>
                <h1>{categoria.nombre}</h1>
                <p>Gestiona los productos de esta categoría.</p>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map(p => <ProductRow key={p.id} producto={p} />)
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-products">
                                    No hay productos en esta categoría.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
