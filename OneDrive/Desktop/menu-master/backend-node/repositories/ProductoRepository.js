// repositories/ProductoRepository.js
const pool = require('../config/relacional');

class ProductoRepository {
    // Busca un producto específico por su ID
    async obtenerPorId(id_producto) {
        const [rows] = await pool.query(
            'SELECT * FROM productos WHERE id_producto = ?',
            [id_producto]
        );
        return rows[0]; // Retorna el producto o undefined si no existe
    }

    // Descuenta el stock solo si hay suficiente cantidad
    async descontarStock(id_producto, cantidad) {
        const [result] = await pool.query(
            'UPDATE productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?',
            [cantidad, id_producto, cantidad]
        );
        // Si affectedRows es mayor a 0, significa que sí había stock y se descontó
        return result.affectedRows > 0;
    }
}

// Exportamos una única instancia (Patrón Singleton)
module.exports = new ProductoRepository();