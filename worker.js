/**
 * UBIGEO Perú API - Cloudflare Worker
 * Provides REST endpoints for Peruvian geographic data (Departments, Provinces, Districts)
 */

// Normalized UBIGEO data
const UBIGEO_DATA = {
  departments: [
    { code: 'AMA', name: 'Amazonas' },
    { code: 'ANC', name: 'Ancash' },
    { code: 'APU', name: 'Apurímac' },
    { code: 'ARE', name: 'Arequipa' },
    { code: 'AYA', name: 'Ayacucho' },
    { code: 'CAJ', name: 'Cajamarca' },
    { code: 'CAL', name: 'Callao' },
    { code: 'CUS', name: 'Cusco' },
    { code: 'HUC', name: 'Huánuco' },
    { code: 'HUV', name: 'Huancavelica' },
    { code: 'ICA', name: 'Ica' },
    { code: 'JUN', name: 'Junín' },
    { code: 'LAL', name: 'La Libertad' },
    { code: 'LAM', name: 'Lambayeque' },
    { code: 'LIM', name: 'Lima' },
    { code: 'LMA', name: 'Lima Metropolitana' },
    { code: 'LOR', name: 'Loreto' },
    { code: 'MDD', name: 'Madre de Dios' },
    { code: 'MOQ', name: 'Moquegua' },
    { code: 'PAS', name: 'Pasco' },
    { code: 'PIU', name: 'Piura' },
    { code: 'PUN', name: 'Puno' },
    { code: 'SAM', name: 'San Martín' },
    { code: 'TAC', name: 'Tacna' },
    { code: 'TUM', name: 'Tumbes' },
    { code: 'UCA', name: 'Ucayali' }
  ],

  provincesByDepartment: {
    'AMA': ['Bagua', 'Bongara', 'Chachapoyas', 'Condorcanqui', 'Luya', 'Rodriguez De Mendoza', 'Utcubamba'],
    'ANC': ['Aija', 'Antonio Raymondi', 'Asuncion', 'Bolognesi', 'Carhuaz', 'Carlos Fermin Fitzcarrald', 'Casma', 'Corongo', 'Huaraz', 'Huari', 'Huarmey', 'Huaylas', 'Mariscal Luzuriaga', 'Ocros', 'Pallasca', 'Pomabamba', 'Recuay', 'Santa', 'Sihuas', 'Yungay'],
    'APU': ['Abancay', 'Andahuaylas', 'Antabamba', 'Aymaraes', 'Chincheros', 'Cotabambas', 'Grau'],
    'ARE': ['Arequipa', 'Camana', 'Caraveli', 'Castilla', 'Caylloma', 'Condesuyos', 'Islay', 'La Union'],
    'AYA': ['Cangallo', 'Huamanga', 'Huanca Sancos', 'Huanta', 'La Mar', 'Lucanas', 'Parinacochas', 'Paucar Del Sara Sara', 'Sucre', 'Victor Fajardo', 'Vilcas Huaman'],
    'CAJ': ['Cajabamba', 'Cajamarca', 'Celendin', 'Chota', 'Contumaza', 'Cutervo', 'Hualgayoc', 'Jaen', 'San Ignacio', 'San Marcos', 'San Miguel', 'San Pablo', 'Santa Cruz'],
    'CAL': ['Callao'],
    'CUS': ['Acomayo', 'Anta', 'Calca', 'Canas', 'Canchis', 'Chumbivilcas', 'Cusco', 'Espinar', 'La Convencion', 'Paruro', 'Paucartambo', 'Quispicanchi', 'Urubamba'],
    'HUC': ['Ambo', 'Dos De Mayo', 'Huacaybamba', 'Huamalies', 'Huanuco', 'Lauricocha', 'Leoncio Prado', 'Marañon', 'Pachitea', 'Puerto Inca', 'Yarowilca'],
    'HUV': ['Acobamba', 'Angaraes', 'Castrovirreyna', 'Churcampa', 'Huancavelica', 'Huaytara', 'Tayacaja'],
    'ICA': ['Chincha', 'Ica', 'Nazca', 'Palpa', 'Pisco'],
    'JUN': ['Chanchamayo', 'Chupaca', 'Concepcion', 'Huancayo', 'Jauja', 'Junin', 'Satipo', 'Tarma', 'Yauli'],
    'LAL': ['Ascope', 'Bolivar', 'Chepen', 'Gran Chimu', 'Julcan', 'Otuzco', 'Pacasmayo', 'Pataz', 'Sanchez Carrion', 'Santiago De Chuco', 'Trujillo', 'Viru'],
    'LAM': ['Chiclayo', 'Ferreñafe', 'Lambayeque'],
    'LIM': ['Barranca', 'Cajatambo', 'Canta', 'Cañete', 'Huaral', 'Huarochiri', 'Huaura', 'Oyon', 'Yauyos'],
    'LMA': ['Lima Metropolitana'],
    'LOR': ['Alto Amazonas', 'Datem Del Marañon', 'Loreto', 'Mariscal Ramon Castilla', 'Maynas', 'Putumayo', 'Requena', 'Ucayali'],
    'MDD': ['Manu', 'Tahuamanu', 'Tambopata'],
    'MOQ': ['General Sanchez Cerro', 'Ilo', 'Mariscal Nieto'],
    'PAS': ['Daniel Alcides Carrion', 'Oxapampa', 'Pasco'],
    'PIU': ['Ayabaca', 'Huancabamba', 'Morropon', 'Paita', 'Piura', 'Sechura', 'Sullana', 'Talara'],
    'PUN': ['Azangaro', 'Carabaya', 'Chucuito', 'El Collao', 'Huancane', 'Lampa', 'Melgar', 'Moho', 'Puno', 'San Antonio De Putina', 'San Roman', 'Sandia', 'Yunguyo'],
    'SAM': ['Bellavista', 'El Dorado', 'Huallaga', 'Lamas', 'Mariscal Caceres', 'Moyobamba', 'Picota', 'Rioja', 'San Martin', 'Tocache'],
    'TAC': ['Candarave', 'Jorge Basadre', 'Tacna', 'Tarata'],
    'TUM': ['Contralmirante Villar', 'Tumbes', 'Zarumilla'],
    'UCA': ['Atalaya', 'Coronel Portillo', 'Padre Abad', 'Purus']
  }
};

