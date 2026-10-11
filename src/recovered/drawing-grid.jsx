// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { makeMarkerStroke, makeMarkerPath, t8 } from "./drawing-strokes.jsx";
import { createSeededRandom } from "./question-specs-2.jsx";
import { tU, hashNoise, tD } from "./drawing-noise.jsx";
import { makeDryStroke } from "./drawing-strokes-2.jsx";
let aa = 0;
function as(e, t, a, s, l) {
  let o = [];
  for (let r = 0; r <= l; r++) {
    let n = r / l,
      i = 1 - n,
      d = e + (a - e) * 0.45,
      c = a - (a - e) * 0.45,
      u = i * i * i * e + 3 * i * i * n * d + 3 * i * n * n * c + n * n * n * a,
      h = n * n * (3 - 2 * n);
    o.push([u, t + (s - t) * h]);
  }
  return o;
}
function al(e, t, a, s = {}) {
  return makeMarkerStroke(
    [
      [e, t - 2],
      [e, t + a / 2],
      [e, t + a + 2],
    ],
    {
      width: s.width || 13,
      color: s.color || "#333",
      seed: s.seed || 3,
      opacity: null != s.opacity ? s.opacity : 0.94,
      taperIn: 0.04,
      taperOut: 0.04,
      startWidth: 0.8,
      endWidth: 0.8,
      belly: 0.03,
      wobble: 0.05,
      chisel: 0.2,
      core: s.core,
      blend: s.blend,
    },
  );
}
function ao(e) {
  let t,
    a = e.samples || 44,
    s = e.seed || 1,
    l = as(e.x0, e.y0, e.x1, e.y1, a),
    o = as(e.x0, e.y0 + e.h0, e.x1, e.y1 + e.h1, a),
    r = e.c0 || "#cfc9ba",
    n = e.c1 || r,
    i = "";
  if (false !== e.fill) {
    let a = (e.h0 + e.h1) / 2,
      d = r;
    if (n !== r) {
      let t = "mkflow" + ++aa;
      i +=
        '<linearGradient id="' +
        t +
        '" gradientUnits="userSpaceOnUse" x1="' +
        e.x0 +
        '" y1="0" x2="' +
        e.x1 +
        '" y2="0"><stop offset="0" stop-color="' +
        r +
        '"/><stop offset="1" stop-color="' +
        n +
        '"/></linearGradient>';
      d = "url(#" + t + ")";
    }
    let c = Math.min(24, Math.max(8, a / 3)),
      u = a <= 14 ? 1 : Math.max(1, Math.ceil(a / (0.72 * c))),
      h = createSeededRandom(91 * s + 7),
      m = "";
    for (t = 0; t < u; t++) {
      let e =
          1 === u
            ? 0.5
            : (0.45 * c) / a +
              (t * (1 - (0.9 * c) / a)) / (u - 1) +
              (h() - 0.5) * 0.03,
        r = l.map((t, a) => [t[0], t[1] + (o[a][1] - t[1]) * e]),
        n = 1 === u ? a : 1.18 * c;
      m += makeMarkerPath(r, {
        width: n,
        seed: s + 17 * t,
        color: d,
        opacity: 1,
        taperIn: 0.015,
        taperOut: 0.015,
        startWidth: 0.92,
        endWidth: 0.92,
        belly: 0,
        wobble: 0.035,
        edge: Math.min(1.4, 0.04 * n + 0.4),
        chisel: 0.08,
        core: false,
        streaks: false,
        samples: 40,
      });
    }
    if (
      ((i +=
        '<g opacity="' +
        (null != e.opacity ? e.opacity : 0.5) +
        '">' +
        m +
        "</g>"),
      true === e.pressure && a > 40)
    ) {
      let e = Math.min(3, Math.max(2, Math.round(0.6 * u)));
      for (t = 0; t < e; t++) {
        let e = 0.12 + 0.76 * h(),
          a = l.map((t, a) => [t[0], t[1] + (o[a][1] - t[1]) * e]),
          n = c * (1.6 + 0.9 * h()),
          d = 0.6 > h(),
          u = d ? tU(r, 0.04 + 0.04 * h()) : "#ffffff",
          m = d ? 0.028 + 0.02 * h() : 0.028 + 0.016 * h();
        [
          [1.6, 0.55],
          [0.85, 1],
        ].forEach((e, l) => {
          i += makeMarkerPath(a, {
            width: n * e[0],
            seed: s + 121 + 19 * t + 7 * l,
            color: u,
            opacity: m * e[1],
            taperIn: 0.05,
            taperOut: 0.05,
            startWidth: 0.75,
            endWidth: 0.75,
            belly: 0,
            wobble: 0.04,
            edge: 0.3 * n,
            chisel: 0.1,
            core: false,
            streaks: false,
            samples: 40,
          });
        });
      }
    }
    if (false !== e.rim && a > 24) {
      let e = Math.max(2.5, 0.14 * c),
        t = tU(r, 0.16);
      [
        [l, 1],
        [o, -1],
      ].forEach((a, l) => {
        let o = a[0].map((t) => [t[0], t[1] + a[1] * (0.5 * e + 0.8)]);
        i += makeMarkerPath(o, {
          width: e,
          seed: s + 61 + 13 * l,
          color: t,
          opacity: 0.13,
          taperIn: 0.06,
          taperOut: 0.06,
          startWidth: 0.5,
          endWidth: 0.5,
          belly: 0,
          wobble: 0.06,
          edge: 0.5,
          chisel: 0.1,
          core: false,
          streaks: false,
          samples: 40,
        });
      });
    }
  }
  if (e.dashedEdges) {
    let t = e.edgeColor || r,
      a = e.edgeWidth || 3.2,
      n = e.edgeDashLength || 3.6 * a,
      d = e.edgeGap || 2.7 * a;
    i += makeDryStroke(l, {
      width: a,
      color: t,
      seed: s + 5,
      dashLength: n,
      gap: d,
      neat: true,
    });
    i += makeDryStroke(o, {
      width: a,
      color: t,
      seed: s + 9,
      dashLength: n,
      gap: d,
      neat: true,
    });
  }
  return t8(i, {
    blend: e.blend,
  });
}
function ar(e, t, a, s, l = {}) {
  let o = l.cell ?? 26,
    r = l.rag ?? 26,
    n = l.heavyEvery ?? 0,
    i = (e, t) => (hashNoise(e) - 0.5) * 2 * t,
    d = [];
  for (let l = t + o, c = 0; l < t + s - 0.5; l += o, c++) {
    let t = 900 + 4.3 * c;
    d.push({
      key: `h${c}`,
      x1: e + i(t + 11, r),
      y1: l,
      x2: e + a + i(t + 17, r),
      y2: l,
      seed: t,
      heavy: n > 0 && (c + 1) % n == 0,
    });
  }
  for (let l = e + o, n = 0; l < e + a - 0.5; l += o, n++) {
    let e = 3.7 * n;
    d.push({
      key: `v${n}`,
      x1: l,
      y1: t + i(e + 11, r),
      x2: l,
      y2: t + s + i(e + 17, r),
      seed: e,
      heavy: false,
    });
  }
  return d;
}
function an(e, t = {}, a) {
  let s = t.color ?? "#87867F",
    l = t.weight ?? 1.2,
    o = t.opacity ?? 0.24,
    r = a ? a.from : e.x1,
    n = a ? a.to : e.x2;
  return makeMarkerStroke(
    [
      [r, e.y1],
      [(r + n) / 2, (e.y1 + e.y2) / 2],
      [n, e.y2],
    ],
    {
      width:
        t.width ??
        (e.heavy ? 1.6 * l : l * (0.85 + 0.4 * hashNoise(e.seed + 0.6))),
      color: s,
      seed: Math.round(7 * e.seed) + 3,
      opacity: e.heavy ? 1.4 * o : o,
      taperIn: 0.04,
      taperOut: 0.04,
      startWidth: 0.7,
      endWidth: 0.7,
      belly: 0,
      wobble: 0.09,
      edge: 0.3,
      chisel: 0.1,
      core: false,
      blend: false,
    },
  );
}
let ai = 12;
let ad = (e, t = ai) => -t / 2 + tD(e) * (1.5 * t);
let ac = (e, t) => {
  let a = hashNoise(e);
  return a < 0.6 ? 0 : ((a - 0.6) / 0.4) ** 1.4 * t;
};
function au(e, t, a = {}, s) {
  let l = a.cell ?? 26,
    o = a.edgeY ?? 44,
    r = a.edgeX ?? 64,
    n = a.jut ?? ai,
    i = a.minPiece ?? 0,
    d = (e, t) => (hashNoise(e) - 0.5) * 2 * t,
    c = (s ? (Array.isArray(s) ? s : [s]) : []).map((e) => ({
      left: Math.floor(e.left / l) * l,
      top: Math.floor(e.top / l) * l,
      right: Math.ceil(e.right / l) * l,
      bottom: Math.ceil(e.bottom / l) * l,
    })),
    u = (e, t, a) => {
      let s = [];
      c.forEach((l, o) => {
        e(l) && s.push([...t(l, a + 17.3 * o)]);
      });
      s.sort((e, t) => e[0] - t[0]);
      let o = [];
      for (let e of s) {
        let t = o[o.length - 1];
        t && e[0] <= t[1] + l
          ? (t[1] = Math.max(t[1], e[1]))
          : o.push([e[0], e[1]]);
      }
      return o;
    },
    h = [],
    m = [],
    p = (e, t, a, s, l, o, r) =>
      e.push({
        key: t,
        x1: a,
        y1: s,
        x2: l,
        y2: o,
        seed: r,
        heavy: false,
      });
  for (let s = l, r = 0; s < e - 0.5; s += l, r++) {
    let e = 3.7 * r,
      l = d(e + 11, o) + ac(e + 23, a.edgeShort ?? 0),
      c = t + d(e + 17, o) - ac(e + 29, a.edgeShortBottom ?? 0),
      f = u(
        (e) => s > e.left && s < e.right,
        (e, t) => [e.top + ad(t + 2.1, n), e.bottom - ad(t + 5.3, n)],
        e,
      ),
      g = l;
    f.forEach(([t, a], l) => {
      t - g > i && p(h, `v${r}-${l}`, s, g, s, t, e + 0.3 * l);
      p(m, `v${r}p${l}`, s, t, s, a, e);
      g = Math.max(g, a);
    });
    c - g > i && p(h, `v${r}-e`, s, g, s, c, e + 0.3 * f.length);
  }
  for (let s = l, o = 0; s < t - 0.5; s += l, o++) {
    let t = 900 + 4.3 * o,
      l = d(t + 11, r) + ac(t + 23, a.edgeShortLeft ?? 0),
      c = e + d(t + 17, r) - ac(t + 29, a.edgeShortRight ?? 0),
      f = u(
        (e) => s > e.top && s < e.bottom,
        (e, t) => [e.left + ad(t + 3.7, n), e.right - ad(t + 8.9, n)],
        t,
      ),
      g = l;
    f.forEach(([e, a], l) => {
      e - g > i && p(h, `h${o}-${l}`, g, s, e, s, t + 0.3 * l);
      p(m, `h${o}p${l}`, e, s, a, s, t);
      g = Math.max(g, a);
    });
    c - g > i && p(h, `h${o}-e`, g, s, c, s, t + 0.3 * f.length);
  }
  return {
    visible: h,
    patch: m,
  };
}
function ah(e, t, a = {}, s) {
  return au(e, t, a, s).visible;
}
export { aa, as, al, ao, ar, an, ai, ad, ac, au, ah };
