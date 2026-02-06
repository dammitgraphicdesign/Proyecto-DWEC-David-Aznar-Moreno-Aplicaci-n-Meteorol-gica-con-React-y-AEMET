// ========================================
// SERVIDOR BACKEND CON EXPRESS
// ========================================
// Este archivo crea un servidor Node.js que:
// 1. Actúa como intermediario entre el frontend y la API de AEMET
// 2. Oculta la API key de AEMET (seguridad)
// 3. Maneja problemas de encoding y CORS

// ========================================
// IMPORTAR DEPENDENCIAS (Librerías)
// ========================================
// require() importa módulos de Node.js (CommonJS, no ES6 modules)

const express = require('express'); // Framework para crear servidores HTTP
const cors = require('cors'); // Middleware para permitir peticiones desde otros orígenes (frontend)
require('dotenv').config(); // Carga variables de entorno desde archivo .env

// ========================================
// CREAR APLICACIÓN EXPRESS
// ========================================
// Express es un framework que simplifica la creación de servidores web
// app es nuestro servidor

const app = express();

// Puerto donde escuchará el servidor
// process.env.PORT busca variable de entorno PORT (si existe)
// || 3000 significa "si no existe, usar 3000"
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES
// ========================================
// Los middlewares procesan las peticiones ANTES de llegar a las rutas
// Se ejecutan en orden secuencial

// CORS (Cross-Origin Resource Sharing)
// Permite que el frontend (localhost:5173) haga peticiones al backend (localhost:3000)
// Sin esto, el navegador bloqueará las peticiones por seguridad
app.use(cors());

// express.json() convierte el body de las peticiones POST/PUT a objetos JavaScript
// Necesario para leer datos que envía el frontend
app.use(express.json());

// ========================================
// RUTA PRINCIPAL - Documentación del API
// ========================================
// GET / muestra información sobre los endpoints disponibles
// Útil para saber qué rutas existen sin consultar el código

app.get('/', (req, res) => {
  // req = request (petición que recibimos)
  // res = response (respuesta que enviaremos)
  
  // res.json() envía un objeto JavaScript como JSON al cliente
  res.json({
    mensaje: 'Bienvenido a la API Backend',
    endpoints: {
      // Endpoints de ejemplo (no los usamos, son plantilla)
      '/api/ejemplo': 'Obtiene datos de ejemplo de una API externa',
      '/api/usuarios': 'Obtiene lista de usuarios de ejemplo',
      '/api/usuario/:id': 'Obtiene un usuario específico por ID',

      // ENDPOINTS REALES que usa nuestra aplicación
      '/api/tiempo/municipio/diaria/:codigo': 'Predicción diaria por municipio (AEMET)',
      '/api/tiempo/municipio/horaria/:codigo': 'Predicción horaria por municipio (AEMET)'
    }
  });
});

// ========================================
// RUTAS DE EJEMPLO (No usadas, plantilla)
// ========================================
// Estas rutas son ejemplos de cómo hacer peticiones a APIs externas
// Puedes eliminarlas si quieres, no afectan a la app meteorológica

app.get('/api/ejemplo', async (req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    if (!response.ok) throw new Error(`Error en la API externa: ${response.status}`);
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al consultar la API:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los datos de la API externa',
      detalles: error.message
    });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const usuarios = await response.json();
    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
  }
});