// Parse raw data to extract districts
function parseRawData() {
  const rawData = {
    'AMA': ['Bagua / Bagua', 'Bagua / Aramango', 'Bagua / Copallin', 'Bagua / El Parco', 'Bagua / Imaza', 'Bagua / La Peca', 'Bongara / Jumbilla', 'Bongara / Chisquilla', 'Bongara / Churuja', 'Bongara / Corosha', 'Bongara / Cuispes', 'Bongara / Florida', 'Bongara / Jazan', 'Bongara / Recta', 'Bongara / San Carlos', 'Bongara / Shipasbamba', 'Bongara / Valera', 'Bongara / Yambrasbamba', 'Chachapoyas / Chachapoyas', 'Chachapoyas / Asuncion', 'Chachapoyas / Balsas', 'Chachapoyas / Cheto', 'Chachapoyas / Chiliquin', 'Chachapoyas / Chuquibamba', 'Chachapoyas / Granada', 'Chachapoyas / Huancas', 'Chachapoyas / La Jalca', 'Chachapoyas / Leimebamba', 'Chachapoyas / Levanto', 'Chachapoyas / Magdalena', 'Chachapoyas / Mariscal Castilla', 'Chachapoyas / Molinopampa', 'Chachapoyas / Montevideo', 'Chachapoyas / Olleros', 'Chachapoyas / Quinjalca', 'Chachapoyas / San Francisco De Daguas', 'Chachapoyas / San Isidro De Maino', 'Chachapoyas / Soloco', 'Chachapoyas / Sonche', 'Condorcanqui / Nieva', 'Condorcanqui / El Cenepa', 'Condorcanqui / Rio Santiago', 'Luya / Lamud', 'Luya / Camporredondo', 'Luya / Cocabamba', 'Luya / Colcamar', 'Luya / Conila', 'Luya / Inguilpata', 'Luya / Longuita', 'Luya / Lonya Chico', 'Luya / Luya', 'Luya / Luya Viejo', 'Luya / Maria', 'Luya / Ocalli', 'Luya / Ocumal', 'Luya / Pisuquia', 'Luya / Providencia', 'Luya / San Cristobal', 'Luya / San Francisco Del Yeso', 'Luya / San Jeronimo', 'Luya / San Juan De Lopecancha', 'Luya / Santa Catalina', 'Luya / Santo Tomas', 'Luya / Tingo', 'Luya / Trita', 'Rodriguez De Mendoza / San Nicolas', 'Rodriguez De Mendoza / Chirimoto', 'Rodriguez De Mendoza / Cochamal', 'Rodriguez De Mendoza / Huambo', 'Rodriguez De Mendoza / Limabamba', 'Rodriguez De Mendoza / Longar', 'Rodriguez De Mendoza / Mariscal Benavides', 'Rodriguez De Mendoza / Milpuc', 'Rodriguez De Mendoza / Omia', 'Rodriguez De Mendoza / Santa Rosa', 'Rodriguez De Mendoza / Totora', 'Rodriguez De Mendoza / Vista Alegre', 'Utcubamba / Bagua Grande', 'Utcubamba / Cajaruro', 'Utcubamba / Cumba', 'Utcubamba / El Milagro', 'Utcubamba / Jamalca', 'Utcubamba / Lonya Grande', 'Utcubamba / Yamon']
  };

  const districts = {};

  for (const [deptCode, entries] of Object.entries(rawData)) {
    districts[deptCode] = {};

    for (const entry of entries) {
      const [province, district] = entry.split(' / ');
      if (!districts[deptCode][province]) {
        districts[deptCode][province] = [];
      }
      if (!districts[deptCode][province].includes(district)) {
        districts[deptCode][province].push(district);
      }
    }

    // Sort districts alphabetically
    for (const province in districts[deptCode]) {
      districts[deptCode][province].sort();
    }
  }

  return districts;
}

