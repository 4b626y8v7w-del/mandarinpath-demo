/* MandarinPath — full offline path */
(function () {
  "use strict";

  const UNITS = window.MP_UNITS;
  const LESSONS = window.MP_LESSONS;
  const lookupVocab = window.MP_lookupVocab;
  const REVIEW_POOL = window.MP_REVIEW_POOL || [];
  const FLIP_POOL = window.MP_FLIP_POOL || [];
  const WRITE_POOL = window.MP_WRITE_POOL || [];

  const state = {
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
    justClaimedXPThisSession: false,
    activeLessonId: null,
    evolvedThisClear: false,
    reviewCards: [],
    writeIdx: 0,
  };

  /* ---------- Dragon evolution (egg→adult; major-test gates) ---------- */
  const DRAGON_STAGES = [
    { id: "egg", displayName: "Egg", asset: "dragon-egg", profileTitle: "Something’s waking…", nextChip: "Next evolve: Unit 1" },
    { id: "hatchling", displayName: "Hatchling", asset: "dragon-hatchling", profileTitle: "It hatched for you.", nextChip: "Next evolve: Unit 3" },
    { id: "juvenile", displayName: "Juvenile", asset: "dragon-juvenile", profileTitle: "Growing on the path.", nextChip: "Next evolve: Unit 5" },
    { id: "teen", displayName: "Teen", asset: "dragon-teen", profileTitle: "Training partner.", nextChip: "Next evolve: Unit 8" },
    { id: "adult", displayName: "Adult", asset: "dragon-adult", profileTitle: "Your dragon’s fully fledged.", nextChip: null },
  ];
  /* Canonical iOS gates. Aliases l4 / l12 / l19 / l31 count only if those ids were completed. */
  const EVOLUTION_GATES = [
    { stage: 1, ids: ["u1l4", "l4"] },
    { stage: 2, ids: ["u3l4", "l12"] },
    { stage: 3, ids: ["u5l4", "l19"] },
    { stage: 4, ids: ["u8l4", "l31"] },
  ];

  function derivedDragonStageIndex(completedSet) {
    let best = 0;
    for (const g of EVOLUTION_GATES) {
      if (g.ids.some((id) => completedSet.has(id))) {
        if (g.stage > best) best = g.stage;
      }
    }
    return best;
  }

  function currentDragonStage() {
    const idx = derivedDragonStageIndex(state.completed);
    return DRAGON_STAGES[idx];
  }

  /* T5 mood overlay within stage — stage art wins for egg/hatchling/juvenile/adult;
     teen may celebrate when just claimed. */
  function pickDragonPose() {
    const stage = currentDragonStage();
    const n = derivedDragonStageIndex(state.completed);
    const subtitle = "Stage " + (n + 1) + "/5 · " + n + " major tests cleared";
    if (stage.id === "teen" && (state.streak >= 7 || state.justClaimedXPThisSession)) {
      return {
        asset: "dragon-celebrate",
        title: stage.profileTitle,
        subtitle,
        stage,
        stageIndex: n,
      };
    }
    return {
      asset: stage.asset,
      title: stage.profileTitle,
      subtitle,
      stage,
      stageIndex: n,
    };
  }

  function markClaimedXP() {
    state.justClaimedXPThisSession = true;
  }

  function resetProgress() {
    state.xp = 0;
    state.streak = 0;
    state.hearts = state.maxHearts;
    state.completed = new Set();
    state.dueCount = 0;
    state.pendingXP = 0;
    state.flipDone = false;
    state.reviewDone = false;
    state.justClaimedXPThisSession = false;
    state.lessonIdx = 0;
    state.lessonLocked = false;
  }

  /* ---------- Audio: WAV SFX (distinct correct/wrong) + soft Web Audio fallbacks ---------- */
  let audioCtx = null;
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sfxMuted = false;

  const wavCorrect = new Audio((window.MP_SFX && window.MP_SFX.correct) || "assets/sfx/sfx_correct.wav");
  const wavWrong = new Audio((window.MP_SFX && window.MP_SFX.wrong) || "assets/sfx/sfx_wrong.wav");
  wavCorrect.preload = "auto";
  wavWrong.preload = "auto";
  wavCorrect.volume = 0.48;
  wavWrong.volume = 0.48;

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
  function playWav(el, fallback) {
    if (sfxMuted || prefersReducedMotion) return;
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => fallback && fallback());
    } catch (_) {
      if (fallback) fallback();
    }
  }
  function sfxCorrect() {
    playWav(wavCorrect, () => {
      tone(523, 0.08, "sine", 0.07);
      setTimeout(() => tone(659, 0.1, "sine", 0.07), 70);
      setTimeout(() => tone(784, 0.14, "triangle", 0.06), 140);
    });
  }
  function sfxWrong() {
    playWav(wavWrong, () => {
      tone(180, 0.18, "triangle", 0.06);
    });
  }
  function sfxComplete() {
    if (sfxMuted || prefersReducedMotion) return;
    [392, 523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.2, "sine", 0.07), i * 90));
  }
  function sfxClaim() {
    if (sfxMuted || prefersReducedMotion) return;
    tone(880, 0.08, "sine", 0.06);
    setTimeout(() => tone(1175, 0.16, "triangle", 0.07), 60);
  }
  function sfxMatch() {
    if (sfxMuted || prefersReducedMotion) return;
    tone(660, 0.08, "sine", 0.06);
    setTimeout(() => tone(990, 0.12, "sine", 0.06), 50);
  }

  /* ---------- Speech (Kevin override: prefer male, else any zh incl. female; always speak) ---------- */
  const MALE_VOICE_RE = /kangkang|yunjian|yunyang|yunxi|yunye|yunjie|li[-_\s]?mu|\bmale\b|男/i;
  const FEMALE_VOICE_RE = /tingting|ting[-_\s]?ting|xiaoxiao|yaoyao|huihui|yu[-_\s]?shu|\bfemale\b|女/i;
  const CJK_RE = /[\u3400-\u9FFF\uF900-\uFAFF]/;

  function isMandarinText(s) {
    return !!(s && CJK_RE.test(String(s)));
  }

  function pickMaleZhVoice() {
    if (!window.speechSynthesis) return null;
    const voices = speechSynthesis.getVoices() || [];
    const mainland = voices.filter((v) => /zh[-_]?CN|zh[-_]?Hans/i.test(v.lang));
    const pool = mainland.length
      ? mainland
      : voices.filter((v) => /zh|Chinese|中文/i.test(v.lang + v.name));
    const male = pool.find((v) => MALE_VOICE_RE.test(v.name) && !FEMALE_VOICE_RE.test(v.name));
    return male || pool[0] || null;
  }

  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    const zhVoice = pickMaleZhVoice();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = "zh-CN";
    u.rate = 0.92;
    if (zhVoice) u.voice = zhVoice;
    const btn = document.querySelector(".speaker-btn.speaking, .speaker-btn:focus, .speakable.speaking");
    const mark = document.querySelector(".speaker-btn, .speakable.active-speak");
    if (mark) mark.classList.add("speaking");
    u.onend = () => {
      document.querySelectorAll(".speaking").forEach((el) => el.classList.remove("speaking"));
    };
    speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }


  function mpAsset(name) {
    const file = /\.png$/i.test(name) ? name : name + ".png";
    return (window.MP_ASSETS && window.MP_ASSETS[file]) || "assets/" + file;
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
      s.textContent = "\u2728";
      s.style.left = 10 + Math.random() * 80 + "%";
      s.style.bottom = Math.random() * 30 + "%";
      s.style.animationDelay = Math.random() * 0.3 + "s";
      box.appendChild(s);
    }
  }
