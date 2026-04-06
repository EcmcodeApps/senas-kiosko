// ── video.js ─────────────────────────────────────────────────
// Controla el video del avatar LSC.
// Si no hay video, muestra el ícono de manos.
// ─────────────────────────────────────────────────────────────

var videoEl = document.getElementById('video-lsc');

videoEl.setAttribute('autoplay', true);
videoEl.setAttribute('loop', true);
videoEl.setAttribute('muted', true);
videoEl.setAttribute('playsinline', true);

videoEl.addEventListener('ended', function() {
  videoEl.currentTime = 0;
  videoEl.play();
});

videoEl.addEventListener('error', function() {
  mostrarIconoManos();
});


function reproducirVideoLSC(urlVideo) {
  var icono = document.getElementById('icono-manos');
  if (icono) icono.style.display = 'none';
  videoEl.style.display = 'block';

  if (!urlVideo || urlVideo.trim() === '') {
    mostrarIconoManos();
    return;
  }

  var urlFinal = convertirUrlDrive(urlVideo);

  if (videoEl.src !== urlFinal) {
    videoEl.src = urlFinal;
    videoEl.load();
    videoEl.play().catch(function() {
      mostrarIconoManos();
    });
  }
}


function mostrarIconoManos() {
  videoEl.style.display = 'none';
  var icono = document.getElementById('icono-manos');

  if (!icono) {
    icono = document.createElement('div');
    icono.id = 'icono-manos';
    icono.innerHTML = '<svg viewBox="0 0 120 120" width="260" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">'
      + '<rect x="30" y="60" width="60" height="45" rx="14" fill="#2ABFA3"/>'
      + '<rect x="10" y="72" width="24" height="16" rx="8" fill="#2ABFA3"/>'
      + '<rect x="32" y="30" width="14" height="36" rx="7" fill="#2ABFA3"/>'
      + '<rect x="50" y="24" width="14" height="42" rx="7" fill="#2ABFA3"/>'
      + '<rect x="68" y="27" width="13" height="39" rx="6.5" fill="#2ABFA3"/>'
      + '<rect x="85" y="33" width="11" height="33" rx="5.5" fill="#2ABFA3"/>'
      + '<circle cx="60" cy="14" r="5" fill="#F4A535"/>'
      + '<path d="M47 22 Q60 8 73 22" fill="none" stroke="#F4A535" stroke-width="3.5" stroke-linecap="round"/>'
      + '<path d="M40 30 Q60 2 80 30" fill="none" stroke="#F4A535" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>'
      + '</svg>'
      + '<div style="color:#2ABFA3;font-size:22px;margin-top:16px;text-align:center">Video LSC próximamente</div>';
    icono.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;';
    document.getElementById('zona-avatar').appendChild(icono);
  }
  icono.style.display = 'flex';
}


function convertirUrlDrive(url) {
  if (!url || !url.includes('drive.google.com')) return url;
  if (url.includes('uc?')) return url;
  var match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  if (match) return 'https://drive.google.com/uc?export=download&id=' + match[1];
  return url;
}
