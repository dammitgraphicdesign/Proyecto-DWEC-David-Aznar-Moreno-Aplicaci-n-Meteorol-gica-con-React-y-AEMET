// COMPONENTE CABECERA

// Es el componente para mostrar la cabecera de la aplicacion, contiene
// el logo de la app ( lo he disenado manualmente con Adobe Illustrator y hay dos versiones una para el modo oscuro y otra modo claro.
// un boton para cambiar entre modo oscuro y claro, y el titulo de la app.ess un componente funcional que recibe dos props: modoOscuro (booleano) y toggleModo (funcion).
// al hacer clic en el icono del sol o la luna se ejecuta la funcion toggleModo que cambia el el modo en el componente padre (App).

// Componente funcional Cabecera

  //@param {boolean} props.modoOscuro true si esta en modo oscuro y false si es  modo claro
  // @param {Function} props.toggleModo  funcion que cambia el tema cuando se pulsa el botonn
  //este componente cabecera recibe dos parametros a traves de las props
  //modoOscuro - Es un booleano  que  indica si el usuario activa el modo oscuro o no.
 //toggleModo - Es una funcion que viene del componente padre (App) y que al ejecutarse cambia el valor de modoOscuro.
  //los recibo usando destructuring es mas comodo que escribir props.modoOscuro y props.toggleModo cada vez que tengo que usarlos

//boton para cambiar el modo oscuro y claro
    //onClick ejecuta la funcionn toggleModo cuando se hace clic en el boton
      // title muestra un tooltip al hacer hover en el boton para que se sepa que hace el botn
      //uso un operador ternario para mostrar el icono de sol o de luna segun la condicion  valor_si_verdadero valor_si_falso 
        // Si esta en el en modo oscurose muestra el icono del sol  y si esta en modo claro se muestra el icono de la luna 

import logoOscuro from '../assets/logo_oscuro.png';
import logoClaro from '../assets/logo_claro.png';
export default function Cabecera({ modoOscuro, toggleModo }) {
  return (
    <header className="cabecera">
      <button onClick={toggleModo} className="boton-modo" title="Cambiar tema">
        <img 
          src={modoOscuro 
            ? '/src/assets/weather-icons-master/production/fill/all/clear-day.svg' 
            : '/src/assets/weather-icons-master/production/fill/all/clear-night.svg'
          } 
          alt={modoOscuro ? 'Modo claro' : 'Modo oscuro'}
          style={{ width: '34px', height: '34px' }}
        />
      </button>
      <div className="cabecera-contenido">
        <img 
          src={modoOscuro ? logoOscuro : logoClaro} 
          alt="Logo El Tiempo en Andalucía" 
          className="logo" 
        />
        <div className="cabecera-texto">
          <h1>El Tiempo en Andalucía</h1>
          <p>Predicción meteorológica oficial de AEMET</p>
        </div>
      </div>
    </header>
  );
}
