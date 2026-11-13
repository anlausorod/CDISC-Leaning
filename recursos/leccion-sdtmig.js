/* Lógica de la lección «SDTMIG 3.1.1 · Cap. 2» (ES y EN).
   Los textos vienen de la constante T definida en cada página. */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  function grupoBotones(cont, nombres, alElegir) {
    const bs = nombres.map((n, i) => {
      const b = el("button", null, n); b.type = "button";
      b.addEventListener("click", () => elegir(i)); cont.append(b); return b;
    });
    function elegir(i) { bs.forEach((b, j) => b.setAttribute("aria-pressed", j === i)); alElegir(i); }
    return elegir;
  }

  /* 2.1 Anatomía */
  function showAE(k) {
    const d = T.ae[k];
    $$("#sentence .seg").forEach(b => b.classList.toggle("on", b.dataset.k === k));
    $$("#aeTable [data-k]").forEach(c => { c.className = c.dataset.k === k ? "on r-" + d.r : ""; });
    const e = $("#explain"); e.className = "explain r-" + d.r;
    e.innerHTML = ""; const b = el("b", null, k + " · " + d.rol); e.append(b, el("br"), document.createTextNode(d.t));
  }
  $$("#sentence .seg, #aeTable [data-k]").forEach(x => x.addEventListener("click", () => showAE(x.dataset.k)));
  showAE("AETERM");

  /* 2.1 Calificadores */
  grupoBotones($("#qtabs"), T.q.map(q => q.n), i => {
    const q = T.q[i];
    $("#qtitle").textContent = T.qPrefix ? T.qPrefix + q.n.toLowerCase() : q.n + " qualifier";
    $("#qdesc").textContent = q.d; $("#qex").textContent = q.ex;
    $$("#lbTable [data-v]").forEach(c => {
      c.classList.toggle("q-on", q.on.includes(c.dataset.v));
      c.classList.toggle("q-ref", q.ref.includes(c.dataset.v));
    });
  })(0);

  /* 2.2 Código DOMAIN */
  const dpick = $("#dpick");
  const bsD = T.d.map((d, i) => { const b = el("button", null, d[0]); b.type = "button"; b.onclick = () => showD(i); dpick.append(b); return b; });
  function showD(i) {
    const [c, n, t] = T.d[i];
    bsD.forEach((b, j) => b.setAttribute("aria-pressed", j === i));
    $("#dname").textContent = c + " = " + n;
    $("#u1").textContent = c.toLowerCase() + ".xpt"; $("#u2").textContent = '"' + c + '"';
    $("#u3").textContent = c + "SEQ · " + c + t; $("#u3b").textContent = "--SEQ · --" + t;
  }
  showD(0);

  /* 2.1 Explorador: dominio / observación / variable / valor */
  if ($("#xtabs")) grupoBotones($("#xtabs"), T.x.map(m => m.n), i => {
    const m = T.x[i];
    $("#xwrap").dataset.modo = m.k;
    // En pantallas estrechas, desplaza la tabla para que se vea la columna o celda resaltada
    const sc = $("#xwrap .scroll"), cel = $("#xwrap .celda-sel");
    if (sc && cel) sc.scrollLeft = (m.k === "var" || m.k === "val") ? Math.max(0, cel.offsetLeft - sc.clientWidth / 2 + cel.offsetWidth / 2) : 0;
    const e = $("#xinfo"); e.className = "explain x-" + m.k; e.innerHTML = "";
    e.append(el("b", null, m.t), el("br"), document.createTextNode(m.d));
  })(0);

  /* 2.4 Clasificador: ¿a qué clase pertenece? */
  if ($("#sorter")) T.clasifica.forEach(([txt, c, why]) => {
    const box = el("div", "srt"), opts = el("div", "opts"), fb = el("div", "fb");
    box.append(el("p", null, txt), opts, fb);
    T.clases.forEach((cl, j) => {
      const b = el("button", "c-" + cl.k, cl.n); b.type = "button";
      b.onclick = () => {
        if (box.dataset.done) return; box.dataset.done = 1;
        b.classList.add(j === c ? "right" : "wrong"); opts.children[c].classList.add("right");
        fb.textContent = (j === c ? T.correcto : T.incorrecto) + why;
      };
      opts.append(b);
    });
    $("#sorter").append(box);
  });

  /* 2.4 Clases generales (pestañas, si existen) */
  if ($("#ctabs")) grupoBotones($("#ctabs"), T.clases.map(c => c.n), i => {
    const c = T.clases[i], box = $("#clase");
    box.className = "clase c-" + c.k; box.innerHTML = "";
    const ej = el("div", "ejemplos");
    c.ej.forEach(([cod, txt]) => { const s = el("span"); s.append(el("b", null, cod), document.createTextNode(txt)); ej.append(s); });
    const tema = el("span", "hint"); tema.append(document.createTextNode(T.temaLabel || "Variable de tema típica: "), el("code", null, c.tema));
    box.append(el("h3", null, c.n), el("p", null, c.t), ej, tema);
  })(0);

  /* 2.5 Dominios estándar */
  const doms = $("#doms"), info = $("#domInfo");
  const botonesDom = [];
  T.grupos.forEach(g => g.doms.forEach(([cod, nom]) => {
    const b = el("button", "c-" + g.k, cod); b.type = "button"; b.dataset.g = g.k;
    b.onclick = () => {
      botonesDom.forEach(x => x.setAttribute("aria-pressed", x === b));
      info.innerHTML = ""; info.append(el("b", null, cod.replace("*", "") + " · " + nom), el("br"), document.createTextNode(T.grupoDe + ": " + g.n + (cod.includes("*") ? " *" : "")));
    };
    doms.append(b); botonesDom.push(b);
  }));
  grupoBotones($("#gtabs"), [T.todos].concat(T.grupos.map(g => g.n)), i => {
    const k = i === 0 ? null : T.grupos[i - 1].k;
    botonesDom.forEach(b => { b.hidden = k !== null && b.dataset.g !== k; });
    (botonesDom.find(b => !b.hidden) || botonesDom[0]).click();
  })(0);

  /* 2.6 Pasos */
  let n = 1;
  T.fases.forEach((f, i) => {
    const d = el("details"); if (i === 0) d.open = true;
    const s = el("summary"), fin = n + f.pasos.length - 1;
    s.append(el("span", "rango", T.paso + " " + (n === fin ? n : n + "–" + fin)), document.createTextNode(f.n));
    const ol = el("ol"); ol.start = n;
    f.pasos.forEach(p => ol.append(el("li", null, p)));
    d.append(s, ol); $("#fases").append(d); n = fin + 1;
  });

  /* 2.6.1 Variables de un dominio nuevo */
  grupoBotones($("#ntabs"), T.clases.map(c => c.n), i => {
    const k = T.clases[i].k, f = $("#flujo"); f.innerHTML = "";
    T.nuevo.filas.forEach(([txt, cuando, cls]) => {
      const si = cuando === "siempre" || cuando === k;
      const d = el("div", (si ? "incl " : "excl ") + (cls.length === 3 ? "c-" + cls : "r-" + cls));
      d.append(el("span", null, txt), el("span", "est", si ? "✓ " + T.nuevo.si : "✗ " + T.nuevo.no));
      f.append(d);
    });
    f.append(el("div", "destino", "↓ " + T.nuevo.titulo + " (" + T.clases[i].n + ")"));
  })(2);

  /* Cuestionario */
  let good = 0, done = 0;
  T.quiz.forEach(([q, o, a, why], i) => {
    const box = el("div", "qz"), opts = el("div", "opts"), fb = el("div", "fb");
    box.append(el("p", null, (i + 1) + ". " + q), opts, fb);
    o.forEach((txt, j) => {
      const b = el("button", null, txt); b.type = "button";
      b.onclick = () => {
        if (box.dataset.done) return; box.dataset.done = 1; done++;
        const ok = j === a; if (ok) good++;
        b.classList.add(ok ? "right" : "wrong"); opts.children[a].classList.add("right");
        fb.textContent = (ok ? T.correcto : T.incorrecto) + why;
        $("#score").textContent = T.aciertos(good, done, T.quiz.length);
      };
      opts.append(b);
    });
    $("#quizBox").append(box);
  });
})();
