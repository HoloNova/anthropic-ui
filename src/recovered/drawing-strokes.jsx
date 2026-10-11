// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { tX, tK, makeHandDrawnLine, tQ, tU } from "./drawing-noise.jsx";
import { createSeededNormal, createSeededRandom } from "./question-specs-2.jsx";
function makeLiteFilter(e, t, a, s) {
  return (
    '<filter id="' +
    e +
    '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="' +
    t +
    '" numOctaves="2" seed="' +
    a +
    '" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="' +
    s +
    '" k4="0"/></filter>'
  );
}
function t6(e, t) {
  return t && t.samples
    ? t.samples
    : Math.max(16, Math.min(160, Math.round(tX(e) / 5)));
}
function makeMarkerPath(e, t = {}) {
  let a = t.width || 4,
    s = t.seed || 1,
    l = t.color || "#333",
    o = tK(e, t6(e, t)),
    r = null != t.opacity ? t.opacity : 0.92,
    n =
      '<path d="' +
      makeHandDrawnLine(o, {
        width: a,
        seed: s,
        taperIn: t.taperIn,
        taperOut: t.taperOut,
        startWidth: t.startWidth,
        endWidth: t.endWidth,
        belly: t.belly,
        wobble: t.wobble,
        edge: t.edge,
        chisel: t.chisel,
      }) +
      '" fill="' +
      l +
      '" fill-opacity="' +
      r +
      '"/>';
  if (a >= 3.5 && false !== t.core) {
    let e = createSeededNormal(5 * s + 9, 5),
      t = tQ(o, (t) => e(t) * a * 0.17);
    n +=
      '<path d="' +
      makeHandDrawnLine(t, {
        width: 0.45 * a,
        seed: s + 31,
        taperIn: 0.2,
        taperOut: 0.16,
        startWidth: 0.2,
        endWidth: 0.5,
        edge: 0.03 * a + 0.3,
        chisel: 0.25,
      }) +
      '" fill="' +
      tU(l, 0.12) +
      '" fill-opacity="0.30"/>';
    let r = tQ(o, () => 0.3 * a);
    n +=
      '<path d="' +
      makeHandDrawnLine(r, {
        width: 0.16 * a,
        seed: s + 57,
        taperIn: 0.25,
        taperOut: 0.2,
        startWidth: 0.15,
        endWidth: 0.4,
        edge: 0.5,
        chisel: 0.15,
      }) +
      '" fill="' +
      tU(l, 0.18) +
      '" fill-opacity="0.22"/>';
  }
  if (a >= 14 && false !== t.streaks) {
    let e = t.paper || "#ffffff";
    [-0.22, 0.05, 0.26].forEach((t, l) => {
      let r = tQ(o, (e) => t * a * (1 + 0.15 * Math.sin(5 * e + l)));
      n +=
        '<path d="' +
        makeHandDrawnLine(r, {
          width: a * (0.09 + 0.04 * l),
          seed: s + 71 + 13 * l,
          taperIn: 0.3,
          taperOut: 0.25,
          startWidth: 0.2,
          endWidth: 0.3,
          edge: 0.6,
          chisel: 0.1,
        }) +
        '" fill="' +
        e +
        '" fill-opacity="' +
        (0.1 + (l % 2) * 0.04) +
        '"/>';
    });
  }
  return n;
}
function t8(e, t) {
  return (
    '<g class="mk"' +
    (t && false === t.blend ? "" : ' style="mix-blend-mode:multiply"') +
    ">" +
    e +
    "</g>"
  );
}
function makeMarkerStroke(e, t = {}) {
  return t8(makeMarkerPath(e, t), t);
}
function at(e, t = {}) {
  let a = t.width || 4,
    s = t.seed || 1,
    l = t.color || "#333",
    o = t.dashLength || 3.4 * a,
    r = t.gap || 1.6 * a,
    n = null != t.opacity ? t.opacity : 1,
    i = tK(e, Math.max(48, t6(e, t))),
    d = tX(i),
    c = createSeededRandom(101 * s + 5),
    u = !!t.neat,
    h = [],
    m = 0.3 * o * c(),
    p = 0,
    f = (e, t) => {
      let o = e / d,
        r = t / d,
        h = Math.max(0, Math.floor(o * (i.length - 1))),
        m = Math.min(i.length - 1, Math.ceil(r * (i.length - 1))),
        p = "";
      if (m - h >= 1) {
        let t = tK(i.slice(h, m + 1), 8),
          o = (c() - 0.5) * (u ? 0.018 : 0.06),
          r = Math.cos(o),
          d = Math.sin(o),
          f = 0,
          g = 0,
          x;
        for (x = 0; x < t.length; x++) {
          f += t[x][0];
          g += t[x][1];
        }
        for (f /= t.length, g /= t.length, x = 0; x < t.length; x++) {
          let e = t[x][0] - f,
            a = t[x][1] - g;
          t[x] = [f + e * r - a * d, g + e * d + a * r];
        }
        let _ = a * (u ? 0.94 + 0.12 * c() : 0.85 + 0.35 * c());
        p =
          '<path d="' +
          makeHandDrawnLine(t, {
            width: _,
            seed: s + Math.round(e),
            taperIn: 0.18,
            taperOut: 0.18,
            startWidth: 0.55,
            endWidth: 0.5,
            belly: u ? 0.02 : 0.05,
            wobble: u ? 0.03 : 0.08,
            edge: u ? 0.25 : 0.05 * _ + 0.3,
            chisel: u ? 0.2 : 0.35,
          }) +
          '" fill="' +
          l +
          '" fill-opacity="' +
          ((u ? 0.9 + 0.08 * c() : 0.82 + 0.16 * c()) * n).toFixed(2) +
          '"/>';
        c() < (u ? 0.12 : 0.35) &&
          (p +=
            '<path d="' +
            makeHandDrawnLine(t, {
              width: 0.5 * _,
              seed: s + Math.round(e) + 7,
              taperIn: 0.3,
              taperOut: 0.3,
              startWidth: 0.3,
              endWidth: 0.3,
              edge: 0.4,
              chisel: 0.2,
            }) +
            '" fill="' +
            tU(l, 0.13) +
            '" fill-opacity="' +
            (0.3 * n).toFixed(2) +
            '"/>');
      }
      return p;
    };
  for (; m < d - 2;) {
    let e = Math.min(d, m + o * (u ? 0.92 + 0.16 * c() : 0.8 + 0.45 * c()));
    h.push(f(m, e));
    p = e;
    m = e + r * (u ? 0.9 + 0.2 * c() : 0.75 + 0.5 * c());
  }
  t.landOnEnd && d - p > 0.5 * o && h.push(f(Math.max(p + 0.4 * r, d - o), d));
  return h;
}
export { makeLiteFilter, t6, makeMarkerPath, t8, makeMarkerStroke, at };
