import React, { useState } from 'react';
import { usePedidosCocina } from '../features/cocina/hooks/usePedidosCocina';
import PedidoCard from '../features/cocina/components/PedidoCard';
import ChefHeader from '../features/cocina/components/ChefHeader';
import ChefSettingsModal from '../features/cocina/components/ChefSettingsModal';
import '../features/cocina/styles/CocinaDashboard.css'; // Asegúrate de crear este archivo

export default function CocinaDashboard() {
    const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    const enCocina = pedidos.filter(p => p.estado === 'EN_COCINA');
    const enProceso = pedidos.filter(p => p.estado === 'EN_PROCESO');

    return (
        <div id="chef-dashboard-wrapper" className="cocina-dashboard-layout">
            {/* El Header ahora puede abrir el modal de configuración */}
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

            {/* El modal se renderiza aquí */}
            <ChefSettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
    );
}
