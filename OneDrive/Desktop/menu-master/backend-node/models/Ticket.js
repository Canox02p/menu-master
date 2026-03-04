const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    id_venta: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta' },
    numero_mesa: Number,
    nombre_mesa: String,
    nombre_mesero: String,
    productos: [{
        nombre: String,
        cantidad: Number,
        precio: Number
    }],
    total: Number,
    fecha_generacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);