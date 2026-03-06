
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1', // O 'localhost'
    user: process.env.DB_USER || 'root',      // Tu usuario de MySQL
    password: process.env.DB_PASSWORD || '',  // Tu contraseña de MySQL
    database: process.env.DB_NAME || 'menu-master', // El nombre de tu BD relacional
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('🔗 BD Relacional (MySQL) Conectada exitosamente');
        connection.release();
    })
    .catch(err => {
        console.error(' Error conectando a MySQL:', err.message);
    });

module.exports = pool;