const CONFIG = {

  // ── CAMBIA ESTA URL por la de tu n8n en Railway ──────────
  API_URL: 'https://n8n-production-9cab.up.railway.app/webhook/kiosco/productos',

  // Segundos que muestra cada producto
  TIEMPO_PRODUCTO: 40,

  // Cada cuánto refresca el catálogo (30 minutos)
  INTERVALO_REFRESH: 30 * 60 * 1000,

  // URL base para los QR — cambia por tu GitHub Pages
  BASE_URL_MOVIL: 'https://TU-USUARIO.github.io/senas-kiosco/producto',

  // Nombre del supermercado en la barra inferior
  NOMBRE_TIENDA: 'Supermercado Piloto',
};
