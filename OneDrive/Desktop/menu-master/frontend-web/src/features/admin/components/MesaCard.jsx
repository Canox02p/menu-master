import React from 'react';
import { Trash2, Users } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';

export default function MesaCard({ mesa, onEliminar }) {
    let colorEstado = COLORES_RESTO.grisTexto;
    let estadoTexto = mesa.estado || 'LIBRE';

    if (estadoTexto === 'LIBRE' || estadoTexto === 'DISPONIBLE') {
        colorEstado = COLORES_RESTO.verde || '#48BB78';
        estadoTexto = 'Disponible';
    } else if (estadoTexto === 'OCUPADA') {
        colorEstado = COLORES_RESTO.naranja || '#F6AD55';
        estadoTexto = 'Ocupada';
    } else if (estadoTexto === 'RESERVADA') {
        colorEstado = COLORES_RESTO.morado || '#9F7AEA';
        estadoTexto = 'Reservada';
    }

    return (
        <div className="mesa-card" style={{ border: `1px solid ${colorEstado}` }}>
            <button className="btn-delete" onClick={() => onEliminar(mesa._id)} title="Eliminar mesa">
                <Trash2 size={16} />
            </button>

            <div className="mesa-number-box" style={{ borderColor: colorEstado }}>
                <span style={{ color: colorEstado }}>{mesa.numero_mesa}</span>
            </div>

            <div className="mesa-name-container">
                <h3 className="mesa-name">{mesa.nombre_mesa || `MESA ${mesa.numero_mesa}`}</h3>
                <p className="mesa-area">{mesa.area || 'Principal'}</p>
            </div>

            <div className="badge-estado" style={{ color: colorEstado, border: `1px solid ${colorEstado}`, backgroundColor: 'transparent' }}>
                {estadoTexto}
            </div>

            <div className="mesa-capacity">
                <Users size={14} color={COLORES_RESTO.grisTexto} />
                <span style={{ color: COLORES_RESTO.grisTexto }}>CAP. {mesa.capacidad || 4}</span>
            </div>
        </div>
    );
}