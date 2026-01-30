# 🚀 Guía de Deployment - Brittany Group API

## Resumen

Esta guía te ayudará a desplegar el backend de NestJS en **api.brittanygroup.edu.pe/api** usando GitHub Actions y FTP.

**Repositorio Principal:** [sga_brittany_back](https://github.com/gaguilarf/sga_brittany_back.git)

---

## 📋 Pre-requisitos

### 1. Configurar GitHub Secrets

Ve a tu repositorio de producción en GitHub → Settings → Secrets and variables → Actions → New repository secret

Agrega los siguientes secrets:

| Secret Name | Descripción           | Valor                       |
| ----------- | --------------------- | --------------------------- |
| `FTP_HOST`  | Host del servidor FTP | (proporcionado por hosting) |
| `FTP_USER`  | Usuario FTP           | (proporcionado por hosting) |
| `FTP_PASS`  | Contraseña FTP        | (proporcionado por hosting) |

### 2. Estructura en el Servidor

El deployment creará esta estructura en tu servidor:

```
/public_html/
├── (archivos del frontend)
└── api/
    ├── dist/              # Código compilado
    ├── node_modules/      # Dependencias de producción
    ├── .env              # Variables de entorno (crear manualmente)
    ├── package.json
    ├── start.sh          # Script de inicio
    ├── stop.sh           # Script de detención
    └── ecosystem.config.json  # Configuración PM2
```

---

## 🔧 Configuración Inicial en el Servidor

### Paso 1: Conectarse al Servidor

Conéctate vía SSH o usa el File Manager de cPanel.

### Paso 2: Crear el archivo `.env`

```bash
cd /public_html/api
nano .env
```

Pega el siguiente contenido (ajusta según tu configuración):

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=75.102.22.134
DB_PORT=3306
DB_USERNAME=payxiohs_deployer
DB_PASSWORD=brittanyDev$512
DB_DATABASE=payxiohs_sga_brittany

# TypeORM Configuration
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
```

Guarda con `Ctrl+O`, Enter, `Ctrl+X`

> [!WARNING]
> **DB_SYNCHRONIZE:** En producción SIEMPRE debe estar en `false` para evitar pérdida de datos.

### Paso 3: Dar Permisos de Ejecución

```bash
chmod +x start.sh
chmod +x stop.sh
```

### Paso 4: Instalar PM2 (Recomendado)

PM2 mantendrá tu aplicación corriendo y la reiniciará automáticamente si falla.

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start ecosystem.config.json

# Guardar la configuración
pm2 save

# Configurar PM2 para iniciar al arrancar el servidor
pm2 startup
```

**Comandos útiles de PM2:**

```bash
pm2 status              # Ver estado
pm2 logs brittany-api   # Ver logs
pm2 restart brittany-api  # Reiniciar
pm2 stop brittany-api   # Detener
pm2 delete brittany-api # Eliminar
pm2 monit              # Monitor en tiempo real
```

---

## 🌐 Configurar Proxy Reverso

Para que `sga.brittanygroup.edu.pe/api` apunte a tu aplicación en el puerto 3001:

### Opción A: Apache (.htaccess)

Crea o edita el archivo `.htaccess` en `/public_html/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Proxy para /api
    RewriteCond %{REQUEST_URI} ^/api
    RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
</IfModule>

<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</IfModule>
```

### Opción B: Nginx

Si tu servidor usa Nginx, edita la configuración del sitio:

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

---

## 🚀 Proceso de Deployment

### Deployment Automático con GitHub Actions

1. **Hacer cambios y commit:**

   ```bash
   # Hacer cambios en tu código
   git add .
   git commit -m "feat: nueva funcionalidad"

   # Push a la rama master (activa GitHub Actions automáticamente)
   git push origin master
   ```

2. **GitHub Actions automáticamente:**
   - ✅ Instalará las dependencias
   - ✅ Compilará el código TypeScript
   - ✅ Copiará scripts de seeding
   - ✅ Subirá los archivos vía FTP
   - ⚠️ **NO sube `node_modules`** (se instalan en el servidor)

3. **En el servidor (REQUERIDO después de cada deployment):**

   ```bash
   # Conectarse vía SSH
   ssh tu_usuario@tu_servidor

   # Ir al directorio de la API
   cd /api.brittanygroup.edu.pe/

   # Instalar dependencias de producción
   npm ci --omit=dev --legacy-peer-deps

   # Reiniciar PM2
   pm2 restart brittany-api

   # Verificar logs
   pm2 logs brittany-api
   ```

### ¿Por qué no se suben los node_modules?

- `node_modules` tiene miles de archivos pequeños
- La transferencia FTP es muy lenta y puede fallar
- Es más rápido y confiable instalarlos directamente en el servidor

### Deployment Manual (si es necesario)

```bash
# En tu máquina local
npm ci --omit=dev
npm run build

# Subir vía FTP:
# - dist/
# - scripts/
# - package.json
# - package-lock.json
# - tsconfig.json
# - ecosystem.config.json
# - start.sh
# - stop.sh
# - .env (si no existe)

# En el servidor
cd /api.brittanygroup.edu.pe/
npm ci --omit=dev --legacy-peer-deps
pm2 restart brittany-api
```

---

## ✅ Verificación

### 1. Verificar que el servidor está corriendo

```bash
pm2 status
```

Deberías ver:

```
┌─────┬──────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ status  │ restart │ uptime  │ cpu      │
├─────┼──────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ brittany-api │ online  │ 0       │ 5m      │ 0%       │
└─────┴──────────────┴─────────┴─────────┴─────────┴──────────┘
```

### 2. Verificar logs

```bash
pm2 logs brittany-api --lines 50
```

Deberías ver:

```
🚀 Servidor corriendo en: http://localhost:3001
📚 Documentación Swagger: http://localhost:3001/api/docs
```

### 3. Probar endpoints

```bash
# Desde el servidor
curl http://localhost:3001/api/health

# Desde internet
curl https://api.brittanygroup.edu.pe/api/health
```

### 4. Verificar Swagger

Abre en tu navegador:

- https://api.brittanygroup.edu.pe/api/docs

---

## 🔍 Troubleshooting

### ❌ Error: "Cannot find module"

```bash
cd /api.brittanygroup.edu.pe/
npm ci --omit=dev --legacy-peer-deps
pm2 restart brittany-api
```

### ❌ Error: "Port 3001 already in use"

```bash
# Encontrar el proceso
lsof -i :3001

# Matar el proceso
kill -9 <PID>

# O usar el script
./stop.sh

# Reiniciar
pm2 start ecosystem.config.json
```

### ❌ Error: "Cannot connect to database"

1. Verifica las credenciales en `.env`
2. Verifica que MySQL esté corriendo
3. Verifica los logs: `pm2 logs brittany-api --err`
4. Prueba la conexión manualmente:
   ```bash
   mysql -h 75.102.22.134 -u payxiohs_deployer -p payxiohs_sga_brittany
   ```

### ❌ Error 502 Bad Gateway

1. Verifica que PM2 esté corriendo: `pm2 status`
2. Verifica que el puerto 3001 esté escuchando: `netstat -tulpn | grep 3001`
3. Verifica la configuración del proxy en `.htaccess` o Nginx
4. Revisa los logs de PM2: `pm2 logs brittany-api --err`

### ❌ CORS Error desde el frontend

Verifica que el dominio del frontend esté en la lista de orígenes permitidos en `src/main.ts`:

```typescript
origin: [
  'http://localhost:3000',
  'https://api.brittanygroup.edu.pe',
  'http://api.brittanygroup.edu.pe',
],
```

### ❌ GitHub Actions falla en el deployment

1. Verifica que los secrets estén configurados correctamente
2. Revisa los logs de GitHub Actions en la pestaña "Actions"
3. Verifica que el servidor FTP esté accesible
4. Asegúrate de que el directorio de destino exista

---

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
pm2 logs brittany-api
```

### Ver solo errores

```bash
pm2 logs brittany-api --err
```

### Ver métricas

```bash
pm2 monit
```

### Ver información detallada

```bash
pm2 show brittany-api
```

### Configurar alertas (opcional)

```bash
# Instalar PM2 Plus para monitoreo avanzado
pm2 plus
```

---

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo local:**

   ```bash
   # Hacer cambios en tu código
   git add .
   git commit -m "feat: nueva funcionalidad"
   ```

2. **Probar localmente:**
   - Ejecutar tests: `npm test`
   - Verificar que todo funcione localmente
   - Revisar Swagger docs

3. **Desplegar a producción:**

   ```bash
   # Push a master (activa GitHub Actions)
   git push origin master
   ```

4. **Verificar en el servidor:**

   ```bash
   ssh usuario@servidor
   cd /api.brittanygroup.edu.pe/
   npm ci --omit=dev --legacy-peer-deps
   pm2 restart brittany-api
   pm2 logs brittany-api
   ```

5. **Verificar en producción:**
   - Probar endpoints en Swagger
   - Verificar que el frontend funcione correctamente

---

## 🔐 Seguridad

### ✅ Checklist de Seguridad

- [x] `.env` no está en el repositorio (está en `.gitignore`)
- [x] `DB_SYNCHRONIZE=false` en producción
- [x] CORS configurado solo para dominios permitidos
- [x] Secrets de GitHub configurados correctamente
- [x] Contraseñas seguras en la base de datos
- [x] JWT_SECRET único y seguro
- [x] HTTPS habilitado en el dominio

### 🔒 Recomendaciones

1. **Cambiar contraseñas regularmente**
2. **Usar HTTPS** (ya configurado en sga.brittanygroup.edu.pe)
3. **Monitorear logs** regularmente con `pm2 logs`
4. **Backups de base de datos** periódicos
5. **Actualizar dependencias** regularmente para parches de seguridad
6. **Rate limiting** en endpoints críticos
7. **Validación de inputs** en todos los DTOs

---

## 🗄️ Base de Datos

### Migraciones en Producción

> [!IMPORTANT]
> En producción, `DB_SYNCHRONIZE` está en `false`. Para cambios en el esquema, usa migraciones de TypeORM.

```bash
# Generar migración
npm run migration:generate -- -n NombreDeLaMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir migración
npm run migration:revert
```

### Backup de Base de Datos

```bash
# Crear backup
mysqldump -h 75.102.22.134 -u payxiohs_deployer -p payxiohs_sga_brittany > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -h 75.102.22.134 -u payxiohs_deployer -p payxiohs_sga_brittany < backup_20260130.sql
```

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs:** `pm2 logs brittany-api --err`
2. **Verifica el estado:** `pm2 status`
3. **Revisa esta guía de troubleshooting**
4. **Verifica GitHub Actions:** Pestaña "Actions" en el repositorio
5. **Contacta al equipo de desarrollo**

---

## 🎯 Próximos Pasos

Una vez desplegado el backend:

1. ✅ Actualizar el frontend para usar la nueva API
2. ✅ Probar todos los endpoints desde Swagger
3. ✅ Verificar que el formulario del frontend funcione
4. ✅ Monitorear logs durante los primeros días
5. ✅ Configurar backups automáticos de base de datos
6. ✅ Configurar alertas de monitoreo

---

## 📝 Notas Importantes

> [!IMPORTANT]
> **Base de datos:** El backend usa la base de datos MySQL configurada en `.env`. Asegúrate de que `DB_SYNCHRONIZE=false` en producción.

> [!WARNING]
> **Sincronización automática:** NUNCA uses `DB_SYNCHRONIZE=true` en producción, esto puede causar pérdida de datos.

> [!TIP]
> **PM2:** Es altamente recomendado usar PM2 en lugar de ejecutar directamente con `node` porque PM2 reiniciará automáticamente la aplicación si falla.

---

¡Listo! Tu API de Brittany Group estará disponible en **https://api.brittanygroup.edu.pe/api** 🎉
