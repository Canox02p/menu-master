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

export default function Sidebar({ vistaActiva, setVistaActiva }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo-container">
                <img src="/logo_sin_letras.png" alt="Logo" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${vistaActiva === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('dashboard')}
                >
                    <LayoutDashboard size={20} className="nav-icon" />
                    <span>DASHBOARD</span>
                </button>

                <button
                    className={`nav-item ${vistaActiva === 'menu' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('menu')}
                >
                    <MenuSquare size={20} className="nav-icon" />
                    <span>MENU</span>
                </button>

                {/* BOTÓN DE MESAS FUNCIONAL */}
                <button
                    className={`nav-item ${vistaActiva === 'mesas' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('mesas')}
                >
                    <Table size={20} className="nav-icon" />
                    <span>MESAS</span>
                </button>

                <button
                    className={`nav-item ${vistaActiva === 'inventario' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('inventario')}
                >
                    <ShoppingBag size={20} className="nav-icon" />
                    <span>INVENTORY</span>
                </button>

                <button
                    className={`nav-item ${vistaActiva === 'reportes' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('reportes')}
                >
                    <BarChart3 size={20} className="nav-icon" />
                    <span>REPORTS</span>
                </button>

                <button
                    className={`nav-item ${vistaActiva === 'personal' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('personal')}
                >
                    <Users size={20} className="nav-icon" />
                    <span>STAFF</span>
                </button>

                {/* 🔥 BOTÓN DE CONFIGURACIÓN CORREGIDO */}
                <button
                    className={`nav-item ${vistaActiva === 'settings' ? 'active' : ''}`}
                    onClick={() => setVistaActiva('settings')}
                >
                    <Settings size={20} className="nav-icon" />
                    <span>SETTINGS</span>
                </button>
            </nav>
        </aside>
    );
}