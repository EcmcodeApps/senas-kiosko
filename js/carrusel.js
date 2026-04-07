// ── carrusel.js v3.0 ──────────────────────────────────────────
// Espera que el video cargue antes de iniciar el countdown.
// Muestra una barra de progreso visual del tiempo restante.
// ─────────────────────────────────────────────────────────────

var indiceActual      = 0;
var intervaloCarrusel = null;
var timeoutSiguiente  = null;

// Referencias HTML
var elNombre         = document.getElementById('nombre');
var elCategoria      = document.getElementById('categoria');
var elPrecio         = document.getElementById('precio');
var elPrecioAnterior = document.getElementById('precio-anterior');
var elFoto           = document.getElementById('foto');
var elNumActual      = document.getElementById('num-actual');
var elNumTotal       = document.getElementById('num-total');
var elBanner         = document.getElementById('banner-promo');
var elBannerTexto    = document.getElementById('banner-texto');
var elBadgePromo     = document.getElementById('badge-promo');
var elLogoWrap       = document.getElementById('logo-patrocinador-wrap');
var elLogo           = document.getElementById('logo-patrocinador');


// ── Barra de progreso ─────────────────────────────────────────
function crearBarraProgreso() {
  var barra = document.getElementById('barra-progreso');
  if (barra) return barra;

  barra = document.createElement('div');
  barra.id = 'barra-progreso';
  barra.style.cssText =
    'position:fixed;bottom:0;left:0;height:4px;width:0%;'
    + 'background:#F4A535;transition:width linear;z-index:999;';
  document.body.appendChild(barra);
  return barra;
}

function iniciarBarra(segundos) {
  var barra = crearBarraProgreso();
  barra.style.transition = 'none';
  barra.style.width = '0%';
  setTimeout(function() {
    barra.style.transition = 'width ' + segundos + 's linear';
    barra.style.width = '100%';
  }, 100);
}

function resetBarra() {
  var barra = document.getElementById('barra-progreso');
  if (barra) {
    barra.style.transition = 'none';
    barra.style.width = '0%';
  }
}


// ── Convertir URL de foto ─────────────────────────────────────
function convertirFotoUrl(url) {
  if (!url || !url.includes('drive.google.com')) return url;
  if (url.includes('uc?')) return url;
  var m = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  return m ? 'https://drive.google.com/uc?export=view&id=' + m[1] : url;
}


// ── Banner de promoción ───────────────────────────────────────
function actualizarBanner(producto) {
  if (!elBanner) return;
  var esPromo = producto.en_promocion === true
    || String(producto.en_promocion).toUpperCase() === 'TRUE';

  if (esPromo) {
    var texto = producto.texto_promo
      ? ('⭐ ' + producto.texto_promo + ' ⭐ ' + producto.texto_promo + ' ⭐')
      : '⭐ PRODUCTO EN PROMOCIÓN ⭐ PRODUCTO EN PROMOCIÓN ⭐ PRODUCTO EN PROMOCIÓN ⭐';
    if (elBannerTexto) elBannerTexto.textContent = texto;
    elBanner.classList.add('visible');
    if (elBadgePromo) elBadgePromo.classList.add('visible');
  } else {
    elBanner.classList.remove('visible');
    if (elBadgePromo) elBadgePromo.classList.remove('visible');
  }
}


// ── Logo patrocinador ─────────────────────────────────────────
function actualizarLogo(producto) {
  if (!elLogoWrap || !elLogo) return;
  var urlLogo = producto.logo_patrocinador || '';
  if (urlLogo.trim() !== '') {
    elLogo.src = convertirFotoUrl(urlLogo);
    elLogoWrap.classList.add('visible');
    elLogo.onerror = function() { elLogoWrap.classList.remove('visible'); };
  } else {
    elLogoWrap.classList.remove('visible');
    elLogo.src = '';
  }
}


