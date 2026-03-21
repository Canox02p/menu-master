import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function MesaModal({ isOpen, onClose, onMesaAgregada }) {
    const [formData, setFormData] = useState({
        numero_mesa: '',
        nombre_mesa: '',
        estado: 'LIBRE',
        area: 'Principal',
        capacidad: 4,
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
            capacidad: Number(formData.capacidad),
            descripcion: formData.descripcion || ""
        };

        try {
            const res = await fetch('http://localhost:3000/mesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setFormData({ numero_mesa: '', nombre_mesa: '', estado: 'LIBRE', area: 'Principal', capacidad: 4, descripcion: '' });
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
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: 'var(--color-primario)', margin: 0 }}>Añadir Nueva Mesa</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}># Mesa:</label>
                            <input
                                type="number" required placeholder="Ej: 5"
                                value={formData.numero_mesa}
                                onChange={e => setFormData({ ...formData, numero_mesa: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Capacidad:</label>
                            <input
                                type="number" required
                                value={formData.capacidad}
                                onChange={e => setFormData({ ...formData, capacidad: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <label style={labelStyle}>Nombre Personalizado (Opcional):</label>
                    <input
                        type="text" placeholder="Ej: Mesa VIP Ventana"
                        value={formData.nombre_mesa}
                        onChange={e => setFormData({ ...formData, nombre_mesa: e.target.value })}
                        style={inputStyle}
                    />

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Área:</label>
                            <select
                                value={formData.area}
                                onChange={e => setFormData({ ...formData, area: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="Principal">Sala Principal</option>
                                <option value="Terraza">Terraza</option>
                                <option value="VIP">Zona VIP</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Estado Inicial:</label>
                            <select
                                value={formData.estado}
                                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="LIBRE">Disponible</option>
                                <option value="RESERVADA">Reservada</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={btnCancelStyle}>Cancelar</button>
                        <button type="submit" style={btnCreateStyle}>Crear Mesa</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
};
const modalContentStyle = {
    backgroundColor: '#151C24', padding: '30px', borderRadius: '16px', border: '1px solid #2D3748', width: '450px', maxWidth: '95%'
};
const labelStyle = { color: '#8B98A5', fontSize: '13px', marginBottom: '5px', display: 'block' };
const inputStyle = {
    width: '100%', padding: '10px', backgroundColor: '#0B1014', border: '1px solid #2D3748', borderRadius: '8px', color: '#FFF', boxSizing: 'border-box'
};
const btnCancelStyle = {
    backgroundColor: 'transparent', color: '#8B98A5', border: '1px solid #2D3748', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
};
const btnCreateStyle = {
    backgroundColor: 'var(--color-primario)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
};