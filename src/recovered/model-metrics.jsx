// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { su } from "./model-metrics-2.jsx";
import { runScenario, ed, ei, e_, ew } from "./scenario-inputs-2.jsx";
import { cloneScenarioInputs } from "./scenario-inputs-3.jsx";
import { getPresetScenario, ep } from "./question-specs.jsx";
import { ex, SCENARIO_KEYS } from "./scenario-inputs.jsx";
import { td, tc } from "./scenario-presets.jsx";
let o;
let r;
let n;
let sc = [];
for (let e = 2025; e <= 2030; e++) sc.push(e);
let sh = su(2025, 2030);
let sm = su(2025, 2035);
let sp =
  ((r = runScenario(
    cloneScenarioInputs((o = getPresetScenario("central"))),
    o.production.levelForm,
  )),
  Number(
    (
      30.76 /
      ((n = sh.filter((e) => e < 2025.999999999)).reduce(
        (e, t) =>
          e + Math.pow(1.02, t - 2025) * Math.exp(ex(r, t, (e) => e.lnY_act)),
        0,
      ) /
        n.length)
    ).toFixed(3),
  ));
let sf = new WeakMap();
function sg(e) {
  let t = sf.get(e);
  t ||
    ((t = runScenario(cloneScenarioInputs(e), e.production.levelForm)),
    sf.set(e, t));
  return t;
}
let sx = (e) => 100 * Math.expm1(e);
let s_ = (e, t, a, s = (e) => e) =>
  t.map((t) => ({
    t,
    v: s(ex(e, t, a)),
  }));
