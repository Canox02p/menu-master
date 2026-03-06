// services/PedidoService.js
const Pedido = require('../models/Pedidos'); // Tu modelo Mongoose (MongoDB)
const Mesa = require('../models/Mesa');      // Tu modelo Mongoose de Mesas
const productoRepository = require('../repositories/ProductoRepository'); // Tu repo MySQL

class PedidoService {
    async crearNuevoPedido(datosPedido) {
        console.log("📥 1. Recibiendo pedido en el Service:", datosPedido.productos.length, "platillos");

        // 1. Validar Stock en MySQL (Modo Flexible para Pruebas)
        try {
            if (productoRepository && productoRepository.descontarStock) {
                for (const item of datosPedido.productos) {
                    const id_producto = item.id_producto;
                    const cantidad = item.cantidad;

                    // Intentamos descontar en la base relacional
                    const stockDescontado = await productoRepository.descontarStock(id_producto, cantidad);

                    if (!stockDescontado) {
                        // ⚠️ CAMBIO CLAVE: En lugar de lanzar un Error y cancelar todo, solo mandamos una advertencia.
                        console.warn(`⚠️ Advertencia: Stock insuficiente o nulo en MySQL para el producto ID: ${id_producto}. Permitiendo la orden para pruebas...`);
                    }
                }
            }
        } catch (error) {
            console.error("⚠️ Error de conexión con MySQL al checar stock:", error.message);
        }

        // 2. Forzamos la escritura en MongoDB
        // Aseguramos que el estado vaya exacto en mayúsculas para que React Web lo lea
        datosPedido.estado = 'EN_COCINA';

        const nuevoPedido = new Pedido(datosPedido);
        const pedidoGuardado = await nuevoPedido.save();
        console.log("✅ 2. Pedido guardado en MongoDB con éxito! ID:", pedidoGuardado._id);

        // 3. Cambiamos el estado de la mesa a OCUPADA (Solo si pasaron un ID válido)
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