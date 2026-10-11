// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import heroChartStyles from "../styles/HeroChart.classes.js";
import {
  CHART_THEME,
  SCENARIO_PALETTES,
  pickPaletteShade,
} from "./palette.jsx";
import { makeMarkerStroke, at } from "./drawing-strokes.jsx";
import { RULE_FILTER_ID, MARKER_FILTER_ID } from "./drawing-noise.jsx";
let a5 = (e, t, a) => Math.max(t, Math.min(a, e));
let a3 = (e) => {
  let t = 43758.5453 * Math.sin(127.1 * e + 311.7);
  return t - Math.floor(t);
};
let a6 = (() => {
  let e = new Float32Array(1024);
  for (let t = 0; t < 1024; t++) {
    let a = 43758.5453 * Math.sin(127.1 * t + 311.7);
    e[t] = a - Math.floor(a);
  }
  return e;
})();
let a4 = (e) => a6[(733.1 * e) & 1023];
let a8 = {
  ...CHART_THEME,
  slow: SCENARIO_PALETTES.slow[0],
  central: SCENARIO_PALETTES.central[0],
  fast: SCENARIO_PALETTES.fast[0],
};
a8.slow;
a8.central;
a8.fast;
let a7 = (() => {
  let e = 0x1352770,
    t = () => (e = (0x41c64e6d * e + 12345) % 0x80000000) / 0x80000000,
    a = [];
  for (let e = 0; e < 180; e++) {
    let s = e / 179,
      l = t(),
      o = 2.3 + 11.6 * Math.pow(0.82 * s + 0.18 * l, 2.1),
      r = 0.9 + 1.9 * Math.pow(s, 1.4) + 0.25 * l,
      n = o > 6 ? "fast" : o > 3.5 ? "central" : "slow",
      i = [];
    for (let e = 0; e <= 26; e++) {
      let t = e / 26;
      i.push([2026 + 4 * t, 2.2 + (o - 2.2) * Math.pow(t, r)]);
    }
    a.push({
      end: o,
      curve: r,
      pts: i,
      d: 0.55 * s + 0.45 * t(),
      j: t(),
      family: n,
    });
  }
  return a;
})();
let a9 =
  (a8.baseline,
  a8.baseline,
  a8.slow,
  a8.central,
  a8.fast,
  [3.6, 1.15, 1, 1, 1.2].reduce((e, t) => [...e, e[e.length - 1] + t], [0]));
