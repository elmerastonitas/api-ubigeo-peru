# API Reference - UBIGEO Perú API

## Base URL

```
https://api-ubigeo-peru.elmerastonitas.workers.dev
```

## Endpoints

### 1. Listar Departamentos

Obtiene la lista completa de departamentos del Perú.

**Endpoint:**
```
GET /api/v1/pe/departments
```

**Parámetros:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    { "code": "AMA", "name": "Amazonas" },
    { "code": "ANC", "name": "Ancash" },
    { "code": "LIM", "name": "Lima" }
  ]
}
```

**Ejemplo:**
```bash
curl https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/departments
```

---

### 2. Listar Provincias por Departamento

Obtiene las provincias de un departamento específico.

**Endpoint:**
```
GET /api/v1/pe/provinces?department={CODE}
```

**Parámetros:**
- `department` (requerido): Código del departamento (ej: AMA, LIM, CUS)

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": ["Bagua", "Bongara", "Chachapoyas", "Condorcanqui", "Luya"]
}
```

**Errores:**
- `400` - Parámetro faltante
- `404` - Departamento no encontrado

**Ejemplo:**
```bash
curl "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/provinces?department=AMA"
```

---

### 3. Listar Distritos por Provincia

Obtiene los distritos de una provincia específica dentro de un departamento.

**Endpoint:**
```
GET /api/v1/pe/districts?department={CODE}&province={NAME}
```

**Parámetros:**
- `department` (requerido): Código del departamento
- `province` (requerido): Nombre de la provincia

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": ["Bagua", "Aramango", "Copallin", "El Parco", "Imaza", "La Peca"]
}
```

**Errores:**
- `400` - Parámetro faltante
- `404` - Departamento o provincia no encontrada

**Ejemplo:**
```bash
curl "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/districts?department=AMA&province=Bagua"
```

---

### 4. Búsqueda de Provincias y Distritos

Busca provincias y distritos que coincidan con un término de búsqueda.

**Endpoint:**
```
GET /api/v1/pe/search?q={QUERY}
```

**Parámetros:**
- `q` (requerido): Término de búsqueda (mínimo 2 caracteres)

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "type": "district",
      "department": "HUV",
      "province": "Huancavelica",
      "name": "Jesus"
    },
    {
      "type": "district",
      "department": "LAL",
      "province": "Otuzco",
      "name": "Jesus"
    }
  ]
}
```

**Nota:** Limitado a 50 resultados máximo.

**Ejemplo:**
```bash
curl "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/search?q=jesus"
```

---

## Formato de Respuesta

### Respuesta Exitosa
```json
{
  "ok": true,
  "data": [...]
}
```

### Respuesta de Error
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| `MISSING_PARAMETER` | Falta un parámetro requerido |
| `INVALID_DEPARTMENT` | Código de departamento inválido |
| `INVALID_PROVINCE` | Nombre de provincia inválido |
| `INVALID_QUERY` | Query de búsqueda inválido (< 2 caracteres) |
| `METHOD_NOT_ALLOWED` | Método HTTP no permitido (solo GET) |
| `NOT_FOUND` | Endpoint no encontrado |

## Headers

### CORS
Todos los endpoints incluyen headers CORS para permitir acceso desde cualquier origen:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Cache
```
Cache-Control: public, max-age=3600, s-maxage=86400
```
- Navegador: 1 hora
- Edge (Cloudflare): 24 horas

## Rate Limiting

Se recomienda implementar rate limiting a nivel de Cloudflare WAF según tus necesidades. La API no tiene rate limiting incorporado por defecto.

## Notas Técnicas

- **Encoding:** UTF-8 con soporte completo para ñ y acentos
- **Formato:** JSON con indentación de 2 espacios
- **Métodos permitidos:** GET, OPTIONS
- **Tamaño de respuesta:** Típicamente < 10KB
