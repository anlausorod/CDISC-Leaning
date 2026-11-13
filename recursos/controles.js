/*
 * Controles comunes del sitio: idioma (ES/EN) y tema (claro/oscuro).
 *
 * Uso: en el <head> de cada página, una sola línea con la ruta relativa al script:
 *   lecciones/xx.html     → <script src="../recursos/controles.js"></script>
 *   lecciones/en/xx.html  → <script src="../../recursos/controles.js"></script>
 *
 * Tema: pone data-theme="light" | "dark" en <html>. La página debe definir sus
 * colores para :root[data-theme="dark"] (y respetar :root:not([data-theme="light"])
 * dentro de @media (prefers-color-scheme: dark)).
 *
 * Idioma: la versión inglesa de lecciones/NOMBRE.html es lecciones/en/NOMBRE.html.
 * En el índice (body data-pagina="indice") el idioma cambia sin recargar y se
 * avisa con el evento "cdisc:idioma".
 */
(function () {
  var raiz = new URL("..", document.currentScript.src).href; // carpeta raíz del sitio
  var html = document.documentElement;

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ---- Tema: se aplica de inmediato para evitar un parpadeo ----
  var temaGuardado = leer("cdisc-tema");
  if (temaGuardado === "light" || temaGuardado === "dark") html.dataset.theme = temaGuardado;
  function temaActual() {
    return html.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  // ---- Idioma ----
  var rel = location.href.split("#")[0].split("?")[0].replace(raiz, ""); // p. ej. "lecciones/en/02-x.html"
  var esIndice = function () { return document.body && document.body.dataset.pagina === "indice"; };
  var idioma = (html.lang || "es").slice(0, 2) === "en" ? "en" : "es";

  // Ruta de la misma página en el otro idioma (solo para lecciones)
  function otraVersion() {
    var m = rel.match(/^lecciones\/(en\/)?([^\/]+)$/);
    if (!m) return null;
    return raiz + (m[1] ? "lecciones/" : "lecciones/en/") + m[2];
  }

  var TXT = {
    es: { indice: "← Índice", tema: "Cambiar tema", claro: "Tema claro", oscuro: "Tema oscuro", idioma: "Idioma", noDisp: "Esta lección aún no está disponible en inglés" },
    en: { indice: "← Index", tema: "Toggle theme", claro: "Light theme", oscuro: "Dark theme", idioma: "Language", noDisp: "This lesson is not available in Spanish yet" }
  };

  var CSS =
    ".cdisc-barra{display:flex;justify-content:flex-end;align-items:center;gap:8px;flex-wrap:wrap;max-width:860px;margin:0 auto;" +
    "padding:12px max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px));font:500 14px system-ui,-apple-system,'Segoe UI',sans-serif}" +
    ".cdisc-grupo{display:inline-flex;border:1px solid color-mix(in srgb,currentColor 30%,transparent);border-radius:999px;overflow:hidden}" +
    ".cdisc-grupo button{font:inherit;color:inherit;background:transparent;border:0;padding:5px 12px;cursor:pointer;min-width:40px}" +
    ".cdisc-grupo button+button{border-left:1px solid color-mix(in srgb,currentColor 30%,transparent)}" +
    ".cdisc-grupo button[aria-pressed='true']{background:color-mix(in srgb,currentColor 16%,transparent);font-weight:700}" +
    ".cdisc-grupo button:disabled{opacity:.4;cursor:not-allowed}" +
    ".cdisc-grupo button:focus-visible{outline:2px solid currentColor;outline-offset:-3px}" +
    ".cdisc-indice{margin-right:auto;display:inline-flex;align-items:center;font:600 14px/1 var(--body,system-ui,sans-serif);" +
    "color:var(--on-primary,#fff);background:var(--primary,#6D28D9);text-decoration:none;border-radius:999px;padding:8px 16px}" +
    ".cdisc-indice:hover{filter:brightness(1.1)}" +
    ".cdisc-indice:focus-visible{outline:3px solid var(--accent,currentColor);outline-offset:2px}";

  function boton(texto, alPulsar) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = texto;
    b.addEventListener("click", alPulsar);
    return b;
  }

  function montar() {
    var estilo = document.createElement("style");
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    var barra = document.createElement("div");
    barra.className = "cdisc-barra";

    // Idioma
    var gIdioma = document.createElement("div");
    gIdioma.className = "cdisc-grupo";
    gIdioma.setAttribute("role", "group");
    var bES = boton("ES", function () { cambiarIdioma("es"); });
    var bEN = boton("EN", function () { cambiarIdioma("en"); });
    bES.lang = "es"; bEN.lang = "en";
    gIdioma.append(bES, bEN);

    // Tema
    var gTema = document.createElement("div");
    gTema.className = "cdisc-grupo";
    gTema.setAttribute("role", "group");
    var bClaro = boton("☀", function () { cambiarTema("light"); });
    var bOscuro = boton("☾", function () { cambiarTema("dark"); });
    gTema.append(bClaro, bOscuro);

    // Botón de vuelta al índice (en todas las páginas menos el propio índice)
    if (!esIndice()) {
      var bIndice = document.createElement("a");
      bIndice.className = "cdisc-indice";
      bIndice.href = raiz;
      bIndice.textContent = TXT[idioma].indice;
      barra.append(bIndice);
    }
    barra.append(gIdioma, gTema);
    document.body.prepend(barra);

    function pintar() {
      var t = TXT[idioma];
      gIdioma.setAttribute("aria-label", t.idioma);
      gTema.setAttribute("aria-label", t.tema);
      bClaro.title = t.claro;
      bOscuro.title = t.oscuro;
      bClaro.setAttribute("aria-label", t.claro);
      bOscuro.setAttribute("aria-label", t.oscuro);
      bES.setAttribute("aria-pressed", idioma === "es");
      bEN.setAttribute("aria-pressed", idioma === "en");
      var tm = temaActual();
      bClaro.setAttribute("aria-pressed", tm === "light");
      bOscuro.setAttribute("aria-pressed", tm === "dark");
    }

    function cambiarTema(t) {
      html.dataset.theme = t;
      guardar("cdisc-tema", t);
      pintar();
    }

    function cambiarIdioma(l) {
      if (l === idioma) return;
      guardar("cdisc-idioma", l);
      if (esIndice()) {
        idioma = l;
        html.lang = l;
        pintar();
        document.dispatchEvent(new CustomEvent("cdisc:idioma", { detail: l }));
      } else {
        var destino = otraVersion();
        if (destino) location.href = destino + location.hash;
      }
    }

    // Si la otra versión de la lección no existe, desactiva su botón
    var destino = !esIndice() && otraVersion();
    if (destino) {
      fetch(destino, { method: "HEAD" }).then(function (r) {
        if (!r.ok) throw 0;
      }).catch(function () {
        var b = idioma === "es" ? bEN : bES;
        b.disabled = true;
        b.title = TXT[idioma].noDisp;
      });
    } else if (!esIndice()) {
      (idioma === "es" ? bEN : bES).disabled = true;
    }

    // En el índice, el idioma sale de la preferencia guardada
    if (esIndice()) {
      var pref = leer("cdisc-idioma");
      if (pref === "en" || pref === "es") { idioma = pref; html.lang = pref; }
    } else {
      guardar("cdisc-idioma", idioma);
    }

    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", pintar);
    pintar();
  }

  window.CDISC = { idioma: function () { return idioma; } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();
