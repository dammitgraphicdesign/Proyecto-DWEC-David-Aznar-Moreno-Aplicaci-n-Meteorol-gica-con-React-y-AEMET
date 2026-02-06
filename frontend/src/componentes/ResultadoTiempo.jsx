// COMPONENTE RESULTADO TIEMPO

// sirve para mostrar la prediccion  metereologica desde la api de aemet
// Maneja las dos vistas  de laprediccion diaria y por horas
// Es el archivo procesa datos de la api de la aemet

// funciones para procesar los datos de  aemet

// la priemra funcion es para formatear las fechas que vienen en formato ISO que usa la aemet
 //Formatea una fecha ISO (2024-02-04T00:00:00) a formato legible español con 
 // @param {string} fechaISO - Fecha en formato ISO (YYYY-MM-DDTHH:mm:ss)
 // y devuelve un string @returns {string}  fecha formateada en español o el texto no dispopnibkle si falla
 // new Date(fechaISO) convierte el texto ISO en un objeto Date que JavaScript puede manejar
 // toLocaleDateString('es-ES', {...}) formatea ese objeto Date en español
 /// try/catch captura cualquier error si la fecha es invalida devuelve no disponible en lugar de que se rompa la app
 
 // se importan las funciones para obtener iconos del tiempo que he descargado de internet y que estan  en la carpeta servicios/iconosTiempo.js
import { obtenerIconoTiempo, obtenerIconoPorDescripcion } from '../servicios/iconosTiempo.js';

function formatearFechaISO(fechaISO) {
  try {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      weekday: 'long', 
      year: 'numeric',   
      month: 'long',    
      day: 'numeric'   
    });
  } catch {
    return 'No disponible';
  }
}

//funcion maximoNumero
// esta funcion se utriliza para encontrar la probabilidad maxima de precipitacion en la prediccion diaria, 
// ya que AEMET proporciona varias probabilidades para diferentes horas del dia, y para esta prediccion quiero mostar la mas alta
   //@param {Array} array   array de objetos de aemet con propiedad value
  //@returns {number|null}   Valor maximo o null si no hay valores validos
  //Esta funcion recibe un parametro que es un array de objetos quevienen de aemet y  tienen una propiedad value, 
  // y devuelve el numero mas alto encontrado en esa propiedad value de esos objetos.
  // si el array no es valido o no tiene valores numericos devuelve null.
  //Primero valida que el parámetro sea realmente un array (si no lo es, devuelve null)
  // Usa un bucle for...of para recorrer cada elemento del array uno por uno
    //item?.value usa "optional chaining" (?.), que significa "dame item.value si existe, 
    // si no devuelve undefined sin dar error". esto evita que se rompa la app si es null
    //Number(item?.value) convierte el valor a numero (por si viene como texto "25")
    // Number.isNaN() verifica que sea un numero valido (no NaN = "Not a Number")
    //Math.max(max, v) compara el maximo actual con el nuevo valor y devuelve el mayor
   //Al final devuelve el numero mas alto encontrado
 
function maximoNumero(array) {
  if (!Array.isArray(array)) return null;
  let max = null;
  for (const item of array) {
    const v = Number(item?.value); 
    if (!Number.isNaN(v)) {
      max = max === null ? v : Math.max(max, v);
    }
  }
  
  return max;
}

// funcion mapaPorPeriodo


// esta funcion se utiliza para convertir un array de objetos que tienen una propiedad periodo
//  en un objeto donde cada clave es el valor del periodo y su valor es el objeto completo, 
// esto lo utilizo para acceder rapidamente a los datos de cada hora en la prediccion por horas

//Crea un objeto (mapa) donde la clave es el periodo y el valor es el objeto completo
// por ejemplo [{periodo: '06', temp: 15}] → {'06': {periodo: '06', temp: 15}}
 
//@param {Array} array - Array de objetos con propiedad periodo
//@returns {Object} - Objeto/mapa con periodos como claves

 //{} crea un objeto vacio como un diccionario o HashMap
 //mapa[clave] = valor añade una entrada al objeto
