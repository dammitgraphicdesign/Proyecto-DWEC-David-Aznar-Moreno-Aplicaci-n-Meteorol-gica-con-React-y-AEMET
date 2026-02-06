
//Mapeo de  los codigos  de aemet a  los iconos personalizados de la carpeta weather-icons-master:

//he creado esta carpeta con los iconos personalizados para que  la app sea mas visual y atractiva, ya que los iconos originales de aemet eran muy basicos  y no se adaptan bien al diseño de la app.
// he incluido iconos para cada estado del cielo que devuelve la API de AEMET
//He utilizado los iconos de la libreria weather-icons-master de esta web https://bas.dev/ y los he personalizado un poco para que se adapten mejor al diseño de la app.

// los codigos de aemet y sus descripcion4es
const CODIGO_AEMET = {
  // despejado
  '11': 'despejado', '11n': 'despejado-noche',
  
  //poco nuboso
  '12': 'poco-nuboso', '12n': 'poco-nuboso-noche',
  
  // intervalos nubosos
  '13': 'intervalos-nubosos', '13n': 'intervalos-nubosos-noche',
  
  // nuboso
  '14': 'nuboso', '14n': 'nuboso-noche',
  '15': 'nuboso', '15n': 'nuboso-noche',
  
  //muy nuboso
  '16': 'muy-nuboso', '16n': 'muy-nuboso-noche',
  '17': 'muy-nuboso', '17n': 'muy-nuboso-noche',
  
  //cubierto
  '18': 'cubierto',
  
  // nubes altas
  '19': 'nubes-altas',
  
  //intervalos nubosos con lluvia
  '23': 'lluvia-ligera', '23n': 'lluvia-ligera-noche',
  '24': 'lluvia-moderada', '24n': 'lluvia-moderada-noche',
  
  //muy nuboso con lluvia
  '25': 'lluvia-moderada', '25n': 'lluvia-moderada-noche',
  '26': 'lluvia-fuerte', '26n': 'lluvia-fuerte-noche',
  
  //chubascos
  '33': 'chubascos', '33n': 'chubascos-noche',
  '34': 'chubascos', '34n': 'chubascos-noche',
  
  //lluvia escasa
  '43': 'llovizna', '43n': 'llovizna-noche',
  '44': 'llovizna', '44n': 'llovizna-noche',
  '45': 'llovizna', '45n': 'llovizna-noche',
  '46': 'llovizna', '46n': 'llovizna-noche',
  
  // tormenta
  '51': 'tormenta', '51n': 'tormenta-noche',
  '52': 'tormenta', '52n': 'tormenta-noche',
  '53': 'tormenta', '53n': 'tormenta-noche',
  '54': 'tormenta-fuerte', '54n': 'tormenta-fuerte-noche',
  
  // nieve
  '61': 'nieve', '61n': 'nieve-noche',
  '62': 'nieve', '62n': 'nieve-noche',
  '63': 'nieve', '63n': 'nieve-noche',
  '64': 'nieve-fuerte', '64n': 'nieve-fuerte-noche',
  
  //granizo
  '71': 'granizo',
  
  // niebla
  '81': 'niebla', '82': 'niebla'
};

// Mapeo a archivos de  mis iconos de la carpeta weather-icons-master
const MAPEO_ICONOS = {
  // Despejado
  'despejado': 'clear-day.svg',
  'despejado-noche': 'clear-night.svg',
  
  // Poco nuboso
  'poco-nuboso': 'partly-cloudy-day.svg',
  'poco-nuboso-noche': 'partly-cloudy-night.svg',
  
  // Intervalos nubosos
  'intervalos-nubosos': 'partly-cloudy-day.svg',
  'intervalos-nubosos-noche': 'partly-cloudy-night.svg',
  
  // Nuboso
  'nuboso': 'cloudy.svg',
  'nuboso-noche': 'partly-cloudy-night.svg',
  
  // Muy nuboso
  'muy-nuboso': 'overcast-day.svg',
  'muy-nuboso-noche': 'overcast-night.svg',
  
  // Cubierto
  'cubierto': 'overcast.svg',
  
  // Nubes altas
  'nubes-altas': 'haze.svg',
  
  // Lluvia
  'lluvia-ligera': 'partly-cloudy-day-rain.svg',
  'lluvia-ligera-noche': 'partly-cloudy-night-rain.svg',
  'lluvia-moderada': 'rain.svg',
  'lluvia-moderada-noche': 'partly-cloudy-night-rain.svg',
  'lluvia-fuerte': 'rain.svg',
  'lluvia-fuerte-noche': 'partly-cloudy-night-rain.svg',
  
  // Chubascos
  'chubascos': 'partly-cloudy-day-drizzle.svg',
  'chubascos-noche': 'partly-cloudy-night-drizzle.svg',
  
  // Llovizna
  'llovizna': 'drizzle.svg',
  'llovizna-noche': 'partly-cloudy-night-drizzle.svg',
  
  // Tormenta
  'tormenta': 'thunderstorms.svg',
  'tormenta-noche': 'thunderstorms-night.svg',
  'tormenta-fuerte': 'thunderstorms-day-rain.svg',
  'tormenta-fuerte-noche': 'thunderstorms-night-rain.svg',
  
  // Nieve
  'nieve': 'partly-cloudy-day-snow.svg',
  'nieve-noche': 'partly-cloudy-night-snow.svg',
  'nieve-fuerte': 'thunderstorms-day-snow.svg',
  'nieve-fuerte-noche': 'thunderstorms-night-snow.svg',
  
  // Granizo
  'granizo': 'hail.svg',
  
  // Niebla
  'niebla': 'fog.svg'
};

