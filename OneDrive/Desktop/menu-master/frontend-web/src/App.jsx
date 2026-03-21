import React, { useState, useEffect } from 'react';
import { COLORES_RESTO } from "./constants/theme";
import Login from "./features/auth/pages/Login";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import { usePedidosCocina } from "./features/cocina/hooks/usePedidosCocina";
import ChefHeader from "./features/cocina/components/ChefHeader";
import { PedidoCard } from "./features/cocina/components/PedidoCard";
import ChefSettingsModal from "./features/cocina/components/ChefSettingsModal";

import './App.css';

export default function App() {
  const [auth, setAuth] = useState({ rol: null, plataforma: 'web' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.error("Error al parsear la sesión del localStorage:", error);
      localStorage.removeItem('auth');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

  const manejarLogin = (rol, plataforma) => {
    const authData = { rol, plataforma };
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
  };

  const manejarLogout = () => {
    localStorage.removeItem('auth');
    setAuth({ rol: null, plataforma: 'web' });
  };

  const VistaCocina = () => (
    <div id="chef-dashboard-wrapper" className={`main-app-container ${auth.plataforma}`} style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: COLORES_RESTO.fondo,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ChefHeader
        onLogout={manejarLogout}
        onOpenSettings={() => setSettingsOpen(true)}
      />
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

      <ChefSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ height: '100vh', backgroundColor: COLORES_RESTO.fondo }} />
    );
  }

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
        <ChefHeader onLogout={manejarLogout} />
        <h2 style={{ color: 'white', textAlign: 'center' }}>Panel de Mesero - Versión Móvil</h2>
      </div>
    );
  }

  return null;
}