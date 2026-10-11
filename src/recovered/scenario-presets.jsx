// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { eM, eT, eP } from "./scenario-presets-2.jsx";
import {
  ep,
  eI,
  eW,
  eZ,
  eC,
  eq,
  eB,
  eF,
  eG,
  e4,
  tl,
  to,
  tr,
  tn,
  e1,
} from "./question-specs.jsx";
import { eu, ec, eh, ew } from "./scenario-inputs-2.jsx";
import { ModelKernel } from "./ModelKernel.jsx";
import { SCENARIO_KEYS } from "./scenario-inputs.jsx";
let l;
let ej = (e, t = 1) => [
  {
    key: "x0",
    label: "Mid-2026 anchor (x₀)",
    min: e[0],
    max: e[1],
    step: 0.01,
    digits: 2,
    tip: eM,
  },
  {
    key: "x30",
    label: "Value at 2030",
    min: 0.02,
    max: t,
    step: 0.01,
    digits: 2,
    tip: "Where the curve reads at the start of 2030. Since the note’s V0.91 this IS the scenario parameter: the ceiling is fixed at the natural maximum and the slope follows from the two.",
  },
];
let eS = [
  {
    id: "production.w",
    section: "production",
    title: "Tasks affected (m)",
    kind: "logistic",
    sliders: ej([0.02, 0.4], Math.floor(100 * ep) / 100),
    note: `How much of the economy’s work AI can touch: the share of all tasks it can do or meaningfully speed up. All of it falls on the exposed occupations, ${Math.round(100 * ep)}% of employment, so the ceiling stops there.`,
  },
  {
    id: "production.a",
    section: "production",
    title: "Productivity gains (a)",
    kind: "loglinear",
    sliders: [
      {
        key: "x0",
        label: "Mid-2026 anchor (x₀)",
        min: (l = [0.1, 0.6])[0],
        max: 0.6,
        step: 0.01,
        digits: 2,
        tip: eM,
      },
      {
        key: "g",
        label: "Yearly gain (g, /yr)",
        min: 0,
        max: 0.3,
        step: 0.005,
        digits: 3,
        tip: "How much this gain adds each year, in a straight line. Unlike the others, it has no ceiling.",
      },
    ],
    note: "How much cheaper a task gets when AI does it, counting review time and AI costs.",
  },
  {
    id: "production.d",
    section: "production",
    title: "Diffusion (d)",
    kind: "logistic",
    sliders: ej([0.02, 0.3]),
    note: "How much of that potential is actually in use: where “can be affected” meets “is being done.”",
  },
  {
    id: "labor.phi",
    section: "labor",
    title: "Automation share (ψ)",
    kind: "psi",
    sliders: [
      {
        key: "x0",
        label: "Mid-2026 anchor (ψ₀)",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        digits: 2,
        tip: "The share of AI’s work done outright, with nobody in the loop. The three scenarios hold it flat at 0.5, 0.75 and 0.9: it is one of the things that makes them more or less disruptive.",
      },
      {
        key: "xb",
        label: "Ceiling (ψ̄)",
        min: 0.05,
        max: 0.99,
        step: 0.01,
        digits: 2,
        tip: "Where the share heads if it rises. Every scenario sets this equal to the anchor, so the share holds flat; a ceiling below the anchor also holds flat (the model has no falling path).",
      },
      {
        key: "k",
        label: "Speed (κ_ψ, /yr)",
        min: 0.1,
        max: 3,
        step: 0.05,
        digits: 2,
        tip: "How quickly the curve climbs from its mid-2026 anchor toward the ceiling.",
      },
    ],
    note: "Of the work AI touches, how much it does outright versus assisting a worker: the wedge between productivity and pay.",
  },
];
let eN = [
  {
    id: "production.eps",
    section: "production",
    key: "eps",
    label: "Capital elasticity (ε)",
    min: 1,
    max: 10,
    step: 0.5,
    digits: 1,
    tip: "How easily the economy adds capital when AI raises its return (the note’s eq 6: capital flows in along Δln K = ε Δln r). 3 in every scenario, the model team’s value. Lower and more of the gain goes to capital’s owners for a while; the team’s app also offers a pegged rental (ε = ∞), which this slider does not reach.",
  },
  {
    id: "production.sigma",
    section: "production",
    key: "sigma",
    label: "Substitution across tasks (σ)",
    min: 0.1,
    max: 0.9,
    step: 0.05,
    digits: 2,
    tip: "How easily the economy shifts between tasks as AI makes some cheaper (the CES elasticity across tasks). 0.5 in every scenario, the note’s value. For the team’s own sensitivity look; the paper does not vary it.",
  },
  {
    id: "labor.rho",
    section: "labor",
    key: "rho",
    label: "New tasks per task automated (ρ)",
    min: 0,
    max: 1,
    step: 0.05,
    digits: 2,
    tip: "How much new human work automation creates, as a share of the work it absorbs. History reads near 0.5; the scenarios use 0.5, 0.25 and 0, less new work the more disruptive the scenario.",
  },
  {
    id: "labor.mu",
    section: "labor",
    key: "mu",
    label: "Cross-occupation search (μ)",
    min: 0,
    max: 1,
    step: 0.01,
    digits: 2,
    tip: "How well someone displaced from exposed work competes for openings in the other occupations, and the reverse: 1 is as well as an insider, 0 is no way across. 0.17 is what the CPS switching data read in normal times, and normal times are always solved there; the scenarios use 0.17, 0.08 and 0.04 once AI arrives. The Adjustment question sets this.",
  },
  {
    id: "labor.theta",
    section: "labor",
    key: "theta",
    label: "Posting speed (θ, monthly)",
    min: 0.02,
    max: 1,
    step: 0.01,
    digits: 2,
    tip: "The share of the other occupations’ shortfall posted as openings each month. Faster means the new jobs appear sooner. 0.10, 0.25 and 0.50 a month by scenario. Since the model’s V0.96 the layoff side is set by the cognitive wage instead (the rigidity below).",
  },
  {
    id: "labor.gamma",
    section: "labor",
    key: "gamma",
    label: "Wage rigidity (ξ, yearly)",
    min: 0,
    max: 0.95,
    step: 0.05,
    digits: 2,
    tip: "How slowly the cognitive wage falls when AI cuts the demand for cognitive work. Each year the wage closes 1 − ξ of the gap to the wage that would clear the market: 0 is a fully flexible wage (pay falls, few layoffs), near 1 a frozen one (pay holds, the shortfall shows up as layoffs and unemployment). 0.5 in every scenario, the model team’s reading of the wage-setting evidence.",
  },
  {
    id: "labor.ubar",
    section: "labor",
    key: "ubar",
    label: "Normal unemployment (Ū)",
    min: 0.02,
    max: 0.08,
    step: 0.001,
    digits: 3,
    tip: "The unemployment rate in normal times, where the flow block starts and where it returns once the shift is done: 3.84% in the CPS for 2025 (people with a previous job), which the exposed occupations reach at 2.9% and the rest at 5.4%.",
  },
  {
    id: "labor.qbar",
    section: "labor",
    key: "qbar",
    label: "Normal separations (q̄, yearly)",
    min: 0.04,
    max: 0.24,
    step: 0.005,
    digits: 3,
    tip: "The share of workers who leave a job in a normal year: about 0.05 leave the labor force and 0.06 change occupation, 0.11 in all. This is the attrition that can carry work out of exposed occupations without layoffs.",
  },
];
function eA(e, t) {
  var a, s, l;
  let o;
  o =
    "k" in e
      ? {
          anchor: e.x0,
          ceil: e.xb,
          kappa: e.k,
        }
      : {
          anchor: e.x0,
          ceil: e.xb,
          kappa:
            ((a = e.x0),
            (s = e.xb),
            (l = e.x30) > a
              ? l < s
                ? Math.min(
                    3,
                    Math.max(
                      0,
                      Math.log(((s - a) / a) * (l / (s - l))) / (eu - ec),
                    ),
                  )
                : 3
              : 0),
        };
  return ModelKernel.logisticAt(t, o, ec);
}
function eL(e, t, a) {
  let [s, l] = t.split("."),
    o = structuredClone(e);
  o[s][l] = a;
  return o;
}
let e$ = eI.central;
let eR = eu - ec;
let eO = eW("central").xb;
let ez = eI.conservative.labor.phi.x0;
let eH = (e, t, a) => ({
  x0: e,
  x30: a,
  xb: t,
});
let eD = (e, t) => t.find((t) => 1e-12 > Math.abs(t - e)) ?? e;
let eV = eI.central.labor.phi.k;
let eY = SCENARIO_KEYS.map((e) => ({
  scenario: e,
  at: eI[e].labor.phi.x0,
  value: eI[e].labor.rho,
}));
let eU = e$.labor.rho;
let eK = Math.log(30);
function eJ(e) {
  let t = Math.log(Math.min(eZ, Math.max(1, e))),
    a = SCENARIO_KEYS.find((e) => 1e-12 > Math.abs(eT(eC(e), eu) - t));
  return a
    ? {
        ...eC(a),
      }
    : t <= eq
      ? {
          x0: t,
          g: 0,
          ceil: eK,
        }
      : {
          x0: eq,
          g: (t - eq) / eR,
          ceil: eK,
        };
}
let e0 = (e) => {
  if (e >= 600) return 0;
  let t = Math.min(1, (3 / Math.max(1, e)) * eh),
    a = SCENARIO_KEYS.find((e) => 1e-12 > Math.abs(eI[e].labor.mu - t));
  return a ? eI[a].labor.mu : t;
};
let e3 = SCENARIO_KEYS.map((e) => ({
  scenario: e,
  at: eI[e].labor.mu,
  value: eI[e].labor.theta,
}));
let e6 = e$.labor.theta;
function e9(e, t) {
  for (let a = 0; a < e.length; a++) if (1e-9 > Math.abs(t - e[a])) return a;
  if (t <= e[0]) return 0;
  for (let a = 0; a < e.length - 1; a++)
    if (t < e[a + 1]) return a + (t - e[a]) / (e[a + 1] - e[a]);
  return e.length - 1;
}
let te = [
  {
    label: "Today",
    scenario: null,
    obs: eB,
    value: eH(eB, ep, eB),
  },
  ...SCENARIO_KEYS.map((e) => ({
    label: ew[e],
    scenario: e,
    obs: eF(e).x30,
    value: eF(e),
  })),
  {
    label: "All knowledge work",
    scenario: null,
    obs: ep,
    value: eH(eB, ep, ep),
  },
];
let tt = [
  {
    label: "Today",
    scenario: null,
    obs: eG,
    value: eH(eG, eO, eG),
  },
  ...SCENARIO_KEYS.map((e) => ({
    label: ew[e],
    scenario: e,
    obs: eW(e).x30,
    value: eW(e),
  })),
  {
    label: "Every instance",
    scenario: null,
    obs: eO,
    value: eH(eG, eO, eO),
  },
];
let ta = [
  {
    label: "No gain",
    scenario: null,
    obs: 0,
    value: {
      x0: 0,
      g: 0,
    },
  },
  ...SCENARIO_KEYS.map((e) => ({
    label: ew[e],
    scenario: e,
    obs: eT(eC(e), eu),
    value: eC(e),
  })),
  {
    label: `${eZ}\xd7`,
    scenario: null,
    obs: Math.log(eZ),
    value: eJ(eZ),
  },
];
let ts = e4.map((e) => ({
  label: e.label,
  months: e.v,
  mu: e0(e.v),
  theta: e6,
}));
function ti(e, t) {
  let a,
    s,
    l = eP(e.capability) * ep,
    o = eP(e.adoption),
    r = Math.log(Math.max(1, e.gain)),
    n = eH(
      eB,
      ep,
      eD(
        Math.min(Math.max(eP(e.capability) * ep, eB), ep),
        SCENARIO_KEYS.map((e) => eF(e).x30),
      ),
    ),
    i = eH(
      eG,
      eO,
      eD(
        Math.min(Math.max(eP(e.adoption), eG), eO),
        SCENARIO_KEYS.map((e) => eW(e).x30),
      ),
    ),
    d = eJ(e.gain),
    c =
      ((a = Math.max(0.02, Math.min(0.98, e.alone))),
      (s = SCENARIO_KEYS.find((e) => 1e-9 > Math.abs(eI[e].labor.phi.x0 - a)))
        ? {
            ...eI[s].labor.phi,
          }
        : {
            x0: a,
            xb: a,
            k: eV,
          }),
    u = e0(e.months),
    h = t ?? e$,
    m = {
      production: {
        w: n,
        a: d,
        d: i,
        levelForm: h.production.levelForm,
        eps: h.production.eps,
        sigma: h.production.sigma,
      },
      labor: {
        phi: c,
        rho: t ? h.labor.rho : eU,
        mu: u,
        theta: t ? h.labor.theta : e6,
        gamma: h.labor.gamma,
        ubar: h.labor.ubar,
        qbar: h.labor.qbar,
      },
    },
    p = n.x30,
    f = i.x30,
    g = eT(d, eu);
  return {
    inputs: m,
    trace: {
      capability: {
        target: l,
        reached: p,
        held: l <= eB ? "low" : l >= ep ? "high" : null,
        position: e9(
          te.map((e) => e.obs),
          p,
        ),
        nodes: te,
        value: n,
        exposedShare: ep,
      },
      adoption: {
        target: o,
        reached: f,
        held: o <= eG ? "low" : o >= eO ? "high" : null,
        position: e9(
          tt.map((e) => e.obs),
          f,
        ),
        nodes: tt,
        value: i,
      },
      gain: {
        target: r,
        reached: g,
        held: e.gain > eZ + 1e-9 ? "high" : null,
        position: e9(
          ta.map((e) => e.obs),
          g,
        ),
        nodes: ta,
        value: d,
      },
      alone: {
        target: c.x0,
        value: c,
        presets: tl,
        rho: eU,
        rhoNodes: eY,
      },
      months: {
        answer: e.months,
        mu: u,
        muToday: eh,
        stops: ts,
        theta: e6,
        thetaNodes: e3,
      },
    },
  };
}
function td(e, t) {
  return ti(e, t).inputs;
}
function tc(e) {
  return {
    capability: to[e] / ep,
    adoption: tr[e],
    alone: eI[e].labor.phi.x0,
    gain: Math.exp(tn[e]),
    months: e1(eI[e].labor.mu),
  };
}
let tu = tc("central");
export {
  l,
  ej,
  eS,
  eN,
  eA,
  eL,
  e$,
  eR,
  eO,
  ez,
  eH,
  eD,
  eV,
  eY,
  eU,
  eK,
  eJ,
  e0,
  e3,
  e6,
  e9,
  te,
  tt,
  ta,
  ts,
  ti,
  td,
  tc,
  tu,
};
