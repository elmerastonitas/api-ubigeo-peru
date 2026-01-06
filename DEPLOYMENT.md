# Deployment Guide - UBIGEO Perú API

## Requisitos Previos

- **Node.js** 16.x o superior
- **npm** o **yarn**
- Cuenta de **Cloudflare** (gratuita)

## Instalación

### 1. Instalar Wrangler CLI

Wrangler es la herramienta oficial de Cloudflare para gestionar Workers.

```bash
npm install -g wrangler
```

O con yarn:
```bash
yarn global add wrangler
```

Verificar instalación:
```bash
wrangler --version
```

### 2. Autenticación

Autenticarse con tu cuenta de Cloudflare:

```bash
wrangler login
```

Esto abrirá tu navegador para autorizar Wrangler.

## Configuración

### 3. Editar wrangler.toml

Abre el archivo `wrangler.toml` y personaliza:

```toml
name = "ubigeo-peru-api"  # Nombre único para tu Worker
main = "worker.js"
compatibility_date = "2024-01-01"

[env.production]
name = "ubigeo-peru-api"
# Opcional: configurar ruta personalizada
# route = "api.tudominio.com/*"
```

**Campos importantes:**
- `name`: Nombre único del Worker (será parte de la URL)
- `main`: Archivo principal (worker.js)
- `compatibility_date`: Fecha de compatibilidad de Cloudflare Workers

## Despliegue

### 4. Desplegar a Cloudflare Workers

Desde el directorio del proyecto:

```bash
wrangler deploy
```

**Salida esperada:**
```
✨ Built successfully!
✨ Successfully published your script to
   https://ubigeo-peru-api.your-subdomain.workers.dev
```

### 5. Verificar Despliegue

Probar el endpoint de departamentos:

```bash
curl https://ubigeo-peru-api.your-subdomain.workers.dev/api/v1/pe/departments
```

Deberías recibir una respuesta JSON con la lista de departamentos.

## Configuración Avanzada

### Dominio Personalizado

Para usar tu propio dominio (ej: `api.tudominio.com`):

1. **Agregar dominio a Cloudflare:**
   - Ve a tu dashboard de Cloudflare
   - Agrega tu dominio si no está ya

2. **Configurar ruta en wrangler.toml:**
```toml
[env.production]
name = "ubigeo-peru-api"
route = "api.tudominio.com/*"
```

3. **Redesplegar:**
```bash
wrangler deploy --env production
```

### Variables de Entorno

Si necesitas variables de entorno:

```toml
[env.production.vars]
API_VERSION = "v1"
```

Acceder en el código:
```javascript
const version = env.API_VERSION;
```

### Secrets

Para datos sensibles (API keys, etc.):

```bash
wrangler secret put API_KEY
```

Acceder en el código:
```javascript
const apiKey = env.API_KEY;
```

## Comandos Útiles

### Ver logs en tiempo real
```bash
wrangler tail
```

### Ejecutar localmente (dev mode)
```bash
wrangler dev
```

Esto iniciará un servidor local en `http://localhost:8787`

### Eliminar Worker
```bash
wrangler delete
```

### Ver información del Worker
```bash
wrangler whoami
```

## Monitoreo

### Dashboard de Cloudflare

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona **Workers & Pages**
3. Haz clic en tu Worker
4. Verás métricas de:
   - Requests por segundo
   - Errores
   - Duración de ejecución
   - Ancho de banda

### Logs

Ver logs en tiempo real:
```bash
wrangler tail --format pretty
```

## Troubleshooting

### Error: "Authentication required"
```bash
wrangler login
```

### Error: "Name already taken"
Cambia el `name` en `wrangler.toml` a algo único.

### Error: "Script too large"
El Worker tiene un límite de 1MB. Optimiza el código si es necesario.

### CORS no funciona
Verifica que el Worker esté retornando los headers CORS correctos. Revisa el código en `worker.js`.

## Límites del Plan Gratuito

Cloudflare Workers plan gratuito incluye:
- **100,000 requests/día**
- **10ms CPU time** por request
- **Unlimited** Workers

Para más requests, considera el plan de pago ($5/mes por 10M requests).

## Actualizar el Worker

Después de hacer cambios en `worker.js`:

```bash
wrangler deploy
```

Los cambios se propagan globalmente en segundos.

## Rollback

Si necesitas volver a una versión anterior:

1. Ve al dashboard de Cloudflare
2. Workers & Pages → Tu Worker
3. Deployments
4. Selecciona una versión anterior y haz clic en "Rollback"

## Soporte

- **Documentación oficial:** [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)
- **Community:** [community.cloudflare.com](https://community.cloudflare.com/)
- **Discord:** [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)