let sy = (e, t, a) => 100 * (ex(e, t, a) - ex(e, t - 1, a));
function sw(e, t) {
  let a = sg(e),
    s = t.map((e) => ({
      t: e,
      v: sy(a, e, (e) => e.lnYL),
    })),
    l = t.map((e) => ({
      t: e,
      v: sy(a, e, (e) => e.lnY_act),
    })),
    o = t.map((t) => {
      let s;
      return {
        t,
        v:
          100 *
          ex(a, t, (e) => e.dg) *
          ((s = e.production.eps) < 1 / 0
            ? 1 - (((1 - ed) / ed) * ei) / (s + ei / ed)
            : 1),
      };
    }),
    r = s.map((e, t) => ({
      t: e.t,
      v: e.v - o[t].v,
    })),
    n = s.filter(
      (e) =>
        1e-6 > Math.abs(e.t - Math.round(e.t)) && e.t >= 2026 && e.t <= 2030,
    );
  return {
    production: r,
    research: o,
    total: s,
    actual: l,
    avg: n.reduce((e, t) => e + t.v, 0) / n.length,
  };
}
function sb(e, t) {
  let a = sg(e),
    s = sh.map((e) => ({
      t: e,
      v: 100 * Math.pow(1.02, e - 2025),
    })),
    l = (e) =>
      s.map((t) => ({
        t: t.t,
        v: t.v * Math.exp(ex(a, t.t, e)),
      }));
  return {
    base: s,
    ai: l((e) => e.lnY_act),
    potential: l((e) => e.lnYL),
  };
}
let sv = (e) => s_(sg(e), sh, (e) => e.lnYL, sx);
let sk = (e, t) => s_(sg(e), sh, (e) => e.wavg_act, sx);
function sM(e) {
  return s_(
    sg(e),
    sh,
    (e) => e.lnSL_act,
    (e) => 100 * ed * Math.exp(e),
  );
}
function sj(e) {
  let t = sg(e),
    a = t.ss.ell0,
    s = (e, s) => s_(t, sh, (t) => 100 * (e(t) / a[s] - 1));
  return {
    exposed: s((e) => e.ell[0], 0),
    exposedTarget: s((e) => e.tgt[0], 0),
    other: s((e) => e.ell[1], 1),
    otherTarget: s((e) => e.tgt[1], 1),
    exposedPer100: Math.round(
      (100 * t.ss.ell0[0]) / (t.ss.ell0[0] + t.ss.ell0[1]),
    ),
  };
}
function sS(e) {
  let t = sg(e);
  return s_(t, sh, (e) => 100 * (e.tgt[1] - t.ss.ell0[1]));
}
function sN(e, t) {
  let a = sg(e);
  return sc.map((e) => ({
    t: e,
    v: 100 * e_(a, e, (e) => e.X),
  }));
}
function sA(e) {
  let t = sg(e);
  return sc.map((e) => ({
    t: e,
    v: 100 * e_(t, e, (e) => e.D[0] + e.D[1]),
  }));
}
function sT(e) {
  let t = sg(e),
    a = t.rows[0];
  for (let e of t.rows) e.uAI > a.uAI && (a = e);
  return {
    rate: s_(t, sh, (e) => 100 * e.Ut),
    normal: 100 * t.ss.uBar,
    ai: s_(t, sh, (e) => 100 * e.uAI),
    peak: {
      v: 100 * a.uAI,
      t: a.t,
    },
  };
}
function sL(e) {
  let t = sg(e),
    a = (e) => s_(t, sh, (t) => (100 * t.U[e]) / (t.U[e] + t.ell[e])),
    s = t.ss;
  return {
    affected: a(0),
    other: a(1),
    normal: 100 * s.uBar,
    normalAffected: (100 * s.UBar[0]) / (s.UBar[0] + s.ell0[0]),
    normalOther: (100 * s.UBar[1]) / (s.UBar[1] + s.ell0[1]),
  };
}
let sI = null;
function s$(e) {
  let t = sM(e),
    { ai: a } = sb(e);
  return t.map((e) => {
    let t = a.find((t) => t.t === e.t)?.v ?? 100;
    return {
      t: e.t,
      v: (e.v / 100) * sp * (t / 100),
    };
  });
}
let sF = (e) => (100 * Math.LN2) / e;
let sW = (e) => {
  let t = sF(e);
  return t < 10 ? t.toFixed(1) : String(Math.round(t));
};
function sC(e) {
  let t = sg(e),
    a = [];
  for (let e = 2027; e <= 2030; e++)
    a.push({
      t: e,
      v: 2 + sy(t, e, (e) => e.lnY_act),
    });
  return {
    ai: a,
    base: a.map((e) => ({
      t: e.t,
      v: 2,
    })),
  };
}
function sR(e) {
  let t = sC(e).ai,
    a = Math.max(...t.map((e) => e.v));
  if (!t.length || !Number.isFinite(a)) return 2030;
  let s = (e) => e >= 0.9 * a || a - e < 1,
    l = t[0].t;
  for (let e of t) s(e.v) && (l = e.t);
  return Math.max(l, t[1]?.t ?? l);
}
let sB = (e, t) => e.filter((e) => e.t <= t + 1e-9);
function sE(e) {
  let t = (function () {
    if (!sI) {
      let e = (e) => {
        let t = sw(getPresetScenario(e), sh);
        return 2 + t.actual[t.actual.length - 1].v;
      };
      sI = {
        conservative: e("conservative"),
        central: e("central"),
        fast: e("fast"),
      };
    }
    return sI;
  })();
  return e >= (t.central + t.fast) / 2
    ? "fast"
    : e >= (t.conservative + t.central) / 2
      ? "central"
      : "conservative";
}
function sP(e) {
  let t = sw(e, sh);
  return sE(2 + t.actual[t.actual.length - 1].v);
}
let sG = [
  [0.15, "minimal", "conservative"],
  [1, "modest", "central"],
  [4, "significant", "fast"],
  [1 / 0, "severe", "fast"],
];
let sO = [
  [-8, "pay falling far behind the gains", "fast"],
  [-1, "pay lagging the gains", "central"],
  [1, "pay keeping pace with the gains", "conservative"],
  [1 / 0, "workers taking a larger slice", "conservative"],
];
let sq = (e, t) => e.find(([e]) => t < e) ?? e[e.length - 1];
let sz = (e, t) => sq(e, t)[1];
let sH = Number(
  (
    (sp *
      (sb(getPresetScenario("central")).ai.find((e) => 2026 === e.t)?.v ??
        100)) /
    100
  ).toFixed(2),
);
let sD = {
  slow: "conservative",
  central: "central",
  fast: "fast",
};
let sV = new WeakMap();
let sY = new WeakMap();
let sU = (e) => {
  let t = sY.get(e);
  if (!t) {
    let a = sV.get(e),
      s = a
        ? getPresetScenario(a)
        : td({
            capability: e.reach,
            adoption: e.adoption,
            alone: e.autonomy,
            gain: Math.exp(e.productivity),
            months: e.months ?? 3,
          });
    t = {
      inp: s,
      sc: sP(s),
    };
    sY.set(e, t);
  }
  return t;
};
let sK = (e) => e.filter((e) => e.t >= 2026);
let sX = (e) => e[e.length - 1]?.v ?? 0;
let sJ = (e) => {
  let { inp: t, sc: a } = sU(e),
    s = sb(t, a);
  return 100 * (sX(sK(s.ai)) / (sX(sK(s.base)) || 1) - 1);
};
let sQ = (e) => {
  let { inp: t, sc: a } = sU(e);
  return (sp * sX(sK(sb(t, a).ai))) / 100;
};
let sZ = () => (sp * sX(sK(sb(sU(s3.central).inp).base))) / 100;
let s0 = (e) => {
  let { inp: t, sc: a } = sU(e);
  return sK(sb(t, a).ai).map((e) => [e.t, (sp * e.v) / 100]);
};
let s1 = [
  {
    key: "slow",
    label: "Modest",
    color: "var(--c-slow)",
  },
  {
    key: "central",
    label: "Substantial",
    color: "var(--c-central)",
  },
  {
    key: "fast",
    label: "Extreme",
    color: "var(--c-fast)",
  },
];
let s2 = {
  slow: 1,
  central: 2,
  fast: 3,
};
let s5 = (e) => {
  let t = sD[e],
    a = tc(t),
    s = getPresetScenario(t);
  return {
    reach: a.capability,
    adoption: a.adoption,
    autonomy: a.alone,
    productivity: Math.log(a.gain),
    newWork: s.labor.rho,
    months: a.months,
  };
};
let s3 = {
  slow: s5("slow"),
  central: s5("central"),
  fast: s5("fast"),
};
for (let { key: e } of s1) sV.set(s3[e], sD[e]);
let s6 = (e) => {
  let t = 43758.5453 * Math.sin(127.1 * e + 311.7);
  return t - Math.floor(t);
};
let s4 = Array.from(
  {
    length: 90,
  },
  (e, t) => ({
    reach: (0.05 + 0.55 * s6(5 * t + 1)) / ep,
    adoption: 0.1 + 0.8 * s6(5 * t + 2),
    autonomy: s6(5 * t + 3),
    productivity: 0.1 + 0.85 * s6(5 * t + 4),
    newWork: s6(5 * t + 5),
  }),
);
let s8 = null;
let s7 = () =>
  (s8 ??= s1
    .map(({ key }) => ({
      key,
      lift: sJ(s3[key]),
    }))
    .sort((e, t) => e.lift - t.lift));
