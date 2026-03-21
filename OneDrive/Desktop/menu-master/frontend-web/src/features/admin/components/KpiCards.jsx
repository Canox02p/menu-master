import React, { useState, useEffect } from 'react';
import { COLORES_RESTO } from '../../../constants/theme';

export default function KpiCards() {
    const [stats, setStats] = useState({
        ventasHoy: 0,
        pedidosActivos: 0,
        ingresosMes: 0,
        crack: "Cargando..."
    });

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/stats-completo');
            const data = await response.json();

            if (data.kpis) {
                setStats({
                    ventasHoy: data.kpis.ventasHoy || 0,
                    pedidosActivos: data.kpis.pedidosActivos || 0,
                    ingresosMes: data.kpis.ingresosMes || 0,
                    crack: data.kpis.crack || "Sin datos"
                });
            }
        } catch (error) {
            console.error("Error al conectar con las estadísticas:", error);
        }
    };

    useEffect(() => {
        fetchStats();
        const intervalo = setInterval(fetchStats, 30000);
        return () => clearInterval(intervalo);
    }, []);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    // Estilo base para las tarjetas normales (Oscuras)
    const commonCardStyle = {
        backgroundColor: '#151C24',
        border: '1px solid #2D3748',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const colorPrimary = 'var(--color-primario, #4DD0E1)';
    const colorTextMuted = '#8B98A5';

    return (
        <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>

            {/* VENTAS HOY */}
            <div className="kpi-card" style={commonCardStyle}>
                <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: colorTextMuted, fontSize: '12px', textTransform: 'uppercase', fontWeight: '800' }}>VENTAS HOY</h4>
                    <span style={{ backgroundColor: 'rgba(72, 187, 120, 0.2)', color: '#48BB78', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Hoy</span>
                </div>
                <h2 style={{ color: colorPrimary, fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
                    {formatMoney(stats.ventasHoy)} <span style={{ fontSize: '12px', color: colorTextMuted }}>MXN</span>
                </h2>
            </div>

            {/* PEDIDOS ACTIVOS */}
            <div className="kpi-card" style={commonCardStyle}>
                <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: colorTextMuted, fontSize: '12px', textTransform: 'uppercase', fontWeight: '800' }}>PEDIDOS ACTIVOS</h4>
                </div>
                <h2 style={{ color: colorPrimary, fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{stats.pedidosActivos}</h2>
            </div>

            {/* INGRESOS MES */}
            <div className="kpi-card" style={commonCardStyle}>
                <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: colorTextMuted, fontSize: '12px', textTransform: 'uppercase', fontWeight: '800' }}>INGRESOS MES</h4>
                </div>
                <h2 style={{ color: colorPrimary, fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
                    {formatMoney(stats.ingresosMes)} <span style={{ fontSize: '12px', color: colorTextMuted }}>MXN</span>
                </h2>
            </div>

            {/* PLATILLO CRACK (Tarjeta Destacada) */}
            <div className="kpi-card crack-card" style={{
                backgroundColor: colorPrimary, // Fondo igual al color del tema
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: 'none',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}>
                <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#000', fontSize: '12px', textTransform: 'uppercase', fontWeight: '900', opacity: 0.7 }}>PLATILLO CRACK</h4>
                </div>

                <div className="crack-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.2rem', color: '#000', margin: 0, fontWeight: '900', lineHeight: '1.2' }}>
                            {stats.crack}
                        </h2>
                        <span style={{ fontSize: '14px' }}>⭐ ⭐ ⭐</span>
                    </div>

                    {/* EL CÍRCULO DINÁMICO (Sin parche blanco) */}
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Sombra sutil oscura sobre el fondo de color
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '24px',
                        flexShrink: 0
                    }}>
                        🏆
                    </div>
                </div>
            </div>
        </div>
    );
}