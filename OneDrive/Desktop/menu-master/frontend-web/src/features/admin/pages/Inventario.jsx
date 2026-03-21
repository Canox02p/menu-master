import React, { useState, useMemo } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import '../styles/Inventario.css';

const StockIndicator = ({ stock }) => {
    const stockStatus = stock > 20 ? 'high' : stock > 10 ? 'medium' : 'low';
    const statusMap = {
        high: { className: 'stock-high', label: 'Alto' },
        medium: { className: 'stock-medium', label: 'Bajo' },
        low: { className: 'stock-low', label: 'Crítico/Agotado' },
    };
    const currentStatus = statusMap[stockStatus];

    return (
        <span className={`stock-indicator ${currentStatus.className}`}>
            {currentStatus.label}
        </span>
    );
};

export default function Inventario() {
    const { categorias, getProductosPorCategoria, recargar } = useMenuData();
    const [filtroEstado, setFiltroEstado] = useState('TODOS');
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [productoEditando, setProductoEditando] = useState(null);
    const [formEdit, setFormEdit] = useState({ nombre: '', precio: 0, stock: 0 });
    const [guardando, setGuardando] = useState(false);

    const todosLosProductos = useMemo(() => {
        return categorias.flatMap(cat => getProductosPorCategoria(cat.id));
    }, [categorias, getProductosPorCategoria]);

    const summary = useMemo(() => {
        const totalProductos = todosLosProductos.length;
        const conStockBajo = todosLosProductos.filter(p => p.stock > 0 && p.stock <= 10).length;
        const sinStock = todosLosProductos.filter(p => p.stock === 0).length;
        return { totalProductos, conStockBajo, sinStock };
    }, [todosLosProductos]);

    const productosFiltrados = useMemo(() => {
        return todosLosProductos.filter(p => {
            if (filtroEstado === 'BAJO' && (p.stock === 0 || p.stock > 10)) return false;
            if (filtroEstado === 'AGOTADO' && p.stock > 0) return false;
            if (busquedaTexto && !p.nombre.toLowerCase().includes(busquedaTexto.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [todosLosProductos, filtroEstado, busquedaTexto]);

    const abrirModalEdicion = (producto) => {
        setProductoEditando(producto);
        setFormEdit({
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock
        });
    };

    const cerrarModal = () => {
        setProductoEditando(null);
    };

    const guardarCambios = async () => {
        setGuardando(true);
        try {
            console.log("Enviando actualización para el ID:", productoEditando.id);

            const res = await fetch(`http://localhost:3000/productos/${productoEditando.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formEdit.nombre,
                    precio: Number(formEdit.precio) || 0,
                    stock: Number(formEdit.stock) || 0
                })
            });

            if (res.ok) {
                cerrarModal();
                if (typeof recargar === 'function') recargar();
                alert("¡Producto actualizado exitosamente en la base de datos!");
            } else {
                const errorTexto = await res.text();
                alert(`El servidor rechazó los datos. Código: ${res.status}. Error: ${errorTexto}`);
            }
        } catch (error) {
            console.error("Error detallado de red:", error);
            alert(`Error de red: ${error.message}. ¡Asegúrate de que el backend (puerto 3000) esté encendido!`);
        } finally {
            setGuardando(false);
        }
    };

    const eliminarProducto = async () => {
        const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar "${productoEditando.nombre}"?\n\nEsta acción borrará el producto de la base de datos permanentemente.`);
        if (!confirmar) return;

        setGuardando(true);
        try {
            const res = await fetch(`http://localhost:3000/productos/${productoEditando.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                cerrarModal();
                if (typeof recargar === 'function') recargar();
                alert("🗑️ Producto eliminado exitosamente de la base de datos.");
            } else {
                const errorTexto = await res.text();
                alert(`No se pudo eliminar. Servidor dice: ${errorTexto}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert(`Error de red: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="inventario-layout">
            <div className="inventario-header">
                <h1>Control de Inventario</h1>
                <p>Supervisa, filtra y edita el stock de todos tus productos.</p>
            </div>

            {/* --- TARJETAS DE RESUMEN --- */}
            <div className="summary-cards">
                <div
                    className={`summary-card ${filtroEstado === 'TODOS' ? 'active-filter' : ''}`}
                    onClick={() => setFiltroEstado('TODOS')}
                    style={{ cursor: 'pointer', border: filtroEstado === 'TODOS' ? '1px solid var(--color-primario)' : '1px solid #2D3748' }}
                >
                    <h3>Total de Productos</h3>
                    <div className="value">{summary.totalProductos}</div>
                </div>

                <div
                    className={`summary-card ${filtroEstado === 'BAJO' ? 'active-filter' : ''}`}
                    onClick={() => setFiltroEstado('BAJO')}
                    style={{ cursor: 'pointer', border: filtroEstado === 'BAJO' ? '1px solid #F6AD55' : '1px solid #2D3748' }}
                >
                    <h3>Con Stock Bajo (1-10)</h3>
                    <div className="value" style={{ color: '#F6AD55' }}>{summary.conStockBajo}</div>
                </div>

                <div
                    className={`summary-card ${filtroEstado === 'AGOTADO' ? 'active-filter' : ''}`}
                    onClick={() => setFiltroEstado('AGOTADO')}
                    style={{ cursor: 'pointer', border: filtroEstado === 'AGOTADO' ? '1px solid #E53E3E' : '1px solid #2D3748' }}
                >
                    <h3>Agotados</h3>
                    <div className="value" style={{ color: '#E53E3E' }}>{summary.sinStock}</div>
                </div>
            </div>

            {/* --- BARRA DE BÚSQUEDA --- */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Buscar producto por nombre o letra (Ej. 'E', 'Pescado')..."
                    value={busquedaTexto}
                    onChange={(e) => setBusquedaTexto(e.target.value)}
                    style={{
                        flex: 1, padding: '12px 20px', borderRadius: '8px',
                        backgroundColor: 'var(--bg-card)', color: '#FFF',
                        border: '1px solid var(--border-color)', outline: 'none'
                    }}
                />
                {busquedaTexto && (
                    <button
                        onClick={() => setBusquedaTexto('')}
                        style={{ padding: '0 20px', backgroundColor: '#F56565', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* --- TABLA DE PRODUCTOS --- */}
            <div className="inventario-table-container">
                <table className="inventario-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Stock Actual</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map(producto => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre}</td>
                                    <td>${Number(producto.precio).toFixed(2)}</td>
                                    <td>{producto.stock} unidades</td>
                                    <td><StockIndicator stock={producto.stock} /></td>
                                    <td>
                                        <button
                                            onClick={() => abrirModalEdicion(producto)}
                                            style={{ backgroundColor: 'transparent', color: 'var(--color-primario)', border: '1px solid var(--color-primario)', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#A0AEC0' }}>
                                    No se encontraron productos con estos filtros.
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
                        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Editar Producto</h2>

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
                                Precio ($):
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formEdit.precio}
                                    onChange={(e) => setFormEdit({ ...formEdit, precio: e.target.value })}
                                    style={inputModalStyle}
                                />
                            </label>

                            <label>
                                Stock (Unidades):
                                <input
                                    type="number"
                                    value={formEdit.stock}
                                    onChange={(e) => setFormEdit({ ...formEdit, stock: e.target.value })}
                                    style={inputModalStyle}
                                />
                            </label>
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