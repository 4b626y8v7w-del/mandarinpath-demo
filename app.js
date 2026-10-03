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
