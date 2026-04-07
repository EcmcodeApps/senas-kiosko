// ── video.js v3.0 ─────────────────────────────────────────────
// Soporta YouTube (recomendado) y MP4 directo
// YouTube: autoplay + loop + sin controles + sin logo
// ─────────────────────────────────────────────────────────────

var videoEl    = document.getElementById('video-lsc');
var zonaAvatar = document.getElementById('zona-avatar');
var iframeEl   = null;


// ── Extraer ID de YouTube ─────────────────────────────────────
function extraerIdYoutube(url) {
  if (!url) return null;
  var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}


// ── Extraer ID de Google Drive ────────────────────────────────
function extraerIdDrive(url) {
  if (!url || !url.includes('drive.google.com')) return null;
  var m = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  return m ? m[1] : null;
}


// ── Crear o actualizar iframe ─────────────────────────────────
function mostrarIframe(src) {
  videoEl.style.display = 'none';
  var icono = document.getElementById('icono-manos');
  if (icono) icono.style.display = 'none';

  if (!iframeEl) {
    iframeEl = document.createElement('iframe');
    iframeEl.id = 'iframe-lsc';
    iframeEl.setAttribute('allowfullscreen', true);
    iframeEl.setAttribute('allow',
      'autoplay; fullscreen; picture-in-picture');
    iframeEl.style.cssText =
      'width:100%;height:75vh;border:none;'
      + 'border-radius:16px;background:#0B6E5E;';
    zonaAvatar.appendChild(iframeEl);
  }

  if (iframeEl.src !== src) {
    iframeEl.src = src;
  }
  iframeEl.style.display = 'block';
}


// ── Mostrar ícono de manos ────────────────────────────────────
function mostrarIconoManos() {
  videoEl.style.display = 'none';
  if (iframeEl) iframeEl.style.display = 'none';

  var icono = document.getElementById('icono-manos');
  if (!icono) {
    icono = document.createElement('div');
    icono.id = 'icono-manos';
    icono.innerHTML =
      '<svg viewBox="0 0 120 120" width="260" height="260" fill="none">'
      + '<rect x="30" y="60" width="60" height="45" rx="14" fill="#2ABFA3"/>'
      + '<rect x="10" y="72" width="24" height="16" rx="8" fill="#2ABFA3"/>'
      + '<rect x="32" y="30" width="14" height="36" rx="7" fill="#2ABFA3"/>'
      + '<rect x="50" y="24" width="14" height="42" rx="7" fill="#2ABFA3"/>'
      + '<rect x="68" y="27" width="13" height="39" rx="6.5" fill="#2ABFA3"/>'
      + '<rect x="85" y="33" width="11" height="33" rx="5.5" fill="#2ABFA3"/>'
      + '<circle cx="60" cy="14" r="5" fill="#F4A535"/>'
      + '<path d="M47 22 Q60 8 73 22" fill="none" stroke="#F4A535"'
      + ' stroke-width="3.5" stroke-linecap="round"/>'
      + '<path d="M40 30 Q60 2 80 30" fill="none" stroke="#F4A535"'
      + ' stroke-width="2.5" stroke-linecap="round" opacity=".6"/>'
      + '</svg>'
      + '<div style="color:#2ABFA3;font-size:22px;'
      + 'margin-top:16px;text-align:center">'
      + 'Video LSC próximamente</div>';
    icono.style.cssText =
      'display:flex;flex-direction:column;'
      + 'align-items:center;justify-content:center;';
    zonaAvatar.appendChild(icono);
  }
  icono.style.display = 'flex';
}


// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────
function reproducirVideoLSC(urlVideo) {

  if (!urlVideo || urlVideo.trim() === '') {
    mostrarIconoManos();
    return;
  }

  // ✅ YouTube — el más confiable
  var ytId = extraerIdYoutube(urlVideo);
  if (ytId) {
    // autoplay=1, mute=1, loop=1, controls=0, playlist=ID (para loop)
    var ytSrc = 'https://www.youtube.com/embed/' + ytId
      + '?autoplay=1&mute=1&loop=1&controls=0'
      + '&playlist=' + ytId
      + '&rel=0&modestbranding=1&iv_load_policy=3';
    mostrarIframe(ytSrc);
    return;
  }

  // Google Drive — segunda opción
  var driveId = extraerIdDrive(urlVideo);
  if (driveId) {
    mostrarIframe(
      'https://drive.google.com/file/d/' + driveId + '/preview'
    );
    return;
  }

  // MP4 directo — tercera opción
  if (iframeEl) iframeEl.style.display = 'none';
  var icono = document.getElementById('icono-manos');
  if (icono) icono.style.display = 'none';

  videoEl.style.display = 'block';
  if (videoEl.src !== urlVideo) {
    videoEl.src = urlVideo;
    videoEl.load();
    videoEl.play().catch(function() { mostrarIconoManos(); });
  }
}

// Configurar video nativo
videoEl.setAttribute('autoplay', true);
videoEl.setAttribute('loop', true);
videoEl.setAttribute('muted', true);
videoEl.setAttribute('playsinline', true);
videoEl.addEventListener('error', function() { mostrarIconoManos(); });
