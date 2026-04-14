// Ya NO importamos 'mysql2' ni 'relacional.js'
const PHP_API = process.env.PHP_API_URL || 'https://mediumvioletred-jellyfish-327811.hostingersite.com/productos.php';

class ProductoRepository {
    async obtenerPorId(id_producto) {
        try {
            // Obtenemos el catálogo desde Hostinger
            const response = await fetch(PHP_API);
            const productos = await response.json();

            // Buscamos el producto específico
            const producto = productos.find(p => p.id == id_producto || p.id_producto == id_producto);
            return producto || null;
        } catch (error) {
            console.error("❌ Error al obtener producto de PHP API:", error.message);
            return null;
        }
    }

    async descontarStock(id_producto, cantidad) {
        try {
            // 1. Obtener el producto actual para saber cuánto stock tiene
            const producto = await this.obtenerPorId(id_producto);

            if (!producto || producto.stock < cantidad) {
                console.warn(`⚠️ Stock insuficiente para el producto ${id_producto}`);
                return false;
            }

            // 2. Calcular el nuevo stock
            const nuevoStock = producto.stock - cantidad;

            // 3. Actualizar el producto en MySQL usando tu API en PHP
            const putResponse = await fetch(`${PHP_API}?id=${id_producto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    stock: nuevoStock
                })
            });

            return putResponse.ok;
        } catch (error) {
            console.error("❌ Error al descontar stock en PHP API:", error.message);
            return false;
        }
    }
}

module.exports = new ProductoRepository();