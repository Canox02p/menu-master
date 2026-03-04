const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    rol: { type: String, enum: ["ADMIN", "MESERO", "COCINERO"], required: true },
    estado: { type: String, enum: ["ACTIVO", "INACTIVO"], default: "ACTIVO" },
    fecha_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);