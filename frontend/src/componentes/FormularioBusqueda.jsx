// COMPONENTE FORMULARIO DE BUSQUEDA

// es el componente para mostrar el formulario de busqueda, contiene dos select para elegir la provincia y el municipio, 
// un boton para enviar la busqueda y dos botones tipo tab para cambiar entre prediccion diaria y horaria
// es un componente funcional que recibe varias props para manejar los estados y las acciones del formulario
// al seleccionar una provincia se actualiza el select de municipios y  al seleccionar un municipio se habilitan 
// los botones de tipo de prediccion, y al enviar el formulario se ejecuta la funcion onSearch que viene del componente padre (App) para cargar los datos del tiempo.


 //Componente funcional FormularioBusqueda
 //Este componente FormularioBusqueda recibe 9 parámetros a través de las props:
  
  //provinciaCodigo es un string con el código de la provincia seleccionada (ejemplo: '41'  para Sevilla). Me indica qué provincia ha elegido el usuario.
  //setProvinciaCodigo es una función que me permite cambiar el valor de provinciaCodigo cuando el usuario selecciona otra provincia.
  // municipioCodigo es un string con el código del municipio seleccionado (ejemplo: '41091'     para Sevilla capital). Me indica qué municipio ha elegido el usuario.
  //setMunicipioCodigo es una función que me permite cambiar el valor de municipioCodigo    cuando el usuario selecciona otro municipio.
  // tipoEs es un string que indica el tipo de prediccion: 'diaria' o 'horaria'. Me dice qué vista quiere ver el usuario.
  //setTipoEs una funcion que  permite cambiar entre la  prediccion diaria y por horas.
  //onSearchEs funcin que se ejecuta cuando el usuario pulsa el boton Buscar, viene del componente padre (App) y es la que inicia la busqueda del tiempo
 //cargandoEs un booleano ) que  indica si en este momento estamos  esperando datos de la API ,si es true deshabilito los botones para evitar que haya busquedas duplicada y muestro un icono y la plabra cargando en el boton de busqueda
 // cambiarTipoEs una funcion que cambia el tipo de prediccion y automaticamente recarga los datos. es un atajo que hace setTipo() + onSearch() en una sola acion
 //los recibo usando destructuring  para poder usarlos directamente. para no tener que escribir cada vez props.provinciaCodigo o props.municipioCodigo
 // se importan los  datos de  las provincias y los municipios de Andalucia que vienen del archivo andalucia.js creado por mi sacados de los  datos oficiales de AEMET, y se filtran los municipios que corresponden a la provincia seleccionada para mostrarlos en el select de los municipios.

 import { andalucia } from '../datos/andalucia';
