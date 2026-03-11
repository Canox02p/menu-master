import React from 'react';
import { COLORES_RESTO } from '../../../constants/theme';

export default function KpiCards() {
    const themeStyle = {
        '--color-primary': COLORES_RESTO.cian,
        '--bg-card': COLORES_RESTO.tarjeta,
        '--color-text-muted': COLORES_RESTO.grisTexto,
        '--border-color': COLORES_RESTO.borde,
        '--color-text-main': '#FFFFFF'
    };

    return (
        <div className="kpi-grid" style={themeStyle}>
            <div className="kpi-card">
                <div className="kpi-header">
                    <h4>VENTAS HOY</h4>
                    <span className="badge-green">+165</span>
                </div>
                {/* Asegúrate de que tu CSS use var(--color-primary) para estos h2 */}
                <h2>$12,850.00 <span className="currency">MXN</span></h2>
            </div>

            <div className="kpi-card">
                <div className="kpi-header">
                    <h4>PEDIDOS ACTIVOS</h4>
                </div>
                <h2>2</h2>
            </div>

            <div className="kpi-card">
                <div className="kpi-header">
                    <h4>INGRESOS MES</h4>
                </div>
                <h2>$450,900.00 <span className="currency">MXN</span></h2>
            </div>

            <div className="kpi-card crack-card">
                <div className="kpi-header">
                    <h4>PLATILLO CRACK</h4>
                </div>
                <div className="crack-content">
                    <div>
                        <h2>Copa de helado</h2>
                        <span className="star-icon">⭐</span>
                    </div>
                    <span className="icecream-icon">🍨</span>
                </div>
            </div>
        </div>
    );
}