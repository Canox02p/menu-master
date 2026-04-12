const pool = require('../config/relacional');

class ProductoRepository {
    async obtenerPorId(id_producto) {
        const [rows] = await pool.query(
            'SELECT * FROM productos WHERE id_producto = ?',
            [id_producto]
        );
        return rows[0];
    }

    async descontarStock(id_producto, cantidad) {
        const [result] = await pool.query(
            'UPDATE productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?',
            [cantidad, id_producto, cantidad]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new ProductoRepository();