# Code Examples - UBIGEO Perú API

## JavaScript (Fetch) - Selects Dependientes

Ejemplo completo de implementación con selects dependientes en HTML/JavaScript:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>UBIGEO Perú - Selects Dependientes</title>
</head>
<body>
    <h2>Dirección de Envío</h2>
    
    <label>Departamento:</label>
    <select id="department">
        <option value="">Seleccione...</option>
    </select>
    
    <label>Provincia:</label>
    <select id="province" disabled>
        <option value="">Seleccione departamento primero</option>
    </select>
    
    <label>Distrito:</label>
    <select id="district" disabled>
        <option value="">Seleccione provincia primero</option>
    </select>

    <script>
        const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';
        
        const departmentSelect = document.getElementById('department');
        const provinceSelect = document.getElementById('province');
        const districtSelect = document.getElementById('district');
        
        // Cargar departamentos al inicio
        async function loadDepartments() {
            try {
                const response = await fetch(`${API_BASE}/departments`);
                const { ok, data } = await response.json();
                
                if (ok) {
                    data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.code;
                        option.textContent = dept.name;
                        departmentSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error cargando departamentos:', error);
            }
        }
        
        // Cargar provincias cuando se selecciona departamento
        departmentSelect.addEventListener('change', async (e) => {
            const deptCode = e.target.value;
            
            // Resetear selects dependientes
            provinceSelect.innerHTML = '<option value="">Cargando...</option>';
            provinceSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">Seleccione provincia primero</option>';
            districtSelect.disabled = true;
            
            if (!deptCode) {
                provinceSelect.innerHTML = '<option value="">Seleccione departamento primero</option>';
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE}/provinces?department=${deptCode}`);
                const { ok, data } = await response.json();
                
                if (ok) {
                    provinceSelect.innerHTML = '<option value="">Seleccione...</option>';
                    data.forEach(province => {
                        const option = document.createElement('option');
                        option.value = province;
                        option.textContent = province;
                        provinceSelect.appendChild(option);
                    });
                    provinceSelect.disabled = false;
                }
            } catch (error) {
                console.error('Error cargando provincias:', error);
                provinceSelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        });
        
        // Cargar distritos cuando se selecciona provincia
        provinceSelect.addEventListener('change', async (e) => {
            const province = e.target.value;
            const deptCode = departmentSelect.value;
            
            districtSelect.innerHTML = '<option value="">Cargando...</option>';
            districtSelect.disabled = true;
            
            if (!province) {
                districtSelect.innerHTML = '<option value="">Seleccione provincia primero</option>';
                return;
            }
            
            try {
                const response = await fetch(
                    `${API_BASE}/districts?department=${deptCode}&province=${encodeURIComponent(province)}`
                );
                const { ok, data } = await response.json();
                
                if (ok) {
                    districtSelect.innerHTML = '<option value="">Seleccione...</option>';
                    data.forEach(district => {
                        const option = document.createElement('option');
                        option.value = district;
                        option.textContent = district;
                        districtSelect.appendChild(option);
                    });
                    districtSelect.disabled = false;
                }
            } catch (error) {
                console.error('Error cargando distritos:', error);
                districtSelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        });
        
        // Inicializar
        loadDepartments();
    </script>
</body>
</html>
```

---

## PHP (cURL) - Obtener Datos

### Ejemplo 1: Obtener Provincias

```php
<?php
function getProvinces($departmentCode) {
    $apiUrl = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/provinces?department=" . urlencode($departmentCode);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if ($data['ok']) {
            return $data['data'];
        }
    }
    
    return [];
}

// Uso
$provinces = getProvinces('AMA');
foreach ($provinces as $province) {
    echo "<option value='$province'>$province</option>";
}
?>
```

### Ejemplo 2: Obtener Distritos

```php
<?php
function getDistricts($departmentCode, $provinceName) {
    $apiUrl = sprintf(
        "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/districts?department=%s&province=%s",
        urlencode($departmentCode),
        urlencode($provinceName)
    );
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    return $data['ok'] ? $data['data'] : [];
}

// Uso
$districts = getDistricts('AMA', 'Bagua');
print_r($districts);
?>
```

### Ejemplo 3: Con file_get_contents

```php
<?php
function getDepartments() {
    $apiUrl = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/departments";
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Content-Type: application/json'
        ]
    ]);
    
    $response = file_get_contents($apiUrl, false, $context);
    $data = json_decode($response, true);
    
    return $data['ok'] ? $data['data'] : [];
}

// Uso
$departments = getDepartments();
foreach ($departments as $dept) {
    echo "{$dept['code']}: {$dept['name']}\n";
}
?>
```

---

## Python (requests) - Consumo de API

### Instalación
```bash
pip install requests
```

### Ejemplo 1: Obtener Departamentos

```python
import requests

def get_departments():
    """Obtiene la lista de departamentos"""
    url = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/departments"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        if data['ok']:
            return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    return []

# Uso
departments = get_departments()
for dept in departments:
    print(f"{dept['code']}: {dept['name']}")
```

### Ejemplo 2: Obtener Provincias y Distritos

```python
import requests

class UbigeoAPI:
    def __init__(self, base_url="https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe"):
        self.base_url = base_url
    
    def get_provinces(self, department_code):
        """Obtiene provincias por departamento"""
        url = f"{self.base_url}/provinces"
        params = {'department': department_code}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data['data'] if data['ok'] else []
    
    def get_districts(self, department_code, province_name):
        """Obtiene distritos por departamento y provincia"""
        url = f"{self.base_url}/districts"
        params = {
            'department': department_code,
            'province': province_name
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data['data'] if data['ok'] else []
    
    def search(self, query):
        """Busca provincias y distritos"""
        url = f"{self.base_url}/search"
        params = {'q': query}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        return data['data'] if data['ok'] else []

# Uso
api = UbigeoAPI()

# Obtener provincias de Amazonas
provinces = api.get_provinces('AMA')
print("Provincias de Amazonas:", provinces)

# Obtener distritos de Bagua
districts = api.get_districts('AMA', 'Bagua')
print("Distritos de Bagua:", districts)

# Buscar
results = api.search('jesus')
for result in results:
    print(f"{result['type']}: {result['name']} ({result['department']})")
```

---

## Node.js - Backend Integration

### Instalación
```bash
npm install node-fetch
```

### Ejemplo con async/await

```javascript
const fetch = require('node-fetch');

const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

async function getDepartments() {
    const response = await fetch(`${API_BASE}/departments`);
    const { ok, data } = await response.json();
    return ok ? data : [];
}

async function getProvinces(departmentCode) {
    const response = await fetch(`${API_BASE}/provinces?department=${departmentCode}`);
    const { ok, data } = await response.json();
    return ok ? data : [];
}

async function getDistricts(departmentCode, provinceName) {
    const url = `${API_BASE}/districts?department=${departmentCode}&province=${encodeURIComponent(provinceName)}`;
    const response = await fetch(url);
    const { ok, data } = await response.json();
    return ok ? data : [];
}

// Uso
(async () => {
    try {
        const departments = await getDepartments();
        console.log('Departamentos:', departments);
        
        const provinces = await getProvinces('LIM');
        console.log('Provincias de Lima:', provinces);
        
        const districts = await getDistricts('LIM', 'Lima');
        console.log('Distritos de Lima:', districts);
    } catch (error) {
        console.error('Error:', error);
    }
})();
```

### Ejemplo con Express.js

```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

// Proxy endpoint para departamentos
app.get('/api/departments', async (req, res) => {
    try {
        const response = await fetch(`${API_BASE}/departments`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Proxy endpoint para provincias
app.get('/api/provinces/:department', async (req, res) => {
    try {
        const { department } = req.params;
        const response = await fetch(`${API_BASE}/provinces?department=${department}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

---

## Java - Enterprise Integration

### Ejemplo con HttpClient (Java 11+)

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class UbigeoAPI {
    private static final String API_BASE = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe";
    private final HttpClient client;
    private final Gson gson;
    
    public UbigeoAPI() {
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    public JsonObject getDepartments() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_BASE + "/departments"))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public JsonObject getProvinces(String departmentCode) throws Exception {
        String url = String.format("%s/provinces?department=%s", 
            API_BASE, departmentCode);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public JsonObject getDistricts(String departmentCode, String provinceName) 
            throws Exception {
        String url = String.format("%s/districts?department=%s&province=%s", 
            API_BASE, departmentCode, 
            java.net.URLEncoder.encode(provinceName, "UTF-8"));
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public static void main(String[] args) {
        try {
            UbigeoAPI api = new UbigeoAPI();
            
            // Obtener departamentos
            JsonObject departments = api.getDepartments();
            System.out.println("Departments: " + departments);
            
            // Obtener provincias
            JsonObject provinces = api.getProvinces("LIM");
            System.out.println("Provinces: " + provinces);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

## Notas Importantes

### Manejo de Errores

Siempre verifica el campo `ok` en la respuesta:

```javascript
const response = await fetch(url);
const result = await response.json();

if (result.ok) {
    // Éxito - usar result.data
    console.log(result.data);
} else {
    // Error - mostrar result.error
    console.error(result.error.code, result.error.message);
}
```

### Encoding de Parámetros

Siempre codifica los parámetros URL, especialmente nombres de provincias con espacios o caracteres especiales:

```javascript
// ✅ Correcto
const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';
const url = `${API_BASE}/districts?department=AMA&province=${encodeURIComponent('Rodriguez De Mendoza')}`;

// ❌ Incorrecto
const url = `${API_BASE}/districts?department=AMA&province=Rodriguez De Mendoza`;
```

### Caching del Cliente

Para mejorar el rendimiento, considera cachear las respuestas en el cliente:

```javascript
const cache = new Map();

async function getCachedProvinces(deptCode) {
    const key = `provinces_${deptCode}`;
    
    if (cache.has(key)) {
        return cache.get(key);
    }
    
    const response = await fetch(`${API_BASE}/provinces?department=${deptCode}`);
    const { ok, data } = await response.json();
    
    if (ok) {
        cache.set(key, data);
        return data;
    }
    
    return [];
}
```
