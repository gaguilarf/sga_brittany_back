# Brittany Group - Sistema de Gestión de Leads (Backend)

API REST desarrollada con NestJS, TypeORM y MySQL para la gestión de leads de Brittany Group.

## 🚀 Deployment en Banahost

### Configuración Inicial

1. **Variables de entorno en GitHub Secrets:**
   - `FTP_HOST`: Host del servidor FTP de Banahost
   - `FTP_USER`: Usuario FTP
   - `FTP_PASS`: Contraseña FTP

2. **Estructura en el servidor:**
   ```
   /public_html/
   └── api/
       ├── dist/
       ├── node_modules/
       ├── .env
       ├── package.json
       └── start.sh
   ```

### Proceso de Deployment Automático

El deployment se ejecuta automáticamente al hacer push a la rama `main`:

1. ✅ Checkout del código
2. ✅ Instalación de dependencias de producción
3. ✅ Build de la aplicación (TypeScript → JavaScript)
4. ✅ Creación del paquete de deployment
5. ✅ Subida vía FTP a `/api/`

### Configuración en el Servidor

#### 1. Crear archivo `.env` en producción

Conectarse al servidor vía SSH o panel de control y crear el archivo `.env`:

```bash
cd /public_html/api
cp .env.production .env
nano .env  # Editar si es necesario
```

#### 2. Dar permisos de ejecución a los scripts

```bash
chmod +x start.sh
chmod +x stop.sh
```

#### 3. Iniciar el servidor

```bash
./start.sh
```

O usar PM2 (recomendado):

```bash
npm install -g pm2
pm2 start dist/main.js --name "brittany-api"
pm2 save
pm2 startup
```

### Configuración de Nginx/Apache

#### Para Nginx:

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

#### Para Apache (.htaccess):

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
</IfModule>

<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</IfModule>
```

## 🛠️ Desarrollo Local

### Requisitos

- Node.js 20+
- MySQL 8.0+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
npm run start:dev
```

### Scripts Disponibles

```bash
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar con hot-reload
npm run start:prod     # Iniciar en modo producción
npm run build          # Compilar TypeScript
npm run test           # Ejecutar tests unitarios
npm run test:e2e       # Ejecutar tests E2E
npm run test:cov       # Tests con cobertura
npm run lint           # Ejecutar linter
```

## 📚 Documentación API

Una vez desplegado, la documentación Swagger estará disponible en:

- **Desarrollo:** http://localhost:3001/api/docs
- **Producción:** https://sga.brittanygroup.edu.pe/api/docs

## 🔧 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/leads` | Crear un nuevo lead |
| GET | `/api/leads` | Obtener todos los leads |
| GET | `/api/leads/:id` | Obtener un lead por ID |
| PATCH | `/api/leads/:id` | Actualizar un lead |
| DELETE | `/api/leads/:id` | Eliminar un lead |

## 🗄️ Base de Datos

- **Motor:** MySQL 8.0
- **Host:** 75.102.22.134:3306
- **Base de datos:** payxiohs_sga_brittany

### Migración de Datos

En producción, `DB_SYNCHRONIZE` debe estar en `false`. Para aplicar cambios en el esquema:

```bash
# Generar migración
npm run migration:generate -- -n MigrationName

# Ejecutar migraciones
npm run migration:run

# Revertir migración
npm run migration:revert
```

## 🔐 Seguridad

### Variables de Entorno Sensibles

Nunca subir al repositorio:
- ✅ `.env` está en `.gitignore`
- ✅ Usar `.env.example` como plantilla
- ✅ Configurar secrets en GitHub Actions

### CORS

Configurado para aceptar requests desde:
- `http://localhost:3000` (desarrollo)
- `https://sga.brittanygroup.edu.pe` (producción)

Actualizar en `src/main.ts` si es necesario.

## 📊 Monitoreo

### Logs

```bash
# Ver logs con PM2
pm2 logs brittany-api

# Ver logs en tiempo real
pm2 logs brittany-api --lines 100
```

### Estado del Servidor

```bash
# Ver estado
pm2 status

# Reiniciar
pm2 restart brittany-api

# Detener
pm2 stop brittany-api
```

## 🐛 Troubleshooting

### El servidor no inicia

1. Verificar que el puerto 3001 esté disponible:
   ```bash
   lsof -i :3001
   ```

2. Verificar variables de entorno:
   ```bash
   cat .env
   ```

3. Verificar logs:
   ```bash
   pm2 logs brittany-api --err
   ```

### Error de conexión a base de datos

1. Verificar credenciales en `.env`
2. Verificar que MySQL esté corriendo
3. Verificar firewall y permisos de red

### Tests fallan

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Ejecutar tests
npm test
```

## 📞 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.

## 📄 Licencia

Privado - Brittany Group © 2024