//continue salta a la siguiente iteracion del bucle
 //String() convierte cualquier valor a texto

function mapaPorPeriodo(array) {
  const mapa = {}; // Objeto vacío para almacenar el mapa
  if (!Array.isArray(array)) return mapa;
  for (const item of array) {
    const p = item?.periodo; // Extraer periodo (si existe)
    // Si no hay periodo (null/undefined), saltar este elemento
    if (p == null) continue;
    // Anadir al mapa: clave = periodo, valor = objeto completo
    // String(p) asegura que la clave sea siempre texto
    mapa[String(p)] = item;
  }
  return mapa;
}

//funcion mapaVientoPorPeriodo


 //esta funcion es similar a mapaPorPeriodo pero para los  datos del viento
 //combinando la  direccion y la  velocidad en un solo string
   //por ejmplo: {periodo: '12', direccion: ['N'], velocidad: [15]}  : {'12': 'N 15 km/h'}
 
 // @param {Array} array ,array de objetos viento que viene de aemet 
  //@returns {Object} ,mapa con texto formateado de viento
//Array.isArray() verifica si un valor es array
// array[0] obtiene el primer elemento de un array
//Template literals `${var}` permiten interpolar variables en strings

function mapaVientoPorPeriodo(array) {
  const mapa = {};
  if (!Array.isArray(array)) return mapa;
  for (const item of array) {
    if (item?.periodo != null && item?.direccion && item?.velocidad) {
     const dir = Array.isArray(item.direccion) ? item.direccion[0] : item.direccion;
    const vel = Array.isArray(item.velocidad) ? item.velocidad[0] : item.velocidad;
      
      mapa[String(item.periodo)] = `${dir} ${vel} km/h`;
    }
  }

  return mapa;
}

//funcion probabilidadParaHora

//Encuentra la probabilidad de precipitacion para una hora especifica
 //aemet agrupa las horas en tramos: 01-07, 07-13, 13-19, 19-01
 //Esta funcion mapea cada hora al  tramo correspondiente

 //@param {string} horaStr ,hora en formato string ('06', '12', '18')
//@param {Array} tramos , array de objetos con periodo y value (probabilidad)
 //@returns {string}  ,probabilidad formateada ('45%') o devuelve  — si no hay datos
 //Number() convierte string a numero
 //Number.isNaN() verifica si la conversion falla
 //if/else if/else, estructura condicional multiple para asignar el tramo correcto segun la hora
  //Array.find() busca  el primer elemento que cumple la condicion
function probabilidadParaHora(horaStr, tramos) {
  const h = Number(horaStr);
  if (Number.isNaN(h)) return '—';
  let tramo = '';
  if (h >= 1 && h <= 6) tramo = '0107';
  else if (h >= 7 && h <= 12) tramo = '0713';
  else if (h >= 13 && h <= 18) tramo = '1319';
  else tramo = '1901'; //  las Horas 19-24 se consideran tramo 19-01 del dia siguiente
  const encontrado = tramos.find((t) => t?.periodo === tramo);
  return encontrado?.value != null ? `${encontrado.value}%` : '—';
}



// componente principal ResultadoTiempo
 
//es el componente que renderiza la prediccion meteorologica
 //@param {Object} props.resultado, Datos de la API con la prediccion
 //@param {string} props.resultado.tipo, 'diaria' o 'horaria'
