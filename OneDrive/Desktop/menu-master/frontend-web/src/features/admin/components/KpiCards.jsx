import React from 'react';

export default function KpiCards() {
    return (
        <div className="kpi-grid">
            <div className="kpi-card">
                <div className="kpi-header">
                    <h4>VENTAS HOY</h4>
                    <span className="badge-green">+165</span>
                </div>
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