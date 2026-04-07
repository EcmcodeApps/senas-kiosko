// ── video.js v2.0 ─────────────────────────────────────────────
// Soporta dos modos:
// 1. Google Drive → usa iframe con /preview (funciona siempre)
// 2. URL directa (.mp4) → usa elemento <video>
// ─────────────────────────────────────────────────────────────

var videoEl   = document.getElementById('video-lsc');
var zonaAvatar = document.getElementById('zona-avatar');
var iframeEl  = null; // se crea dinámicamente


// ── Extraer ID de Google Drive ────────────────────────────────
function extraerIdDrive(url) {
  if (!url || !url.includes('drive.google.com')) return null;
  var m = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  return m ? m[1] : null;
}


// ── Crear o reutilizar el iframe de Drive ─────────────────────
function mostrarIframeDrive(fileId) {
  // Ocultar el video nativo
  videoEl.style.display = 'none';
  videoEl.src = '';

  // Ocultar ícono de manos si existe
  var icono = document.getElementById('icono-manos');
  if (icono) icono.style.display = 'none';

  // Crear el iframe si no existe
  if (!iframeEl) {
    iframeEl = document.createElement('iframe');
    iframeEl.id = 'iframe-lsc';
    iframeEl.setAttribute('allowfullscreen', true);
    iframeEl.setAttribute('allow', 'autoplay');
    iframeEl.style.cssText =
      'width:100%;height:75vh;border:none;border-radius:16px;background:#0B6E5E;';
    zonaAvatar.appendChild(iframeEl);
  }

  // URL de preview de Drive — esta SÍ funciona en iframe
  var nuevaUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';

  // Solo actualiza si cambió el video
  if (iframeEl.src !== nuevaUrl) {
    iframeEl.src = nuevaUrl;
  }

  iframeEl.style.display = 'block';
}


// ── Mostrar ícono de manos (sin video) ────────────────────────
function mostrarIconoManos() {
  videoEl.style.display = 'none';
  if (iframeEl) iframeEl.style.display = 'none';

  var icono = document.getElementById('icono-manos');
  if (!icono) {
    icono = document.createElement('div');
    icono.id = 'icono-manos';
    icono.innerHTML = '<svg viewBox="0 0 120 120" width="260" height="260" fill="none">'
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
      + '<div style="color:#2ABFA3;font-size:22px;margin-top:16px;text-align:center">'
      + 'Video LSC próximamente</div>';
    icono.style.cssText =
      'display:flex;flex-direction:column;align-items:center;justify-content:center;';
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

  // ¿Es un link de Google Drive?
  var driveId = extraerIdDrive(urlVideo);
  if (driveId) {
    mostrarIframeDrive(driveId);
    return;
  }

  // URL directa de .mp4
  if (iframeEl) iframeEl.style.display = 'none';
  var icono = document.getElementById('icono-manos');
  if (icono) icono.style.display = 'none';

  videoEl.style.display = 'block';
  if (videoEl.src !== urlVideo) {
    videoEl.src = urlVideo;
    videoEl.load();
    videoEl.play().catch(function() {
      mostrarIconoManos();
    });
  }
}

// Configurar video nativo
videoEl.setAttribute('autoplay', true);
videoEl.setAttribute('loop', true);
videoEl.setAttribute('muted', true);
videoEl.setAttribute('playsinline', true);
videoEl.addEventListener('error', function() { mostrarIconoManos(); });
