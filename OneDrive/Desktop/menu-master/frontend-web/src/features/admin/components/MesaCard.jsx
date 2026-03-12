import React from 'react';
import { Trash2, Coffee } from 'lucide-react';

export default function MesaCard({ mesa, onEliminar }) {
    const isLibre = mesa.estado === 'LIBRE';

    return (
        <div className={`mesa-card ${isLibre ? 'libre' : 'ocupada'}`}>
            <div className="mesa-card-header">
                <div className="mesa-title">
                    <Coffee size={18} className="icon" />
                    <h3>{mesa.nombre_mesa || `Mesa ${mesa.numero_mesa}`}</h3>
                </div>
                <button className="btn-delete" onClick={() => onEliminar(mesa._id)}>
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="mesa-card-body">
                <span className="mesa-number">#{mesa.numero_mesa}</span>
                {mesa.descripcion && <p className="mesa-desc">{mesa.descripcion}</p>}
            </div>

            <div className="mesa-card-footer">
                <span className={`badge-estado ${isLibre ? 'white' : 'green'}`}>
                    {mesa.estado}
                </span>
            </div>
        </div>
    );
}