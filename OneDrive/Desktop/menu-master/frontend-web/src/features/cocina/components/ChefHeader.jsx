import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, CheckCircle2, Settings, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';
import './ChefHeader.css';

export default function ChefHeader({ onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef(null);
    const tiempoActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Cierra el menú desplegable si haces clic fuera de él
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

    return (
        <>
            <header className="chef-header" style={{ borderBottom: `2px solid ${COLORES_RESTO.borde}` }}>
                <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src="/logo_sin_letras.png" // Reemplaza con la ruta real de tu logo
                        alt="Logo Menu Master"
                        style={{ width: '35px', height: '35px' }}
                    />
                    <h2>MENU MASTER <span style={{ color: COLORES_RESTO.cian }}>| COCINA</span></h2>
                </div>

                <div className="header-actions">
                    <div className="status-indicator">
                        <CheckCircle2 size={16} className="text-green" />
                        <span className="status-text">🕒 {tiempoActual}</span>
                    </div>

                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Buscar orden..." />
                    </div>

                    <div className="profile-container" ref={dropdownRef}>
                        <div
                            className="profile-trigger"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {/* Botón Naranja Oficial */}
                            <button className="notification-btn">
                                <Bell size={20} />
                                <span className="notification-dot"></span>
                            </button>

                            <div className="user-info">
                                <span className="user-greeting">BIENVENIDO,</span>
                                <span className="user-role">CHEF DENI</span>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`}
                            />
                        </div>

                        {/* Menú Desplegable Estilo Admin */}
                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <p>Chef Deni User</p>
                                    <span>deni@menumaster.com</span>
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
                        <p>¿Estás seguro de que deseas salir del monitor de cocina?</p>
                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                            <button className="btn-confirm" onClick={confirmLogout}>Sí, salir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}