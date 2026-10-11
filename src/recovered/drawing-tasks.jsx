// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { makeMarkerStroke, makeMarkerPath } from "./drawing-strokes.jsx";
import { createSeededRandom } from "./question-specs-2.jsx";
import { tU, hashNoise } from "./drawing-noise.jsx";
import { NEUTRAL_INK, AUGMENTATION_INK, AUTOMATION_INK } from "./palette.jsx";
function am(e, t, a, s, l, o = {}) {
  return makeMarkerStroke(
    [
      [e, t],
      [(e + a) / 2, (t + s) / 2],
      [a, s],
    ],
    {
      width: o.width ?? 1.3,
      color: o.color ?? "currentColor",
      seed: Math.round(13 * l) + 5,
      opacity: o.opacity ?? 0.34,
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
let TASK_CELL_SIZE = 52;
let af = (e) => 7 * e + 3;
function ag(e, t, a, s, l, o = {}) {
  return a_(e, t, a, s, o, l).passes;
}
function ax(e, t, a, s, l = {}) {
  return a_(e, t, a, s, l).weather;
}
function a_(e, t, a, s, l, o = () => l.color ?? "#333") {
  var r, n, i, d, c;
  let u,
    h,
    m,
    p,
    {
      seed: f,
      span: g,
      len: x,
      sw: _,
      pt: y,
      nPass: w,
    } = ((r = e),
    (n = t),
    (i = a),
    (d = s),
    (u = (c = l).seed ?? 1),
    (m = (h = "v" === c.direction) ? i : d),
    (p = (function (e, t = false) {
      return t ? e : Math.max(e, 10);
    })(c.strokeWidth ?? Math.min(24, Math.max(10, m / 3)), c.finePass)),
    {
      seed: u,
      span: m,
      len: h ? d : i,
      sw: p,
      pt: (e, t) => (h ? [r + t, n + e] : [r + e, n + t]),
      nPass: Math.max(1, Math.ceil(m / (0.72 * p))),
    }),
    b = l.color ?? "#333",
    v = l.endScatter ?? 1,
    k = createSeededRandom(77 * f + 3),
    M = [];
  for (let e = 0; e < w; e++) {
    let t =
        (1 === w ? g / 2 : 0.45 * _ + (e * (g - 0.9 * _)) / (w - 1)) +
        (k() - 0.5) * _ * 0.08,
      a = (k() - 0.5) * x * 0.02 * v,
      s = x + (k() - 0.5) * x * 0.02 * v,
      l = (k() - 0.5) * _ * 0.12,
      r = y(a, t - l),
      n = y((a + s) / 2, t + (k() - 0.5) * _ * 0.08),
      i = y(s, t + l);
    M.push(
      makeMarkerPath([r, n, i], {
        width: 1.18 * _,
        seed: f + 17 * e,
        color: o(e, w),
        opacity: 1,
        taperIn: 0.025,
        taperOut: 0.02,
        startWidth: 0.88,
        endWidth: 0.88,
        belly: 0.015,
        wobble: 0.05,
        edge: 0.035 * _ + 0.4,
        chisel: 0.12,
        core: false,
        streaks: false,
      }),
    );
  }
  let j = "";
  if (false !== l.pressure && g > 26 && x > 40) {
    let e = Math.max(2, Math.round(0.8 * w));
    for (let t = 0; t < e; t++) {
      let e = g * (0.1 + 0.8 * k()),
        a = _ * (1.2 + 0.8 * k()),
        s = 0.65 > k(),
        o = s ? tU(b, 0.05 + 0.06 * k()) : (l.paper ?? "#ffffff"),
        r = s ? 0.09 + 0.05 * k() : 0.07 + 0.04 * k(),
        n = (k() - 0.5) * a * 0.25,
        i = [
          y(0.02 * x, e - n),
          y(0.5 * x, e + (k() - 0.5) * a * 0.15),
          y(0.98 * x, e + n),
        ];
      [
        [1.6, 0.55],
        [0.85, 1],
      ].forEach((e, s) => {
        j += makeMarkerPath(i, {
          width: a * e[0],
          seed: f + 51 + 19 * t + 7 * s,
          color: o,
          opacity: r * e[1],
          taperIn: 0.05,
          taperOut: 0.05,
          startWidth: 0.75,
          endWidth: 0.75,
          belly: 0.02,
          wobble: 0.06,
          edge: 0.22 * a,
          chisel: 0.1,
          core: false,
          streaks: false,
        });
      });
    }
  }
  if (false !== l.mottle && g > 26 && x > 40) {
    let l = 2 + Math.floor(2 * k());
    for (let o = 0; o < l; o++) {
      let l = e + a * (0.18 + 0.64 * k()),
        r = t + s * (0.18 + 0.64 * k()),
        n = k() * Math.PI,
        i = Math.min(x, g) * (0.35 + 0.5 * k()),
        d = (Math.cos(n) * i) / 2,
        c = (Math.sin(n) * i) / 2;
      j += makeMarkerPath(
        [
          [l - d, r - c],
          [l + (k() - 0.5) * i * 0.2, r + (k() - 0.5) * i * 0.2],
          [l + d, r + c],
        ],
        {
          width: _ * (0.9 + 0.7 * k()),
          seed: f + 91 + 7 * o,
          color: tU(b, 0.08),
          opacity: 0.05 + 0.03 * k(),
          taperIn: 0.25,
          taperOut: 0.25,
          startWidth: 0.35,
          endWidth: 0.35,
          belly: 0.1,
          wobble: 0.1,
          edge: 2,
          chisel: 0.1,
          core: false,
          streaks: false,
        },
      );
    }
  }
  if (false !== l.rim && g > 18 && x > 18) {
    let l = Math.max(3, 0.16 * _),
      o = 0.55 * l + 1,
      r = tU(b, 0.13),
      n = (e, t, a) =>
        makeMarkerPath([e, [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2], t], {
          width: l,
          seed: f + 171 + 13 * a,
          color: r,
          opacity: 0.16,
          taperIn: 0.08,
          taperOut: 0.08,
          startWidth: 0.5,
          endWidth: 0.5,
          belly: 0,
          wobble: 0.07,
          edge: 0.5,
          chisel: 0.1,
          core: false,
          streaks: false,
        });
    j +=
      n([e + o, t + o], [e + a - o, t + o], 0) +
      n([e + a - o, t + o], [e + a - o, t + s - o], 1) +
      n([e + a - o, t + s - o], [e + o, t + s - o], 2) +
      n([e + o, t + s - o], [e + o, t + o], 3);
  }
  return {
    passes: M,
    weather: j,
  };
}
function makeTaskSquare(e, t = TASK_CELL_SIZE, a = "currentColor") {
  let s = af(e);
  return {
    passes: ag(0, 0, t, t, () => a, {
      seed: s,
      color: a,
      paper: "#FAF9F5",
    }),
    weather: ax(0, 0, t, t, {
      color: a,
      seed: s,
      paper: "#FAF9F5",
    }),
  };
}
function aw(e, t, a, s, l = {}) {
  let o = l.opacity ?? 0.94,
    { passes: r, weather: n } = a_(e, t, a, s, l);
  return (
    '<g class="mk" style="mix-blend-mode:multiply"><g opacity="' +
    o +
    '">' +
    r.join("") +
    "</g>" +
    n +
    "</g>"
  );
}
let ab = {
  neutral: NEUTRAL_INK,
  aug: AUGMENTATION_INK,
  auto: AUTOMATION_INK,
};
function av(e) {
  let t = hashNoise(3.31 * af(e) + 5.7);
  return t < 0.46 ? "neutral" : t < 0.76 ? "aug" : "auto";
}
let ak = (e) => ab[av(e)];
let aM = {
  core: 0.33,
  edge: 0.26,
  coreRadius: 0.35,
  blob: 1,
  gain: 2.4,
};
let aj = (e) => (e < 0 ? 0 : e > 1 ? 1 : e);
let aS = (e) => {
  let t = aj(e);
  return t * t * (3 - 2 * t);
};
let aN = (e, t, a) => e + (t - e) * a;
let aA = (e, t) => hashNoise(157.31 * e + 311.7 * t + 0.5);
function aT(e, t) {
  let a = Math.floor(e),
    s = Math.floor(t),
    l = aS(e - a),
    o = aS(t - s);
  return aN(
    aN(aA(a, s), aA(a + 1, s), l),
    aN(aA(a, s + 1), aA(a + 1, s + 1), l),
    o,
  );
}
function aL(e, t, a, s, l = aM, o = 1) {
  let r = Math.min(1, Math.hypot(e / a, t / s)),
    n = aN(l.core, l.edge, aS((r - l.coreRadius) / (1 - l.coreRadius))) * o,
    i = l.blob;
  return (
    aj(
      0.5 +
        (0.65 * aT(e / i, t / i) +
          0.35 * aT(e / (0.4 * i), t / (0.4 * i)) -
          0.5) *
          l.gain,
    ) < n
  );
}
export {
  am,
  TASK_CELL_SIZE,
  af,
  ag,
  ax,
  a_,
  makeTaskSquare,
  aw,
  ab,
  av,
  ak,
  aM,
  aj,
  aS,
  aN,
  aA,
  aT,
  aL,
};
