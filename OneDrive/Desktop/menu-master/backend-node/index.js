const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); // Esto permite que el servidor entienda formato JSON

// 1. Conexión a la base de datos MongoDB
// 'restaurante_pos' es el nombre de la BD que creamos antes
mongoose.connect('mongodb://127.0.0.1:27017/restaurante_pos')
    .then(() => console.log('¡Conectado a MongoDB con éxito!'))
    .catch(err => console.error(' Error al conectar a MongoDB:', err));

// 2. Ruta de prueba (para saber si el servidor vive)
app.get('/', (req, res) => {
    res.send('El servidor del restaurante está funcionando ');
});
const Notificacion = require('./models/Notificacion');
const Pedido = require('./models/Pedido');

// Ruta para que el Cocinero termine un pedido y avise al Mesero
app.patch('/pedidos/completar/:id', async (req, res) => {
    try {
        // 1. Cambiamos el estado del pedido
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { estado: "LISTO", fecha_actualizacion: Date.now() },
            { new: true }
        );

        // 2. Creamos la notificación para el mesero que hizo el pedido
        const alerta = new Notificacion({
            tipo: "PEDIDO_LISTO",
            id_usuario_destino: pedido.id_mesero, // Se envía al mesero dueño del pedido
        });

        await alerta.save();

        res.json({ mensaje: "Pedido terminado y mesero notificado", pedido, alerta });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para que el mesero vea sus notificaciones pendientes
app.get('/notificaciones/:idUsuario', async (req, res) => {
    const alertas = await Notificacion.find({
        id_usuario_destino: req.params.idUsuario,
        leida: false
    }).sort({ fecha: -1 });

    res.json(alertas);
});
const Venta = require('./models/Venta');

app.get('/admin/corte-dia', async (req, res) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reporte = await Venta.aggregate([
        { $match: { fecha_venta: { $gte: hoy } } }, // Solo ventas de hoy
        {
            $group: {
                _id: null,
                total: { $sum: "$monto_pagado" },
                efectivo: { $sum: { $cond: [{ $eq: ["$metodo_pago", "EFECTIVO"] }, "$monto_pagado", 0] } },
                tarjeta: { $sum: { $cond: [{ $eq: ["$metodo_pago", "TARJETA"] }, "$monto_pagado", 0] } }
            }
        }
    ]);

    res.json(reporte);
});
const Ticket = require('./models/Ticket');

app.post('/tickets/generar', async (req, res) => {
    try {
        // Aquí recibes los datos finales de la venta para "congelarlos" en un ticket
        const nuevoTicket = new Ticket(req.body);
        await nuevoTicket.save();
        res.status(201).json({ mensaje: "Ticket generado correctamente", nuevoTicket });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
const Venta = require('./models/Venta');

app.post('/ventas', async (req, res) => {
    try {
        const nuevaVenta = new Venta(req.body);
        await nuevaVenta.save();

        // Si el monto pagado cubre el total del pedido, podrías marcar el pedido como PAGADO
        res.status(201).json({ mensaje: "Pago registrado con éxito", venta: nuevaVenta });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const Usuario = require('./models/Usuario');
const Mesa = require('./models/Mesa');

// INSERTAR UN USUARIO (Para registrar empleados)
app.post('/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// INSERTAR UNA MESA
app.post('/mesas', async (req, res) => {
    try {
        const nuevaMesa = new Mesa(req.body);
        await nuevaMesa.save();
        res.status(201).json({ mensaje: "Mesa registrada", mesa: nuevaMesa });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
const Pedidos = require('./models/Pedidos');
// Ruta para CREAR un pedido (POST)
app.post('/pedidos', async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        await nuevoPedido.save();
        res.status(201).json({ mensaje: "¡Pedido guardado!", pedido: nuevoPedido });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al guardar pedido", error });
    }
});

// Ruta para VER todos los pedidos (GET)
app.get('/pedidos', async (req, res) => {
    const pedidos = await Pedido.find();
    res.json(pedidos);
});
// El cocinero cambia el estado a "EN_PROCESO"
app.patch('/pedidos/cocinar/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { estado: "EN_PROCESO", id_cocinero: req.body.id_cocinero, fecha_actualizacion: Date.now() },
            { new: true }
        );
        res.json({ mensaje: "Cocinero asignado", pedido });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 3. Encender el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor REST corriendo en http://localhost:${PORT}`);
});