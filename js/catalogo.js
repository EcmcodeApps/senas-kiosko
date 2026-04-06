// ── catalogo.js ──────────────────────────────────────────────
// Carga productos desde n8n. Si falla usa caché. Si no hay
// caché, usa datos de prueba para que el kiosco no quede vacío.
// ─────────────────────────────────────────────────────────────

let catalogoCache = [];

// ── DATOS DE PRUEBA ─────────────────────────────────────────
// Borra este bloque cuando tengas productos reales en el Sheets
const DATOS_PRUEBA = [
  {
    id: 'LV-001',
    nombre: 'Leche Entera Colanta 1L',
    categoria: 'Lácteos',
    precio: '3200',
    descripcion: 'Leche UHT entera pasteurizada',
    url_foto: '',
    url_video_lsc: '',
    activo: 'TRUE'
  },
  {
    id: 'LV-002',
    nombre: 'Arroz Diana 500g',
    categoria: 'Granos',
    precio: '2800',
    descripcion: 'Arroz precocido premium',
    url_foto: '',
    url_video_lsc: '',
    activo: 'TRUE'
  },
  {
    id: 'LV-003',
    nombre: 'Aceite Vegetal 1L',
    categoria: 'Aceites',
    precio: '12500',
    descripcion: 'Aceite vegetal puro',
    url_foto: '',
    url_video_lsc: '',
    activo: 'TRUE'
  },
  {
    id: 'LV-004',
    nombre: 'Pan Tajado Bimbo 450g',
    categoria: 'Panadería',
    precio: '5900',
    descripcion: 'Pan de molde blanco',
    url_foto: '',
    url_video_lsc: '',
    activo: 'TRUE'
  },
  {
    id: 'LV-005',
    nombre: 'Pollo Entero Colorín',
    categoria: 'Carnes',
    precio: '18500',
    descripcion: 'Pollo fresco entero x kg',
    url_foto: '',
    url_video_lsc: '',
    activo: 'TRUE'
  },
];
// ── FIN DATOS DE PRUEBA ─────────────────────────────────────


async function cargarCatalogo() {
  try {
    console.log('📡 Cargando catálogo desde n8n...');

    const respuesta = await fetch(CONFIG.API_URL, {
      signal: AbortSignal.timeout(10000)
    });

    if (!respuesta.ok) throw new Error('n8n respondió: ' + respuesta.status);

    const datos = await respuesta.json();

    // Compatible con respuesta { productos: [...] } o array directo
    const lista = datos.productos || datos;

    const activos = lista.filter(function(p) {
      return p.activo === true || p.activo === 'TRUE';
    });

    catalogoCache = activos;
    console.log('✅ Catálogo cargado: ' + catalogoCache.length + ' productos');
    return catalogoCache;

  } catch (error) {
    if (catalogoCache.length > 0) {
      console.warn('⚠️ Usando caché:', error.message);
      return catalogoCache;
    }
    console.warn('⚠️ Usando datos de prueba');
    catalogoCache = DATOS_PRUEBA;
    return catalogoCache;
  }
}

// Auto-refresh cada 30 minutos
setInterval(async function() {
  console.log('🔄 Refrescando catálogo...');
  var nuevos = await cargarCatalogo();
  if (nuevos.length !== catalogoCache.length) {
    iniciarCarrusel(nuevos);
  }
}, CONFIG.INTERVALO_REFRESH);
