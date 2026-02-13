(function () {
  const screen = document.getElementById("screen");

  // Sort questions by points (increasing difficulty)
  let ACTIVE_BANK = window.QUESTION_BANK.slice().sort((a, b) => a.points - b.points);

  const state = {
    name: "",
    group: "",
    i: 0,
    answers: {},   // { questionId: answer }  — answer shape depends on qType
    startedAt: null
  };

  function totalPoints() {
    return ACTIVE_BANK.reduce((sum, q) => sum + (q.points || 0), 0);
  }

  function answeredCount() {
    return Object.keys(state.answers).length;
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function b64EncodeUnicode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin);
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // ───────── Start screen ─────────

  function renderStart() {
    screen.innerHTML = `
      <div class="card">
        <h2>Start</h2>
        <p>Enter your details, then answer all questions.</p>

        <label>Name</label>
        <input id="name" type="text" placeholder="e.g. Joe Tan" autocomplete="off" />

        <label>Class / Group</label>
        <input id="group" type="text" placeholder="e.g. P6-3 / S1-2" autocomplete="off" />

        <hr />

        <p><strong>Rules</strong></p>
        <ul>
          <li>Do it on your own.</li>
          <li>No need to rush.</li>
          <li>At the end, copy the Result Code.</li>
        </ul>

        <div class="nav">
          <span></span>
          <button class="primary" id="startBtn">Start test</button>
        </div>
      </div>
    `;

    const nameEl = document.getElementById("name");
    const groupEl = document.getElementById("group");
    const btn = document.getElementById("startBtn");

    btn.addEventListener("click", () => {
      const name = nameEl.value.trim();
      const group = groupEl.value.trim();

      if (!name || !group) {
        alert("Please fill in your name and class/group.");
        return;
      }

      state.name = name;
      state.group = group;
      state.startedAt = Date.now();
      state.i = 0;
      state.answers = {};

      renderQuestion();
    });
  }

  // ───────── Question renderers ─────────

  function renderQuestion() {
    const q = ACTIVE_BANK[state.i];
    const progress = `${state.i + 1} / ${ACTIVE_BANK.length}`;
    const pts = `${q.points} pts`;

    const metaPills = `
      <div class="row" style="margin-top:6px">
        ${q.topic ? `<span class="pill">${escapeHtml(q.topic)}</span>` : ""}
      </div>
    `;

    // Illustration (raw HTML / SVG — not escaped)
    const illustrationHtml = q.illustration ? `<div class="illustration">${q.illustration}</div>` : "";

    // Build the body depending on question type
    let bodyHtml = "";
    switch (q.qType) {
      case "mcq":
        bodyHtml = renderMcqBody(q);
        break;
      case "numerical-input":
        bodyHtml = renderNumericalBody(q);
        break;
      case "drag-and-drop":
        bodyHtml = renderDragDropBody(q);
        break;
      case "grid-selection":
        bodyHtml = renderGridBody(q);
        break;
      case "ordering":
        bodyHtml = renderOrderingBody(q);
        break;
      default:
        bodyHtml = `<p style="color:red">Unknown question type: ${escapeHtml(q.qType)}</p>`;
    }

    screen.innerHTML = `
      <div class="card">
        <div class="qhead">
          <div>
            <h2 style="margin-bottom:0">${escapeHtml(q.title)}</h2>
            ${metaPills}
          </div>
          <div class="row">
            <span class="pill">${progress}</span>
            <span class="pill">${pts}</span>
          </div>
        </div>

        <p style="white-space:pre-wrap">${escapeHtml(q.prompt)}</p>
        ${illustrationHtml}
        ${bodyHtml}

        <div class="nav">
          <button id="backBtn" ${state.i === 0 ? "disabled" : ""}>Back</button>
          <div class="row">
            <span class="pill">Answered: ${answeredCount()} / ${ACTIVE_BANK.length}</span>
            <button class="primary" id="nextBtn">
              ${state.i === ACTIVE_BANK.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    `;

    // Back button
    document.getElementById("backBtn").addEventListener("click", () => {
      captureAnswer(q);
      state.i = clamp(state.i - 1, 0, ACTIVE_BANK.length - 1);
      renderQuestion();
    });

    // Next / Finish button
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (!captureAnswer(q)) return;

      if (state.i === ACTIVE_BANK.length - 1) {
        renderResults();
      } else {
        state.i += 1;
        renderQuestion();
      }
    });

    // Post-render setup for interactive question types
    if (q.qType === "drag-and-drop") setupDragDrop(q);
    if (q.qType === "grid-selection") setupGrid(q);
    if (q.qType === "ordering") setupOrdering(q);
  }

  // ── MCQ ──
  function renderMcqBody(q) {
    const chosen = state.answers[q.id];
    return `<div class="options">${q.options.map((opt, idx) => {
      const checked = chosen === idx ? "checked" : "";
      return `
        <label class="opt">
          <input type="radio" name="opt" value="${idx}" ${checked}/>
          <div>${escapeHtml(opt)}</div>
        </label>`;
    }).join("")}</div>`;
  }

  // ── Numerical input ──
  function renderNumericalBody(q) {
    const prev = state.answers[q.id];
    const val = prev !== undefined ? prev : "";
    return `
      <div class="numerical-input-wrap">
        <input id="numInput" class="numerical-input-field" type="number" placeholder="Type a number…" value="${val}" />
      </div>`;
  }

  // ── Drag-and-drop ──
  function renderDragDropBody(q) {
    const saved = state.answers[q.id] || {};
    // Build reverse map: targetId → draggableId
    const placed = {};
    for (const [dId, tId] of Object.entries(saved)) placed[tId] = dId;

    const targetsHtml = q.dropTargets.map(t => {
      const dId = placed[t.id];
      const dItem = dId ? q.draggableItems.find(d => d.id === dId) : null;
      return `
        <div class="drop-target" data-target="${t.id}">
          <div class="drop-label">${escapeHtml(t.text)}</div>
          <div class="drop-zone" data-target="${t.id}">
            ${dItem ? `<div class="dropped-item" data-drag="${dItem.id}">${escapeHtml(dItem.text)} <span class="drop-remove">&times;</span></div>` : '<span class="drop-placeholder">Drop here</span>'}
          </div>
        </div>`;
    }).join("");

    const usedIds = new Set(Object.keys(saved));
    const poolHtml = q.draggableItems
      .filter(d => !usedIds.has(d.id))
      .map(d => `<div class="draggable" draggable="true" data-drag="${d.id}">${escapeHtml(d.text)}</div>`)
      .join("");

    return `
      <div class="drag-and-drop-container">
        <div class="dd-targets">${targetsHtml}</div>
        <div class="dd-pool">${poolHtml}</div>
      </div>`;
  }

  function setupDragDrop(q) {
    if (!state.answers[q.id]) state.answers[q.id] = {};
    const mapping = state.answers[q.id];

    const container = screen.querySelector(".drag-and-drop-container");
    if (!container) return;

    // Drag events on pool items
    container.addEventListener("dragstart", e => {
      const drag = e.target.closest(".draggable, .dropped-item");
      if (drag) e.dataTransfer.setData("text/plain", drag.dataset.drag);
    });

    // Allow drop on zones
    container.addEventListener("dragover", e => {
      if (e.target.closest(".drop-zone")) e.preventDefault();
    });

    container.addEventListener("drop", e => {
      const zone = e.target.closest(".drop-zone");
      if (!zone) return;
      e.preventDefault();
      const dragId = e.dataTransfer.getData("text/plain");
      const targetId = zone.dataset.target;
      if (!dragId || !targetId) return;

      // If item was already placed somewhere, remove it from there
      for (const [k, v] of Object.entries(mapping)) {
        if (k === dragId) delete mapping[k];
      }
      // If target already has an item, put it back
      for (const [k, v] of Object.entries(mapping)) {
        if (v === targetId) delete mapping[k];
      }

      mapping[dragId] = targetId;
      renderQuestion();
    });

    // Click to remove a dropped item
    container.addEventListener("click", e => {
      const removeBtn = e.target.closest(".drop-remove");
      if (!removeBtn) return;
      const dropped = removeBtn.closest(".dropped-item");
      if (!dropped) return;
      const dragId = dropped.dataset.drag;
      delete mapping[dragId];
      renderQuestion();
    });
  }

  // ── Grid selection ──
  function renderGridBody(q) {
    const selected = state.answers[q.id] || [];
    const headers = q.grid[0];
    const rows = q.grid.slice(1);

    let html = '<table class="grid-table"><thead><tr>';
    for (const h of headers) {
      html += `<th>${escapeHtml(h)}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let r = 0; r < rows.length; r++) {
      html += '<tr>';
      for (let c = 0; c < rows[r].length; c++) {
        const val = rows[r][c];
        if (c === 0) {
          html += `<td class="grid-label">${escapeHtml(val)}</td>`;
        } else {
          const cellId = `${rows[r][0].toLowerCase().replace(/\s+/g, '')}-${headers[c].toLowerCase().replace(/\s+/g, '')}`;
          const isSelectable = q.selectableItems.includes(cellId);
          const isSelected = selected.includes(cellId);
          const isBooked = val === "BOOKED";
          let cls = "grid-cell";
          if (isBooked) cls += " booked";
          else if (isSelectable) cls += " selectable" + (isSelected ? " selected" : "");
          html += `<td class="${cls}" data-cell="${cellId}">${isBooked ? "🔒" : isSelected ? "✅" : "⬜"}</td>`;
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function setupGrid(q) {
    if (!state.answers[q.id]) state.answers[q.id] = [];
    const selected = state.answers[q.id];

    screen.querySelectorAll(".grid-cell.selectable").forEach(cell => {
      cell.addEventListener("click", () => {
        const cellId = cell.dataset.cell;
        const idx = selected.indexOf(cellId);
        if (idx >= 0) selected.splice(idx, 1);
        else selected.push(cellId);
        renderQuestion();
      });
    });
  }

  // ── Ordering ──
  function renderOrderingBody(q) {
    const placed = state.answers[q.id] || [];
    const usedIds = new Set(placed);

    let slotsHtml = '';
    for (let i = 0; i < q.correctOrder.length; i++) {
      const itemId = placed[i];
      const item = itemId ? q.orderItems.find(x => x.id === itemId) : null;
      slotsHtml += `
        <div class="order-slot ${item ? 'filled' : ''}" data-slot="${i}">
          <span class="slot-num">${i + 1}.</span>
          <span class="slot-text">${item ? escapeHtml(item.text) : ''}</span>
          ${item ? '<button class="slot-remove" data-slot="' + i + '">&times;</button>' : ''}
        </div>`;
    }

    const poolHtml = q.orderItems
      .filter(x => !usedIds.has(x.id))
      .map(x => `<button class="order-btn" data-item="${x.id}">${escapeHtml(x.text)}</button>`)
      .join("");

    return `
      <div class="ordering-container">
        <p class="ordering-label">Your order:</p>
        <div class="order-slots">${slotsHtml}</div>
        <div class="order-pool">${poolHtml}</div>
      </div>`;
  }

  function setupOrdering(q) {
    if (!state.answers[q.id]) state.answers[q.id] = [];
    const placed = state.answers[q.id];

    // Click pool button → fill next empty slot
    screen.querySelectorAll(".order-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const itemId = btn.dataset.item;
        // Find next empty slot
        let slotIdx = -1;
        for (let i = 0; i < q.correctOrder.length; i++) {
          if (!placed[i]) { slotIdx = i; break; }
        }
        if (slotIdx < 0) return;
        placed[slotIdx] = itemId;
        renderQuestion();
      });
    });

    // Click remove → free that slot
    screen.querySelectorAll(".slot-remove").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const idx = Number(btn.dataset.slot);
        placed[idx] = undefined;
        // Compact: shift later items up
        for (let i = idx; i < placed.length - 1; i++) {
          placed[i] = placed[i + 1];
        }
        placed[placed.length - 1] = undefined;
        renderQuestion();
      });
    });
  }

  // ───────── Capture answer (returns false if question not answered) ─────────

  function captureAnswer(q) {
    switch (q.qType) {
      case "mcq": {
        const sel = screen.querySelector('input[name="opt"]:checked');
        if (!sel) { alert("Pick an answer before continuing."); return false; }
        state.answers[q.id] = Number(sel.value);
        return true;
      }
      case "numerical-input": {
        const inp = document.getElementById("numInput");
        if (!inp || inp.value.trim() === "") { alert("Enter a number before continuing."); return false; }
        state.answers[q.id] = Number(inp.value);
        return true;
      }
      case "drag-and-drop": {
        const mapping = state.answers[q.id] || {};
        if (Object.keys(mapping).length < q.draggableItems.length) {
          alert("Place all items before continuing.");
          return false;
        }
        return true;
      }
      case "grid-selection": {
        const sel = state.answers[q.id] || [];
        if (sel.length === 0) { alert("Select at least one cell before continuing."); return false; }
        return true;
      }
      case "ordering": {
        const placed = state.answers[q.id] || [];
        const filledCount = placed.filter(Boolean).length;
        if (filledCount < q.correctOrder.length) {
          alert("Place all steps in order before continuing.");
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  }

  // ───────── Scoring ─────────

  function scoreQuestion(q) {
    const ans = state.answers[q.id];
    switch (q.qType) {
      case "mcq":
        return ans === q.answerIndex ? q.points : 0;
      case "numerical-input":
        return ans === q.expectedAnswer ? q.points : 0;
      case "drag-and-drop": {
        if (!ans) return 0;
        const correct = q.correctMappings;
        const allCorrect = Object.entries(correct).every(([d, t]) => ans[d] === t);
        return allCorrect ? q.points : 0;
      }
      case "grid-selection": {
        if (!ans) return 0;
        const cSet = new Set(q.correctAnswers);
        const aSet = new Set(ans);
        if (cSet.size !== aSet.size) return 0;
        for (const c of cSet) { if (!aSet.has(c)) return 0; }
        return q.points;
      }
      case "ordering": {
        if (!ans) return 0;
        const allMatch = q.correctOrder.every((id, i) => ans[i] === id);
        return allMatch ? q.points : 0;
      }
      default:
        return 0;
    }
  }

  function scoreQuiz() {
    let score = 0;
    const perQ = [];

    for (const q of ACTIVE_BANK) {
      const earned = scoreQuestion(q);
      score += earned;

      perQ.push({
        id: q.id,
        title: q.title,
        topic: q.topic,
        qType: q.qType,
        answer: state.answers[q.id],
        earned,
        max: q.points
      });
    }

    return { score, perQ, max: totalPoints() };
  }

  // ───────── Results ─────────

  function renderResults() {
    const { score, perQ, max } = scoreQuiz();
    const mins = state.startedAt
      ? Math.max(1, Math.round((Date.now() - state.startedAt) / 60000))
      : null;

    const payload = {
      name: state.name,
      group: state.group,
      timeMin: mins,
      score,
      max,
      answers: perQ.map(x => ({
        id: x.id,
        qType: x.qType,
        answer: x.answer,
        earned: x.earned,
        max: x.max
      }))
    };

    const code = b64EncodeUnicode(JSON.stringify(payload));

    const pct = max > 0 ? Math.round((score / max) * 100) : 0;

    const rows = perQ
      .map(x => {
        const isGood = x.earned === x.max;
        return `
          <div class="result-row">
            <div>
              <strong>${escapeHtml(x.id)}</strong> ${escapeHtml(x.title)}
              <div style="color:#555;font-size:13px;margin-top:2px">${escapeHtml(x.topic)} · ${escapeHtml(x.qType)}</div>
            </div>
            <div>${isGood ? `<span class="good">${x.earned}/${x.max}</span>` : `<span class="bad">${x.earned}/${x.max}</span>`}</div>
          </div>`;
      })
      .join("");

    screen.innerHTML = `
      <div class="card">
        <h2>Results</h2>
        <p><strong>${escapeHtml(state.name)}</strong> (${escapeHtml(state.group)})</p>
        <p>Score: <strong>${score} / ${max}</strong> (${pct}%)${mins ? ` · about ${mins} min` : ""}</p>

        <hr />
        <h3>Per question</h3>
        <div>${rows}</div>

        <hr />
        <h3>Result Code</h3>
        <p>Copy this code and submit it. Also take a screenshot of this page if your teacher asked.</p>
        <div class="codebox" id="codeBox">${code}</div>

        <div class="nav">
          <button id="restartBtn">Restart</button>
          <button class="primary" id="copyBtn">Copy code</button>
        </div>
      </div>
    `;

    document.getElementById("copyBtn").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code);
        alert("Copied!");
      } catch {
        alert("Could not auto-copy. Please select and copy manually.");
      }
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
      state.i = 0;
      state.answers = {};
      state.startedAt = null;
      ACTIVE_BANK = window.QUESTION_BANK.slice().sort((a, b) => a.points - b.points);
      renderStart();
    });
  }

  renderStart();
})();
