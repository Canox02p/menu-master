# 🍽️ Menu-Master: Sistema Integral de Gestión Gastronómica

**Menu-Master** es una solución tecnológica híbrida (Web y Móvil) diseñada para optimizar la operación de restaurantes modernos. El proyecto aplica principios de ingeniería de software avanzada, incluyendo **SOLID** y una **arquitectura por capas**, garantizando escalabilidad y mantenimiento eficiente.

## 🚀 Tecnologías y Stack
Este proyecto destaca por una arquitectura de **Dual-Backend** y **Multi-Base de Datos**, cumpliendo con los requisitos técnicos de AWOS:

* **Frontend:** Angular + Ionic (Aplicación Híbrida para Cliente Web y Móvil).
* **Backend 1:** REST API en PHP hospedada en **InfinityFree**.
    * **BD Relacional:** MySQL (Gestión de Inventario > 200 productos normalizados).
* **Backend 2:** REST API en Node.js hospedada en **Render**.
    * **BD No Relacional:** MongoDB (Gestión de Usuarios y Ventas).

## 🏗️ Arquitectura y Principios
El desarrollo se rige por los siguientes estándares:
* **SOLID:** Implementación de principios de Responsabilidad Única e Inversión de Dependencias.
* **Arquitectura por Capas:** Separación estricta entre Presentación, Lógica de Negocio y Acceso a Datos.
* **Rendimiento:** Uso de **Deferrable Views** (@defer) en Angular para carga optimizada de componentes.

## 👥 Roles del Sistema
1.  **Administrador:** Control total de inventarios, usuarios y configuración global.
2.  **Vendedor (Mesero):** Gestión de pedidos táctiles y asignación de ventas por ID de usuario.
3.  **Consultor:** Visualización y exportación de reportes analíticos en PDF/Excel.

## 📊 Metodología de Trabajo
El seguimiento del proyecto se realiza bajo el marco de trabajo **Scrum**, utilizando **Trello** para la gestión del Backlog y Sprints, y **GitHub** para el control de versiones mediante una estrategia de branching organizada:
* `frontend-angular-ionic`: Desarrollo de la interfaz de usuario.
* `backend-node`: Lógica de ventas y usuarios (NoSQL).
* `backend-php`: Lógica de productos e inventario (SQL).
* `docs`: Documentación técnica y reportes.
