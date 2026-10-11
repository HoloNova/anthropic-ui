// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { createSeededNormal } from "./question-specs-2.jsx";
let hashNoise = (e) => {
  let t = 43758.5453 * Math.sin(127.1 * e + 311.7);
  return t - Math.floor(t);
};
let tH = (() => {
  let e = new Float32Array(1024);
  for (let t = 0; t < 1024; t++) {
    let a = 43758.5453 * Math.sin(127.1 * t + 311.7);
    e[t] = a - Math.floor(a);
  }
  return e;
})();
let tD = (e) => tH[(733.1 * e) & 1023];
let clampRange = (e, t, a) => Math.max(t, Math.min(a, e));
let tY = (e) => e * e * (3 - 2 * e);
function tU(e, t) {
  var a;
  let s,
    l =
      ((a = ((a = e) || "").trim()),
      (s = /^#([0-9a-f]{3})$/i.exec(a))
        ? [
            17 * parseInt(s[1][0], 16),
            17 * parseInt(s[1][1], 16),
            17 * parseInt(s[1][2], 16),
          ]
        : (s = /^#([0-9a-f]{6})$/i.exec(a))
          ? [
              parseInt(s[1].slice(0, 2), 16),
              parseInt(s[1].slice(2, 4), 16),
              parseInt(s[1].slice(4, 6), 16),
            ]
          : null);
  if (!l) return e;
  let o = Math.max(l[0], l[1], l[2]);
  return (
    "rgb(" +
    l
      .map((e) => Math.max(0, Math.round((e + (e - o) * 0.25) * (1 - t))))
      .join(",") +
    ")"
  );
}
function tK(e, t) {
  if (e.length < 2) return e.slice();
  let a = [0],
    s = 0;
  for (let t = 1; t < e.length; t++) {
    s += Math.hypot(e[t][0] - e[t - 1][0], e[t][1] - e[t - 1][1]);
    a.push(s);
  }
  if (0 === s) return e.slice();
  let l = [],
    o = 0;
  for (let r = 0; r < t; r++) {
    let n = (s * r) / (t - 1);
    for (; o < a.length - 2 && a[o + 1] < n;) o++;
    let i = a[o + 1] - a[o] || 1,
      d = (n - a[o]) / i;
    l.push([
      e[o][0] + (e[o + 1][0] - e[o][0]) * d,
      e[o][1] + (e[o + 1][1] - e[o][1]) * d,
    ]);
  }
  return l;
}
function tX(e) {
  let t = 0;
  for (let a = 1; a < e.length; a++)
    t += Math.hypot(e[a][0] - e[a - 1][0], e[a][1] - e[a - 1][1]);
  return t;
}
function tJ(e) {
  let t = e.length,
    a = [];
  for (let s = 0; s < t; s++) {
    let l = e[Math.max(0, s - 1)],
      o = e[Math.min(t - 1, s + 1)],
      r = o[0] - l[0],
      n = o[1] - l[1],
      i = Math.hypot(r, n) || 1;
    a.push([r / i, n / i]);
  }
  return a;
}
function tQ(e, t) {
  let a = tJ(e),
    s = e.length,
    l = [];
  for (let o = 0; o < s; o++) {
    let r = t(o / (s - 1));
    l.push([e[o][0] - a[o][1] * r, e[o][1] + a[o][0] * r]);
  }
  return l;
}
let roundToTenth = (e) => Math.round(10 * e) / 10;
function makeHandDrawnLine(e, t = {}) {
  let a,
    s,
    l = e.length;
  if (l < 2) return "";
  let o = t.width || 4,
    r = t.seed || 1,
    n = null != t.taperIn ? t.taperIn : 0.14,
    i = null != t.taperOut ? t.taperOut : 0.08,
    d = null != t.startWidth ? t.startWidth : 0.14,
    c = null != t.endWidth ? t.endWidth : 0.8,
    u = null != t.belly ? t.belly : 0.07,
    h = null != t.wobble ? t.wobble : 0.14,
    m = null != t.edge ? t.edge : 0.055 * o + 0.35,
    p = null != t.chisel ? t.chisel : 0.35,
    f = createSeededNormal(7 * r + 1, Math.max(3, Math.round(l / 9))),
    g = createSeededNormal(13 * r + 2, Math.max(4, Math.round(l / 5))),
    x = createSeededNormal(17 * r + 3, Math.max(4, Math.round(l / 5))),
    _ = tJ(e),
    y = [],
    w = [];
  for (a = 0; a < l; a++) {
    let t = a / (l - 1),
      r = 1;
    n > 0 && t < n && (r *= d + (1 - d) * (s = (s = t / n) * s * (3 - 2 * s)));
    i > 0 &&
      t > 1 - i &&
      (r *= c + (1 - c) * (s = (s = (1 - t) / i) * s * (3 - 2 * s)));
    let p = Math.max(
        0.25,
        (o * (r *= (1 + u * Math.sin(Math.PI * t)) * (1 + h * f(t)))) / 2,
      ),
      b = -_[a][1],
      v = _[a][0];
    y.push([e[a][0] + b * (p + m * g(t)), e[a][1] + v * (p + m * g(t))]);
    w.push([e[a][0] - b * (p + m * x(t)), e[a][1] - v * (p + m * x(t))]);
  }
  let b = p * o;
  y[l - 1] = [y[l - 1][0] + _[l - 1][0] * b, y[l - 1][1] + _[l - 1][1] * b];
  w[0] = [w[0][0] - _[0][0] * b * 0.6, w[0][1] - _[0][1] * b * 0.6];
  let v = "M" + roundToTenth(y[0][0]) + " " + roundToTenth(y[0][1]);
  for (a = 1; a < l; a++)
    v += "L" + roundToTenth(y[a][0]) + " " + roundToTenth(y[a][1]);
  for (a = l - 1; a >= 0; a--)
    v += "L" + roundToTenth(w[a][0]) + " " + roundToTenth(w[a][1]);
  return v + "Z";
}
let MARKER_FILTER_ID = "mk-marker";
let DRY_FILTER_ID = "mk-dry";
let RULE_FILTER_ID = "mk-rule";
export {
  hashNoise,
  tH,
  tD,
  clampRange,
  tY,
  tU,
  tK,
  tX,
  tJ,
  tQ,
  roundToTenth,
  makeHandDrawnLine,
  MARKER_FILTER_ID,
  DRY_FILTER_ID,
  RULE_FILTER_ID,
};
