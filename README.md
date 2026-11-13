# CDISC Learning

Material didáctico en HTML sobre los estándares CDISC, publicado como sitio web con **GitHub Pages**.

🌐 Sitio: https://anlausorod.github.io/CDISC-Leaning/

## Estructura

```
index.html              → página de inicio (lista las lecciones automáticamente)
lecciones/              → lecciones en español
lecciones/en/           → versión en inglés (mismo nombre de archivo que en español)
recursos/controles.js   → botones de idioma (ES/EN) y tema (claro/oscuro)
guia-de-estilo.html     → propuestas de estilo visual para las lecciones
.nojekyll               → indica a GitHub Pages que sirva los archivos tal cual
```

## Cómo añadir una lección

1. Sube tu archivo `.html` a la carpeta `lecciones/` (desde GitHub: *Add file → Upload files*).
2. Usa un prefijo numérico para ordenarlas, p. ej. `02-sdtm-dominios.html`.
   El índice mostrará el título "Sdtm dominios".
3. En un par de minutos aparecerá en el sitio.

### Botones de idioma y tema

Añade esta línea dentro del `<head>` de cada lección:

```html
<!-- en lecciones/ -->
<script src="../recursos/controles.js"></script>
<!-- en lecciones/en/ -->
<script src="../../recursos/controles.js"></script>
```

- **Idioma:** la versión inglesa de `lecciones/02-x.html` debe llamarse igual y estar en
  `lecciones/en/02-x.html`. Si no existe, el botón aparece desactivado.
- **Tema:** el script pone `data-theme="light"` o `"dark"` en `<html>`. Los colores de la
  lección deben definirse para `:root[data-theme="dark"]` (ver las lecciones existentes).

Si tu HTML usa imágenes u hojas de estilo propias, súbelas también dentro de `lecciones/`
(por ejemplo `lecciones/img/`) y enlázalas con rutas relativas.

## Activar GitHub Pages (solo una vez)

1. En el repositorio: **Settings → Pages**.
2. En *Build and deployment → Source*, elige **Deploy from a branch**.
3. Selecciona la rama principal (`main`) y la carpeta **/ (root)**. Guarda.
