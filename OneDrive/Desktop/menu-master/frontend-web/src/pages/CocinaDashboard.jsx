import React, { useState, useEffect } from 'react';
import { usePedidosCocina } from '../features/cocina/hooks/usePedidosCocina';
import PedidoCard from '../features/cocina/components/PedidoCard';
import ChefHeader from '../features/cocina/components/ChefHeader';
import ChefSettingsModal from '../features/cocina/components/ChefSettingsModal';
import '../features/cocina/styles/CocinaDashboard.css';


export default function CocinaDashboard() {
    const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

    const [isSettingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        const colorIdGuardado = localStorage.getItem('chef_color') || 'cian';
        const colores = {
            'cian': '#4DD0E1',
            'verde': '#48BB78',
            'naranja': '#ED8936',
            'rojo': '#F56565'
        };
        const colorHex = colores[colorIdGuardado] || '#4DD0E1';

        const wrapper = document.getElementById('chef-dashboard-wrapper');
        if (wrapper) {
            wrapper.style.setProperty('--color-primario-chef', colorHex);
        }
    }, []);

    const enCocina = pedidos.filter(p => p.estado === 'EN_COCINA' || p.estado === 'PENDIENTE');
    const enProceso = pedidos.filter(p => p.estado === 'EN_PROCESO' || p.estado === 'PREPARANDO');

    const handleLogout = () => { window.location.href = '/'; };

    return (
        <div id="chef-dashboard-wrapper" className="cocina-dashboard-layout">

            {/* ENCABEZADO: Es vital pasar onOpenSettings */}
            <ChefHeader
                onLogout={handleLogout}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            {
                pedidos.length > 0 ? (
                    <main className="pedidos-grid">
                        <section className="columna-pedidos">
                            <div className="columna-header" style={{ backgroundColor: 'var(--color-primario-chef)' }}>
                                <h3>EN ESPERA ({enCocina.length})</h3>
                            </div>
                            <div className="columna-body">
                                {enCocina.map(p => (
                                    <PedidoCard key={p._id} pedido={p} onActualizar={actualizarEstado} onEliminar={eliminar} />
                                ))}
                            </div>
                        </section>

                        <section className="columna-pedidos">
                            <div className="columna-header" style={{ backgroundColor: '#48BB78' }}>
                                <h3>PREPARANDO... ({enProceso.length})</h3>
                            </div>
                            <div className="columna-body">
                                {enProceso.map(p => (
                                    <PedidoCard key={p._id} pedido={p} onActualizar={actualizarEstado} onEliminar={eliminar} />
                                ))}
                            </div>
                        </section>
                    </main>
                ) : (
                    <div className="no-pedidos-mensaje">
                        <p>No hay pedidos pendientes en cocina 👨‍🍳</p>
                    </div>
                )
            }
            {/* 5. MODAL: Es fundamental pasar isOpen={isSettingsOpen} */}
            <ChefSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </div >
    );
}