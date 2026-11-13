# CDISC Learning

Material didáctico en HTML sobre los estándares CDISC, publicado como sitio web con **GitHub Pages**.

🌐 Sitio: https://anlausorod.github.io/CDISC-Leaning/

## Estructura

```
index.html        → página de inicio (lista las lecciones automáticamente)
lecciones/        → aquí van tus archivos HTML didácticos
.nojekyll         → indica a GitHub Pages que sirva los archivos tal cual
```

## Cómo añadir una lección

1. Sube tu archivo `.html` a la carpeta `lecciones/` (desde GitHub: *Add file → Upload files*).
2. Usa un prefijo numérico para ordenarlas, p. ej. `02-sdtm-dominios.html`.
   El índice mostrará el título "Sdtm dominios".
3. En un par de minutos aparecerá en el sitio.

Si tu HTML usa imágenes u hojas de estilo propias, súbelas también dentro de `lecciones/`
(por ejemplo `lecciones/img/`) y enlázalas con rutas relativas.

## Activar GitHub Pages (solo una vez)

1. En el repositorio: **Settings → Pages**.
2. En *Build and deployment → Source*, elige **Deploy from a branch**.
3. Selecciona la rama principal (`main`) y la carpeta **/ (root)**. Guarda.
