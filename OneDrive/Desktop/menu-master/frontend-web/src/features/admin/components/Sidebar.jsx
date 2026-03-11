import React from 'react';
import {
    LayoutDashboard,
    MenuSquare,
    ShoppingBag,
    Users,
    FileText,
    Settings
} from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo-container">
                {/* Asegúrate de que la ruta al logo sea la correcta */}
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
                <a href="#inventory" className="nav-item">
                    <ShoppingBag size={20} className="nav-icon" />
                    <span>INVENTORY</span>
                </a>
                <a href="#staff" className="nav-item">
                    <Users size={20} className="nav-icon" />
                    <span>STAFF</span>
                </a>
                <a href="#reports" className="nav-item">
                    <FileText size={20} className="nav-icon" />
                    <span>REPORTS</span>
                </a>
                <a href="#settings" className="nav-item">
                    <Settings size={20} className="nav-icon" />
                    <span>SETTINGS</span>
                </a>
            </nav>
        </aside>
    );
}