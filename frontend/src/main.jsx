// PUNTO DE ENTRADA DE LA APP EN REACT

//esste es el primer archivo que se ejecuta cuando iniciamos la app
//su función es montar nuestra la aspp React en el DOM HTML
//importa react y reactDOM
import { StrictMode } from 'react' // StrictMode ayuda a detectar problemas en desarrollo
import { createRoot } from 'react-dom/client' // createRoot es la API moderna de React 18+
// importa estilos y  el componente principal
import './index.css' //los esstilos CSS globales
import App from './App.jsx' // componente principal de la app

// MONTAR LA APP

// 1 cuscar el elemento HTML con id="root" esta en index.html
// 2 crear una raiz react en ese elemento
// 3renderizar el componente App dentro de StrictMode

createRoot(document.getElementById('root')).render(
  // StrictMode es un wrapper que activa advertencias adicionales en desarrollo para encontar fallos
  <StrictMode>
    <App />
  </StrictMode>,
)
