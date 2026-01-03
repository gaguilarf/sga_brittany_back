# Docker MySQL Setup

## Configuración de la Base de Datos

Este proyecto usa MySQL 8.0 en Docker para desarrollo local.

### Archivo `.env` requerido

Asegúrate de que tu archivo `.env` tenga la siguiente configuración:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=payxiohs_deployer2
DB_PASSWORD=brittanyDev512
DB_DATABASE=payxiohs_sga2_brittany

# TypeORM Configuration
DB_SYNCHRONIZE=true
DB_LOGGING=true
```

## Comandos Docker

### Iniciar el contenedor de MySQL
```bash
docker-compose up -d
```

### Detener el contenedor
```bash
docker-compose down
```

### Detener y eliminar volúmenes (resetear base de datos)
```bash
docker-compose down -v
```

### Ver logs del contenedor
```bash
docker logs mysql-dev
```

### Verificar que el contenedor está corriendo
```bash
docker ps
```

### Conectarse a MySQL desde la línea de comandos
```bash
docker exec -it mysql-dev mysql -u payxiohs_deployer2 -p
# Contraseña: brittanyDev512
```

### Ver las bases de datos
```bash
docker exec -it mysql-dev mysql -u payxiohs_deployer2 -pbrittanyDev512 -e "SHOW DATABASES;"
```

## Iniciar la aplicación NestJS

Una vez que el contenedor de MySQL esté corriendo (espera 10-15 segundos después de `docker-compose up -d`):

```bash
npm run start:dev
```

La aplicación estará disponible en:
- **API**: http://localhost:3002
- **Swagger Docs**: http://localhost:3002/api/docs

## Solución de problemas

### Error: "Unable to connect to the database"

1. Verifica que el contenedor esté corriendo: `docker ps`
2. Verifica los logs: `docker logs mysql-dev`
3. Espera 10-15 segundos después de iniciar el contenedor (MySQL tarda en inicializarse)
4. Verifica que el puerto 3306 no esté siendo usado por otra aplicación

### Reiniciar completamente

Si tienes problemas, puedes reiniciar todo:

```bash
# Detener y eliminar contenedores y volúmenes
docker-compose down -v

# Volver a crear
docker-compose up -d

# Esperar 10-15 segundos para que MySQL se inicialice
timeout /t 15 /nobreak

# Luego iniciar la aplicación
npm run start:dev
```

### Verificar el estado de salud del contenedor

```bash
docker inspect mysql-dev --format='{{.State.Health.Status}}'
```

Debería mostrar `healthy` cuando MySQL esté completamente listo.