let s9 = [
  [2015, 24.4],
  [2017, 25.5],
  [2019, 26.7],
  [2020, 26.1],
  [2021, 27.5],
  [2023, 28.8],
  [2026, sH],
];
let SCENARIO_PRESETS = {
  slow: "conservative",
  central: "central",
  fast: "fast",
};
let lt = Object.fromEntries(SCENARIO_KEYS.map((e) => [e, ew[e].toLowerCase()]));
let la = (e) => Number(e.toFixed(9));
let ls = (e) => `${e < 0 ? "" : "+"}${e.toFixed(1)}%`;
let ll = (e) => e.filter((e) => e.t >= 2026);
let lo = (e) => e[e.length - 1]?.v ?? 0;
export {
  o,
  r,
  n,
  sc,
  sh,
  sm,
  sp,
  sf,
  sg,
  sx,
  s_,
  sy,
  sw,
  sb,
  sv,
  sk,
  sM,
  sj,
  sS,
  sN,
  sA,
  sT,
  sL,
  sI,
  s$,
  sF,
  sW,
  sC,
  sR,
  sB,
  sE,
  sP,
  sG,
  sO,
  sq,
  sz,
  sH,
  sD,
  sV,
  sY,
  sU,
  sK,
  sX,
  sJ,
  sQ,
  sZ,
  s0,
  s1,
  s2,
  s5,
  s3,
  s6,
  s4,
  s8,
  s7,
  s9,
  SCENARIO_PRESETS,
  lt,
  la,
  ls,
  ll,
  lo,
};
