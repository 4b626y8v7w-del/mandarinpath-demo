/* MandarinPath data */
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

  /* Vocab lexicon for teach cards + bilingual wrong coaching (EN↔ZH) */
  const VOCAB = [
    { zh: "你好", pinyin: "nǐ hǎo", en: "hi / hello", enAlts: ["hello", "hi", "hi / hello"] },
    { zh: "谢谢", pinyin: "xièxie", en: "thank you", enAlts: ["thank you", "thanks"] },
    { zh: "再见", pinyin: "zàijiàn", en: "goodbye", enAlts: ["goodbye", "bye"] },
    { zh: "我很好", pinyin: "wǒ hěn hǎo", en: "I'm fine", enAlts: ["I'm fine", "i'm fine", "how are you?"] },
  ];
  function lookupVocab(token) {
    if (!token) return null;
    const t = String(token).trim();
    const lower = t.toLowerCase();
    for (const v of VOCAB) {
      if (v.zh === t) return v;
      if (v.en.toLowerCase() === lower) return v;
      if (v.enAlts && v.enAlts.some((a) => a.toLowerCase() === lower)) return v;
    }
    return null;
  }
  function pairLabel(v, fallback) {
    if (v) return `${v.zh} (${v.pinyin}) — ${v.en}`;
    return fallback || "";
  }
  function resolvePair(token) {
    const v = lookupVocab(token);
    if (v) return { zh: v.zh, pinyin: v.pinyin, en: v.en };
    /* Heuristic: CJK → treat as ZH-only; else EN-only */
    if (/[\u4e00-\u9fff]/.test(token)) return { zh: token, pinyin: "", en: "" };
    return { zh: "", pinyin: "", en: token };
  }

  /* Short demo lesson — Hello (teach-before-test + quiz) */
  const HELLO_LESSON = {
    id: "l1",
    title: "Hello",
    titleZh: "你好",
    xp: 25,
    exercises: [
      /* T1 teach cards — map forms→meanings before any scored quiz */
      { type: "teach", zh: "你好", pinyin: "nǐ hǎo", en: "hi / hello" },
      { type: "teach", zh: "谢谢", pinyin: "xièxie", en: "thank you" },
      { type: "teach", zh: "再见", pinyin: "zàijiàn", en: "goodbye" },
      {
        type: "mc",
        direction: "zh_to_en",
        prompt: "你好",
        pinyin: "nǐ hǎo",
        meaningEn: "hi / hello",
        options: ["hi / hello", "thank you", "goodbye", "I'm fine"],
        answer: "hi / hello",
      },
      {
        type: "mc",
        direction: "en_to_zh",
        prompt: "thank you",
        meaningZh: "谢谢",
        meaningPinyin: "xièxie",
        options: ["谢谢", "再见", "你好", "我很好"],
        answer: "谢谢",
      },
      {
        type: "listen",
        prompt: "再见",
        pinyin: "zàijiàn",
        meaningEn: "goodbye",
        options: ["goodbye", "hello", "how are you?", "thank you"],
        answer: "goodbye",
      },
      {
        type: "tiles",
        promptEn: "Say: hello",
        tiles: ["你", "好"],
        distractors: ["谢", "再"],
        answer: "你好",
        answerPinyin: "nǐ hǎo",
        answerEn: "hi / hello",
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
  window.MP_UNITS = UNITS;
  window.MP_VOCAB = VOCAB;
  window.MP_HELLO_LESSON = HELLO_LESSON;
  window.MP_REVIEW_CARDS = REVIEW_CARDS;
  window.MP_FLIP_PAIRS = FLIP_PAIRS;
  window.MP_TRIAL = TRIAL;
  window.MP_TRIAL_LABELS = TRIAL_LABELS;
  window.MP_TRIAL_PCT = TRIAL_PCT;
  window.MP_lookupVocab = lookupVocab;
  window.MP_pairLabel = pairLabel;
  window.MP_resolvePair = resolvePair;
})();
