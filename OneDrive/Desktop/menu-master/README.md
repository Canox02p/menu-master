🍽️ Menu-Master: Sistema Integral de Gestión Gastronómica
Menu-Master es una solución tecnológica híbrida (Web y Móvil) diseñada para optimizar la operación de restaurantes modernos. El proyecto aplica principios de ingeniería de software avanzada, incluyendo SOLID y una arquitectura por capas, garantizando escalabilidad, seguridad y mantenimiento eficiente.

🚀 Tecnologías y Stack
Este proyecto destaca por una arquitectura de Dual-Backend y Multi-Base de Datos, cumpliendo con los estándares de robustez y disponibilidad:

Frontend (Multi-Plataforma):

React (Web): Panel administrativo y sistema KDS para cocina.

React Native (Móvil): Aplicación táctil optimizada para el rol de Mesero.

TypeScript: Garantía de tipado fuerte y reducción de errores en tiempo de ejecución.

Backend (Arquitectura Híbrida):

Servicio 1 (Orquestador): Node.js + Express hospedado en Render.

Servicio 2 (Microservicio de Inventario): PHP hospedado en Hostinger.

Bases de Datos:

No Relacional: MongoDB Atlas (Usuarios, Sesiones y Ventas).

Relacional: MySQL en Hostinger (Catálogo > 200 productos normalizados).

🏗️ Arquitectura y Flujo de Datos
El sistema utiliza un patrón de API Gateway donde el servidor de Node.js centraliza la lógica y se comunica con el microservicio de PHP según la necesidad.

🔁 Flujo de Comunicación Inter-Servidores
Peticiones del Cliente: El Frontend se comunica exclusivamente con la API en Node.js.

Operaciones en Tiempo Real: Node.js gestiona directamente en MongoDB la autenticación, el estado de las mesas y los pedidos en cocina.

Puente de Inventario: Para consultas de productos o actualización de stock, Node.js actúa como intermediario realizando un fetch hacia el microservicio en PHP, el cual ejecuta las consultas en MySQL.

👥 Roles del Sistema
Administrador: Control total de inventarios (MySQL), gestión de usuarios (MongoDB), visualización de gráficas analíticas y cortes de caja.

Mesero (Vendedor): Gestión táctil de mesas, toma de pedidos, división de cuentas y generación de tickets.

Cocinero (Chef): Interfaz KDS para visualizar comandas en tiempo real y gestionar el estado de preparación de los platillos.

📂 Estructura del Proyecto
El repositorio está organizado siguiendo el principio de separación de intereses:

Plaintext
├── backend-node/      # API Orquestadora (Ventas, Usuarios, Mesas)
│   ├── config/        # Conexión a MongoDB
│   ├── controllers/   # Lógica de enrutamiento
│   ├── repositories/  # Puente hacia PHP/MySQL (Layered Architecture)
│   └── index.js       # Punto de entrada
├── backend-php/       # Microservicio de Inventario (MySQL)
│   └── productos.php  # API REST para CRUD de productos
├── frontend-web/      # React Web (Admin + Cocina)
│   ├── src/features/  # Módulos por funcionalidad
│   └── services/      # Clientes API
└── frontend-movil/    # React Native (App para Meseros)
🛠️ Configuración y Despliegue (CI/CD)
Variables de Entorno (.env en Render)
Fragmento de código
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/menu_master
PHP_API_URL=https://tu-dominio-hostinger.com/productos.php
JWT_SECRET=tu_clave_secreta
Despliegue
Backend Node: Despliegue automático en Render vinculado a la rama main.

Backend PHP: Alojado en Hostinger bajo entorno Apache con soporte para mysqli y CORS.

Base de Datos: Configuración de clúster en Mongo Atlas con acceso restringido por IP para seguridad.

📊 Metodología de Trabajo
El desarrollo se rige bajo el marco Scrum:

Trello: Gestión del Backlog y seguimiento de Historias de Usuario (HU).

GitHub: Control de versiones con estrategia de branching para Frontend y Backend.

Para que puedas explicarle a tus profesores exactamente cómo se mueven los datos entre tus servidores de Render y Hostinger, he preparado este visualizador interactivo del flujo de arquitectura:

Identificando patrones


¿Qué lograste con este README?
Claridad: Cualquiera que lo lea entiende que tienes dos backends y por qué decidiste usarlos así.

Justificación Técnica: El uso de PHP como un "microservicio de inventario" es una respuesta excelente para cumplir con el requisito de dos lenguajes de programación.

Estructura: Separa claramente las responsabilidades, lo que demuestra que aplicas SOLID.