import React, { useState } from 'react';
import './ProductList.css';

export default function ProductList({ categoria, productos, onBack, recargar }) {
    const nombreCategoria = categoria?.nombre || 'Categoría';

    // --- ESTADOS PARA EL MODAL ---
    const [productoEditando, setProductoEditando] = useState(null);
    const [formEdit, setFormEdit] = useState({ nombre: '', descripcion: '', precio: 0, stock: 0 });
    const [guardando, setGuardando] = useState(false);

    const abrirModalEdicion = (producto) => {
        setProductoEditando(producto);
        setFormEdit({
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: producto.precio || 0,
            stock: producto.stock || 0
        });
    };

    const cerrarModal = () => setProductoEditando(null);

    // --- GUARDAR CAMBIOS ---
    const guardarCambios = async () => {
        setGuardando(true);
        try {
            const res = await fetch(`http://localhost:3000/productos/${productoEditando.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formEdit.nombre,
                    descripcion: formEdit.descripcion,
                    precio: Number(formEdit.precio) || 0,
                    stock: Number(formEdit.stock) || 0
                })
            });

            if (res.ok) {
                cerrarModal();
                if (typeof recargar === 'function') recargar();
                alert("¡Producto actualizado exitosamente!");
            } else {
                const errorTexto = await res.text();
                alert(`Error al guardar: ${errorTexto}`);
            }
        } catch (error) {
            alert(`Error de red: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    // --- ELIMINAR PRODUCTO ---
    const eliminarProducto = async () => {
        const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar "${productoEditando.nombre}"?\nEsta acción no se puede deshacer.`);
        if (!confirmar) return;

        setGuardando(true);
        try {
            const res = await fetch(`http://localhost:3000/productos/${productoEditando.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                cerrarModal();
                if (typeof recargar === 'function') recargar();
            } else {
                alert("No se pudo eliminar el producto.");
            }
        } catch (error) {
            alert(`Error de red: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="product-list-layout">
            <div className="product-list-header">
                <button onClick={onBack} className="btn-back" style={{ color: 'var(--color-primario)', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>
                    &larr; Volver a Categorías
                </button>
                <h1 style={{ color: 'var(--color-primario)' }}>{nombreCategoria}</h1>
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
                        {productos && productos.length > 0 ? (
                            productos.map(producto => {
                                const stockStatus = producto.stock > 20 ? 'high' : producto.stock > 10 ? 'medium' : 'low';
                                return (
                                    <tr key={producto.id} className="product-row">
                                        <td>{producto.nombre}</td>
                                        <td>${Number(producto.precio).toFixed(2)}</td>
                                        <td>
                                            <span className={`stock-indicator stock-${stockStatus}`}>
                                                {producto.stock} en stock
                                            </span>
                                        </td>
                                        <td className="product-actions">
                                            <button
                                                onClick={() => abrirModalEdicion(producto)}
                                                style={{ backgroundColor: 'transparent', color: 'var(--color-primario)', border: '1px solid var(--color-primario)', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-products" style={{ textAlign: 'center', padding: '30px', color: '#A0AEC0' }}>
                                    No hay productos en esta categoría.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL FLOTANTE DE EDICIÓN --- */}
            {productoEditando && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Editar Detalles</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    value={formEdit.nombre}
                                    onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                                    style={inputModalStyle}
                                />
                            </label>

                            <label>
                                Descripción:
                                <textarea
                                    value={formEdit.descripcion}
                                    onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                                    style={{ ...inputModalStyle, height: '80px', resize: 'none' }}
                                    placeholder="Agrega una descripción para el menú..."
                                />
                            </label>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <label style={{ flex: 1 }}>
                                    Precio ($):
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formEdit.precio}
                                        onChange={(e) => setFormEdit({ ...formEdit, precio: e.target.value })}
                                        style={inputModalStyle}
                                    />
                                </label>

                                <label style={{ flex: 1 }}>
                                    Stock:
                                    <input
                                        type="number"
                                        value={formEdit.stock}
                                        onChange={(e) => setFormEdit({ ...formEdit, stock: e.target.value })}
                                        style={inputModalStyle}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* --- BOTONES DEL MODAL --- */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={eliminarProducto} disabled={guardando} style={btnDeleteStyle}>
                                Eliminar
                            </button>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={cerrarModal} style={btnCancelStyle}>Cancelar</button>
                                <button onClick={guardarCambios} disabled={guardando} style={btnSaveStyle}>
                                    {guardando ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)'
};
const modalContentStyle = {
    backgroundColor: '#1A202C', padding: '30px', borderRadius: '12px',
    width: '450px', maxWidth: '90%', border: '1px solid #2D3748', color: '#FFF'
};
const inputModalStyle = {
    width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px',
    backgroundColor: '#0B0F13', color: '#FFF', border: '1px solid #4A5568', boxSizing: 'border-box'
};
const btnCancelStyle = {
    backgroundColor: 'transparent', color: '#A0AEC0', border: '1px solid #4A5568',
    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer'
};
const btnSaveStyle = {
    backgroundColor: 'var(--color-primario)', color: '#000', border: 'none', fontWeight: 'bold',
    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer'
};
const btnDeleteStyle = {
    backgroundColor: 'transparent', color: '#F56565', border: '1px solid #F56565',
    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};