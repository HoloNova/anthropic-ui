// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { CALIBRATION_DATA } from "./calibration.jsx";
let a;
let s;
var P = {
  sigma: {
    v: 0.5,
    src: "NOTE sec2 L47; Table 1, sec3 L46",
    sym: "σ",
    name: "elasticity of substitution across tasks",
  },
  eps: {
    v: 3,
    src: "NOTE sec2 L89-95, eq (6): capital is supplied along Δln K = ε Δln r; Table 1, sec3 L49 ('half the long-run wealth elasticity of Moll–Rachel–Restrepo 2022'), sec3 L101; V0.91 (2026-08-18) — earlier versions pegged the rental rate (ε = ∞), which stays selectable; D40",
    sym: "ε",
    name: "elasticity of capital supply (∞ = a pegged rental rate)",
  },
  rBar: {
    v: 0.115,
    src: "NOTE Table 1, sec3 L50: the no-AI gross rental rate (Moll–Rachel–Restrepo 2022; net return 6.5 percent, K/Y = 3.5); used only to report the net return r̄e^{Δln r} − δ",
    sym: "r̄",
    name: "no-AI gross rental rate",
    unit: "per year",
  },
  deltaK: {
    v: 0.05,
    src: "NOTE Table 1, sec3 L50: depreciation; used only to report the net return",
    sym: "δ",
    name: "depreciation rate",
    unit: "per year",
  },
  sL: {
    v: 0.6,
    src: "NOTE sec2 L111; Table 1, sec3 L47",
    sym: "s_L",
    name: "base-period labor share s_{L,t₀}",
  },
  lambda: {
    v: 1,
    src: "NOTE Table 1, sec3 L55; sec2 L399, app4 L19",
    sym: "λ",
    name: "returns to research input in ideas production",
  },
  oneMinusPhi: {
    v: 3.1,
    src: "NOTE app4 L16 (Bloom et al. 2020: TFP units, research input in researcher-equivalents); Table 1, sec3 L56 — in the model's units (labor-augmenting ideas, research input in goods) it becomes 1−φ_R = s_L(1−φ) + λ = 2.86, eq 42, sec3 L57",
    sym: "1−φ",
    name: "degree of fishing out (TFP units)",
  },
  gA: {
    v: 0.01,
    src: "NOTE sec2 L102, app4 L15; Table 1, sec3 L58: no-AI measured TFP growth g_A = s_L g = 1 percent a year, the labor-augmenting ideas stock itself growing at g = g_A/s_L = 1.67 percent",
    sym: "g_A",
    name: "no-AI TFP growth (the ideas stock grows at g = g_A/s_L)",
    unit: "per year",
  },
  n: {
    v: 0.0033,
    src: "NOTE sec2 L102; Table 1, sec3 L59: labor-force growth, 'so that GDP grows at 2 percent without AI' — it enters only the research share's trend g_ι (eq 43) and the no-AI levels; since the research-sector text of 2026-08-23 (D49)",
    sym: "n",
    name: "labor-force growth (no-AI GDP grows at g + n = 2 percent)",
    unit: "per year",
  },
  iotaR: {
    v: 0.035,
    src: "NOTE sec2 L401-411, eq 21; app4 L21-27, eq 43; Table 1, sec3 L60: research is funded by a share ι_R of GDP (lump-sum taxes; the lab-equipment closure), 3.5 percent in 2024 and rising at g_ι = 2.8 percent a year to 4.1 in 2030 with or without AI, so only its gap, zero, enters — AI reaches research through the GDP gap alone (eq 22); since the research-sector text of 2026-08-23 (D49), which removed the research triple m_R, d_R, a_R",
    sym: "ι_R",
    name: "research share of GDP in 2024 (reported; only its gap, zero, enters)",
  },
  iota: {
    v: 1.27,
    src: "NOTE sec2 L586: den Haan–Ramey–Watson's (2000) value; Table 1, sec3 L88; BOARD 1.27",
    sym: "ι",
    name: "curvature of the matching function H = χSv/(S^ι + v^ι)^{1/ι}",
  },
  piBarMean: {
    v: 0.65,
    src: "NOTE sec2 L632-634 (average vacancy duration of about a month); Table 1, sec3 L89",
    sym: "mean π̄ₒ",
    name: "employment-weighted mean share of a month's postings filled within the month",
    unit: "per month",
  },
  muNormal: {
    v: 0.17,
    src: "NOTE Table 1, sec3 L87; sec2 L629, L638-639; sec3 L113: μ̄, the search discount of NORMAL times, at which the t0 steady state (38) — Ū_o, f̄_o, π̄_o, χ — is solved in every scenario; 0.17 ≈ the CPS fit (0.169, 'How the data enter'); first a team decision of 2026-08-11 (D23). The scenario's own μ (sliders) applies along the simulated path from t0 on (33), (35)",
    sym: "μ (normal times)",
    name: "normal-times search discount (steady state only)",
  },
  qBar: {
    v: 0.11,
    src: "NOTE Table 1, sec3 L83; Table A.2, app1 L193: q̄ = 0.11 per year economy-wide (of which 0.06 stands for occupational moves and 0.05 for exits from the labor force)",
    sym: "q̄",
    name: "normal-times quit rate (all separations in normal times: moves to other jobs via a search spell, and labor-force exits replaced by entrants)",
    unit: "fraction per year",
  },
  qTshare: {
    v: 0.06 / 0.11,
    src: "NOTE Table 1, sec3 L84: q^T/q̄ = 0.55, 'elasticity of quits to the finding rate, JOLTS and CPS' (= the 0.06 occupational moves over the 0.11 of Table A.2, app1 L193; first READ D8 of the V0.90 text)",
    sym: "q^T/q̄",
    name: "share of normal quits that responds to the job finding rate",
  },
  t0: {
    v: 2024,
    src: "NOTE sec2 L75; Table 1, sec3 L51",
    sym: "t₀",
    name: "start of the AI gaps (the base period)",
  },
  tAnchor: {
    v: 2026.5,
    src: "NOTE sec2 L178: the slope 'that takes the affected mass from its mid-2026 estimate m_2026 to its 2030 value m_2030, three and a half years later', i.e. the anchors sit at t = 2026.5 (Table 1, sec3 L52: 'anchor date of the paths: mid-2026'; read so since D1)",
    sym: "t_anchor",
    name: "date of the empirical anchors",
  },
  tRead: {
    v: 2030,
    src: "NOTE sec2 L178: 'a scenario sets one number per path, its value at the start of 2030', three and a half years after the mid-2026 anchors — the start-of-2030 row of the monthly grid, t = 2030.0 (January); Table 1, sec3 L53 ('date of the scenarios’ 2030 values: 2030.0'); the 3.5 in eq 8′ (sec2 L182). Settled by the team on 2026-08-17/18, when a July reading was tried for a day (D35)",
    sym: "t_read",
    name: "date a scenario's '2030' value refers to (January 2030, t = 2030.0)",
  },
  mMax: {
    v: null,
    src: "NOTE sec2 L178: 'the ceilings are the natural maxima, m̄ = s_C/s_L, all cognitive work'; Table 1, sec3 L66 (0.624) — null = the cognitive share under the active calibration (0.6235, CPS 2025); first the team's decision of 2026-08-17 (D34)",
    sym: "m̄",
    name: "ceiling of m: all cognitive work",
  },
  dMax: {
    v: 1,
    src: "NOTE sec2 L178: 'd̄ = 1, every instance'; Table 1, sec3 L69 (D34)",
    sym: "d̄",
    name: "ceiling of d: every instance",
  },
  horizon: {
    v: 2030,
    src: "TEAM 2026-08-12: charts to 2030 by default, the note's reporting horizon (its Table 3 and Section 4; D27); the last row, t = 2030.0, is the date a scenario's 2030 values refer to (D35); 2035 and 2040 remain selectable",
    sym: "T",
    name: "last simulated date",
  },
};
var G = "BOARD";
var O =
  "TEAM 2026-08-11: starting points m₀ = 12% and d₀ = 10% in all three scenarios (D24)";