export default function FormularioBusqueda({
  provinciaCodigo,
  setProvinciaCodigo,
  municipioCodigo,
  setMunicipioCodigo,
  tipo,
  setTipo,
  onSearch,
  cargando,
  cambiarTipo
}) {
  // filtar municipios de la provincia seleccionada

  // con  Array.find()  se busca el primer elemento que cumple la condicion de tener el codigo igual al codigo seleccionado en el select de provincias
  // devuelve el objeto completo o undefined si no lo encuentra
  // p => p.provinciaCodigo provinciaCodigo es una arrow function que compara los codigos
  const provinciaSeleccionada = andalucia.find(p => p.provinciaCodigo === provinciaCodigo);
  // si  se encuentra  la provincia se usan sus munipios si no devuelve un array vacio
  const municipios = provinciaSeleccionada ? provinciaSeleccionada.municipios : [];
  return (
    //formulario html con onSubmit para manejar el envio de la busqueda cuand ose pulsa el boton submit o se pulsa enter
    // aqui va el select de provincias, el select de municipios, el boton de busqueda y los botones tipo tab para cambiar entre prediccion diaria y horaria
    //select de provincias con value controlado por React y onChange para actualizar el estado cuando el usuario selecciona una provincia diferente
    //select de municipios con value controlado por React y onChange para actualizar el estado cuando el usuario selecciona un municipio diferente
    //el select de municipios se deshabilita si no hay provincia seleccionada o si estamos cargando datos para evitar cambios mientras se cargan los datos
    // el boton de busqueda es de tipo submit para que al hacer clic se ejecute el onSubmit del formulario, y se deshabilita si estamos cargando datos o si no hay municipio seleccionado para evitar envios invalidos
    // dentro del boton de busqueda se muestra un icono de carga y la palabra "Cargando..." si estamos cargando datos, o "Buscar" si no lo estamos, usando un operador ternario para mostrar contenido diferente según el estado
    //tabs para cambiar entre prediccion diaria y horaria, solo se muestran si hay un municipio seleccionado, y cada boton tiene una clase "activo" si es el tipo seleccionado para mostrarlo resaltado, 
    // y al hacer clic en cada boton se ejecuta la funcion cambiarTipo que cambia el tipo de prediccion y recarga los datos automaticamente, y se deshabilitan mientras cargamos datos para evitar cambios durante la carga
    <form className="formulario" onSubmit={onSearch}>
      <div className="selectores-grid">
        {/*select de provincias */}
        <label>
          Provincia:
          <select
            value={provinciaCodigo} // Valor controlado por React (estado)
            onChange={(e) => {
              // onChange se ejecuta cada vez que el usuario elige una opción
              // e.target.value contiene el value del <option> seleccionado
              
              setProvinciaCodigo(e.target.value); // Actualizar provincia
              setMunicipioCodigo(''); // Resetear municipio (ya no es válido para la nueva provincia)
            }}
            disabled={cargando} // Deshabilitar mientras cargamos (evita cambios)
          >
            {/* Array.map() transforma cada provincia en un <option> */}
            {/* map((elemento, indice) => JSX) */}
            {/* key es obligatorio en listas React para optimizar renderizado */}
            {andalucia.map((p) => (
              <option key={p.provinciaCodigo} value={p.provinciaCodigo}>
                {p.provinciaNombre}
              </option>
            ))}
          </select>
        </label>

        {/*select de municipios */}
        <label>
          Municipio:
          <select
            value={municipioCodigo}
            onChange={(e) => {
              setMunicipioCodigo(e.target.value);
              setTipo('diaria'); //se resetea a diaria cuando se cambia el municipio
            }}
            // Disabled con Or si no hay ninguna provincia seleccionada o si se estan cargando datos desde la api
            disabled={!provinciaCodigo || cargando}>
            <option value="">Selecciona un municipio</option>
            {/* Mapear loss municipios filtrados a opciones */}
            {municipios.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/*boton de enviar*/}
      {/* // Disabled con Or si no hay nningu municipio seleccionado o si se estan cargando datos desde la api*/}
      <button type="submit" disabled={cargando || !municipioCodigo}>
        {cargando ? (
          <>
            {/* con fragment  <> permite agrupar los elementos in tener que hacer otro div */}
            <img 
              src="/src/assets/weather-icons-master/production/fill/all/bouncing-circles (1).svg" 
              alt="Cargando"
              style={{ 
                width: '36px', 
                height: '36px', 
                marginRight: '8px',
                display: 'inline-block',
                verticalAlign: 'middle'
              }}
            />
            Cargando...
          </>
        ) : (
          'Buscar'
        )}
      </button>

      {/* tabs  para cambiar la prediccion entre  diaria o por horas*/}
      {/* Solo se muestran cuando hay algun municipio seleccionado */}
      {/*  uso el operador && si municipioCodigo es true se carga lo siguiente */}
      {municipioCodigo && (
        <div className="tabs">
          <button
            type="button"
            className={tipo === 'diaria' ? 'tab activo' : 'tab'}
            onClick={() => cambiarTipo('diaria')}
            disabled={cargando}>
            Prediccion Diaria
          </button>
          <button
            type="button"
            className={tipo === 'horaria' ? 'tab activo' : 'tab'}
            onClick={() => cambiarTipo('horaria')}
            disabled={cargando}>
            Por Horas
          </button>
        </div>
      )}
    </form>
  );
}