// ── Programar el siguiente producto ──────────────────────────
// Se llama DESPUÉS de que el iframe confirmó que cargó
function programarSiguiente(productos, segundos) {
  if (timeoutSiguiente) clearTimeout(timeoutSiguiente);

  // Iniciar barra de progreso visual
  iniciarBarra(segundos);

  timeoutSiguiente = setTimeout(function() {
    indiceActual = (indiceActual + 1) % productos.length;
    mostrarProducto(productos, productos[indiceActual]);
  }, segundos * 1000);
}


// ── Mostrar un producto ───────────────────────────────────────
function mostrarProducto(productos, producto) {

  // Limpiar temporizador anterior
  if (timeoutSiguiente) {
    clearTimeout(timeoutSiguiente);
    timeoutSiguiente = null;
  }
  resetBarra();

  // Textos
  elNombre.textContent    = producto.nombre    || 'Sin nombre';
  elCategoria.textContent = producto.categoria || '';

  var precioNum = parseInt(producto.precio_texto
    ? producto.precio_texto.replace(/[^0-9]/g,'')
    : producto.precio) || 0;
  elPrecio.textContent = producto.precio_texto
    || ('$' + precioNum.toLocaleString('es-CO'));

  if (elPrecioAnterior) {
    if (producto.precio_anterior && producto.precio_anterior.trim() !== '') {
      var pAnt = parseInt(producto.precio_anterior) || 0;
      elPrecioAnterior.textContent = 'Antes: $' + pAnt.toLocaleString('es-CO');
      elPrecioAnterior.classList.add('visible');
    } else {
      elPrecioAnterior.classList.remove('visible');
    }
  }

  // Foto
  if (producto.url_foto && producto.url_foto.trim() !== '') {
    elFoto.src = convertirFotoUrl(producto.url_foto);
  } else {
    elFoto.src = 'https://placehold.co/380x320/0B6E5E/FFFFFF?text='
      + encodeURIComponent(producto.nombre || 'Producto');
  }
  elFoto.style.display = 'block';

  // Banner y logo
  actualizarBanner(producto);
  actualizarLogo(producto);

  // Indicador
  elNumActual.textContent = indiceActual + 1;

  // ── Reproducir video y esperar que cargue ──────────────────
  var tieneVideo = producto.url_video_lsc && producto.url_video_lsc.trim() !== '';

  if (tieneVideo) {
    // Llamar a video.js — le pasamos un callback para cuando cargue
    reproducirVideoLSC(producto.url_video_lsc, function onVideoListo() {
      // El video cargó → ahora sí empezamos el countdown
      programarSiguiente(productos, CONFIG.TIEMPO_PRODUCTO);
    });

    // Seguridad: si el video tarda más de 6 segundos en cargar,
    // arrancamos el countdown igual para no quedarnos trabados
    setTimeout(function() {
      if (!timeoutSiguiente) {
        console.warn('⏱ Video tardó mucho — arrancando countdown igual');
        programarSiguiente(productos, CONFIG.TIEMPO_PRODUCTO);
      }
    }, 6000);

  } else {
    // Sin video → QR y arrancamos countdown directo
    generarQR(producto.id);
    programarSiguiente(productos, CONFIG.TIEMPO_PRODUCTO);
  }

  // QR
  generarQR(producto.id);

  console.log('📺 ' + producto.nombre + ' — esperando video...');
}


// ── Iniciar el carrusel ───────────────────────────────────────
function iniciarCarrusel(productos) {

  if (timeoutSiguiente) clearTimeout(timeoutSiguiente);
  if (intervaloCarrusel) clearInterval(intervaloCarrusel);

  if (!productos || productos.length === 0) {
    elNombre.textContent = 'Sin productos activos';
    return;
  }

  indiceActual = 0;
  elNumTotal.textContent = productos.length;
  mostrarProducto(productos, productos[0]);

  console.log('✅ Carrusel v3.0: ' + productos.length
    + ' productos · ' + CONFIG.TIEMPO_PRODUCTO + 's c/u');
}

// Error de foto
elFoto.addEventListener('error', function() {
  elFoto.src = 'https://placehold.co/380x320/0B6E5E/2ABFA3?text=Sin+foto';
});