/**
 * Obtiene la ruta del icono según el código de AEMET
 * @param {string} codigoAemet, Codigo de estado del cielo de AEMET
 * @param {string} estilo ,- 'fill' o 'line' por defecto 'fill'
 * @returns {string}, - ruta al archivo SVG
 */
export function obtenerIconoTiempo(codigoAemet, estilo = 'fill') {
  if (!codigoAemet) {
    return `/weather-icons-master/production/${estilo}/all/not-available.svg`;
  }
  const tipo = CODIGO_AEMET[codigoAemet];
  if (!tipo) {
    return `/weather-icons-master/production/${estilo}/all/not-available.svg`;
  }
  const archivo = MAPEO_ICONOS[tipo] || 'not-available.svg';
  return `/weather-icons-master/production/${estilo}/all/${archivo}`;
}

//Obtiene el icono segun la descripcion alternativa
//@param {string} descripcion,Descripción del estado del cielo
//@param {boolean} esNoche ,Si es de noche
//@returns {string},Ruta al archivo SVG
export function obtenerIconoPorDescripcion(descripcion, esNoche = false) {
  if (!descripcion) {
    return '/weather-icons-master/production/fill/all/not-available.svg';
  }
  const desc = descripcion.toLowerCase();
  // despejado
  if (desc.includes('despejado')) {
    return esNoche ? 
      '/weather-icons-master/production/fill/all/clear-night.svg' :
      '/weather-icons-master/production/fill/all/clear-day.svg';
  }
  //tormenta
  if (desc.includes('tormenta')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/thunderstorms-night.svg' :
      '/weather-icons-master/production/fill/all/thunderstorms.svg';
  }
  //lluvia fuerte/intensa
  if (desc.includes('lluvia fuerte') || desc.includes('lluvias')) {
    return '/weather-icons-master/production/fill/all/rain.svg';
  }
  
  // llovizna/lluvia escasa
  if (desc.includes('lluvia escasa') || desc.includes('llovizna')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/partly-cloudy-night-drizzle.svg' :
      '/weather-icons-master/production/fill/all/drizzle.svg';
  }
  
  // chubascos
  if (desc.includes('chubasco')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/partly-cloudy-night-drizzle.svg' :
      '/weather-icons-master/production/fill/all/partly-cloudy-day-drizzle.svg';
  }
  //luvia general
  if (desc.includes('lluvia')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/partly-cloudy-night-rain.svg' :
      '/weather-icons-master/production/fill/all/partly-cloudy-day-rain.svg';
  }
  // Nieve
  if (desc.includes('nieve')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/partly-cloudy-night-snow.svg' :
      '/weather-icons-master/production/fill/all/partly-cloudy-day-snow.svg';
  }
  //granizo
  if (desc.includes('granizo')) {
    return '/weather-icons-master/production/fill/all/hail.svg';
  }
  
  // cubierto
  if (desc.includes('cubierto')) {
    return '/weather-icons-master/production/fill/all/overcast.svg';
  }
  
  //muy nuboso
  if (desc.includes('muy nuboso')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/overcast-night.svg' :
      '/weather-icons-master/production/fill/all/overcast-day.svg';
  }
  
  // nuboso
  if (desc.includes('nuboso') || desc.includes('nubes')) {
    return esNoche ?
      '/weather-icons-master/production/fill/all/partly-cloudy-night.svg' :
      '/weather-icons-master/production/fill/all/partly-cloudy-day.svg';
  }
  
  // niebla
  if (desc.includes('niebla') || desc.includes('bruma')) {
    return '/weather-icons-master/production/fill/all/fog.svg';
  }
  
  // por defecto
  return esNoche ?
    '/weather-icons-master/production/fill/all/partly-cloudy-night.svg' :
    '/weather-icons-master/production/fill/all/partly-cloudy-day.svg';
}
