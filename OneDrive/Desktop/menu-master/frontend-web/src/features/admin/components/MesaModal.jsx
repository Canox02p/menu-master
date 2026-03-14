import React, { useState } from 'react';
import { X } from 'lucide-react';
import { COLORES_RESTO } from '../../../constants/theme';

export default function MesaModal({ isOpen, onClose, onMesaAgregada }) {
    const [formData, setFormData] = useState({
        numero_mesa: '',
        nombre_mesa: '',
        estado: 'LIBRE',
        area: 'Principal',
        descripcion: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            numero_mesa: Number(formData.numero_mesa),
            nombre_mesa: formData.nombre_mesa || `Mesa ${formData.numero_mesa}`,
            estado: formData.estado,
            area: formData.area,
            descripcion: formData.descripcion || ""
        };

        try {
            const res = await fetch('http://localhost:3000/mesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setFormData({ numero_mesa: '', nombre_mesa: '', estado: 'LIBRE', area: 'Principal', descripcion: '' });
                onMesaAgregada();
                onClose();
            } else {
                alert("Error: Verifica que el número de mesa no esté repetido.");
            }
        } catch (error) {
            console.error("Error al guardar la mesa:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-modern">
                <div className="modal-header-modern">
                    <h3>Añadir Nueva Mesa</h3>
                    <button onClick={onClose} className="btn-close-modern"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form-modern">
                    <div className="form-row-2col">
                        <div className="input-group-modern">
                            <label>Número de Mesa:</label>
                            <input
                                type="number" required placeholder="Ej: 1"
                                value={formData.numero_mesa}
                                onChange={e => setFormData({ ...formData, numero_mesa: e.target.value })}
                            />
                        </div>
                        <div className="input-group-modern">
                            <label>Nombre (Opcional):</label>
                            <input
                                type="text" placeholder="Ej: Terraza 1"
                                value={formData.nombre_mesa}
                                onChange={e => setFormData({ ...formData, nombre_mesa: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row-2col">
                        <div className="input-group-modern">
                            <label>Área / Ubicación:</label>
                            <div className="select-wrapper">
                                <select value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}>
                                    <option value="Principal">Sala Principal</option>
                                    <option value="Terraza">Terraza</option>
                                    <option value="VIP">Zona VIP</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-group-modern">
                            <label>Estado Inicial:</label>
                            <div className="select-wrapper">
                                <select value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
                                    <option value="LIBRE">Disponible (Libre)</option>
                                    <option value="OCUPADA">Ocupada</option>
                                    <option value="RESERVADA">Reservada</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group-modern full-width">
                        <label>Descripción / Notas (Opcional):</label>
                        <input
                            type="text" placeholder="Ej: Cerca de la ventana"
                            value={formData.descripcion}
                            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                        />
                    </div>

                    <div className="modal-actions-modern">
                        <button type="button" className="btn-cancel-modern" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-create-modern" style={{ backgroundColor: COLORES_RESTO.cian }}>
                            Crear Mesa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}