// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionWaterfallStyles from "../styles/SectionWaterfall.classes.js";
import { useReducedMotion, getSectionProgress, clamp01 } from "./viewport.jsx";
import { lk } from "./scroll-hooks.jsx";
import { ah, an } from "./drawing-grid.jsx";
import { createSeededRandom } from "./question-specs-2.jsx";
import {
  pickPaletteShade,
  MODEST_PALETTE,
  SUBSTANTIAL_PALETTE,
  EXTREME_PALETTE,
} from "./palette.jsx";
import {
  tX,
  hashNoise,
  RULE_FILTER_ID,
  MARKER_FILTER_ID,
} from "./drawing-noise.jsx";
import { at } from "./drawing-strokes.jsx";
let dc = () => () => {};
let du = (e, t, a) => Math.max(t, Math.min(a, e));
let dh = {
  cell: 26,
  rag: 24,
  weight: 1.2,
  opacity: 0.3,
  edgeY: 44,
  edgeX: 64,
  jut: 52,
  minPiece: 18,
};
/* 结尾瀑布图：保留原站的种子随机数、SVG 纹理及滚动绘制效果。 */
function SectionWaterfall({ className }) {
  var t;
  let a,
    s,
    l,
    o,
    r,
    n = React.useRef(null),
    i = React.useRef(null),
    d = React.useSyncExternalStore(
      dc,
      () => true,
      () => false,
    ),
    h = React.useRef(0),
    m = React.useRef(() => {});
  t = (e) => {
    h.current = e;
    m.current(e);
  };
  a = useReducedMotion();
  s = React.useRef(0);
  l = React.useRef(0);
  (o = React.useRef(getSectionProgress)).current = getSectionProgress;
  (r = React.useRef(t)).current = t;
  React.useEffect(() => {
    a && r.current(1);
  }, [a]);
  React.useEffect(() => {
    if (a) return;
    let e = n.current;
    if (!e) return;
    let t = 0,
      i = 0,
      d = false,
      c = false,
      u = () => {
        let e,
          a = s.current,
          o = l.current;
        if (5e-4 > Math.abs(o - a)) {
          a !== o && ((s.current = o), r.current(o));
          d = false;
          return;
        }
        s.current = a + (o - a) * 0.15;
        e = s.current;
        r.current(e);
        t = requestAnimationFrame(u);
      },
      h = () => {
        i = 0;
        let a = o.current(e.getBoundingClientRect());
        null !== a &&
          a !== l.current &&
          ((l.current = a), d || ((d = true), (t = requestAnimationFrame(u))));
      },
      m = () => {
        c && !i && (i = requestAnimationFrame(h));
      },
      p = new IntersectionObserver(
        ([e]) => {
          (c = e.isIntersecting) && m();
        },
        {
          rootMargin: "25% 0px",
        },
      );
    p.observe(e);
    window.addEventListener("scroll", m, {
      passive: true,
    });
    window.addEventListener("resize", m);
    return () => {
      p.disconnect();
      cancelAnimationFrame(t);
      cancelAnimationFrame(i);
      window.removeEventListener("scroll", m);
      window.removeEventListener("resize", m);
    };
  }, [n, a]);
  let p = lk(n, {
      initial: {
        w: 1e3,
        h: 900,
      },
    }),
    { w: f, h: g } = React.useMemo(
      () => ({
        w: Math.max(320, p.w),
        h: Math.max(320, p.h),
      }),
      [p.w, p.h],
    ),
    x = React.useMemo(() => {
      let e = "";
      for (let t of ah(f, Math.round(0.72 * g), dh)) e += an(t, dh);
      return e;
    }, [f, g]),
    _ = React.useMemo(
      () =>
        (function (e, t) {
          let a = e / 2,
            s = Math.min(112, Math.round(0.13 * e)),
            l = Math.max(1.26 * a, 0.72 * (t - 8)),
            o = du(Math.round((96 * l) / 600), 72, 140),
            r = createSeededRandom(2468),
            n = [];
          for (let e = 0; e < o; e++) {
            let i = -1 + (2 * (e + 0.5)) / o + (r() - 0.5) * 0.012,
              d = Math.abs(i),
              c = pickPaletteShade(
                d < 0.34
                  ? MODEST_PALETTE
                  : d < 0.68
                    ? SUBSTANTIAL_PALETTE
                    : EXTREME_PALETTE,
                r(),
              ),
              u = 8 + d * d * 76 + 44 * r(),
              h = 0.22 > r() ? 1 : 0.5 + 0.5 * Math.pow(r(), 0.8),
              m = (e) => [
                a + i * (s + (l - s) * Math.pow(e, 2.4)),
                u + e * (t - u),
              ];
            n.push({
              key: e,
              pieces: (function (e, t, a, s, l, o) {
                let r = Math.max(0.3, t - 0.28),
                  n = [],
                  i = [];
                for (let t = 0; t <= 26; t++) n.push(e((t / 26) * r));
                for (let a = 0; a <= 10; a++) i.push(e(r + (a / 10) * (t - r)));
                let d = (e) => Math.max(48, Math.round(tX(e) / 5));
                return [
                  ...at(n, {
                    width: o,
                    color: a,
                    seed: s,
                    dashLength: 6.2 + 1.6 * l(),
                    gap: 5.4 + 1.6 * l(),
                    samples: d(n),
                  }),
                  ...at(i, {
                    width: 0.9 * o,
                    color: a,
                    seed: s + 3,
                    dashLength: 5.5 + 1.5 * l(),
                    gap: 12 + 9 * l(),
                    opacity: 0.8,
                    samples: d(i),
                  }),
                ];
              })(m, h, c, 300 + 7 * e, r, 3.8 + 1.1 * r()),
              off: 0,
              span: 1,
            });
          }
          let i = createSeededRandom(917);
          for (let e of n) {
            e.off = 0.28 * i();
            e.span = 0.6 + 0.32 * i();
          }
          return n;
        })(f, Math.round(0.96 * g)),
      [f, g],
    ),
    y = React.useRef([]),
    w = React.useRef([]),
    M = React.useRef([]);
  React.useEffect(() => {
    let e = i.current;
    if (!e) return;
    e.textContent = "";
    let t = "http://www.w3.org/2000/svg";
    y.current = _.map(() => {
      let a = document.createElementNS(t, "g"),
        s = document.createElementNS(t, "g");
      e.appendChild(a);
      e.appendChild(s);
      return {
        solid: a,
        feather: s,
      };
    });
    w.current = _.map(() => 0);
    M.current = _.map(() => -1);
  }, [_]);
  React.useEffect(() => {
    let e = (e) => {
      let t = y.current;
      if (t.length !== _.length) return;
      let a = clamp01((e - 0) / 0.9);
      for (let e = 0; e < _.length; e++) {
        let s = _[e],
          l = s.pieces.length,
          o = du((a - s.off) / s.span, 0, 1),
          r = (o < 0.5 ? 2 * o * o : 1 - Math.pow(-2 * o + 2, 2) / 2) * l,
          n = Math.min(Math.floor(r), l),
          i = w.current[e];
        if (n > i) {
          let a = "";
          for (let e = i; e < n; e++) a += s.pieces[e];
          t[e].solid.insertAdjacentHTML("beforeend", a);
          w.current[e] = n;
        } else if (n < i) {
          let a = t[e].solid;
          for (let e = i; e > n; e--) a.lastChild?.remove();
          w.current[e] = n;
        }
        let d = 0,
          c = Math.min(n + 14, l);
        for (let e = n; e < c; e++)
          hashNoise(5.9 * s.key + 1.37 * e) < (r - e + 14) / 14 - 1 &&
            (d |= 1 << (e - n));
        if (d !== M.current[e]) {
          M.current[e] = d;
          let a = "";
          for (let e = n; e < c; e++) d & (1 << (e - n)) && (a += s.pieces[e]);
          t[e].feather.innerHTML = a;
        }
      }
    };
    m.current = e;
    e(h.current);
    return () => {
      m.current = () => {};
    };
  }, [_]);
  return (
    <section
      className={
        className
          ? `${sectionWaterfallStyles.section} ${className}`
          : sectionWaterfallStyles.section
      }
    >
      <div ref={n} className={sectionWaterfallStyles.chart}>
        {d && (
          <svg
            className={sectionWaterfallStyles.svg}
            viewBox={`0 0 ${f} ${g}`}
            preserveAspectRatio={"xMidYMid meet"}
            role={"img"}
            aria-label={
              "A waterfall of modelled futures blooming downward across hand-ruled graph paper, drawn in as the page scrolls"
            }
          >
            <g
              filter={`url(#${RULE_FILTER_ID})`}
              dangerouslySetInnerHTML={{
                __html: x,
              }}
            />
            <g
              filter={`url(#${MARKER_FILTER_ID})`}
              style={{
                mixBlendMode: "multiply",
              }}
            >
              <g ref={i} />
            </g>
          </svg>
        )}
      </div>
    </section>
  );
}
export { dc, du, dh, SectionWaterfall };
