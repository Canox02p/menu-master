import React, { useState } from 'react';
import { usePedidosCocina } from '../hooks/usePedidosCocina';
import PedidoCard from '../components/PedidoCard';
import ChefHeader from '../components/ChefHeader';
import ChefSettingsModal from '../components/ChefSettingsModal';
import '../styles/CocinaDashboard.css';

export default function CocinaDashboard() {
    const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    const enCocina = pedidos.filter(p => p.estado === 'EN_COCINA');
    const enProceso = pedidos.filter(p => p.estado === 'EN_PROCESO');

    return (
        <div id="chef-dashboard-wrapper" className="cocina-dashboard-layout">
            <ChefHeader onOpenSettings={() => setSettingsOpen(true)} />

            {pedidos.length > 0 ? (
                <main className="pedidos-grid">
                    <div className="columna-pedidos">
                        <div className="columna-header" style={{ backgroundColor: 'var(--color-primario-chef, #4DD0E1)' }}>
                            <h3>EN ESPERA ({enCocina.length})</h3>
                        </div>
                        <div className="columna-body">
                            {enCocina.map(p => (
                                <PedidoCard key={p._id} pedido={p} onActualizar={actualizarEstado} onEliminar={eliminar} />
                            ))}
                        </div>
                    </div>

                    <div className="columna-pedidos">
                        <div className="columna-header" style={{ backgroundColor: '#48BB78' }}>
                            <h3>PREPARANDO... ({enProceso.length})</h3>
                        </div>
                        <div className="columna-body">
                            {enProceso.map(p => (
                                <PedidoCard key={p._id} pedido={p} onActualizar={actualizarEstado} onEliminar={eliminar} />
                            ))}
                        </div>
                    </div>
                </main>
            ) : (
                <div className="no-pedidos-mensaje">
                    <p>No hay pedidos pendientes en cocina 👨‍🍳</p>
                </div>
            )}

            <ChefSettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
    );
}