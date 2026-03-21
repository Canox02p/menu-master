import React, { useState, useEffect } from 'react';
import './../styles/Reportes.css';

const KpiCard = ({ titulo, valor, cambio, esPositivo, esMoneda = false }) => {
    const valorFormateado = esMoneda
        ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor)
        : valor.toLocaleString('es-MX');

    return (
        <div className="kpi-card" style={{ border: '1px solid #2D3748', backgroundColor: '#151C24' }}>
            <h3 style={{ color: '#8B98A5', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {titulo}
            </h3>
            <div className="value" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' }}>
                <span style={{ color: 'var(--color-primario)', fontSize: '28px', fontWeight: 'bold' }}>
                    {valorFormateado}
                </span>
                <span className={`change ${esPositivo ? 'positive' : 'negative'}`} style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {esPositivo ? '↑' : '↓'} {cambio}%
                </span>
            </div>
        </div>
    );
};

export default function Reportes() {
    const [stats, setStats] = useState({
        ventasMes: 0,
        pedidosDia: 0,
        ticketPromedio: 0,
        satisfaccion: 4.8
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnaliticas = async () => {
            try {
                const res = await fetch('http://localhost:3000/admin/stats-completo');
                const data = await res.json();

                if (data.kpis) {
                    setStats({
                        ventasMes: data.kpis.ingresosMes || 0,
                        pedidosDia: data.kpis.pedidosDia || 0,
                        ticketPromedio: data.kpis.ticketPromedio || 0,
                        satisfaccion: 4.8 // Dato estático por ahora
                    });
                }
            } catch (error) {
                console.error("Error cargando reportes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnaliticas();
    }, []);

    return (
        <div className="reportes-layout" style={{ padding: '25px' }}>
            <div className="reportes-header" style={{ marginBottom: '35px' }}>
                <h1 style={{ color: 'var(--color-primario)', fontSize: '32px', fontWeight: '800', margin: 0 }}>
                    Reportes y Analíticas
                </h1>
                <p style={{ color: '#8B98A5', marginTop: '5px' }}>
                    Indicadores clave de rendimiento basados en ventas reales.
                </p>
            </div>

            {loading ? (
                <div style={{ color: 'var(--color-primario)', textAlign: 'center', padding: '50px' }}>
                    Cargando analíticas del servidor...
                </div>
            ) : (
                <>
                    <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                        <KpiCard
                            titulo="Ventas Totales (Mes)"
                            valor={stats.ventasMes}
                            cambio={12.5}
                            esPositivo={true}
                            esMoneda
                        />
                        <KpiCard
                            titulo="Pedidos Realizados Hoy"
                            valor={stats.pedidosDia}
                            cambio={3.0}
                            esPositivo={true}
                        />
                        <KpiCard
                            titulo="Ticket Promedio"
                            valor={stats.ticketPromedio}
                            cambio={1.2}
                            esPositivo={false}
                            esMoneda
                        />
                        <KpiCard
                            titulo="Satisfacción del Cliente"
                            valor={stats.satisfaccion}
                            cambio={0.1}
                            esPositivo={true}
                        />
                    </div>

                    {/* Área de Gráficos (Próximamente) */}
                    <div className="charts-placeholder" style={{
                        marginTop: '40px',
                        padding: '60px',
                        borderRadius: '20px',
                        backgroundColor: '#11171D',
                        border: '1px dashed #2D3748',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>📈</div>
                        <h2 style={{ color: '#FFF', margin: '0 0 10px 0' }}>Gráficos de Tendencia</h2>
                        <p style={{ color: '#8B98A5', maxWidth: '400px', margin: '0 auto' }}>
                            Estamos procesando los datos históricos para mostrarte comparativas de ventas por hora y los productos más populares.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}