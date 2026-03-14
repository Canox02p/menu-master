
import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import './ChefSettingsModal.css';

// Opciones de color (pueden ser las mismas o diferentes que las del admin)
const OPCIONES_TEMA_CHEF = [
    { id: 'cian', nombre: 'Azul Cocina', hex: '#4DD0E1' },
    { id: 'verde', nombre: 'Verde Pedido', hex: '#48BB78' },
    { id: 'naranja', nombre: 'Naranja Fuego', hex: '#ED8936' },
    { id: 'rojo', nombre: 'Rojo Urgente', hex: '#F56565' },
];

export default function ChefSettingsModal({ isOpen, onClose }) {
    // 🧠 Usamos una llave DIFERENTE para el color del chef: 'chef_color'
    const [colorActivo, setColorActivo] = useState(() => {
        return localStorage.getItem('chef_color') || 'cian';
    });

    // 🌟 Aplicamos el color SOLO al contenedor del Chef
    useEffect(() => {
        const colorHex = OPCIONES_TEMA_CHEF.find(c => c.id === colorActivo)?.hex || '#4DD0E1';
        localStorage.setItem('chef_color', colorActivo);

        // Buscamos el div principal de la cocina
        const chefWrapper = document.getElementById('chef-dashboard-wrapper');
        if (chefWrapper) {
            chefWrapper.style.setProperty('--color-primario-chef', colorHex);
        }
    }, [colorActivo]);

    if (!isOpen) return null;

    return (
        <div className="chef-modal-overlay">
            <div className="chef-modal-content">
                <div className="chef-modal-header">
                    <h3>Personalizar Tema de Cocina</h3>
                    <button onClick={onClose} className="btn-close-modal">
                        <X size={24} />
                    </button>
                </div>
                <p>Elige el color de acento para tu interfaz.</p>

                <div className="theme-grid-chef">
                    {OPCIONES_TEMA_CHEF.map((color) => {
                        const isSelected = colorActivo === color.id;
                        return (
                            <button
                                key={color.id}
                                className="color-option-chef"
                                onClick={() => setColorActivo(color.id)}
                                style={{
                                    borderColor: isSelected ? color.hex : '#333',
                                    backgroundColor: isSelected ? `${color.hex}20` : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="color-circle" style={{ backgroundColor: color.hex }}></div>
                                    <span className="color-name">{color.nombre}</span>
                                </div>
                                {isSelected && <Check size={20} color={color.hex} />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
