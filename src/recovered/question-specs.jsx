// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { em, ef, SCENARIO_KEYS } from "./scenario-inputs.jsx";
import { er, eh, eu } from "./scenario-inputs-2.jsx";
import { eP, eT } from "./scenario-presets-2.jsx";
let ep = em.w[0];
function getPresetScenario(e) {
  var t;
  let a;
  t = er(e);
  return {
    production: {
      w: (a = (e, t, a, s) => ({
        x0: e,
        x30: t,
        xb: a ?? s,
      }))(t.mAnchor, t.m2030, t.mCeil, ep),
      a: {
        x0: t.aAnchor,
        g: t.aSlope,
      },
      d: a(t.dAnchor, t.d2030, t.dCeil, 1),
      levelForm: "exact",
      eps: t.eps,
      sigma: t.sigma,
    },
    labor: {
      phi: {
        x0: t.psiAnchor,
        xb: t.psiCeil,
        k: t.psiKappa,
      },
      rho: t.rho,
      mu: t.muCN,
      theta: t.theta,
      gamma: t.gamma,
      ubar: t.uBar ?? ef,
      qbar: t.qBar,
    },
  };
}
let eI = Object.fromEntries(
  SCENARIO_KEYS.map((e) => [e, getPresetScenario(e)]),
);
let eF = (e) => eI[e].production.w;
let eW = (e) => eI[e].production.d;
let eC = (e) => eI[e].production.a;
let eB = eF("central").x0;
let eE = eB / ep;
let eG = eW("central").x0;
let eq = eC("central").x0;
let eX = Math.exp(eq);
let eQ = [
  {
    v: 1,
    label: "About the same",
  },
  {
    v: 1.5,
    label: "Half again as much (1.5×)",
  },
  {
    v: 2,
    label: "Twice as much (2×)",
  },
  {
    v: 4,
    label: "Four times as much (4×)",
  },
  {
    v: 10,
    label: "Ten times as much or more",
  },
];
let eZ = eQ[eQ.length - 1].v;
let e1 = (e) => (e <= 0 ? 600 : (3 * eh) / e);
e1(eI.conservative.labor.mu);
let e2 = e1(eI.central.labor.mu);
let e5 = e1(eI.fast.labor.mu);
let e4 = [
  {
    v: 1.5,
    label: "Quicker than today (1–2 months)",
  },
  {
    v: 3,
    label: "Like today (~3 months)",
  },
  {
    v: 6,
    label: "Twice as long (~6 months)",
  },
  {
    v: 9,
    label: "Around 9 months",
  },
  {
    v: 12,
    label: "About a year",
  },
  {
    v: 24,
    label: "Around two years",
  },
  {
    v: 600,
    label: "More than three years, or never",
  },
];
let e8 = [
  "1–2 months",
  "~3 months",
  "~6 months",
  "~9 months",
  "A year",
  "2 years",
  "3+ years or never",
];
let e7 = (e) => eP(e.capability) * eP(e.adoption);
let tl = Object.fromEntries(SCENARIO_KEYS.map((e) => [e, eI[e].labor.phi.x0]));
let to = Object.fromEntries(SCENARIO_KEYS.map((e) => [e, eF(e).x30]));
let tr = Object.fromEntries(SCENARIO_KEYS.map((e) => [e, eW(e).x30]));
let tn = Object.fromEntries(SCENARIO_KEYS.map((e) => [e, eT(eC(e), eu)]));
let th = (e, t) =>
  e.reduce((a, s, l) => (Math.abs(s.v - t) < Math.abs(e[a].v - t) ? l : a), 0);
