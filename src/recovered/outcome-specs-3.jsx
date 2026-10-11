// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import {
  sP,
  sE,
  sw,
  sh,
  sT,
  s_,
  sg,
  sx,
  sz,
  sG,
  sO,
  sq,
  sb,
  sp,
  sj,
  sL,
  sF,
  sk,
  sv,
  sM,
  sS,
  sN,
  sA,
} from "./model-metrics.jsx";
import { rf } from "./outcome-specs-2.jsx";
import { ew, ed } from "./scenario-inputs-2.jsx";
import { oQ } from "./outcome-specs.jsx";
function rg(e, t = null) {
  var a, s, l, o, r, n, i, d, c, u;
  let h,
    m,
    p,
    f,
    g,
    x,
    _,
    y,
    w,
    b,
    v,
    k,
    M,
    j,
    S,
    N,
    A,
    T,
    L,
    I = sP(e),
    $ = rf.map((t) => ({
      spec: t,
      ...t.build({
        inputs: e,
        scenario: I,
      }),
    }));
  return {
    answers: t,
    mapping: null,
    inputs: e,
    scenario: I,
    headline:
      ((l =
        ew[
          (T = {
            takeoff: sE(
              ((h = sw((d = e), sh)),
              (m = sT(d).ai),
              (p = s_(sg(d), sh, (e) => e.lnSL_act, sx)),
              (f = (e) => e[e.length - 1].v),
              (s = a =
                {
                  gdpAvg: h.avg,
                  withAI2030: 2 + f(h.actual),
                  u2030: f(m),
                  share2030: f(p),
                })).withAI2030,
            ),
            jobs: sz(sG, s.u2030),
            pay: sz(sO, s.share2030),
          }).takeoff
        ].toLowerCase()),
      (o = a.withAI2030.toFixed(1)),
      (r = T.jobs),
      (n = T.pay),
      (i = {
        takeoff: sE(a.withAI2030),
        jobs: sq(sG, a.u2030)[2],
        pay: sq(sO, a.share2030)[2],
      }),
      (L = /^[aeiou]/i.test(l) ? "an" : "a"),
      [
        {
          text: "This is ",
        },
        {
          text: `${L} ${l} scenario`,
          emph: true,
          tone: i.takeoff,
        },
        {
          text: ", lifting growth to about ",
        },
        {
          text: `${o}% a year by 2030`,
          emph: true,
          tone: i.takeoff,
        },
        {
          text: ", with ",
        },
        {
          text: `${r} impact`,
          emph: true,
          tone: i.jobs,
        },
        {
          text: " on jobs, and ",
        },
        {
          text: n,
          emph: true,
          tone: i.pay,
        },
        {
          text: ".",
        },
      ]),
    stats:
      ((c = e),
      (u = I),
      (g = sw(c, sh)),
      (_ = (oQ((x = sb(c)).ai) / 100) * sp),
      (y = (oQ(x.base) / 100) * sp),
      (w = x.ai.find((e) => 2026 === e.t) ?? x.ai[0]),
      (b = 2 + oQ(g.actual)),
      (v = sj(c)),
      (k = sT(c)),
      (M = sL(c)),
      (j = oQ(k.ai)),
      {
        scenario: u,
        gdpToday: (w.v / 100) * sp,
        gdpAI: _,
        gdpBase: y,
        gainPct: (_ / y - 1) * 100,
        growth2030: b,
        additionPp: oQ(g.total),
        additionActualPp: oQ(g.actual),
        researchPp: oQ(g.research),
        doubling: Math.round(sF(b)),
        wagePct: oQ(sk(c)),
        gdpPerWorkerPct: oQ(sv(c)),
        centsToday: Math.round(100 * ed),
        cents2030: Math.round(oQ(sM(c))),
        exposed: v.exposedPer100,
        exposedEmpPct: oQ(v.exposed),
        exposedTargetPct: oQ(v.exposedTarget),
        otherEmpPct: oQ(v.other),
        mustMove: oQ(sS(c)),
        switching: oQ(sN(c)),
        layoffs: oQ(sA(c)),
        urate2030: oQ(k.rate),
        urNormal: k.normal,
        u2030: j,
        uMillions: (j / 100) * 170,
        uPeak: k.peak.v,
        uPeakYear: Math.floor(k.peak.t + 1e-9),
        urExposed: oQ(M.affected),
        urOther: oQ(M.other),
        urExposedNormal: M.normalAffected,
        urOtherNormal: M.normalOther,
      }),
    panels: $,
    panel: Object.fromEntries($.map((e) => [e.spec.id, e])),
    timelineMarkers:
      ((A =
        (N =
          (S = sw(e, sh).total.filter((e) => e.t <= 2025)).reduce(
            (e, t) => e + t.v,
            0,
          ) / S.length) < 0.05
          ? "less than 0.1"
          : `about ${N.toFixed(1)}`),
      [
        {
          t: 2025.5,
          label: "Today",
          title: "Where we are",
          parts: [
            {
              text: "Left of this line is the estimated past: AI already adds ",
            },
            {
              text: `${A} points a year`,
              emph: true,
            },
            {
              text: ", real but hard to see in the noise. To the right, the scenario begins.",
            },
          ],
        },
      ]),
  };
}
export { rg };
