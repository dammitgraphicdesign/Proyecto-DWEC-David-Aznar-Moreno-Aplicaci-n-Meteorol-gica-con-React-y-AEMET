//  seervicio de tiempo , peticion al backend para obtener los datos meteorologicos

// este archivo contiene funciones para comunicarse con el backend
// utiliza la fetch api para hacer peticiones HTTP

//IMPORTANTE: URL del backend
// - En desarrollo hay que usa localhost:3000
// - En producción: hay que actualizar esta URL con la del backend desplegado
// 
const BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3000'
  : 'http://localhost:3000'; 

  //Obtiene la prediccion meteorologica de un municipio
  
  //@param {string} tipo ,Tipo de prediccion: 'diaria' o 'horaria'
  //@param {string} codigoMunicipio, codigo del municipio por ejemplo '41091' para Sevilla
  //@returns {Promise<Object>} , promesa que resuelve con los datos meteorologicos
  //@throws {Error},lanza error si la peticion falla o si el servidor devuelve un error
  //async/await, maneja operaciones asncronas de forma legible
  //fetch, api del navegador para hacer peticiones HTTP
  //try/catch: Captura y maneja errores
  //AbortController, permite cancelar una petición fetch después de un tiempo (timeout)
export async function obtenerTiempoMunicipio(tipo, codigoMunicipio) {
  try {
    const controller = new AbortController(); // Crea un controlador de cancelacioon
    // setTimeout ejecuta una funcion después de X milisegundos
    // En este cas 10 segundos 10000 ms
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // FETCH - Petición HTTP al backend
    // fetch() es una funcion del navegador para hacer peticiones HTTP
    // Es asiincrona, por eso se usa 'await' para esperar su respuesta
    // signal: controller.signal permite que setTimeout cancele esta peticion
    const res = await fetch(
      `${BASE_URL}/api/tiempo/municipio/${tipo}/${codigoMunicipio}`,
      { signal: controller.signal } // Conectar con el AbortController
    );

    // sii la peticion noi se cancelo se limpia el timeout
    // clearTimeout cancela la funcion programada en setTimeout
    clearTimeout(timeoutId);

    // pasear respues al json

    // El servidor responde con texto json  y hay que  convertirlo a objeto JavaScript
    let json;
    try {
      json = await res.json(); //onvertir texto json a objeto
    } catch {
      // Si el json esta makl formado sse lanza un  error 
      throw new Error('El servidor devolvio una respuesta invalida');
    }

    // manejo de errores htttp
  
    // res.ok es false si el codigo HTTP es 4xx o 5xx (errores)
    // Codigos http comunes:
    //  200: OK exito
    // 404: Not Found 
    // 500: Internal Server Error 
    // 503: Service Unavailable 
    
    if (!res.ok) {
      // Diferentes mensajes segun el codigo de error
      if (res.status === 404) {
        throw new Error('Municipio no encontrado');
      } else if (res.status === 500) {
        throw new Error(json.error || 'Error interno del servidor. Intenta de nuevo.');
      } else if (res.status === 503) {
        throw new Error('Servicio AEMET no disponible temporalmente');
      } else {
        throw new Error(json.error || `Error ${res.status}: No se pudo obtener el tiempo`);
      }
    }

 
 // validar formato de resouesta

    //verifica que el servidor respondio con el formato esperado
    if (!json.success) {
      throw new Error(json.error || 'Error al obtener el tiempo');
    }
    // Todo correcto se devuelvene los datos
    return json;

  } catch (error) {

    // manejo de errores de red y otros errores inesperados
    // try/catch captura cualquier error que ocurra en el bloque try
    // Error por timeout peticion cancelada
    if (error.name === 'AbortError') {
      throw new Error('La petición tardo demasiado. Verifica tu conexion.');
    } 
    // Error de red servidor no accesible
    else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. ¿Está el backend en ejecución?');
    } 
    // Otros errores se relanxza el error con su mensaje original
    else if (error.message) {
      throw error; // se relanza  el error con el mensaje que ya construimos
    } 
    // Error desconocido
    else {
      throw new Error('Error de red desconocido. Verifica tu conexion.');
    }
  }
}
