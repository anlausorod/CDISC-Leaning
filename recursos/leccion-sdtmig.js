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

  /* 2.1 Juego: ¿qué rol tiene? */
  const ROLCLS = ["id", "topic", "timing", "qual", "rule"];
  function juego() {
    const J = T.juego, cont = $("#juego"); if (!cont) return;
    const mezcla = J.vars.slice().sort(() => Math.random() - 0.5);
    let i = 0, ok = 0, racha = 0, mejor = 0;
    function ronda() {
      cont.innerHTML = "";
      const [v, ctx, r, why] = mezcla[i];
      const barra = el("div", "j-barra"), prog = el("div", "j-prog"), barraIn = el("i");
      const sRacha = el("span", "racha"), sPuntos = el("span");
      const marcador = () => { sRacha.textContent = racha > 1 ? "🔥 " + J.racha + " " + racha : ""; sPuntos.textContent = J.puntos + ": " + ok; };
      marcador();
      barra.append(el("span", null, J.pregunta + " " + (i + 1) + "/" + mezcla.length), sRacha, sPuntos);
      barraIn.style.width = (i / mezcla.length * 100) + "%"; prog.append(barraIn);
      const carta = el("div", "j-carta"); carta.append(el("span", "j-var", v), el("span", "j-ctx", ctx));
      const opts = el("div", "j-opts"), fb = el("div", "j-fb"), acc = el("div", "j-acc");
      J.roles.forEach((nombre, j) => {
        const b = el("button", "r-" + ROLCLS[j], nombre); b.type = "button";
        b.onclick = () => {
          [...opts.children].forEach(x => x.disabled = true);
          const bien = j === r;
          if (bien) { ok++; racha++; mejor = Math.max(mejor, racha); } else racha = 0;
          marcador(); barraIn.style.width = ((i + 1) / mezcla.length * 100) + "%";
          b.classList.add(bien ? "right" : "wrong"); opts.children[r].classList.add("right");
          fb.innerHTML = ""; fb.append(el("b", bien ? null : "mal", bien ? J.bien : J.mal + " " + J.roles[r] + "."), document.createTextNode(" " + why));
          const sig = el("button", null, i < mezcla.length - 1 ? J.siguiente : J.verResultado); sig.type = "button";
          sig.onclick = () => { i++; i < mezcla.length ? ronda() : fin(); };
          acc.append(sig); sig.focus();
        };
        opts.append(b);
      });
      cont.append(barra, prog, carta, opts, fb, acc);
    }
    function fin() {
      cont.innerHTML = "";
      const f = el("div", "j-fin");
      const otra = el("button", null, J.otraVez); otra.type = "button";
      otra.onclick = () => { mezcla.sort(() => Math.random() - 0.5); i = ok = racha = mejor = 0; ronda(); };
      const acc = el("div", "j-acc"); acc.append(otra);
      f.append(el("span", "grande", ok + "/" + mezcla.length), el("span", null, J.mensaje(ok, mezcla.length)), el("span", "hint", J.mejorRacha + ": " + mejor), acc);
      cont.append(f);
    }
    ronda();
  }
  juego();

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
  const N = T.nuevo;
  function chips(vars) { const c = el("div", "chips"); vars.forEach(v => c.append(el("span", null, v))); return c; }
  function fila(cls, titulo, vars, incluida, motivo) {
    const d = el("div", "fila2 " + (incluida ? "incl " : "excl ") + cls), cab = el("div", "cab2");
    cab.append(el("b", null, titulo), el("span", "est", incluida ? "✓ " + N.si : "✗ " + N.no));
    d.append(cab, chips(vars));
    if (motivo) d.append(el("span", "motivo", motivo));
    return d;
  }
  grupoBotones($("#ntabs"), T.clases.map(c => c.n), i => {
    const elegida = T.clases[i], f = $("#flujo"); f.innerHTML = "";
    N.siempre.forEach(([tit, preg, vars]) => f.append(fila("", tit + " · " + preg, vars, true, null)));
    N.porClase.forEach((pc, j) => {
      const cl = T.clases[j], suya = j === i;
      f.append(fila("c-" + cl.k, N.temaYcal + " " + cl.n, [pc.tema].concat(pc.quals), suya,
        suya ? N.motivoSi(pc) : N.motivoNo(pc, elegida.n)));
    });
    const ej = N.ejemplos[i], box = el("div", "ejnuevo");
    box.append(el("b", null, N.ejemploTit), el("span", null, ej.idea));
    const ul = el("ul", "veredicto");
    ej.si.forEach(([v, t]) => { const li = el("li"); li.append(el("span", "s y", "✓"), el("span", null, v + ": " + t)); ul.append(li); });
    ej.no.forEach(([v, t]) => { const li = el("li"); li.append(el("span", "s n", "✗"), el("span", null, v + ": " + t)); ul.append(li); });
    box.append(ul);
    f.append(el("div", "destino", "↓ " + N.titulo + " (" + elegida.n + ")"), box);
  })(2);

  /* Cuestionario (por niveles) */
  function cuestionario() {
    const box0 = $("#quizBox"); box0.innerHTML = "";
    const niveles = T.quiz2
      ? [{ n: T.nivel1, badge: T.badge1, q: T.quiz }, { n: T.nivel2, badge: T.badge2, intro: T.intro2, q: T.quiz2 }]
      : [{ n: "", q: T.quiz }];
    const total = niveles.reduce((t, nv) => t + nv.q.length, 0);
    let good = 0, done = 0;
    niveles.forEach((nv, k) => {
      let g = 0, d = 0;
      const cab = el("div", "nivel"), sc = el("span", "sc", "0/" + nv.q.length);
      if (nv.n) { cab.append(el("span", "badge" + (k ? " dif" : ""), nv.badge), el("h3", null, nv.n), sc); box0.append(cab); }
      if (nv.intro) box0.append(el("p", "hint", nv.intro));
      nv.q.forEach(([q, o0, a0, why], i) => {
        // Mezcla el orden de las opciones para que la correcta no esté siempre en el mismo sitio
        const orden = o0.map((_, j) => j).sort(() => Math.random() - 0.5);
        const o = orden.map(j => o0[j]), a = orden.indexOf(a0);
        const box = el("div", "qz"), opts = el("div", "opts"), fb = el("div", "fb");
        box.append(el("p", null, (i + 1) + ". " + q), opts, fb);
        o.forEach((txt, j) => {
          const b = el("button", null, txt); b.type = "button";
          b.onclick = () => {
            if (box.dataset.done) return; box.dataset.done = 1; done++; d++;
            const ok = j === a; if (ok) { good++; g++; }
            b.classList.add(ok ? "right" : "wrong"); opts.children[a].classList.add("right");
            fb.textContent = (ok ? T.correcto : T.incorrecto) + why;
            sc.textContent = g + "/" + nv.q.length;
            $("#score").textContent = T.aciertos(good, done, total);
          };
          opts.append(b);
        });
        box0.append(box);
      });
    });
    $("#score").textContent = "";
  }
  cuestionario();
  const rein = $("#reiniciar");
  if (rein) rein.onclick = () => { cuestionario(); $("#quiz").scrollIntoView({ block: "start" }); };
})();
