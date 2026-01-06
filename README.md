# UBIGEO Perú API

REST API ligera para datos geográficos del Perú (Departamentos, Provincias, Distritos) desplegable en Cloudflare Workers.

## 🚀 Características

- ✅ **4 endpoints REST** para departamentos, provincias, distritos y búsqueda
- ✅ **CORS habilitado** para consumo desde cualquier origen
- ✅ **Edge caching** para respuestas ultrarrápidas
- ✅ **UTF-8 completo** con soporte para ñ y acentos
- ✅ **Respuestas JSON uniformes** con manejo de errores
- ✅ **Sin dependencias** - código JavaScript puro

## 📚 Documentación

- [API Reference](./API_REFERENCE.md) - Especificación completa de endpoints
- [Deployment Guide](./DEPLOYMENT.md) - Instrucciones de despliegue
- [Code Examples](./EXAMPLES.md) - Ejemplos en JavaScript, PHP, Python, Node.js y Java

## 🔗 Endpoints

```
GET /api/v1/pe/departments
GET /api/v1/pe/provinces?department=CODE
GET /api/v1/pe/districts?department=CODE&province=NAME
GET /api/v1/pe/search?q=QUERY
```

## 💡 Uso Rápido

```javascript
// Obtener departamentos
const response = await fetch('https://your-worker.workers.dev/api/v1/pe/departments');
const { ok, data } = await response.json();

// Obtener provincias
const provinces = await fetch('https://your-worker.workers.dev/api/v1/pe/provinces?department=AMA');

// Obtener distritos
const districts = await fetch('https://your-worker.workers.dev/api/v1/pe/districts?department=AMA&province=Bagua');
```

## 📦 Despliegue

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Autenticar
wrangler login

# Desplegar
wrangler deploy
```

## 📄 Licencia

MIT License - Libre para uso comercial y personal

## 👨‍💻 Autor

**Elmer Astonitas**  
🌐 [elmerastonitas.com](https://elmerastonitas.com)

Creado para facilitar la integración de UBIGEO Perú en formularios web, checkouts, CRM y aplicaciones.
