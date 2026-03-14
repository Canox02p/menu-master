import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Moon, Sun } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';
import '../styles/Configuracion.css';

const OPCIONES_TEMA = [
    { id: 'naranja', nombre: 'Naranja Chef', hex: '#ED8936' },
    { id: 'rojo', nombre: 'Rojo Pasión', hex: '#F56565' },
    { id: 'verde', nombre: 'Verde Fresh', hex: '#48BB78' },
    { id: 'cian', nombre: 'Cian Master', hex: '#4DD0E1' },
    { id: 'purpura', nombre: 'Púrpura Lounge', hex: '#9F7AEA' },
    { id: 'oro', nombre: 'Oro Gourmet', hex: '#ECC94B' }
];

export default function Configuracion() {
    // 🧠 1. Usamos una llave específica para el Admin
    const [colorActivo, setColorActivo] = useState(() => {
        return localStorage.getItem('admin_color') || 'cian';
    });

    const [modoOscuro, setModoOscuro] = useState(() => {
        const guardado = localStorage.getItem('admin_modoOscuro');
        return guardado !== null ? JSON.parse(guardado) : true;
    });

    const [restauranteInfo, setRestauranteInfo] = useState({
        nombre: 'Menu Master POS',
        direccion: 'Av. Gastronómica 123'
    });

    // 🌟 2. Inyectamos el color SOLO en el contenedor del Admin
    useEffect(() => {
        const colorHex = OPCIONES_TEMA.find(c => c.id === colorActivo)?.hex || COLORES_RESTO.cian;

        localStorage.setItem('admin_color', colorActivo);
        localStorage.setItem('admin_modoOscuro', JSON.stringify(modoOscuro));

        // Buscamos el div principal del administrador (lo crearemos en el paso 2)
        const adminWrapper = document.getElementById('admin-wrapper');

        if (adminWrapper) {
            // Pintamos solo esa zona
            adminWrapper.style.setProperty('--color-primario', colorHex);

            if (modoOscuro) {
                adminWrapper.style.backgroundColor = '#0B1014';
                adminWrapper.style.color = '#FFFFFF';
            } else {
                adminWrapper.style.backgroundColor = '#F7FAFC';
                adminWrapper.style.color = '#1A202C';
            }
        }
    }, [colorActivo, modoOscuro]);

    const restablecerDefecto = () => {
        setColorActivo('cian');
        setModoOscuro(true);
    };

    return (
        <div className="config-layout">
            <div className="config-header">
                <h1>Configuración del Administrador</h1>
                <p>Personaliza la apariencia de tu panel de control.</p>
            </div>

            {/* 🎨 TARJETA 1: TEMAS Y COLORES */}
            <div className="config-card">
                <h3>Personalización de Tema</h3>
                <p>Elige tu color de acento principal.</p>

                <div className="theme-grid">
                    {OPCIONES_TEMA.map((color) => {
                        const isSelected = colorActivo === color.id;
                        return (
                            <button
                                key={color.id}
                                className="color-option"
                                onClick={() => setColorActivo(color.id)}
                                style={{
                                    borderColor: isSelected ? color.hex : '#2D3748',
                                    backgroundColor: isSelected ? `${color.hex}15` : 'transparent'
                                }}
                            >
                                <div className="color-left">
                                    <div className="color-circle" style={{ backgroundColor: color.hex }}></div>
                                    <span className="color-name">{color.nombre}</span>
                                </div>
                                {isSelected && <Check size={18} color={color.hex} />}
                            </button>
                        );
                    })}
                </div>

                <button className="btn-reset" onClick={restablecerDefecto}>
                    <RotateCcw size={16} />
                    Restablecer por defecto
                </button>
            </div>

            {/* 🌗 TARJETA 2: MODO CLARO / OSCURO */}
            <div className="config-card">
                <h3>Modo de Visualización</h3>
                <div className="mode-toggle-container">
                    <button className={`mode-btn ${modoOscuro ? 'active' : ''}`} onClick={() => setModoOscuro(true)}>
                        <Moon size={18} /> Modo Oscuro
                    </button>
                    <button className={`mode-btn ${!modoOscuro ? 'active' : ''}`} onClick={() => setModoOscuro(false)}>
                        <Sun size={18} /> Modo Claro
                    </button>
                </div>
            </div>

            {/* 🏢 TARJETA 3: DATOS DEL RESTAURANTE */}
            <div className="config-card">
                <h3>Información del Restaurante</h3>
                <div className="input-group">
                    <label>Nombre del Establecimiento</label>
                    <input type="text" value={restauranteInfo.nombre} onChange={(e) => setRestauranteInfo({ ...restauranteInfo, nombre: e.target.value })} />
                </div>
                <div className="input-group">
                    <label>Dirección</label>
                    <input type="text" value={restauranteInfo.direccion} onChange={(e) => setRestauranteInfo({ ...restauranteInfo, direccion: e.target.value })} />
                </div>
            </div>
        </div>
    );
}