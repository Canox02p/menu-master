import React from 'react';
// CAMBIO: Subimos 3 niveles para llegar a src
import { COLORES_RESTO } from '../../../constants/theme';

export const Header = () => {
    const tiempoActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 20px', backgroundColor: COLORES_RESTO.tarjeta,
            borderBottom: `2px solid ${COLORES_RESTO.borde}`, height: '60px', boxSizing: 'border-box'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo_sin_letras.png" alt="Logo" style={{ width: '35px', height: '35px' }} />
                <h2 style={{ color: COLORES_RESTO.cian, margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                    MENU MASTER <span style={{ color: COLORES_RESTO.blanco, fontWeight: 'normal' }}>| Cocina</span>
                </h2>
            </div>

            <div style={{ flex: 1, maxWidth: '500px', margin: '0 30px', display: 'flex', gap: '10px' }}>
                <input
                    type="text" placeholder="Buscar..."
                    style={{ flex: 1, padding: '8px 15px', borderRadius: '6px', border: 'none', backgroundColor: COLORES_RESTO.fondo, color: 'white' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: COLORES_RESTO.grisTexto }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>🕒 {tiempoActual}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: `1px solid ${COLORES_RESTO.borde}`, paddingLeft: '20px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden' }}>
                        <img src="https://via.placeholder.com/32" alt="Chef" />
                    </div>
                    <span style={{ fontSize: '0.9rem' }}>Chef Deni</span>
                </div>
            </div>
        </div>
    );
};