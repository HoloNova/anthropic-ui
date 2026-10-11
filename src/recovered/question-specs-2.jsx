// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import {
  tT,
  eE,
  ty,
  tv,
  tj,
  tI,
  eG,
  tw,
  tk,
  tS,
  tg,
  tx,
  tL,
  eQ,
  eX,
  tb,
  tM,
  tN,
  t_,
  e4,
} from "./question-specs.jsx";
import { ez, tu } from "./scenario-presets.jsx";
import { NEW_TASK_INK } from "./palette.jsx";
let t$ = [
  {
    at: 0.02,
    text: "Drafting everyday emails, code, and quick summaries",
  },
  {
    at: 0.12,
    text: "Handling customer calls and requests start to finish",
  },
  {
    at: 0.22,
    text: "Writing most of the world’s new software and apps",
  },
  {
    at: 0.32,
    text: "Running a company’s entire back office and paperwork",
  },
  {
    at: 0.42,
    text: "Handling important financial transactions end to end",
  },
  {
    at: 0.52,
    text: "Driving company strategy, planning, and process",
  },
  {
    at: 0.64,
    text: "Inventing new medicines, materials, and technologies",
  },
  {
    at: 0.78,
    text: "Designing new bridges, buildings, and infrastructure",
  },
  {
    at: 0.9,
    text: "Running entire industries end to end, top to bottom",
  },
];
let tF = [
  {
    id: "capability",
    dialDesc: "What tasks can AI do?",
    category: "Capabilities",
    illo: "capable",
    ask: "What fraction of all knowledge work—work you do mainly with your head, not your hands—will AI be capable of doing by 2030?",
    askEmph: "capable of doing",
    context:
      "Think about everything the best models could do, whether or not they’re widely used.",
    statFor: (e) => `${tT(e.capability)} within reach`,
    slider: {
      key: "capability",
      kind: "pct",
      min: 0,
      max: 1,
      step: 0.005,
      wizardMin: eE,
      detents: [
        {
          v: eE,
          kind: "today",
        },
        {
          v: ty,
          kind: "conservative",
        },
        {
          v: tv,
          kind: "central",
        },
        {
          v: tj,
          kind: "fast",
        },
      ],
      lowBelow: eE,
      lowNote: `Below today: AI already shows up in about ${Math.round(100 * eE)} of every 100 knowledge-work tasks.`,
      highAbove: tj,
      highNote: `Beyond the paper: its extreme scenario reaches about ${Math.round(100 * tj)} of 100 by 2030, on the way to nearly all of it.`,
      poles: ["None of them", "All 100"],
      formatValue: tT,
      formatLabel: () => "knowledge-work tasks AI could do",
    },
    itemsTitle: "Within reach at this level, even…",
    items: [
      {
        at: 0.11875,
        text: "Write routine business emails and documents",
      },
      {
        at: 0.2375,
        text: "Do a small business’s monthly bookkeeping",
      },
      {
        at: 0.35625,
        text: "Prepare an accurate personal tax return from someone’s documents",
      },
      {
        at: 0.475,
        text: "Draft and negotiate a routine commercial contract",
      },
      {
        at: 0.59375,
        text: "Build, ship and maintain a working software product",
      },
      {
        at: 0.7125,
        text: "Design, run and write up a scientific study that gets published",
      },
      {
        at: 0.83125,
        text: "Run a small online business end to end profitably, with no human employees",
      },
      {
        at: 0.95,
        text: "Independently make a scientific discovery important enough to win a Nobel Prize",
      },
    ],
  },
  {
    id: "adoption",
    dialDesc: "How much do people use AI?",
    category: "Adoption",
    illo: "doing",
    ask: "Even when AI can do a task, people don’t always use it for that task. Out of every 100 instances of a task AI can do in 2030, how many will AI actually be doing?",
    askEmph: "actually be doing",
    context:
      "Think about reasons people and organizations might not use AI for certain tasks—it costs money, it isn’t allowed, nobody set it up, or they’d simply rather do it themselves.",
    statFor: (e) => `${tT(tI(e))} being done`,
    primaryValue: tI,
    slider: {
      key: "adoption",
      kind: "pct",
      min: 0,
      max: 1,
      step: 0.005,
      detents: [
        {
          v: eG,
          kind: "today",
        },
        {
          v: tw,
          kind: "conservative",
        },
        {
          v: tk,
          kind: "central",
        },
        {
          v: tS,
          kind: "fast",
        },
      ],
      lowBelow: eG,
      lowNote:
        "Below today: about 10% of the capable tasks already run with AI.",
      highAbove: 0.7735918637062407,
      highNote: "Beyond the paper: its scenarios top out near 95%.",
      poles: ["None of them", "All of them"],
      formatValue: tT,
      formatLabel: () => "instances done with AI",
    },
    itemsTitle: "At this level AI is doing even…",
    items: t$,
  },
  {
    id: "alone",
    dialDesc: "How much does AI do by itself?",
    category: "Autonomy",
    illo: "split",
    ask: "For those AI tasks in 2030, how many will be fully automated?",
    askFor: (e) =>
      `For those ${Math.round(100 * tI(e))} AI tasks in 2030, how many will be fully automated?`,
    askEmph: "fully automated",
    context:
      "What does AI do on its own? What tasks still need a human in the loop?",
    statFor: (e) => {
      let t;
      return `${((t = e.alone), `${Math.round(100 * t)}%`)} on its own`;
    },
    primaryValue: tI,
    slider: {
      key: "alone",
      kind: "pct",
      min: 0,
      max: 1,
      step: 0.005,
      stops: tg,
      detents: [
        {
          v: ez,
          kind: "today",
        },
      ],
      poles: ["People guide most", "AI is autonomous"],
      formatValue: (e) => tg[tx(tg, e)].label,
      formatLabel: () => "automated",
    },
    itemsTitle: "At this level AI is doing even…",
    items: t$,
  },
  {
    id: "productivity",
    dialDesc: "How much more productive does AI make people?",
    category: "Productivity",
    illo: "pace",
    ask: "In tasks where AI is involved, how much more gets done in an hour in 2030, compared with doing the tasks without AI?",
    askEmph: "how much more gets done",
    context:
      "Think about how much someone gets done in an hour on just these tasks. For instance, say a nurse currently writes discharge instructions without AI. But in 2030, that task is either supported by AI or automated entirely. In 2030, how many patients’ discharge instructions can the nurse get through in an hour, compared to an hour of writing them on her own?",
    statFor: (e) =>
      e.gain < 1.05 ? "Same as without AI" : `${tL(e.gain)} as much`,
    slider: {
      key: "gain",
      kind: "steps",
      min: 1,
      max: 30,
      step: 0.01,
      stops: eQ,
      detents: [
        {
          v: eX,
          kind: "today",
        },
        {
          v: tb,
          kind: "conservative",
        },
        {
          v: tM,
          kind: "central",
        },
        {
          v: tN,
          kind: "fast",
        },
      ],
      highAbove: 2.7870954605658507,
      highNote:
        "Beyond the paper: its extreme scenario reads a bit over twice as much by 2030.",
      poles: ["Same as without AI", "Ten times as much or more"],
      formatValue: (e) => eQ[tx(eQ, e)].label,
      formatStat: (e) => (e < 1.05 ? "1×" : `${tL(e)}`),
    },
    itemsTitle: "What that pace looks like",
    items: [
      {
        at: 1.5,
        text: "A day and a half a week comes back",
      },
      {
        at: 2,
        text: "The week’s work fits in half of it",
      },
      {
        at: 4,
        text: "A month of this work takes a week",
      },
      {
        at: 10,
        text: "A year of it fits in five weeks",
      },
    ],
  },
  {
    id: "adjust",
    dialDesc: "How long does it take people to find a new job?",
    category: "Adjustment",
    illo: "months",
    ask: "When AI displaces someone from their occupation in 2030, how long until they find work in a new occupation?",
    askEmph: "how long until they find work",
    context:
      "Today it takes people about three months to find a job after losing one, on average.",
    statFor: (e) => t_[tx(e4, e.months)],
    slider: {
      key: "months",
      kind: "steps",
      min: 1.5,
      max: 600,
      step: 1,
      stops: e4,
      detents: [
        {
          v: 3,
          kind: "today",
        },
      ],
      poles: ["Quicker than today", "Most never make it back"],
      formatValue: (e) => e4[tx(e4, e)].label,
      formatStat: (e) => t_[tx(e4, e)],
    },
    itemsTitle: "What that wait means",
    items: [
      {
        at: 3,
        text: "Job changes look like any other year",
      },
      {
        at: 9,
        text: "Displaced workers wait months longer between jobs",
      },
      {
        at: 24,
        text: "Retraining becomes the normal way back into work",
      },
      {
        at: 600,
        text: "Some occupations become one-way exits",
      },
    ],
  },
];
let tR = {
  ...tu,
};
let tG = {
  public: "#6a9bcc",
  visitors: NEW_TASK_INK,
};
function createSeededRandom(e) {
  return function () {
    e |= 0;
    let t = Math.imul((e = (e + 0x6d2b79f5) | 0) ^ (e >>> 15), 1 | e);
    return (
      (((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) ^ (t >>> 14)) >>> 0) /
      0x100000000
    );
  };
}
function createSeededNormal(e, t) {
  let a = createSeededRandom(e),
    s = [];
  for (let e = 0; e <= t + 1; e++) s.push(2 * a() - 1);
  return function (e) {
    let a = Math.floor((e = Math.max(0, Math.min(1, e)) * t)),
      l = e - a;
    return s[a] + (s[a + 1] - s[a]) * (l * l * (3 - 2 * l));
  };
}
export { t$, tF, tR, tG, createSeededRandom, createSeededNormal };
