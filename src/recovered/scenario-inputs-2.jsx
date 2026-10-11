// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import {
  Q,
  Z,
  eo,
  P,
  J,
  cloneCalibrationData,
  buildLaborParameters,
  buildScenarioParameters,
} from "./scenario-inputs.jsx";
import { CALIBRATION_DATA } from "./calibration.jsx";
import { ModelKernel } from "./ModelKernel.jsx";
let er = (e) => {
  var t, a, s;
  a = Q[Z[(t = eo[e])] || t] || Q.medium;
  return {
    mAnchor: (s = function (e) {
      return e.v;
    })(a.m.anchor),
    m2030: s(a.m.v2030),
    mCeil: P.mMax.v,
    mKappa: null,
    dAnchor: s(a.d.anchor),
    d2030: s(a.d.v2030),
    dCeil: s(P.dMax),
    dKappa: null,
    aAnchor: s(a.a.anchor),
    aSlope: s(a.a.slope),
    aCeil: s(a.a.ceil),
    psiAnchor: s(a.psi.anchor),
    psiFloor: s(a.psi.floor),
    psiCeil: s(a.psi.ceil),
    psiKappa: s(a.psi.kappa),
    rho: s(a.rho),
    theta: s(a.theta),
    gamma: s(J),
    qBar: s(P.qBar),
    uBar: null,
    muCN: s(a.mu),
    muNC: s(a.mu),
    muNormal: s(P.muNormal),
    sigma: s(P.sigma),
    eps: s(P.eps),
    rBar: s(P.rBar),
    deltaK: s(P.deltaK),
    sL: s(P.sL),
    lambda: s(P.lambda),
    oneMinusPhi: s(P.oneMinusPhi),
    gA: s(P.gA),
    n: s(P.n),
    iotaR: s(P.iotaR),
    iota: s(P.iota),
    piBarMean: s(P.piBarMean),
    qTshare: s(P.qTshare),
    horizon: s(P.horizon),
    tAnchor: s(P.tAnchor),
    tRead: s(P.tRead),
  };
};
let en = er("central");
let ei = en.sigma;
let ed = en.sL;
let ec = en.tAnchor;
let eu = en.tRead;
en.eps;
let eh = en.muNormal;
en.qBar;
/* 把情景参数送入原模型，输出按时间排列的 GDP、就业、工资与资本等结果。 */
function runScenario(e, t = "exact") {
  var a, s, l, o, r, n, i, d, c, u, h, m, p, f;
  let g = {
      ...cloneCalibrationData(),
      levelForm: t,
    },
    x =
      ((a = buildLaborParameters(CALIBRATION_DATA, g)),
      (s = e.muCN),
      (l = e.muNC),
      (o = (function (e, t, a) {
        var s = t.pooledSwitchShare,
          l = 1e-6,
          o = 1,
          r = function (l) {
            var o, r, n, i;
            return (
              ((r = buildScenarioParameters(
                e,
                t,
                a,
                (o = [
                  [1, l],
                  [l, 1],
                ]),
              )),
              (n = ModelKernel.steadyState(
                t.w,
                r.uBar,
                [
                  ModelKernel.quitRate(r.qXO[0], r.qTO[0], 1),
                  ModelKernel.quitRate(r.qXO[1], r.qTO[1], 1),
                ],
                o,
                e.iota,
                e.piBarMean,
              )),
              {
                P: (i = ModelKernel.destinationShares(n)),
                pooled:
                  (n.HBar[0] * i[0][1] + n.HBar[1] * i[1][0]) /
                  (n.HBar[0] + n.HBar[1]),
              }).pooled - s
            );
          };
        if (0 > r(1))
          return {
            mu: 1,
            atBound: true,
          };
        for (var n = 0; n < 80; n++) {
          var i = 0.5 * (l + o);
          0 > r(i) ? (l = i) : (o = i);
        }
        return {
          mu: 0.5 * (l + o),
          atBound: false,
        };
      })(e, a, g).mu),
      "number" != typeof s && (s = o),
      "number" != typeof l && (l = o),
      (r = [
        [1, s],
        [l, 1],
      ]),
      (n = {
        muCN: s,
        muNC: l,
        fitted: o,
      }),
      (i = a.w[0]),
      {
        paths: {
          m: ((c = e),
          (u = a),
          (h = c.tAnchor),
          (m = "number" == typeof c.tRead ? c.tRead : P.tRead.v),
          (p = {
            solved: {},
          }),
          (f = function (e, t, a, s, l) {
            var o = "number" == typeof s ? s : u.mBarMax,
              r = "number" == typeof l;
            p.solved[e] = !r;
            p[e] = {
              anchor: t,
              ceil: o,
              kappa: r
                ? l
                : a > t
                  ? a < o
                    ? Math.min(
                        3,
                        Math.max(
                          0,
                          Math.log(((o - t) / t) * (a / (o - a))) / (m - h),
                        ),
                      )
                    : 3
                  : 0,
            };
          })("m", c.mAnchor, c.m2030, c.mCeil, c.mKappa),
          f("d", c.dAnchor, c.d2030, c.dCeil, c.dKappa),
          (d = p)).m,
          d: d.d,
          a: {
            anchor: e.aAnchor,
            slope: e.aSlope,
            ceil: e.aCeil,
          },
          psi: {
            anchor: e.psiAnchor,
            floor: e.psiFloor,
            ceil: e.psiCeil,
            kappa: e.psiKappa,
          },
          rho: e.rho,
        },
        note: {
          sigma: e.sigma,
          sL: e.sL,
          eps: "number" == typeof e.eps && e.eps == e.eps ? e.eps : 1 / 0,
          rBar: "number" == typeof e.rBar ? e.rBar : P.rBar.v,
          deltaK: "number" == typeof e.deltaK ? e.deltaK : P.deltaK.v,
          lambda: e.lambda,
          oneMinusPhi: e.oneMinusPhi,
          gA: e.gA,
          n: "number" == typeof e.n ? e.n : P.n.v,
          iotaR: "number" == typeof e.iotaR ? e.iotaR : P.iotaR.v,
          iota: e.iota,
          piBarMean: e.piBarMean,
          t0: P.t0.v,
          h: 1 / 12,
        },
        tAnchor: e.tAnchor,
        horizon: e.horizon,
        levelForm: "firstOrder" === g.levelForm ? "firstOrder" : "exact",
        tfpForm: "dual" === g.tfpExact ? "dual" : "baseWeight",
        ideasFirstOrder: false,
        groups: {
          w: a.w,
          rel: {
            m: [1 / i, 0],
            d: [1, 1],
            a: [1, 1],
            psi: [1, 1],
          },
          names: a.names,
        },
        flows: buildScenarioParameters(e, a, g, r),
        meta: {
          cal: a,
          mu: n,
          choices: g,
          kappa: {
            m: d.m.kappa,
            d: d.d.kappa,
          },
          solved: d.solved,
        },
      });
  return {
    ...ModelKernel.simulate(x),
    muFitted: x.meta.mu.fitted,
  };
}
function e_(e, t, a) {
  let s = e.rows,
    l = Math.round((t - s[0].t) * 12),
    o = 0;
  for (let e = Math.max(0, l - 12); e < Math.min(l, s.length); e++)
    o += a(s[e]);
  return o;
}
let ew = {
  conservative: "Modest",
  central: "Substantial",
  fast: "Extreme",
};
let eb = {
  conservative: "var(--chart-conservative)",
  central: "var(--chart-central)",
  fast: "var(--chart-fast)",
};
export { er, en, ei, ed, ec, eu, eh, runScenario, e_, ew, eb };
