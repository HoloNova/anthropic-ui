// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
/* 恢复的官方经济模型内核。保留公式、二分求根与数值迭代顺序，不用模拟数据替代。 */
var ModelKernel = (function () {
  function e(e, t) {
    var a = e.floor || 0;
    return t + Math.log((e.ceil - a) / (e.anchor - a) - 1) / e.kappa;
  }
  function t(t, a, s) {
    var l = a.floor || 0,
      o = a.ceil;
    return a.kappa > 0 && a.anchor < o && a.anchor > l
      ? l + (o - l) / (1 + Math.exp(-a.kappa * (t - e(a, s))))
      : a.anchor;
  }
  function a(e, t, a) {
    var s = t.anchor + t.slope * (e - a);
    "number" == typeof t.ceil && t.ceil < s && (s = t.ceil);
    return Math.max(0, s);
  }
  function s(e, s, l) {
    return {
      m: t(e, s.m, l),
      d: t(e, s.d, l),
      a: a(e, s.a, l),
      psi: t(e, s.psi, l),
      rho: s.rho,
    };
  }
  function l(e, t, a, s, l) {
    l = l || 0;
    var o = 1 - (1e-6 > Math.abs(1 - a) ? 1 - 1e-6 : a),
      r = e.m * e.d,
      n = Math.exp(-o * e.a),
      i =
        Math.log(1 - e.psi * r * (n - e.rho) + Math.expm1(-o * l) / s) + o * l,
      d = -Math.log(1 - r * (1 - e.rho * e.psi - (1 - e.psi) * n)),
      c = (i + d) / o + t,
      u = c - i,
      h = Math.log((1 - s * Math.exp(i)) / (1 - s)) + u - l;
    return {
      lnSL: i,
      lN: d,
      lnW: c,
      lnYL: u,
      lnK: h,
    };
  }
  function o(e, t, a, s, o) {
    if (!(o < 1 / 0)) return 0;
    for (
      var r = function (r) {
          return l(e, t, a, s, r).lnK - o * r;
        },
        n = -1,
        i = 4,
        d = r(-1),
        c = 0;
      c < 100;
      c++
    ) {
      var u = 0.5 * (n + i),
        h = r(u);
      h > 0 == d > 0 ? ((n = u), (d = h)) : (i = u);
    }
    return 0.5 * (n + i);
  }
  function r(e, t, a, s, l) {
    if (!(l < 1 / 0)) return 0;
    var o = e.m * e.d;
    return (
      (o * e.a + ((1 - e.rho - (1 - a) * e.a) * e.psi * o) / (1 - s) + t) /
      (l + a / s)
    );
  }
  function n(e, t, a, s, l, o) {
    var r = 1e-6 > Math.abs(1 - o.sigma) ? 1 - 1e-6 : o.sigma,
      n = 1 - r,
      i = o.sL,
      d = 1 - i,
      c = "number" == typeof o.eps ? o.eps : 1 / 0,
      u = Math.exp(-e.lN) - (1 - a),
      h = (1 - i * Math.exp(e.lnSL)) * Math.exp(-n * e.xr),
      m = s[0] / l[0],
      p = s[1] / l[1],
      f = (Math.log(u / a) - Math.log(m)) / r,
      g = -Math.log(p) / r,
      x = i * u * Math.exp(n * (f - t)) + i * (1 - a) * Math.exp(n * (g - t));
    function _(e) {
      var a = 1 - h * Math.exp(n * e),
        s = (r / n) * Math.log(a / x),
        l = s + n * t;
      return {
        sLt: a,
        u: s,
        lnY: l,
        lnK: Math.log((1 - a) / d) + l - e,
      };
    }
    var y = 0;
    if (c < 1 / 0) {
      for (
        var w = function (e) {
            return _(e).lnK - c * e;
          },
          b = -1,
          v = 4,
          k = w(-1),
          M = 0;
        M < 100;
        M++
      ) {
        var j = 0.5 * (b + v),
          S = w(j);
        S > 0 == k > 0 ? ((b = j), (k = S)) : (v = j);
      }
      y = 0.5 * (b + v);
    }
    var N = _(y),
      A = N.u / r + f,
      T = N.u / r + g;
    return {
      lnWC: A,
      lnWN: T,
      lnWavg: Math.log(
        (Math.exp(A) * s[0] + Math.exp(T) * s[1]) / (s[0] + s[1]),
      ),
      xr: y,
      lnK: N.lnK,
      lnY: N.lnY,
      lnSL: Math.log(N.sLt / i),
      Lam: u,
      B: h,
    };
  }
  function i(e, t, a, s, l, o, r) {
    var n = 1e-6 > Math.abs(1 - r.sigma) ? 1 - 1e-6 : r.sigma,
      i = 1 - n,
      d = r.sL,
      c = 1 - d,
      u = "number" == typeof r.eps ? r.eps : 1 / 0,
      h = Math.exp(-e.lN) - (1 - a),
      m = (1 - d * Math.exp(e.lnSL)) * Math.exp(-i * e.xr),
      p = -Math.log(l / o[1]) / n,
      f = d * h * Math.exp(i * (s - t));
    function g(e) {
      var l = 1 - m * Math.exp(i * e),
        r = t + Math.log((l - f) / (d * (1 - a))) / i,
        u = n * (r - p),
        g = u + i * t;
      return {
        sLt: l,
        lnWN: r,
        lnY: g,
        ellC: o[0] * (h / a) * Math.exp(-n * (s - u / n)),
        lnK: Math.log((1 - l) / c) + g - e,
      };
    }
    var x = 0;
    if (u < 1 / 0) {
      for (
        var _ = function (e) {
            return g(e).lnK - u * e;
          },
          y = -1,
          w = 4,
          b = _(-1),
          v = 0;
        v < 100;
        v++
      ) {
        var k = 0.5 * (y + w),
          M = _(k);
        M > 0 == b > 0 ? ((y = k), (b = M)) : (w = k);
      }
      x = 0.5 * (y + w);
    }
    var j = g(x);
    return {
      ellC: j.ellC,
      lnWN: j.lnWN,
      xr: x,
      lnK: j.lnK,
      lnY: j.lnY,
      lnSL: Math.log(j.sLt / d),
    };
  }
  function d(e, t) {
    var a = e.m * e.d;
    return (1 - e.rho) * e.psi * a + (1 - t) * (1 - e.psi) * a * e.a;
  }
  function c(e, t) {
    var a = e[1] * Math.exp(t);
    return [e[0] + e[1] - a, a];
  }
  function u(e, t, a, s) {
    return ((s = s || 0), 1e-9 > Math.abs(1 - t))
      ? a * (e.m * e.d * e.a + s)
      : -Math.log(
          1 -
            a +
            a *
              (1 - -(e.m * e.d * Math.expm1(-(1 - t) * e.a))) *
              Math.exp(-(1 - t) * s),
        ) /
          (1 - t);
  }
  function h(e) {
    var t = e.gA / e.sL,
      a = e.oneMinusPhi * e.sL + e.lambda;
    return {
      g: t,
      oneMinusPhiR: a,
      gamma: e.lambda / a,
      halfLife: Math.LN2 / (a * t),
      gR: (a * t) / e.lambda,
      gIota: (a * t) / e.lambda - (t + e.n),
    };
  }
  function m(e, t) {
    return t.iotaR * Math.exp(h(t).gIota * (e - t.t0));
  }
  function p(e, t, a, s) {
    var l = h(a),
      o = a.lambda * e - l.oneMinusPhiR * t;
    return l.g * (s ? o : Math.exp(o) - 1);
  }
  function f(e, t, a, s, n) {
    var i,
      c,
      h,
      m,
      p,
      f,
      g,
      x,
      _ = a.sigma,
      y = a.sL,
      w = 1 - y,
      b = "number" == typeof a.eps ? a.eps : 1 / 0,
      v = e.m * e.d,
      k = v * e.a,
      M = -(1 - e.rho) * e.psi * v,
      j = (1 - _) * e.psi * k,
      S = b < 1 / 0 ? t / (b + _ / y) : 0,
      N = -((w / y) * (1 - _)) * S;
    if ("exact" === s) {
      f = o(e, t, _, y, b);
      var A = l(e, t, _, y, f);
      c = A.lnSL;
      h = A.lN;
      i = A.lnW;
      g = A.lnK;
      x = 0 === f ? 0 : c - l(e, t, _, y, 0).lnSL;
      m = l(e, 0, _, y, 0).lnW;
      p = "dual" === n ? y * i + w * f : u(e, _, y, t);
    } else {
      f = r(e, t, _, y, b);
      x = -((w / y) * (1 - _)) * (f - S);
      m = k;
      i = k + t - (w / y) * f;
      c = M + j + N + x;
      h = d(e, _);
      p = y * i + w * f;
      g = -(y / w) * c + (i - c) - f;
    }
    return {
      md: v,
      mda: k,
      level: m,
      displacement: M,
      substitution: j,
      lnSLideas: N,
      rental: x,
      lnW: i,
      lnSL: c,
      lN: h,
      lnYL: i - c,
      lnTFP: p,
      xr: f,
      lnK: g,
      aStarStar: (1 - e.rho) / (1 - _),
      epsStar: (w - _ + e.psi * ((1 - e.rho) / e.a - (1 - _))) / y,
    };
  }
  function g(e, t) {
    for (var a = 0, s = 0; s < e.length; s++) a += e[s] * t[s];
    return a;
  }
  function x(e, t, a, s) {
    for (
      var l = t.length,
        o = Array(l),
        r = Array(l),
        n = Array(l),
        i = Array(l),
        d = Array(l),
        c = 0,
        u = 0;
      u < l;
      u++
    ) {
      i[u] = a.m[u] * e.m;
      var h = a.d[u] * e.d,
        m = a.a[u] * e.a,
        p = a.psi[u] * e.psi;
      (i[u] > 1 + 1e-12 || h > 1 + 1e-12 || p > 1 + 1e-12) && c++;
      d[u] = p * i[u] * h;
      o[u] = (1 - e.rho) * d[u];
      r[u] = (1 - p) * i[u] * h * m;
    }
    var f = g(t, o),
      x = g(t, r);
    for (u = 0; u < l; u++) n[u] = -(o[u] - f) - (1 - s) * (r[u] - x);
    return {
      delta: o,
      gS: r,
      ltilde: n,
      deltaBar: f,
      gSBar: x,
      mO: i,
      amd: d,
      sharesAboveOne: c,
    };
  }
  function _(e, t) {
    for (var a = e.length, s = Array(a), l = 0, o = 0, r = 0; r < a; r++) {
      s[r] = e[r] * Math.exp(t[r]);
      l += e[r];
      o += s[r];
    }
    for (r = 0; r < a; r++) s[r] *= l / o;
    return s;
  }
  function y(e) {
    return -Math.log(1 - e);
  }
  function w(e, t, a, s) {
    var l = Math.min(t, a),
      o = Math.max(t, a);
    return l > 0 ? (e * l) / Math.pow(1 + Math.pow(l / o, s), 1 / s) : 0;
  }
  function b(e, t, a) {
    var s = t / e;
    return s < 1 ? e * Math.pow(1 - Math.pow(s, a), 1 / a) : NaN;
  }
  function v(e, t, a, s, l, o) {
    var r,
      n,
      i = e.length,
      d = Array(i),
      c = Array(i),
      u = Array(i),
      h = Array(i),
      m = Array(i),
      p = 1 - t;
    for (r = 0; r < i; r++) {
      d[r] = e[r] * p;
      c[r] = a[r] * d[r];
      u[r] = t * e[r];
    }
    function f(e, t) {
      for (var a = 0; a < i; a++) {
        for (var l = 0, o = 0; o < i; o++) l += s[o][a] * e[o];
        t[a] = l;
      }
    }
    function x(e, t, a) {
      for (var l = 0; l < i; l++) {
        for (var o = 0, r = 0; r < i; r++) o += (s[l][r] * t[r]) / e[r];
        a[l] = o;
      }
    }
    var _,
      y = 1 / 0,
      w = true;
    for (r = 0; r < i; r++)
      for (n = 0; n < i; n++) r !== n && s[r][n] > 0 && (w = false);
    if (w) {
      var v = 0;
      for (r = 0; r < i; r++) v += Math.sqrt(c[r]);
      for (r = 0; r < i; r++) u[r] = (t * Math.sqrt(c[r])) / v;
    } else if (2 === i) {
      var k = 1e-12,
        M = 1 - 1e-12;
      for (_ = 0; _ < 200; _++) {
        var j = 0.5 * (k + M);
        0 >
        (function (e) {
          var a = [e * t, (1 - e) * t],
            s = [0, 0],
            l = [0, 0];
          f(a, s);
          x(s, c, l);
          return l[0] * a[0] - c[0];
        })(j)
          ? (k = j)
          : (M = j);
      }
      u[0] = 0.5 * (k + M) * t;
      u[1] = t - u[0];
    } else
      for (_ = 0; _ < 1e5 && y > 1e-16; _++) {
        f(u, h);
        x(h, c, m);
        var S = Array(i),
          N = 0;
        for (r = 0, y = 0; r < i; r++) {
          S[r] = c[r] / m[r];
          N += S[r];
        }
        for (r = 0; r < i; r++) {
          S[r] *= t / N;
          y = Math.max(y, Math.abs(S[r] - u[r]));
          u[r] = S[r];
        }
      }
    f(u, h);
    x(h, c, m);
    var A = 0,
      T = 0;
    for (r = 0; r < i; r++) {
      A = Math.max(A, Math.abs((m[r] * u[r]) / c[r] - 1));
      m[r] > 1 && T++;
    }
    var L = Array(i),
      I = 0;
    for (r = 0; r < i; r++) {
      L[r] = c[r] / h[r];
      I = Math.max(I, L[r]);
    }
    function $(t) {
      for (var a = 0, s = 0; s < i; s++) a += e[s] * b(t, L[s], l);
      return a;
    }
    for (var F = I, W = Math.max(1, 2 * I); !($(W) >= o) && W < 1e6;) W *= 2;
    for (_ = 0; _ < 200; _++) {
      var C = 0.5 * (F + W);
      $(C) >= o ? (W = C) : (F = C);
    }
    var R = W,
      B = R,
      E = 0;
    R > 1 && I < 1 && ((B = 1), (E = 1));
    var P = Array(i),
      G = Array(i);
    for (r = 0; r < i; r++) {
      P[r] = b(B, L[r], l);
      G[r] = c[r] / P[r];
    }
    var O = g(e, a),
      q = 0;
    for (r = 0; r < i; r++) q += c[r];
    return {
      n: i,
      w: e,
      uBar: t,
      ell0: d,
      HBar: c,
      UBar: u,
      SBar: h,
      fBarO: m,
      chi: B,
      piBar: P,
      vBar: G,
      meanPiBar: g(e, P),
      chiUncapped: R,
      chiCapped: E,
      qBarO: a,
      qBar: O,
      fBar: q / t,
      residual: A,
      fBarAboveOne: T,
      mu: s,
      iota: l,
    };
  }
  return {
    NOTE: {
      sigma: 0.5,
      sL: 0.6,
      t0: 2024,
      h: 1 / 12,
      lambda: 1,
      oneMinusPhi: 3.1,
      gA: 0.01,
      n: 0.0033,
      iotaR: 0.035,
      iota: 1.27,
      piBarMean: 0.65,
      qBarAnnual: 0.11,
      qMovesAnnual: 0.06,
      qExitsAnnual: 0.05,
      mediumMid2026: {
        m: 0.12,
        d: 0.12,
        a: 0.35,
        psi: 0.5,
        rho: 0.5,
      },
      fastMid2026: {
        m: 0.2,
        d: 0.2,
        a: 0.45,
      },
      fastPaths: {
        mCeil: 0.6,
        dCeil: 0.8,
        kappa: 0.8,
        ga: 0.1,
      },
      fast2030Stated: {
        m: 0.53,
        d: 0.68,
        a: 0.8,
      },
      extremeIdeasComment: {
        years: [2025, 2026, 2027, 2028, 2029, 2030],
        dlnR: [0.001, 0.006, 0.022, 0.062, 0.146, 0.281],
        dlnApct: [0.001, 0.005, 0.025, 0.087, 0.248, 0.605],
        dlnApct2035: 6.7,
      },
    },
    READ: {
      tAnchor: 2026.5,
    },
    logisticLocation: e,
    logisticAt: t,
    linearAt: a,
    linearIntercept: function (e, t, a) {
      return e.anchor - e.slope * (t - a);
    },
    pathsAt: s,
    levelFirstOrder: function (e, t, a) {
      return e * t * a;
    },
    closedForm: l,
    rentalWedge: o,
    rentalFirstOrder: r,
    epsStarExact: function (e, t, a, s) {
      var r = function (r) {
          return l(e, t, a, s, o(e, t, a, s, r)).lnW;
        },
        n = 0.02,
        i = 200;
      if (r(0.02) >= 0) return 0;
      if (0 > r(i)) return 1 / 0;
      for (var d = 0; d < 60; d++) {
        var c = Math.sqrt(n * i);
        0 > r(c) ? (n = c) : (i = c);
      }
      return Math.sqrt(n * i);
    },
    actualEconomy: n,
    demandGivenWC: i,
    shiftNFirstOrder: d,
    twoGroupTargets: c,
    tfpBaseWeight: u,
    ideasRates: h,
    gammaOf: function (e) {
      return h(e).gamma;
    },
    halfLifeOf: function (e) {
      return h(e).halfLife;
    },
    baselineResearchGrowth: function (e) {
      return h(e).gR;
    },
    researchShareAt: m,
    growthWedge: p,
    ideasClosedForm: function (e, t, a, s, l) {
      if (e <= t) return 0;
      (l = l || 2e3) % 2 && l++;
      for (
        var o = h(s), r = o.oneMinusPhiR * o.g, n = (e - t) / l, i = 0, d = 0;
        d <= l;
        d++
      ) {
        var c = t + d * n;
        i +=
          Math.exp(-r * (e - c) + s.lambda * a(c)) *
          (0 === d || d === l ? 1 : d % 2 ? 4 : 2);
      }
      return (
        Math.log(Math.exp(-r * (e - t)) + (r * i * n) / 3) / o.oneMinusPhiR
      );
    },
    aggregates: f,
    incidence: x,
    twoGroupShift: function (e, t, a) {
      var s = 1 - t,
        l = e.m * e.d,
        o =
          -(s / t) *
          ((1 - e.rho) * e.psi * l + (1 - a) * (1 - e.psi) * l * e.a);
      return [o, -(t / s) * o];
    },
    targets: _,
    wmean: g,
    rateFromFraction: y,
    quitRate: function (e, t, a) {
      return y(e + t * a);
    },
    hires: w,
    fillingRateAtRest: b,
    steadyState: v,
    destinationShares: function (e) {
      for (var t = e.n, a = Array(t), s = 0; s < t; s++) {
        a[s] = Array(t);
        for (var l = 0; l < t; l++)
          a[s][l] = (e.mu[s][l] * (e.HBar[l] / e.SBar[l])) / e.fBarO[s];
      }
      return a;
    },
    simulate: function (e) {
      var t = e.note,
        a = t.h,
        o = t.t0,
        r = e.tAnchor;
      if ("number" == typeof e.start && e.start !== o)
        throw Error(
          "simulate: the rebased start (D12) left with the research sector (D49): the run starts at t0 = " +
            o,
        );
      var u,
        h,
        g,
        b = Math.round((e.horizon - o) / a),
        k = e.groups,
        M = e.flows,
        j = k.w.length,
        S = Array(j);
      for (u = 0; u < j; u++) S[u] = y(M.qXO[u] + +M.qTO[u]);
      var N = v(k.w, M.uBar, S, M.muNormal || M.mu, t.iota, t.piBarMean),
        A = M.mu,
        T = M.thetaH;
      if (!(M.gamma >= 0 && M.gamma <= 1))
        throw Error(
          "flows.gamma, the cognitive wage's rigidity per year (the sticky-wage merger, 2026-08-20), must lie in [0, 1]; got " +
            M.gamma,
        );
      var L = Math.pow(M.gamma, a),
        I = 0,
        $ =
          2 === j &&
          0 === k.rel.m[1] &&
          1 === k.rel.d[0] &&
          1 === k.rel.a[0] &&
          1 === k.rel.psi[0] &&
          1e-12 > Math.abs(k.rel.m[0] * k.w[0] - 1);
      function F(a) {
        var o,
          n = s(a, e.paths, r),
          i = x(n, k.w, k.rel, t.sigma);
        if ($) {
          var u =
            "exact" === e.levelForm ? l(n, 0, t.sigma, t.sL).lN : d(n, t.sigma);
          i.ltilde = [Math.log((o = c(N.ell0, u))[0] / N.ell0[0]), u];
        } else o = _(N.ell0, i.ltilde);
        return {
          t: a,
          x: n,
          inc: i,
          tgt: o,
        };
      }
      var W,
        C,
        R,
        B,
        E = N.ell0.slice(),
        P = N.UBar.slice(),
        G = N.fBarO.slice(),
        O = 0,
        q = [],
        z = {
          sharesAboveOne: 0,
          hiresAboveStock: 0,
          findingAboveOne: 0,
          negativeStock: 0,
          layoffsActive: 0,
          chiCapped: N.chiCapped,
          costConditionViolated: 0,
          targetRule: $ ? "addingUp" : "normalisation",
          overhangN: 0,
          wageBelowMPL: 0,
          demandInfeasible: 0,
          ssResidual: N.residual,
          fBarAboveOne: N.fBarAboveOne,
          degeneratePaths:
            ((W = e.paths),
            (C = []),
            ["m", "d"].forEach(function (e) {
              var t = W[e];
              (t.kappa > 0 && t.anchor < t.ceil) || C.push(e);
            }),
            (R = W.a) &&
              "number" == typeof R.ceil &&
              R.ceil < R.anchor &&
              C.push("a"),
            C),
        },
        H = F(o);
      for (g = 0; g <= b; g++) {
        var D,
          V = o + g * a;
        B = F(o + (g + 1) * a);
        var Y = H.x,
          U = H.inc,
          K = H.tgt;
        z.sharesAboveOne += U.sharesAboveOne;
        var X = f(Y, O, t, e.levelForm, e.tfpForm),
          J = "exact" === e.levelForm ? X : f(Y, O, t, "exact", e.tfpForm),
          Q = Array(j),
          Z = Array(j),
          ee = Array(j),
          et = Array(j),
          ea = Array(j),
          es = Array(j),
          el = Array(j),
          eo = Array(j),
          er = Array(j),
          en = 0,
          ei = 0,
          ed = null;
        for (u = 0; u < j; u++)
          ee[u] = ((D = M.qXO[u]), y(D + M.qTO[u] * (G[u] / N.fBarO[u])));
        if (!$)
          throw Error(
            "simulate: the sticky-wage block (D44) needs the two-group actual economy (all exposure on the first group, the second untouched); other groupings have no layoff rule since theta^D left the model",
          );
        var ec = E[0] + Math.max(0, P[0] - N.UBar[0]),
          eu = J.lnW,
          eh = n(J, O, k.w[0], [ec, E[1]], N.ell0, t),
          em = eh.lnWC - eu,
          ep = eu + (I = L * I + (1 - L) * em),
          ef = i(J, O, k.w[0], ep, E[1], N.ell0, t);
        ef.ellC >= 0 ||
          (z.demandInfeasible++,
          (ef = {
            ellC: E[0],
          }));
        var eg = Math.max(0, E[0] - ef.ellC),
          ex = Math.max(0, ef.ellC - E[0]);
        for (
          et[0] = Math.max(0, eg - ee[0] * E[0]),
            ea[0] = 0,
            es[0] = (Math.max(0, ee[0] * E[0] - eg) + T * ex) / N.piBar[0],
            Q[0] = Math.max(0, Math.log(E[0]) - Math.log(B.tgt[0])),
            Z[0] = Math.max(0, Math.log(B.tgt[0]) - Math.log(E[0])),
            ed = {
              NC: ec,
              wcClear: eh.lnWC,
              gc: em,
              g: I,
              lnWC: ep,
              ellD: ef.ellC,
              E: eg,
              Z: ex,
            },
            u = 1;
          u < j;
          u++
        ) {
          Q[u] = Math.max(0, Math.log(E[u]) - Math.log(B.tgt[u]));
          Z[u] = Math.max(0, Math.log(B.tgt[u]) - Math.log(E[u]));
          et[u] = 0;
          Q[u] > 0 && z.overhangN++;
          ea[u] = 0;
          es[u] = ((ee[u] + T * Z[u]) * E[u]) / N.piBar[u];
        }
        for (u = 0; u < j; u++) {
          et[u] > 0 && z.layoffsActive++;
          en += E[u] * Q[u];
          ei += P[u];
        }
        for (h = 0; h < j; h++) {
          var e_ = 0;
          for (u = 0; u < j; u++) e_ += A[u][h] * P[u];
          el[h] = e_;
        }
        var ey = 0;
        for (h = 0; h < j; h++) {
          eo[h] = w(N.chi, el[h], es[h], t.iota);
          eo[h] > Math.min(el[h], es[h]) && z.hiresAboveStock++;
          ey += eo[h];
        }
        for (u = 0; u < j; u++) {
          var ew = 0;
          for (h = 0; h < j; h++)
            ew += el[h] > 0 ? (A[u][h] * eo[h]) / el[h] : 0;
          er[u] = ew;
          ew > 1 && z.findingAboveOne++;
        }
        var eb = ei - N.uBar,
          ev = n(J, O, k.w[0], E, N.ell0, t),
          ek = ed.lnWC,
          eM = Math.log(
            (Math.exp(ek) * E[0] + Math.exp(ev.lnWN) * E[1]) / (E[0] + E[1]),
          ),
          ej = ev.lnY,
          eS = p(ej, O, t, e.ideasFirstOrder),
          eN = {
            t: V,
            k: g,
            x: Y,
            dlnR: ej,
            dg: eS,
            dlnA: O,
            iotaR: m(V, t),
            lnW: X.lnW,
            lnSL: X.lnSL,
            lnYL: X.lnYL,
            lnTFP: X.lnTFP,
            level: X.level,
            displacement: X.displacement,
            substitution: X.substitution,
            lnSLideas: X.lnSLideas,
            rental: X.rental,
            xr: X.xr,
            lnK: X.lnK,
            netReturn:
              "number" == typeof t.rBar
                ? t.rBar * Math.exp(X.xr) - t.deltaK
                : null,
            epsStar: X.epsStar,
            slack: Y.a - (X.xr - X.lnW),
            lnYactual: X.lnYL - t.sL * eb,
            wC_act: ek,
            mplC_act: ev.lnWC,
            wN_act: ev.lnWN,
            wavg_act: eM,
            g: ed.g,
            gc: ed.gc,
            wcClear_act: ed.wcClear,
            NC: ed.NC,
            ellD: ed.ellD,
            E: ed.E,
            Z: ed.Z,
            transfer_act:
              t.sL *
              k.w[0] *
              (E[0] / N.ell0[0]) *
              (Math.exp(ek) - Math.exp(ev.lnWC)),
            xr_act: ev.xr,
            lnK_act: ev.lnK,
            lnY_act: ev.lnY,
            lnSL_act: ev.lnSL,
            netReturn_act:
              "number" == typeof t.rBar
                ? t.rBar * Math.exp(ev.xr) - t.deltaK
                : null,
            delta: U.delta,
            gS: U.gS,
            ltilde: U.ltilde,
            deltaBar: U.deltaBar,
            gSBar: U.gSBar,
            mO: U.mO,
            amd: U.amd,
            tgt: K,
            tgtNext: B.tgt,
            G: Q,
            B: Z,
            q: ee,
            D: et,
            Drho: ea,
            v: es,
            S: el,
            H: eo,
            f: er,
            ell: E.slice(),
            U: P.slice(),
            Ut: ei,
            ft: ei > 0 ? ey / ei : 0,
            uAI: eb,
            Gt: en,
            Ht: ey,
            X: 0,
          };
        eN.slack < 0 && z.costConditionViolated++;
        ek < ev.lnWC - 1e-12 && z.wageBelowMPL++;
        var eA = 0,
          eT = false;
        for (u = 0; u < j; u++) {
          var eL = (1 - ee[u]) * E[u] - et[u] - ea[u] + eo[u],
            eI = P[u] + ee[u] * E[u] + et[u] + ea[u] - er[u] * P[u];
          (eL >= 0 && eI >= 0) || (z.negativeStock++, (eT = true));
          eA += Math.abs(eL - E[u]);
          E[u] = eL;
          P[u] = eI;
          G[u] = er[u];
        }
        if (((eN.X = 0.5 * eA), q.push(eN), (O += a * eS), eT)) {
          z.stoppedAt = V;
          break;
        }
        H = B;
      }
      return {
        rows: q,
        ss: N,
        diag: z,
        p: e,
        start: o,
      };
    },
    gridTimes: function (e, t, a) {
      for (
        var s = Math.round((a - e) / t), l = Array(s + 1), o = 0;
        o <= s;
        o++
      )
        l[o] = e + o * t;
      return l;
    },
  };
})();
ModelKernel.NOTE.t0;
export { ModelKernel };
