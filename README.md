# Señas Kiosco — Red de Medios Inclusivos SAS

Kiosco interactivo en Lengua de Señas Colombiana (LSC) para supermercados.

## Configuración

1. Edita `js/config.js` con tu URL de n8n y tu nombre de tienda
2. Sube a GitHub Pages
3. Configura esa URL en Fully Kiosk del TV Box

## URLs importantes

- n8n: https://n8n-production-9cab.up.railway.app
- Endpoint catálogo: https://n8n-production-9cab.up.railway.app/webhook/kiosco/productos

## Estructura

```
senas-kiosco/
├── index.html       ← pantalla principal del TV
├── css/kiosco.css   ← estilos
└── js/
    ├── config.js    ← URL de n8n y configuración
    ├── catalogo.js  ← fetch al catálogo
    ├── video.js     ← reproductor LSC
    ├── qr.js        ← generador QR
    └── carrusel.js  ← motor de rotación
```
