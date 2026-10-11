// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import {
  sP,
  sb,
  sB,
  ll,
  lo,
  sL,
  sT,
  la,
  sp,
  sM,
  s$,
  s1,
  SCENARIO_PRESETS,
  sv,
  sk,
  s_,
  sg,
  sh,
  sx,
  sR,
} from "./model-metrics.jsx";
import { eA, td } from "./scenario-presets.jsx";
import { eT } from "./scenario-presets-2.jsx";
import { ed } from "./scenario-inputs-2.jsx";
import { getPresetScenario } from "./question-specs.jsx";
import { ex } from "./scenario-inputs.jsx";
function lr(e, t, a, s, l, o = false, r = 2030) {
  let n,
    i,
    d,
    c = sP(e),
    u = sb(e, c),
    h = sB(ll(u.ai), r),
    m = lo(h) / (h[0]?.v || 1),
    p = (function (e, t = 2030) {
      let a = eA(e.production.w, t),
        s = eA(e.production.d, t),
        l = eA(e.labor.phi, t),
        o = a * l;
      return {
        reached: a,
        adopted: s,
        automated: o,
        augmented: a * (1 - l),
        created: e.labor.rho * o * s,
        gain: eT(e.production.a, t),
      };
    })(e, r),
    f = sL(e),
    g = sT(e),
    x = (e, t) => {
      let a = e[0];
      for (let s of e) Math.abs(s.t - t) < Math.abs(a.t - t) && (a = s);
      return a;
    },
    _ = (e) => [la(x(e, 2026)?.v ?? 0), la(e[e.length - 1]?.v ?? 0)];
  return {
    key: t,
    year: r,
    rates: {
      years:
        ((n = sB(ll(f.affected), r)),
        [
          Math.round(x(n, 2026)?.t ?? 2026),
          Math.round(n[n.length - 1]?.t ?? 0),
        ]),
      affected: _(sB(ll(f.affected), r)),
      other: _(sB(ll(f.other), r)),
      all: _(sB(ll(g.rate), r)),
      normalAffected: la(f.normalAffected),
      normalOther: la(f.normalOther),
      normalAll: la(g.normal),
    },
    label: a,
    color: s,
    blurb: l,
    isYou: o,
    comp: {
      reached: la(p.reached),
      adopted: la(p.adopted),
      automated: la(p.automated),
      augmented: la(p.augmented),
      created: la(p.created),
      gain: la(p.gain),
    },
    gainPct: la(100 * (lo(h) / (lo(sB(ll(u.base), r)) || 1) - 1)),
    levelRatio: la(m),
    gdpToday: la((sp * (h[0]?.v ?? 100)) / 100),
    gdp2030: la((sp * lo(h)) / 100),
    cents: la(lo(sB(ll(sM(e)), r))),
    labourT: la(lo(sB(ll(s$(e)), r))),
    movedT: la(
      lo(
        ((i = sM(e)),
        (d = s$(e)),
        sB(
          ll(
            i.map((e, t) => {
              let a = d[t]?.v ?? 0,
                s = e.v > 0 ? (a / e.v) * (100 * ed) : 0;
              return {
                t: e.t,
                v: Math.max(0, s - a),
              };
            }),
          ),
          r,
        )),
      ),
    ),
    sharePP: la(lo(sB(ll(sM(e)), r)) - 100 * ed),
    billT: la(lo(sB(ll(s$(e)), r)) - (ll(s$(e))[0]?.v ?? 0)),
  };
}
let runUserScenario = (e) =>
  td({
    capability: e.reach,
    adoption: e.adoption,
    alone: e.autonomy,
    gain: Math.exp(e.productivity),
    months: e.months ?? 3,
  });
