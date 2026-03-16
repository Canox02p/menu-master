import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import './ChefSettingsModal.css';

const OPCIONES_TEMA_CHEF = [
    { id: 'cian', nombre: 'Azul Cocina', hex: '#4DD0E1' },
    { id: 'verde', nombre: 'Verde Pedido', hex: '#48BB78' },
    { id: 'naranja', nombre: 'Naranja Fuego', hex: '#ED8936' },
    { id: 'rojo', nombre: 'Rojo Urgente', hex: '#F56565' },
];

export default function ChefSettingsModal({ isOpen, onClose }) {
    const [colorActivo, setColorActivo] = useState(() => {
        return localStorage.getItem('chef_color') || 'cian';
    });

    useEffect(() => {
        const tema = OPCIONES_TEMA_CHEF.find(c => c.id === colorActivo) || OPCIONES_TEMA_CHEF[0];
        localStorage.setItem('chef_color', colorActivo);

        const chefWrapper = document.getElementById('chef-dashboard-wrapper');
        if (chefWrapper) {
            chefWrapper.style.setProperty('--color-primario-chef', tema.hex);
        }
    }, [colorActivo]);

    // SI NO RECIBE LA ORDEN DE ABRIRSE, SE QUEDA OCULTO
    if (!isOpen) return null;

    return (
        <div className="chef-modal-overlay" onClick={(e) => e.target.className === 'chef-modal-overlay' && onClose()}>
            <div className="chef-modal-content">
                <div className="chef-modal-header">
                    <h3>Personalizar Tema</h3>
                    <button onClick={onClose} className="btn-close-modal"><X size={24} /></button>
                </div>

                <div className="theme-grid-chef">
                    {OPCIONES_TEMA_CHEF.map((color) => {
                        const isSelected = colorActivo === color.id;
                        return (
                            <button
                                key={color.id}
                                className="color-option-chef"
                                onClick={() => setColorActivo(color.id)}
                                style={{
                                    borderColor: isSelected ? color.hex : '#2D3748',
                                    backgroundColor: isSelected ? `${color.hex}15` : '#222933'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="color-circle" style={{ backgroundColor: color.hex }} />
                                    <span className="color-name" style={{ color: isSelected ? color.hex : '#FFF' }}>
                                        {color.nombre}
                                    </span>
                                </div>
                                {isSelected && <Check size={20} color={color.hex} />}
                            </button>
                        );
                    })}
                </div>

                <button onClick={onClose} className="btn-listo-chef">Listo</button>
            </div>
        </div>
    );
}