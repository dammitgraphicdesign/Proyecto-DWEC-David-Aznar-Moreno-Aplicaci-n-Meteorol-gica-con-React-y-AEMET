
// datos de las provincias y municipios de Andalucia

// Estos datos son estáticos y se usan para llenar los select del formulario de búsqueda
// Cada provincia tiene un codigo de 2 digitos y cada municipio tiene un codigo de 5 dígitos los 2 de la  provincia + 3 del municipio
// Estos codigos son oficiales y provienen de INE,Instituto Nacional de Estadistica y la aemet los utiliza en su api para identificar las provincias y los municipios

//Este archivo contiene la lista de provincias y municipios de Andalucia
 //que el usuario puede seleccionar en el formulario de búsqueda.
//Estos datos no cambian nunca las provincias y los municipios de Andalucia son siempre los mismos y no tiene sentido pedirlos al
//servidor cada vez por eso lo ponmgo en frontend, porque es mas rapido y asi no tengo que crear un endpoint en el backend para esto 
//Es un array  de objetos y cada objeto representa una provincia:
 
 //{
   // provinciaNombre: "Nombre  de la provincia",
    //provinciaCodigo: "cdigo oficial de 2 digitos (usado por la aemet y el ine)",
    
    // municipios: [
    // { nombre: "nombre del municipio", codigo: "codigo de 5 digitos (2 de provincia + 3 del municipio)"},
    // ...más municipios]}
  
 //IMPORTANTE: he incluido los municipios mas poblados de cada provincia, en el caso de Cordoba he incluido algunos mas 
  // ya que es donde resido actualmente y por cercania me resukltaba interesante verlos.
 //No estan todos los municipios de Andalucía ya que son mas de 700
  //He seleccionado aproximadamente 10-13  para casa  provincia 
 //Si en el futuro se necesita toda Andalucuia , se podria entonces crear el enndpoint  a la API de AEMET 
 

//se exportan los datos para que otros archivos puedan importarlos
//en el componente FormularioBusqueda.jsx con: import { andalucia } from '../datos/andalucia'

