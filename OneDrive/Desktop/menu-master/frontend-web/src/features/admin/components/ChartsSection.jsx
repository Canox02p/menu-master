import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const dataLine = [
    { time: '06:00', ventas: 100 },
    { time: '10:00', ventas: 350 },
    { time: '12:00', ventas: 200 },
    { time: '14:00', ventas: 750 },
    { time: '16:00', ventas: 400 },
    { time: '18:00', ventas: 1000 },
    { time: '20:00', ventas: 450 },
    { time: '22:00', ventas: 800 },
];

export default function ChartsSection() {
    const [ocupacion, setOcupacion] = useState({ ocupadas: 0, libres: 1, porcentaje: 0 });
    useEffect(() => {
        fetch('http://localhost:3000/admin/stats-completo')
            .then(res => res.json())
            .then(data => {
                if (data.kpis && data.kpis.ocupacion) {
                    setOcupacion(data.kpis.ocupacion);
                }
            })
            .catch(err => console.error("Error cargando gráficas:", err));
    }, []);
    const dataPie = [
        { name: 'Ocupadas', value: ocupacion.ocupadas },
        { name: 'Libres', value: ocupacion.libres > 0 ? ocupacion.libres : 0.1 },
    ];
    const colorPrimario = 'var(--color-primario, #4DD0E1)';
    const colorSecundario = '#2D3748';
    const colorTexto = '#8B98A5';
    const colorFondoToolip = '#0B1014';
    const pieColors = [colorPrimario, colorSecundario];
    return (
        <div className="charts-grid">
            {/* Gráfica de Línea (Rendimiento) */}
            <div className="chart-card line-chart-container" style={{ backgroundColor: '#151C24', border: '1px solid #2D3748', borderRadius: '16px', padding: '20px' }}>
                <h4 style={{ color: colorTexto, fontSize: '13px', marginBottom: '20px' }}>RENDIMIENTO DIARIO (PRUEBA)</h4>
                <div className="chart-wrapper" style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataLine} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={colorSecundario} vertical={false} />
                            <XAxis dataKey="time" stroke={colorTexto} tick={{ fill: colorTexto, fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis stroke={colorTexto} tick={{ fill: colorTexto, fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: colorFondoToolip, borderColor: '#2D3748', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#FFF' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="ventas"
                                stroke={colorPrimario}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: colorPrimario, stroke: '#fff', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfica de Dona (Mesas 100% Funcional) */}
            <div className="chart-card donut-chart-container" style={{ backgroundColor: '#151C24', border: '1px solid #2D3748', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ color: colorTexto, fontSize: '13px', marginBottom: '10px' }}>MESAS OCUPADAS ACTUALMENTE</h4>

                <div className="donut-wrapper" style={{ position: 'relative', flex: 1, minHeight: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataPie}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {dataPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Texto del centro dinámico */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '24px', color: '#FFF' }}>{ocupacion.porcentaje}%</h3>
                        <span style={{ fontSize: '12px', color: colorTexto }}>Ocupación</span>
                    </div>
                </div>
                <div className="donut-legend" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                    <span style={{ color: colorTexto, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorPrimario }}></div> Ocupadas ({ocupacion.ocupadas})
                    </span>
                    <span style={{ color: colorTexto, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorSecundario }}></div> Libres ({ocupacion.libres})
                    </span>
                </div>
            </div>
        </div>
    );
}