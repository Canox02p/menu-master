import React from 'react';
import { usePedidosCocina } from '../hooks/usePedidosCocina';
import { PedidoCard } from '../components/PedidoCard';
import { Header } from '../components/Header';
import { COLORES_RESTO } from '../../../constants/theme'; // Ruta corregida

export const CocinaDashboard = () => {
    const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

    return (
        <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: COLORES_RESTO.fondo, display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div style={{
                flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', // 4 Columnas
                gridAutoRows: '1fr', gap: '15px', padding: '15px', boxSizing: 'border-box'
            }}>
                {pedidos.map(p => (
                    <PedidoCard key={p._id} pedido={p} onActualizar={actualizarEstado} onEliminar={eliminar} />
                ))}
            </div>
        </div>
    );
};