import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import KpiCards from '../components/KpiCards';
import ChartsSection from '../components/ChartsSection';
import RecentOrdersTable from '../components/RecentOrdersTable';
import MesasDashboard from '../pages/MesasDashboard';
import Configuracion from '../pages/Configuracion';
import Menu from '../pages/Menu';
import Inventario from '../pages/Inventario';
import Reportes from '../pages/Reportes';
import Personal from '../pages/Personal'; // Importamos el nuevo componente
import { COLORES_RESTO } from "../../../constants/theme";
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    const [vistaActiva, setVistaActiva] = useState('dashboard');

    useEffect(() => {
        const colorGuardado = localStorage.getItem('admin_color') || 'cian';
        const colores = { naranja: '#ED8936', rojo: '#F56565', verde: '#48BB78', cian: '#4DD0E1', purpura: '#9F7AEA', oro: '#ECC94B' };
        const modoOscuro = JSON.parse(localStorage.getItem('admin_modoOscuro') ?? 'true');

        const adminWrapper = document.getElementById('admin-wrapper');

        if (adminWrapper) {
            adminWrapper.style.setProperty('--color-primario', colores[colorGuardado] || colores.cian);

            if (modoOscuro) {
                adminWrapper.style.backgroundColor = '#0B1014';
                adminWrapper.style.color = '#FFFFFF';
            } else {
                adminWrapper.style.backgroundColor = '#F7FAFC';
                adminWrapper.style.color = '#1A202C';
            }
        }
    }, []);

    const themeStyle = {
        '--color-primary': 'var(--color-primario, #4DD0E1)',
        '--bg-card': COLORES_RESTO.tarjeta,
        '--color-text-muted': COLORES_RESTO.grisTexto,
        '--border-color': COLORES_RESTO.borde,
        '--color-success': COLORES_RESTO.verde,
        '--bg-main': COLORES_RESTO.fondo
    };

    const renderizarContenido = () => {
        if (vistaActiva === 'dashboard') {
            return (
                <>
                    <KpiCards />
                    <ChartsSection />
                    <RecentOrdersTable />
                </>
            );
        }
        if (vistaActiva === 'mesas') {
            return <MesasDashboard />;
        }
        if (vistaActiva === 'menu') {
            return <Menu />;
        }
        if (vistaActiva === 'inventario') {
            return <Inventario />;
        }
        if (vistaActiva === 'reportes') {
            return <Reportes />;
        }
        if (vistaActiva === 'personal') { // <-- ¡AQUÍ ESTÁ LA MAGIA!
            return <Personal />;
        }
        if (vistaActiva === 'settings') {
            return <Configuracion />;
        }

        return (
            <h2 style={{ color: 'var(--color-primario)', padding: '20px' }}>
                Vista en construcción... (React leyó: "{vistaActiva}")
            </h2>
        );
    };

    return (
        <div id="admin-wrapper" className="admin-layout" style={themeStyle}>
            <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

            <main className="admin-main-content">
                <AdminHeader />

                <div className="dashboard-scroll-area">
                    {renderizarContenido()}
                </div>
            </main>
        </div>
    );
}
