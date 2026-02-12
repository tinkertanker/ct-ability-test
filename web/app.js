(function () {
  const screen = document.getElementById("screen");

  // ACTIVE_BANK is the set of questions used for this run (based on level choice)
  let ACTIVE_BANK = window.QUESTION_BANK;

  const state = {
    name: "",
    group: "",
    chosenLevel: "ALL",
    i: 0,
    answers: {}, // { questionId: chosenIndex, ... }
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

  function renderStart() {
    screen.innerHTML = `
      <div class="card">
        <h2>Start</h2>
        <p>Enter your details, then answer all questions.</p>

        <label>Name</label>
        <input id="name" type="text" placeholder="e.g. Joe Tan" autocomplete="off" />

        <label>Class / Group</label>
        <input id="group" type="text" placeholder="e.g. P6-3 / S1-2" autocomplete="off" />

        <label>Level</label>
        <select id="level" style="width:100%;padding:10px 12px;border:1px solid #d7d7e2;border-radius:10px;font-size:16px">
          <option value="ALL">All levels</option>
          <option value="P5">P5</option>
          <option value="P6">P6</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
        </select>

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
    const levelEl = document.getElementById("level");
    const btn = document.getElementById("startBtn");

    btn.addEventListener("click", () => {
      const name = nameEl.value.trim();
      const group = groupEl.value.trim();
      const chosenLevel = levelEl.value;

      if (!name || !group) {
        alert("Please fill in your name and class/group.");
        return;
      }

      // Set state
      state.name = name;
      state.group = group;
      state.chosenLevel = chosenLevel;
      state.startedAt = Date.now();
      state.i = 0;
      state.answers = {};

      // Set ACTIVE_BANK based on chosen level
      ACTIVE_BANK =
        chosenLevel === "ALL"
          ? window.QUESTION_BANK
          : window.QUESTION_BANK.filter(q => q.level === chosenLevel);

      if (!ACTIVE_BANK.length) {
        alert("No questions found for that level.");
        return;
      }

      renderQuestion();
    });
  }

  function renderQuestion() {
    const q = ACTIVE_BANK[state.i];
    const chosen = state.answers[q.id];

    const progress = `${state.i + 1} / ${ACTIVE_BANK.length}`;
    const pts = `${q.points} pts`;

    const metaPills = `
      <div class="row" style="margin-top:6px">
        ${q.level ? `<span class="pill">${escapeHtml(q.level)}</span>` : ""}
        ${q.topic ? `<span class="pill">${escapeHtml(q.topic)}</span>` : ""}
        ${q.qType ? `<span class="pill">${escapeHtml(q.qType)}</span>` : ""}
      </div>
    `;

    const detailsLine = q.details
      ? `<p style="margin:10px 0 0;color:#444"><strong>Details:</strong> ${escapeHtml(q.details)}</p>`
      : "";

    const art = q.art ? `<pre>${escapeHtml(q.art)}</pre>` : "";

    const optionsHtml = q.options
      .map((opt, idx) => {
        const checked = chosen === idx ? "checked" : "";
        return `
          <label class="opt">
            <input type="radio" name="opt" value="${idx}" ${checked}/>
            <div>${escapeHtml(opt)}</div>
          </label>
        `;
      })
      .join("");

    screen.innerHTML = `
      <div class="card">
        <div class="qhead">
          <div>
            <h2 style="margin-bottom:0">${escapeHtml(q.title)}</h2>
            ${metaPills}
            ${detailsLine}
          </div>
          <div class="row">
            <span class="pill">${progress}</span>
            <span class="pill">${pts}</span>
          </div>
        </div>

        <p style="white-space:pre-wrap">${escapeHtml(q.prompt)}</p>
        ${art}

        <div class="options">${optionsHtml}</div>

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

    document.getElementById("backBtn").addEventListener("click", () => {
      state.i = clamp(state.i - 1, 0, ACTIVE_BANK.length - 1);
      renderQuestion();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      const selected = screen.querySelector('input[name="opt"]:checked');
      if (!selected) {
        alert("Pick an answer before continuing.");
        return;
      }

      state.answers[q.id] = Number(selected.value);

      if (state.i === ACTIVE_BANK.length - 1) {
        renderResults();
      } else {
        state.i += 1;
        renderQuestion();
      }
    });
  }

  function scoreQuiz() {
    let score = 0;
    const perQ = [];

    for (const q of ACTIVE_BANK) {
      const chosen = state.answers[q.id];
      const correct = chosen === q.answerIndex;
      const earned = correct ? q.points : 0;
      score += earned;

      perQ.push({
        id: q.id,
        title: q.title,
        level: q.level,
        topic: q.topic,
        qType: q.qType,
        chosen,
        correctIndex: q.answerIndex,
        earned,
        max: q.points
      });
    }

    return { score, perQ, max: totalPoints() };
  }

  function renderResults() {
    const { score, perQ, max } = scoreQuiz();
    const mins = state.startedAt
      ? Math.max(1, Math.round((Date.now() - state.startedAt) / 60000))
      : null;

    const payload = {
      name: state.name,
      group: state.group,
      chosenLevel: state.chosenLevel,
      timeMin: mins,
      score,
      max,
      answers: perQ.map(x => ({
        id: x.id,
        chosen: x.chosen,
        earned: x.earned,
        max: x.max
      }))
    };

    const code = b64EncodeUnicode(JSON.stringify(payload));

    const rows = perQ
      .map(x => {
        const isGood = x.earned === x.max;
        const meta = [x.level, x.topic, x.qType].filter(Boolean).join(" • ");
        return `
          <div class="row" style="justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f1f6">
            <div>
              <strong>${escapeHtml(x.id)}</strong> ${escapeHtml(x.title)}
              ${meta ? `<div style="color:#555;font-size:13px;margin-top:2px">${escapeHtml(meta)}</div>` : ""}
            </div>
            <div>${isGood ? `<span class="good">${x.earned}/${x.max}</span>` : `<span class="bad">${x.earned}/${x.max}</span>`}</div>
          </div>
        `;
      })
      .join("");

    screen.innerHTML = `
      <div class="card">
        <h2>Results</h2>
        <p><strong>${escapeHtml(state.name)}</strong> (${escapeHtml(state.group)})</p>
        <p>Level: <strong>${escapeHtml(state.chosenLevel)}</strong></p>
        <p>Score: <strong>${score} / ${max}</strong>${mins ? ` (about ${mins} min)` : ""}</p>

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
        alert("Copied.");
      } catch {
        alert("Could not auto-copy. Please select and copy manually.");
      }
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
      state.i = 0;
      state.answers = {};
      state.startedAt = null;
      state.chosenLevel = "ALL";
      ACTIVE_BANK = window.QUESTION_BANK;
      renderStart();
    });
  }

  renderStart();
})();