a9[a9.length - 1];
let se = () => () => {};
let st = a7.map((e, t) => t).sort((e, t) => a7[e].end - a7[t].end);
let sa = a7[st[0]].end;
let ss = a7[st[st.length - 1]].end;
let sl = {
  fanReach: 0.99,
  linePitch: 1.9,
  spacing: 1,
  fullRuns: 0.22,
  tailShare: 0.28,
  curveSoft: 1,
  bloom: 2.7,
  fanLen: 1,
  startGap: 0,
  startSpread: 0.18,
  startHide: 40,
  startFeather: 0,
  drawMs: 3600,
  laneStagger: 0.28,
  laneSpan: 0.6,
  laneSpanVar: 0.32,
  wobble: 0,
  opacity: 1,
};
function so(e, t, a, s = true) {
  let l = React.useRef(0),
    o = React.useRef(a);
  o.current = a;
  React.useEffect(() => {
    let a = e.current;
    if (!a || !s) return;
    let r = false,
      n = new IntersectionObserver(
        (e) => {
          let a = e[e.length - 1];
          a.intersectionRatio >= 0.3
            ? (() => {
                if (r) return;
                if (
                  ((r = true),
                  0 === t ||
                    window.matchMedia("(prefers-reduced-motion: reduce)")
                      .matches)
                )
                  return o.current(1);
                let e = performance.now() + 120,
                  a = (s) => {
                    let r = a5((s - e) / t, 0, 1);
                    o.current(r);
                    r < 1 && (l.current = requestAnimationFrame(a));
                  };
                l.current = requestAnimationFrame(a);
              })()
            : !a.isIntersecting &&
              r &&
              ((r = false), cancelAnimationFrame(l.current), o.current(0));
        },
        {
          threshold: [0, 0.3],
        },
      );
    n.observe(a);
    return () => {
      n.disconnect();
      cancelAnimationFrame(l.current);
    };
  }, [e, t, s]);
}
/* 首屏分叉曲线由原模型和带种子的绘图算法生成，不是静态背景图。 */
function HeroChart({ contentX }) {
  let t = React.useRef(null),
    a = React.useRef(null),
    [s, l] = React.useState({
      w: 1e3,
      h: 900,
    }),
    o = React.useSyncExternalStore(
      se,
      () => true,
      () => false,
    );
  React.useEffect(() => {
    let e = t.current;
    if (!e) return;
    let a = () => {
      let t = e.getBoundingClientRect();
      l((e) => {
        let a = Math.max(320, Math.round(t.width)),
          s = Math.max(120, Math.round(t.height));
        return e.w === a && e.h === s
          ? e
          : {
              w: a,
              h: s,
            };
      });
    };
    a();
    let s = new ResizeObserver(a);
    s.observe(e);
    return () => s.disconnect();
  }, []);
  let r = Math.round(contentX ?? 0.66 * s.w),
    n = s.w > 0 && (s.w < 700 || (null != contentX && contentX >= s.w - 1)),
    i = n ? s.w + 26 : Math.round(0.8 * r),
    d = React.useMemo(
      () =>
        (function (e, t, a = false) {
          let s = 110 * !a,
            l = e - 52,
            o = (e, t) => (a3(e) - 0.5) * 2 * t,
            r = (e, t, a, s, l, o) =>
              makeMarkerStroke(
                [
                  [e, t],
                  [(e + a) / 2, (t + s) / 2],
                  [a, s],
                ],
                {
                  width: o ? 1.9 : 1.2 * (0.85 + 0.4 * a3(l + 0.6)),
                  color: a8.rule,
                  seed: Math.round(7 * l) + 3,
                  opacity: o ? 0.42 : 0.3,
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
              ),
            n = "";
          for (let e = 78, a = 0; e < l - 0.5; e += 26, a++) {
            let l = 900 + 4.3 * a;
            n += r(-78, e, t - Math.abs(o(l + 17, s)), e, l, (a + 1) % 4 == 0);
          }
          for (let e = -78, a = 0; e < t - 0.5; e += 26, a++) {
            let t = 3.7 * a;
            n += r(e, 52 + o(t + 11, 40), e, l + o(t + 17, 40), t, false);
          }
          return n;
        })(s.h, i, n),
      [s.h, i, n],
    ),
    h = React.useMemo(
      () =>
        (function (e, t, a, s, l = false) {
          let o = t / 2,
            r = 0 + s.startGap,
            n = r - s.startHide,
            i = Math.max(1, s.fanLen * a - n),
            d = a5(i / 1.15, t * (l ? 1.3 * s.fanReach : s.fanReach), 2.2 * t),
            c = Math.min(i, 1.15 * d),
            u = s.bloom,
            h = c / 5.28,
            m = Math.pow(1.32, u) + s.startSpread,
            p = d / 2 / m,
            f = (e) => n + (e - 2026) * h,
            g = s.wobble,
            x = a5(
              Math.round((2 * p * m) / (4.3 * Math.max(0.2, s.linePitch))),
              16,
              a7.length,
            ),
            _ = Array.from(
              {
                length: x,
              },
              (e, t) =>
                st[x > 1 ? Math.round((t * (a7.length - 1)) / (x - 1)) : 0],
            ),
            y = 0;
          return {
            runs: _.map((e, t) => {
              let a = a7[e],
                l = (Math.floor(t / 2) + 0.5) / Math.ceil(x / 2),
                r =
                  ((0.5 + a5((a.end - sa) / (ss - sa), 0, 1) * (x - 1)) / x) *
                    (1 - s.spacing) +
                  l * s.spacing,
                n =
                  (t % 2 == 0 ? -1 : 1) *
                  a5(r + (a3(9.1 * e + 4.4) - 0.5) * 0.012, 0, 1.02),
                i =
                  (a3(2.7 * e + 5) < s.fullRuns
                    ? 1
                    : 0.5 + 0.5 * Math.pow(a3(4.41 * e + 8.7), 0.8)) * 1.32,
                d = i * s.startFeather * a3(1.37 * e + 3.3),
                c = u + (a.curve - u) * (1 - s.curveSoft),
                m = n * s.startSpread * p,
                _ = (e) => o + n * p * Math.pow(e, c),
                w = (t, a) => {
                  let s = a5(
                      Math.round(
                        Math.hypot(4 * (a - t) * h, Math.abs(_(a) - _(t))) / 24,
                      ),
                      12,
                      60,
                    ),
                    l = [];
                  for (let o = 0; o <= s; o++) {
                    let r = t + (o / s) * (a - t),
                      n = 2026 + 4 * r,
                      i = a5(r / 0.12, 0, 1);
                    l.push([
                      f(n) + (a4(8.3 * e + 3.1 * n + 5) - 0.5) * g * i,
                      _(r) + m + (a4(4.7 * e + 2.3 * n) - 0.5) * g * i,
                    ]);
                  }
                  return l;
                },
                b = 0.87 + 0.26 * a.j,
                v = pickPaletteShade(
                  SCENARIO_PALETTES[a.family],
                  a3(3.7 * e + 1.9),
                ),
                k = a3(7.77 * e + 0.9),
                M = Math.max(0.396, i - 1.32 * s.tailShare),
                j = [
                  ...at(w(d, M), {
                    width: 4.3 * b,
                    color: v,
                    seed: 13 * e + 1,
                    dashLength: 6.2 + 1.6 * k,
                    gap: 5.4 + 1.6 * k,
                    opacity: s.opacity,
                    samples: 160,
                  }),
                  ...at(w(M, i), {
                    width: 4.3 * b * 0.9,
                    color: v,
                    seed: 13 * e + 4,
                    dashLength: 5.5 + 1.5 * k,
                    gap: 12 + 9 * k,
                    opacity: 0.8 * s.opacity,
                    samples: 80,
                  }),
                ];
              y += j.length;
              return {
                key: e,
                pieces: j,
              };
            }),
            centerY: o,
            clipX: r,
            marks: y,
          };
        })(s.w, s.h, r, sl, n),
      [s.w, s.h, 0, r, sl, n],
    ),
    m = React.useRef(null),
    p = React.useRef(0),
    f = (e) => {
      let t = m.current;
      if (t)
        for (let a of t.runs) {
          let t = a.pieces.length;
          if (a.cursor >= t) continue;
          let s = a5((e - a.off) / a.span, 0, 1),
            l = (s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2) * t,
            o = Math.floor(l),
            r = Math.min(o + 14, t),
            n = "";
          for (let e = a.cursor; e < r; e++)
            !a.shown[e] &&
              (e < o || a3(5.9 * a.key + 1.37 * e) < (l - e + 14) / 14 - 1) &&
              ((a.shown[e] = 1), (n += a.pieces[e]));
          for (; a.cursor < t && a.shown[a.cursor];) a.cursor++;
          n && a.el.insertAdjacentHTML("beforeend", n);
        }
    };
  React.useEffect(() => {
    let e = a.current;
    e &&
      ((e.innerHTML = ""),
      (m.current = {
        runs: h.runs.map((t) => {
          let a = document.createElementNS("http://www.w3.org/2000/svg", "g");
          e.appendChild(a);
          return {
            pieces: t.pieces,
            key: t.key,
            el: a,
            shown: new Uint8Array(t.pieces.length),
            cursor: 0,
            off: a3(2.71 * t.key + 0.5) * sl.laneStagger,
            span: sl.laneSpan + a3(3.31 * t.key + 1.1) * sl.laneSpanVar,
          };
        }),
        lastAppend: 0,
      }),
      p.current > 0 && f(p.current));
  }, [h, sl]);
  let [g, x] = React.useState(false);
  React.useEffect(() => {
    let e = window.setTimeout(() => x(true), 130);
    return () => window.clearTimeout(e);
  }, []);
  so(
    t,
    sl.drawMs,
    (e) => {
      let t = m.current;
      if (!t) return;
      if (((p.current = e), 0 === e)) {
        for (let e of t.runs) {
          e.el.innerHTML = "";
          e.shown.fill(0);
          e.cursor = 0;
        }
        t.lastAppend = 0;
        return;
      }
      let a = performance.now();
      (e < 1 && a - t.lastAppend < 30) || ((t.lastAppend = a), f(e));
    },
    g,
  );
  return (
    <div ref={t} className={heroChartStyles.chart}>
      {o && (
        <svg
          className={heroChartStyles.svg}
          viewBox={`0 0 ${s.w} ${s.h}`}
          preserveAspectRatio={"xMidYMid meet"}
          role={"img"}
          aria-label={
            "A model of economic growth: the present at the left, and a fan of modelled futures blooming rightward across hand-ruled graph paper"
          }
        >
          <g
            className={heroChartStyles.gridIn}
            filter={`url(#${RULE_FILTER_ID})`}
            dangerouslySetInnerHTML={{
              __html: d,
            }}
          />
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
            }}
          >
            <g ref={a} />
          </g>
        </svg>
      )}
    </div>
  );
}
export { a5, a3, a6, a4, a8, a7, a9, se, st, sa, ss, sl, so, HeroChart };
