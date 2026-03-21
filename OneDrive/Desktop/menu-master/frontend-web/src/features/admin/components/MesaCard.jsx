import React from 'react';
import { Trash2, Users } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';

export default function MesaCard({ mesa, onEliminar }) {
    let colorEstado = '#8B98A5';
    let estadoTexto = mesa.estado || 'LIBRE';

    if (estadoTexto === 'LIBRE' || estadoTexto === 'DISPONIBLE') {
        colorEstado = '#48BB78';
        estadoTexto = 'Disponible';
    } else if (estadoTexto === 'OCUPADA') {
        colorEstado = '#F6AD55';
        estadoTexto = 'Ocupada';
    } else if (estadoTexto === 'RESERVADA') {
        colorEstado = '#9F7AEA';
        estadoTexto = 'Reservada';
    }

    return (
        <div className="mesa-card" style={{
            backgroundColor: '#151C24',
            border: `1px solid ${colorEstado}`,
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
        }}>
            {/* Botón eliminar corregido */}
            <button
                className="btn-delete"
                onClick={() => onEliminar(mesa._id)}
                style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'transparent', border: 'none', color: '#F56565', cursor: 'pointer'
                }}
            >
                <Trash2 size={18} />
            </button>

            {/* Círculo con el número */}
            <div className="mesa-number-box" style={{
                borderColor: colorEstado,
                border: '2px solid',
                borderRadius: '50%',
                width: '60px', height: '60px',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <span style={{ color: colorEstado, fontSize: '24px', fontWeight: 'bold' }}>
                    {mesa.numero_mesa}
                </span>
            </div>

            <div className="mesa-name-container" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#FFF', margin: 0, fontSize: '18px' }}>
                    {mesa.nombre_mesa || `MESA ${mesa.numero_mesa}`}
                </h3>
                <p style={{ color: '#8B98A5', margin: '5px 0 0 0', fontSize: '13px' }}>
                    {mesa.area || 'Principal'}
                </p>
            </div>

            {/* Badge de estado */}
            <div style={{
                color: colorEstado,
                border: `1px solid ${colorEstado}`,
                padding: '4px 15px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                {estadoTexto}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={14} color="#8B98A5" />
                <span style={{ color: '#8B98A5', fontSize: '12px' }}>
                    CAP. {mesa.capacidad || 4}
                </span>
            </div>
        </div>
    );
}