app.get('/api/usuario/:id', async (req, res) => {
  try {
    // req.params contiene los parámetros de la URL
    // Si la ruta es /api/usuario/5, req.params.id = '5'
    const { id } = req.params;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const usuario = await response.json();
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: 'Error al obtener el usuario' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    // req.query contiene parámetros de query string
    // Si la URL es /api/posts?userId=1, req.query.userId = '1'
    const { userId } = req.query;
    let url = 'https://jsonplaceholder.typicode.com/posts';
    if (userId) url += `?userId=${userId}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const posts = await response.json();

    res.json({
      success: true,
      total: posts.length,
      filtros: { userId: userId || 'ninguno' },
      data: posts
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: 'Error al obtener posts' });
  }
});

// ========================================
// FUNCIÓN HELPER PARA API AEMET
// ========================================
/**
 * Función que maneja la peculiaridad de la API de AEMET
 * 
 * PROBLEMA: La API de AEMET funciona en DOS pasos:
 * 1. Primera petición: devuelve un JSON con una URL en el campo "datos"
 * 2. Segunda petición: A esa URL para obtener los datos reales
 * 
 * ADEMÁS: La segunda respuesta puede tener problemas de encoding (UTF-8 vs Latin1)
 * Los caracteres como "ñ", "á", "í" pueden verse mal (�)
 * 
 * @param {string} urlAemet - URL de la API de AEMET con API key
 * @returns {Object} - {ok: boolean, status: number, data: Object} o error
 */
async function pedirAemetDosPasos(urlAemet) {
  // ========================================
  // PASO 1: Primera petición a AEMET
  // ========================================
  // Esta petición NO devuelve los datos, solo un JSON con una URL
  
  const primera = await fetch(urlAemet);
  
  // Si falla la primera petición, devolver error
  if (!primera.ok) {
    const texto = await primera.text();
    return { ok: false, status: primera.status, detalle: texto };
  }

  // Parsear respuesta JSON de la primera petición
  const info = await primera.json();
  
  // Validar que exista el campo "datos" con la URL
  if (!info.datos) {
    return { ok: false, status: 404, detalle: 'AEMET no devolvió el campo "datos"' };
  }

  // ========================================
  // PASO 2: Segunda petición (a la URL que nos dieron)
  // ========================================
  // AQUÍ están los datos meteorológicos reales
  
  const segunda = await fetch(info.datos);
  
  // Si falla la segunda petición, devolver error
  if (!segunda.ok) {
    const texto = await segunda.text();
    return { ok: false, status: segunda.status, detalle: texto };
  }

  // ========================================
  // PROBLEMA DE ENCODING
  // ========================================
  // AEMET a veces envía texto con encoding incorrecto
  // Caracteres españoles (ñ, á, í) se ven como � o Meteorolog�a
  // SOLUCIÓN: Leer como bytes y probar diferentes encodings
  
  // arrayBuffer() lee la respuesta como bytes (no como texto)
  const buffer = await segunda.arrayBuffer();

  // Intento 1: Decodificar como UTF-8 (estándar moderno)
  let texto = new TextDecoder('utf-8').decode(buffer);

  // Si vemos caracteres raros (�), probamos Latin1 (encoding antiguo español)
  if (texto.includes('�') || texto.includes('Meteorolog�a')) {
    texto = new TextDecoder('latin1').decode(buffer);
  }

  // ========================================
  // INTENTAR PARSEAR COMO JSON
  // ========================================
  // Aunque el content-type no lo diga, AEMET devuelve JSON
  
  const textoTrim = texto.trim(); // Quitar espacios al inicio/final
  const pareceJson = textoTrim.startsWith('{') || textoTrim.startsWith('[');

  if (pareceJson) {
    try {
      const json = JSON.parse(textoTrim); // Convertir texto a objeto JavaScript
      return { ok: true, formato: 'json', data: json };
    } catch (e) {
      // Si falla el parseo, devolver como texto
      return { ok: true, formato: 'texto', data: texto };
    }
  }

  // Si no parece JSON, devolver texto plano
  return { ok: true, formato: 'texto', data: texto };
}

// ========================================
// RUTA: PREDICCIÓN DIARIA POR MUNICIPIO
// ========================================
// GET /api/tiempo/municipio/diaria/:codigo
// Ejemplo: /api/tiempo/municipio/diaria/41091 (Sevilla)
app.get('/api/tiempo/municipio/diaria/:codigo', async (req, res) => {
  try {
    // ========================================
    // EXTRAER PARÁMETROS
    // ========================================
    // req.params contiene los parámetros de la URL
    // :codigo en la ruta se convierte en req.params.codigo
    const { codigo } = req.params;

    // VALIDACIÓN: Verificar que el código no esté vacío
    if (!codigo || codigo.trim() === '') {
      return res.status(400).json({ success: false, error: 'Código de municipio vacío' });
    }

    // ========================================
    // OBTENER API KEY DE VARIABLES DE ENTORNO
    // ========================================
    // process.env accede a variables de entorno (.env)
    // La API key NUNCA debe estar en el código (seguridad)
    // Debe estar en el archivo .env: AEMET_API_KEY=tu_clave_aquí
    const API_KEY = process.env.AEMET_API_KEY;
    
    // Si falta la API key, error 500 (problema del servidor)
    if (!API_KEY) {
      return res.status(500).json({ success: false, error: 'Falta AEMET_API_KEY en el archivo .env' });
    }

    // ========================================
    // CONSTRUIR URL DE AEMET
    // ========================================
    // URL del endpoint de AEMET para predicción diaria por municipio
    // Template literals permiten interpolar variables
    const urlAemet =
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${codigo}?api_key=${API_KEY}`;

    // ========================================
    // HACER PETICIÓN A AEMET (2 pasos)
    // ========================================
    // Llamar a nuestra función helper que maneja la complejidad de AEMET
    const resultado = await pedirAemetDosPasos(urlAemet);

    // Si AEMET devolvió error
    if (!resultado.ok) {
      return res.status(resultado.status || 500).json({
        success: false,
        error: 'Error consultando AEMET (diaria)',
        detalles: resultado.detalle
      });
    }

    // ========================================
    // ENVIAR RESPUESTA EXITOSA
    // ========================================
    // res.json() convierte el objeto a JSON y lo envía al frontend
    return res.json({
      success: true,
      tipo: 'diaria',           // Tipo de predicción
      formato: resultado.formato, // 'json' o 'texto'
      data: resultado.data       // Datos meteorológicos
    });
    
  } catch (error) {
    // Si algo falla inesperadamente, capturamos el error
    console.error('Error AEMET diaria:', error.message);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ========================================
// RUTA: PREDICCIÓN HORARIA POR MUNICIPIO
// ========================================
// GET /api/tiempo/municipio/horaria/:codigo
// Ejemplo: /api/tiempo/municipio/horaria/41091 (Sevilla)
app.get('/api/tiempo/municipio/horaria/:codigo', async (req, res) => {
  try {
    // Extraer código de municipio de los parámetros
    const { codigo } = req.params;

    // Validación: código no puede estar vacío
    if (!codigo || codigo.trim() === '') {
      return res.status(400).json({ success: false, error: 'Código de municipio vacío' });
    }

    // Obtener API key del archivo .env
    const API_KEY = process.env.AEMET_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ success: false, error: 'Falta AEMET_API_KEY en el archivo .env' });
    }

    // Construir URL para predicción HORARIA
    // Notar que la ruta cambia a "horaria" en vez de "diaria"
    const urlAemet =
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${codigo}?api_key=${API_KEY}`;

    // Hacer petición a AEMET (función helper maneja los 2 pasos)
    const resultado = await pedirAemetDosPasos(urlAemet);

    // Manejar errores de AEMET
    if (!resultado.ok) {
      return res.status(resultado.status || 500).json({
        success: false,
        error: 'Error consultando AEMET (horaria)',
        detalles: resultado.detalle
      });
    }

    // Enviar respuesta exitosa con los datos
    return res.json({
      success: true,
      tipo: 'horaria',
      formato: resultado.formato,
      data: resultado.data
    });
    
  } catch (error) {
    console.error('Error AEMET horaria:', error.message);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ========================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ========================================
// Esta ruta se ejecuta si ninguna otra ruta coincide
// app.use() sin ruta específica se ejecuta para TODAS las peticiones que lleguen aquí
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint no encontrado' });
});

// ========================================
// INICIAR EL SERVIDOR
// ========================================
// app.listen() hace que el servidor empiece a escuchar peticiones
// El servidor queda "vivo" esperando peticiones HTTP
app.listen(PORT, () => {
  // Este callback se ejecuta cuando el servidor está listo
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
