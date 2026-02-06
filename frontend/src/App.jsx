
// IMPORTACIONES

//Se importan hooks de React para poder manejar  el estado y efectos secundarios
import { useState, useEffect } from 'react';
import './App.css'; // estilos css globales de la app

//se importan los componentes que forman la interfaz
import Cabecera from './componentes/Cabecera';
import FormularioBusqueda from './componentes/FormularioBusqueda';
import ResultadoTiempo from './componentes/ResultadoTiempo';

//se importa la funcion que hace las peticiones http al backend
import { obtenerTiempoMunicipio } from './servicios/servicioTiempo';

// COMPONENTE PRINCIPAL APP

// Este es el componente raiz de la app,gestiona todo el estado global y coordina  el resto de  componentes
export default function App() {
  
  // ESTADOS - useState
  // useState  permite crear  las variables de estado
  // Cuando estas cambian react rerenderiza el componente automaticamente
  
  //estado para la provincia seleccionada por defecto es Sevilla la capital  41
  const [provinciaCodigo, setProvinciaCodigo] = useState('41');
  //estado para el municipio seleccionado por defecto es Sevilla 41091
  const [municipioCodigo, setMunicipioCodigo] = useState('41091');
  //estado para el tipo de prediccion  diaria o horaria, por defecto diaria
  const [tipo, setTipo] = useState('diaria');
  //estado booleano que indica si se estan cargando datos (true) o no (false)
  const [cargando, setCargando] = useState(false);
  //stado para mensajes de error,string vacio si no hay error
  const [error, setError] = useState('');
  //estado booleano que indica si la busqueda no devolvio resultados
  const [sinResultados, setSinResultados] = useState(false);
  //estado para almacenar los datos de la prediccion meteorologica
  // null si no hay datos y objeto con los datos si la peticion fue bien
  const [resultado, setResultado] = useState(null);
  //eestado para el tema de la pagina  true = modo oscuro, false = modo claro
  const [modoOscuro, setModoOscuro] = useState(true);


  // FUNCIONES

  //Funcion para cambiar entre modo oscuro y modo claro
  //Usa el operador ! (NOT) para invertir el valor booleano
  function toggleModo() {
    setModoOscuro(!modoOscuro);
  }


  // useEffect - CARGA INICIAL

  //el hook que ejecuta codigo al montar el componente 
  //el array vacio [] al final significa : ejecutar solo una vez al iniciar
  // esto carga automaticamente la prediccion de Sevilla cuando abrimos la app
  useEffect(() => {
    cargarPrediccion('diaria', '41091');
  }, []);

  
   //Funcion asincrona que carga la prediccion meteorologica
   
   //@param {string} tipoBusqueda - 'diaria' o 'horaria'
   //@param {string} codigoMuni - Código del municipio (ej: '41091' para Sevilla)
  
   //1 activar estado de cargando (muestra spinner)
    //2 limpiar errores y resultados anteriores
    //3 hacer peticion HTTP al backend
   //4 validar que los datos recibidos tengan predicciones
   //5 actualizar estado con los resultados o mostrar error
  async function cargarPrediccion(tipoBusqueda, codigoMuni) {
    setCargando(true);
    setError('');
    setSinResultados(false);
    setResultado(null);

    try {
      // async/await, se espera  a que la petición HTTP termine
      // obtenerTiempoMunicipio contacta con el  backend en localhost:3000
      const datos = await obtenerTiempoMunicipio(tipoBusqueda, codigoMuni);
      // extrae el primer elemento si la respuesta es un array
      // Operador ternario, condición ? siVerdadero : siFalso
      const item = Array.isArray(datos.data) ? datos.data[0] : datos.data;
      // Verifica que existan dias de prediccion
      // El operador ?. evita errores si item es null/undefined
      const hayDias = item?.prediccion?.dia && item.prediccion.dia.length > 0
      if (!hayDias) {
        // no hay datos de prediccion disponibles
        setSinResultados(true);
        setResultado(null);
      } else {
        // si ha ido bien se guardan  los datos para mostrarlos
        setResultado(datos);
      }
    } catch (err) {
      // Si algo falla como red, servidor, timeout , se captura el error
      // El operador ||  proporciona un mensaje por defecto si err.message esta vacio
      setError(err.message || 'Error en la consulta.');
    } finally {
      // finally se ejecuta  siempre aunque no haya eerror
      //  y se desacrtiva el estado de cargando para ocultar icono de carga y habilitar los  botones
      setCargando(false);
    }
  }


 //Manejador del evento submit del formulario

//Se ejecuta cuando el usuario pulsa el botón "Buscar"
// @param {Event} e - Evento del formulari
//Verificar que se haya seleccionado un municipio
 //Si todo es valido, cargar la prediccion

  async function manejarBusqueda(e) {
    // previene el comportamiento por defecto del formulario
    e.preventDefault();

    //validacion 1, verificar que hay provincia seleccionada
    if (!provinciaCodigo) {
      setError('Selecciona una provincia.');
      setResultado(null);
      setSinResultados(false);
      return; // Salir de la funcion si falla la validacion
    }

    // validacion 2, verificar que hay municipio seleccionado
    if (!municipioCodigo) {
      setError('Selecciona un municipio.');
      setResultado(null);
      setSinResultados(false);
      return; // Salir de la funcion si falla la validacion
    }

    // Si llegamos aquí, todas las validaciones pasaron
    // Procedemos a cargar la prediccion
    cargarPrediccion(tipo, municipioCodigo);
  }


  // RENDERIZADO JSX
  //jsx es una sintaxis que parece html pero es javascript
  // react convierte esto en elementos del DOM
  return (
  // Contenedor principal con clase dinamica segun el tema
    //Template literals permiten interpolar variables con ${}
    <div className={`app ${modoOscuro ? 'modo-oscuro' : 'modo-claro'}`}>
      <div className="contenedor">
        
        {/* COMPONENTE CABECERA */}
        {/* Pasamos las  props (propiedades) al componente hijo */}
        <Cabecera modoOscuro={modoOscuro} toggleModo={toggleModo} />

        {/* COMPONENTE FORMULARIO */}
        {/* Pasamos muchas props para que el formulario pueda actualizar estados */}
        <FormularioBusqueda
          provinciaCodigo={provinciaCodigo}
          setProvinciaCodigo={setProvinciaCodigo}
          municipioCodigo={municipioCodigo}
          setMunicipioCodigo={setMunicipioCodigo}
          tipo={tipo}
          setTipo={setTipo}
          onSearch={manejarBusqueda}
          cargando={cargando}
          cambiarTipo={(nuevoTipo) => {
            // funcion inline que se ejecuta cuando se cambia el tipo de prediccion
            if (nuevoTipo !== tipo && municipioCodigo) {
              setTipo(nuevoTipo);
              cargarPrediccion(nuevoTipo, municipioCodigo);
            }
          }}
        />

        {/* MENSAJES CONDICIONALES */}
        {/* operador && para  el renderizado condicional */}
        {/* Si la expresion de la izquierda es true, se renderiza lo de la derecha */}
        
        {/* mostrar el  mensaje de carga */}
        {cargando && <p className="mensaje">Cargando datos...</p>}

        {/*mostrar mensaje de error si existe */}
        {!cargando && error && <p className="mensaje error">{error}</p>}

        {/*mostrar mensaje si no hay resultados */}
        {!cargando && !error && sinResultados && (
          <p className="mensaje">Búsqueda sin resultados.</p>
        )}

        {/* COMPONENTE RESULTADO */}
        {/*solo se renderiza si:
             no estamos cargando
             no hay error
             no esta marcado como sin resultados
             resultado tiene datos
        */}
        {!cargando && !error && !sinResultados && resultado && (
          <ResultadoTiempo resultado={resultado} />
        )}
      </div>
    </div>
  );
}
