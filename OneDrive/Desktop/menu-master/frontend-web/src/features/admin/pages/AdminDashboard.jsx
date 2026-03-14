import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import KpiCards from '../components/KpiCards';
import ChartsSection from '../components/ChartsSection';
import RecentOrdersTable from '../components/RecentOrdersTable';
import MesasDashboard from '../pages/MesasDashboard';
import Configuracion from '../pages/Configuracion';
import { COLORES_RESTO } from "../../../constants/theme";
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    // 🔥 PRUEBA DE FUEGO: Lo forzamos a iniciar directamente en la configuración
    const [vistaActiva, setVistaActiva] = useState('settings');

    useEffect(() => {
        const colorGuardado = localStorage.getItem('admin_color') || 'cian';
        const colores = { naranja: '#ED8936', rojo: '#F56565', verde: '#48BB78', cian: '#4DD0E1', purpura: '#9F7AEA', oro: '#ECC94B' };
        const modoOscuro = JSON.parse(localStorage.getItem('admin_modoOscuro') ?? 'true');

        const adminWrapper = document.getElementById('admin-wrapper');

        if (adminWrapper) {
            adminWrapper.style.setProperty('--color-primario', colores[colorGuardado] || colores.cian);

            if (modoOscuro) {
                adminWrapper.style.backgroundColor = '#0B1014'; // Fondo oscuro
                adminWrapper.style.color = '#FFFFFF';
            } else {
                adminWrapper.style.backgroundColor = '#F7FAFC'; // Fondo claro
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
        // 🕵️‍♂️ TRUCO DETECTIVE: Esto imprimirá en la consola de tu navegador la vista actual
        console.log("React intentando abrir la vista:", vistaActiva);

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
        if (vistaActiva === 'settings') {
            return <Configuracion />;
        }

        // 🕵️‍♂️ TRUCO DETECTIVE 2: Si falla, nos dirá en pantalla qué palabra estaba esperando
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