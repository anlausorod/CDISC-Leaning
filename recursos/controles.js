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
    es: { indice: "← Índice", tema: "Cambiar tema", claro: "Tema claro", oscuro: "Tema oscuro", idioma: "Idioma", noDisp: "Esta lección aún no está disponible en inglés", anterior: "← Anterior", siguiente: "Siguiente →" },
    en: { indice: "← Index", tema: "Toggle theme", claro: "Light theme", oscuro: "Dark theme", idioma: "Language", noDisp: "This lesson is not available in Spanish yet", anterior: "← Previous", siguiente: "Next →" }
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
    ".cdisc-indice:focus-visible{outline:3px solid var(--accent,currentColor);outline-offset:2px}" +
    /* modo una sección a la vez */
    "section[hidden]{display:none!important}" +
    "nav a.cdisc-activa{background:var(--primary,#6D28D9)!important;border-color:var(--primary,#6D28D9)!important;color:var(--on-primary,#fff)!important;font-weight:600}" +
    ".cdisc-pasos{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:8px;padding-top:20px;border-top:1px solid var(--line,#ddd)}" +
    ".cdisc-pasos button{font:600 15px var(--body,system-ui,sans-serif);border-radius:999px;padding:10px 18px;cursor:pointer;" +
    "background:transparent;color:var(--ink,inherit);border:2px solid var(--line,#ccc)}" +
    ".cdisc-pasos button.sig{margin-left:auto;background:var(--primary,#6D28D9);border-color:var(--primary,#6D28D9);color:var(--on-primary,#fff)}" +
    ".cdisc-pasos button:hover{filter:brightness(1.08)}" +
    ".cdisc-pasos button:focus-visible{outline:3px solid var(--accent,currentColor);outline-offset:2px}";

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
    if (!esIndice()) unaSeccionALaVez();
  }

  /*
   * Modo "una sección a la vez": si la página tiene un <nav> con enlaces a secciones
   * (<a href="#id"> → <section id="id">), solo se muestra la sección elegida.
   * Para desactivarlo en una lección: <body data-secciones="todas">.
   */
  function unaSeccionALaVez() {
    if (document.body.dataset.secciones === "todas") return;
    var nav = document.querySelector("main nav") || document.querySelector("nav");
    if (!nav) return;
    var enlaces = [], secciones = [];
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var s = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (s && s.tagName === "SECTION") { enlaces.push(a); secciones.push(s); }
    });
    if (secciones.length < 2) return;
    var t = TXT[idioma];

    // Botones Anterior / Siguiente al final de cada sección
    secciones.forEach(function (s, i) {
      var pasos = document.createElement("div");
      pasos.className = "cdisc-pasos";
      if (i > 0) {
        var a = boton(t.anterior, function () { mostrar(i - 1, true); });
        a.title = enlaces[i - 1].textContent;
        pasos.append(a);
      }
      if (i < secciones.length - 1) {
        var b = boton(t.siguiente, function () { mostrar(i + 1, true); });
        b.className = "sig";
        b.title = enlaces[i + 1].textContent;
        pasos.append(b);
      }
      s.append(pasos);
    });

    function mostrar(i, desplazar) {
      secciones.forEach(function (s, j) { s.hidden = j !== i; });
      enlaces.forEach(function (a, j) {
        a.classList.toggle("cdisc-activa", j === i);
        if (j === i) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
      if (desplazar !== null) history.replaceState(null, "", "#" + secciones[i].id);
      // Si el menú quedó fuera de la vista, sube hasta él
      if (desplazar && nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block: "start" });
    }
    function indicePorHash() {
      var id = decodeURIComponent(location.hash.slice(1));
      for (var i = 0; i < secciones.length; i++) if (secciones[i].id === id) return i;
      return -1;
    }

    enlaces.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); mostrar(i, false); });
    });
    window.addEventListener("hashchange", function () {
      var i = indicePorHash();
      if (i >= 0) mostrar(i, true);
    });
    // Al cargar sin #sección no se toca la dirección (si no, el navegador saltaría a ella)
    var inicial = indicePorHash();
    mostrar(Math.max(0, inicial), inicial >= 0 ? false : null);
  }

  window.CDISC = { idioma: function () { return idioma; } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();
