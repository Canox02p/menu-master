Markdown
# 🍔 Restaurante POS - Backend API (Arquitectura Híbrida)

Bienvenido al núcleo del Sistema de Punto de Venta (POS) para nuestro restaurante. Esta API RESTful está construida con **Node.js y Express**, y sirve como el puente de comunicación entre nuestras interfaces (Frontend Web en React y Frontend Móvil en React Native) y nuestras bases de datos.

## 🏗️ ¿Cómo funciona? (Arquitectura y SOLID)

Este proyecto destaca por implementar una **Arquitectura Híbrida de Bases de Datos**, separando las responsabilidades operativas de las de inventario, basándonos en los **Principios SOLID** (uso de Controladores, Servicios y Repositorios para no mezclar el código).

1. **Base de Datos NoSQL (MongoDB + Mongoose):** * **Uso:** Flujo operativo rápido y dinámico.
   * **Datos:** Mesas, Pedidos (en tiempo real), Tickets, Ventas y Notificaciones.
2. **Base de Datos Relacional (MySQL):** * **Uso:** Inventario corporativo estricto y transaccional.
   * **Datos:** Base de datos `menu-master` que contiene las tablas `categorias`, `productos` y `proveedores`.



---

## ⚙️ 1. Requisitos Previos

Antes de intentar correr este proyecto, asegúrate de tener instalado en tu computadora:
* **Node.js** (Versión LTS recomendada).
* **MongoDB Community Server** (¡Importante!: Debe estar instalado como **Servicio de Windows** para que corra automáticamente en segundo plano).
* **MySQL** (Ya sea nativo, mediante XAMPP, WAMP o Docker).

---

## 🚀 2. Instalación y Preparación (Paso a Paso)

Para evitar problemas con las rutas de Windows, la forma más segura de inicializar el proyecto es a través de VS Code:

1. Abre tu carpeta general del proyecto en VS Code.
2. En el panel izquierdo, haz **clic derecho** sobre la carpeta `backend-node` y selecciona **"Abrir en el terminal integrado"**.
3. Una vez en la terminal correcta, instala las dependencias base ejecutando:
   ```bash
   npm install
Instalación de Drivers: Asegúrate de instalar el driver de conexión para la base de datos MySQL (crucial para la arquitectura híbrida):

Bash
npm install mysql2
Nota de emergencias (Ruta absoluta): Si tu terminal se pierde, puedes navegar directamente a la carpeta usando este comando en tu consola de Windows (ajusta tu usuario si es necesario):
cd "C:\Users\uriel\OneDrive\Desktop\menu-master\onedrive\desktop\menu-master\backend-node"

Configuración del Entorno (.env)
Crea un archivo llamado .env en la raíz de la carpeta backend-node (al mismo nivel que index.js) y pega las credenciales de tus bases de datos:

Fragmento de código
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=menu-master
(Nota: Si tu usuario de MySQL tiene contraseña, colócala en DB_PASSWORD).

🗄️ 3. Conexión de las Bases de Datos
Para que la API no arroje errores, ambas bases de datos deben estar listas y encendidas.

🍃 A) MongoDB (El motor NoSQL)
Si instalaste MongoDB correctamente marcando la casilla "Install MongoD as a Service", no necesitas hacer nada. Windows lo enciende automáticamente por ti en el puerto 27017 cada vez que prendes tu equipo.

🐬 B) MySQL (El motor Relacional)
Enciende tu servidor MySQL (por ejemplo, dándole a "Start" en el panel de XAMPP).

Abre tu gestor de base de datos favorito (phpMyAdmin, DBeaver, MySQL Workbench).

Crea una base de datos llamada menu-master.

Importa o crea las tablas productos, categorias y proveedores según el diagrama relacional del proyecto.

▶️ 4. Encender el Servidor
Con tus bases de datos corriendo y tus dependencias instaladas, abre la terminal dentro de la carpeta backend-node y ejecuta:

cd "C:\Users\uriel\OneDrive\Desktop\menu-master\onedrive\desktop\menu-master\backend-node"

node index.js

Si todo está perfecto, verás esta confirmación en la consola:

Plaintext
🟢 BD No Relacional (MongoDB) Conectada
🔗 BD Relacional (MySQL) Conectada exitosamente
🚀 Servidor POS corriendo en http://localhost:3000
📖 5. Endpoints Principales (API Reference)
👥 Personal y Mesas
POST /auth/login - Verifica credenciales del personal.

POST /usuarios - Registra un nuevo empleado.

GET /mesas - Obtiene el estado actual de todas las mesas.

📝 Pedidos (Flujo Híbrido)
POST /pedidos - [NÚCLEO DEL SISTEMA] Recibe la orden del mesero, se conecta a MySQL para descontar el stock exacto de los productos, y si hay éxito, guarda el ticket activo en MongoDB cambiando la mesa a "OCUPADA".

PATCH /pedidos/:id/listo - Uso exclusivo de cocina. Cambia el estado y emite notificación.

💰 Ventas
POST /ventas - Cobra el pedido, permite división de cuentas, genera el ticket final en el historial y libera la mesa para nuevos clientes.

POST /admin/corte-caja - Calcula ingresos totales filtrados por fecha y tipo de pago (Efectivo/Tarjeta).