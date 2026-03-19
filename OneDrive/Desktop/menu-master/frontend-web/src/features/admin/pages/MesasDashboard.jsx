import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MesaCard from '../components/MesaCard';
import MesaModal from '../components/MesaModal';
import RecentOrdersTable from '../components/RecentOrdersTable';
import { COLORES_RESTO } from '../../../constants/theme';
import '../styles/Mesas.css';

export default function MesasDashboard() {
    const [mesas, setMesas] = useState([]); // Ahora inicia vacío
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroArea, setFiltroArea] = useState('TODAS');
    const [filtroEstado, setFiltroEstado] = useState('TODAS');

    // --- 🌐 LLAMADA A TU API ---
    const cargarMesas = async () => {
        try {
            const response = await fetch('http://localhost:3000/mesas');
            const data = await response.json();
            setMesas(data);
        } catch (error) {
            console.error("Error al obtener mesas de MongoDB:", error);
        }
    };

    useEffect(() => {
        cargarMesas();
    }, []);

    const handleEliminarMesa = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta mesa permanentemente?")) return;

        try {
            const response = await fetch(`http://localhost:3000/mesas/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Filtramos el estado local para que desaparezca de la vista
                setMesas(mesas.filter(m => m._id !== id));
            }
        } catch (error) {
            console.error("Error al eliminar la mesa:", error);
        }
    };

    // Cálculos basados en los datos reales de la BD
    const ocupadas = mesas.filter(m => m.estado === 'OCUPADA').length;
    const libres = mesas.filter(m => m.estado === 'LIBRE' || m.estado === 'DISPONIBLE').length;
    const reservadas = mesas.filter(m => m.estado === 'RESERVADA').length;

    const mesasFiltradas = mesas.filter(m => {
        const pasaFiltroArea = filtroArea === 'TODAS' || m.area === filtroArea;
        const pasaFiltroEstado = filtroEstado === 'TODAS' || m.estado === filtroEstado;
        return pasaFiltroArea && pasaFiltroEstado;
    });

    return (
        <div className="mesas-layout">
            <MesaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onMesaAgregada={cargarMesas} // Recarga la lista cuando agregues una
            />

            <div className="kpi-grid">
                <div className="kpi-card" style={{ border: `1px solid ${COLORES_RESTO.grisTexto || '#2D3748'}` }}>
                    <h4>TOTAL MESAS</h4>
                    <h2 style={{ color: '#FFF' }}>{mesas.length}</h2>
                </div>
                <div className="kpi-card" style={{ border: `1px solid ${COLORES_RESTO.naranja || '#E68A46'}` }}>
                    <h4>MESAS OCUPADAS</h4>
                    <h2 style={{ color: COLORES_RESTO.naranja || '#E68A46' }}>{ocupadas}</h2>
                </div>
                <div className="kpi-card" style={{ border: `1px solid ${COLORES_RESTO.verde || '#48BB78'}` }}>
                    <h4>MESAS LIBRES</h4>
                    <h2 style={{ color: COLORES_RESTO.verde || '#48BB78' }}>{libres}</h2>
                </div>
                <div className="kpi-card" style={{ border: `1px solid ${COLORES_RESTO.morado || '#9F7AEA'}` }}>
                    <h4>RESERVADAS</h4>
                    <h2 style={{ color: COLORES_RESTO.morado || '#9F7AEA' }}>{reservadas}</h2>
                </div>
            </div>

            <div className="mesas-grid-container">
                <div className="mesas-management">
                    <div className="management-header-modern">
                        <div className="pill-filters-container">
                            <div className="pill-group area-group">
                                {['TODAS', 'Principal', 'Terraza', 'VIP'].map(area => (
                                    <button
                                        key={area}
                                        className={`pill-btn ${filtroArea === area ? 'active-area' : ''}`}
                                        onClick={() => setFiltroArea(area)}
                                    >
                                        {area.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="pill-group status-group">
                                <button className={`pill-btn ${filtroEstado === 'TODAS' ? 'active-status' : ''}`} onClick={() => setFiltroEstado('TODAS')}>VER TODO</button>
                                <button className={`pill-btn ${filtroEstado === 'LIBRE' ? 'active-status' : ''}`} onClick={() => setFiltroEstado('LIBRE')}>LIBRES</button>
                                <button className={`pill-btn ${filtroEstado === 'OCUPADA' ? 'active-status' : ''}`} onClick={() => setFiltroEstado('OCUPADA')}>OCUPADAS</button>
                                <button className={`pill-btn ${filtroEstado === 'RESERVADA' ? 'active-status' : ''}`} onClick={() => setFiltroEstado('RESERVADA')}>RESERVAS</button>
                            </div>
                        </div>

                        <button className="btn-add-mesa" onClick={() => setIsModalOpen(true)} style={{ backgroundColor: COLORES_RESTO.cian, color: '#000' }}>
                            <Plus size={18} /> Añadir Mesa
                        </button>
                    </div>

                    <div className="mesas-cards-grid">
                        {mesasFiltradas.length === 0 ? (
                            <p style={{ color: '#718096', marginTop: '20px' }}>No hay mesas disponibles.</p>
                        ) : (
                            mesasFiltradas.map(mesa => (
                                <MesaCard key={mesa._id} mesa={mesa} onEliminar={handleEliminarMesa} />
                            ))
                        )}
                    </div>
                </div>

                <div className="mesas-bottom-section">
                    <RecentOrdersTable />
                </div>
            </div>
        </div>
    );
}