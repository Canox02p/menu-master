const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    id_mesa: { type: mongoose.Schema.Types.ObjectId, ref: 'Mesa', required: true },
    id_mesero: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_cocinero: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    estado: {
        type: String,
        enum: ["EN_COCINA", "EN_PROCESO", "LISTO", "ENTREGADO", "PAGADO", "CANCELADO"],
        default: "EN_COCINA"
    },
    productos: [{
        id_producto: Number, // El que viene de MySQL
        nombre: String,
        precio_unitario: Number,
        cantidad: Number,
        subtotal: Number,
        estado: { type: String, enum: ["ACTIVO", "CANCELADO"], default: "ACTIVO" }
    }],
    permite_division: { type: Boolean, default: true },
    total: { type: Number, required: true },
    fecha_creacion: { type: Date, default: Date.now },
    fecha_actualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', PedidoSchema);