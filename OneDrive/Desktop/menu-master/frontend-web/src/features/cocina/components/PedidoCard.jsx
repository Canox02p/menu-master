import React, { useState } from 'react';
import { COLORES_RESTO } from '../../../constants/theme';

const PlatilloItem = ({ producto }) => {
    const [completado, setCompletado] = useState(false);

    return (
        <div
            onClick={() => setCompletado(!completado)}
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: completado ? 'rgba(45, 55, 72, 0.7)' : 'rgba(255, 255, 255, 0.03)',
                borderLeft: `4px solid ${completado ? COLORES_RESTO.grisTexto : COLORES_RESTO.verde}`,
                borderRadius: '2px',
                padding: '8px 12px',
                marginBottom: '6px',
                cursor: 'pointer',
                transition: '0.2s ease',
                opacity: completado ? 0.6 : 1,
                textDecoration: completado ? 'line-through' : 'none',
            }}
        >
            <span style={{ fontWeight: 'bold', color: completado ? COLORES_RESTO.grisTexto : COLORES_RESTO.verde, marginRight: '12px', minWidth: '30px' }}>
                {producto.cantidad}x
            </span>
            <span style={{ fontSize: '0.9rem', color: completado ? COLORES_RESTO.grisTexto : 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {producto.nombre}
            </span>
        </div>
    );
};

// 1. CORRECCIÓN: Renombrado a PedidoCard y ajustamos las props que recibe
export const PedidoCard = ({ pedido, onActualizar, onEliminar }) => {
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    // Color y texto dinámico del estado
    const esEnProceso = pedido.estado === 'EN_PROCESO';

    return (
        <div style={{ backgroundColor: COLORES_RESTO.tarjeta, borderRadius: '4px', border: `1px solid ${COLORES_RESTO.borde}`, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px', overflow: 'hidden', position: 'relative' }}>

            {/* Modal de confirmación para eliminar */}
            {mostrarConfirmacion && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
                    <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px' }}>¿Cancelar pedido?</p>
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        {/* 2. CORRECCIÓN: Usamos onEliminar en lugar de onCancelar */}
                        <button onClick={() => { onEliminar(pedido._id); setMostrarConfirmacion(false); }} style={{ flex: 1, padding: '10px', backgroundColor: COLORES_RESTO.rojo, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>SÍ</button>
                        <button onClick={() => setMostrarConfirmacion(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>NO</button>
                    </div>
                </div>
            )}

            {/* Cabecera dinámica según el estado */}
            <div style={{ backgroundColor: esEnProceso ? COLORES_RESTO.verde : COLORES_RESTO.cian, color: 'black', padding: '6px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {esEnProceso ? 'PREPARANDO...' : 'EN ESPERA'}
            </div>

            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', borderBottom: `1px solid ${COLORES_RESTO.borde}`, paddingBottom: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#2D3748', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>CH</div>
                    <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>Ticket: #{pedido._id.substring(pedido._id.length - 3)} / Mesa: {pedido.id_mesa?.substring(0, 2) || 'N/A'}</div>
                        <div style={{ color: COLORES_RESTO.grisTexto }}>Mesero: Juan Sr.</div>
                    </div>
                </div>

                <div style={{ flex: 1, marginBottom: '15px', overflowY: 'auto' }}>
                    {pedido.productos.map((p, i) => (
                        <PlatilloItem key={i} producto={p} />
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>

                        {/* 3. CORRECCIÓN: Evento onClick para pasar a EN_PROCESO */}
                        <button
                            onClick={() => onActualizar(pedido._id, 'EN_PROCESO')}
                            disabled={esEnProceso}
                            style={{ flex: 1, padding: '10px', backgroundColor: esEnProceso ? '#444' : COLORES_RESTO.verde, border: 'none', borderRadius: '4px', color: esEnProceso ? '#888' : 'black', fontWeight: 'bold', cursor: esEnProceso ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}
                        >
                            Tomar
                        </button>

                        {/* 4. CORRECCIÓN: Evento onClick para finalizar el pedido enviando 'LISTO' */}
                        <button
                            onClick={() => onActualizar(pedido._id, 'LISTO')}
                            style={{ flex: 1, padding: '10px', backgroundColor: COLORES_RESTO.cian, border: 'none', borderRadius: '4px', color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            Terminar
                        </button>
                    </div>

                    <button
                        onClick={() => setMostrarConfirmacion(true)}
                        style={{ alignSelf: 'center', padding: '4px 8px', backgroundColor: 'transparent', color: COLORES_RESTO.rojo, border: `1px solid ${COLORES_RESTO.rojo}`, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer', opacity: 0.8 }}
                    >
                        CANCELAR PEDIDO
                    </button>
                </div>
            </div>
        </div>
    );
};