export const andalucia = [
  // PROVINCIA: ALMERIA
  {
    provinciaNombre: 'Almería',
    provinciaCodigo: '04',
    municipios: [
      { nombre: 'Almería', codigo: '04013' },
      { nombre: 'Roquetas de Mar', codigo: '04079' },
      { nombre: 'El Ejido', codigo: '04047' },
      { nombre: 'Níjar', codigo: '04066' },
      { nombre: 'Vícar', codigo: '04102' },
      { nombre: 'Adra', codigo: '04003' },
      { nombre: 'Huércal de Almería', codigo: '04050' },
      { nombre: 'Vera', codigo: '04101' },
      { nombre: 'Pulpí', codigo: '04072' },
      { nombre: 'Cuevas del Almanzora', codigo: '04032' }
    ]
  },
  
// PROVINCIA: CADIZ
  {
    provinciaNombre: 'Cádiz',
    provinciaCodigo: '11',
    municipios: [
      { nombre: 'Cádiz', codigo: '11012' },
      { nombre: 'Jerez de la Frontera', codigo: '11020' },
      { nombre: 'Algeciras', codigo: '11004' },
      { nombre: 'San Fernando', codigo: '11031' },
      { nombre: 'El Puerto de Santa María', codigo: '11027' },
      { nombre: 'Chiclana de la Frontera', codigo: '11015' },
      { nombre: 'Sanlúcar de Barrameda', codigo: '11032' },
      { nombre: 'La Línea de la Concepción', codigo: '11022' },
      { nombre: 'Puerto Real', codigo: '11028' },
      { nombre: 'Arcos de la Frontera', codigo: '11006' },
      { nombre: 'Barbate', codigo: '11007' },
      { nombre: 'Conil de la Frontera', codigo: '11016' }
    ]
  },
  
  // PROVINCIA: CORDOBA
  {
    provinciaNombre: 'Córdoba',
    provinciaCodigo: '14',
    municipios: [
      { nombre: 'Córdoba', codigo: '14021' },
      { nombre: 'Lucena', codigo: '14038' },
      { nombre: 'Puente Genil', codigo: '14056' },
      { nombre: 'Pozoblanco', codigo: '14054' },
      { nombre: 'Montilla', codigo: '14044' },
      { nombre: 'Priego de Córdoba', codigo: '14055' },
      { nombre: 'Cabra', codigo: '14013' },
      { nombre: 'Baena', codigo: '14007' },
      { nombre: 'Palma del Río', codigo: '14049' },
      { nombre: 'Rute', codigo: '14058' },
      { nombre: 'Fuente Palmera', codigo: '14030' },
      { nombre: 'Hornachuelos', codigo: '14036' },
      { nombre: 'La Carlota', codigo: '14017' }
    ]
  },
  

  // PROVINCIA: GRANADA
  {
    provinciaNombre: 'Granada',
    provinciaCodigo: '18',
    municipios: [
      { nombre: 'Granada', codigo: '18087' },
      { nombre: 'Motril', codigo: '18140' },
      { nombre: 'Almuñécar', codigo: '18017' },
      { nombre: 'Loja', codigo: '18122' },
      { nombre: 'Baza', codigo: '18023' },
      { nombre: 'Guadix', codigo: '18089' },
      { nombre: 'Armilla', codigo: '18021' },
      { nombre: 'Maracena', codigo: '18130' },
      { nombre: 'Atarfe', codigo: '18022' },
      { nombre: 'Santa Fe', codigo: '18183' }
    ]
  },
  

  // PROVINCIA: HUELVA
  {
    provinciaNombre: 'Huelva',
    provinciaCodigo: '21',
    municipios: [
      { nombre: 'Huelva', codigo: '21041' },
      { nombre: 'Almonte', codigo: '21005' },
      { nombre: 'Lepe', codigo: '21044' },
      { nombre: 'Ayamonte', codigo: '21010' },
      { nombre: 'Isla Cristina', codigo: '21042' },
      { nombre: 'Moguer', codigo: '21051' },
      { nombre: 'Cartaya', codigo: '21021' },
      { nombre: 'Punta Umbría', codigo: '21061' },
      { nombre: 'Aljaraque', codigo: '21004' },
      { nombre: 'Bollullos Par del Condado', codigo: '21013' }
    ]
  },
  

  // PROVINCIA: JAÉN

  {
    provinciaNombre: 'Jaén',
    provinciaCodigo: '23',
    municipios: [
      { nombre: 'Jaén', codigo: '23050' },
      { nombre: 'Linares', codigo: '23055' },
      { nombre: 'Andújar', codigo: '23005' },
      { nombre: 'Úbeda', codigo: '23092' },
      { nombre: 'Martos', codigo: '23060' },
      { nombre: 'Alcalá la Real', codigo: '23002' },
      { nombre: 'La Carolina', codigo: '23028' },
      { nombre: 'Bailén', codigo: '23009' },
      { nombre: 'Villacarrillo', codigo: '23095' },
      { nombre: 'Torredonjimeno', codigo: '23088' }
    ]
  },
  
  // PROVINCIA: MÁLAGA 
  {
    provinciaNombre: 'Málaga',
    provinciaCodigo: '29',
    municipios: [
      { nombre: 'Málaga', codigo: '29067' },
      { nombre: 'Marbella', codigo: '29069' },
      { nombre: 'Fuengirola', codigo: '29054' },
      { nombre: 'Torremolinos', codigo: '29901' },
      { nombre: 'Vélez-Málaga', codigo: '29094' },
      { nombre: 'Benalmádena', codigo: '29019' },
      { nombre: 'Estepona', codigo: '29051' },
      { nombre: 'Rincón de la Victoria', codigo: '29075' },
      { nombre: 'Mijas', codigo: '29070' },
      { nombre: 'Antequera', codigo: '29015' },
      { nombre: 'Nerja', codigo: '29074' },
      { nombre: 'Ronda', codigo: '29084' }
    ]
  },
  
  // PROVINCIA: SEVILLA

  {
    provinciaNombre: 'Sevilla',
    provinciaCodigo: '41',
    municipios: [
      { nombre: 'Sevilla', codigo: '41091' },
      { nombre: 'Dos Hermanas', codigo: '41038' },
      { nombre: 'Alcalá de Guadaíra', codigo: '41004' },
      { nombre: 'Utrera', codigo: '41095' },
      { nombre: 'Mairena del Aljarafe', codigo: '41056' },
      { nombre: 'La Rinconada', codigo: '41079' },
      { nombre: 'Écija', codigo: '41039' },
      { nombre: 'Camas', codigo: '41020' },
      { nombre: 'Carmona', codigo: '41024' },
      { nombre: 'Lebrija', codigo: '41053' },
      { nombre: 'Los Palacios y Villafranca', codigo: '41075' },
      { nombre: 'Morón de la Frontera', codigo: '41065' }
    ]
  }
];
