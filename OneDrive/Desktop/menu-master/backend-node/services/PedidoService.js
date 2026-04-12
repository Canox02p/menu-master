const Pedido = require('../models/Pedidos');
const Mesa = require('../models/Mesa');
const productoRepository = require('../repositories/ProductoRepository');

class PedidoService {
    async crearNuevoPedido(datosPedido) {
        console.log("📥 1. Recibiendo pedido en el Service:", datosPedido.productos.length, "platillos");

        try {
            if (productoRepository && productoRepository.descontarStock) {
                for (const item of datosPedido.productos) {
                    const id_producto = item.id_producto;
                    const cantidad = item.cantidad;

                    const stockDescontado = await productoRepository.descontarStock(id_producto, cantidad);

                    if (!stockDescontado) {
                        console.warn(`⚠️ Advertencia: Stock insuficiente o nulo en MySQL para el producto ID: ${id_producto}. Permitiendo la orden para pruebas...`);
                    }
                }
            }
        } catch (error) {
            console.error("⚠️ Error de conexión con MySQL al checar stock:", error.message);
        }

        datosPedido.estado = 'EN_COCINA';

        const nuevoPedido = new Pedido(datosPedido);
        const pedidoGuardado = await nuevoPedido.save();
        console.log("✅ 2. Pedido guardado en MongoDB con éxito! ID:", pedidoGuardado._id);

        if (datosPedido.id_mesa) {
            try {
                await Mesa.findByIdAndUpdate(datosPedido.id_mesa, { estado: 'OCUPADA' });
                console.log("🟢 3. Estado de la Mesa actualizado a OCUPADA en MongoDB");
            } catch (error) {
                console.warn("⚠️ No se pudo actualizar la mesa, revisa que 'id_mesa' sea un ObjectId válido de Mongoose.");
            }
        }

        return pedidoGuardado;
    }
}

module.exports = new PedidoService();