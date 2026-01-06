# Code Examples - UBIGEO Perú API

## JavaScript (Fetch) - Selects Dependientes

### Ejemplo Completo: Implementación con Selects Dependientes

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>UBIGEO Perú - Selects Dependientes</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        label { display: block; margin-top: 15px; font-weight: bold; }
        select { width: 100%; padding: 8px; margin-top: 5px; font-size: 14px; }
        select:disabled { background-color: #f0f0f0; }
        .info { background: #e3f2fd; padding: 10px; margin-top: 20px; border-radius: 4px; }
    </style>
</head>
<body>
    <h2>Dirección de Envío - Perú</h2>
    
    <label>Departamento:</label>
    <select id="department">
        <option value="">Cargando...</option>
    </select>
    
    <label>Provincia:</label>
    <select id="province" disabled>
        <option value="">Seleccione departamento primero</option>
    </select>
    
    <label>Distrito:</label>
    <select id="district" disabled>
        <option value="">Seleccione provincia primero</option>
    </select>

    <div class="info" id="info" style="display:none;"></div>

    <script>
        const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';
        
        const departmentSelect = document.getElementById('department');
        const provinceSelect = document.getElementById('province');
        const districtSelect = document.getElementById('district');
        const infoDiv = document.getElementById('info');
        
        // Ejemplo 1: Obtener Departamentos
        async function loadDepartments() {
            try {
                const response = await fetch(`${API_BASE}/departments`);
                const { ok, data } = await response.json();
                
                if (ok) {
                    departmentSelect.innerHTML = '<option value="">Seleccione...</option>';
                    data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.code;
                        option.textContent = dept.name;
                        departmentSelect.appendChild(option);
                    });
                    console.log(`Cargados ${data.length} departamentos`);
                }
            } catch (error) {
                console.error('Error cargando departamentos:', error);
                departmentSelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        }
        
        // Ejemplo 2: Obtener Provincias por Departamento
        async function loadProvinces(departmentCode) {
            provinceSelect.innerHTML = '<option value="">Cargando...</option>';
            provinceSelect.disabled = true;
            districtSelect.innerHTML = '<option value="">Seleccione provincia primero</option>';
            districtSelect.disabled = true;
            
            if (!departmentCode) {
                provinceSelect.innerHTML = '<option value="">Seleccione departamento primero</option>';
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE}/provinces?department=${departmentCode}`);
                const { ok, data, error } = await response.json();
                
                if (ok) {
                    provinceSelect.innerHTML = '<option value="">Seleccione...</option>';
                    data.forEach(province => {
                        const option = document.createElement('option');
                        option.value = province;
                        option.textContent = province;
                        provinceSelect.appendChild(option);
                    });
                    provinceSelect.disabled = false;
                    console.log(`Cargadas ${data.length} provincias de ${departmentCode}`);
                } else {
                    provinceSelect.innerHTML = '<option value="">Error: ' + error.message + '</option>';
                }
            } catch (error) {
                console.error('Error cargando provincias:', error);
                provinceSelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        }
        
        // Ejemplo 3: Obtener Distritos por Departamento y Provincia
        async function loadDistricts(departmentCode, provinceName) {
            districtSelect.innerHTML = '<option value="">Cargando...</option>';
            districtSelect.disabled = true;
            
            if (!provinceName) {
                districtSelect.innerHTML = '<option value="">Seleccione provincia primero</option>';
                return;
            }
            
            try {
                const url = `${API_BASE}/districts?department=${departmentCode}&province=${encodeURIComponent(provinceName)}`;
                const response = await fetch(url);
                const { ok, data, error } = await response.json();
                
                if (ok) {
                    districtSelect.innerHTML = '<option value="">Seleccione...</option>';
                    data.forEach(district => {
                        const option = document.createElement('option');
                        option.value = district;
                        option.textContent = district;
                        districtSelect.appendChild(option);
                    });
                    districtSelect.disabled = false;
                    console.log(`Cargados ${data.length} distritos de ${provinceName}`);
                    
                    // Mostrar información
                    infoDiv.style.display = 'block';
                    infoDiv.innerHTML = `<strong>Ubicación:</strong> ${departmentCode} → ${provinceName} (${data.length} distritos disponibles)`;
                } else {
                    districtSelect.innerHTML = '<option value="">Error: ' + error.message + '</option>';
                }
            } catch (error) {
                console.error('Error cargando distritos:', error);
                districtSelect.innerHTML = '<option value="">Error al cargar</option>';
            }
        }
        
        // Event Listeners
        departmentSelect.addEventListener('change', (e) => {
            loadProvinces(e.target.value);
            infoDiv.style.display = 'none';
        });
        
        provinceSelect.addEventListener('change', (e) => {
            const deptCode = departmentSelect.value;
            loadDistricts(deptCode, e.target.value);
        });
        
        // Inicializar
        loadDepartments();
    </script>
</body>
</html>
```

### Ejemplo 4: Búsqueda de Ubicaciones

```javascript
// Búsqueda en tiempo real
async function searchLocation(query) {
    if (query.length < 2) {
        console.log('Query debe tener al menos 2 caracteres');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        const { ok, data } = await response.json();
        
        if (ok) {
            console.log(`Encontrados ${data.length} resultados para "${query}":`);
            data.forEach(result => {
                if (result.type === 'province') {
                    console.log(`  Provincia: ${result.name} (${result.department})`);
                } else {
                    console.log(`  Distrito: ${result.name} en ${result.province}, ${result.department}`);
                }
            });
            return data;
        }
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
}

// Uso
searchLocation('lima');
searchLocation('cusco');
searchLocation('jesus');
```

---

## PHP (cURL) - Obtener Datos

### Ejemplo 1: Obtener Departamentos

```php
<?php
function getDepartments() {
    $apiUrl = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/departments";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
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

// Uso: Generar select de departamentos
$departments = getDepartments();
echo '<select name="department" id="department">';
echo '<option value="">Seleccione departamento</option>';
foreach ($departments as $dept) {
    echo sprintf('<option value="%s">%s</option>', 
        htmlspecialchars($dept['code']), 
        htmlspecialchars($dept['name'])
    );
}
echo '</select>';

// Mostrar información
echo "\n\nTotal departamentos: " . count($departments);
?>
```

### Ejemplo 2: Obtener Provincias por Departamento

```php
<?php
function getProvinces($departmentCode) {
    $apiUrl = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/provinces?department=" . urlencode($departmentCode);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
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

// Uso: Obtener provincias de Lima
$provinces = getProvinces('LIM');
echo '<select name="province" id="province">';
echo '<option value="">Seleccione provincia</option>';
foreach ($provinces as $province) {
    echo sprintf('<option value="%s">%s</option>', 
        htmlspecialchars($province), 
        htmlspecialchars($province)
    );
}
echo '</select>';

echo "\n\nProvincias de Lima: " . count($provinces);
?>
```

### Ejemplo 3: Obtener Distritos por Departamento y Provincia

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

// Uso: Obtener distritos de Lima Metropolitana
$districts = getDistricts('LMA', 'Lima Metropolitana');
echo '<select name="district" id="district">';
echo '<option value="">Seleccione distrito</option>';
foreach ($districts as $district) {
    echo sprintf('<option value="%s">%s</option>', 
        htmlspecialchars($district), 
        htmlspecialchars($district)
    );
}
echo '</select>';

echo "\n\nDistritos de Lima: " . count($districts);
print_r(array_slice($districts, 0, 5)); // Primeros 5
?>
```

### Ejemplo 4: Búsqueda de Ubicaciones

```php
<?php
function searchLocation($query) {
    if (strlen($query) < 2) {
        return ['ok' => false, 'error' => 'Query debe tener al menos 2 caracteres'];
    }
    
    $apiUrl = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/search?q=" . urlencode($query);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Uso: Buscar ubicaciones
$results = searchLocation('cusco');
if ($results['ok']) {
    echo "Resultados para 'cusco': " . count($results['data']) . "\n";
    foreach ($results['data'] as $result) {
        if ($result['type'] === 'province') {
            echo "Provincia: {$result['name']} ({$result['department']})\n";
        } else {
            echo "Distrito: {$result['name']} en {$result['province']}, {$result['department']}\n";
        }
    }
}
?>
```

### Ejemplo 5: Clase Completa UBIGEO API

```php
<?php
class UbigeoAPI {
    private $baseUrl = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';
    
    private function request($endpoint) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            return json_decode($response, true);
        }
        
        return ['ok' => false, 'error' => ['message' => 'HTTP Error: ' . $httpCode]];
    }
    
    public function getDepartments() {
        $result = $this->request('/departments');
        return $result['ok'] ? $result['data'] : [];
    }
    
    public function getProvinces($departmentCode) {
        $result = $this->request('/provinces?department=' . urlencode($departmentCode));
        return $result['ok'] ? $result['data'] : [];
    }
    
    public function getDistricts($departmentCode, $provinceName) {
        $endpoint = sprintf('/districts?department=%s&province=%s',
            urlencode($departmentCode),
            urlencode($provinceName)
        );
        $result = $this->request($endpoint);
        return $result['ok'] ? $result['data'] : [];
    }
    
    public function search($query) {
        $result = $this->request('/search?q=' . urlencode($query));
        return $result['ok'] ? $result['data'] : [];
    }
}

// Uso
$api = new UbigeoAPI();

// Obtener todos los departamentos
$departments = $api->getDepartments();
echo "Departamentos: " . count($departments) . "\n";

// Obtener provincias de Cusco
$provinces = $api->getProvinces('CUS');
echo "Provincias de Cusco: " . count($provinces) . "\n";

// Obtener distritos de Cusco/Cusco
$districts = $api->getDistricts('CUS', 'Cusco');
echo "Distritos de Cusco: " . count($districts) . "\n";

// Buscar
$results = $api->search('lima');
echo "Resultados búsqueda 'lima': " . count($results) . "\n";
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
    """Obtiene la lista completa de departamentos del Perú"""
    url = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/departments"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data['ok']:
            print(f"Cargados {len(data['data'])} departamentos")
            return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    return []

# Uso
departments = get_departments()
for dept in departments:
    print(f"{dept['code']}: {dept['name']}")
```

### Ejemplo 2: Obtener Provincias por Departamento

```python
import requests

def get_provinces(department_code):
    """Obtiene provincias de un departamento específico"""
    url = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/provinces"
    params = {'department': department_code}
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data['ok']:
            print(f" {len(data['data'])} provincias en {department_code}")
            return data['data']
        else:
            print(f" Error: {data['error']['message']}")
    except requests.exceptions.RequestException as e:
        print(f" Error de conexión: {e}")
    
    return []

# Uso
provinces = get_provinces('CUS')
for i, province in enumerate(provinces, 1):
    print(f"{i}. {province}")
```

### Ejemplo 3: Obtener Distritos por Departamento y Provincia

```python
import requests

def get_districts(department_code, province_name):
    """Obtiene distritos de una provincia específica"""
    url = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/districts"
    params = {
        'department': department_code,
        'province': province_name
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data['ok']:
            print(f" {len(data['data'])} distritos en {province_name}, {department_code}")
            return data['data']
        else:
            print(f" Error: {data['error']['message']}")
    except requests.exceptions.RequestException as e:
        print(f" Error de conexión: {e}")
    
    return []

# Uso
districts = get_districts('LIM', 'Lima')
print(f"Primeros 10 distritos de Lima:")
for district in districts[:10]:
    print(f"  - {district}")
```

### Ejemplo 4: Búsqueda de Ubicaciones

```python
import requests

def search_location(query):
    """Busca provincias y distritos por nombre"""
    if len(query) < 2:
        print("Query debe tener al menos 2 caracteres")
        return []
    
    url = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe/search"
    params = {'q': query}
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data['ok']:
            print(f"Encontrados {len(data['data'])} resultados para '{query}'")
            return data['data']
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    return []

# Uso
results = search_location('jesus')
for result in results:
    if result['type'] == 'province':
        print(f"Provincia: {result['name']} ({result['department']})")
    else:
        print(f"Distrito: {result['name']} en {result['province']}, {result['department']}")
```

### Ejemplo 5: Clase Completa UBIGEO API

```python
import requests
from typing import List, Dict, Optional

class UbigeoAPI:
    """Cliente Python para UBIGEO Perú API"""
    
    def __init__(self, base_url="https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
    
    def _request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Método privado para hacer requests"""
        try:
            url = f"{self.base_url}{endpoint}"
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'ok': False, 'error': {'message': str(e)}}
    
    def get_departments(self) -> List[Dict]:
        """Obtiene todos los departamentos"""
        result = self._request('/departments')
        return result['data'] if result['ok'] else []
    
    def get_provinces(self, department_code: str) -> List[str]:
        """Obtiene provincias por departamento"""
        result = self._request('/provinces', {'department': department_code})
        return result['data'] if result['ok'] else []
    
    def get_districts(self, department_code: str, province_name: str) -> List[str]:
        """Obtiene distritos por departamento y provincia"""
        params = {
            'department': department_code,
            'province': province_name
        }
        result = self._request('/districts', params)
        return result['data'] if result['ok'] else []
    
    def search(self, query: str) -> List[Dict]:
        """Busca provincias y distritos"""
        if len(query) < 2:
            return []
        result = self._request('/search', {'q': query})
        return result['data'] if result['ok'] else []
    
    def get_full_location(self, department_code: str, province_name: str, district_name: str) -> Dict:
        """Obtiene ubicación completa con validación"""
        # Validar departamento
        departments = self.get_departments()
        dept = next((d for d in departments if d['code'] == department_code), None)
        if not dept:
            return {'ok': False, 'error': 'Departamento no encontrado'}
        
        # Validar provincia
        provinces = self.get_provinces(department_code)
        if province_name not in provinces:
            return {'ok': False, 'error': 'Provincia no encontrada'}
        
        # Validar distrito
        districts = self.get_districts(department_code, province_name)
        if district_name not in districts:
            return {'ok': False, 'error': 'Distrito no encontrado'}
        
        return {
            'ok': True,
            'location': {
                'department': {'code': department_code, 'name': dept['name']},
                'province': province_name,
                'district': district_name
            }
        }

# Ejemplo de uso completo
if __name__ == '__main__':
    api = UbigeoAPI()
    
    # 1. Obtener departamentos
    print("=== DEPARTAMENTOS ===")
    departments = api.get_departments()
    print(f"Total: {len(departments)}")
    for dept in departments[:5]:
        print(f"  {dept['code']}: {dept['name']}")
    
    # 2. Obtener provincias de Cusco
    print("\n=== PROVINCIAS DE CUSCO ===")
    provinces = api.get_provinces('CUS')
    print(f"Total: {len(provinces)}")
    for province in provinces[:5]:
        print(f"  - {province}")
    
    # 3. Obtener distritos de Cusco/Cusco
    print("\n=== DISTRITOS DE CUSCO ===")
    districts = api.get_districts('CUS', 'Cusco')
    print(f"Total: {len(districts)}")
    for district in districts[:5]:
        print(f"  - {district}")
    
    # 4. Buscar ubicaciones
    print("\n=== BÚSQUEDA: 'lima' ===")
    results = api.search('lima')
    print(f"Resultados: {len(results)}")
    for result in results[:5]:
        tipo = "Provincia" if result['type'] == 'province' else "Distrito"
        print(f"  {tipo}: {result['name']} ({result['department']})")
    
    # 5. Validar ubicación completa
    print("\n=== VALIDACIÓN COMPLETA ===")
    location = api.get_full_location('LIM', 'Lima', 'Miraflores')
    if location['ok']:
        loc = location['location']
        print(f"Ubicación válida:")
        print(f"   Departamento: {loc['department']['name']} ({loc['department']['code']})")
        print(f"   Provincia: {loc['province']}")
        print(f"   Distrito: {loc['district']}")
    else:
        print(f"{location['error']}")
```

---

## Node.js - Backend Integration

### Instalación
```bash
npm install node-fetch
# O con ES modules nativos en Node 18+
```

### Ejemplo 1: Obtener Departamentos

```javascript
const fetch = require('node-fetch');

const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

async function getDepartments() {
    try {
        const response = await fetch(`${API_BASE}/departments`);
        const { ok, data, error } = await response.json();
        
        if (ok) {
            console.log(`Cargados ${data.length} departamentos`);
            return data;
        } else {
            console.error(`Error: ${error.message}`);
            return [];
        }
    } catch (err) {
        console.error('Error de conexión:', err.message);
        return [];
    }
}

// Uso
(async () => {
    const departments = await getDepartments();
    departments.forEach(dept => {
        console.log(`${dept.code}: ${dept.name}`);
    });
})();
```

### Ejemplo 2: Obtener Provincias por Departamento

```javascript
const fetch = require('node-fetch');

const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

async function getProvinces(departmentCode) {
    try {
        const url = `${API_BASE}/provinces?department=${departmentCode}`;
        const response = await fetch(url);
        const { ok, data, error } = await response.json();
        
        if (ok) {
            console.log(`${data.length} provincias en ${departmentCode}`);
            return data;
        } else {
            console.error(`Error: ${error.message}`);
            return [];
        }
    } catch (err) {
        console.error('Error de conexión:', err.message);
        return [];
    }
}

// Uso
(async () => {
    const provinces = await getProvinces('CUS');
    console.log('Provincias de Cusco:');
    provinces.forEach((province, i) => {
        console.log(`  ${i + 1}. ${province}`);
    });
})();
```

### Ejemplo 3: Obtener Distritos por Departamento y Provincia

```javascript
const fetch = require('node-fetch');

const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

async function getDistricts(departmentCode, provinceName) {
    try {
        const url = `${API_BASE}/districts?department=${departmentCode}&province=${encodeURIComponent(provinceName)}`;
        const response = await fetch(url);
        const { ok, data, error } = await response.json();
        
        if (ok) {
            console.log(`${data.length} distritos en ${provinceName}, ${departmentCode}`);
            return data;
        } else {
            console.error(`Error: ${error.message}`);
            return [];
        }
    } catch (err) {
        console.error('Error de conexión:', err.message);
        return [];
    }
}

// Uso
(async () => {
    const districts = await getDistricts('LIM', 'Lima');
    console.log('Primeros 10 distritos de Lima:');
    districts.slice(0, 10).forEach(district => {
        console.log(`  - ${district}`);
    });
})();
```

### Ejemplo 4: Búsqueda de Ubicaciones

```javascript
const fetch = require('node-fetch');

const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

async function searchLocation(query) {
    if (query.length < 2) {
        console.log('Query debe tener al menos 2 caracteres');
        return [];
    }
    
    try {
        const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const { ok, data } = await response.json();
        
        if (ok) {
            console.log(`Encontrados ${data.length} resultados para "${query}"`);
            return data;
        }
        return [];
    } catch (err) {
        console.error('Error:', err.message);
        return [];
    }
}

// Uso
(async () => {
    const results = await searchLocation('jesus');
    results.forEach(result => {
        if (result.type === 'province') {
            console.log(`Provincia: ${result.name} (${result.department})`);
        } else {
            console.log(`Distrito: ${result.name} en ${result.province}, ${result.department}`);
        }
    });
})();
```

### Ejemplo 5: API con Express.js (Proxy completo)

```javascript
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';

// Middleware para CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
});

// 1. Proxy para departamentos
app.get('/api/departments', async (req, res) => {
    try {
        const response = await fetch(`${API_BASE}/departments`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
});

// 2. Proxy para provincias
app.get('/api/provinces', async (req, res) => {
    try {
        const { department } = req.query;
        if (!department) {
            return res.status(400).json({ 
                ok: false, 
                error: { message: 'Parameter department is required' } 
            });
        }
        
        const response = await fetch(`${API_BASE}/provinces?department=${department}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
});

// 3. Proxy para distritos
app.get('/api/districts', async (req, res) => {
    try {
        const { department, province } = req.query;
        if (!department || !province) {
            return res.status(400).json({ 
                ok: false, 
                error: { message: 'Parameters department and province are required' } 
            });
        }
        
        const url = `${API_BASE}/districts?department=${department}&province=${encodeURIComponent(province)}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
});

// 4. Proxy para búsqueda
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(400).json({ 
                ok: false, 
                error: { message: 'Query must be at least 2 characters' } 
            });
        }
        
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   GET /api/departments`);
    console.log(`   GET /api/provinces?department=CUS`);
    console.log(`   GET /api/districts?department=CUS&province=Cusco`);
    console.log(`   GET /api/search?q=lima`);
});
```

### Ejemplo 6: Clase Completa UbigeoClient

```javascript
const fetch = require('node-fetch');

class UbigeoClient {
    constructor(baseUrl = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe') {
        this.baseUrl = baseUrl;
    }
    
    async _request(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
            
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            return { ok: false, error: { message: error.message } };
        }
    }
    
    async getDepartments() {
        const result = await this._request('/departments');
        return result.ok ? result.data : [];
    }
    
    async getProvinces(departmentCode) {
        const result = await this._request('/provinces', { department: departmentCode });
        return result.ok ? result.data : [];
    }
    
    async getDistricts(departmentCode, provinceName) {
        const result = await this._request('/districts', { 
            department: departmentCode, 
            province: provinceName 
        });
        return result.ok ? result.data : [];
    }
    
    async search(query) {
        if (query.length < 2) return [];
        const result = await this._request('/search', { q: query });
        return result.ok ? result.data : [];
    }
    
    async getFullLocation(departmentCode, provinceName, districtName) {
        // Validar en cascada
        const departments = await this.getDepartments();
        const dept = departments.find(d => d.code === departmentCode);
        if (!dept) return { ok: false, error: 'Departamento no encontrado' };
        
        const provinces = await this.getProvinces(departmentCode);
        if (!provinces.includes(provinceName)) {
            return { ok: false, error: 'Provincia no encontrada' };
        }
        
        const districts = await this.getDistricts(departmentCode, provinceName);
        if (!districts.includes(districtName)) {
            return { ok: false, error: 'Distrito no encontrado' };
        }
        
        return {
            ok: true,
            location: {
                department: { code: dept.code, name: dept.name },
                province: provinceName,
                district: districtName
            }
        };
    }
}

// Uso completo
(async () => {
    const client = new UbigeoClient();
    
    console.log('=== DEPARTAMENTOS ===');
    const departments = await client.getDepartments();
    console.log(`Total: ${departments.length}`);
    departments.slice(0, 5).forEach(d => console.log(`  ${d.code}: ${d.name}`));
    
    console.log('\n=== PROVINCIAS DE CUSCO ===');
    const provinces = await client.getProvinces('CUS');
    console.log(`Total: ${provinces.length}`);
    provinces.slice(0, 5).forEach(p => console.log(`  - ${p}`));
    
    console.log('\n=== DISTRITOS DE LIMA ===');
    const districts = await client.getDistricts('LIM', 'Lima');
    console.log(`Total: ${districts.length}`);
    districts.slice(0, 5).forEach(d => console.log(`  - ${d}`));
    
    console.log('\n=== BÚSQUEDA: lima ===');
    const results = await client.search('lima');
    console.log(`Resultados: ${results.length}`);
    results.slice(0, 5).forEach(r => {
        const tipo = r.type === 'province' ? 'Provincia' : 'Distrito';
        console.log(`  ${tipo}: ${r.name} (${r.department})`);
    });
    
    console.log('\n=== VALIDACIÓN COMPLETA ===');
    const location = await client.getFullLocation('LIM', 'Lima', 'Miraflores');
    if (location.ok) {
        const loc = location.location;
        console.log('Ubicación válida:');
        console.log(`   Departamento: ${loc.department.name} (${loc.department.code})`);
        console.log(`   Provincia: ${loc.province}`);
        console.log(`   Distrito: ${loc.district}`);
    } else {
        console.log(`${location.error}`);
    }
})();
```

---

## Java - Enterprise Integration

### Dependencias (Maven)

```xml
<dependencies>
    <!-- HTTP Client (Java 11+) -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
</dependencies>
```

### Ejemplo 1: Obtener Departamentos

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class UbigeoExample {
    private static final String API_BASE = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Gson gson = new Gson();
    
    public static JsonObject getDepartments() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_BASE + "/departments"))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        JsonObject result = gson.fromJson(response.body(), JsonObject.class);
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            System.out.println("Cargados " + data.size() + " departamentos");
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        try {
            JsonObject departments = getDepartments();
            if (departments.get("ok").getAsBoolean()) {
                JsonArray data = departments.getAsJsonArray("data");
                for (int i = 0; i < Math.min(5, data.size()); i++) {
                    JsonObject dept = data.get(i).getAsJsonObject();
                    System.out.println(dept.get("code").getAsString() + ": " + 
                                     dept.get("name").getAsString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Ejemplo 2: Obtener Provincias por Departamento

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class UbigeoProvinces {
    private static final String API_BASE = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Gson gson = new Gson();
    
    public static JsonObject getProvinces(String departmentCode) throws Exception {
        String url = String.format("%s/provinces?department=%s", API_BASE, departmentCode);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        JsonObject result = gson.fromJson(response.body(), JsonObject.class);
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            System.out.println(data.size() + " provincias en " + departmentCode);
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        try {
            JsonObject provinces = getProvinces("CUS");
            if (provinces.get("ok").getAsBoolean()) {
                JsonArray data = provinces.getAsJsonArray("data");
                System.out.println("Provincias de Cusco:");
                for (int i = 0; i < data.size(); i++) {
                    System.out.println("  " + (i + 1) + ". " + data.get(i).getAsString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Ejemplo 3: Obtener Distritos por Departamento y Provincia

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class UbigeoDistricts {
    private static final String API_BASE = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Gson gson = new Gson();
    
    public static JsonObject getDistricts(String departmentCode, String provinceName) throws Exception {
        String encodedProvince = URLEncoder.encode(provinceName, StandardCharsets.UTF_8);
        String url = String.format("%s/districts?department=%s&province=%s", 
                                  API_BASE, departmentCode, encodedProvince);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        JsonObject result = gson.fromJson(response.body(), JsonObject.class);
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            System.out.println(data.size() + " distritos en " + provinceName + ", " + departmentCode);
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        try {
            JsonObject districts = getDistricts("LIM", "Lima");
            if (districts.get("ok").getAsBoolean()) {
                JsonArray data = districts.getAsJsonArray("data");
                System.out.println("Primeros 10 distritos de Lima:");
                for (int i = 0; i < Math.min(10, data.size()); i++) {
                    System.out.println("  - " + data.get(i).getAsString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Ejemplo 4: Búsqueda de Ubicaciones

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class UbigeoSearch {
    private static final String API_BASE = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Gson gson = new Gson();
    
    public static JsonObject search(String query) throws Exception {
        if (query.length() < 2) {
            System.out.println("Query debe tener al menos 2 caracteres");
            return null;
        }
        
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String url = String.format("%s/search?q=%s", API_BASE, encodedQuery);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        JsonObject result = gson.fromJson(response.body(), JsonObject.class);
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            System.out.println("Encontrados " + data.size() + " resultados para \"" + query + "\"");
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        try {
            JsonObject results = search("jesus");
            if (results != null && results.get("ok").getAsBoolean()) {
                JsonArray data = results.getAsJsonArray("data");
                for (int i = 0; i < data.size(); i++) {
                    JsonObject result = data.get(i).getAsJsonObject();
                    String type = result.get("type").getAsString();
                    String name = result.get("name").getAsString();
                    String department = result.get("department").getAsString();
                    
                    if (type.equals("province")) {
                        System.out.println("Provincia: " + name + " (" + department + ")");
                    } else {
                        String province = result.get("province").getAsString();
                        System.out.println("Distrito: " + name + " en " + province + ", " + department);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Ejemplo 5: Clase Completa UbigeoAPI

```java
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

public class UbigeoAPI {
    private static final String API_BASE = "https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe";
    private final HttpClient client;
    private final Gson gson;
    
    public UbigeoAPI() {
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    private JsonObject request(String endpoint) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_BASE + endpoint))
            .GET()
            .header("Content-Type", "application/json")
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public List<Department> getDepartments() throws Exception {
        JsonObject result = request("/departments");
        List<Department> departments = new ArrayList<>();
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            for (JsonElement element : data) {
                JsonObject dept = element.getAsJsonObject();
                departments.add(new Department(
                    dept.get("code").getAsString(),
                    dept.get("name").getAsString()
                ));
            }
        }
        
        return departments;
    }
    
    public List<String> getProvinces(String departmentCode) throws Exception {
        String endpoint = "/provinces?department=" + departmentCode;
        JsonObject result = request(endpoint);
        List<String> provinces = new ArrayList<>();
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            for (JsonElement element : data) {
                provinces.add(element.getAsString());
            }
        }
        
        return provinces;
    }
    
    public List<String> getDistricts(String departmentCode, String provinceName) throws Exception {
        String encodedProvince = URLEncoder.encode(provinceName, StandardCharsets.UTF_8);
        String endpoint = String.format("/districts?department=%s&province=%s", 
                                       departmentCode, encodedProvince);
        JsonObject result = request(endpoint);
        List<String> districts = new ArrayList<>();
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            for (JsonElement element : data) {
                districts.add(element.getAsString());
            }
        }
        
        return districts;
    }
    
    public List<SearchResult> search(String query) throws Exception {
        if (query.length() < 2) return new ArrayList<>();
        
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String endpoint = "/search?q=" + encodedQuery;
        JsonObject result = request(endpoint);
        List<SearchResult> results = new ArrayList<>();
        
        if (result.get("ok").getAsBoolean()) {
            JsonArray data = result.getAsJsonArray("data");
            for (JsonElement element : data) {
                JsonObject item = element.getAsJsonObject();
                results.add(new SearchResult(
                    item.get("type").getAsString(),
                    item.get("name").getAsString(),
                    item.get("department").getAsString(),
                    item.has("province") ? item.get("province").getAsString() : null
                ));
            }
        }
        
        return results;
    }
    
    // Clases internas para tipos
    public static class Department {
        public final String code;
        public final String name;
        
        public Department(String code, String name) {
            this.code = code;
            this.name = name;
        }
        
        @Override
        public String toString() {
            return code + ": " + name;
        }
    }
    
    public static class SearchResult {
        public final String type;
        public final String name;
        public final String department;
        public final String province;
        
        public SearchResult(String type, String name, String department, String province) {
            this.type = type;
            this.name = name;
            this.department = department;
            this.province = province;
        }
        
        @Override
        public String toString() {
            if (type.equals("province")) {
                return "Provincia: " + name + " (" + department + ")";
            } else {
                return "Distrito: " + name + " en " + province + ", " + department;
            }
        }
    }
    
    // Ejemplo de uso
    public static void main(String[] args) {
        try {
            UbigeoAPI api = new UbigeoAPI();
            
            // 1. Obtener departamentos
            System.out.println("=== DEPARTAMENTOS ===");
            List<Department> departments = api.getDepartments();
            System.out.println("Total: " + departments.size());
            departments.stream().limit(5).forEach(System.out::println);
            
            // 2. Obtener provincias de Cusco
            System.out.println("\n=== PROVINCIAS DE CUSCO ===");
            List<String> provinces = api.getProvinces("CUS");
            System.out.println("Total: " + provinces.size());
            provinces.stream().limit(5).forEach(p -> System.out.println("  - " + p));
            
            // 3. Obtener distritos de Lima
            System.out.println("\n=== DISTRITOS DE LIMA ===");
            List<String> districts = api.getDistricts("LIM", "Lima");
            System.out.println("Total: " + districts.size());
            districts.stream().limit(5).forEach(d -> System.out.println("  - " + d));
            
            // 4. Buscar ubicaciones
            System.out.println("\n=== BÚSQUEDA: lima ===");
            List<SearchResult> results = api.search("lima");
            System.out.println("Resultados: " + results.size());
            results.stream().limit(5).forEach(System.out::println);
            
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
// Correcto
const API_BASE = 'https://api-ubigeo-peru.elmerastonitas.workers.dev/api/v1/pe';
const url = `${API_BASE}/districts?department=AMA&province=${encodeURIComponent('Rodriguez De Mendoza')}`;

// Incorrecto
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
