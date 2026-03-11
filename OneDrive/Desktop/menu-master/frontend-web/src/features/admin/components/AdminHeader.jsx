import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, CheckCircle2, Settings, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';
import './AdminHeader.css';

export default function AdminHeader({ onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        if (onLogout) onLogout();
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const themeStyle = {
        '--color-primary': COLORES_RESTO.cian,
        '--bg-header': 'transparent',
        '--bg-card': COLORES_RESTO.tarjeta,
        '--color-danger': COLORES_RESTO.rojo,
        '--color-text-muted': COLORES_RESTO.grisTexto,
        '--border-color': COLORES_RESTO.borde,
        '--bg-card-hover': '#2A353D',
        '--color-text-main': '#FFFFFF',
    };

    return (
        <>
            {/* Pasamos themeStyle directamente a la etiqueta header */}
            <header className="admin-header" style={themeStyle}>
                <div className="header-brand">
                    <h2>Menu <span>Master</span></h2>
                </div>

                <div className="header-actions">
                    <div className="status-indicator">
                        <CheckCircle2 size={16} className="text-green" />
                        <span className="status-text">Real time update (online)</span>
                    </div>

                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search" />
                    </div>

                    <div className="profile-container" ref={dropdownRef}>
                        <div
                            className="profile-trigger"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <button className="notification-btn">
                                <Bell size={20} />
                                <span className="notification-dot"></span>
                            </button>

                            <div className="user-info">
                                <span className="user-greeting">BIENVENIDO,</span>
                                <span className="user-role">ADMIN</span>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`}
                            />
                        </div>

                        {/* Menú Desplegable */}
                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <p>Admin User</p>
                                    <span>admin@carlosrestaurant.com</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item">
                                    <Settings size={16} />
                                    <span>Configuraciones</span>
                                </button>
                                <button className="dropdown-item text-danger" onClick={handleLogoutClick}>
                                    <LogOut size={16} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* --- MODAL DE CONFIRMACIÓN --- */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="logout-modal">
                        <div className="modal-icon-container">
                            <AlertTriangle size={32} className="warning-icon" />
                        </div>
                        <h3>¿Cerrar Sesión?</h3>
                        <p>¿Estás seguro de que deseas salir del punto de venta?</p>
                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={cancelLogout}>Cancelar</button>
                            <button className="btn-confirm" onClick={confirmLogout}>Sí, salir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}