function li(e, t = "your scenario") {
  return lr(
    runUserScenario(e),
    "live",
    t,
    "var(--foreground-primary)",
    undefined,
    true,
  );
}
function ld(e, t = "your scenario", a = 2030) {
  return lr(e, "live", t, "var(--foreground-primary)", undefined, true, a);
}
let lc = (e) => `${e.toLowerCase()} scenario`;
let lu = "your scenario";
function lh(e) {
  let t = s1.find((t) => t.key === e);
  return lr(
    getPresetScenario(SCENARIO_PRESETS[e]),
    e,
    `${t.label} scenario`,
    t.color,
  );
}
function lm(e) {
  let t = s1.map((e) => lh(e.key));
  return e
    ? [
        lr(
          runUserScenario(e),
          "you",
          "Your scenario",
          "var(--foreground-primary)",
          undefined,
          true,
        ),
        ...t,
      ]
    : t;
}
function lp(e, t = 2030) {
  let a = sL(e),
    s = sT(e),
    l = sb(e),
    o = sM(e),
    r = (e) => sB(e, t).filter((e) => e.t >= 2026),
    n = (e) =>
      r(e).map((e) => ({
        t: e.t,
        v: la(e.v),
      })),
    i = (e) =>
      r(e).map((e) => ({
        t: e.t,
        v: la((sp * e.v) / 100),
      }));
  return {
    unemployment: {
      affected: n(a.affected),
      other: n(a.other),
      all: n(s.rate),
    },
    gdp: {
      ai: i(l.ai),
      base: i(l.base),
    },
    cents: n(o),
    wageGap: {
      productivity: n(sv(e)),
      wages: n(sk(e)),
      cognitive: n(s_(sg(e), sh, (e) => e.wC_act, sx)),
      other: n(s_(sg(e), sh, (e) => e.wN_act, sx)),
    },
  };
}
function lf(e) {
  return lp(e, sR(e));
}
let lg = [2026, 2030];
let lx = (e) =>
  e < 2030
    ? `Shown through ${e}, the year growth peaks in this scenario.`
    : undefined;
function l_(e, t) {
  let { ai: a } = sb(
    "you" === e && t
      ? runUserScenario(t)
      : getPresetScenario(SCENARIO_PRESETS[e]),
  );
  return (a[a.length - 1]?.v ?? 0) / (a[0]?.v || 1);
}
let ly = (e) => ({
  wages: e.wages,
  cognitive: e.cognitive,
  other: e.other,
});
let lw = (e) => {
  let t,
    a,
    s,
    l,
    o,
    r,
    n =
      ((t = sg(e)),
      (a = (e) => (e > 1e-4 ? 1 / e : 999)),
      (s = ex(t, 2030, (e) => e.f[0])),
      (l = ex(t, 2030, (e) => e.f[1])),
      (o = a(t.ss.fBarO[0])),
      (r = a(t.ss.fBarO[1])),
      {
        exposed: a(s),
        other: a(l),
        normalExposed: o,
        normalOther: r,
        ratioExposed: s > 1e-4 ? a(s) / o : 1 / 0,
        ratioOther: l > 1e-4 ? a(l) / r : 1 / 0,
      });
  return {
    exposed: la(n.exposed),
    other: la(n.other),
    normalExposed: la(n.normalExposed),
    normalOther: la(n.normalOther),
    ratioExposed: la(n.ratioExposed),
    ratioOther: la(n.ratioOther),
  };
};
function lb(e, t = 2030) {
  let a = sg(e),
    s = ex(a, 2026, (e) => e.ell[0]),
    l = 100 / (s + ex(a, 2026, (e) => e.ell[1])),
    o = s * l,
    r = 100 - o,
    n = ex(a, t, (e) => e.ell[0]) * l,
    i = Math.max(0, o - n),
    d = Math.min(Math.max(0, ex(a, t, (e) => e.ell[1]) * l - r), i);
  return {
    cStart: la(o),
    oStart: la(r),
    cStay: la(n),
    moved: la(d),
    stuck: la(Math.max(0, i - d)),
    oTarget: la(ex(a, t, (e) => e.tgt[1]) * l),
    normal: la(sL(e).normal),
    year: t,
  };
}
let lv = {
  w: 0,
  h: 0,
};
export {
  lr,
  runUserScenario,
  li,
  ld,
  lc,
  lu,
  lh,
  lm,
  lp,
  lf,
  lg,
  lx,
  l_,
  ly,
  lw,
  lb,
  lv,
};
