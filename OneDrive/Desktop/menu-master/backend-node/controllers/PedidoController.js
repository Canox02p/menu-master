// controllers/PedidoController.js
const pedidoService = require('../services/PedidoService');

class PedidoController {
    async crearPedido(req, res) {
        try {
            // Le pasamos el JSON completo (req.body) a nuestro servicio
            const pedidoCreado = await pedidoService.crearNuevoPedido(req.body);

            // Respondemos con éxito
            res.status(201).json({
                mensaje: "Pedido creado y stock actualizado exitosamente",
                pedido: pedidoCreado
            });
        } catch (error) {
            // Si el servicio lanza un error (ej. sin stock), caemos aquí
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new PedidoController();