var q = function (e, t) {
  return {
    v: e,
    src:
      "NOTE Table 1, sec3 L" +
      t +
      "; the note's parametrization (sec2 L178-184, eq 8′; Table 1 note, sec3 L42): ceilings at their natural maxima, each scenario specified by its value at the start of 2030 (t = 2030.0), the slope implied — first the model team's decision of 2026-08-17 (D34)",
  };
};
var z =
  "TEAM 2026-08-11 (D23) — the three scenarios are to differ in disruptiveness, not only in the pace of capability and diffusion";
var H = function (e) {
  return {
    anchor: {
      v: e,
      src:
        z +
        " — ψ = 0.5 / 0.75 / 0.9 by scenario, held constant (anchor = ceiling); the note's Table 1 likewise (sec3 L75)",
    },
    floor: {
      v: 0,
      src: G,
    },
    ceil: {
      v: e,
      src: z + " (ceiling = anchor: a constant path)",
    },
    kappa: {
      v: 0.8,
      src: G + " (immaterial while the path is constant)",
    },
  };
};
var D = function (e) {
  return {
    v: e,
    src:
      z +
      " — ρ = 0.5 / 0.25 / 0 by scenario (how many entirely new jobs AI creates); the note's Table 1 likewise (sec3 L76); BOARD 0.5",
  };
};
var V = function (e) {
  return {
    v: e,
    src:
      z +
      " — μ = 0.17 / 0.08 / 0.04 by scenario, both directions: 0.17 ≈ the value fitted to the CPS switching matrix (0.169, business as usual; see 'How the data enter'), a lower number making it harder to move from the exposed to the other group; the note's Table 1 and §3.4 likewise (sec3 L77, L139-141; sec2 L639); BOARD 0.40",
  };
};
var Y =
  "TEAM 2026-08-09: 10 / 25 / 50% per month in the scenarios (a scenario assumption, with a slider; D13); the note's Table 1 likewise (θ^H = 0.10 / 0.25 / 0.50, 'scenario assumptions', sec3 L78; sec2 L639) — the posting speed θ^H alone since V0.96, the layoff speed θ^D having left the model (D44); BOARD 0.10 in every scenario";
