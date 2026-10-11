// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import introArtStyles from "../styles/IntroArt.classes.js";
import {
  tD,
  hashNoise,
  RULE_FILTER_ID,
  MARKER_FILTER_ID,
} from "./drawing-noise.jsx";
import { aM, ag, af, ax, aL, am, ak } from "./drawing-tasks.jsx";
import { ah, an } from "./drawing-grid.jsx";
import { ok } from "./QuestionSlider.jsx";
let oj = {
  cell: 26,
  opacity: 0.55,
  rag: 24,
  edgeY: 44,
  edgeX: 64,
  minPiece: 20,
};
let oS = Math.round(18.2);
let oN = (e, t) => (1.4 * tD(e) - 0.4) * t * 26;
let oA = (e) => Math.max(0.5, e / 26 - 1);
let oT = (e) => Math.max(2.5, e / 26 / 3);
let oL = (e, t, a, s) => {
  var l;
  let o, r, n;
  o = Math.floor((l = e / a));
  r = l - o;
  return (
    (((n = hashNoise(1.37 * o + t)) +
      (hashNoise((o + 1) * 1.37 + t) - n) * (r * r * (3 - 2 * r))) *
      (s + 1.5) -
      1.5) *
    26
  );
};
let oI = {
  ...aM,
  core: 0.5,
  edge: 0.5,
  coreRadius: 0.5,
};
let o$ = Array.from(
  {
    length: 24,
  },
  (e, t) =>
    ag(0, 0, 52, 52, () => "currentColor", {
      seed: af(t),
      paper: "#FAF9F5",
    }),
);
let oF = Array.from(
  {
    length: 24,
  },
  (e, t) =>
    ax(0, 0, 52, 52, {
      color: "currentColor",
      seed: af(t),
      paper: "#FAF9F5",
    }),
);
let oW = (e) => `efx-intro-${e}`;
let oC = (e) => hashNoise(2.71 * e + 0.5);
function QuizGrid({ width, height, clear, compact = false }) {
  let l = React.useMemo(() => {
      let l,
        o = 52 * !compact,
        r = width - 2 * o,
        n = height - 104;
      if (r < 104 || n < 104) return null;
      let i =
          compact && clear.length > 0
            ? [
                clear.reduce((e, t) => ({
                  left: Math.min(e.left, t.left),
                  top: Math.min(e.top, t.top),
                  right: Math.max(e.right, t.right),
                  bottom: Math.max(e.bottom, t.bottom),
                })),
              ]
            : clear,
        d = i.map((e) =>
          compact ? 1 : 1 + Math.min(1.5, (e.bottom - e.top) / 26 / 3),
        ),
        u = i.map((e, t) => {
          var a;
          let l, r;
          a = d[t];
          l = 26 * a;
          r = (e) =>
            compact ? 0 : 26 * Math.round(3 * hashNoise(7.1 * t + e));
          return {
            left: 26 * Math.floor((e.left - o - l) / 26) - r(1),
            top: 26 * Math.floor((e.top - 52 - l) / 26) - r(2),
            right: 26 * Math.ceil((e.right - o + l) / 26) + r(3),
            bottom: 26 * Math.ceil((e.bottom - 52 + l) / 26) + r(4),
          };
        });
      compact ||
        ((l = Math.max(...u.map((e) => e.right - e.left))),
        u.forEach((e) => {
          let t = l - (e.right - e.left);
          if (t <= 0) return;
          let a = 26 * Math.ceil(t / 2 / 26);
          e.left -= a;
          e.right += a;
        }));
      let h = i.map((e) => ({
        left: e.left - o,
        top: e.top - 52,
        right: e.right - o,
        bottom: e.bottom - 52,
      }));
      compact &&
        u.forEach((e) => {
          e.left = -26;
          e.right = r + 26;
        });
      let m = u.map((e) => ({
          ...e,
        })),
        p = ah(r, n, oj, m),
        f = compact ? Math.ceil(r / 26) : Math.floor(r / 26),
        g = Math.floor(n / 26),
        x = f / 2,
        _ = g / 2,
        y = 26 * Math.round((r - 26 * f) / 2 / 26),
        w = 26 * Math.round((n - 26 * g) / 2 / 26),
        b = [],
        v = [];
      for (let e = 0; e < g; e++)
        for (let t = 0; t < f; t++) {
          let a = y + 26 * t,
            s = w + 26 * e;
          if (
            u.some((l, o) => {
              let r = 31.7 * o,
                n = h[o],
                i = oT(l.right - l.left),
                d = oT(l.bottom - l.top),
                c = oA(n.top - l.top),
                u = oA(l.bottom - n.bottom),
                m = oA(n.left - l.left),
                p = oA(l.right - n.right),
                f = Math.min(
                  n.top - 26,
                  l.top +
                    oN(r + 1.9 * t + 1, 0.4 * c) +
                    oL(t, r + 11, i, 0.6 * c),
                ),
                g = Math.max(
                  n.bottom + 26,
                  l.bottom -
                    oN(r + 1.9 * t + 2, 0.4 * u) -
                    oL(t, r + 12, i, 0.6 * u),
                ),
                x = Math.min(
                  n.left - 26,
                  l.left +
                    oN(r + 2.3 * e + 3, 0.4 * m) +
                    oL(e, r + 13, d, 0.6 * m),
                );
              return (
                a <
                  Math.max(
                    n.right + 26,
                    l.right -
                      oN(r + 2.3 * e + 4, 0.4 * p) -
                      oL(e, r + 14, d, 0.6 * p),
                  ) &&
                a + 26 > x &&
                s < g &&
                s + 26 > f
              );
            }) ||
            !aL(t - x, e - _, x, _, oI)
          )
            continue;
          let l = (e + 512) * 1024 + (t + 512),
            o = (e, t) =>
              !m.some(
                (a) => e > a.left && e < a.right && t > a.top && t < a.bottom,
              ),
            r = [];
          o(a + 13, s - 13) ||
            r.push([a, s - oS, a, s], [a + 26, s - oS, a + 26, s]);
          o(a + 13, s + 26 + 13) ||
            r.push(
              [a, s + 26, a, s + 26 + oS],
              [a + 26, s + 26, a + 26, s + 26 + oS],
            );
          o(a - 13, s + 13) ||
            r.push([a - oS, s, a, s], [a - oS, s + 26, a, s + 26]);
          o(a + 26 + 13, s + 13) ||
            r.push(
              [a + 26, s, a + 26 + oS, s],
              [a + 26, s + 26, a + 26 + oS, s + 26],
            );
          r.forEach(([e, t, a, s], o) => {
            let r = 0.13 * l + 3.1 * o;
            v.push(
              <g
                dangerouslySetInnerHTML={{
                  __html: am(e, t, a, s, r, {
                    width: 1.2 * (0.85 + 0.4 * hashNoise(r + 0.6)),
                    color: "var(--chart-rule, #87867F)",
                    opacity: oj.opacity,
                  }),
                }}
                key={`${l}-${o}`}
              />,
            );
          });
          b.push(
            <use
              className={introArtStyles.cell}
              href={`#${oW(l % 24)}`}
              transform={`translate(${a} ${s})`}
              style={{
                "--fd": `${Math.round(700 * oC(af(l)))}ms`,
                color: ak(l),
              }}
              key={l}
            />,
          );
        }
      return {
        w: r,
        h: n,
        ix: o,
        rules: p,
        cells: b,
        whiskers: v,
      };
    }, [width, height, clear, compact]),
    o = React.useRef(null),
    { drawn: r, settled: n } = (function (e, { ready = true } = {}) {
      let [a, s] = React.useState(ok);
      React.useEffect(() => {
        let a = e.current?.closest("section") ?? e.current;
        if (!a || !ready) return;
        let l = 0,
          o = false,
          r = () => {
            cancelAnimationFrame(l);
            d.disconnect();
            window.removeEventListener("scroll", i);
            window.removeEventListener("resize", i);
          },
          n = () => {
            l = 0;
            let { top: e } = a.getBoundingClientRect(),
              t = e < window.innerHeight,
              o = e <= 0;
            o && r();
            s((e) =>
              (!t || e.drawn) && (!o || e.settled)
                ? e
                : {
                    drawn: e.drawn || t,
                    settled: e.settled || o,
                  },
            );
          },
          i = () => {
            o && !l && (l = requestAnimationFrame(n));
          },
          d = new IntersectionObserver(
            ([e]) => {
              (o = e.isIntersecting) && i();
            },
            {
              rootMargin: "100% 0px",
            },
          );
        d.observe(a);
        i();
        window.addEventListener("scroll", i, {
          passive: true,
        });
        window.addEventListener("resize", i);
        return r;
      }, [e, ready]);
      return a;
    })(o, {
      ready: !!l,
    });
  return l ? (
    <svg
      ref={o}
      className={[
        introArtStyles.art,
        r && introArtStyles.drawn,
        n && introArtStyles.settled,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: l.ix,
        top: 52,
        width: l.w,
        height: l.h,
      }}
      viewBox={`0 0 ${l.w} ${l.h}`}
      aria-hidden={true}
      focusable={"false"}
    >
      <defs>
        {Array.from(
          {
            length: 24,
          },
          (e, t) => (
            <g
              id={oW(t)}
              style={{
                isolation: "isolate",
              }}
              transform={"scale(0.5)"}
              key={t}
            >
              {o$[t].map((e, t) => (
                <g
                  className={introArtStyles.sline}
                  style={{
                    "--dd": `${Math.round(110 * oC(13.3 * t + 7))}ms`,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: e,
                  }}
                  key={t}
                />
              ))}
              <g
                dangerouslySetInnerHTML={{
                  __html: oF[t],
                }}
              />
            </g>
          ),
        )}
      </defs>
      <g filter={`url(#${RULE_FILTER_ID})`} opacity={oj.opacity}>
        <g
          dangerouslySetInnerHTML={{
            __html: l.rules.map((e) => an(e, oj)).join(""),
          }}
        />
        {l.whiskers}
      </g>
      <g
        filter={`url(#${MARKER_FILTER_ID})`}
        style={{
          mixBlendMode: "multiply",
        }}
      >
        {l.cells}
      </g>
    </svg>
  ) : null;
}
function oB(e, t) {
  let a = e.length;
  if (a >= t) return e.map((e) => [e[0], e[1]]);
  let s = [];
  for (let l = 0; l < t; l++) {
    let o = (l / (t - 1)) * (a - 1),
      r = Math.min(a - 2, Math.floor(o)),
      n = o - r;
    s.push([
      e[r][0] + (e[r + 1][0] - e[r][0]) * n,
      e[r][1] + (e[r + 1][1] - e[r][1]) * n,
    ]);
  }
  return s;
}
export { oj, oS, oN, oA, oT, oL, oI, o$, oF, oW, oC, QuizGrid, oB };