// Initialize districts data (will be populated with full data)
const districtsByDepartmentProvince = parseRawData();

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};

// Cache headers
const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400'
};

// Helper: Create JSON response
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...CORS_HEADERS, ...CACHE_HEADERS }
  });
}

// Helper: Success response
function successResponse(data) {
  return jsonResponse({ ok: true, data });
}

// Helper: Error response
function errorResponse(code, message, status = 400) {
  return jsonResponse({ ok: false, error: { code, message } }, status);
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return errorResponse('METHOD_NOT_ALLOWED', 'Only GET requests are allowed', 405);
    }

    // Check cache first
    const cache = caches.default;
    let response = await cache.match(request);
    if (response) {
      return response;
    }

    // Route handling
    const path = url.pathname;

    // GET / (root)
    if (path === '/') {
      response = jsonResponse({
        ok: true,
        service: 'UBIGEO Perú API',
        version: 'v1',
        endpoints: [
          '/health',
          '/api/v1/pe/departments',
          '/api/v1/pe/provinces?department=CAJ',
          '/api/v1/pe/districts?department=CAJ&province=Cutervo',
          '/api/v1/pe/search?q=bagua'
        ]
      });
    }

    // GET /health
    else if (path === '/health') {
      response = jsonResponse({
        ok: true,
        status: 'healthy'
      });
    }

    // GET /api/v1/pe/departments
    else if (path === '/api/v1/pe/departments') {
      response = successResponse(UBIGEO_DATA.departments);
    }


    // GET /api/v1/pe/departments
    if (path === '/api/v1/pe/departments') {
      response = successResponse(UBIGEO_DATA.departments);
    }

    // GET /api/v1/pe/provinces?department=CODE
    else if (path === '/api/v1/pe/provinces') {
      const department = url.searchParams.get('department');

      if (!department) {
        return errorResponse('MISSING_PARAMETER', "Parameter 'department' is required");
      }

      const provinces = UBIGEO_DATA.provincesByDepartment[department.toUpperCase()];

      if (!provinces) {
        return errorResponse('INVALID_DEPARTMENT', `Department '${department}' not found`, 404);
      }

      response = successResponse(provinces);
    }

    // GET /api/v1/pe/districts?department=CODE&province=NAME
    else if (path === '/api/v1/pe/districts') {
      const department = url.searchParams.get('department');
      const province = url.searchParams.get('province');

      if (!department) {
        return errorResponse('MISSING_PARAMETER', "Parameter 'department' is required");
      }

      if (!province) {
        return errorResponse('MISSING_PARAMETER', "Parameter 'province' is required");
      }

      const deptData = districtsByDepartmentProvince[department.toUpperCase()];

      if (!deptData) {
        return errorResponse('INVALID_DEPARTMENT', `Department '${department}' not found`, 404);
      }

      const districts = deptData[province];

      if (!districts) {
        return errorResponse('INVALID_PROVINCE', `Province '${province}' not found in department '${department}'`, 404);
      }

      response = successResponse(districts);
    }

    // GET /api/v1/pe/search?q=QUERY
    else if (path === '/api/v1/pe/search') {
      const query = url.searchParams.get('q');

      if (!query || query.length < 2) {
        return errorResponse('INVALID_QUERY', 'Query must be at least 2 characters long');
      }

      const results = [];
      const queryLower = query.toLowerCase();

      // Search in provinces and districts
      for (const [deptCode, provinces] of Object.entries(UBIGEO_DATA.provincesByDepartment)) {
        for (const province of provinces) {
          if (province.toLowerCase().includes(queryLower)) {
            results.push({ type: 'province', department: deptCode, name: province });
          }
        }

        const deptDistricts = districtsByDepartmentProvince[deptCode];
        if (deptDistricts) {
          for (const [province, districts] of Object.entries(deptDistricts)) {
            for (const district of districts) {
              if (district.toLowerCase().includes(queryLower)) {
                results.push({ type: 'district', department: deptCode, province, name: district });
              }
            }
          }
        }
      }

      response = successResponse(results.slice(0, 50)); // Limit to 50 results
    }

    // 404 Not Found
    else {
      return errorResponse('NOT_FOUND', 'Endpoint not found', 404);
    }

    // Cache the response
    ctx.waitUntil(cache.put(request, response.clone()));

    return response;
  }
};