var U = Math.log(30);
var K =
  "TEAM 2026-08-25, D54: ā = ln 30 ≈ 3.40 in every scenario — one ceiling for the presets and for quiz answers, whose productivity answer is a 2030 value; the quiz's answer scale ends at 10× (the surveys' options, D55), below it, so no answer is capped before 2030 and a 10× answer rises until 2032; reached by no preset through 2040 (Extreme's line would reach it in 2056), so no preset number through 2040 depends on it; was 1.6 from 2026-08-17 (D33: the gain 'measured inside conversations', NOTE sec3 L70, L127), which Extreme's line reached in 2038; the ceiling is this app's parameter, the note's a_t an unbounded line (eq 8)";
var X = {
  v: 0.14,
  src: "NOTE Table 1, sec3 L64: m anchored at 0.14 at mid-2026 in every scenario, 'observed exposure, averaged over occupations' (the exposure observed in Claude traffic at CPS employment weights); first set for the paper on 2026-08-19 (model team), taken into this app 2026-08-20 (D45); was 0.12 (TEAM 2026-08-11, D24)",
};
var J = {
  v: 0.5,
  src: "NOTE Table 1, sec3 L79: the rigidity ξ of the cognitive wage, 0.50 per year in every scenario, 'wage-setting evidence' (eq 30, sec2 L538-545: the wage closes 1 − ξ of its gap to the clearing wage a year); the parameter key is 'gamma', as in the authors' ScenarioResults/params_*.json. It entered this app from the sticky-wage merger note of 2026-08-20, whose main line was 0.75 with 0.5–0.9 reported; the authors settled on 0.5 (2026-08-20, D44); shown among the advanced parameters",
  unit: "per year",
};
var Q = {
  modest: {
    label: "Modest",
    m: {
      anchor: X,
      v2030: q(0.2, 65),
    },
    d: {
      anchor: {
        v: 0.1,
        src: O + "; was the reference explorer's 0.0826",
      },
      v2030: q(0.2, 68),
    },
    a: {
      anchor: {
        v: 0.3,
        src: G,
      },
      slope: {
        v: 0,
        src: G,
      },
      ceil: {
        v: U,
        src: K,
      },
    },
    psi: H(0.5),
    rho: D(0.5),
    mu: V(0.17),
    theta: {
      v: 0.1,
      src: Y,
      unit: "per month",
    },
  },
  medium: {
    label: "Substantial",
    m: {
      anchor: X,
      v2030: q(0.3, 65),
    },
    d: {
      anchor: {
        v: 0.1,
        src: O + "; NOTE Table 1, sec3 L67",
      },
      v2030: q(0.4, 68),
    },
    a: {
      anchor: {
        v: 0.35,
        src: "NOTE Table 1, sec3 L70",
      },
      slope: {
        v: 0.028,
        src: G + "; NOTE sec3 L71",
      },
      ceil: {
        v: U,
        src: K,
      },
    },
    psi: H(0.75),
    rho: D(0.25),
    mu: V(0.08),
    theta: {
      v: 0.25,
      src: Y,
      unit: "per month",
    },
  },
  extreme: {
    label: "Extreme",
    m: {
      anchor: X,
      v2030: q(0.5, 65),
    },
    d: {
      anchor: {
        v: 0.1,
        src: O + "; NOTE Table 1, sec3 L67",
      },
      v2030: q(0.6, 68),
    },
    a: {
      anchor: {
        v: 0.45,
        src: "NOTE Table 1, sec3 L70",
      },
      slope: {
        v: 0.1,
        src: "NOTE Table 1, sec3 L71 ('gain reaches 0.8 by 2030')",
      },
      ceil: {
        v: U,
        src: K,
      },
    },
    psi: H(0.9),
    rho: D(0),
    mu: V(0.04),
    theta: {
      v: 0.5,
      src: Y,
      unit: "per month",
    },
  },
};
var Z = {
  substantial: "medium",
  slow: "modest",
  fast: "extreme",
};
var ee = {
  levelForm: {
    def: "exact",
    label: "Level effect",
    options: {
      exact: "exact (Proposition 1, closed form)",
      firstOrder: "first order",
    },
    src: "NOTE sec2 L250 'when we solve the model, we use exact expressions': exact = the labor share, the other group's employment shift, the wage and output per worker by Proposition 1 (eqs 14–16) with the labor-augmenting ideas stock entering exactly, in the wage (Appendix C.3), the two employment targets by adding up (eq 13), the rental gap from Proposition 1's capital market (eqs 17–18), measured TFP the base-price index (eq 48) with the ideas stock inside it; first order = the first-order rows of the same table (eqs 11, 19, 46, 26); the actual economy (Appendix A.1, D42) and the sticky-wage block that reads it (D44) are exact either way (built on Proposition 1's row whatever this selector says, D46), so under first order the actual series do not converge to the first-order potential ones, and the flows differ from exact mode only through the first-order employment targets (extreme 2030 u^AI 8.2 % against 8.1 % exactly). D22 in the decision log; the explorer reports exact numbers (model team, 2026-08-06)",
  },
  sepRates: {
    def: "byGroup",
    label: "Normal separation rates",
    options: {
      byGroup: "differ by group (CPS relatives around q̄, as in the note)",
      common: "the same in both groups",
    },
    src: "READ D11: the note indexes q^X_o, q^T_o by group (sec2 L507) and, since V0.90, takes this Explorer's CPS relatives in its normal times (sec2 L637; Table 1, sec3 L85); with the CPS relatives the steady state comes close to the by-group unemployment rates and the two switching shares (the pooled share is matched exactly), with equal rates it does not (Model tab, 'How the data enter')",
  },
  tfpExact: {
    def: "baseWeight",
    label: "Measured TFP in exact mode",
    options: {
      baseWeight:
        "the base-price index over all tasks with the ideas stock on labor's instances (eq 48) — the note's definition",
      dual: "the dual at base-period shares, s_L Δln w + s_K Δln r",
    },
    src: "NOTE sec2 L480-495, app4 L157-166: measured TFP is the CES price index over all tasks at base factor prices with the labor-augmenting ideas stock on every labor instance, eq (48) — 'the definition of the measured TFP gap used in the tables, and the simulation reports it in this form'; both channels enter with labor's weight, to first order s_L(Δln A + m d a) (eq 26); it involves neither the rental, nor ψ, nor ρ (the note’s Table 3: +0.7 / +3.1 / +13.4 percent in 2030). The dual (eq 25) at base-period shares, s_L Δln w + s_K Δln r, agrees with it to first order and 'departs from it at second order' along a scenario's own path (app4 L166; on the extreme path in 2030 the level term is 12.2 log points by eq 48, against 11.5 by the chained residual and 14.4 at first order — this Explorer's run; the note's Table 3 note says 'about 12 percent', sec4 L50); before V0.91 this Explorer showed the dual at a pegged rental, s_L × the wage of Proposition 1 (D4′, D40)",
  },
  shares: {
    def: "cps2025",
    options: {
      cps2025: "CPS 2025 (BLS table 11)",
      oews2021: "OEWS May 2021",
    },
  },
  hazards: {
    def: "w1019",
    options: {
      w1019: "IPUMS-CPS 2010–2019",
      recent: "2015–19 and 2022–24",
      pooled: "1994–2024",
    },
  },
  matrix: {
    def: "cps1019",
    options: {
      cps1019: "CPS 2010–2019 corrected",
      cps7621: "CPS 1976–2021 corrected",
    },
  },
};
function cloneCalibrationData() {
  var e = {};
  for (var t in ee) e[t] = ee[t].def;
  return e;
}
function buildLaborParameters(e, t) {
  var a = e["oews2021" === t.shares ? "oews2021" : "cps2025"].w,
    s = e.ipums[t.hazards] || e.ipums.w1019,
    l = e.matrices[t.matrix] || e.matrices.cps1019,
    o = a[0] * s.eu[0] + a[1] * s.eu[1];
  return {
    w: a,
    names: e.groups.map(function (e) {
      return e.name;
    }),
    longNames: e.groups.map(function (e) {
      return e.long;
    }),
    sepRel: [s.eu[0] / o, s.eu[1] / o],
    uBarData: e.cps2025.uRateAgg,
    uByGroupCps2025: e.cps2025.uRate,
    uByGroupIpums: s.u0,
    ueByGroup: s.ue,
    euByGroup: s.eu,
    hazardWindow: s.window,
    pi: l.pi,
    switchShare: l.switchShare,
    pooledSwitchShare: l.pooledSwitchShare,
    originShares: l.origin,
    matrixWindow: l.window,
    nTransitions: l.nTransitions,
    mHatData: e.exposure.mHatData,
    mHatNote: [1 / a[0], 0],
    mBarMax: a[0],
  };
}
function buildScenarioParameters(e, t, a, s) {
  for (
    var l = e.qBar / 12,
      o = "common" === a.sepRates ? [1, 1] : t.sepRel,
      r = [],
      n = [],
      i = 0;
    i < 2;
    i++
  ) {
    n.push(e.qTshare * l * o[i]);
    r.push((1 - e.qTshare) * l * o[i]);
  }
  var d = "number" == typeof e.thetaH ? e.thetaH : e.theta,
    c = "number" == typeof e.muNormal ? e.muNormal : P.muNormal.v;
  return {
    uBar: "number" == typeof e.uBar ? e.uBar : t.uBarData,
    qXO: r,
    qTO: n,
    thetaH: d,
    gamma: e.gamma,
    mu: s,
    muNormal: [
      [1, c],
      [c, 1],
    ],
  };
}
let el =
  "# Written by scripts/sync-kernel.sh; do not edit. Read MODEL.md.\nsource: monorepo sandbox/sandbox/econ_research/scenario_explorer (origin/staging @ d113601e4438d59e052ed5b2361b517065023632, 2026-08-26)\nexplorer tree: df38414eea0e9d9a2452b30d916d8d1f98d7da74\nnote: V0.97 (2026-08-23)\nsimulate.py: e696c76539ff (ClaudeTex paper project 49788c57de7f456e87d24605bde9aa81, ScenarioResults/simulate.py, per the fixture's _source)\nfiles: src/model_core.js src/calibration_data.js src/scenarios.js tests/fixtures/cross_impl_rsector.json src/quiz_mapping.js\n";
let eo = {
  conservative: "modest",
  central: "medium",
  fast: "extreme",
};
let em = buildLaborParameters(CALIBRATION_DATA, cloneCalibrationData());
let ef = em.uBarData;
function ex(e, t, a) {
  let s = e.rows,
    l = (t - s[0].t) * 12;
  if (l <= 0) return a(s[0]);
  let o = Math.floor(l + 1e-9);
  if (o >= s.length - 1) return a(s[s.length - 1]);
  let r = l - o;
  return r < 1e-9 ? a(s[o]) : a(s[o]) * (1 - r) + a(s[o + 1]) * r;
}
em.names;
(a = /^note:\s*(.+)$/m.exec(el)) && a[1].trim();
(s = /@ ([0-9a-f]{7,40})/.exec(el)) && s[1].slice(0, 7);
let SCENARIO_KEYS = ["conservative", "central", "fast"];
export {
  a,
  s,
  P,
  G,
  O,
  q,
  z,
  H,
  D,
  V,
  Y,
  U,
  K,
  X,
  J,
  Q,
  Z,
  ee,
  cloneCalibrationData,
  buildLaborParameters,
  buildScenarioParameters,
  el,
  eo,
  em,
  ef,
  ex,
  SCENARIO_KEYS,
};
