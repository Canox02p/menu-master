const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/relacional');

const pedidoController = require('./controllers/PedidoController');

const Usuario = require('./models/Usuario');
const Mesa = require('./models/Mesa');
const Pedido = require('./models/Pedidos');
const Venta = require('./models/Venta');
const Ticket = require('./models/Ticket');
const CorteCaja = require('./models/CorteCaja');
const Estadistica = require('./models/Estadistica');
const Notificacion = require('./models/Notificacion');

const app = express();
app.use(express.json());
app.use(cors());

// --- 🍃 CONEXIÓN A MONGODB ---
mongoose.connect('mongodb://127.0.0.1:27017/restaurante_pos')
    .then(() => console.log(' BD No Relacional (MongoDB) Conectada'))
    .catch(err => console.error(' Error de conexión MongoDB:', err));

// ==========================================
// 🔐 1. MÓDULO DE AUTENTICACIÓN
// ==========================================
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email, password_hash: password });
    if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });
    res.json({ mensaje: "Login exitoso", usuario });
});

// ==========================================
// 👥 2. MÓDULO DE USUARIOS
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
// 🪑 3. MÓDULO DE MESAS
// ==========================================
app.post('/mesas', async (req, res) => {
    try {
        const mesa = new Mesa(req.body);
        await mesa.save();
        res.status(201).json(mesa);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/mesas', async (req, res) => {
    const mesas = await Mesa.find();
    res.json(mesas);
});

app.patch('/mesas/:id/estado', async (req, res) => {
    const mesa = await Mesa.findByIdAndUpdate(
        req.params.id,
        { estado: req.body.estado, fecha_actualizacion: Date.now() },
        { new: true }
    );
    res.json(mesa);
});

app.delete('/mesas/:id', async (req, res) => {
    try {
        await Mesa.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Mesa eliminada correctamente de la base de datos" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// 📝 4. MÓDULO DE PEDIDOS (MÓVIL)
// ==========================================
app.post('/pedidos', (req, res) => pedidoController.crearPedido(req, res));

app.get('/pedidos/activos', async (req, res) => {
    const pedidos = await Pedido.find({ estado: { $ne: 'PAGADO' } }).populate('id_mesa');
    res.json(pedidos);
});

// ==========================================
// 👨‍🍳 5. MÓDULO DE COCINA (WEB)
// ==========================================
app.get('/pedidos/cocina', async (req, res) => {
    const pedidos = await Pedido.find({ estado: { $in: ['EN_COCINA', 'EN_PROCESO'] } })
        .sort({ fecha_creacion: 1 });
    res.json(pedidos);
});

app.patch('/pedidos/:id/estado', async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { estado: req.body.estado, fecha_actualizacion: Date.now() },
            { new: true }
        );

        if (req.body.estado === 'LISTO') {
            const alerta = new Notificacion({
                tipo: 'PEDIDO_LISTO',
                id_usuario_destino: pedido.id_mesero
            });
            await alerta.save();
        }
        res.json(pedido);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/pedidos/:id', async (req, res) => {
    try {
        await Pedido.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Pedido cancelado y eliminado correctamente" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 📦 6. MÓDULO DE INVENTARIO (MySQL)
// ==========================================
app.get('/productos', async (req, res) => {
    try {
        // ✨ LA MAGIA: Unimos la tabla productos con la tabla categorias
        const query = `
            SELECT 
                p.id_producto AS id, 
                p.nombre, 
                p.precio, 
                c.nombre AS categoria 
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        `;

        const [rows] = await db.query(query);
        console.log("📦 Productos extraídos con éxito:", rows);

        res.json(rows);
    } catch (err) {
        console.error("Error en MySQL:", err.message);
        res.status(500).json({ error: "No se pudo conectar con el inventario" });
    }
});
// ==========================================
// 💰 7. MÓDULO DE VENTAS Y TICKETS
// ==========================================
app.post('/ventas', async (req, res) => {
    try {
        const venta = new Venta(req.body);
        await venta.save();

        const ticket = new Ticket({
            id_venta: venta._id,
            numero_mesa: req.body.numero_mesa,
            nombre_mesa: req.body.nombre_mesa,
            nombre_mesero: req.body.nombre_mesero,
            detalle_productos: req.body.productos_cobrados,
            total: venta.monto_pagado
        });
        await ticket.save();

        if (req.body.division === false) {
            await Pedido.findByIdAndUpdate(req.body.id_pedido, { estado: 'PAGADO' });
            await Mesa.findOneAndUpdate({ numero_mesa: req.body.numero_mesa }, { estado: 'LIBRE' });
        }

        res.status(201).json({ mensaje: "Venta registrada", venta, ticket });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 📊 8. MÓDULO ADMINISTRADOR Y ESTADÍSTICAS
// ==========================================
app.post('/admin/corte-caja', async (req, res) => {
    try {
        const { inicio, fin, id_admin } = req.body;
        const ventas = await Venta.find({
            fecha_venta: { $gte: new Date(inicio), $lte: new Date(fin) }
        });

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

        res.json(corte);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 🔔 9. MÓDULO DE NOTIFICACIONES
// ==========================================
app.get('/notificaciones/:id_usuario', async (req, res) => {
    const alertas = await Notificacion.find({
        id_usuario_destino: req.params.id_usuario,
        leida: false
    });
    res.json(alertas);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor POS corriendo en http://localhost:${PORT}`);
});