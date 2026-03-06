import React from 'react';
import { COLORES_RESTO } from "./constants/theme";
import { usePedidosCocina } from "./features/cocina/hooks/usePedidosCocina";
import { Header } from "./features/cocina/components/Header";
import { PedidoCard } from "./features/cocina/components/PedidoCard";

export default function App() {
  const { pedidos, actualizarEstado, eliminar } = usePedidosCocina();

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: COLORES_RESTO.fondo, display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gridAutoRows: '1fr', gap: '15px', padding: '15px', boxSizing: 'border-box'
      }}>
        {pedidos.map(p => (
          <PedidoCard
            key={p._id}
            pedido={p}
            // ✅ PROPS CORREGIDAS: Deben llamarse igual que en el componente PedidoCard
            onActualizar={actualizarEstado}
            onEliminar={eliminar}
          />
        ))}
      </div>
    </div>
  );
}