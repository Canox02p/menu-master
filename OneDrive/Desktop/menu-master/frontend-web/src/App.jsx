import React, { useState } from 'react';
import { COLORES_RESTO } from "./constants/theme";

// --- CAPA DE AUTENTICACIÓN ---
import Login from "./features/auth/pages/Login";

// --- CAPA DE ADMINISTRACIÓN ---
import AdminDashboard from "./features/admin/pages/AdminDashboard";

// --- CAPA DE COCINA ---
import { usePedidosCocina } from "./features/cocina/hooks/usePedidosCocina";
import ChefHeader from "./features/cocina/components/ChefHeader";
import { PedidoCard } from "./features/cocina/components/PedidoCard";

import './App.css';

export default function App() {
  const [auth, setAuth] = useState({ rol: null, plataforma: 'web' });

  const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

  const manejarLogin = (rol, plataforma) => {
    setAuth({ rol, plataforma });
  };

  const manejarLogout = () => {
    setAuth({ rol: null, plataforma: 'web' });
  };

  const VistaCocina = () => (
    <div className={`main-app-container ${auth.plataforma}`} style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: COLORES_RESTO.fondo,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ChefHeader onLogout={manejarLogout} />

      <div className="dashboard-grid">
        {pedidos.length > 0 ? (
          pedidos.map(p => (
            <PedidoCard
              key={p._id}
              pedido={p}
              onActualizar={actualizarEstado}
              onEliminar={eliminar}
            />
          ))
        ) : (
          <div className="no-pedidos-container">
            <h2>No hay pedidos pendientes en cocina 👨‍🍳</h2>
          </div>
        )}
      </div>
    </div>
  );


  if (!auth.rol) {
    return (
      <div className="login-full-screen-wrapper">
        <Login onLogin={manejarLogin} />
      </div>
    );
  }

  if (auth.rol === 'admin') {
    return (
      <div className={`main-app-container ${auth.plataforma}`}>
        <AdminDashboard onLogout={manejarLogout} />
      </div>
    );
  }

  if (auth.rol === 'cocina') {
    return <VistaCocina />;
  }

  if (auth.rol === 'mesero') {
    return (
      <div className="main-app-container movil">
        {/* Aquí puedes crear un componente específico para el mesero luego */}
        <ChefHeader onLogout={manejarLogout} />
        <h2 style={{ color: 'white', textAlign: 'center' }}>Panel de Mesero - Versión Móvil</h2>
      </div>
    );
  }

  return null;
}