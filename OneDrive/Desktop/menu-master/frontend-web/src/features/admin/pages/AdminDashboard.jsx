import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import KpiCards from '../components/KpiCards';
import ChartsSection from '../components/ChartsSection';
import RecentOrdersTable from '../components/RecentOrdersTable';
import MesasDashboard from '../pages/MesasDashboard';
import { COLORES_RESTO } from "../../../constants/theme";
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    const [vistaActiva, setVistaActiva] = useState('dashboard');

    const themeStyle = {
        '--color-primary': COLORES_RESTO.cian,
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

        return <h2>Vista en construcción...</h2>;
    };

    return (
        <div className="admin-layout" style={themeStyle}>
            {/* Pasamos el estado y la función al Sidebar para que actualice la vista */}
            <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

            <main className="admin-main-content">
                <AdminHeader />

                <div className="dashboard-scroll-area">
                    {/* El contenido cambia dinámicamente según el click en el Sidebar */}
                    {renderizarContenido()}
                </div>
            </main>
        </div>
    );
}