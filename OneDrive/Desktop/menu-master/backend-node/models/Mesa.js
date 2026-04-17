const mongoose = require('mongoose');

const MesaSchema = new mongoose.Schema({
    numero_mesa: { type: Number, required: true, unique: true },
    nombre_mesa: String,
    descripcion: String,
    area: { type: String, default: "Principal" },
    estado: { type: String, enum: ["LIBRE", "OCUPADA", "RESERVADA"], default: "LIBRE" },
    id_mesero_actual: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fecha_actualizacion: { type: Date, default: Date.now },
    capacidad: { type: Number, default: 4 },
    ubicacion: { type: String, default: "Principal" }
});

module.exports = mongoose.model('Mesa', MesaSchema);