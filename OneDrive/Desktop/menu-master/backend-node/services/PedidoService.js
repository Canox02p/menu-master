// services/PedidoService.js
const Pedido = require('../models/Pedidos'); // Tu modelo Mongoose (MongoDB)
const Mesa = require('../models/Mesa');      // Tu modelo Mongoose de Mesas
const productoRepository = require('../repositories/ProductoRepository'); // Tu repo MySQL

class PedidoService {
    async crearNuevoPedido(datosPedido) {
        // 1. Validar y descontar el stock en MySQL para cada producto pedido
        for (const item of datosPedido.productos) {
            // Asumimos que el JSON trae "id_producto_sql" o similar para enlazarlo
            const id_producto = item.id_producto;
            const cantidad = item.cantidad;

            // Intentamos descontar el stock en la base de datos relacional
            const stockDescontado = await productoRepository.descontarStock(id_producto, cantidad);

            if (!stockDescontado) {
                // Si falla, detenemos todo y lanzamos un error claro
                throw new Error(`Stock insuficiente para el producto con ID: ${id_producto}. Operación cancelada.`);
            }
        }

        // 2. Si todo el stock se descontó correctamente, creamos el pedido en MongoDB
        const nuevoPedido = new Pedido(datosPedido);
        await nuevoPedido.save();

        // 3. Cambiamos el estado de la mesa a OCUPADA en MongoDB
        await Mesa.findByIdAndUpdate(datosPedido.id_mesa, { estado: 'OCUPADA' });

        return nuevoPedido; // Devolvemos el pedido recién creado
    }
}

module.exports = new PedidoService();