let tm = (e) => `${Math.round(100 * e)}%`;
let tp = (e) => `${Math.round(100 * e)} of 100`;
let tf = [
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
let tg = [
  {
    v: 0.05,
    label: "Almost none",
  },
  {
    v: 0.25,
    label: "Some of them",
  },
  {
    v: tl.conservative,
    label: "About half",
  },
  {
    v: tl.central,
    label: "Most of them",
  },
  {
    v: tl.fast,
    label: "Almost all of them",
  },
];
[
  {
    id: "capability",
    control: "ten",
    visual: "grid",
    statFor: (e) => `${tp(e.capability)} within reach`,
    category: "Capabilities",
    title:
      "Of every 100 knowledge-work tasks, how many will AI be capable of doing?",
    ask: "What fraction of all knowledge work will AI be capable of doing by 2030?",
    askEmph: "capable of doing",
    context:
      "What the latest frontier models could do, whether or not they’re widely used.",
    sliders: [
      {
        key: "capability",
        label: "Tasks within AI’s reach",
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
            v: to.conservative / ep,
            kind: "conservative",
          },
          {
            v: to.central / ep,
            kind: "central",
          },
          {
            v: to.fast / ep,
            kind: "fast",
          },
        ],
        lowBelow: eE,
        lowNote: `Below today: AI already shows up in about ${Math.round(100 * eE)} of every 100 knowledge-work tasks.`,
        highAbove: to.fast / ep,
        highNote: `Beyond the paper: its extreme scenario reaches about ${Math.round(100 * (to.fast / ep))} of 100 by 2030, on the way to nearly all of it.`,
        poles: ["None of them", "All 100"],
        formatValue: tp,
        pillSuffix: "tasks",
        formatLabel: () => "knowledge-work tasks AI could do",
      },
    ],
    itemsTitle: "Within reach at this level, even…",
    items: [
      {
        at: 0.02,
        text: "Could draft everyday emails, code, and quick summaries",
      },
      {
        at: 0.12,
        text: "Could handle customer calls and requests start to finish",
      },
      {
        at: 0.22,
        text: "Could write most of the world’s new software and apps",
      },
      {
        at: 0.32,
        text: "Could run a company’s entire back office and paperwork",
      },
      {
        at: 0.42,
        text: "Could handle important financial transactions end to end",
      },
      {
        at: 0.52,
        text: "Could drive company strategy, planning, and process",
      },
      {
        at: 0.64,
        text: "Could invent new medicines, materials, and technologies",
      },
      {
        at: 0.78,
        text: "Could design new bridges, buildings, and infrastructure",
      },
      {
        at: 0.9,
        text: "Could run entire industries end to end, top to bottom",
      },
    ],
  },
  {
    id: "adoption",
    control: "ten",
    visual: "grid",
    statFor: (e) => `${tp(e7(e))} being done`,
    primaryValue: (e) => e7(e),
    category: "Adoption",
    title: "Of the tasks AI can do, how many will it actually be doing?",
    ask: "Of every 100 tasks AI is capable of doing in 2030, how many will it actually be doing?",
    askFor: (e) =>
      `Of those ${Math.round(100 * e.capability)} tasks AI is capable of doing in 2030, how many will it actually be doing?`,
    askEmph: "actually be doing",
    context:
      "Just because a model is capable of doing something may or may not mean that capability is in use to its full potential.",
    sliders: [
      {
        key: "adoption",
        label: "Of the capable tasks, how many run with AI?",
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
            v: tr.conservative,
            kind: "conservative",
          },
          {
            v: tr.central,
            kind: "central",
          },
          {
            v: tr.fast,
            kind: "fast",
          },
        ],
        lowBelow: eG,
        lowNote: `Below today: about ${Math.round(100 * eG)}% of the capable tasks already run with AI.`,
        highAbove: tr.fast,
        highNote: `Beyond the paper: its extreme scenario reaches about ${Math.round(100 * tr.fast)}% by 2030.`,
        poles: ["None of them", "All of them"],
        formatValue: tm,
        formatPill: (e) => `${Math.round(100 * e)}% of capable tasks`,
        formatLabel: () => "of the capable tasks, actually done by AI",
      },
    ],
    itemsTitle: "At this level AI is doing even…",
    items: tf,
  },
  {
    id: "alone",
    visual: "grid",
    statFor: (e) => `${tm(e.alone)} on its own`,
    primaryValue: (e) => e7(e),
    category: "Autonomy",
    title: "Of the work AI does, how much runs on its own?",
    ask: "For those AI tasks in 2030, how many will be fully automated?",
    askFor: (e) =>
      `For those ${Math.round(100 * e7(e))} AI tasks in 2030, how many will be fully automated?`,
    askEmph: "fully automated",
    context: "What runs on its own, and what still needs a person in the loop?",
    sliders: [
      {
        key: "alone",
        label: "How many of those run on their own?",
        kind: "pct",
        min: 0,
        max: 1,
        step: 0.005,
        detents: [
          {
            v: tl.conservative,
            kind: "conservative",
          },
          {
            v: tl.central,
            kind: "central",
          },
          {
            v: tl.fast,
            kind: "fast",
          },
        ],
        steps: tg,
        formatPill: (e) => `${Math.round(100 * e)}% autonomous`,
        poles: ["People guide most", "AI is autonomous"],
        poleIcons: true,
        formatValue: tm,
        formatLabel: () => "automated",
      },
    ],
    itemsTitle: "At this level AI is doing even…",
    items: tf,
  },
  {
    id: "productivity",
    category: "Productivity",
    visual: "pile",
    title:
      "On the tasks where AI is involved, how much more gets done in an hour?",
    ask: "On the tasks where AI is involved, how much more gets done in an hour in 2030 than doing them without AI?",
    askFor: (e) =>
      `On those ${Math.round(100 * e7(e))} tasks where AI is involved, how much more gets done in an hour in 2030 than doing them without AI?`,
    askEmph: "how much more gets done",
    context:
      "Imagine a week in the life of a 2030 knowledge worker: how much more are they getting done because of AI?",
    sliders: [
      {
        key: "gain",
        label: "Output per hour, against no AI",
        kind: "steps",
        min: 1,
        max: 30,
        step: 0.01,
        steps: eQ,
        detents: [
          {
            v: eX,
            kind: "today",
          },
          {
            v: Math.exp(tn.conservative),
            kind: "conservative",
          },
          {
            v: Math.exp(tn.central),
            kind: "central",
          },
          {
            v: Math.exp(tn.fast),
            kind: "fast",
          },
        ],
        highAbove: eZ,
        highNote:
          "Beyond the paper: its extreme scenario reads a bit over twice as much by 2030.",
        poles: ["Same as without AI", "Ten times or more"],
        formatValue: (e) => eQ[th(eQ, e)].label,
        formatPill: (e) =>
          e < 1.05
            ? "Same as without AI"
            : `${e < 1.05 ? "1×" : `${e < 10 ? e.toFixed(e % 1 ? 2 : 0).replace(/0$/, "") : Math.round(e)}\xd7`} as much`,
        formatLabel: () =>
          "as much done in an hour, against doing it without AI",
      },
    ],
    itemsTitle: "What that pace looks like",
    items: [
      {
        at: 1.25,
        text: "Friday afternoon comes free",
      },
      {
        at: 1.5,
        text: "A day and a half a week comes back",
      },
      {
        at: 2,
        text: "The week’s work fits in half of it",
      },
      {
        at: 3,
        text: "A team of three does what ten did",
      },
      {
        at: 5,
        text: "A month of this work takes a week",
      },
      {
        at: 10,
        text: "A year of it fits in five weeks",
      },
      {
        at: 30,
        text: "The task stops being anyone’s job to pace",
      },
    ],
  },
  {
    id: "adjust",
    visual: "gap",
    category: "Adjustment",
    title:
      "How long before a displaced worker lands in a different occupation?",
    ask: "When AI displaces someone from their occupation in 2030, how long until they find work in a new one?",
    askEmph: "find work in a new one",
    context: "Today it takes about 3 months to find a job after losing one.",
    sliders: [
      {
        key: "months",
        label: "Time to land in a different occupation",
        kind: "steps",
        min: 1.5,
        max: 600,
        step: 1,
        steps: e4,
        detents: [
          {
            v: 3,
            kind: "conservative",
          },
          {
            v: e2,
            kind: "central",
          },
          {
            v: e5,
            kind: "fast",
          },
        ],
        poles: ["Like today", "Three years or never"],
        formatValue: (e) => e4[th(e4, e)].label,
        formatPill: (e) => e8[th(e4, e)],
        formatLabel: () => "to land in a different occupation",
      },
    ],
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
        text: "Long searches show up in the unemployment rate, and some occupations become one-way exits",
      },
    ],
  },
].flatMap((e) => e.sliders);
let tx = (e, t) =>
  e.reduce((a, s, l) => (Math.abs(s.v - t) < Math.abs(e[a].v - t) ? l : a), 0);
