import React from 'react';
import {
    LayoutDashboard,
    MenuSquare,
    ShoppingBag,
    Users,
    Settings,
    Table,
    BarChart3
} from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo-container">
                <img src="/logo_sin_letras.png" alt="Logo" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <a href="#dashboard" className="nav-item active">
                    <LayoutDashboard size={20} className="nav-icon" />
                    <span>DASHBOARD</span>
                </a>

                <a href="#menu" className="nav-item">
                    <MenuSquare size={20} className="nav-icon" />
                    <span>MENU</span>
                </a>

                <a href="#mesas" className="nav-item">
                    <Table size={20} className="nav-icon" />
                    <span>MESAS</span>
                </a>

                <a href="#inventario" className="nav-item">
                    <ShoppingBag size={20} className="nav-icon" />
                    <span>INVENTORY</span>
                </a>

                {/* SECCIÓN ACTUALIZADA: INFORMES DE VENTAS */}
                <a href="#reportes" className="nav-item">
                    <BarChart3 size={20} className="nav-icon" />
                    <span>REPORTS</span>
                </a>

                <a href="#personal" className="nav-item">
                    <Users size={20} className="nav-icon" />
                    <span>STAFF</span>
                </a>

                <a href="#configuraciones" className="nav-item">
                    <Settings size={20} className="nav-icon" />
                    <span>SETTINGS</span>
                </a>
            </nav>
        </aside>
    );
}