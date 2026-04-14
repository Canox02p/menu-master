const pedidoService = require('../services/PedidoService');

class PedidoController {
    async crearPedido(req, res) {
        try {
            const pedidoCreado = await pedidoService.crearNuevoPedido(req.body);

            res.status(201).json({
                mensaje: "Pedido creado y stock actualizado exitosamente",
                pedido: pedidoCreado
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new PedidoController();