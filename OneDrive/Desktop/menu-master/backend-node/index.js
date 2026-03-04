const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Vital para conectar con React/React Native
require('dotenv').config();

// IMPORTACIÓN DE MODELOS (Debes tener estos 8 archivos en la carpeta models)
const Usuario = require('./models/Usuario');
const Mesa = require('./models/Mesa');
const Pedido = require('./models/Pedidos');
const Venta = require('./models/Venta');
const Ticket = require('./models/Ticket');
const CorteCaja = require('./models/CorteCaja');
const Estadistica = require('./models/Estadistica'); // Coleccion: estadisticas_consultas
const Notificacion = require('./models/Notificacion');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONEXIÓN A MONGODB ---
mongoose.connect('mongodb://127.0.0.1:27017/restaurante_pos')
    .then(() => console.log('✅ BD No Relacional (MongoDB) Conectada'))
    .catch(err => console.error('❌ Error de conexión:', err));

// ==========================================
// 🔐 1. MÓDULO DE AUTENTICACIÓN (JWT Base)
// ==========================================
app.post('/auth/login', async (req, res) => {
    // Aquí a futuro implementaremos bcrypt y jwt.sign
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email, password_hash: password });
    if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });
    res.json({ mensaje: "Login exitoso", usuario });
});

// ==========================================
// 👥 2. MÓDULO DE USUARIOS (HU-22)
// ==========================================
app.post('/usuarios', async (req, res) => {
    try {
        const usuario = new Usuario(req.body);
        await usuario.save();
        res.status(201).json(usuario);
    } catch (err) { res.status(400).json({ error: err.message }); }
});
app.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

// ==========================================
// 🪑 3. MÓDULO DE MESAS (HU-02, HU-09, HU-23)
// ==========================================
app.post('/mesas', async (req, res) => { // HU-23: Admin configura mesas
    try {
        const mesa = new Mesa(req.body);
        await mesa.save();
        res.status(201).json(mesa);
    } catch (err) { res.status(400).json({ error: err.message }); }
});
app.get('/mesas', async (req, res) => { // HU-02: Mapa visual
    const mesas = await Mesa.find();
    res.json(mesas);
});
app.patch('/mesas/:id/estado', async (req, res) => { // HU-09: Cambiar estado
    const mesa = await Mesa.findByIdAndUpdate(req.params.id, { estado: req.body.estado, fecha_actualizacion: Date.now() }, { new: true });
    res.json(mesa);
});

// ==========================================
// 📝 4. MÓDULO DE PEDIDOS (MESERO) (HU-01, 03, 06, 07, 21)
// ==========================================
app.post('/pedidos', async (req, res) => { // HU-01 y HU-07: Toma de orden
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();
        // Cambiar estado de la mesa a OCUPADA
        await Mesa.findByIdAndUpdate(req.body.id_mesa, { estado: 'OCUPADA' });
        res.status(201).json(pedido);
    } catch (err) { res.status(400).json({ error: err.message }); }
});
app.get('/pedidos/activos', async (req, res) => { // HU-06: Ver pedidos activos
    const pedidos = await Pedido.find({ estado: { $ne: 'PAGADO' } }).populate('id_mesa');
    res.json(pedidos);
});
app.put('/pedidos/:id', async (req, res) => { // HU-03: Editar o cancelar productos
    req.body.fecha_actualizacion = Date.now();
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pedido);
});

// ==========================================
// 👨‍🍳 5. MÓDULO DE COCINA (HU-12, 13, 14, 15)
// ==========================================
app.get('/pedidos/cocina', async (req, res) => { // HU-12 y HU-15: Pantalla cocina
    const pedidos = await Pedido.find({ estado: { $in: ['EN_COCINA', 'EN_PROCESO'] } }).sort({ fecha_creacion: 1 });
    res.json(pedidos);
});
app.patch('/pedidos/:id/listo', async (req, res) => { // HU-14: Marcar listo y notificar
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado: 'LISTO' }, { new: true });

    // Generar notificación al mesero
    const alerta = new Notificacion({ tipo: 'PEDIDO_LISTO', id_usuario_destino: pedido.id_mesero });
    await alerta.save();

    res.json({ mensaje: "Pedido listo", pedido, alerta });
});

// ==========================================
// 💰 6. MÓDULO DE VENTAS Y TICKETS (HU-04, 05, 26, 27)
// ==========================================
app.post('/ventas', async (req, res) => {
    try {
        // HU-04, 05 y 26: Cobro y división de cuenta
        const venta = new Venta(req.body);
        await venta.save();

        // HU-27: Generar Ticket Histórico Automático
        const ticket = new Ticket({
            id_venta: venta._id,
            numero_mesa: req.body.numero_mesa,
            nombre_mesa: req.body.nombre_mesa,
            nombre_mesero: req.body.nombre_mesero,
            detalle_productos: req.body.productos_cobrados, // Los que se pagaron en esta transacción
            total: venta.monto_pagado
        });
        await ticket.save();

        // Si la cuenta NO se dividió, cerramos el pedido y liberamos la mesa
        if (req.body.division === false) {
            await Pedido.findByIdAndUpdate(req.body.id_pedido, { estado: 'PAGADO' });
            await Mesa.findOneAndUpdate({ numero_mesa: req.body.numero_mesa }, { estado: 'LIBRE' });
        }

        res.status(201).json({ mensaje: "Venta registrada", venta, ticket });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 📊 7. MÓDULO ADMINISTRADOR Y ESTADÍSTICAS (HU-16, 17, 19, 20, 24)
// ==========================================
app.post('/admin/corte-caja', async (req, res) => { // HU-19: Corte de caja
    try {
        const { inicio, fin, id_admin } = req.body;
        const ventas = await Venta.find({ fecha_venta: { $gte: new Date(inicio), $lte: new Date(fin) } });

        let total = 0, efectivo = 0, tarjeta = 0;
        ventas.forEach(v => {
            total += v.monto_pagado;
            if (v.metodo_pago === 'EFECTIVO') efectivo += v.monto_pagado;
            if (v.metodo_pago === 'TARJETA') tarjeta += v.monto_pagado;
        });

        const corte = new CorteCaja({
            fecha_inicio: inicio, fecha_fin: fin, total_ventas: total,
            total_efectivo: efectivo, total_tarjeta: tarjeta, generado_por: id_admin
        });
        await corte.save();

        // Registrar la consulta (HU-20)
        await new Estadistica({ id_admin, tipo_consulta: 'CORTE_CAJA', rango_consultado: `${inicio} - ${fin}` }).save();

        res.json(corte);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 🔔 8. MÓDULO DE NOTIFICACIONES (HU-25)
// ==========================================
app.get('/notificaciones/:id_usuario', async (req, res) => {
    const alertas = await Notificacion.find({ id_usuario_destino: req.params.id_usuario, leida: false });
    res.json(alertas);
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor POS corriendo perfectamente en http://localhost:${PORT}`);
});