// ── carrusel.js ───────────────────────────────────────────────
// Motor principal del kiosco. Rota los productos y coordina
// texto → foto → video LSC → QR
// ✅ Fix: usa placehold.co en lugar de via.placeholder.com
// ─────────────────────────────────────────────────────────────

var indiceActual      = 0;
var intervaloCarrusel = null;

var elNombre    = document.getElementById('nombre');
var elCategoria = document.getElementById('categoria');
var elPrecio    = document.getElementById('precio');
var elFoto      = document.getElementById('foto');
var elNumActual = document.getElementById('num-actual');
var elNumTotal  = document.getElementById('num-total');


function mostrarProducto(producto) {

  // Texto
  elNombre.textContent    = producto.nombre    || 'Sin nombre';
  elCategoria.textContent = producto.categoria || '';

  // Precio
  var precioNum = parseInt(producto.precio) || 0;
  elPrecio.textContent = '$' + precioNum.toLocaleString('es-CO');

  // ✅ Foto — usa placehold.co (funciona en Colombia)
  if (producto.url_foto && producto.url_foto.trim() !== '') {
    elFoto.src = convertirFotoUrl(producto.url_foto);
  } else {
    elFoto.src = 'https://placehold.co/380x320/0B6E5E/FFFFFF?text='
      + encodeURIComponent(producto.nombre || 'Producto');
  }
  elFoto.style.display = 'block';

  // Video LSC
  reproducirVideoLSC(producto.url_video_lsc);

  // QR
  generarQR(producto.id);

  // Indicador
  elNumActual.textContent = indiceActual + 1;

  console.log('📺 ' + producto.nombre + ' - $' + precioNum.toLocaleString('es-CO'));
}


function siguienteProducto(productos) {
  indiceActual = (indiceActual + 1) % productos.length;
  mostrarProducto(productos[indiceActual]);
}


function iniciarCarrusel(productos) {

  if (intervaloCarrusel) {
    clearInterval(intervaloCarrusel);
    intervaloCarrusel = null;
  }

  if (!productos || productos.length === 0) {
    elNombre.textContent = 'Sin productos activos';
    return;
  }

  indiceActual = 0;
  elNumTotal.textContent = productos.length;
  mostrarProducto(productos[0]);

  intervaloCarrusel = setInterval(function() {
    siguienteProducto(productos);
  }, CONFIG.TIEMPO_PRODUCTO * 1000);

  console.log('✅ Carrusel: ' + productos.length + ' productos · ' + CONFIG.TIEMPO_PRODUCTO + 's c/u');
}


function convertirFotoUrl(url) {
  if (!url || !url.includes('drive.google.com')) return url;
  if (url.includes('uc?')) return url;
  var match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  if (match) return 'https://drive.google.com/uc?export=view&id=' + match[1];
  return url;
}

// Error de foto → placeholder
elFoto.addEventListener('error', function() {
  elFoto.src = 'https://placehold.co/380x320/0B6E5E/2ABFA3?text=Sin+foto';
});
