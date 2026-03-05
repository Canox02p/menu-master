import React from 'react';
import { COLORES_RESTO } from "./constants/theme";
// CAMBIO: Apuntamos a la nueva estructura de carpetas
import { usePedidosCocina } from "./features/cocina/hooks/usePedidosCocina";
import { Header } from "./features/cocina/components/Header";
import { OrderCard } from "./features/cocina/components/OrderCard";

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
          <OrderCard
            key={p._id}
            pedido={p}
            onListo={(id) => actualizarEstado(id, 'LISTO')}
            onCancelar={(id) => eliminar(id)}
          />
        ))}
      </div>
    </div>
  );
}