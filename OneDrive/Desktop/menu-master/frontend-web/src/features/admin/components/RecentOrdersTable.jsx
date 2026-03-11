import React from 'react';
import { Smartphone } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';

const orders = [
    { id: '#222', mesa: 'Mesa 1', mesero: 'Juan Sr.', avatar: '👨🏽', platillos: '12 Platillos', total: '$12,400.00', estado: 'EN PREPARACIÓN', color: 'green', device: true },
    { id: '#223', mesa: 'Mesa 2', mesero: 'Ana Sr.', avatar: '👩🏻', platillos: '4 Platillos', total: '$450.00', estado: 'EN COCINA', color: 'green', device: false },
    { id: '#224', mesa: 'Mesa 3', mesero: '-', avatar: '👤', platillos: '-', total: '$0.00', estado: 'RESERVADA', color: 'white', device: false },
];

export default function RecentOrdersTable() {
    // Inyectamos las variables dinámicas
    const themeStyle = {
        '--bg-card': COLORES_RESTO.tarjeta,
        '--color-text-muted': COLORES_RESTO.grisTexto,
        '--border-color': COLORES_RESTO.borde,
        '--color-success': COLORES_RESTO.verde, // Tomamos tu verde del theme.js
        '--color-primary': COLORES_RESTO.cian,
    };

    return (
        <div className="table-card" style={themeStyle}>
            <h4>ÚLTIMOS PEDIDOS</h4>
            <div className="table-responsive">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mesa</th>
                            <th>Mesero</th>
                            <th>Platillos</th>
                            <th>Total</th>
                            <th className="text-right">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="text-gray">{order.id}</td>
                                <td>{order.mesa}</td>
                                <td>
                                    <div className="mesero-cell">
                                        <span className="avatar">{order.avatar}</span>
                                        {order.mesero}
                                    </div>
                                </td>
                                <td className="text-gray">{order.platillos}</td>
                                <td>{order.total}</td>
                                <td className="estado-cell">
                                    {order.device && <Smartphone size={16} className="text-gray" />}
                                    <span className={`badge-estado ${order.color}`}>
                                        {order.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}