//@param {Object} props.resultado.data,datos meteorologicos de  la aemet
export default function ResultadoTiempo({ resultado }) {
  // extrae los datos, si data es array y toma el primer elemento, sinousa data directamente
  const item = Array.isArray(resultado.data) ? resultado.data[0] : resultado.data;
  const municipio = item?.nombre || 'Municipio';
  const provincia = item?.provincia || '';
  const pred = item?.prediccion;
  
  // AEMET devuelve un array de hasta 7 días en pred.dia[]
  const todosDias = pred?.dia || [];
  
  if (todosDias.length === 0) {
    return (
      <section className="resultado">
        <h2>Resultado</h2>
        <div className="tarjeta">
          <p>No se han encontrado predicciones para este municipio.</p>
        </div>
      </section>
    );
  }

  
  // vista diaria  se muestran todos  los dias que devuelve AEMET 

  if (resultado.tipo === 'diaria') {
    return (
      <section className="resultado">
        <h2 style={{ textAlign: 'center' }}>Predicción diaria - Próximos {todosDias.length} días</h2>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '1.8rem' }}>
          {municipio} {provincia ? `(${provincia})` : ''}
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {todosDias.map((dia, index) => {
            const fechaFormateada = dia?.fecha ? formatearFechaISO(dia.fecha) : 'No disponible';
            const fecha = index === 0 ? `Hoy - ${fechaFormateada}` : fechaFormateada;
            
            // Estado del cielo
            let cielo = 'No disponible';
            let codigoCielo = null;
            if (Array.isArray(dia?.estadoCielo)) {
              const cieloValido = dia.estadoCielo.find(c => c?.descripcion && c.descripcion.trim() !== '');
              if (cieloValido) {
                cielo = cieloValido.descripcion;
                codigoCielo = cieloValido.value;
              }
            }
            
            //obtener icono del tiempo si existe segun el codigo de cielo, si no se usa la descripcion para obtener un icono que se le acerque
            const iconoCielo = codigoCielo ? obtenerIconoTiempo(codigoCielo) : obtenerIconoPorDescripcion(cielo);

            // Temperaturas
            const tempMin = dia?.temperatura?.minima ?? '—';
            const tempMax = dia?.temperatura?.maxima ?? '—';

            // Precipitación
            const probPrecipitacionMax = maximoNumero(dia?.probPrecipitacion);

            // Viento - buscar primer periodo con velocidad > 0
            let vientoTexto = 'No disponible';
            if (Array.isArray(dia?.viento)) {
              const vientoValido = dia.viento.find(v => v?.velocidad && v.velocidad > 0);
              if (vientoValido) {
                const dir = vientoValido.direccion || '';
                const vel = vientoValido.velocidad || '';
                vientoTexto = `${dir} ${vel} km/h`.trim();
              }
            }

            return (
              <div key={index} className="tarjeta" style={{ textAlign: 'center', padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                  {fecha}
                </h3>

                <img 
                  src={iconoCielo} 
                  alt={cielo} 
                  style={{ width: '100px', height: '100px', margin: '10px auto', display: 'block' }}
                />
                
                <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: '600' }}>
                  {cielo}
                </p>
                
                {/* Temperaturas */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '15px',
                  margin: '15px 0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src="/src/assets/weather-icons-master/production/fill/all/thermometer-colder.svg" 
                      alt="Mínima" 
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {tempMin}º
                    </span>
                  </div>
                  
                  <span style={{ fontSize: '1.5rem'}}>/</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src="/src/assets/weather-icons-master/production/fill/all/thermometer-warmer.svg" 
                      alt="Máxima" 
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {tempMax}º
                    </span>
                  </div>
                </div>

                {/* Precipitación y Viento */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '15px',
                  fontSize: '0.95rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <img 
                      src="/src/assets/weather-icons-master/production/fill/all/raindrops.svg" 
                      alt="Precipitación" 
                      style={{ width: '32px', height: '32px' }}
                    />
                    <span>
                      Lluvia: <strong>{probPrecipitacionMax === null ? 'N/D' : `${probPrecipitacionMax}%`}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <img 
                      src="/src/assets/weather-icons-master/production/fill/all/windsock.svg" 
                      alt="Viento" 
                      style={{ width: '32px', height: '32px' }}
                    />
                    <span>
                      Viento: <strong>{vientoTexto}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }



  // vista por horas usa solo el dia actuasl
  
  const primerDia = todosDias[0]; // Para la prediccion por horas  se usa  solo el dia actual
  const fecha = primerDia?.fecha ? formatearFechaISO(primerDia.fecha) : 'No disponible';
  const mapaTemp = mapaPorPeriodo(primerDia?.temperatura);
  const mapaCielo = mapaPorPeriodo(primerDia?.estadoCielo);
  const mapaLluvia = mapaPorPeriodo(primerDia?.precipitacion);
  const mapaHumedad = mapaPorPeriodo(primerDia?.humedadRelativa);
  const mapaViento = mapaVientoPorPeriodo(primerDia?.vientoAndRachaMax);
  const probTramos = primerDia?.probPrecipitacion || [];
  const horaActual = new Date().getHours(); // para obtener la hora actual y mostrar solo las horas a partir de esa hora
  const todasLasHoras = Object.keys(mapaTemp)/// Filtrar y ordenar las horas disponibles desde la hora actual
    .map(h => Number(h))
    .sort((a, b) => a - b);
  const horas = todasLasHoras//las proximas 12 horas desde la hora actual
    .filter(h => h >= horaActual)
    .slice(0, 12);
 return (
    <section className="resultado">
      <h2>Prediccion por horas</h2>

      <div className="tarjeta" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>
          {municipio}
          {provincia ? ` (${provincia})` : ''}
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>
          {fecha}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '16px',
        marginTop: '20px'
      }}>
        {horas.map((h) => {
          //  se formatea la hora  como string de 2  digitospara acceder correctamente a los mapas
          const horaFormateada = String(h).padStart(2, '0');
          
          const datosCielo = mapaCielo[horaFormateada];
          const descripcionCielo = datosCielo?.descripcion || '—';
          const codigoCielo = datosCielo?.value;
          const iconoHora = codigoCielo ? obtenerIconoTiempo(codigoCielo) : null;
          
          return (
            <div key={h} className="tarjeta" style={{ 
              textAlign: 'center', 
              padding: '20px 16px'
            }}>
              {/* Hora */}
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.6rem', fontWeight: 'bold' }}>
                {horaFormateada}:00
              </h4>
              
              {/* Icono del cielo */}
              {iconoHora && (
                <img 
                  src={iconoHora} 
                  alt={descripcionCielo} 
                  style={{ width: '100px', height: '100px', margin: '0 auto 5px' }} 
                />
              )}
              
              {/* descripcion del cielo */}
              <p style={{ 
                margin: '0 0 16px 0', 
                fontSize: '1.2rem',
                fontWeight: '600',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {descripcionCielo}
              </p>
              
              {/*temperatura destacada */}
              <div style={{ 
                margin: '0 0 10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
               
              }}>
                <img 
                  src="/src/assets/weather-icons-master/production/fill/all/thermometer-celsius.svg" 
                  alt="Temperatura" 
                  style={{ width: '56px', height: '56px' }}
                />
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {mapaTemp[horaFormateada]?.value ?? '—'}º
                </span>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginTop: '16px'
              }}>
                {/*lluvia*/}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src="/src/assets/weather-icons-master/production/fill/all/raindrops.svg" 
                    alt="Lluvia" 
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.7rem' }}>Lluvia</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {mapaLluvia[horaFormateada]?.value ?? '—'} mm
                    </div>
                  </div>
                </div>
                
                {/*probabilidad */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src="/src/assets/weather-icons-master/production/fill/all/umbrella.svg" 
                    alt="Probabilidad" 
                    style={{ width: '48px', height: '48px', opacity: 0.7 }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.7rem'}}>Prob.</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {probabilidadParaHora(horaFormateada, probTramos)}
                    </div>
                  </div>
                </div>
                
                {/*humedad*/}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src="/src/assets/weather-icons-master/production/fill/all/humidity.svg" 
                    alt="Humedad" 
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.7rem' }}>Humedad</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {mapaHumedad[horaFormateada]?.value ?? '—'}%
                    </div>
                  </div>
                </div>
                
                {/*viento*/}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src="/src/assets/weather-icons-master/production/fill/all/windsock.svg" 
                    alt="Viento" 
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.7rem' }}>Viento</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {mapaViento[horaFormateada] ?? '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
