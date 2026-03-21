import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export default function RecentOrdersTable() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Llamamos a tu backend real
        fetch('http://localhost:3000/admin/stats-completo')
            .then(res => res.json())
            .then(data => {
                if (data.recientes) {
                    // 2. Transformamos los datos de MongoDB para que coincidan con tu diseño visual
                    const pedidosFormateados = data.recientes.map(p => {

                        // Lógica para asignar el color de la "pastilla" (badge) según el estado
                        let tipoClase = 'reservada'; // Gris por defecto
                        const estadoStr = (p.estado || '').toUpperCase();

                        if (estadoStr.includes('COCINA') || estadoStr.includes('PROCESO')) {
                            tipoClase = 'cocina'; // Naranja
                        } else if (estadoStr.includes('PREPARACIÓN') || estadoStr === 'LISTO') {
                            tipoClase = 'preparacion'; // Verde
                        }

                        return {
                            // Agarramos los últimos 4 caracteres del ID de Mongo (ej. #A8C2)
                            id: '#' + (p._id ? p._id.toString().slice(-4).toUpperCase() : '0000'),
                            // Si la BD trae mesa, la ponemos, si no, ponemos un genérico
                            mesa: p.numero_mesa ? `Mesa ${p.numero_mesa}` : 'Barra',
                            // Lo mismo para el mesero
                            mesero: p.nombre_mesero || 'Equipo POS',
                            avatar: '👤',
                            // Si trae array de productos contamos cuántos son
                            platillos: p.productos ? `${p.productos.length} Platillos` : 'Varios',
                            total: `$${Number(p.total || 0).toFixed(2)}`,
                            estado: p.estado || 'RECIBIDO',
                            tipo: tipoClase,
                            icono: true // Para que salga el ícono del cel
                        };
                    });

                    setPedidos(pedidosFormateados);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar últimos pedidos:", err);
                setLoading(false);
            });
    }, []);

    const colorTextMuted = '#8B98A5';

    return (
        // 👇 ACTUALIZADO: Contenedor unificado con el estilo de las gráficas 👇
        <div className="orders-table-wrapper" style={{
            backgroundColor: '#151C24', // Fondo unificado
            border: '1px solid #2D3748',   // Borde unificado
            borderRadius: '16px',         // Esquinas unificadas
            padding: '20px'               // Padding unificado
        }}>
            <h3 className="orders-table-title" style={{ color: colorTextMuted, fontSize: '13px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ÚLTIMOS PEDIDOS EN TIEMPO REAL
            </h3>

            <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
                <thead>
                    <tr>
                        <th style={{ color: colorTextMuted, fontSize: '12px', padding: '10px', textAlign: 'left', borderBottom: '1px solid #2D3748' }}>ID</th>
                        <th style={{ color: colorTextMuted, fontSize: '12px', padding: '10px', textAlign: 'left', borderBottom: '1px solid #2D3748' }}>Mesa</th>
                        <th style={{ color: colorTextMuted, fontSize: '12px', padding: '10px', textAlign: 'left', borderBottom: '1px solid #2D3748' }}>Mesero</th>
                        <th style={{ color: colorTextMuted, fontSize: '12px', padding: '10px', textAlign: 'left', borderBottom: '1px solid #2D3748' }}>Platillos</th>
                        <th style={{ color: colorTextMuted, fontSize: '12px', padding: '10px', textAlign: 'left', borderBottom: '1px solid #2D3748' }}>Total</th>
                        <th style={{ color: colorTextMuted, fontSize: '12px', padding: '10px', textAlign: 'left', borderBottom: '1px solid #2D3748' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-primario)' }}>
                                Cargando pedidos en tiempo real...
                            </td>
                        </tr>
                    ) : pedidos.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#8B98A5' }}>
                                No hay pedidos recientes en la base de datos.
                            </td>
                        </tr>
                    ) : (
                        pedidos.map((pedido, index) => (
                            <tr key={index}>
                                <td className="cell-id" style={{ padding: '10px', borderBottom: '1px solid #2D3748', color: '#FFF' }}>{pedido.id}</td>
                                <td className="cell-mesa" style={{ padding: '10px', borderBottom: '1px solid #2D3748', color: '#FFF' }}>{pedido.mesa}</td>

                                {/* Celda del Mesero con su foto/emoji */}
                                <td style={{ padding: '10px', borderBottom: '1px solid #2D3748' }}>
                                    <div className="mesero-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className="avatar-mesero" style={{ fontSize: '16px' }}>{pedido.avatar}</div>
                                        <span style={{ color: '#FFF' }}>{pedido.mesero}</span>
                                    </div>
                                </td>

                                <td style={{ padding: '10px', borderBottom: '1px solid #2D3748', color: '#FFF' }}>{pedido.platillos}</td>
                                <td className="cell-total" style={{ padding: '10px', borderBottom: '1px solid #2D3748', color: '#FFF', fontWeight: 'bold' }}>{pedido.total}</td>

                                {/* Celda del Estado alineada a la derecha */}
                                <td style={{ padding: '10px', borderBottom: '1px solid #2D3748' }}>
                                    <div className="estado-group" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {pedido.icono && <Smartphone size={16} color="#8B98A5" />}
                                        <span className={`badge-table ${pedido.tipo}`}>
                                            {pedido.estado}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}