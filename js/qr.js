// ── qr.js ────────────────────────────────────────────────────
// Genera el QR dinámico que el usuario escanea con su celular.
// ─────────────────────────────────────────────────────────────

var canvasQR = document.getElementById('canvas-qr');
var instanciaQR = null;

function generarQR(productoId) {
  var urlProducto = CONFIG.BASE_URL_MOVIL + '?id=' + productoId;

  if (!instanciaQR) {
    instanciaQR = new QRCode(canvasQR, {
      text: urlProducto,
      width: 200,
      height: 200,
      colorDark: '#052E2A',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    instanciaQR.makeCode(urlProducto);
  }
}
