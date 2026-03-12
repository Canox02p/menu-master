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

// Importamos el CSS global adaptativo
import './App.css';

export default function App() {
  // 🔄 ESTADO DUAL: Guardamos el rol y la plataforma (web/movil)
  const [auth, setAuth] = useState({ rol: null, plataforma: 'web' });

  // Hook de sincronización
  const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

  // Ahora el login nos pasa dos cosas: el rol y la plataforma elegida
  const manejarLogin = (rol, plataforma) => {
    setAuth({ rol, plataforma });
  };

  const manejarLogout = () => {
    setAuth({ rol: null, plataforma: 'web' });
  };

  // 👨‍🍳 VISTA DE COCINA (SE ADAPTA A LA PLATAFORMA)
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

  // 🚦 ENRUTADOR DE ROLES Y PLATAFORMAS

  // 1. Si no hay sesión, mostramos el Login
  if (!auth.rol) {
    return (
      <div className="login-full-screen-wrapper">
        <Login onLogin={manejarLogin} />
      </div>
    );
  }

  // 2. Vista de Administrador
  if (auth.rol === 'admin') {
    return (
      <div className={`main-app-container ${auth.plataforma}`}>
        <AdminDashboard onLogout={manejarLogout} />
      </div>
    );
  }

  // 3. Vista de Cocina (Cocinero)
  if (auth.rol === 'cocina') {
    return <VistaCocina />;
  }

  // 4. Vista de Mesero (Nueva opción para el móvil)
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