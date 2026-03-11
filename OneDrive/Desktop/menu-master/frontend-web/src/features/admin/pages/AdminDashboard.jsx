import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import KpiCards from '../components/KpiCards';
import ChartsSection from '../components/ChartsSection';
import RecentOrdersTable from '../components/RecentOrdersTable';
import { COLORES_RESTO } from '../../constants/theme'; // Asegúrate de que la ruta sea correcta
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    const themeStyle = {
        '--color-primary': COLORES_RESTO.cian,
        '--bg-card': COLORES_RESTO.tarjeta,
        '--color-text-muted': COLORES_RESTO.grisTexto,
        '--border-color': COLORES_RESTO.borde,
        '--color-success': COLORES_RESTO.verde,
        '--bg-main': COLORES_RESTO.fondo
    };

    return (
        <div className="admin-layout" style={themeStyle}>
            <Sidebar />

            <main className="admin-main-content">
                <AdminHeader />

                <div className="dashboard-scroll-area">
                    <KpiCards />
                    <ChartsSection />
                    <RecentOrdersTable />
                </div>
            </main>
        </div>
    );
}