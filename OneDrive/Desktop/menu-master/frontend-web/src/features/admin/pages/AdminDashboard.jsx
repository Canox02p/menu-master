import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import KpiCards from '../components/KpiCards';
import ChartsSection from '../components/ChartsSection';
import RecentOrdersTable from '../components/RecentOrdersTable';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
    return (
        <div className="admin-layout">
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