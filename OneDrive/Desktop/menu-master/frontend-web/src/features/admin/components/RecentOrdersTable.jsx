import React from 'react';
import { Smartphone } from 'lucide-react'; // Ícono del celular que aparece en tu imagen

export default function RecentOrdersTable() {
    // 🚦 Datos temporales basados en tu diseño exacto
    const pedidosMock = [
        { id: '#222', mesa: 'Mesa 1', mesero: 'Juan Sr.', avatar: '👨🏽', platillos: '12 Platillos', total: '$12,400.00', estado: 'EN PREPARACIÓN', tipo: 'preparacion', icono: true },
        { id: '#223', mesa: 'Mesa 2', mesero: 'Ana Sr.', avatar: '👩🏻', platillos: '4 Platillos', total: '$450.00', estado: 'EN COCINA', tipo: 'cocina', icono: false },
        { id: '#224', mesa: 'Mesa 3', mesero: '-', avatar: '👤', platillos: '-', total: '$0.00', estado: 'RESERVADA', tipo: 'reservada', icono: false }
    ];

    return (
        <div className="orders-table-wrapper">
            <h3 className="orders-table-title">ÚLTIMOS PEDIDOS</h3>

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mesa</th>
                        <th>Mesero</th>
                        <th>Platillos</th>
                        <th>Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosMock.map((pedido, index) => (
                        <tr key={index}>
                            <td className="cell-id">{pedido.id}</td>
                            <td className="cell-mesa">{pedido.mesa}</td>

                            {/* Celda del Mesero con su foto/emoji */}
                            <td>
                                <div className="mesero-group">
                                    <div className="avatar-mesero">{pedido.avatar}</div>
                                    <span>{pedido.mesero}</span>
                                </div>
                            </td>

                            <td>{pedido.platillos}</td>
                            <td className="cell-total">{pedido.total}</td>

                            {/* Celda del Estado alineada a la derecha */}
                            <td>
                                <div className="estado-group">
                                    {pedido.icono && <Smartphone size={16} color="#8B98A5" />}
                                    <span className={`badge-table ${pedido.tipo}`}>
                                        {pedido.estado}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}