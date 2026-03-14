export const mockPedidosCocina = [
  {
    _id: "664e8b3c9f2b8e1b4f3b7f8c",
    id_mesa: "m2",
    numero_mesa: 2,
    mesero_nombre: "Juan Pérez",
    estado: "EN_COCINA",
    productos: [
      { _id: "p1", id_producto: 101, nombre: "Hamburguesa Clásica", cantidad: 2, nota: "Una sin cebolla" },
      { _id: "p2", id_producto: 102, nombre: "Papas Fritas Grandes", cantidad: 1, nota: null },
      { _id: "p3", id_producto: 103, nombre: "Refresco de Cola", cantidad: 2, nota: null },
    ],
    total: 28.50,
    fecha_creacion: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    _id: "664e8b3c9f2b8e1b4f3b7f8d",
    id_mesa: "m7",
    numero_mesa: 11,
    mesero_nombre: "Ana Gómez",
    estado: "EN_PROCESO",
    productos: [
      { _id: "p4", id_producto: 201, nombre: "Pizza Pepperoni", cantidad: 1, nota: "Extra queso" },
      { _id: "p5", id_producto: 202, nombre: "Ensalada César con Pollo", cantidad: 1, nota: "Aderezo aparte" },
    ],
    total: 35.00,
    fecha_creacion: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    _id: "664e8b3c9f2b8e1b4f3b7f8e",
    id_mesa: "m4",
    numero_mesa: 4,
    mesero_nombre: "Carlos Ruiz",
    estado: "EN_COCINA",
    productos: [
      { _id: "p6", id_producto: 301, nombre: "Sopa de Tortilla", cantidad: 1, nota: null },
      { _id: "p7", id_producto: 302, nombre: "Tacos al Pastor (Orden)", cantidad: 2, nota: "Con todo" },
      { _id: "p8", id_producto: 303, nombre: "Agua de Horchata (1L)", cantidad: 1, nota: null },
    ],
    total: 22.75,
    fecha_creacion: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];
