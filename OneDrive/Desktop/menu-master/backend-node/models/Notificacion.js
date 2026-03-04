const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ["PEDIDO_LISTO", "PEDIDO_CANCELADO"],
        required: true
    },
    id_usuario_destino: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    leida: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);