import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function MesaModal({ isOpen, onClose, onMesaAgregada }) {
    const [formData, setFormData] = useState({ numero: '', nombre: '', descripcion: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🚀 Ajustado EXACTAMENTE a tu Schema de Mongoose
        const payload = {
            numero_mesa: Number(formData.numero),
            nombre_mesa: formData.nombre || "",
            descripcion: formData.descripcion || ""
        };

        try {
            const res = await fetch('http://localhost:3000/mesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setFormData({ numero: '', nombre: '', descripcion: '' });
                onMesaAgregada(); // Recarga las mesas en el padre
                onClose(); // Cierra el modal
            } else {
                alert("Error: Verifica que el número de mesa no esté repetido.");
            }
        } catch (error) {
            console.error("Error al guardar la mesa:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Añadir Nueva Mesa</h3>
                    <button onClick={onClose} className="btn-close"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Número de Mesa (Obligatorio)</label>
                        <input type="number" required value={formData.numero} onChange={e => setFormData({ ...formData, numero: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Nombre de la Mesa (Opcional)</label>
                        <input type="text" placeholder="Ej: Mesa VIP" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                    </div>
                    <div className="input-group">
                        <label>Descripción (Opcional)</label>
                        <input type="text" placeholder="Ej: Cerca de la ventana" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-submit">Guardar Mesa</button>
                </form>
            </div>
        </div>
    );
}