import React from 'react';
import './../styles/Reportes.css';

const KpiCard = ({ titulo, valor, cambio, esPositivo, esMoneda = false }) => {
    const valorFormateado = esMoneda ? `$${valor.toLocaleString('es-MX')}` : valor.toLocaleString('es-MX');
    const cambioFormateado = `${esPositivo ? '+' : '-'}${cambio}%`;

    return (
        <div className="kpi-card">
            <h3>{titulo}</h3>
            <div className="value">
                {valorFormateado}
                <span className={`change ${esPositivo ? 'positive' : 'negative'}`}>
                    {cambioFormateado}
                </span>
            </div>
        </div>
    );
};

export default function Reportes() {
    // Datos mock para los KPIs
    const kpiData = {
        ventasTotales: { valor: 45230, cambio: 12.5, esPositivo: true },
        pedidosDia: { valor: 178, cambio: 3, esPositivo: true },
        ticketPromedio: { valor: 254.10, cambio: 1.2, esPositivo: false },
        satisfaccionCliente: { valor: 4.8, cambio: 0.1, esPositivo: true },
    };

    return (
        <div className="reportes-layout">
            <div className="reportes-header">
                <h1>Reportes y Analíticas</h1>
                <p>Visualiza el rendimiento de tu negocio con estos indicadores clave.</p>
            </div>

            <div className="kpi-grid">
                <KpiCard 
                    titulo="Ventas Totales (Mes)" 
                    valor={kpiData.ventasTotales.valor} 
                    cambio={kpiData.ventasTotales.cambio} 
                    esPositivo={kpiData.ventasTotales.esPositivo} 
                    esMoneda
                />
                <KpiCard 
                    titulo="Pedidos del Día" 
                    valor={kpiData.pedidosDia.valor} 
                    cambio={kpiData.pedidosDia.cambio} 
                    esPositivo={kpiData.pedidosDia.esPositivo} 
                />
                <KpiCard 
                    titulo="Ticket Promedio" 
                    valor={kpiData.ticketPromedio.valor} 
                    cambio={kpiData.ticketPromedio.cambio} 
                    esPositivo={kpiData.ticketPromedio.esPositivo} 
                    esMoneda
                />
                <KpiCard 
                    titulo="Satisfacción del Cliente" 
                    valor={kpiData.satisfaccionCliente.valor} 
                    cambio={kpiData.satisfaccionCliente.cambio} 
                    esPositivo={kpiData.satisfaccionCliente.esPositivo} 
                />
            </div>

            <div className="charts-container">
                <p>Próximamente: Gráficos de tendencias de ventas y productos más populares.</p>
            </div>
        </div>
    );
}
