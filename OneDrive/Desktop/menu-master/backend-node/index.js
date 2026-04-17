const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// ✅ ACTUALIZADO: Tu dominio real de Hostinger
const PHP_API = process.env.PHP_API_URL || 'https://mediumvioletred-jellyfish-327811.hostingersite.com/productos.php';

// --- 🍃 CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 BD No Relacional (MongoDB) Conectada'))
    .catch(err => console.error('❌ Error de conexión MongoDB:', err));

// ==========================================
// 🔐 1. MÓDULO DE AUTENTICACIÓN Y REGISTRO SaaS
// ==========================================
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email, password_hash: password });
    if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });

    // Aquí puedes incluir la generación de JWT en el futuro
    res.json({ mensaje: "Login exitoso", usuario, token: "jwt-temporal-hasta-que-lo-implementes" });
});

app.post('/auth/register-company', async (req, res) => {
    try {
        const { nombreRestaurante, nombreDueno, correo, password } = req.body;

        const existe = await Usuario.findOne({ email: correo });
        if (existe) return res.status(400).json({ error: "Este correo ya está registrado." });

        const nuevoAdmin = new Usuario({
            nombre: nombreDueno,
            email: correo,
            password_hash: password,
            roles: ["ADMIN"],
            restaurante_nombre: nombreRestaurante
        });

        await nuevoAdmin.save();
        res.status(201).json({ mensaje: "Restaurante registrado con éxito", usuario: nuevoAdmin });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la empresa: " + error.message });
    }
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

app.put('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(usuario);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (err) { res.status(400).json({ error: err.message }); }
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

app.put('/mesas/:id', async (req, res) => {
    try {
        const mesaActualizada = await Mesa.findByIdAndUpdate(
            req.params.id,
            {
                numero_mesa: req.body.numero_mesa,
                capacidad: req.body.capacidad,
                ubicacion: req.body.ubicacion,
                fecha_actualizacion: Date.now()
            },
            { new: true }
        );

        if (!mesaActualizada) return res.status(404).json({ error: "Mesa no encontrada" });
        res.json(mesaActualizada);
    } catch (err) { res.status(400).json({ error: err.message }); }
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
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ==========================================
// 📝 4. MÓDULO DE PEDIDOS (MÓVIL)
// ==========================================
app.post('/pedidos', (req, res) => pedidoController.crearPedido(req, res));

// ✨ NUEVA RUTA: Obtiene TODOS los pedidos (Activos e Historial) con información completa de mesero y mesa
app.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate('id_mesa')
            .populate('id_mesero', 'nombre')
            .sort({ fecha_creacion: -1 }); // Los más recientes primero
        res.json(pedidos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/pedidos/activos', async (req, res) => {
    const pedidos = await Pedido.find({ estado: { $ne: 'PAGADO' } })
        .populate('id_mesa')
        .populate('id_mesero', 'nombre');
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
// 📦 6. MÓDULO DE INVENTARIO
// ==========================================
app.get('/productos', async (req, res) => {
    try {
        const response = await fetch(PHP_API);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "No se pudo conectar con el inventario PHP" });
    }
});

app.post('/productos', async (req, res) => {
    try {
        const response = await fetch(PHP_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: "No se pudo crear el producto en MySQL" });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const response = await fetch(`${PHP_API}?id=${req.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "No se pudo actualizar el producto" });
    }
});

app.delete('/productos/:id', async (req, res) => {
    try {
        const response = await fetch(`${PHP_API}?id=${req.params.id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "No se pudo eliminar el producto" });
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

// ✨ NUEVA RUTA: Historial de Ventas Profundamente Anidado
app.get('/ventas', async (req, res) => {
    try {
        const ventas = await Venta.find()
            .populate({
                path: 'id_pedido', // Traemos el pedido para ver productos y HORA DE LLEGADA (fecha_creacion)
                populate: { path: 'id_mesa' } // Dentro del pedido, traemos la MESA (capacidad y ubicación)
            })
            .populate('id_mesero', 'nombre') // Traemos el nombre real del mesero
            .sort({ fecha_venta: -1 }) // Los cobros más recientes primero
            .limit(100);
        res.json(ventas);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 📊 8. ESTADÍSTICAS COMPLETAS
// ==========================================
app.get('/admin/stats-completo', async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        const vHoyStats = await Venta.aggregate([
            { $match: { fecha_venta: { $gte: hoy } } },
            { $group: { _id: null, total: { $sum: "$monto_pagado" }, cantidad: { $sum: 1 } } }
        ]);

        const ventasHoyMonto = vHoyStats[0]?.total || 0;
        const pedidosDiaCant = vHoyStats[0]?.cantidad || 0;
        const ticketPromedio = pedidosDiaCant > 0 ? (ventasHoyMonto / pedidosDiaCant) : 0;

        const vMes = await Venta.aggregate([
            { $match: { fecha_venta: { $gte: inicioMes } } },
            { $group: { _id: null, total: { $sum: "$monto_pagado" } } }
        ]);

        let crack = "Sin datos";
        try {
            const phpRes = await fetch(PHP_API);
            const productos = await phpRes.json();
            if (productos.length > 0) {
                crack = productos.sort((a, b) => b.precio - a.precio)[0].nombre;
            }
        } catch (e) {
            console.warn("⚠️ No se pudo obtener producto destacado de PHP API");
        }

        const totalMesas = await Mesa.countDocuments();
        const ocupadas = await Mesa.countDocuments({ estado: 'OCUPADA' });
        const ultimos = await Pedido.find().sort({ fecha_creacion: -1 }).limit(5);

        res.json({
            kpis: {
                ventasHoy: ventasHoyMonto,
                pedidosDia: pedidosDiaCant,
                ingresosMes: vMes[0]?.total || 0,
                ticketPromedio,
                crack,
                ocupacion: {
                    porcentaje: totalMesas > 0 ? Math.round((ocupadas / totalMesas) * 100) : 0,
                    ocupadas,
                    libres: totalMesas - ocupadas
                }
            },
            recientes: ultimos
        });
    } catch (err) {
        console.error("Error en analíticas:", err.message);
        res.status(500).json({ error: err.message });
    }
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
    console.log(`🚀 Servidor POS corriendo en http://localhost:${PORT}`);
});