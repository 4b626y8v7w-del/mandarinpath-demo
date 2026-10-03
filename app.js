function mpAsset(e) {
  const t = e.endsWith(".png") ? e : e + ".png";
  return (window.MP_ASSETS && window.MP_ASSETS[t]) || "assets/" + t;
}
!(function () {
  "use strict";
  const e = window.MP_UNITS,
    t = (window.MP_VOCAB, window.MP_HELLO_LESSON),
    n = window.MP_REVIEW_CARDS,
    s = window.MP_FLIP_PAIRS,
    a = window.MP_TRIAL,
    i = window.MP_TRIAL_LABELS,
    o = window.MP_TRIAL_PCT,
    l = window.MP_lookupVocab,
    c =
      (window.MP_pairLabel,
      window.MP_resolvePair,
      {
        trialStep: a.SPLASH,
        xp: 0,
        streak: 0,
        hearts: 5,
        maxHearts: 5,
        completed: new Set(),
        dueCount: 0,
        tab: "learn",
        lessonIdx: 0,
        lessonLocked: !1,
        pendingXP: 0,
        flipDone: !1,
        reviewDone: !1,
        guided: !0,
        demoStageOverride: null,
      });
  let r = null;
  const d =
    "function" == typeof window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const p = new Audio(
      (window.MP_SFX && window.MP_SFX.correct) || "assets/sfx/sfx_correct.wav",
    ),
    h = new Audio(
      (window.MP_SFX && window.MP_SFX.wrong) || "assets/sfx/sfx_wrong.wav",
    );
  function u() {
    if (!r) {
      const e = window.AudioContext || window.webkitAudioContext;
      e && (r = new e());
    }
    return r && "suspended" === r.state && r.resume(), r;
  }
  function b(e, t, n, s) {
    const a = u();
    if (!a) return;
    const i = a.createOscillator(),
      o = a.createGain();
    (i.type = n || "sine"),
      (i.frequency.value = e),
      (o.gain.value = s || 0.08),
      i.connect(o),
      o.connect(a.destination);
    const l = a.currentTime;
    o.gain.setValueAtTime(s || 0.08, l),
      o.gain.exponentialRampToValueAtTime(0.001, l + t),
      i.start(l),
      i.stop(l + t + 0.02);
  }
  function v(e, t) {
    if (!d)
      try {
        e.currentTime = 0;
        const n = e.play();
        n && "function" == typeof n.catch && n.catch(() => t && t());
      } catch (e) {
        t && t();
      }
  }
  function m() {
    v(p, () => {
      b(523, 0.08, "sine", 0.07),
        setTimeout(() => b(659, 0.1, "sine", 0.07), 70),
        setTimeout(() => b(784, 0.14, "triangle", 0.06), 140);
    });
  }
  function f() {
    v(h, () => {
      b(180, 0.18, "triangle", 0.06);
    });
  }
  function g() {
    d ||
      [392, 523, 659, 784].forEach((e, t) =>
        setTimeout(() => b(e, 0.2, "sine", 0.07), 90 * t),
      );
  }
  function y() {
    d ||
      (b(880, 0.08, "sine", 0.06),
      setTimeout(() => b(1175, 0.16, "triangle", 0.07), 60));
  }
  (p.preload = "auto"),
    (h.preload = "auto"),
    (p.volume = 0.48),
    (h.volume = 0.48);
  const w =
      /kangkang|yunjian|yunyang|yunxi|yunye|yunjie|li[-_\s]?mu|\bmale\b|男/i,
    k =
      /tingting|ting[-_\s]?ting|xiaoxiao|yaoyao|huihui|yu[-_\s]?shu|\bfemale\b|女/i,
    $ = /[\u3400-\u9FFF\uF900-\uFAFF]/;
  function L(e) {
    return !(!e || !$.test(String(e)));
  }
  /* Kevin override: prefer male zh, else any zh incl. female — always speak when zh exists */
  function pickMaleZhVoice() {
    if (!window.speechSynthesis) return null;
    const e = speechSynthesis.getVoices() || [],
      t = e.filter((e) => /zh[-_]?CN|zh[-_]?Hans/i.test(e.lang)),
      n = t.length ? t : e.filter((e) => /zh|Chinese|中文/i.test(e.lang + e.name)),
      s = n.find((e) => w.test(e.name) && !k.test(e.name));
    return s || n[0] || null;
  }
  const DRAGON_STAGES = [
    { id: "egg", displayName: "Egg", asset: "dragon-egg", profileTitle: "Something’s waking…", nextChip: "Next evolve: Unit 1" },
    { id: "hatchling", displayName: "Hatchling", asset: "dragon-hatchling", profileTitle: "It hatched for you.", nextChip: "Next evolve: Unit 3" },
    { id: "juvenile", displayName: "Juvenile", asset: "dragon-juvenile", profileTitle: "Growing on the path.", nextChip: "Next evolve: Unit 5" },
    { id: "teen", displayName: "Teen", asset: "dragon-teen", profileTitle: "Training partner.", nextChip: "Next evolve: Unit 8" },
    { id: "adult", displayName: "Adult", asset: "dragon-adult", profileTitle: "Your dragon’s fully fledged.", nextChip: null },
  ];
  const EVOLUTION_GATES = [
    { stage: 1, ids: ["u1l4", "l4"] },
    { stage: 2, ids: ["u3l4", "l12"] },
    { stage: 3, ids: ["u5l4", "l19"] },
    { stage: 4, ids: ["u8l4", "l31"] },
  ];
  function derivedDragonStageIndex(completedSet) {
    if (typeof c.demoStageOverride === "number" && c.demoStageOverride >= 0)
      return Math.min(4, c.demoStageOverride);
    let best = 0;
    for (const g of EVOLUTION_GATES) {
      if (g.ids.some((id) => completedSet.has(id)) && g.stage > best) best = g.stage;
    }
    return best;
  }
  function currentDragonStage() {
    return DRAGON_STAGES[derivedDragonStageIndex(c.completed)];
  }
  function E(e) {
    if (!window.speechSynthesis || !e) return;
    const t = pickMaleZhVoice();
    window.speechSynthesis.cancel();
    const n = new SpeechSynthesisUtterance(String(e));
    (n.lang = "zh-CN"), (n.rate = 0.92), t && (n.voice = t);
    document.querySelector(
      ".speaker-btn.speaking, .speaker-btn:focus, .speakable.speaking",
    );
    const s = document.querySelector(".speaker-btn, .speakable.active-speak");
    s && s.classList.add("speaking"),
      (n.onend = () => {
        document
          .querySelectorAll(".speaking")
          .forEach((e) => e.classList.remove("speaking"));
      }),
      speechSynthesis.speak(n);
  }
  window.speechSynthesis &&
    (speechSynthesis.getVoices(),
    (speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices()));
  const S = (e, t) => (t || document).querySelector(e),
    T = (e, t) => Array.from((t || document).querySelectorAll(e));
  function P(e) {
    [
      "screenSplash",
      "screenMain",
      "screenLesson",
      "screenComplete",
      "screenFlip",
      "screenReview",
      "screenWrite",
      "screenFinale",
    ].forEach((t) => {
      const n = document.getElementById(t);
      n && (n.hidden = t !== e);
    });
  }
  function x(e) {
    c.trialStep = e;
    const t = S("#trialStrip");
    if (e === a.SPLASH) return void (t.hidden = !0);
    (t.hidden = !1), (S("#trialStepLabel").textContent = i[e] || "");
    const n = o[e] || 0;
    (S("#trialMeterFill").style.width = n + "%"),
      S("#trialMeter").setAttribute("aria-valuenow", n);
  }
  function C(e, t) {
    const n = S("#toast");
    (n.hidden = !1),
      (n.innerHTML =
        (t ? `<img src="${mpAsset(t)}" alt="" />` : "") + `<span>${e}</span>`),
      clearTimeout(C._t),
      (C._t = setTimeout(() => {
        n.hidden = !0;
      }, 2200));
  }
  function M(e) {
    const t = S("#xpFloat");
    (t.textContent = `+${e} XP`),
      (t.hidden = !1),
      (t.style.animation = "none"),
      t.offsetWidth,
      (t.style.animation = ""),
      clearTimeout(M._t),
      (M._t = setTimeout(() => {
        t.hidden = !0;
      }, 900));
  }
  function z() {
    const e = S("#sparkles");
    if (e) {
      e.innerHTML = "";
      for (let t = 0; t < 10; t++) {
        const t = document.createElement("span");
        (t.className = "sparkle"),
          (t.textContent = "✨"),
          (t.style.left = 10 + 80 * Math.random() + "%"),
          (t.style.bottom = 30 * Math.random() + "%"),
          (t.style.animationDelay = 0.3 * Math.random() + "s"),
          e.appendChild(t);
      }
    }
  }
  function A(t) {
    if (c.completed.has(t)) return "completed";
    const n = e.flatMap((e) => e.lessons),
      s = n.findIndex((e) => e.id === t);
    if (0 === s) return "unlocked";
    const a = n[s - 1];
    return (a && c.completed.has(a.id)) || ("l2" === t && c.completed.has("l1"))
      ? "unlocked"
      : "locked";
  }
  function F() {
    const t = S("#learnPath"),
      n = (function () {
        for (const t of e)
          for (const e of t.lessons) if ("unlocked" === A(e.id)) return e.id;
        return null;
      })();
    let s = "";
    e.forEach((e, t) => {
      const a = e.lessons.filter((e) => c.completed.has(e.id)).length,
        i = e.lessons.length;
      (s += `\n        <div class="chapter-card">\n          <div class="chapter-icon" style="background:linear-gradient(135deg,${e.color},${e.color}cc)">${e.icon}</div>\n          <div class="chapter-meta">\n            <div class="chapter-label" style="color:${e.color}">CHAPTER ${t + 1}</div>\n            <div class="chapter-title">${e.title}</div>\n            <div class="chapter-sub">${e.titleZh} · ${e.titlePinyin}</div>\n          </div>\n          <div class="chapter-prog">${a}/${i}</div>\n        </div>\n      `),
        e.lessons.forEach((t, a) => {
          const i = A(t.id),
            o = t.id === n,
            l = "completed" === i ? "✓" : "locked" === i ? "🔒" : "★";
          s += `\n          <div class="node-row" style="transform:translateX(${a % 2 == 0 ? -36 : 36}px)">\n            <button type="button" class="node-btn ${i}${o ? " current" : ""}" data-lesson="${t.id}" data-state="${i}" aria-label="${t.title}">\n              ${l}\n              ${o ? '<span class="node-sparkle">✨</span>' : ""}\n            </button>\n            <div class="node-label">${t.title}<span class="zh">${t.titleZh}</span></div>\n            ${a < e.lessons.length - 1 ? '<div class="path-connector"></div>' : ""}\n          </div>\n        `;
        }),
        a === i &&
          i > 0 &&
          (s += `\n          <div class="chapter-clear">\n            <img src="${mpAsset("dragon-celebrate.png")}" alt="" />\n            <div><strong>Chapter clear</strong><span>Nice path work — keep going.</span></div>\n          </div>\n        `),
        1 === t && c.completed.has("l5");
    }),
      (t.innerHTML = s),
      T(".node-btn", t).forEach((e) => {
        e.addEventListener("click", () => {
          const t = e.dataset.state,
            n = e.dataset.lesson;
          "locked" !== t
            ? "l1" === n ||
              ("unlocked" === t && "l1" === n) ||
              ("completed" === t && "l1" === n)
              ? (function () {
                  c.hearts <= 0 &&
                    ((c.hearts = c.maxHearts),
                    C("Hearts restored for the demo"));
                  (c.lessonIdx = 0),
                    (c.lessonLocked = !1),
                    x(a.LESSON),
                    P("screenLesson"),
                    R();
                })()
              : ("unlocked" !== t && "completed" !== t) ||
                C(
                  "Full saga unlocks on iPhone — try Hello + Flip Match here",
                  "dragon-idle",
                )
            : C("Complete earlier lessons first", "dragon-encourage");
        });
      });
    const i = S("#learnCoach");
    c.guided && c.trialStep === a.LEARN && !c.completed.has("l1")
      ? ((i.hidden = !1),
        (i.innerHTML = `<img src="${mpAsset("dragon-idle.png")}" alt="" /><div>Tap the glowing <strong>Hello</strong> node — clear one short lesson for XP.</div>`))
      : c.guided && c.trialStep === a.PRACTICE
        ? ((i.hidden = !1),
          (i.innerHTML = `<img src="${mpAsset("dragon-celebrate.png")}" alt="" /><div>Lesson loot claimed! Open <strong>Practice</strong> → Flip Match.</div>`))
        : (i.hidden = !0);
  }
  function H() {
    const e = c.dueCount,
      t = e > 0 || c.completed.has("l1");
    S("#modeCards").innerHTML =
      `\n      <button type="button" class="mode-card primary-mode" id="modeReview" ${t && e > 0 ? "" : "disabled"}>\n        <div class="mode-ico green">🔄</div>\n        <div class="mode-text">\n          <strong>Review</strong>\n          <span>${e > 0 ? e + " due · ~2 min" : "Caught up 🎉"}</span>\n        </div>\n        ${e > 0 ? '<span class="mode-start">Start</span>' : ""}\n      </button>\n      <button type="button" class="mode-card teal-mode" id="modeWrite" ${c.completed.has("l1") ? "" : "disabled"}>\n        <div class="mode-ico teal">✏️</div>\n        <div class="mode-text">\n          <strong>Write</strong>\n          <span>${c.completed.has("l1") ? "Trace quest" : "Finish Hello first"}</span>\n        </div>\n        ${c.completed.has("l1") ? '<span class="mode-start teal">Start</span>' : ""}\n      </button>\n      <button type="button" class="mode-card gold-mode" id="modeFlip" ${c.completed.has("l1") ? "" : "disabled"}>\n        <div class="mode-ico gold">🃏</div>\n        <div class="mode-text">\n          <strong>Flip Match</strong>\n          <span>Mini-game · match pairs</span>\n        </div>\n        ${c.completed.has("l1") ? '<span class="mode-start gold">Start</span>' : ""}\n      </button>\n      ${0 === e && c.completed.has("l1") ? `\n        <div class="caught-up">\n          <img src="${mpAsset("dragon-celebrate.png")}" alt="" />\n          <div>You’re caught up. Write or Flip Match anytime.</div>\n        </div>` : ""}\n    `;
    const n = S("#practiceCoach");
    c.guided && c.trialStep === a.PRACTICE && !c.flipDone
      ? ((n.hidden = !1),
        (n.innerHTML = `<img src="${mpAsset("dragon-idle.png")}" alt="" /><div>Hit <strong>Flip Match</strong> — clear the board for bonus XP.</div>`))
      : (n.hidden = !0),
      S("#modeReview")?.addEventListener("click", () => {
        e > 0 && ((D = 0), P("screenReview"), W());
      }),
      S("#modeWrite")?.addEventListener("click", () => {
        c.completed.has("l1") &&
          (function () {
            P("screenWrite");
            const e = S("#writeCanvas"),
              t = e.getContext("2d"),
              n = "你";
            function s() {
              t.clearRect(0, 0, e.width, e.height),
                (t.fillStyle = "#f4f9f4"),
                t.fillRect(0, 0, e.width, e.height),
                (t.strokeStyle = "#d0d8d2"),
                (t.lineWidth = 1),
                t.beginPath(),
                t.moveTo(e.width / 2, 20),
                t.lineTo(e.width / 2, e.height - 20),
                t.moveTo(20, e.height / 2),
                t.lineTo(e.width - 20, e.height / 2),
                t.stroke(),
                (t.fillStyle = "rgba(0,0,0,0.12)"),
                (t.font = "180px 'PingFang SC','Noto Sans SC',sans-serif"),
                (t.textAlign = "center"),
                (t.textBaseline = "middle"),
                t.fillText(n, e.width / 2, e.height / 2 + 8);
            }
            (S("#writeGlyph").textContent = n),
              (S("#writePinyin").textContent = "nǐ"),
              s();
            let a = !1;
            function i(t) {
              const n = e.getBoundingClientRect(),
                s = t.touches ? t.touches[0] : t;
              return {
                x: ((s.clientX - n.left) / n.width) * e.width,
                y: ((s.clientY - n.top) / n.height) * e.height,
              };
            }
            function o(e) {
              e.preventDefault(), (a = !0);
              const n = i(e);
              t.beginPath(), t.moveTo(n.x, n.y);
            }
            function l(e) {
              if (!a) return;
              e.preventDefault();
              const n = i(e);
              t.lineTo(n.x, n.y), t.stroke();
            }
            function r() {
              a = !1;
            }
            (t.strokeStyle = "#22C55E"),
              (t.lineWidth = 4),
              (t.lineCap = "round"),
              (t.lineJoin = "round"),
              (e.onmousedown = o),
              (e.onmousemove = l),
              (e.onmouseup = r),
              (e.onmouseleave = r),
              (e.ontouchstart = o),
              (e.ontouchmove = l),
              (e.ontouchend = r),
              (S("#btnRedraw").onclick = s),
              (S("#btnWroteIt").onclick = () => {
                m(),
                  (c.xp += 5),
                  M(5),
                  C("Self-check ✓ · +5 XP", "dragon-idle"),
                  P("screenMain"),
                  _("practice");
              });
          })();
      }),
      S("#modeFlip")?.addEventListener("click", () => {
        c.completed.has("l1") &&
          (function () {
            x(a.FLIP), P("screenFlip");
            const e = [];
            s.forEach((t) => {
              e.push({ pair: t.id, face: "zh", label: t.zh }),
                e.push({ pair: t.id, face: "en", label: t.en });
            }),
              Z(e);
            let t = [],
              n = 0;
            const i = S("#flipGrid");
            (S("#flipScore").textContent = `0/${s.length}`),
              V(),
              (i.innerHTML = e
                .map(
                  (e, t) =>
                    `<button type="button" class="flip-tile" data-i="${t}" data-pair="${e.pair}" aria-label="Card"><span class="back">◇</span></button>`,
                )
                .join(""));
            let o = !1;
            T(".flip-tile", i).forEach((a) => {
              a.addEventListener("click", () => {
                if (
                  o ||
                  a.classList.contains("matched") ||
                  a.classList.contains("face-up")
                )
                  return;
                const i = +a.dataset.i,
                  l = e[i];
                if (
                  (a.classList.add("face-up"),
                  "zh" === l.face
                    ? ((a.innerHTML = `<span class="zh speakable" data-zh="${l.label}">${l.label}</span>`),
                      E(l.label),
                      a.querySelector(".zh")?.addEventListener("click", (e) => {
                        e.stopPropagation(), E(l.label);
                      }))
                    : (a.innerHTML = l.label),
                  t.push({ btn: a, t: l }),
                  t.length < 2)
                )
                  return;
                o = !0;
                const [r, p] = t;
                r.t.pair === p.t.pair && r.t.face !== p.t.face
                  ? (d ||
                      (b(660, 0.08, "sine", 0.06),
                      setTimeout(() => b(990, 0.12, "sine", 0.06), 50)),
                    setTimeout(() => {
                      r.btn.classList.add("matched"),
                        p.btn.classList.add("matched"),
                        n++,
                        (S("#flipScore").textContent = `${n}/${s.length}`),
                        (t = []),
                        (o = !1),
                        n === s.length &&
                          ((c.flipDone = !0),
                          (c.xp += 20),
                          M(20),
                          g(),
                          z(),
                          C("Board clear! +20 XP", "dragon-celebrate"),
                          setTimeout(() => {
                            j(!0);
                          }, 900));
                    }, 280))
                  : (f(),
                    r.btn.classList.add("mismatch"),
                    p.btn.classList.add("mismatch"),
                    (function (e, t) {
                      const n = S("#flipCoach");
                      if (!n) return;
                      const s = q(e),
                        a = q(t),
                        i = "zh" === e.face ? e : "zh" === t.face ? t : null,
                        o = i === e ? t : e,
                        l = i ? q(i) : s,
                        c =
                          "en" === o.face
                            ? o.label
                            : (o === e ? a : s)?.en || o.label,
                        r = l ? l.zh : i ? i.label : (s && s.zh) || "—",
                        d = l ? l.en : "—",
                        p = `${r} — ${c}`,
                        h = `${r} — ${d}`;
                      (n.hidden = !1),
                        (n.innerHTML = `\n      <div class="fb-row chosen"><span class="fb-lab">You chose</span> <span class="fb-val speakable" data-zh="${r}">${p}</span></div>\n      <div class="fb-row correct"><span class="fb-lab">Correct</span> <span class="fb-val speakable" data-zh="${r}">${h}</span></div>`),
                        n.querySelectorAll(".speakable").forEach((e) => {
                          e.addEventListener("click", (t) => {
                            t.stopPropagation();
                            const n = e.getAttribute("data-zh");
                            n && E(n);
                          });
                        });
                    })(r.t, p.t),
                    setTimeout(() => {
                      [r, p].forEach((e) => {
                        e.btn.classList.remove("face-up", "mismatch"),
                          (e.btn.innerHTML = '<span class="back">◇</span>');
                      }),
                        (t = []),
                        (o = !1),
                        V();
                    }, 1400));
              });
            });
          })();
      });
  }
  function _(t) {
    (c.tab = t),
      T(".tab").forEach((e) => {
        const n = e.dataset.goto === t;
        e.classList.toggle("active", n),
          e.setAttribute("aria-current", n ? "page" : "false");
      }),
      T(".tab-panel").forEach((e) => {
        e.hidden = e.dataset.tab !== t;
      }),
      "learn" === t && F(),
      "practice" === t && H(),
      "profile" === t &&
        (function () {
          const total = e.reduce((e, t) => e + t.lessons.length, 0);
          const stageIdx = derivedDragonStageIndex(c.completed);
          const stage = DRAGON_STAGES[stageIdx];
          const dragon = S("#profileDragon");
          if (dragon) dragon.src = mpAsset(stage.asset + ".png");
          if (S("#profileTitle")) S("#profileTitle").textContent = stage.profileTitle;
          if (S("#profileSubtitle"))
            S("#profileSubtitle").textContent =
              "Stage " + (stageIdx + 1) + "/5 · " + stageIdx + " major tests cleared";
          const chips = S("#profileChips");
          if (chips) {
            const streakLabel = 1 === c.streak ? "1-day streak" : c.streak + "-day streak";
            let html =
              `<span class="fuel-chip fire"><span class="ico" aria-hidden="true">🔥</span>${streakLabel}</span>` +
              `<span class="fuel-chip xp"><span class="ico" aria-hidden="true">💎</span>${c.xp} XP</span>`;
            if (stage.nextChip)
              html += `<span class="fuel-chip next"><span class="ico" aria-hidden="true">🐉</span>${stage.nextChip}</span>`;
            chips.innerHTML = html;
          }
          let meter =
            '<div class="stage-meter" role="img" aria-label="Dragon stage ' +
            (stageIdx + 1) +
            ' of 5">';
          for (let i = 0; i < 5; i++) {
            meter +=
              `<span class="stage-seg${i <= stageIdx ? " filled" : ""}${i === stageIdx ? " newest" : ""}" title="${DRAGON_STAGES[i].displayName}"></span>`;
          }
          meter += "</div>";
          const demoPanel = `\n      <div class="demo-evolve" id="demoEvolve">\n        <div class="section-label">Demo preview (Pages)</div>\n        <p class="demo-evolve-note">Cycle egg→adult without full curriculum. Real gates (u1l4 / l4 …) still apply when completed.</p>\n        <div class="demo-evolve-row">\n          <button type="button" class="btn btn-secondary" id="btnDemoEvolvePrev" ${stageIdx <= 0 ? "disabled" : ""}>← Prev</button>\n          <strong id="demoStageLabel">${stage.displayName}</strong>\n          <button type="button" class="btn btn-secondary" id="btnDemoEvolveNext" ${stageIdx >= 4 ? "disabled" : ""}>Next →</button>\n        </div>\n      </div>`;
          S("#profileStats").innerHTML =
            meter +
            `\n      <div class="section-label">With your dragon</div>\n      <div class="stat-row"><span style="color:#FF5722">🔥</span> Dragon’s fire <span class="val">${c.streak}</span></div>\n      <div class="stat-row"><span style="color:#EAB308">⭐</span> Path XP <span class="val">${c.xp}</span></div>\n      <div class="stat-row"><span style="color:#26B8B3">✓</span> Quests cleared <span class="val">${c.completed.size}</span></div>\n      <div class="stat-row"><span style="color:#F24D59">♥</span> Hearts <span class="val">${c.hearts}/${c.maxHearts}</span></div>\n      <div class="stat-row"><span style="color:#26B8B3">🗺</span> Saga map <span class="val">${c.completed.size}/${total}</span></div>\n    ` +
            demoPanel;
          let n = '<div class="section-label">Chapters on the path</div>';
          e.forEach((u) => {
            const done = u.lessons.filter((l) => c.completed.has(l.id)).length,
              pct = (done / u.lessons.length) * 100;
            n += `\n        <div class="unit-row">\n          <span>${u.icon}</span>\n          <div><strong style="font-size:0.88rem">${u.title}</strong><br/><span style="font-size:0.72rem;color:var(--muted)">${done}/${u.lessons.length} lessons</span></div>\n          <div class="bar"><i style="width:${pct}%;background:${u.color}"></i></div>\n        </div>\n      `;
          });
          S("#profileUnits").innerHTML = n;
          S("#btnDemoEvolvePrev")?.addEventListener("click", () => {
            const cur =
              typeof c.demoStageOverride === "number"
                ? c.demoStageOverride
                : derivedDragonStageIndex(c.completed);
            c.demoStageOverride = Math.max(0, cur - 1);
            _("profile");
          });
          S("#btnDemoEvolveNext")?.addEventListener("click", () => {
            const cur =
              typeof c.demoStageOverride === "number"
                ? c.demoStageOverride
                : derivedDragonStageIndex(c.completed);
            const next = Math.min(4, cur + 1);
            c.demoStageOverride = next;
            if (next > cur) C("Your dragon evolved!", DRAGON_STAGES[next].asset);
            _("profile");
          });
        })(),
      (function () {
        const e = S("#statsBar");
        if (!e) return;
        e.innerHTML = `\n      <div class="stat-chip"><span class="ico" style="color:#FF5722">🔥</span>${c.streak} <span class="lab">Streak</span></div>\n      <div class="stat-chip"><span class="ico" style="color:#FBBF24">⭐</span>${c.xp} <span class="lab">XP</span></div>\n      <div class="stat-chip"><span class="ico" style="color:#F24D59">♥</span>${c.hearts} <span class="lab">Hearts</span></div>\n    `;
        const t = S("#dueBadge");
        c.dueCount > 0
          ? ((t.hidden = !1), (t.textContent = String(c.dueCount)))
          : (t.hidden = !0);
      })();
  }

  const SB_TOO_SHORT = 0.35;
  const SB_TOO_QUIET_RMS = 0.02;
  function renderSpeakBackSB(ex, body) {
    const maxSec = Math.max(1, ex.maxDurationSec || 4);
    let mediaRecorder = null;
    let mediaStream = null;
    let chunks = [];
    let blob = null;
    let blobUrl = null;
    let recordStartedAt = 0;
    let autoStopTimer = null;
    let coachOk = false;
    let meAudio = null;

    body.innerHTML = `
      <div class="dir-label">Speak</div>
      <div class="sb-prompt">
        <div class="sb-pinyin" id="sbPinyin">${ex.promptPinyin}</div>
        <div class="sb-en">${ex.promptEn}</div>
        <button type="button" class="sb-show-zh opt-btn" id="sbShowZh">Show Chinese</button>
        <button type="button" class="sb-zh speakable" id="sbZh" hidden aria-label="Play ${ex.promptZh}">${ex.promptZh}</button>
      </div>
      <div class="sb-record-row">
        <button type="button" class="btn btn-primary sb-record" id="sbRecord">Record</button>
      </div>
      <div class="sb-time muted" id="sbTime">Tap Record · up to ${maxSec}s</div>
      <div class="sb-rec-bar" id="sbRecBar" hidden></div>
      <div class="sb-play-row">
        <button type="button" class="opt-btn sb-outline" id="sbPlayMe" disabled>Play me</button>
        <button type="button" class="opt-btn sb-outline" id="sbPlayModel">Play model</button>
      </div>
      <div class="sb-coach" id="sbCoach" hidden></div>
      <div class="sb-mic-tip" id="sbMicTip" hidden>
        <p>Mic needed on device; demo skip OK</p>
        <button type="button" class="opt-btn sb-outline" id="sbSkipDemo">Skip for demo</button>
      </div>
      <button type="button" class="btn btn-primary btn-xl" id="sbContinue" disabled>Continue</button>
    `;

    const elRecord = S("#sbRecord");
    const elTime = S("#sbTime");
    const elBar = S("#sbRecBar");
    const elPlayMe = S("#sbPlayMe");
    const elPlayModel = S("#sbPlayModel");
    const elCoach = S("#sbCoach");
    const elContinue = S("#sbContinue");
    const elMicTip = S("#sbMicTip");
    const elShowZh = S("#sbShowZh");
    const elZh = S("#sbZh");

    function clearTake() {
      if (autoStopTimer) {
        clearTimeout(autoStopTimer);
        autoStopTimer = null;
      }
      if (meAudio) {
        try { meAudio.pause(); } catch (_) {}
        meAudio = null;
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
      blob = null;
      chunks = [];
      coachOk = false;
      elCoach.hidden = true;
      elCoach.innerHTML = "";
      elPlayMe.disabled = true;
      elContinue.disabled = true;
      elContinue.classList.add("sb-continue-dim");
    }

    function setContinueEnabled(on) {
      elContinue.disabled = !on;
      elContinue.classList.toggle("sb-continue-dim", !on);
    }

    function showCoach(ok) {
      coachOk = ok;
      const chipClass = ok ? "sb-chip ok" : "sb-chip warn";
      const chip = ok ? "Good job" : "Try again";
      const line = ok
        ? "Nice take — match Play model anytime."
        : "Try again.";
      elCoach.hidden = false;
      elCoach.innerHTML = `
        <div class="sb-coach-card">
          <div class="sb-chip-row">
            <span class="${chipClass}">${ok ? "✓" : "!"} ${chip}</span>
          </div>
          <div class="sb-coach-line">${line}</div>
          ${ok ? "" : `<button type="button" class="opt-btn sb-outline" id="sbTryAgain">Try again</button>`}
        </div>`;
      if (ok) {
        m();
        setContinueEnabled(true);
      } else {
        f();
        setContinueEnabled(false);
        S("#sbTryAgain")?.addEventListener("click", () => {
          clearTake();
          elTime.textContent = `Tap Record · up to ${maxSec}s`;
        });
      }
    }

    async function analyzeBlob(b, wallDuration) {
      let duration = wallDuration;
      let rms = 0.05;
      try {
        const ctx = u();
        if (ctx && b) {
          const buf = await b.arrayBuffer();
          const audioBuf = await ctx.decodeAudioData(buf.slice(0));
          duration = audioBuf.duration || wallDuration;
          const ch = audioBuf.getChannelData(0);
          const skip = Math.floor(ch.length * 0.04);
          const end = Math.max(skip, ch.length - skip);
          let sum = 0;
          let n = 0;
          for (let i = skip; i < end; i++) {
            sum += ch[i] * ch[i];
            n++;
          }
          rms = n ? Math.sqrt(sum / n) : 0;
        }
      } catch (_) {}
      showCoach(!(duration < SB_TOO_SHORT || rms < SB_TOO_QUIET_RMS));
    }

    function stopTracks() {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
        mediaStream = null;
      }
    }

    function finishRecording() {
      if (autoStopTimer) {
        clearTimeout(autoStopTimer);
        autoStopTimer = null;
      }
      elBar.hidden = true;
      elRecord.textContent = "Record";
      elRecord.classList.remove("sb-recording");
      const wall = recordStartedAt ? (performance.now() - recordStartedAt) / 1000 : 0;
      elTime.textContent = wall ? `Recorded ${wall.toFixed(1)}s` : "Recorded";
      if (!blob || blob.size < 8) {
        showCoach(false);
        return;
      }
      blobUrl = URL.createObjectURL(blob);
      elPlayMe.disabled = false;
      analyzeBlob(blob, wall);
    }

    async function startRecording() {
      clearTake();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        elMicTip.hidden = false;
        elTime.textContent = "Mic unavailable in this browser";
        return;
      }
      try {
        u();
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (_) {
        elMicTip.hidden = false;
        elTime.textContent = "Mic permission needed";
        return;
      }
      elMicTip.hidden = true;
      chunks = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      try {
        mediaRecorder = mime
          ? new MediaRecorder(mediaStream, { mimeType: mime })
          : new MediaRecorder(mediaStream);
      } catch (_) {
        mediaRecorder = new MediaRecorder(mediaStream);
      }
      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size) chunks.push(ev.data);
      };
      mediaRecorder.onstop = () => {
        blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
        stopTracks();
        finishRecording();
      };
      recordStartedAt = performance.now();
      mediaRecorder.start(100);
      elRecord.textContent = "Stop";
      elRecord.classList.add("sb-recording");
      elBar.hidden = false;
      elTime.textContent = `Recording… 0 / ${maxSec}s`;
      let tick = 0;
      const tickIv = setInterval(() => {
        if (!mediaRecorder || mediaRecorder.state !== "recording") {
          clearInterval(tickIv);
          return;
        }
        tick += 1;
        elTime.textContent = `Recording… ${Math.min(tick, maxSec)} / ${maxSec}s`;
      }, 1000);
      autoStopTimer = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
        clearInterval(tickIv);
      }, maxSec * 1000);
    }

    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
    }

    elShowZh.addEventListener("click", () => {
      elShowZh.hidden = true;
      elZh.hidden = false;
    });
    elZh.addEventListener("click", () => E(ex.promptZh));

    elRecord.addEventListener("click", () => {
      if (mediaRecorder && mediaRecorder.state === "recording") stopRecording();
      else startRecording();
    });

    elPlayMe.addEventListener("click", () => {
      if (!blobUrl) return;
      if (meAudio) { try { meAudio.pause(); } catch (_) {} }
      meAudio = new Audio(blobUrl);
      meAudio.play().catch(() => {});
    });

    elPlayModel.addEventListener("click", () => {
      if (meAudio) { try { meAudio.pause(); } catch (_) {} }
      E(ex.promptZh);
    });

    elContinue.addEventListener("click", () => {
      if (!coachOk) return;
      stopRecording();
      stopTracks();
      clearTake();
      B();
    });

    S("#sbSkipDemo")?.addEventListener("click", () => {
      stopRecording();
      stopTracks();
      clearTake();
      B();
    });

    setContinueEnabled(false);
  }

  function R() {
    const e = t.exercises[c.lessonIdx],
      n = t.exercises.length;
    (S("#lessonProgressFill").style.width = (c.lessonIdx / n) * 100 + "%"),
      (S("#lessonHearts b").textContent = c.hearts),
      (S("#feedbackBanner").hidden = !0),
      (c.lessonLocked = !1);
    const s = S("#lessonBody");
    if (e) {
      if ("teach" === e.type) {
        s.innerHTML = `\n        <div class="dir-label">New word · learn this first</div>\n        <div class="teach-card">\n          <button type="button" class="teach-zh speakable" id="teachZhTap" aria-label="Play ${e.zh}">${e.zh}</button>\n          <button type="button" class="teach-py speakable" id="teachPyTap" aria-label="Play ${e.zh}">${e.pinyin}</button>\n          <div class="teach-en">${e.en}</div>\n          <div class="teach-pair" aria-hidden="true">\n            <span class="teach-pair-zh">${e.zh}</span>\n            <span class="teach-pair-sep">↔</span>\n            <span class="teach-pair-en">${e.en}</span>\n          </div>\n          <p class="teach-hint">Tap the characters to hear · 点击听发音</p>\n          <button type="button" class="speaker-btn teach-speak" id="btnSpeak" aria-label="Play ${e.zh}">🔊</button>\n        </div>\n        <button type="button" class="btn btn-primary btn-xl" id="btnTeachNext">Got it — continue</button>\n      `;
        const a = () => E(e.zh);
        return (
          S("#teachZhTap").addEventListener("click", a),
          S("#teachPyTap").addEventListener("click", a),
          S("#btnSpeak").addEventListener("click", a),
          void S("#btnTeachNext").addEventListener("click", () => {
            B();
          })
        );
      }
      if ("mc" === e.type || "listen" === e.type) {
        const i =
            "listen" === e.type
              ? "Listen — what does this mean?"
              : "zh_to_en" === e.direction
                ? "What does this mean?"
                : "How do you say this in Chinese?",
          o = "listen" === e.type || "zh_to_en" === e.direction;
        let l = "";
        l =
          "en_to_zh" === e.direction
            ? `<div class="trans-preview muted-preview" title="Translation preview"><span class="tp-en">${e.prompt}</span><span class="tp-sep">·</span><span class="tp-en-hint">pick the Mandarin →</span></div>`
            : `<div class="trans-preview muted-preview" title="You'll pick the English"><button type="button" class="tp-zh speakable" id="previewZhTap" aria-label="Play ${e.prompt}">${e.prompt}</button>${e.pinyin ? `<span class="tp-py">${e.pinyin}</span>` : ""}<span class="tp-sep">·</span><span class="tp-en-hint">EN meaning →</span></div>`;
        const r =
            "en_to_zh" === e.direction
              ? `<div class="prompt-en">${e.prompt}</div>`
              : `<div><button type="button" class="prompt-zh speakable" id="promptZhTap" aria-label="Play ${e.prompt}">${e.prompt}</button>${e.pinyin ? `<div class="prompt-py">${e.pinyin}</div>` : ""}</div>`,
          d = e.options
            .map((e, t) =>
              L(e)
                ? `<div class="opt-row" data-opt="${t}">\n              <button type="button" class="opt-btn has-zh" data-opt="${t}">${e}</button>\n              <button type="button" class="opt-speak speaker-btn" data-speak="${e}" aria-label="Play ${e}">🔊</button>\n            </div>`
                : `<button type="button" class="opt-btn" data-opt="${t}">${e}</button>`,
            )
            .join("");
        (s.innerHTML = `\n        <div class="dir-label">${i}</div>\n        <div class="prompt-row">\n          ${r}\n          ${o ? '<button type="button" class="speaker-btn" id="btnSpeak" aria-label="Play audio">🔊</button>' : ""}\n        </div>\n        ${l}\n        <div class="opt-list">${d}</div>\n      `),
          o &&
            (S("#btnSpeak").addEventListener("click", () => E(e.prompt)),
            "listen" === e.type && setTimeout(() => E(e.prompt), 300)),
          S("#promptZhTap")?.addEventListener("click", (t) => {
            t.stopPropagation(), E(e.prompt);
          }),
          S("#previewZhTap")?.addEventListener("click", (t) => {
            t.stopPropagation(), E(e.prompt);
          }),
          s.insertAdjacentHTML(
            "beforeend",
            '<button type="button" class="btn btn-primary confirm-answer" id="btnConfirmAnswer" disabled>Confirm</button>',
          );
          const confirmBtn = S("#btnConfirmAnswer");
          let pendingOpt = null;
          T(".opt-speak", s).forEach((e) => {
            e.addEventListener("click", (t) => {
              t.stopPropagation(), E(e.dataset.speak);
            });
          }),
          T(".opt-btn", s).forEach((t) => {
            t.addEventListener("click", () => {
              if (c.lessonLocked) return;
              pendingOpt = +t.dataset.opt;
              const n = e.options[pendingOpt];
              L(n) && E(n),
                T(".opt-btn", s).forEach((btn) => {
                  btn.classList.toggle("picked", +btn.dataset.opt === pendingOpt),
                    btn.classList.toggle("dimmed", +btn.dataset.opt !== pendingOpt);
                }),
                confirmBtn && (confirmBtn.disabled = !1);
            });
          }),
          confirmBtn &&
            confirmBtn.addEventListener("click", () => {
              if (c.lessonLocked || null == pendingOpt) return;
              c.lessonLocked = !0;
              confirmBtn.disabled = !0;
              const n = e.options[pendingOpt],
                a = n === e.answer;
              T(".opt-btn", s).forEach((t) => {
                (t.disabled = !0),
                  t.classList.remove("picked", "dimmed"),
                  e.options[+t.dataset.opt] === e.answer &&
                    t.classList.add("correct");
              }),
                T(".opt-speak", s).forEach((e) => {
                  e.disabled = !0;
                });
              const picked = s.querySelector('.opt-btn[data-opt="' + pendingOpt + '"]');
              a || (picked && picked.classList.add("wrong")),
                (function (e) {
                  const t = S("#lessonBody");
                  let n = t.querySelector(".trans-preview");
                  if (!n) {
                    (n = document.createElement("div")),
                      (n.className = "trans-preview");
                    const e = t.querySelector(".prompt-row");
                    e && e.nextSibling
                      ? t.insertBefore(n, e.nextSibling)
                      : t.appendChild(n);
                  }
                  n.classList.remove("muted-preview");
                  const s = I(e);
                  (n.innerHTML = `<button type="button" class="tp-zh speakable" aria-label="Play ${s.zh}">${s.zh}</button>${s.pinyin ? `<span class="tp-py">${s.pinyin}</span>` : ""}<span class="tp-sep">=</span><span class="tp-en">${s.en}</span>`),
                    n
                      .querySelector(".tp-zh")
                      ?.addEventListener("click", () => E(s.zh));
                })(e),
                N(a, { ex: e, choice: n, built: null });
            });
      } else if ("tiles" === e.type) {
        const p = Z([...e.tiles, ...e.distractors]),
          h = [],
          u = e.answerEn || "hello";
        s.innerHTML = `\n        <div class="dir-label">${e.promptEn}</div>\n        <div class="trans-preview"><span class="tp-en">${u}</span>${e.answerPinyin ? `<span class="tp-sep">·</span><span class="tp-py">${e.answerPinyin}</span>` : ""}<span class="tp-sep">·</span><span class="tp-en-hint">tap tiles to hear · build</span></div>\n        <div class="tile-answer" id="tileAnswer"><span style="color:var(--muted);font-size:0.85rem">Tap tiles…</span></div>\n        <div class="tile-bank" id="tileBank">\n          ${p.map((e, t) => `<button type="button" class="tile speakable" data-i="${t}" data-t="${e}" aria-label="Tile ${e}">${e}</button>`).join("")}\n        </div>\n        <button type="button" class="btn btn-primary tile-check" id="btnCheckTiles" disabled>Confirm</button>\n      `;
        const b = S("#tileAnswer"),
          v = S("#btnCheckTiles");
        function m() {
          (b.innerHTML = h.length
            ? h.map((e) => `<span class="tile">${e.t}</span>`).join("")
            : '<span style="color:var(--muted);font-size:0.85rem">Tap tiles…</span>'),
            (v.disabled = 0 === h.length);
        }
        T(".tile", S("#tileBank")).forEach((e) => {
          e.addEventListener("click", () => {
            c.lessonLocked ||
              e.classList.contains("used") ||
              (L(e.dataset.t) && E(e.dataset.t),
              e.classList.add("used"),
              h.push({ t: e.dataset.t, btn: e }),
              m());
          });
        }),
          b.addEventListener("click", () => {
            if (c.lessonLocked || !h.length) return;
            h.pop().btn.classList.remove("used"), m();
          }),
          v.addEventListener("click", () => {
            if (c.lessonLocked) return;
            c.lessonLocked = !0;
            const t = h.map((e) => e.t).join(""),
              n = t === e.answer;
            n && L(t) && E(t), N(n, { ex: e, choice: t, built: t });
          });
      } else if ("speakBack" === e.type) {
        renderSpeakBackSB(e, s);
      }
    }
  }
  function I(e) {
    if ("tiles" === e.type)
      return {
        zh: e.answer,
        pinyin: e.answerPinyin || (l(e.answer) || {}).pinyin || "",
        en: e.answerEn || (l(e.answer) || {}).en || "hello",
      };
    if ("en_to_zh" === e.direction) {
      const t = l(e.answer) || l(e.prompt);
      return {
        zh: e.answer,
        pinyin: (t && t.pinyin) || e.meaningPinyin || "",
        en: e.prompt,
      };
    }
    const t = l(e.prompt) || l(e.answer);
    return {
      zh: e.prompt,
      pinyin: e.pinyin || (t && t.pinyin) || "",
      en: e.answer,
    };
  }
  function N(e, t) {
    if (((t = t || {}), e)) {
      m();
      const e = t.ex ? I(t.ex) : null,
        n = e
          ? `${e.zh}${e.pinyin ? " (" + e.pinyin + ")" : ""} — ${e.en}`
          : "";
      X(!0, "Nice!", n ? `<div class="fb-pair">${n}</div>` : "");
    } else {
      f(),
        (c.hearts = Math.max(0, c.hearts - 1)),
        (S("#lessonHearts b").textContent = c.hearts);
      let e = "";
      if (t.ex) {
        const n = (function (e, t) {
          const n = I(e);
          let s;
          if ("tiles" === e.type) {
            const e = l(t);
            s = {
              zh: t || "(empty)",
              pinyin: (e && e.pinyin) || "",
              en: (e && e.en) || (t === n.zh ? n.en : "not a match"),
            };
          } else if ("en_to_zh" === e.direction) {
            const e = l(t);
            s = { zh: t, pinyin: (e && e.pinyin) || "", en: (e && e.en) || t };
          } else {
            const e = l(t);
            s = {
              zh: (e && e.zh) || "—",
              pinyin: (e && e.pinyin) || "",
              en: t,
            };
          }
          const a = (e) => {
            const t = e.zh && "—" !== e.zh ? e.zh : "",
              n = e.pinyin ? ` (${e.pinyin})` : "",
              s = e.en || "";
            return t && s ? `${t}${n} — ${s}` : t ? `${t}${n}` : s;
          };
          return { chosenLine: a(s), correctLine: a(n), chosen: s, correct: n };
        })(t.ex, t.choice);
        e = `\n          <div class="fb-coach">\n            <div class="fb-row chosen"><span class="fb-lab">You chose</span><span class="fb-val" data-zh="${n.chosen.zh || ""}">${n.chosenLine}</span></div>\n            <div class="fb-row correct"><span class="fb-lab">Correct</span><span class="fb-val" data-zh="${n.correct.zh || ""}">${n.correctLine}</span></div>\n          </div>`;
      }
      X(!1, "Not quite", e),
        c.hearts <= 0 &&
          ((c.hearts = c.maxHearts), C("Demo hearts refilled — keep going"));
    }
  }
  function X(e, t, n) {
    const s = S("#feedbackBanner");
    (s.hidden = !1),
      (s.className =
        "feedback-banner " + (e ? "ok" : "bad") + (n ? " rich" : "")),
      (s.innerHTML = `\n      <div class="fb-main">\n        <div class="fb-title">${e ? "✓" : "✗"} ${t}</div>\n        ${n || ""}\n      </div>\n      <button type="button" id="btnContinue">Continue</button>`),
      T(".fb-val[data-zh]", s).forEach((e) => {
        const t = e.getAttribute("data-zh");
        t &&
          L(t) &&
          (e.classList.add("speakable"),
          e.setAttribute("role", "button"),
          (e.tabIndex = 0),
          (e.title = "Tap to hear " + t),
          e.addEventListener("click", (e) => {
            e.stopPropagation(), E(t);
          }));
      }),
      S("#btnContinue").addEventListener("click", B);
  }
  function B() {
    c.lessonIdx++,
      c.lessonIdx >= t.exercises.length
        ? (function () {
            (c.pendingXP = t.xp),
              c.completed.add("l1"),
              (c.dueCount = 3),
              c.streak < 1 && (c.streak = 1);
            (S("#lessonProgressFill").style.width = "100%"),
              x(a.CLAIM),
              P("screenComplete"),
              (S("#completeXP").textContent = `+${c.pendingXP} XP`),
              (S("#completeStreak").innerHTML =
                `<span>🔥</span> ${c.streak}-day streak`),
              (S("#btnToPractice").hidden = !0),
              z(),
              g();
          })()
        : R();
  }
  let D = 0;
  function W() {
    const e = n[D];
    (S("#reviewProgressFill").style.width = (D / n.length) * 100 + "%"),
      (S("#reviewHearts b").textContent = c.hearts),
      (S("#reviewFeedback").hidden = !0);
    const t = S("#reviewBody");
    (t.innerHTML = `\n      <div class="dir-label">What does this mean?</div>\n      <div class="prompt-row">\n        <div><div class="prompt-zh">${e.prompt}</div><div class="prompt-py">${e.pinyin}</div></div>\n        <button type="button" class="speaker-btn" id="btnSpeakR" aria-label="Play">🔊</button>\n      </div>\n      <div class="opt-list">\n        ${e.options.map((e, t) => `<button type="button" class="opt-btn" data-i="${t}">${e}</button>`).join("")}\n      </div>\n    `),
      S("#btnSpeakR").addEventListener("click", () => E(e.prompt));
    t.insertAdjacentHTML(
      "beforeend",
      '<button type="button" class="btn btn-primary confirm-answer" id="btnConfirmReview" disabled>Confirm</button>',
    );
    const confirmRev = S("#btnConfirmReview");
    let s = !1;
    let pendingI = null;
    T(".opt-btn", t).forEach((a) => {
      a.addEventListener("click", () => {
        if (s) return;
        pendingI = +a.dataset.i;
        T(".opt-btn", t).forEach((btn) => {
          btn.classList.toggle("picked", +btn.dataset.i === pendingI),
            btn.classList.toggle("dimmed", +btn.dataset.i !== pendingI);
        }),
          confirmRev && (confirmRev.disabled = !1);
      });
    }),
      confirmRev &&
        confirmRev.addEventListener("click", () => {
          if (s || null == pendingI) return;
          s = !0;
          confirmRev.disabled = !0;
          const i = e.options[pendingI] === e.answer;
          T(".opt-btn", t).forEach((btn) => {
            (btn.disabled = !0),
              btn.classList.remove("picked", "dimmed"),
              e.options[+btn.dataset.i] === e.answer && btn.classList.add("correct");
          });
          const picked = t.querySelector('.opt-btn[data-i="' + pendingI + '"]');
          i
            ? m()
            : (picked && picked.classList.add("wrong"),
              f(),
              (c.hearts = Math.max(0, c.hearts - 1)));
          const o = S("#reviewFeedback");
          (o.hidden = !1),
            (o.className = "feedback-banner " + (i ? "ok" : "bad")),
            (o.innerHTML = `<span>${i ? "✓ Good" : "✗ Again"}</span><button type="button" id="btnRevNext">Continue</button>`),
            S("#btnRevNext").addEventListener("click", () => {
              D++,
                D >= n.length
                  ? ((c.reviewDone = !0),
                    (c.dueCount = 0),
                    (c.xp += 15),
                    M(15),
                    y(),
                    P("screenMain"),
                    _("practice"),
                    C("+15 XP · Review clear", "dragon-celebrate"),
                    j())
                  : W();
            });
        });
  }
  function q(e) {
    return s.find((t) => t.id === e.pair);
  }
  function V() {
    const e = S("#flipCoach");
    e && ((e.hidden = !0), (e.innerHTML = ""));
  }
  function j(e) {
    (e || (c.completed.has("l1") && c.flipDone)) &&
      (x(a.FINALE),
      (S("#finaleStats").textContent =
        `You earned ${c.xp} XP · ${c.streak}-day streak · ${c.completed.size} lesson cleared`),
      P("screenFinale"),
      y());
  }
  function Z(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const n = Math.floor(Math.random() * (t + 1));
      [e[t], e[n]] = [e[n], e[t]];
    }
    return e;
  }
  S("#btnStartTrial").addEventListener("click", function () {
    u(),
      x(a.LEARN),
      P("screenMain"),
      _("learn"),
      C("Follow the glowing node", "dragon-idle");
  }),
    S("#btnClaimXP").addEventListener("click", function () {
      y(),
        (c.xp += c.pendingXP),
        M(c.pendingXP),
        (c.pendingXP = 0),
        x(a.PRACTICE),
        P("screenMain"),
        _("practice"),
        C("XP claimed — Practice awaits", "dragon-celebrate");
    }),
    S("#btnCloseLesson").addEventListener("click", () => {
      P("screenMain"),
        x(c.completed.has("l1") ? a.PRACTICE : a.LEARN),
        _("learn");
    }),
    S("#btnCloseFlip").addEventListener("click", () => {
      P("screenMain"), _("practice"), c.flipDone && j(!0);
    }),
    S("#btnCloseReview").addEventListener("click", () => {
      P("screenMain"), _("practice");
    }),
    S("#btnCloseWrite").addEventListener("click", () => {
      P("screenMain"), _("practice");
    }),
    S("#practiceEntry").addEventListener("click", () => _("practice")),
    T(".tab").forEach((e) =>
      e.addEventListener("click", () => _(e.dataset.goto)),
    ),
    S("#btnKeepExploring").addEventListener("click", () => {
      (c.guided = !1),
        x(a.FINALE),
        P("screenMain"),
        _("learn"),
        (S("#trialStepLabel").textContent = "Exploring");
    }),
    S("#btnToPractice").addEventListener("click", () => {
      P("screenMain"), _("practice");
    });
  S("#btnInstall").addEventListener("click", (e) => {
    "file:" === location.protocol &&
      (e.preventDefault(),
      C("See MandarinPath/DEVICE_INSTALL.md in the repo", "dragon-idle"));
  }),
    P("screenSplash"),
    x(a.SPLASH);
})();
/* MALE_VOICE_RE pickMaleZhVoice Kevin male lock teach-before-test */
