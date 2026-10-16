(function () {
  "use strict";

  const GAMES = [
    {
      id: "secuencia",
      title: "Secuencia secreta",
      cat: "memoria",
      catLabel: "Memoria / lógica",
      ages: ["6-8", "9-12"],
      blurb: "Memoriza y repite la secuencia de colores. Cada ronda añade un paso más.",
      why: "Entrena memoria de trabajo y atención sostenida.",
      play: playSecuencia,
    },
    {
      id: "figura",
      title: "Encuentra la figura",
      cat: "visoespacial",
      catLabel: "Visoespacial",
      ages: ["6-8", "9-12"],
      blurb: "Observa el patrón y elige la pieza que lo completa.",
      why: "Estimula percepción visual y razonamiento de patrones.",
      play: playFigura,
    },
    {
      id: "cuadrados",
      title: "Contar cuadrados",
      cat: "visoespacial",
      catLabel: "Visoespacial",
      ages: ["6-8", "9-12", "13"],
      blurb: "¿Cuántos cuadrados hay en el dibujo? Cuenta con cuidado.",
      why: "Trabaja atención selectiva y análisis visoespacial.",
      play: playCuadrados,
    },
    {
      id: "simbolos",
      title: "Memoria de símbolos",
      cat: "memoria",
      catLabel: "Memoria de trabajo",
      ages: ["6-8", "9-12"],
      blurb: "Encuentra las parejas de símbolos del observatorio.",
      why: "Fortalece memoria visual a corto plazo.",
      play: playSimbolos,
    },
    {
      id: "hanoi",
      title: "Torres de Hanoi",
      cat: "logica",
      catLabel: "Lógica / planificación",
      ages: ["9-12", "13"],
      blurb: "Mueve la torre al último poste. Solo puedes poner un disco más pequeño sobre uno mayor.",
      why: "Desarrolla planificación, inhibición y pensamiento recursivo.",
      play: playHanoi,
    },
    {
      id: "laberinto",
      title: "Laberinto mental",
      cat: "visoespacial",
      catLabel: "Visoespacial",
      ages: ["9-12", "13"],
      blurb: "Llega del punto teal al ámbar. Pulsa celdas adyacentes para avanzar.",
      why: "Entrena orientación espacial y planificación de rutas.",
      play: playLaberinto,
    },
    {
      id: "series",
      title: "Analogías y series",
      cat: "logica",
      catLabel: "Lógica",
      ages: ["9-12", "13"],
      blurb: "Completa la serie: ¿qué figura o número sigue?",
      why: "Refuerza razonamiento inductivo y pensamiento abstracto.",
      play: playSeries,
    },
    {
      id: "bombillas",
      title: "Interruptor y bombillas",
      cat: "lateral",
      catLabel: "Pensamiento lateral",
      ages: ["13"],
      blurb: "Tres interruptores, tres bombillas. Solo puedes entrar una vez. ¿Lo resuelves?",
      why: "Potencia creatividad, inferencia y pensamiento fuera de lo lineal.",
      play: playBombillas,
    },
  ];

  const grid = document.getElementById("games-grid");
  const empty = document.getElementById("games-empty");
  const overlay = document.getElementById("game-overlay");
  const shellTitle = document.getElementById("game-title");
  const shellWhy = document.getElementById("game-why");
  const shellBody = document.getElementById("game-body");
  const closeBtn = document.getElementById("game-close");

  let ageFilter = "all";
  let catFilter = "all";
  let activeCleanup = null;

  function renderCards() {
    grid.innerHTML = "";
    let visible = 0;

    GAMES.forEach((g) => {
      const ageOk = ageFilter === "all" || g.ages.includes(ageFilter);
      const catOk = catFilter === "all" || g.cat === catFilter;
      if (!ageOk || !catOk) return;

      visible++;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "game-card";
      btn.dataset.id = g.id;
      btn.innerHTML =
        '<span class="game-cat">' +
        g.catLabel +
        "</span><h3>" +
        g.title +
        "</h3><p>" +
        g.blurb +
        '</p><div class="game-ages">' +
        g.ages
          .map((a) => "<span>" + (a === "13" ? "13+" : a) + "</span>")
          .join("") +
        "</div>";
      btn.addEventListener("click", () => openGame(g));
      grid.appendChild(btn);
    });

    empty.classList.toggle("show", visible === 0);
  }

  function openGame(g) {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    shellTitle.textContent = g.title;
    shellWhy.textContent = g.why;
    shellBody.innerHTML = "";
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    activeCleanup = g.play(shellBody) || null;
  }

  function closeGame() {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    shellBody.innerHTML = "";
  }

  closeBtn.addEventListener("click", closeGame);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeGame();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeGame();
  });

  document.querySelectorAll("[data-filter-age]").forEach((chip) => {
    chip.addEventListener("click", () => {
      ageFilter = chip.dataset.filterAge;
      document.querySelectorAll("[data-filter-age]").forEach((c) => {
        c.classList.toggle("active", c === chip);
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      const url = new URL(window.location.href);
      if (ageFilter === "all") url.searchParams.delete("edad");
      else url.searchParams.set("edad", ageFilter);
      history.replaceState(null, "", url);
      renderCards();
    });
  });

  document.querySelectorAll("[data-filter-cat]").forEach((chip) => {
    chip.addEventListener("click", () => {
      catFilter = chip.dataset.filterCat;
      document.querySelectorAll("[data-filter-cat]").forEach((c) => {
        c.classList.toggle("active", c === chip);
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      renderCards();
    });
  });

  const params = new URLSearchParams(window.location.search);
  const edadParam = params.get("edad");
  if (edadParam && ["6-8", "9-12", "13"].includes(edadParam)) {
    ageFilter = edadParam;
    document.querySelectorAll("[data-filter-age]").forEach((c) => {
      const on = c.dataset.filterAge === edadParam;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  renderCards();

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function toolbar(body, statusText) {
    const bar = el("div", "game-toolbar");
    const restart = el("button", "btn sm", "Nueva partida");
    restart.type = "button";
    const status = el("div", "game-status", statusText || "");
    bar.appendChild(restart);
    bar.appendChild(status);
    body.appendChild(bar);
    const board = el("div", "game-board");
    body.appendChild(board);
    const feedback = el("div", "game-feedback");
    body.appendChild(feedback);
    return { restart, status, board, feedback };
  }

  function setFeedback(fb, msg, kind) {
    fb.textContent = msg;
    fb.className = "game-feedback" + (kind ? " " + kind : "");
  }

  /* ---------- 1. Secuencia secreta ---------- */
  function playSecuencia(body) {
    const ui = toolbar(body, "Nivel 0");
    let sequence = [];
    let input = [];
    let playing = false;
    let locked = false;

    const pads = el("div", "seq-pads");
    for (let i = 0; i < 4; i++) {
      const p = el("button", "seq-pad");
      p.type = "button";
      p.dataset.i = String(i);
      p.setAttribute("aria-label", "Color " + (i + 1));
      p.addEventListener("click", () => onPad(i));
      pads.appendChild(p);
    }
    ui.board.appendChild(pads);

    function lit(i, on) {
      pads.children[i].classList.toggle("lit", on);
    }

    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function showSequence() {
      locked = true;
      setFeedback(ui.feedback, "Observa…", "");
      await sleep(400);
      for (const i of sequence) {
        lit(i, true);
        await sleep(450);
        lit(i, false);
        await sleep(180);
      }
      locked = false;
      setFeedback(ui.feedback, "Tu turno", "");
    }

    async function nextRound() {
      sequence.push(Math.floor(Math.random() * 4));
      input = [];
      ui.status.textContent = "Nivel " + sequence.length;
      playing = true;
      await showSequence();
    }

    function onPad(i) {
      if (!playing || locked) return;
      lit(i, true);
      setTimeout(() => lit(i, false), 150);
      input.push(i);
      const idx = input.length - 1;
      if (input[idx] !== sequence[idx]) {
        setFeedback(ui.feedback, "¡Casi! Prueba de nuevo.", "err");
        playing = false;
        return;
      }
      if (input.length === sequence.length) {
        setFeedback(ui.feedback, "¡Bien! Siguiente nivel…", "ok");
        locked = true;
        setTimeout(nextRound, 700);
      }
    }

    function start() {
      sequence = [];
      input = [];
      setFeedback(ui.feedback, "", "");
      nextRound();
    }

    ui.restart.addEventListener("click", start);
    start();
  }

  /* ---------- 2. Encuentra la figura ---------- */
  function playFigura(body) {
    const ui = toolbar(body, "Ronda 1");
    const patterns = [
      { show: ["▲", "▲", "●", "▲", "▲", "?"], answer: "●", choices: ["●", "■", "▲", "◆"] },
      { show: ["1", "2", "4", "8", "?"], answer: "16", choices: ["10", "12", "16", "32"] },
      { show: ["○", "◐", "●", "○", "◐", "?"], answer: "●", choices: ["○", "●", "◐", "◑"] },
      { show: ["A", "C", "E", "G", "?"], answer: "I", choices: ["H", "I", "J", "F"] },
      { show: ["★", "☆", "★", "☆", "★", "?"], answer: "☆", choices: ["★", "☆", "●", "◆"] },
      { show: ["3", "6", "12", "24", "?"], answer: "48", choices: ["36", "42", "48", "30"] },
    ];
    let round = 0;
    let score = 0;
    let locked = false;

    const display = el("div", "pattern-display");
    const choices = el("div", "choice-row");
    ui.board.appendChild(display);
    ui.board.appendChild(choices);

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
      }
      return a;
    }

    function load() {
      locked = false;
      const p = patterns[round % patterns.length];
      ui.status.textContent = "Aciertos " + score + " · Ronda " + (round + 1);
      display.innerHTML = "";
      p.show.forEach((s) => {
        if (s === "?") display.appendChild(el("span", "gap", "?"));
        else {
          const span = document.createElement("span");
          span.textContent = s;
          display.appendChild(span);
        }
      });
      choices.innerHTML = "";
      setFeedback(ui.feedback, "¿Qué completa el patrón?", "");
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      shuffle(p.choices).forEach((c) => {
        const b = el("button", "choice-btn");
        b.type = "button";
        b.textContent = c;
        b.addEventListener("click", () => {
          if (locked) return;
          b.blur();
          if (c === p.answer) {
            locked = true;
            b.classList.add("correct");
            score++;
            setFeedback(ui.feedback, "¡Correcto!", "ok");
            round++;
            setTimeout(load, 800);
          } else {
            b.classList.add("wrong");
            setFeedback(ui.feedback, "No es esa. Sigue pensando.", "err");
          }
          ui.status.textContent = "Aciertos " + score + " · Ronda " + (round + 1);
        });
        choices.appendChild(b);
      });
    }

    ui.restart.addEventListener("click", () => {
      round = 0;
      score = 0;
      load();
    });
    load();
  }

  /* ---------- 3. Contar cuadrados ---------- */
  function playCuadrados(body) {
    const ui = toolbar(body, "¿Cuántos?");
    const img = el("img", "squares-img");
    img.src = "assets/reto-cuadrados.png";
    img.alt = "Puzzle de cuadrados para contar";
    ui.board.appendChild(img);

    const row = el("div", "squares-guess");
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "100";
    input.placeholder = "?";
    input.setAttribute("aria-label", "Tu respuesta");
    const check = el("button", "btn sm", "Comprobar");
    check.type = "button";
    const hint = el("button", "btn sm alt", "Pista");
    hint.type = "button";
    row.appendChild(input);
    row.appendChild(check);
    row.appendChild(hint);
    ui.board.appendChild(row);

    const ANSWER = 31;
    let revealed = false;

    check.addEventListener("click", () => {
      const n = parseInt(input.value, 10);
      if (Number.isNaN(n)) {
        setFeedback(ui.feedback, "Escribe un número.", "err");
        return;
      }
      if (n === ANSWER) {
        setFeedback(ui.feedback, "¡Exacto! Hay 31 cuadrados.", "ok");
        revealed = true;
      } else if (Math.abs(n - ANSWER) <= 3) {
        setFeedback(ui.feedback, "Muy cerca… cuenta otra vez los de todos los tamaños.", "err");
      } else {
        setFeedback(ui.feedback, "Aún no. Recuerda: 1×1, 2×2, 3×3…", "err");
      }
    });

    hint.addEventListener("click", () => {
      setFeedback(
        ui.feedback,
        "Cuenta por tamaños: los pequeños, los de 2×2, los de 3×3… y el grande.",
        ""
      );
    });

    ui.restart.addEventListener("click", () => {
      input.value = "";
      revealed = false;
      setFeedback(ui.feedback, "Cuenta todos los cuadrados que veas.", "");
    });
    setFeedback(ui.feedback, "Cuenta todos los cuadrados que veas.", "");
  }

  /* ---------- 4. Memoria de símbolos ---------- */
  function playSimbolos(body) {
    const ui = toolbar(body, "Parejas 0/8");
    const SYMBOLS = ["★", "☽", "⊕", "△", "☉", "◇", "⚡", "⬡"];
    let first = null;
    let lock = false;
    let matched = 0;
    let moves = 0;

    function deal() {
      matched = 0;
      moves = 0;
      first = null;
      lock = false;
      ui.status.textContent = "Parejas 0/8";
      setFeedback(ui.feedback, "Encuentra las parejas.", "");
      const deck = SYMBOLS.concat(SYMBOLS)
        .map((s, i) => ({ s, i }))
        .sort(() => Math.random() - 0.5);

      ui.board.innerHTML = "";
      const gridEl = el("div", "mem-grid");
      deck.forEach((card) => {
        const b = el("button", "mem-card", card.s);
        b.type = "button";
        b.dataset.sym = card.s;
        b.addEventListener("click", () => {
          if (lock || b.classList.contains("flipped") || b.classList.contains("matched")) return;
          b.classList.add("flipped");
          if (!first) {
            first = b;
            return;
          }
          moves++;
          lock = true;
          if (first.dataset.sym === b.dataset.sym) {
            first.classList.add("matched");
            b.classList.add("matched");
            matched++;
            ui.status.textContent = "Parejas " + matched + "/8 · Movimientos " + moves;
            first = null;
            lock = false;
            if (matched === 8) setFeedback(ui.feedback, "¡Completado en " + moves + " movimientos!", "ok");
          } else {
            const a = first;
            setTimeout(() => {
              a.classList.remove("flipped");
              b.classList.remove("flipped");
              first = null;
              lock = false;
            }, 650);
          }
        });
        gridEl.appendChild(b);
      });
      ui.board.appendChild(gridEl);
    }

    ui.restart.addEventListener("click", deal);
    deal();
  }

  /* ---------- 5. Torres de Hanoi ---------- */
  function playHanoi(body) {
    const DISKS = 4;
    const COLORS = ["#d4920a", "#1a6b6b", "#2a4a7a", "#8b4513"];
    /* disk 1 = smallest, disk N = largest */
    const WIDTHS = [36, 52, 68, 84];
    let pegs = [[], [], []];
    let selected = null;
    let moves = 0;

    const ui = toolbar(body, "Movimientos 0 · Óptimo " + (Math.pow(2, DISKS) - 1));
    const pegsEl = el("div", "hanoi-pegs");
    ui.board.appendChild(pegsEl);

    function init() {
      pegs = [[], [], []];
      for (let d = DISKS; d >= 1; d--) pegs[0].push(d);
      selected = null;
      moves = 0;
      ui.status.textContent = "Movimientos 0 · Óptimo " + (Math.pow(2, DISKS) - 1);
      setFeedback(ui.feedback, "Pulsa un poste para coger el disco de arriba, luego otro para soltarlo.", "");
      draw();
    }

    function draw() {
      pegsEl.innerHTML = "";
      pegs.forEach((stack, pi) => {
        const peg = el("div", "hanoi-peg" + (selected === pi ? " selected" : ""));
        peg.setAttribute("aria-label", "Poste " + (pi + 1));
        stack.forEach((d) => {
          const disk = el("div", "hanoi-disk");
          disk.style.width = WIDTHS[d - 1] + "%";
          disk.style.background = COLORS[d - 1];
          peg.appendChild(disk);
        });
        peg.addEventListener("click", () => onPeg(pi));
        pegsEl.appendChild(peg);
      });
    }

    function onPeg(pi) {
      if (selected === null) {
        if (pegs[pi].length === 0) return;
        selected = pi;
        draw();
        return;
      }
      if (selected === pi) {
        selected = null;
        draw();
        return;
      }
      const from = pegs[selected];
      const to = pegs[pi];
      const disk = from[from.length - 1];
      if (to.length && to[to.length - 1] < disk) {
        setFeedback(ui.feedback, "No puedes poner un disco mayor sobre uno menor.", "err");
        selected = null;
        draw();
        return;
      }
      from.pop();
      to.push(disk);
      moves++;
      selected = null;
      ui.status.textContent = "Movimientos " + moves + " · Óptimo " + (Math.pow(2, DISKS) - 1);
      if (pegs[2].length === DISKS) {
        setFeedback(ui.feedback, "¡Torre completada en " + moves + " movimientos!", "ok");
      } else {
        setFeedback(ui.feedback, "", "");
      }
      draw();
    }

    ui.restart.addEventListener("click", init);
    init();
  }

  /* ---------- 6. Laberinto ---------- */
  function playLaberinto(body) {
    const ui = toolbar(body, "Pasos 0");
    // 0 path, 1 wall
    const MAP = [
      [0, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 0],
      [1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const ROWS = MAP.length;
    const COLS = MAP[0].length;
    const START = [0, 0];
    const END = [8, 8];
    let pos = [...START];
    let steps = 0;
    let pathSet = new Set(["0,0"]);

    function key(r, c) {
      return r + "," + c;
    }

    function draw() {
      ui.board.innerHTML = "";
      const g = el("div", "maze-grid");
      g.style.gridTemplateColumns = "repeat(" + COLS + ", 28px)";
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = el("button", "maze-cell");
          cell.type = "button";
          if (MAP[r][c] === 1) {
            cell.classList.add("wall");
            cell.disabled = true;
          } else {
            if (pathSet.has(key(r, c))) cell.classList.add("path");
            if (r === START[0] && c === START[1]) cell.classList.add("start");
            if (r === END[0] && c === END[1]) cell.classList.add("end");
            if (r === pos[0] && c === pos[1]) cell.classList.add("player");
            cell.addEventListener("click", () => tryMove(r, c));
          }
          g.appendChild(cell);
        }
      }
      ui.board.appendChild(g);
    }

    function tryMove(r, c) {
      if (MAP[r][c] === 1) return;
      const dr = Math.abs(r - pos[0]);
      const dc = Math.abs(c - pos[1]);
      if (dr + dc !== 1) {
        setFeedback(ui.feedback, "Solo puedes moverte a una casilla vecina.", "err");
        return;
      }
      pos = [r, c];
      steps++;
      pathSet.add(key(r, c));
      ui.status.textContent = "Pasos " + steps;
      if (r === END[0] && c === END[1]) {
        setFeedback(ui.feedback, "¡Saliste del laberinto en " + steps + " pasos!", "ok");
      } else {
        setFeedback(ui.feedback, "", "");
      }
      draw();
    }

    function onKey(e) {
      const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const nr = pos[0] + d[0];
      const nc = pos[1] + d[1];
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) tryMove(nr, nc);
    }

    function init() {
      pos = [...START];
      steps = 0;
      pathSet = new Set(["0,0"]);
      ui.status.textContent = "Pasos 0";
      setFeedback(ui.feedback, "Pulsa casillas vecinas o usa las flechas del teclado.", "");
      draw();
    }

    document.addEventListener("keydown", onKey);
    ui.restart.addEventListener("click", init);
    init();
    return () => document.removeEventListener("keydown", onKey);
  }

  /* ---------- 7. Series ---------- */
  function playSeries(body) {
    const ui = toolbar(body, "Aciertos 0");
    const items = [
      { q: "2 · 3 · 5 · 8 · 12 · ?", a: "17", opts: ["15", "16", "17", "18"], hint: "Cada salto suma +1, +2, +3…" },
      { q: "◐ → ● → ○ → ◐ → ● → ?", a: "○", opts: ["◐", "●", "○", "◑"], hint: "Ciclo de tres fases." },
      { q: "Z · X · V · T · ?", a: "R", opts: ["S", "R", "Q", "U"], hint: "Retrocede de dos en dos en el abecedario." },
      { q: "△ · □ · ○ · △ · □ · ?", a: "○", opts: ["△", "□", "○", "◇"], hint: "Se repite el ciclo de tres." },
      { q: "1 · 1 · 2 · 3 · 5 · 8 · ?", a: "13", opts: ["11", "12", "13", "14"], hint: "Cada número es la suma de los dos anteriores." },
      { q: "norte · este · sur · ?", a: "oeste", opts: ["oeste", "norte", "centro", "arriba"], hint: "Giros de 90° en el sentido de las agujas." },
    ];
    let i = 0;
    let score = 0;
    let locked = false;

    function shuffle(arr) {
      const a = arr.slice();
      for (let j = a.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        const t = a[j];
        a[j] = a[k];
        a[k] = t;
      }
      return a;
    }

    function load() {
      locked = false;
      const item = items[i % items.length];
      ui.status.textContent = "Aciertos " + score;
      ui.board.innerHTML = "";
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      const q = el("div", "pattern-display");
      q.style.fontSize = "1.25rem";
      q.textContent = item.q;
      ui.board.appendChild(q);
      const row = el("div", "choice-row");
      shuffle(item.opts).forEach((o) => {
        const b = el("button", "choice-btn");
        b.type = "button";
        b.textContent = o;
        b.style.fontSize = "1rem";
        b.addEventListener("click", () => {
          if (locked) return;
          b.blur();
          if (o === item.a) {
            locked = true;
            b.classList.add("correct");
            score++;
            setFeedback(ui.feedback, "¡Correcto!", "ok");
            i++;
            setTimeout(load, 700);
          } else {
            b.classList.add("wrong");
            setFeedback(ui.feedback, "Pista: " + item.hint, "err");
          }
          ui.status.textContent = "Aciertos " + score;
        });
        row.appendChild(b);
      });
      ui.board.appendChild(row);
      setFeedback(ui.feedback, "¿Qué sigue en la serie?", "");
    }

    ui.restart.addEventListener("click", () => {
      i = 0;
      score = 0;
      load();
    });
    load();
  }

  /* ---------- 8. Bombillas ---------- */
  function playBombillas(body) {
    const ui = toolbar(body, "Fase: pasillo");
    // State machine for classic puzzle teaching
    let phase = "hall"; // hall | room | done
    let switches = [false, false, false];
    let timeOn = [0, 0, 0];
    let tick = null;
    let entered = false;
    // Mapping: switch 0 = hot when left on long, 1 = lit, 2 = cold/off — classic solution path

    const info = el("p", "muted");
    info.style.margin = "0 0 12px";
    info.textContent =
      "Hay tres interruptores en el pasillo y tres bombillas en una habitación cerrada. Solo puedes entrar una vez. Enciende y apaga interruptores; cuando quieras, entra.";
    ui.board.appendChild(info);

    const swRow = el("div", "switches-row");
    const swBtns = [];
    for (let i = 0; i < 3; i++) {
      const b = el("button", "switch-btn", "<span>I" + (i + 1) + "</span><span>OFF</span>");
      b.type = "button";
      b.addEventListener("click", () => {
        if (phase !== "hall") return;
        switches[i] = !switches[i];
        b.classList.toggle("on", switches[i]);
        b.children[1].textContent = switches[i] ? "ON" : "OFF";
      });
      swBtns.push(b);
      swRow.appendChild(b);
    }
    ui.board.appendChild(swRow);

    const enterBtn = el("button", "btn sm", "Entrar en la habitación");
    enterBtn.type = "button";
    enterBtn.style.display = "block";
    enterBtn.style.margin = "12px auto";
    ui.board.appendChild(enterBtn);

    const bulbRow = el("div", "bulb-row");
    bulbRow.style.display = "none";
    const bulbs = [];
    for (let i = 0; i < 3; i++) {
      const bu = el("div", "bulb");
      bu.title = "Bombilla " + (i + 1);
      bulbs.push(bu);
      bulbRow.appendChild(bu);
    }
    ui.board.appendChild(bulbRow);

    const quiz = el("div", "choice-row");
    quiz.style.display = "none";
    ui.board.appendChild(quiz);

    tick = setInterval(() => {
      if (phase !== "hall") return;
      switches.forEach((on, i) => {
        if (on) timeOn[i] += 1;
      });
    }, 1000);

    enterBtn.addEventListener("click", () => {
      if (phase !== "hall" || entered) return;
      entered = true;
      phase = "room";
      ui.status.textContent = "Fase: habitación";
      enterBtn.disabled = true;
      swBtns.forEach((b) => (b.disabled = true));

      // Determine bulb states from switch strategy:
      // Classic: leave one on long (hot), one currently on (lit), one off (cold)
      const ranked = [0, 1, 2].sort((a, b) => timeOn[b] - timeOn[a]);
      // Assign: longest cumulative ON that is now OFF = hot; currently ON = lit; never/least = cold
      let litIdx = switches.findIndex((s) => s);
      let hotIdx = -1;
      let coldIdx = -1;

      const offWithTime = [0, 1, 2].filter((i) => !switches[i] && timeOn[i] > 0);
      const neverOn = [0, 1, 2].filter((i) => timeOn[i] === 0 && !switches[i]);

      if (litIdx >= 0) {
        hotIdx = offWithTime.sort((a, b) => timeOn[b] - timeOn[a])[0];
        if (hotIdx === undefined) hotIdx = -1;
        coldIdx = neverOn.find((i) => i !== litIdx && i !== hotIdx);
        if (coldIdx === undefined) {
          coldIdx = [0, 1, 2].find((i) => i !== litIdx && i !== hotIdx);
        }
      }

      bulbRow.style.display = "flex";
      bulbs.forEach((b) => b.className = "bulb");

      // Map physical bulbs to switch indices for display
      // bulb 0 <- switch that is lit, bulb 1 <- hot, bulb 2 <- cold — if strategy incomplete, show realistic state
      const assignment = [null, null, null]; // bulb -> switch
      if (litIdx >= 0) {
        bulbs[0].classList.add("lit");
        assignment[0] = litIdx;
      }
      if (hotIdx >= 0) {
        bulbs[1].classList.add("hot");
        assignment[1] = hotIdx;
      }
      if (coldIdx !== undefined && coldIdx >= 0) {
        assignment[2] = coldIdx;
      }

      // If player didn't follow strategy, show raw: each switch that is ON lights a bulb
      if (litIdx < 0 || hotIdx < 0) {
        bulbs.forEach((b) => (b.className = "bulb"));
        let bi = 0;
        switches.forEach((on, si) => {
          if (on && bi < 3) {
            bulbs[bi].classList.add("lit");
            bi++;
          }
        });
        setFeedback(
          ui.feedback,
          "Has entrado, pero con esta estrategia no puedes distinguir las tres. Reinicia e intenta: deja uno ON mucho tiempo, apágalo, enciende otro e entra.",
          "err"
        );
        phase = "done";
        return;
      }

      setFeedback(
        ui.feedback,
        "Observa: una encendida, una apagada pero caliente, una fría. ¿Cuál es la estrategia correcta?",
        ""
      );

      quiz.style.display = "flex";
      quiz.innerHTML = "";
      const options = [
        {
          t: "ON largo → apagar; ON el segundo; entrar (caliente / encendida / fría)",
          ok: true,
        },
        {
          t: "Encender los tres a la vez y entrar",
          ok: false,
        },
        {
          t: "Encender solo uno un segundo e ir entrando tres veces",
          ok: false,
        },
      ];
      options.forEach((o) => {
        const b = el("button", "choice-btn", o.t);
        b.type = "button";
        b.style.fontSize = "0.85rem";
        b.style.maxWidth = "200px";
        b.style.minHeight = "auto";
        b.style.height = "auto";
        b.addEventListener("click", () => {
          if (o.ok) {
            b.classList.add("correct");
            setFeedback(
              ui.feedback,
              "¡Exacto! La encendida = segundo interruptor; la caliente = el primero; la fría = el tercero.",
              "ok"
            );
            ui.status.textContent = "Resuelto";
          } else {
            b.classList.add("wrong");
            setFeedback(ui.feedback, "Esa estrategia no basta con una sola entrada.", "err");
          }
        });
        quiz.appendChild(b);
      });
      phase = "done";
    });

    function reset() {
      phase = "hall";
      switches = [false, false, false];
      timeOn = [0, 0, 0];
      entered = false;
      enterBtn.disabled = false;
      swBtns.forEach((b, i) => {
        b.disabled = false;
        b.classList.remove("on");
        b.children[1].textContent = "OFF";
      });
      bulbRow.style.display = "none";
      bulbs.forEach((b) => (b.className = "bulb"));
      quiz.style.display = "none";
      quiz.innerHTML = "";
      ui.status.textContent = "Fase: pasillo";
      setFeedback(ui.feedback, "Prepara tu estrategia antes de entrar.", "");
    }

    ui.restart.addEventListener("click", reset);
    setFeedback(ui.feedback, "Prepara tu estrategia antes de entrar.", "");

    return () => {
      if (tick) clearInterval(tick);
    };
  }
})();
