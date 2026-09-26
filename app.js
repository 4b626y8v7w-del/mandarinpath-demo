
function mpAsset(name) {
  const key = name.endsWith(".png") ? name : name + ".png";
  return (window.MP_ASSETS && window.MP_ASSETS[key]) || ("assets/" + key);
}
/* MandarinPath — 5-min interactive web demo trial */
(function () {
  "use strict";

  const UNITS = [
    { id: "u1", title: "Greetings", titleZh: "问候", titlePinyin: "wènhòu", color: "#26B8B3", icon: "👋",
      lessons: [
        { id: "l1", title: "Hello", titleZh: "你好", xp: 25 },
        { id: "l2", title: "Polite extras", titleZh: "客气一点", xp: 25 },
        { id: "l3", title: "My name is…", titleZh: "我叫…", xp: 25 },
        { id: "l4", title: "Mini meetup", titleZh: "见面", xp: 30 },
      ]},
    { id: "u2", title: "Numbers", titleZh: "数字", titlePinyin: "shùzì", color: "#22C55E", icon: "🔢",
      lessons: [
        { id: "l5", title: "1 to 5", titleZh: "一到五", xp: 25 },
        { id: "l6", title: "6 to 10", titleZh: "六到十", xp: 25 },
        { id: "l7", title: "How many?", titleZh: "多少", xp: 25 },
        { id: "l8", title: "Phone digits", titleZh: "电话号码", xp: 30 },
      ]},
    { id: "u3", title: "Food", titleZh: "食物", titlePinyin: "shíwù", color: "#FF8C33", icon: "🍜",
      lessons: [
        { id: "l9", title: "Drinks", titleZh: "饮料", xp: 25 },
        { id: "l10", title: "I want…", titleZh: "我要…", xp: 25 },
        { id: "l11", title: "Ordering", titleZh: "点菜", xp: 25 },
        { id: "l12", title: "After a long day", titleZh: "累了吃饭", xp: 30 },
      ]},
    { id: "u4", title: "Family", titleZh: "家人", titlePinyin: "jiārén", color: "#9E6BF2", icon: "👨‍👩‍👧",
      lessons: [
        { id: "l13", title: "Parents", titleZh: "爸爸妈妈", xp: 25 },
        { id: "l14", title: "Siblings", titleZh: "哥哥姐姐", xp: 25 },
        { id: "l15", title: "Who is this?", titleZh: "这是谁", xp: 30 },
      ]},
    { id: "u5", title: "Places & Getting Around", titleZh: "地方和出行", titlePinyin: "dìfang hé chūxíng", color: "#26B8B3", icon: "🗺️",
      lessons: [
        { id: "l16", title: "Where is it?", titleZh: "在哪儿", xp: 25 },
        { id: "l17", title: "Left and right", titleZh: "左右", xp: 25 },
        { id: "l18", title: "Station and taxi", titleZh: "车站和出租车", xp: 25 },
        { id: "l19", title: "Ask for a place", titleZh: "问地方", xp: 30 },
      ]},
    { id: "u6", title: "Time & Days", titleZh: "时间和日子", titlePinyin: "shíjiān hé rìzi", color: "#22C55E", icon: "⏰",
      lessons: [
        { id: "l20", title: "Today and tomorrow", titleZh: "今天明天", xp: 25 },
        { id: "l21", title: "Weekdays lite", titleZh: "星期", xp: 25 },
        { id: "l22", title: "What time?", titleZh: "几点", xp: 25 },
        { id: "l23", title: "Make a simple plan", titleZh: "简单计划", xp: 30 },
      ]},
    { id: "u7", title: "Shopping", titleZh: "购物", titlePinyin: "gòuwù", color: "#FF8C33", icon: "🛍️",
      lessons: [
        { id: "l24", title: "I want to buy", titleZh: "我要买", xp: 25 },
        { id: "l25", title: "Expensive or cheap?", titleZh: "贵还是便宜", xp: 25 },
        { id: "l26", title: "Size and color lite", titleZh: "大小和颜色", xp: 25 },
        { id: "l27", title: "At the counter", titleZh: "在柜台", xp: 30 },
      ]},
    { id: "u8", title: "Travel Day", titleZh: "出行日", titlePinyin: "chūxíng rì", color: "#9E6BF2", icon: "✈️",
      lessons: [
        { id: "l28", title: "Airport basics", titleZh: "机场基础", xp: 25 },
        { id: "l29", title: "Hotel check-in", titleZh: "酒店入住", xp: 25 },
        { id: "l30", title: "Bathroom and help", titleZh: "洗手间和帮忙", xp: 25 },
        { id: "l31", title: "Travel day phrases", titleZh: "出行日用语", xp: 30 },
      ]},
  ];

  /* Short demo lesson — Hello (real curriculum flavor) */
  const HELLO_LESSON = {
    id: "l1",
    title: "Hello",
    titleZh: "你好",
    xp: 25,
    exercises: [
      {
        type: "mc",
        direction: "zh_to_en",
        prompt: "你好",
        pinyin: "nǐ hǎo",
        options: ["hi / hello", "thank you", "goodbye", "I'm fine"],
        answer: "hi / hello",
      },
      {
        type: "mc",
        direction: "en_to_zh",
        prompt: "thank you",
        options: ["谢谢", "再见", "你好", "我很好"],
        answer: "谢谢",
      },
      {
        type: "listen",
        prompt: "再见",
        pinyin: "zàijiàn",
        options: ["goodbye", "hello", "how are you?", "thank you"],
        answer: "goodbye",
      },
      {
        type: "tiles",
        promptEn: "Say: hello",
        tiles: ["你", "好"],
        distractors: ["谢", "再"],
        answer: "你好",
      },
    ],
  };

  const REVIEW_CARDS = [
    { prompt: "你好", pinyin: "nǐ hǎo", options: ["hi / hello", "goodbye", "thanks", "sorry"], answer: "hi / hello" },
    { prompt: "谢谢", pinyin: "xièxie", options: ["thank you", "hello", "please", "goodbye"], answer: "thank you" },
    { prompt: "再见", pinyin: "zàijiàn", options: ["goodbye", "hello", "yes", "no"], answer: "goodbye" },
  ];

  const FLIP_PAIRS = [
    { id: "a", zh: "你好", en: "hello" },
    { id: "b", zh: "谢谢", en: "thanks" },
    { id: "c", zh: "再见", en: "goodbye" },
    { id: "d", zh: "我", en: "I / me" },
  ];

  /* Trial milestones (~5 min engagement loop) */
  const TRIAL = {
    SPLASH: 0,
    LEARN: 1,
    LESSON: 2,
    CLAIM: 3,
    PRACTICE: 4,
    FLIP: 5,
    FINALE: 6,
  };
  const TRIAL_LABELS = [
    "Ready",
    "Open the path",
    "Clear Hello",
    "Claim XP",
    "Practice time",
    "Flip Match",
    "Trial clear!",
  ];
  const TRIAL_PCT = [0, 12, 35, 55, 70, 88, 100];

  const state = {
    trialStep: TRIAL.SPLASH,
    xp: 0,
    streak: 0,
    hearts: 5,
    maxHearts: 5,
    completed: new Set(),
    dueCount: 0,
    tab: "learn",
    lessonIdx: 0,
    lessonLocked: false,
    pendingXP: 0,
    flipDone: false,
    reviewDone: false,
    guided: true,
  };

  /* ---------- Audio (Web Audio soft SFX) ---------- */
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  function tone(freq, dur, type, gain) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.value = gain || 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(gain || 0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.start(now);
    o.stop(now + dur + 0.02);
  }
  function sfxCorrect() {
    tone(523, 0.08, "sine", 0.07);
    setTimeout(() => tone(659, 0.1, "sine", 0.07), 70);
    setTimeout(() => tone(784, 0.14, "triangle", 0.06), 140);
  }
  function sfxWrong() {
    tone(180, 0.18, "triangle", 0.06);
  }
  function sfxComplete() {
    [392, 523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.2, "sine", 0.07), i * 90));
  }
  function sfxClaim() {
    tone(880, 0.08, "sine", 0.06);
    setTimeout(() => tone(1175, 0.16, "triangle", 0.07), 60);
  }
  function sfxMatch() {
    tone(660, 0.08, "sine", 0.06);
    setTimeout(() => tone(990, 0.12, "sine", 0.06), 50);
  }

  /* ---------- Speech (zh-CN) ---------- */
  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.92;
    const voices = speechSynthesis.getVoices();
    const zh = voices.find((v) => /zh[-_]?CN|Chinese/i.test(v.lang + v.name));
    if (zh) u.voice = zh;
    const btn = document.querySelector(".speaker-btn");
    if (btn) btn.classList.add("speaking");
    u.onend = () => btn && btn.classList.remove("speaking");
    speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function showScreen(id) {
    ["screenSplash", "screenMain", "screenLesson", "screenComplete", "screenFlip", "screenReview", "screenWrite", "screenFinale"]
      .forEach((s) => {
        const el = document.getElementById(s);
        if (el) el.hidden = s !== id;
      });
  }

  function setTrialStep(step) {
    state.trialStep = step;
    const strip = $("#trialStrip");
    if (step === TRIAL.SPLASH) {
      strip.hidden = true;
      return;
    }
    strip.hidden = false;
    $("#trialStepLabel").textContent = TRIAL_LABELS[step] || "";
    const pct = TRIAL_PCT[step] || 0;
    $("#trialMeterFill").style.width = pct + "%";
    $("#trialMeter").setAttribute("aria-valuenow", pct);
  }

  function toast(msg, dragon) {
    const el = $("#toast");
    el.hidden = false;
    el.innerHTML = (dragon ? `<img src="${mpAsset(dragon)}" alt="" />` : "") + `<span>${msg}</span>`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2200);
  }

  function xpFloat(amount) {
    const el = $("#xpFloat");
    el.textContent = `+${amount} XP`;
    el.hidden = false;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
    clearTimeout(xpFloat._t);
    xpFloat._t = setTimeout(() => { el.hidden = true; }, 900);
  }

  function sparkleBurst() {
    const box = $("#sparkles");
    if (!box) return;
    box.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = "✨";
      s.style.left = 10 + Math.random() * 80 + "%";
      s.style.bottom = Math.random() * 30 + "%";
      s.style.animationDelay = Math.random() * 0.3 + "s";
      box.appendChild(s);
    }
  }

  /* ---------- Progress / path state ---------- */
  function lessonState(id) {
    if (state.completed.has(id)) return "completed";
    const all = UNITS.flatMap((u) => u.lessons);
    const idx = all.findIndex((l) => l.id === id);
    if (idx === 0) return "unlocked";
    const prev = all[idx - 1];
    if (prev && state.completed.has(prev.id)) return "unlocked";
    /* demo: unlock first two of unit 1 after hello for juice */
    if (id === "l2" && state.completed.has("l1")) return "unlocked";
    return "locked";
  }

  function currentLessonId() {
    for (const u of UNITS) {
      for (const l of u.lessons) {
        if (lessonState(l.id) === "unlocked") return l.id;
      }
    }
    return null;
  }

  function renderStats() {
    const bar = $("#statsBar");
    if (!bar) return;
    bar.innerHTML = `
      <div class="stat-chip"><span class="ico" style="color:#FF5722">🔥</span>${state.streak} <span class="lab">Streak</span></div>
      <div class="stat-chip"><span class="ico" style="color:#FBBF24">⭐</span>${state.xp} <span class="lab">XP</span></div>
      <div class="stat-chip"><span class="ico" style="color:#F24D59">♥</span>${state.hearts} <span class="lab">Hearts</span></div>
    `;
    const badge = $("#dueBadge");
    if (state.dueCount > 0) {
      badge.hidden = false;
      badge.textContent = String(state.dueCount);
    } else {
      badge.hidden = true;
    }
  }

  function renderPath() {
    const root = $("#learnPath");
    const cur = currentLessonId();
    let html = "";
    UNITS.forEach((unit, ui) => {
      const done = unit.lessons.filter((l) => state.completed.has(l.id)).length;
      const total = unit.lessons.length;
      html += `
        <div class="chapter-card">
          <div class="chapter-icon" style="background:linear-gradient(135deg,${unit.color},${unit.color}cc)">${unit.icon}</div>
          <div class="chapter-meta">
            <div class="chapter-label" style="color:${unit.color}">CHAPTER ${ui + 1}</div>
            <div class="chapter-title">${unit.title}</div>
            <div class="chapter-sub">${unit.titleZh} · ${unit.titlePinyin}</div>
          </div>
          <div class="chapter-prog">${done}/${total}</div>
        </div>
      `;
      unit.lessons.forEach((lesson, li) => {
        const st = lessonState(lesson.id);
        const isCur = lesson.id === cur;
        const offset = li % 2 === 0 ? -36 : 36;
        const icon = st === "completed" ? "✓" : st === "locked" ? "🔒" : "★";
        html += `
          <div class="node-row" style="transform:translateX(${offset}px)">
            <button type="button" class="node-btn ${st}${isCur ? " current" : ""}" data-lesson="${lesson.id}" data-state="${st}" aria-label="${lesson.title}">
              ${icon}
              ${isCur ? '<span class="node-sparkle">✨</span>' : ""}
            </button>
            <div class="node-label">${lesson.title}<span class="zh">${lesson.titleZh}</span></div>
            ${li < unit.lessons.length - 1 ? '<div class="path-connector"></div>' : ""}
          </div>
        `;
      });
      if (done === total && total > 0) {
        html += `
          <div class="chapter-clear">
            <img src="${mpAsset('dragon-celebrate.png')}" alt="" />
            <div><strong>Chapter clear</strong><span>Nice path work — keep going.</span></div>
          </div>
        `;
      }
      /* Only render first 2 units fully for scroll length; rest as locked chapter teasers after u2 */
      if (ui === 1 && !state.completed.has("l5")) {
        /* continue all units — path is the product feel */
      }
    });
    root.innerHTML = html;

    $$(".node-btn", root).forEach((btn) => {
      btn.addEventListener("click", () => {
        const st = btn.dataset.state;
        const id = btn.dataset.lesson;
        if (st === "locked") {
          toast("Complete earlier lessons first", "dragon-encourage");
          return;
        }
        if (id === "l1" || (st === "unlocked" && id === "l1") || (st === "completed" && id === "l1")) {
          startLesson();
        } else if (st === "unlocked" || st === "completed") {
          toast("Full saga unlocks on iPhone — try Hello + Flip Match here", "dragon-idle");
        }
      });
    });

    const coach = $("#learnCoach");
    if (state.guided && state.trialStep === TRIAL.LEARN && !state.completed.has("l1")) {
      coach.hidden = false;
      coach.innerHTML = `<img src="${mpAsset('dragon-idle.png')}" alt="" /><div>Tap the glowing <strong>Hello</strong> node — clear one short lesson for XP.</div>`;
    } else if (state.guided && state.trialStep === TRIAL.PRACTICE) {
      coach.hidden = false;
      coach.innerHTML = `<img src="${mpAsset('dragon-celebrate.png')}" alt="" /><div>Lesson loot claimed! Open <strong>Practice</strong> → Flip Match.</div>`;
    } else {
      coach.hidden = true;
    }
  }

  function renderProfile() {
    const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
    $("#profileStats").innerHTML = `
      <div class="section-label">Stats</div>
      <div class="stat-row"><span style="color:#FF5722">🔥</span> Day streak <span class="val">${state.streak}</span></div>
      <div class="stat-row"><span style="color:#FBBF24">⭐</span> Total XP <span class="val">${state.xp}</span></div>
      <div class="stat-row"><span style="color:#22C55E">✓</span> Lessons completed <span class="val">${state.completed.size}</span></div>
      <div class="stat-row"><span style="color:#F24D59">♥</span> Hearts <span class="val">${state.hearts}/${state.maxHearts}</span></div>
      <div class="stat-row"><span style="color:#26B8B3">🗺</span> Path progress <span class="val">${state.completed.size}/${total}</span></div>
    `;
    let uh = `<div class="section-label">Units</div>`;
    UNITS.forEach((u) => {
      const done = u.lessons.filter((l) => state.completed.has(l.id)).length;
      const pct = (done / u.lessons.length) * 100;
      uh += `
        <div class="unit-row">
          <span>${u.icon}</span>
          <div><strong style="font-size:0.88rem">${u.title}</strong><br/><span style="font-size:0.72rem;color:var(--muted)">${done}/${u.lessons.length} lessons</span></div>
          <div class="bar"><i style="width:${pct}%;background:${u.color}"></i></div>
        </div>
      `;
    });
    $("#profileUnits").innerHTML = uh;
  }

  function renderPracticeHub() {
    const due = state.dueCount;
    const canReview = due > 0 || state.completed.has("l1");
    const cards = $("#modeCards");
    cards.innerHTML = `
      <button type="button" class="mode-card primary-mode" id="modeReview" ${canReview && due > 0 ? "" : "disabled"}>
        <div class="mode-ico green">🔄</div>
        <div class="mode-text">
          <strong>Review</strong>
          <span>${due > 0 ? due + " due · ~2 min" : "Caught up 🎉"}</span>
        </div>
        ${due > 0 ? '<span class="mode-start">Start</span>' : ""}
      </button>
      <button type="button" class="mode-card teal-mode" id="modeWrite" ${state.completed.has("l1") ? "" : "disabled"}>
        <div class="mode-ico teal">✏️</div>
        <div class="mode-text">
          <strong>Write</strong>
          <span>${state.completed.has("l1") ? "Trace quest" : "Finish Hello first"}</span>
        </div>
        ${state.completed.has("l1") ? '<span class="mode-start teal">Start</span>' : ""}
      </button>
      <button type="button" class="mode-card gold-mode" id="modeFlip" ${state.completed.has("l1") ? "" : "disabled"}>
        <div class="mode-ico gold">🃏</div>
        <div class="mode-text">
          <strong>Flip Match</strong>
          <span>Mini-game · match pairs</span>
        </div>
        ${state.completed.has("l1") ? '<span class="mode-start gold">Start</span>' : ""}
      </button>
      ${due === 0 && state.completed.has("l1") ? `
        <div class="caught-up">
          <img src="${mpAsset('dragon-celebrate.png')}" alt="" />
          <div>You’re caught up. Write or Flip Match anytime.</div>
        </div>` : ""}
    `;
    const coach = $("#practiceCoach");
    if (state.guided && state.trialStep === TRIAL.PRACTICE && !state.flipDone) {
      coach.hidden = false;
      coach.innerHTML = `<img src="${mpAsset('dragon-idle.png')}" alt="" /><div>Hit <strong>Flip Match</strong> — clear the board for bonus XP.</div>`;
    } else {
      coach.hidden = true;
    }
    $("#modeReview")?.addEventListener("click", () => { if (due > 0) startReview(); });
    $("#modeWrite")?.addEventListener("click", () => { if (state.completed.has("l1")) startWrite(); });
    $("#modeFlip")?.addEventListener("click", () => { if (state.completed.has("l1")) startFlip(); });
  }

  function switchTab(name) {
    state.tab = name;
    $$(".tab").forEach((t) => {
      const on = t.dataset.goto === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-current", on ? "page" : "false");
    });
    $$(".tab-panel").forEach((p) => {
      p.hidden = p.dataset.tab !== name;
    });
    if (name === "learn") renderPath();
    if (name === "practice") renderPracticeHub();
    if (name === "profile") renderProfile();
    renderStats();
  }

  /* ---------- Lesson flow ---------- */
  function startLesson() {
    if (state.hearts <= 0) {
      state.hearts = state.maxHearts;
      toast("Hearts restored for the demo");
    }
    state.lessonIdx = 0;
    state.lessonLocked = false;
    setTrialStep(TRIAL.LESSON);
    showScreen("screenLesson");
    renderLessonExercise();
  }

  function renderLessonExercise() {
    const ex = HELLO_LESSON.exercises[state.lessonIdx];
    const total = HELLO_LESSON.exercises.length;
    $("#lessonProgressFill").style.width = (state.lessonIdx / total) * 100 + "%";
    $("#lessonHearts b").textContent = state.hearts;
    $("#feedbackBanner").hidden = true;
    state.lessonLocked = false;

    const body = $("#lessonBody");
    if (!ex) return;

    if (ex.type === "mc" || ex.type === "listen") {
      const isListen = ex.type === "listen" || ex.direction === "zh_to_en";
      const dir =
        ex.type === "listen"
          ? "Listen — what does this mean?"
          : ex.direction === "zh_to_en"
          ? "What does this mean?"
          : "How do you say this in Chinese?";
      const showSpeaker = ex.type === "listen" || ex.direction === "zh_to_en";
      const promptHtml =
        ex.direction === "en_to_zh"
          ? `<div class="prompt-en">${ex.prompt}</div>`
          : `<div><div class="prompt-zh">${ex.prompt}</div>${
              ex.pinyin ? `<div class="prompt-py">${ex.pinyin}</div>` : ""
            }</div>`;

      body.innerHTML = `
        <div class="dir-label">${dir}</div>
        <div class="prompt-row">
          ${promptHtml}
          ${showSpeaker ? `<button type="button" class="speaker-btn" id="btnSpeak" aria-label="Play audio">🔊</button>` : ""}
        </div>
        <div class="opt-list">
          ${ex.options
            .map((o, i) => `<button type="button" class="opt-btn" data-opt="${i}">${o}</button>`)
            .join("")}
        </div>
      `;
      if (showSpeaker) {
        $("#btnSpeak").addEventListener("click", () => speak(ex.prompt));
        if (ex.type === "listen") setTimeout(() => speak(ex.prompt), 300);
      }
      $$(".opt-btn", body).forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.lessonLocked) return;
          state.lessonLocked = true;
          const choice = ex.options[+btn.dataset.opt];
          const ok = choice === ex.answer;
          $$(".opt-btn", body).forEach((b) => {
            b.disabled = true;
            if (ex.options[+b.dataset.opt] === ex.answer) b.classList.add("correct");
          });
          if (!ok) btn.classList.add("wrong");
          onExerciseResult(ok);
        });
      });
    } else if (ex.type === "tiles") {
      const bank = shuffle([...ex.tiles, ...ex.distractors]);
      const picked = [];
      body.innerHTML = `
        <div class="dir-label">${ex.promptEn}</div>
        <div class="tile-answer" id="tileAnswer"><span style="color:var(--muted);font-size:0.85rem">Tap tiles…</span></div>
        <div class="tile-bank" id="tileBank">
          ${bank.map((t, i) => `<button type="button" class="tile" data-i="${i}" data-t="${t}">${t}</button>`).join("")}
        </div>
        <button type="button" class="btn btn-primary tile-check" id="btnCheckTiles" disabled>Check</button>
      `;
      const answerEl = $("#tileAnswer");
      const checkBtn = $("#btnCheckTiles");
      function refreshAnswer() {
        answerEl.innerHTML = picked.length
          ? picked.map((p) => `<span class="tile">${p.t}</span>`).join("")
          : `<span style="color:var(--muted);font-size:0.85rem">Tap tiles…</span>`;
        checkBtn.disabled = picked.length === 0;
      }
      $$(".tile", $("#tileBank")).forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.lessonLocked || btn.classList.contains("used")) return;
          btn.classList.add("used");
          picked.push({ t: btn.dataset.t, btn });
          refreshAnswer();
        });
      });
      answerEl.addEventListener("click", () => {
        if (state.lessonLocked || !picked.length) return;
        const last = picked.pop();
        last.btn.classList.remove("used");
        refreshAnswer();
      });
      checkBtn.addEventListener("click", () => {
        if (state.lessonLocked) return;
        state.lessonLocked = true;
        const built = picked.map((p) => p.t).join("");
        const ok = built === ex.answer;
        onExerciseResult(ok);
      });
    }
  }

  function onExerciseResult(ok) {
    if (ok) {
      sfxCorrect();
      showFeedback(true, "Nice!");
    } else {
      sfxWrong();
      state.hearts = Math.max(0, state.hearts - 1);
      $("#lessonHearts b").textContent = state.hearts;
      showFeedback(false, "Not quite");
      if (state.hearts <= 0) {
        state.hearts = state.maxHearts;
        toast("Demo hearts refilled — keep going");
      }
    }
  }

  function showFeedback(ok, text) {
    const banner = $("#feedbackBanner");
    banner.hidden = false;
    banner.className = "feedback-banner " + (ok ? "ok" : "bad");
    banner.innerHTML = `<span>${ok ? "✓" : "✗"} ${text}</span><button type="button" id="btnContinue">Continue</button>`;
    $("#btnContinue").addEventListener("click", advanceLesson);
  }

  function advanceLesson() {
    state.lessonIdx++;
    if (state.lessonIdx >= HELLO_LESSON.exercises.length) {
      finishLesson();
    } else {
      renderLessonExercise();
    }
  }

  function finishLesson() {
    state.pendingXP = HELLO_LESSON.xp;
    state.completed.add("l1");
    state.dueCount = 3;
    if (state.streak < 1) state.streak = 1;
    $("#lessonProgressFill").style.width = "100%";
    setTrialStep(TRIAL.CLAIM);
    showScreen("screenComplete");
    $("#completeXP").textContent = `+${state.pendingXP} XP`;
    $("#completeStreak").innerHTML = `<span>🔥</span> ${state.streak}-day streak`;
    $("#btnToPractice").hidden = true;
    sparkleBurst();
    sfxComplete();
  }

  function claimXP() {
    sfxClaim();
    state.xp += state.pendingXP;
    xpFloat(state.pendingXP);
    state.pendingXP = 0;
    setTrialStep(TRIAL.PRACTICE);
    showScreen("screenMain");
    switchTab("practice");
    toast("XP claimed — Practice awaits", "dragon-celebrate");
  }

  /* ---------- Review ---------- */
  let reviewIdx = 0;
  function startReview() {
    reviewIdx = 0;
    showScreen("screenReview");
    renderReview();
  }
  function renderReview() {
    const card = REVIEW_CARDS[reviewIdx];
    $("#reviewProgressFill").style.width = (reviewIdx / REVIEW_CARDS.length) * 100 + "%";
    $("#reviewHearts b").textContent = state.hearts;
    $("#reviewFeedback").hidden = true;
    const body = $("#reviewBody");
    body.innerHTML = `
      <div class="dir-label">What does this mean?</div>
      <div class="prompt-row">
        <div><div class="prompt-zh">${card.prompt}</div><div class="prompt-py">${card.pinyin}</div></div>
        <button type="button" class="speaker-btn" id="btnSpeakR" aria-label="Play">🔊</button>
      </div>
      <div class="opt-list">
        ${card.options.map((o, i) => `<button type="button" class="opt-btn" data-i="${i}">${o}</button>`).join("")}
      </div>
    `;
    $("#btnSpeakR").addEventListener("click", () => speak(card.prompt));
    let locked = false;
    $$(".opt-btn", body).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        const ok = card.options[+btn.dataset.i] === card.answer;
        $$(".opt-btn", body).forEach((b) => {
          b.disabled = true;
          if (card.options[+b.dataset.i] === card.answer) b.classList.add("correct");
        });
        if (!ok) {
          btn.classList.add("wrong");
          sfxWrong();
          state.hearts = Math.max(0, state.hearts - 1);
        } else sfxCorrect();
        const fb = $("#reviewFeedback");
        fb.hidden = false;
        fb.className = "feedback-banner " + (ok ? "ok" : "bad");
        fb.innerHTML = `<span>${ok ? "✓ Good" : "✗ Again"}</span><button type="button" id="btnRevNext">Continue</button>`;
        $("#btnRevNext").addEventListener("click", () => {
          reviewIdx++;
          if (reviewIdx >= REVIEW_CARDS.length) {
            state.reviewDone = true;
            state.dueCount = 0;
            state.xp += 15;
            xpFloat(15);
            sfxClaim();
            showScreen("screenMain");
            switchTab("practice");
            toast("+15 XP · Review clear", "dragon-celebrate");
            maybeFinale();
          } else renderReview();
        });
      });
    });
  }

  /* ---------- Flip Match ---------- */
  function startFlip() {
    setTrialStep(TRIAL.FLIP);
    showScreen("screenFlip");
    const tiles = [];
    FLIP_PAIRS.forEach((p) => {
      tiles.push({ pair: p.id, face: "zh", label: p.zh });
      tiles.push({ pair: p.id, face: "en", label: p.en });
    });
    shuffle(tiles);
    let flipped = [];
    let matched = 0;
    const grid = $("#flipGrid");
    $("#flipScore").textContent = `0/${FLIP_PAIRS.length}`;
    grid.innerHTML = tiles
      .map(
        (t, i) =>
          `<button type="button" class="flip-tile" data-i="${i}" data-pair="${t.pair}" aria-label="Card"><span class="back">◇</span></button>`
      )
      .join("");

    let busy = false;
    $$(".flip-tile", grid).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (busy || btn.classList.contains("matched") || btn.classList.contains("face-up")) return;
        const i = +btn.dataset.i;
        const t = tiles[i];
        btn.classList.add("face-up");
        btn.innerHTML = t.face === "zh" ? `<span class="zh">${t.label}</span>` : t.label;
        flipped.push({ btn, t });
        if (flipped.length < 2) return;
        busy = true;
        const [a, b] = flipped;
        if (a.t.pair === b.t.pair && a.t.face !== b.t.face) {
          sfxMatch();
          setTimeout(() => {
            a.btn.classList.add("matched");
            b.btn.classList.add("matched");
            matched++;
            $("#flipScore").textContent = `${matched}/${FLIP_PAIRS.length}`;
            flipped = [];
            busy = false;
            if (matched === FLIP_PAIRS.length) onFlipClear();
          }, 280);
        } else {
          sfxWrong();
          a.btn.classList.add("mismatch");
          b.btn.classList.add("mismatch");
          setTimeout(() => {
            [a, b].forEach((x) => {
              x.btn.classList.remove("face-up", "mismatch");
              x.btn.innerHTML = `<span class="back">◇</span>`;
            });
            flipped = [];
            busy = false;
          }, 550);
        }
      });
    });
  }

  function onFlipClear() {
    state.flipDone = true;
    state.xp += 20;
    xpFloat(20);
    sfxComplete();
    sparkleBurst();
    toast("Board clear! +20 XP", "dragon-celebrate");
    setTimeout(() => {
      maybeFinale(true);
    }, 900);
  }

  function maybeFinale(force) {
    if (force || (state.completed.has("l1") && state.flipDone)) {
      setTrialStep(TRIAL.FINALE);
      $("#finaleStats").textContent = `You earned ${state.xp} XP · ${state.streak}-day streak · ${state.completed.size} lesson cleared`;
      showScreen("screenFinale");
      sfxClaim();
    }
  }

  /* ---------- Write ---------- */
  function startWrite() {
    showScreen("screenWrite");
    const canvas = $("#writeCanvas");
    const ctx = canvas.getContext("2d");
    const glyph = "你";
    $("#writeGlyph").textContent = glyph;
    $("#writePinyin").textContent = "nǐ";
    function drawOutline() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f4f9f4";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#d0d8d2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 20);
      ctx.lineTo(canvas.width / 2, canvas.height - 20);
      ctx.moveTo(20, canvas.height / 2);
      ctx.lineTo(canvas.width - 20, canvas.height / 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.font = "180px 'PingFang SC','Noto Sans SC',sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(glyph, canvas.width / 2, canvas.height / 2 + 8);
    }
    drawOutline();
    let drawing = false;
    ctx.strokeStyle = "#22C55E";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return {
        x: ((src.clientX - r.left) / r.width) * canvas.width,
        y: ((src.clientY - r.top) / r.height) * canvas.height,
      };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() { drawing = false; }
    canvas.onmousedown = start;
    canvas.onmousemove = move;
    canvas.onmouseup = end;
    canvas.onmouseleave = end;
    canvas.ontouchstart = start;
    canvas.ontouchmove = move;
    canvas.ontouchend = end;
    $("#btnRedraw").onclick = drawOutline;
    $("#btnWroteIt").onclick = () => {
      sfxCorrect();
      state.xp += 5;
      xpFloat(5);
      toast("Self-check ✓ · +5 XP", "dragon-idle");
      showScreen("screenMain");
      switchTab("practice");
    };
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ---------- Wire UI ---------- */
  function startTrial() {
    ensureAudio();
    setTrialStep(TRIAL.LEARN);
    showScreen("screenMain");
    switchTab("learn");
    toast("Follow the glowing node", "dragon-idle");
  }

  $("#btnStartTrial").addEventListener("click", startTrial);
  $("#btnClaimXP").addEventListener("click", claimXP);
  $("#btnCloseLesson").addEventListener("click", () => {
    showScreen("screenMain");
    setTrialStep(state.completed.has("l1") ? TRIAL.PRACTICE : TRIAL.LEARN);
    switchTab("learn");
  });
  $("#btnCloseFlip").addEventListener("click", () => {
    showScreen("screenMain");
    switchTab("practice");
    if (state.flipDone) maybeFinale(true);
  });
  $("#btnCloseReview").addEventListener("click", () => {
    showScreen("screenMain");
    switchTab("practice");
  });
  $("#btnCloseWrite").addEventListener("click", () => {
    showScreen("screenMain");
    switchTab("practice");
  });
  $("#practiceEntry").addEventListener("click", () => switchTab("practice"));
  $$(".tab").forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.goto)));
  $("#btnKeepExploring").addEventListener("click", () => {
    state.guided = false;
    setTrialStep(TRIAL.FINALE);
    showScreen("screenMain");
    switchTab("learn");
    $("#trialStepLabel").textContent = "Exploring";
  });
  $("#btnToPractice").addEventListener("click", () => {
    showScreen("screenMain");
    switchTab("practice");
  });

  /* Install link: try DEVICE_INSTALL sibling, else stay as soft CTA */
  const install = $("#btnInstall");
  install.addEventListener("click", (e) => {
    /* soft CTA — page may be opened file:// without sibling */
    if (location.protocol === "file:") {
      e.preventDefault();
      toast("See MandarinPath/DEVICE_INSTALL.md in the repo", "dragon-idle");
    }
  });

  /* Boot */
  showScreen("screenSplash");
  setTrialStep(TRIAL.SPLASH);
})();
