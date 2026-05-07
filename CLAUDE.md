# CLAUDE.md

Este archivo le proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Descripción del proyecto

Sitio web estático institucional para la Escuela Superior de Enfermería en Argentina. HTML5/CSS3/JS puro — sin sistema de build, sin gestor de paquetes, sin framework.

## Desarrollo local

No hay paso de compilación. Servir directamente:

```bash
# Python (disponible en la mayoría de sistemas)
python -m http.server 8080

# O simplemente abrir index.html en el navegador para ediciones rápidas
```

El despliegue se realiza haciendo push al repositorio remoto de GitHub; el sitio se aloja de forma estática.

## Arquitectura

Sitio de una sola página. Todo el contenido vive en `index.html`. Estructura:

- **Header**: Nav fijo con menú hamburguesa (controlado por `js/main.js`)
- **Hero**: Banner a ancho completo con superposición de gradiente CSS
- **Secciones**: Instalaciones → Carrera e Historia → Strip (3 columnas de datos) → Plan de Estudio (grilla curricular de 3 años) → Requisitos e Inscripción
- **Footer**: Embed de Google Maps + datos de contacto + logos

### Distribución de archivos

- `index.html` — todo el marcado HTML
- `assets/styles.css` — todos los estilos (~714 líneas); usa propiedades CSS personalizadas (`--verde`, `--celeste`, `--color-oscuro`, `--color-claro`, `--texto`)
- `js/main.js` — toggle del menú hamburguesa, header que se oculta al hacer scroll, año en el footer, reveal con IntersectionObserver
- `assets/img/` — imágenes del logo, portada e inscripción

### Convenciones CSS

El tema se define mediante variables CSS en `:root`. Breakpoints: mobile-first con `max-width: 991px` para móvil/tablet, `min-width: 992px` para escritorio. Fuente: Google Fonts "Inter".

## Problemas conocidos

- El embed de YouTube en la sección Instalaciones usa el placeholder `VIDEO_ID` — necesita un ID de video real.
- Las rutas de los íconos en el footer referencian `img/icono-*.png` pero la ruta correcta es `assets/img/`.
