# Brittany Group - SGA (Backend)

Sistema de Gestión Académica (SGA) para Brittany Group. Backend desarrollado con un enfoque de **Clean Architecture** utilizando **NestJS**, **TypeORM** y **MySQL**.

## 🏗️ Arquitectura (Clean Architecture)

El proyecto está diseñado siguiendo los principios de arquitectura limpia, separando las preocupaciones en cuatro capas principales:

- **Domain**: Contiene la lógica central, entidades de negocio y definiciones de repositorios (interfaces).
- **Application**: Contiene los servicios que implementan los casos de uso del sistema.
- **Infrastructure**: Implementaciones técnicas como persistencia (TypeORM), adaptadores externos y configuraciones.
- **Presentation**: Controladores REST que gestionan las peticiones HTTP y exponen la API.

### Módulos Implementados

1.  **Authentication**: Registro, login (JWT en Cookies) y RBAC.
2.  **Users**: Gestión de usuarios y perfiles.
3.  **Roles**: Gestión de permisos y roles del sistema.
4.  **Campuses**: Gestión de sedes (Sedes).
5.  **Plans**: Gestión de planes académicos (Planes).
6.  **Students**: Gestión de alumnos.
7.  **Enrollments**: Gestión de matrículas.
8.  **Payments**: Registro de pagos y boletas.
9.  **Grades**: Control de notas y desgloses de puntaje.
10. **Attendance**: Control de asistencia diaria.
11. **Leads**: Gestión de prospectos iniciales.

---

## 🚀 Implementación y Configuración

Sigue estos pasos para poner en marcha el proyecto en un entorno local:

### 1. Levantar Servicios con Docker

El proyecto utiliza un contenedor para la base de datos MySQL. Asegúrate de tener Docker instalado.

```bash
docker-compose up -d
```

Esto levantará una base de datos MySQL 8.0 en el puerto configurado (por defecto `3306`).

### 2. Configuración de Base de Datos

Una vez que el contenedor esté corriendo, la base de datos se conectará automáticamente.

> [!NOTE]
> En desarrollo, el sistema está configurado para sincronizar automáticamente el esquema de la base de datos (`DB_SYNCHRONIZE=true`).

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo:

```bash
cp .env.example .env
```

Asegúrate de configurar correctamente las credenciales de la base de datos y el `JWT_SECRET`.

### 4. Instalación de Dependencias

Instala los paquetes necesarios de Node.js:

```bash
npm install
```

### 5. Sembrar Datos Iniciales (Roles y Precios)

Es fundamental crear los roles predeterminados para que el sistema de permisos funcione correctamente, y opcionalmente configurar los precios por defecto.

```bash
# Seteo de Roles (Administrador, Docente, Desarrollador, Secretaria)
npm run seed:roles

# Seteo de Precios por defecto (Planes Standard, Premium, Plus, Convenio en todas las Sedes)
npm run seed:prices
```

### 6. Ejecutar el Proyecto

Finalmente, inicia el servidor en modo desarrollo con recarga automática:

```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3002` (o el puerto configurado en el `.env`).

---

## 🔐 Seguridad y Permisos (RBAC)

El sistema utiliza **Role-Based Access Control**. Los roles tienen los siguientes permisos generales:

- **Administrador (1)**: Acceso total CRUD en todos los módulos.
- **Docente (2)**: Gestión de Notas y Asistencia.
- **Desarrollador (3)**: Acceso de solo lectura para auditoría.
- **Secretaria (4)**: Gestión de Alumnos, Sedes, Planes, Matrículas y Pagos.

---

## 📚 Documentación de la API (Swagger)

La documentación interactiva está disponible una vez que el servidor está corriendo:

🔗 **URL:** `http://localhost:3002/api/docs`

Aquí podrás probar todos los endpoints, ver los esquemas de los DTOs y verificar los requisitos de autenticación.

---

## 🛠️ Scripts Disponibles

- `npm run build`: Compila el proyecto para producción.
- `npm run start:dev`: Inicia el servidor en modo desarrollo.
- `npm run lint`: Ejecuta el linter de código.
- `npm run test`: Ejecuta las pruebas unitarias.
- `npm run seed:roles`: Puebla la base de datos con los roles iniciales.
- `npm run seed:prices`: Puebla la base de datos con los planes (13-16) y sus precios por defecto para todas las sedes.

---

## 🚀 Deployment

Para desplegar esta aplicación en producción, consulta la [Guía de Deployment](./DEPLOYMENT.md) que incluye:

- Configuración de GitHub Actions para CI/CD
- Configuración del servidor y PM2
- Variables de entorno de producción
- Proxy reverso (Apache/Nginx)
- Troubleshooting y monitoreo

**Repositorio Principal:** [sga_brittany_back](https://github.com/gaguilarf/sga_brittany_back.git) (Producción)

---

## 📄 Licencia

Privado - Brittany Group © 2026
