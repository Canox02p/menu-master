import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

// Datos de prueba para la gráfica de línea
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

// Datos para la gráfica de dona (33% ocupado)
const dataPie = [
    { name: 'Ocupadas', value: 33 },
    { name: 'Libres', value: 67 },
];
const COLORS = ['#FF9F43', '#3A4750']; // Naranja y Gris oscuro

export default function ChartsSection() {
    return (
        <div className="charts-grid">
            {/* Gráfica de Línea */}
            <div className="chart-card line-chart-container">
                <h4>RENDIMIENTO DIARIO (VENTAS POR HORA)</h4>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataLine} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A353D" vertical={false} />
                            <XAxis dataKey="time" stroke="#8C99A6" tick={{ fill: '#8C99A6', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis stroke="#8C99A6" tick={{ fill: '#8C99A6', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#12171A', borderColor: '#40E0D0', color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: '#FF9F43' }}
                            />
                            {/* La línea naranja con efecto de resplandor */}
                            <Line
                                type="monotone"
                                dataKey="ventas"
                                stroke="#FF9F43"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: '#FF9F43', stroke: '#fff', strokeWidth: 2 }}
                                style={{ filter: 'drop-shadow(0px 4px 6px rgba(255, 159, 67, 0.4))' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfica de Dona */}
            <div className="chart-card donut-chart-container">
                <h4>MESAS OCUPADAS ACTUALMENTE</h4>
                <div className="donut-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataPie}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {dataPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center-text">
                        <h3>33%</h3>
                        <span>Occupancy</span>
                    </div>
                </div>
                <div className="donut-legend">
                    <span className="legend-item"><span className="dot busy"></span> Ocupadas</span>
                    <span className="legend-item"><span className="dot free"></span> Libres</span>
                </div>
            </div>
        </div>
    );
}