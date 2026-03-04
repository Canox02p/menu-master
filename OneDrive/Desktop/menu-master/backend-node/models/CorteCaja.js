const mongoose = require('mongoose');

const CorteCajaSchema = new mongoose.Schema({
    fecha_inicio: Date,
    fecha_fin: Date,
    total_ventas: Number,
    total_efectivo: Number,
    total_tarjeta: Number,
    generado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // El Admin
    fecha_generacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CorteCaja', CorteCajaSchema);