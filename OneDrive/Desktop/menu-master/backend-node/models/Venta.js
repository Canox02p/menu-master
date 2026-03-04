const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    id_pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
    id_mesero: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    numero_mesa: { type: Number, required: true },
    metodo_pago: { type: String, enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA"], required: true },
    division: { type: Boolean, default: false },
    monto_pagado: { type: Number, required: true },
    fecha_venta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venta', VentaSchema);