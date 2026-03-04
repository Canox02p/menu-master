📖 Documentación de Endpoints Principales
1. 👥 Módulo de Personal (Usuarios)
Registra a un nuevo empleado (Mesero, Cocinero o Admin) en la base de datos.

Método: POST

URL: /usuarios

Body (JSON):

JSON
{
  "nombre": "Nombre del Empleado",
  "email": "correo@restaurante.com",
  "password_hash": "12345",
  "rol": "MESERO" 
}
📌 Nota: Guarda el _id que te devuelva esta petición, será tu ID_MESERO o ID_ADMIN.

2. 🪑 Módulo de Mesas
Da de alta las mesas físicas del restaurante para poder asignarles pedidos.

Método: POST

URL: /mesas

Body (JSON):

JSON
{
  "numero_mesa": 1,
  "nombre_mesa": "Mesa Ventana",
  "estado": "LIBRE"
}
📌 Nota: Guarda el _id de respuesta, será tu ID_MESA.

3. 📝 Módulo de Pedidos (Crear Orden)
El mesero toma la orden. Al crearse, el sistema automáticamente cambia el estado de la mesa a "OCUPADA".

Método: POST

URL: /pedidos

Body (JSON):

JSON
{
  "id_mesa": "PEGA_AQUI_EL_ID_DE_LA_MESA",
  "id_mesero": "PEGA_AQUI_EL_ID_DEL_MESERO",
  "estado": "EN_COCINA",
  "productos": [
    {
      "id_producto": 10,
      "nombre": "Hamburguesa Sencilla",
      "precio_unitario": 100,
      "cantidad": 2,
      "subtotal": 200,
      "estado": "ACTIVO"
    }
  ],
  "total": 200,
  "permite_division": true
}
📌 Nota: Guarda el _id de respuesta, será tu ID_PEDIDO.

4. 👨‍🍳 Módulo de Cocina (Marcar como Listo)
El cocinero presiona un botón para decir que la comida está lista. Actualiza el estado a "LISTO" y genera una notificación para el mesero.

Método: PATCH

URL: /pedidos/PEGA_AQUI_EL_ID_DEL_PEDIDO/listo

Body: Ninguno (Vacío)

5. 💰 Módulo de Ventas (Cobrar y Liberar Mesa)
Registra el pago del cliente. Si la cuenta NO se dividió ("division": false), el sistema automáticamente cierra el pedido, crea el Ticket final y cambia la mesa a "LIBRE".

Método: POST

URL: /ventas

Body (JSON):

JSON
{
  "id_pedido": "PEGA_AQUI_EL_ID_DEL_PEDIDO",
  "id_mesero": "PEGA_AQUI_EL_ID_DEL_MESERO",
  "numero_mesa": 1,
  "nombre_mesa": "Mesa Ventana",
  "nombre_mesero": "Nombre del Mesero",
  "metodo_pago": "EFECTIVO",
  "division": false,
  "monto_pagado": 200,
  "productos_cobrados": [
    { "nombre": "Hamburguesa Sencilla", "cantidad": 2, "precio": 200 }
  ]
}
6. 📊 Módulo de Administración (Corte de caja)
Suma todo el dinero de las ventas en un rango de fechas especificado.

Método: POST

URL: /admin/corte-caja

Body (JSON):

JSON
{
  "inicio": "2026-03-01T00:00:00.000Z",
  "fin": "2026-03-05T23:59:59.000Z",
  "id_admin": "PEGA_AQUI_EL_ID_DEL_ADMIN"
}

---

¡Con esto tu compañero tendrá el mapa completo del tesoro! Podrá leerlo directamente en GitHub o en su propio VS Code.