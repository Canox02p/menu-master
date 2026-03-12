import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MesaCard from '../components/MesaCard';
import MesaModal from '../components/MesaModal';
import RecentOrdersTable from '../components/RecentOrdersTable'; // Reutilizamos tu componente
import { COLORES_RESTO } from '../../../constants/theme';

export default function MesasDashboard() {
    const [mesas, setMesas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('TODAS'); // Filtro basado en tu Schema

    const fetchMesas = async () => {
        try {
            const res = await fetch('http://localhost:3000/mesas');
            const data = await res.json();
            setMesas(data);
        } catch (error) { console.error("Error al cargar mesas", error); }
    };

    useEffect(() => { fetchMesas(); }, []);

    const handleEliminarMesa = async (id) => {
        if (!window.confirm("¿Eliminar esta mesa permanentemente?")) return;
        await fetch(`http://localhost:3000/mesas/${id}`, { method: 'DELETE' });
        fetchMesas();
    };

    // Cálculos para los KPIs
    const ocupadas = mesas.filter(m => m.estado === 'OCUPADA').length;
    const libres = mesas.filter(m => m.estado === 'LIBRE').length;

    // Filtrado de la vista
    const mesasFiltradas = filtroEstado === 'TODAS' ? mesas : mesas.filter(m => m.estado === filtroEstado);

    return (
        <div className="mesas-layout">
            {/* Modal Separado */}
            <MesaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onMesaAgregada={fetchMesas} />

            {/* KPIs SUPERIORES */}
            <div className="kpi-grid">
                <div className="kpi-card"><h4>TOTAL MESAS</h4><h2>{mesas.length}</h2></div>
                <div className="kpi-card"><h4>MESAS OCUPADAS</h4><h2 style={{ color: COLORES_RESTO.naranja || '#E68A46' }}>{ocupadas}</h2></div>
                <div className="kpi-card"><h4>MESAS LIBRES</h4><h2 style={{ color: COLORES_RESTO.cian }}>{libres}</h2></div>
            </div>

            <div className="mesas-grid-container">
                {/* ZONA IZQUIERDA: GESTIÓN */}
                <div className="mesas-management">
                    <div className="management-header">
                        <div className="status-tabs">
                            <button className={filtroEstado === 'TODAS' ? 'active' : ''} onClick={() => setFiltroEstado('TODAS')}>Todas</button>
                            <button className={filtroEstado === 'LIBRE' ? 'active' : ''} onClick={() => setFiltroEstado('LIBRE')}>Libres</button>
                            <button className={filtroEstado === 'OCUPADA' ? 'active' : ''} onClick={() => setFiltroEstado('OCUPADA')}>Ocupadas</button>
                        </div>
                        <button className="btn-add-mesa" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> Añadir Mesa
                        </button>
                    </div>

                    <div className="mesas-cards-grid">
                        {mesasFiltradas.map(mesa => (
                            <MesaCard key={mesa._id} mesa={mesa} onEliminar={handleEliminarMesa} />
                        ))}
                    </div>
                </div>

                {/* ZONA DERECHA: REUTILIZAMOS TU TABLA DE PEDIDOS */}
                <div className="mesas-sidebar-right">
                    <RecentOrdersTable />
                </div>
            </div>
        </div>
    );
}