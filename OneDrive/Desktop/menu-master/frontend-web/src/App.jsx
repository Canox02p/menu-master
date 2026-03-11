import React, { useState } from 'react';
import { COLORES_RESTO } from "./constants/theme";

// Importamos el Login
import Login from "./features/auth/pages/Login";

// Importamos la vista de Administrador
import AdminDashboard from "./features/admin/pages/AdminDashboard";

// Importamos lo de Cocina
import { usePedidosCocina } from "./features/cocina/hooks/usePedidosCocina";
import { Header } from "./features/cocina/components/Header";
import { PedidoCard } from "./features/cocina/components/PedidoCard";

export default function App() {
  // 🔄 ESTADO DE AUTENTICACIÓN (null = no logueado)
  const [rolUsuario, setRolUsuario] = useState(null);

  // Hooks de la cocina
  const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

  // Función para manejar el login exitoso
  const manejarLogin = (rol) => {
    setRolUsuario(rol); // Puede ser 'admin' o 'cocina'
  };

  // Función para cerrar sesión
  const manejarLogout = () => {
    setRolUsuario(null);
  };

  // 👨‍🍳 COMPONENTE DE LA COCINA
  const VistaCocina = () => (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: COLORES_RESTO.fondo, display: 'flex', flexDirection: 'column' }}>
      <Header onLogout={manejarLogout} /> {/* Sería ideal pasarle el logout al header después */}

      {/* Botón temporal de cerrar sesión para la cocina */}
      <button onClick={manejarLogout} style={{ position: 'absolute', top: 15, left: 15, padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cerrar Sesión</button>

      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: '1fr', gap: '15px', padding: '15px', boxSizing: 'border-box'
      }}>
        {pedidos.map(p => (
          <PedidoCard key={p._id} pedido={p} onActualizar={actualizarEstado} onEliminar={eliminar} />
        ))}
      </div>
    </div>
  );

  // 🚦 ENRUTADOR (ROUTER) BASADO EN EL ROL
  if (!rolUsuario) {
    return <Login onLogin={manejarLogin} />;
  }

  if (rolUsuario === 'admin') {
    return (
      <div style={{ position: 'relative' }}>
        {/* Botón temporal de cerrar sesión para el admin */}
        <button onClick={manejarLogout} style={{ position: 'absolute', top: 15, right: 300, padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', zIndex: 9999 }}>Cerrar Sesión</button>
        <AdminDashboard />
      </div>
    );
  }

  if (rolUsuario === 'cocina') {
    return <VistaCocina />;
  }
}