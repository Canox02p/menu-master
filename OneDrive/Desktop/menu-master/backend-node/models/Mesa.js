const mongoose = require('mongoose');

const MesaSchema = new mongoose.Schema({
    numero_mesa: { type: Number, required: true, unique: true },
    nombre_mesa: String,
    descripcion: String,
    estado: { type: String, enum: ["LIBRE", "OCUPADA"], default: "LIBRE" },
    id_mesero_actual: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fecha_actualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mesa', MesaSchema);