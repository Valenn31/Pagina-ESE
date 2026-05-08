# CLAUDE.md

Este archivo le proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Descripción del proyecto

Sitio web institucional para la Escuela Superior de Enfermería · Cañada de Gómez (Santa Fe, Argentina). HTML5/CSS3/JS puro — sin sistema de build, sin gestor de paquetes, sin framework.

## Comandos

```bash
npm install        # instalar dependencias (solo la primera vez)
npm run dev        # servidor de desarrollo con HMR en http://localhost:5173
npm run build      # genera el build de producción en dist/
npm run preview    # previsualizar el build de producción localmente
```

El despliegue se realiza subiendo el contenido de `dist/` al hosting estático, o haciendo push al repositorio de GitHub con integración a Netlify/Vercel.

## Arquitectura

Sitio de una sola página. Todo el contenido vive en `index.html`. Estructura:

- **Header**: Nav fijo con menú hamburguesa (controlado por `js/main.js`)
- **Hero**: Banner a ancho completo con superposición de gradiente CSS
- **Secciones**: Instalaciones → Carrera e Historia → Strip (3 columnas de datos) → Plan de Estudio (grilla curricular de 3 años) → Requisitos e Inscripción
- **Footer**: Embed de Google Maps + datos de contacto + logos

### Distribución de archivos

- `index.html` — todo el marcado HTML (punto de entrada de Vite)
- `assets/styles.css` — todos los estilos; usa propiedades CSS personalizadas (`--verde`, `--celeste`, `--color-oscuro`, `--color-claro`, `--texto`)
- `js/main.js` — toggle del menú hamburguesa, header que se oculta al hacer scroll, año en el footer, reveal con IntersectionObserver, nav activo, botón volver arriba
- `public/assets/img/` — imágenes estáticas (logo, portada, inscripción, logo Santa Fe); se sirven con rutas absolutas `/assets/img/...`
- `public/` — archivos estáticos servidos tal cual: favicon, robots.txt, sitemap.xml

### Convenciones CSS

El tema se define mediante variables CSS en `:root`. Breakpoints: mobile-first con `max-width: 991px` para móvil/tablet, `min-width: 992px` para escritorio. Fuente: Google Fonts "Inter".

## Problemas conocidos

- El embed de YouTube en la sección Instalaciones usa el placeholder `VIDEO_ID` — necesita un ID de video real.
- Las rutas de los íconos en el footer referencian `img/icono-*.png` pero la ruta correcta es `assets/img/`.