let t_ = [
  "1–2 months",
  "~3 months",
  "~6 months",
  "~9 months",
  "A year",
  "2 years",
  "3+ years or never",
];
let ty = 0.2748671433378987;
let tw = 0.2053833865519657;
let tb = 1.3498588075760032;
let tv = 0.509862808575438;
let tk = 0.3885872905810913;
let tM = 1.5651786956535216;
let tj = 0.8572763985701216;
let tS = 0.6765727128781053;
let tN = 2.225540928492468;
let tA = (e) => Math.max(0, Math.min(1, e));
let tT = (e) => `${Math.round(100 * e)} of 100`;
let tL = (e) =>
  e < 1.05
    ? "1×"
    : `${e < 10 ? e.toFixed(e % 1 ? 2 : 0).replace(/0$/, "") : Math.round(e)}\xd7`;
let tI = (e) => tA(e.capability) * tA(e.adoption);
let tW = (e) => e.detents.find((e) => "today" === e.kind)?.v;
let tC = (e, t) => t >= e.at - 1e-9;
function tB(e) {
  return {
    reach: tA(e.capability),
    adoption: tA(e.adoption),
    autonomy: tA(e.alone),
    productivity: Math.log(Math.max(1, e.gain)),
    newWork: 0.5,
    months: e.months,
  };
}
let tE = {
  "Some of them": "Some",
  "Most of them": "Most",
  "Almost all of them": "Almost all",
};
let tP = [
  "1–2 mon",
  "~3 mon",
  "~6 mon",
  "~9 mon",
  "1 yr",
  "2 yrs",
  "3+ yrs/never",
];
export {
  ep,
  getPresetScenario,
  eI,
  eF,
  eW,
  eC,
  eB,
  eE,
  eG,
  eq,
  eX,
  eQ,
  eZ,
  e1,
  e2,
  e5,
  e4,
  e8,
  e7,
  tl,
  to,
  tr,
  tn,
  th,
  tm,
  tp,
  tf,
  tg,
  tx,
  t_,
  ty,
  tw,
  tb,
  tv,
  tk,
  tM,
  tj,
  tS,
  tN,
  tA,
  tT,
  tL,
  tI,
  tW,
  tC,
  tB,
  tE,
  tP,
};
