// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import trendLinesStyles from "../styles/TrendLines.classes.js";
import { lk, useScrollDraw } from "./scroll-hooks.jsx";
import { am } from "./drawing-tasks.jsx";
import {
  hashNoise,
  RULE_FILTER_ID,
  tD,
  tX,
  MARKER_FILTER_ID,
} from "./drawing-noise.jsx";
import { lO, ChartKey } from "./ChartKey.jsx";
import { useReducedMotion } from "./viewport.jsx";
import { oB } from "./QuizGrid.jsx";
import { createSeededRandom } from "./question-specs-2.jsx";
import { makeMarkerPath, makeMarkerStroke } from "./drawing-strokes.jsx";
import { makeRuleStroke } from "./drawing-strokes-2.jsx";
let oP = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function ChartGrid({ opacity }) {
  let t = React.useRef(null),
    a = lk(t),
    s = React.useMemo(() => {
      if (a.w <= 0) return "";
      let { w: t, h: s } = a,
        l = (t, a, s, l, o) =>
          am(t, a, s, l, o, {
            width: 1.6 * (0.9 + 0.35 * hashNoise(o)),
            color: "#87867F",
            opacity,
          });
      return (
        l(1, 1, t - 1, 1, 346) +
        l(1, s - 1, t - 1, s - 1, 61.3) +
        l(1, 1, 1, s - 1, 44.4) +
        l(t - 1, 1, t - 1, s - 1, 52.9)
      );
    }, [a, opacity]);
  return (
    <div ref={t} className={trendLinesStyles.frame} aria-hidden={true}>
      {a.w > 0 && (
        <svg
          width={a.w + 16}
          height={a.h + 16}
          viewBox={`-8 -8 ${a.w + 16} ${a.h + 16}`}
          style={{
            position: "absolute",
            left: -8,
            top: -8,
          }}
        >
          <g
            filter={`url(#${RULE_FILTER_ID})`}
            dangerouslySetInnerHTML={{
              __html: s,
            }}
          />
        </svg>
      )}
    </div>
  );
}
let oO = {
  taperIn: 0.02,
  taperOut: 0.07,
  startWidth: 0.95,
  endWidth: 0.85,
};
let oq = (e) => (e in lO ? lO[e] : undefined);
let LineChart = function ({
  title,
  keyItems,
  keyLabels,
  keyStacked = false,
  note,
  unit,
  prefix = "",
  series,
  zero = false,
  gap,
  domain,
  years,
  end,
  ease = false,
  height = 168,
  frame,
  ticksInside = false,
  hover = false,
}) {
  let w,
    v,
    k = React.useRef(null),
    M = (Array.isArray(note) ? note : [note]).filter((e) => !!e),
    j = useScrollDraw(k, {
      box: "content",
    }),
    S = years?.[0] ?? 1 / 0,
    N = years?.[1] ?? -1 / 0,
    A = useReducedMotion(),
    T = ease && !A,
    L = React.useMemo(() => {
      let e = series.flatMap((e) => e.points);
      if (!e.length) return null;
      let t = Math.max(...e.map((e) => e.t)),
        a = Math.min(t, end ?? 1 / 0),
        s = domain
          ? domain.lo
          : Math.min(...e.map((e) => e.v), zero ? 0 : 1 / 0),
        l = domain ? domain.hi : Math.max(...e.map((e) => e.v));
      return {
        tEnd: a,
        t0: Math.min(...e.map((e) => e.t)),
        dataEnd: t,
        ...(function (e, t) {
          let a = Math.max(t - e, 1e-6) / 3,
            s = 10 ** Math.floor(Math.log10(a)),
            l =
              [1, 2, 2.5, 5, 10].map((e) => e * s).find((e) => e >= a) ??
              10 * s,
            o = Math.floor(e / l) * l,
            r = Math.ceil(t / l) * l,
            n = [];
          for (let e = o; e <= r + 1e-9; e += l)
            n.push(Math.round(1e3 * e) / 1e3);
          return {
            at: n,
            lo: o,
            hi: r,
          };
        })(s, l),
      };
    }, [series, end, domain, zero]),
    [I, $, F] = (function (e, t, a, s, l = 240) {
      let [o, r] = React.useState([e, t, a]),
        n = React.useRef([e, t, a]);
      React.useEffect(() => {
        let o = [e, t, a],
          i = o.every(Number.isFinite) && n.current.every(Number.isFinite);
        if (!s || !i) {
          n.current = o;
          r(o);
          return;
        }
        if (o.every((e, t) => 1e-9 > Math.abs(n.current[t] - e))) return;
        let d = n.current,
          c = null,
          u = 0,
          h = (e) => {
            c ??= e;
            let t = Math.min(1, (e - c) / l),
              a = 1 - (1 - t) ** 3;
            n.current = d.map((e, t) => e + (o[t] - e) * a);
            r(n.current);
            t < 1 && (u = requestAnimationFrame(h));
          };
        u = requestAnimationFrame(h);
        return () => cancelAnimationFrame(u);
      }, [e, t, a, s, l]);
      return s ? o : [e, t, a];
    })(L?.tEnd ?? 0, L?.lo ?? 0, L?.hi ?? 1, T),
    W = React.useMemo(() => {
      if (!L || j <= 0) return null;
      let e =
          null == end
            ? series
            : series.map((e) => ({
                ...e,
                points: (function (e, t) {
                  let a = e.filter((e) => e.t <= t + 1e-9),
                    s = e[a.length],
                    l = a[a.length - 1];
                  if (s && l && t > l.t + 1e-9) {
                    let e = (t - l.t) / (s.t - l.t);
                    a.push({
                      t,
                      v: l.v + (s.v - l.v) * e,
                    });
                  }
                  return a;
                })(e.points, I),
              })),
        t = Math.min(S, L.t0),
        a = Math.max(N, L.dataEnd),
        s = T ? e.flatMap((e) => e.points.map((e) => e.v)) : [],
        l = s.length ? Math.min($, ...s) : $,
        o = s.length ? Math.max(F, ...s) : F,
        r = L.at.filter((e) => e >= l - 1e-9 && e <= o + 1e-9),
        i = 40 * !ticksInside,
        c = ticksInside ? 32 : 22,
        u = 26 * !!ticksInside,
        h = Math.max(1, j - i - u - 46),
        m = height - 22 - c,
        f = (e) => i + u + ((e - t) / Math.max(1e-6, a - t)) * h,
        x = (e) => 22 + m - ((e - l) / Math.max(1e-6, o - l)) * m,
        y =
          gap &&
          (() => {
            let t = e.find((e) => e.key === gap.from),
              a = e.find((e) => e.key === gap.to);
            if (!t || !a || t.points.length !== a.points.length) return "";
            let s = (e) => e.points.map((e) => [f(e.t), x(e.v)]),
              l = s(t),
              o = s(a),
              r = l[l.length - 1][1] <= o[o.length - 1][1];
            return (function (e, t, a, s = 0.5) {
              if (2 > Math.min(e.length, t.length)) return "";
              let l = oB(e, 48),
                o = oB(t, 48),
                r = Math.min(l.length, o.length),
                n = (e) => Math.abs(o[e][1] - l[e][1]),
                i = 0;
              for (let e = 0; e < r; e++) i = Math.max(i, n(e));
              if (i < 4) return "";
              let d = Math.min(24, Math.max(8, i / 3)),
                c = i <= 14 ? 1 : Math.max(1, Math.ceil(i / (0.72 * d))),
                u = createSeededRandom(507.5),
                h = "";
              for (let e = 0; e < c; e++) {
                let t =
                    1 === c
                      ? 0.5
                      : (0.45 * d) / i +
                        (e * (1 - (0.9 * d) / i)) / (c - 1) +
                        (u() - 0.5) * 0.03,
                  s = 1 === c ? Math.max(8, 0.6 * i) : 1.18 * d,
                  m = s * (0.55 + 1.1 * Math.abs(t - 0.5)),
                  p = -1,
                  f = -2,
                  g = -1;
                for (let e = 0; e < r; e++) {
                  let t = n(e) >= m;
                  if ((t && g < 0 && (g = e), (!t || e === r - 1) && g >= 0)) {
                    let a = t ? e : e - 1;
                    a - g > f - p && ((p = g), (f = a));
                    g = -1;
                  }
                }
                if (f - p < 1) continue;
                let x = [];
                for (let e = p; e <= f; e++)
                  x.push([l[e][0], l[e][1] + (o[e][1] - l[e][1]) * t]);
                h += makeMarkerPath(x, {
                  width: s,
                  seed: 5.5 + 17 * e,
                  color: a,
                  opacity: 1,
                  taperIn: 0.015,
                  taperOut: 0.015,
                  startWidth: 0.92,
                  endWidth: 0.92,
                  belly: 0,
                  wobble: 0.035,
                  edge: Math.min(1.4, 0.04 * s + 0.4),
                  chisel: 0.08,
                  core: false,
                  streaks: false,
                  samples: 40,
                });
              }
              return h ? '<g opacity="' + s + '">' + h + "</g>" : "";
            })(r ? l : o, r ? o : l, gap.color);
          })();
      return {
        x: f,
        y: x,
        t0: t,
        t1: a,
        x0: i,
        gx0: i + u,
        x1: i + u + h,
        xEnd: f(I),
        tShort: L.tEnd < a - 1e-9 ? L.tEnd : null,
        xShort: f(L.tEnd),
        yTop: 22,
        yBot: 22 + m,
        ticks: r.map((e) => ({
          v: e,
          y: x(e),
        })),
        years: [t, a],
        drawn: e,
        ink:
          (y || "") +
          e
            .map((e, t) => {
              var a, s, l, o, r;
              let n, i, d, c;
              a = e.points.map((e) => [f(e.t), x(e.v)]);
              s = 7.3 * t + 2.1;
              l = e.color;
              n = oq(e.key);
              o = e.dashed ?? (!!n && "dashed" in n && !!n.dashed);
              i = oq(e.key);
              r = e.lead ?? (!!i && "lead" in i && !!i.lead);
              d = a.map(([e, t], a) => [
                e + (tD(37.13 * a + s) - 0.5) * 0.7,
                t + (tD(61.77 * a + s + 5) - 0.5) * 0.7,
              ]);
              c = {
                width: (4.6 + 0.9 * hashNoise(7.7 * s + 6)) * (r ? 1.35 : 1),
                color: l,
                seed: s,
                opacity: r ? 1 : 0.86,
              };
              return o
                ? makeRuleStroke(d, {
                    ...c,
                    neat: true,
                    landOnEnd: true,
                    samples: Math.max(48, Math.round(tX(d) / 5)),
                  })
                : makeMarkerStroke(d, {
                    ...c,
                    ...oO,
                  });
            })
            .join(""),
        ends: e.every((e) => e.points.length)
          ? (function (e, t, a) {
              let s = e.map((e) => {
                  let a = e.points[e.points.length - 1];
                  return {
                    key: e.key,
                    color: e.color,
                    endY: t(a.v),
                    endV: a.v,
                    wantY: t(a.v) + 4,
                    labelY: t(a.v) + 4,
                  };
                }),
                l = (e) => ((e - 1) * 12) / 2,
                o = [...s]
                  .sort((e, t) => t.endV - e.endV)
                  .map((e) => ({
                    items: [e],
                    centre: e.wantY,
                  })),
                r = o.length;
              for (let e = 0; e < r; e += 1) {
                let e = o.findIndex(
                  (e, t) =>
                    t + 1 < o.length &&
                    o[t + 1].centre -
                      l(o[t + 1].items.length) -
                      (e.centre + l(e.items.length)) <
                      12,
                );
                if (e < 0) break;
                let t = [...o[e].items, ...o[e + 1].items];
                o.splice(e, 2, {
                  items: t,
                  centre: t.reduce((e, t) => e + t.wantY, 0) / t.length,
                });
              }
              for (let e of (o = o.map((e) => {
                let t = l(e.items.length),
                  s = 26 + t,
                  o = a + 4 - t;
                return {
                  ...e,
                  centre:
                    o >= s ? Math.min(o, Math.max(s, e.centre)) : e.centre,
                };
              }))) {
                let t = e.centre - l(e.items.length);
                e.items.forEach((e, a) => {
                  e.labelY = t + 12 * a;
                });
              }
              return s;
            })(e, x, 22 + m)
          : [],
      };
    }, [series, L, I, $, F, T, end, j, height, gap, ticksInside, S, N]),
    [C, R] = React.useState(null),
    B = React.useRef(null),
    [E, P] = React.useState(0);
  React.useEffect(() => {
    let e = B.current,
      t = k.current;
    e &&
      t &&
      P(e.getBoundingClientRect().left - t.getBoundingClientRect().left);
  }, [j, height]);
  let G = React.useMemo(() => {
    if (null == C || !W || !W.drawn.length) return null;
    let e = W.drawn[0].points,
      t = Math.max(0, Math.min(e.length - 1, C)),
      a = e[t]?.t;
    return null == a
      ? null
      : {
          t: a,
          left: W.x(a) + E,
          rows: W.drawn
            .map((e) => {
              let t = e.points.reduce((e, t) =>
                Math.abs(t.t - a) < Math.abs(e.t - a) ? t : e,
              );
              return {
                key: e.key,
                label: e.label ?? oq(e.key)?.label ?? e.key,
                color: e.color,
                v: t.v,
              };
            })
            .filter((e) => Number.isFinite(e.v))
            .sort((e, t) => t.v - e.v),
        };
  }, [C, W, E]);
  return (
    <div
      className={
        null != frame
          ? `${trendLinesStyles.chart} ${trendLinesStyles.drawn}`
          : trendLinesStyles.chart
      }
      ref={k}
      onPointerMove={
        hover
          ? (e) => {
              if ("mouse" !== e.pointerType || !W || !W.drawn.length) return;
              let t = B.current;
              if (!t) return;
              let a = t.getBoundingClientRect(),
                s = e.clientX - a.left,
                l = W.drawn[0].points,
                o = 0,
                r = 1 / 0;
              for (let e = 0; e < l.length; e += 1) {
                let t = Math.abs(W.x(l[e].t) - s);
                t < r && ((r = t), (o = e));
              }
              R(o);
            }
          : undefined
      }
      onPointerLeave={hover ? () => R(null) : undefined}
    >
      {null != frame && <ChartGrid opacity={frame} />}
      {title ? <p className={trendLinesStyles.chartTitle}>{title}</p> : null}
      {W && (
        <svg
          width={j}
          height={height}
          className={trendLinesStyles.svg}
          aria-hidden={true}
          ref={B}
        >
          <g stroke={"var(--color-slate-300, #d1cfc5)"} strokeWidth={"1"}>
            {W.ticks.map((e) => (
              <line x1={W.gx0} y1={e.y} x2={W.x1} y2={e.y} key={e.v} />
            ))}
          </g>
          {W.ticks.map((e) =>
            ticksInside ? (
              <text
                x={W.x0}
                y={e.y + 3.5}
                className={trendLinesStyles.tick}
                textAnchor={"start"}
                key={e.v}
              >
                {e.v}
              </text>
            ) : (
              <text
                x={W.x0 - 6}
                y={e.y + 3.5}
                className={trendLinesStyles.tick}
                textAnchor={"end"}
                key={e.v}
              >
                {e.v}
              </text>
            ),
          )}
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
              isolation: "isolate",
            }}
            dangerouslySetInnerHTML={{
              __html: W.ink,
            }}
          />
          {W.ends.map((e) => (
            <text
              x={W.xEnd + 6}
              y={e.labelY}
              className={trendLinesStyles.end}
              style={{
                fill: e.color,
              }}
              key={e.key}
            >
              {prefix}
              {e.endV.toFixed(1)}
              {unit}
            </text>
          ))}
          <text
            x={W.gx0}
            y={height - 6}
            className={trendLinesStyles.year}
            textAnchor={"start"}
          >
            {Math.round(W.years[0])}
          </text>
          {null != W.tShort ? (
            <text
              x={W.xShort}
              y={height - 6}
              className={trendLinesStyles.year}
              textAnchor={"middle"}
            >
              {Math.round(W.tShort)}
            </text>
          ) : (
            <text
              x={W.x1}
              y={height - 6}
              className={trendLinesStyles.year}
              textAnchor={"end"}
            >
              {Math.round(W.years[1])}
            </text>
          )}
        </svg>
      )}
      {keyItems?.length || M.length ? (
        <div className={trendLinesStyles.chartFoot}>
          {keyItems?.length ? (
            <ChartKey
              items={keyItems}
              labels={keyLabels}
              stacked={keyStacked}
            />
          ) : null}
          {M.length ? (
            <div className={trendLinesStyles.notes}>
              {M.map((e) => (
                <p className={trendLinesStyles.note} key={e}>
                  {e}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {G && W && (
        <div className={trendLinesStyles.readout} aria-hidden={true}>
          <span
            className={trendLinesStyles.readoutRule}
            style={{
              left: G.left,
            }}
          />
          <span
            className={trendLinesStyles.readoutPanel}
            style={{
              left: G.left,
              transform:
                G.left > 0.62 * j
                  ? "translate(calc(-100% - 10px), 0)"
                  : "translate(10px, 0)",
            }}
          >
            <span className={trendLinesStyles.readoutYear}>
              {
                ((v = Math.floor((w = Math.round(12 * G.t)) / 12)),
                `${oP[w - 12 * v]} ${v}`)
              }
            </span>
            {G.rows.map((e) => (
              <span className={trendLinesStyles.readoutRow} key={e.key}>
                <span
                  className={trendLinesStyles.readoutSwatch}
                  style={{
                    background: e.color,
                  }}
                />
                <span className={trendLinesStyles.readoutLabel}>{e.label}</span>
                <span className={trendLinesStyles.readoutValue}>
                  {prefix}
                  {e.v.toFixed(2)}
                  {unit}
                </span>
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
};
let oH = "#9c9a92";
export { oP, ChartGrid, oO, oq, LineChart, oH };
