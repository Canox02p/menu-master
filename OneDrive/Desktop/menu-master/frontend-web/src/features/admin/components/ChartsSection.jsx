import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { COLORES_RESTO } from '../../../constants/theme';
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

const dataPie = [
    { name: 'Ocupadas', value: 33 },
    { name: 'Libres', value: 67 },
];

export default function ChartsSection() {
    const colorPrimario = COLORES_RESTO.cian;
    const colorSecundario = COLORES_RESTO.borde;
    const colorTexto = COLORES_RESTO.grisTexto;
    const colorFondoToolip = COLORES_RESTO.fondo;

    const pieColors = [colorPrimario, colorSecundario];

    const themeStyle = {
        '--color-primary': colorPrimario,
        '--color-text-muted': colorTexto,
        '--border-color': colorSecundario,
        '--bg-card': COLORES_RESTO.tarjeta,
    };

    return (
        <div className="charts-grid" style={themeStyle}>
            {/* Gráfica de Línea */}
            <div className="chart-card line-chart-container">
                <h4>RENDIMIENTO DIARIO (VENTAS POR HORA)</h4>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataLine} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            {/* Líneas de cuadrícula */}
                            <CartesianGrid strokeDasharray="3 3" stroke={colorSecundario} vertical={false} />

                            {/* Ejes */}
                            <XAxis dataKey="time" stroke={colorTexto} tick={{ fill: colorTexto, fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis stroke={colorTexto} tick={{ fill: colorTexto, fontSize: 12 }} tickLine={false} axisLine={false} />

                            {/* Tooltip (Cajita de información al pasar el mouse) */}
                            <Tooltip
                                contentStyle={{ backgroundColor: colorFondoToolip, borderColor: colorPrimario, color: '#fff', borderRadius: '8px' }}
                                itemStyle={{ color: colorPrimario }}
                            />

                            {/* La línea principal con efecto de resplandor */}
                            <Line
                                type="monotone"
                                dataKey="ventas"
                                stroke={colorPrimario}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: colorPrimario, stroke: '#fff', strokeWidth: 2 }}
                                /* Agregamos '66' al hex del cian para darle un 40% de opacidad a la sombra */
                                style={{ filter: `drop-shadow(0px 4px 6px ${colorPrimario}66)` }}
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
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center-text">
                        <h3>33%</h3>
                        <span>Occupancy</span>
                    </div>
                </div>

                {/* Leyenda con los colores inyectados en línea para evitar depender del CSS para los puntitos */}
                <div className="donut-legend">
                    <span className="legend-item">
                        <span className="dot busy" style={{ backgroundColor: colorPrimario }}></span> Ocupadas
                    </span>
                    <span className="legend-item">
                        <span className="dot free" style={{ backgroundColor: colorSecundario }}></span> Libres
                    </span>
                </div>
            </div>
        </div>
    );
}