const mongoose = require('mongoose');

const EstadisticaSchema = new mongoose.Schema({
    id_admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    tipo_consulta: {
        type: String,
        enum: ["VENTAS_MES", "PRODUCTOS_TOP", "CORTE_CAJA"]
    },
    fecha_consulta: { type: Date, default: Date.now },
    rango_inicio: Date,
    rango_fin: Date
});

module.exports = mongoose.model('Estadistica', EstadisticaSchema);