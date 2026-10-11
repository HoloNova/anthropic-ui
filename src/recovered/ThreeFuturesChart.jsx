// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import scenarioFanChartStyles from "../styles/ScenarioFanChart.classes.js";
import { at, makeMarkerStroke } from "./drawing-strokes.jsx";
import {
  s2,
  s9,
  s4,
  sJ,
  s0,
  s7,
  sK,
  sb,
  sU,
  s3,
  sp,
  sZ,
  s1,
  sQ,
} from "./model-metrics.jsx";
import { SCENARIO_PALETTES, pickPaletteShade } from "./palette.jsx";
import {
  clampRange,
  hashNoise,
  tD,
  tY,
  RULE_FILTER_ID,
  MARKER_FILTER_ID,
} from "./drawing-noise.jsx";
import { lk } from "./scroll-hooks.jsx";
import { am } from "./drawing-tasks.jsx";
import { oH } from "./LineChart.jsx";
import { so } from "./HeroChart.jsx";
import { ScenarioPaper } from "./ThreeFuturesChart-2.jsx";
import { LegendStroke, lG } from "./ChartKey.jsx";
let iU = {
  thickness: 4.5,
  length: 4.5,
  gap: 6.5,
  wobble: 0.7,
  pressure: 0.3,
};
function iK(e, t = {}) {
  return at(e, {
    width: t.width ?? 4.3,
    color: t.color ?? "currentColor",
    seed: t.seed ?? 1,
    dashLength: t.dashLength ?? iU.length,
    gap: t.gap ?? iU.gap,
    opacity: t.opacity ?? 1,
    landOnEnd: t.landOnEnd ?? true,
    samples: t.samples,
  });
}
let iX = (e) => s2[e] ?? ("you" === e ? 8 : 9);
let iJ = {
  ...iU,
  thickness: 4.3,
  pressure: 0.3,
};
let iQ = iJ.wobble;
let iZ = {
  slow: SCENARIO_PALETTES.slow[0],
  central: SCENARIO_PALETTES.central[0],
  fast: SCENARIO_PALETTES.fast[0],
};
let i0 = () => () => {};
let i1 = (e, t) => {
  let a = e.length;
  if (0 === a) return 0;
  let s = e[0][0],
    l = e[a - 1][0];
  if (1 === a || t <= s) return e[0][1];
  if (t >= l) return e[a - 1][1];
  let o = ((t - s) / (l - s)) * (a - 1),
    r = Math.min(a - 2, Math.floor(o)),
    n = o - r;
  return e[r][1] * (1 - n) + e[r + 1][1] * n;
};
let i2 = (e, t = 1, a = 90) => {
  let s = clampRange(t, 0, 1),
    l = (t) => [2026 + 4 * t, i1(e, 2026 + 4 * t)],
    o = [];
  for (let e = 0; e <= a; e++) {
    let t = e / a;
    if (t > s) break;
    o.push(l(t));
  }
  s > 0 && (o.length - 1) / a < s && o.push(l(s));
  return o.length > 1 ? o : [l(0), l(Math.max(s, 1e-4))];
};
let i5 = "";
let i3 = [];
let i6 = new Map();
function ThreeFuturesChart({ user, colorStage = 0, className }) {
  let s = React.useRef(null),
    l = React.useSyncExternalStore(
      i0,
      () => true,
      () => false,
    ),
    o = lk(s, {
      initial: {
        w: 1440,
        h: 760,
      },
    }),
    r = React.useMemo(
      () => ({
        w: Math.max(360, o.w),
        h: Math.max(260, o.h),
      }),
      [o.w, o.h],
    ),
    n = r.w > 0 && r.w < 700,
    i = React.useMemo(
      () =>
        (function (e, t, a = false) {
          let s,
            l,
            o = e.w,
            r = a ? 52 : 78,
            n = a ? 104 : 78,
            i = 52 + 26 * Math.floor((o - (a ? 13 : 156) - 52) / 26);
          if (a) {
            let t = Math.max(
              52,
              Math.min(364, 52 * Math.floor((e.h - 52 - n) / 52)),
            );
            l =
              (s = Math.max(
                52,
                Math.min(i7((e.h - t) / 2 - 26), i7(e.h - n - t)),
              )) + t;
          } else
            s =
              (l = i7(e.h - n)) - Math.max(52, 52 * Math.floor((l - 156) / 52));
          let d = i - r,
            c = (e) => r + ((e - 2025.15) / 4.849999999999909) * d,
            u = (l - s) / 20,
            h = (e) => l - (e - 30) * u,
            m = [],
            p = (e, t, a, s, l, o) =>
              m.push({
                key: e,
                html: am(t, a, s, l, o, {
                  width: 1.6 * (0.9 + 0.35 * hashNoise(o)),
                  color: "var(--chart-rule)",
                  opacity: 0.62,
                }),
              });
          p("floor", r, l, i, l, 346);
          p("ceil", r, s, i, s, 61.3);
          p("wall-l", r, s, r, l, 44.4);
          p("wall-r", i, s, i, l, 52.9);
          for (let e = 40; e < 50 - 1e-6; e += 10)
            p(`h${e}`, r, h(e), i, h(e), 17.3 * e);
          let f = [];
          for (let e = 30; e <= 50 + 1e-6; e += 10)
            f.push({
              label: `$${e}T`,
              y: h(e),
            });
          let g = [];
          for (let e = Math.ceil(2025.15); e <= 2030 + 1e-6; e += 1)
            (a && e !== Math.ceil(2025.15) && e !== Math.floor(2030)) ||
              g.push({
                label: String(e),
                x: c(e),
              });
          let x = s9.map(([e, t]) => ({
              year: e,
              x: c(e),
              y: h(t),
            })),
            _ = Math.round(clampRange((c(2030) - c(2026)) / 3, 34, 340)),
            y = `${r}|${i}|${s}|${l}|${_}`,
            w = ((y === i5 && i3.length) ||
              ((i3 = s4.map((e, t) => {
                let a,
                  s = sJ(e),
                  l = hashNoise(5.9 * t + 2),
                  o = 3.1 * t + 7;
                return {
                  pieces: iK(
                    i2(s0(e), 1, _).map(([e, t]) => [
                      c(e) + (tD(37.13 * e + o) - 0.5) * iQ,
                      h(t) + (tD(61.77 * e + o + 5) - 0.5) * iQ,
                    ]),
                    {
                      width: 4.3 * (0.87 + 0.26 * l),
                      color:
                        ((a = (function (e) {
                          let t,
                            a = (t = s7())
                              .slice(0, -1)
                              .map((e, a) => (e.lift + t[a + 1].lift) / 2),
                            s = 0;
                          for (; s < a.length && e >= a[s];) s++;
                          return s7()[s].key;
                        })(s)),
                        pickPaletteShade(
                          SCENARIO_PALETTES[a],
                          hashNoise(3.7 * t + 1.9),
                        )),
                      seed: 13 * t + 1,
                      dashLength: iJ.length,
                      gap: iJ.gap,
                      opacity: +(1 - 0.3 * l),
                      samples: Math.max(64, _),
                    },
                  ),
                };
              })),
              (i5 = y)),
            i3).map((e, t) => ({
              pieces: e.pieces,
              seed: 3.1 * t + 7,
            })),
            b = (e, t, a, s, l = 1) => ({
              fade: e,
              seed: a,
              pieces: (function (e, t, a, s, l, o, r) {
                let n = i6.get(e);
                if (n) return n;
                i6.size > 24 && i6.clear();
                let i = iK(
                  i2(a, 1).map(([e, a]) => [
                    o(e) + (tD(37.13 * e + t) - 0.5) * iJ.wobble,
                    r(a) + (tD(61.77 * e + t + 5) - 0.5) * iJ.wobble,
                  ]),
                  {
                    width: 4.3 * (0.87 + 0.26 * hashNoise(7.7 * t + 6)),
                    color: s,
                    seed: t,
                    dashLength: iJ.length,
                    gap: iJ.gap * l,
                    opacity: +(1 - 0.3 * hashNoise(7.7 * t + 7)),
                    samples: 140,
                  },
                );
                i6.set(e, i);
                return i;
              })(
                `${y}|${a}|${i1(t, 2028).toFixed(4)}|${i1(t, 2030).toFixed(4)}`,
                a,
                t,
                s,
                l,
                c,
                h,
              ),
            }),
            v = {
              "no-ai": b(
                "bloom",
                sK(sb(sU(s3.central).inp).base).map((e) => [
                  e.t,
                  (sp * e.v) / 100,
                ]),
                12.7,
                oH,
                1.9,
              ),
              slow: b("alive", s0(s3.slow), 71.5, iZ.slow),
              central: b("alive", s0(s3.central), 82.6, iZ.central),
              fast: b("alive", s0(s3.fast), 93.7, iZ.fast),
              ...(t
                ? {
                    user: b("alive", s0(t), 99.1, "var(--chart-ink)"),
                  }
                : {}),
            },
            k = {
              key: "no-ai",
              text: `Without AI ($${sZ().toFixed(1)}T)`,
              color: oH,
              y: h(sZ()),
              scen: null,
            },
            M = s1
              .map(({ key, label, color }) => ({
                key,
                text: `${label} ($${sQ(s3[key]).toFixed(1)}T)`,
                color,
                y: h(sQ(s3[key])),
                scen: key,
              }))
              .concat(k)
              .concat(
                t
                  ? [
                      {
                        key: "you",
                        text: `You ($${sQ(t).toFixed(1)}T)`,
                        color: "var(--chart-ink)",
                        y: h(sQ(t)),
                        scen: null,
                      },
                    ]
                  : [],
              )
              .sort((e, t) => e.y - t.y),
            j = 36;
          for (let e of M) {
            e.y = Math.max(e.y, j + 16);
            j = e.y;
          }
          return {
            ceilY: s,
            floorY: l,
            rightX: i,
            nowX: c(2026),
            nowPath: am(c(2026), s - 5, c(2026), l + 5, 3444.2, {
              width: 2.4,
              color: "var(--chart-rule)",
              opacity: 0.75,
            }),
            rules: m,
            yLabels: f,
            ml: r,
            xLabels: g,
            endLabels: M,
            fanRuns: w,
            lines: v,
            hist: x,
            histOpts: {
              width: 4.3 * (0.87 + 0.26 * hashNoise(31.41)),
              opacity: +(1 - 0.3 * hashNoise(32.41)),
            },
          };
        })(r, user ?? null, n),
      [r, user, n],
    ),
    d = (e) => (0 === colorStage || s2[e] === colorStage ? 1 : 0.14),
    h = {
      slow: d("slow"),
      central: d("central"),
      fast: d("fast"),
    },
    m = React.useRef(null),
    p = React.useRef(null),
    f = React.useRef(null),
    g = React.useRef({}),
    x = React.useRef(i);
  x.current = i;
  let _ = React.useRef(0),
    y = (e) => {
      let t = m.current,
        a = s.current,
        l = x.current;
      if (!t || !a) return;
      let o = (e, t) => {
        let a = e.pieces.length;
        if (e.cursor >= a) return;
        let s = Math.floor(t),
          l = t >= a ? a : Math.min(s + 10, a),
          o = "";
        for (let a = e.cursor; a < l; a++)
          !e.shown[a] &&
            (a < s ||
              hashNoise(5.9 * e.seed + 1.37 * a) < (t - a + 10) / 10 - 1) &&
            ((e.shown[a] = 1), (o += e.pieces[a]));
        for (; e.cursor < a && e.shown[e.cursor];) e.cursor++;
        o && e.el.insertAdjacentHTML("beforeend", o);
      };
      if (!t.histDone && f.current) {
        let a = 2025.15 + 0.849999999999909 * clampRange(e / 0.34, 0, 1),
          s = [];
        for (let e = 0; e < l.hist.length; e++) {
          let t = l.hist[e];
          if (t.year <= a) s.push([t.x, t.y]);
          else {
            let o = l.hist[e - 1];
            o &&
              a > o.year &&
              s.push([
                o.x + (t.x - o.x) * ((a - o.year) / (t.year - o.year)),
                o.y + (t.y - o.y) * ((a - o.year) / (t.year - o.year)),
              ]);
            break;
          }
        }
        f.current.innerHTML =
          s.length > 1
            ? (function (e, t, a = {}) {
                let s =
                  t >= Number.MAX_SAFE_INTEGER
                    ? e
                    : (function (e, t) {
                        if (t <= 0 || e.length < 2) return [];
                        let a = [e[0]],
                          s = 0;
                        for (let l = 1; l < e.length; l++) {
                          let o = Math.hypot(
                            e[l][0] - e[l - 1][0],
                            e[l][1] - e[l - 1][1],
                          );
                          if (s + o >= t) {
                            let r = 0 === o ? 0 : (t - s) / o;
                            a.push([
                              e[l - 1][0] + (e[l][0] - e[l - 1][0]) * r,
                              e[l - 1][1] + (e[l][1] - e[l - 1][1]) * r,
                            ]);
                            break;
                          }
                          s += o;
                          a.push(e[l]);
                        }
                        return a;
                      })(e, t);
                return s.length < 2
                  ? ""
                  : makeMarkerStroke(s, {
                      width: a.width ?? 4.3,
                      color: a.color ?? "currentColor",
                      seed: a.seed ?? 3,
                      opacity: a.opacity ?? 1,
                      taperIn: 0.02,
                      taperOut: 0.02,
                      startWidth: 0.75,
                      endWidth: 0.8,
                      belly: 0.04,
                      wobble: 0.1,
                      chisel: 0.2,
                    });
              })(s, Number.MAX_SAFE_INTEGER, {
                ...l.histOpts,
                color: oH,
                seed: 3.3,
              })
            : "";
        e >= 0.34 && (t.histDone = true);
      }
      let r = clampRange((e - 0.34) / 0.6599999999999999, 0, 1),
        n = Math.max(1, Math.round(25.343999999999998)),
        i = r < 1 ? Math.floor(r * n) / n : 1;
      if (i !== t.lastRv) {
        for (let e of ((t.lastRv = i), t.runs)) o(e, i * e.pieces.length);
        let e =
          tY(clampRange((i - 0.22) / 0.5, 0, 1)) *
          (0.86 + 0.14 * tY(clampRange((i - 0.6) / 0.38, 0, 1)));
        for (let a of t.lines) o(a, e * a.pieces.length);
      }
      let d = clampRange((r - 0.45) / 0.4, 0, 1);
      a.style.setProperty("--fan-alive", d.toFixed(3));
      a.style.setProperty("--fan-bloom", r.toFixed(3));
    };
  React.useEffect(() => {
    let e = p.current;
    if (!e) return;
    e.innerHTML = "";
    let t = (e, t, a) => ({
        pieces: e,
        seed: t,
        el: a,
        shown: new Uint8Array(e.length),
        cursor: 0,
      }),
      a = i.fanRuns.map((a) => {
        let s = document.createElementNS("http://www.w3.org/2000/svg", "g");
        e.appendChild(s);
        return t(a.pieces, a.seed, s);
      }),
      s = [];
    for (let [e, a] of Object.entries(i.lines)) {
      let l = g.current[e];
      l && ((l.innerHTML = ""), s.push(t(a.pieces, a.seed, l)));
    }
    f.current && (f.current.innerHTML = "");
    m.current = {
      runs: a,
      lines: s,
      lastRv: -1,
      histDone: false,
    };
    _.current > 0 && y(_.current);
  }, [i, l]);
  so(s, 2400, (e) => {
    let t = m.current,
      a = s.current;
    if (t && a) {
      if (((_.current = e), 0 === e)) {
        for (let e of t.runs) {
          e.el.innerHTML = "";
          e.shown.fill(0);
          e.cursor = 0;
        }
        for (let e of t.lines) {
          e.el.innerHTML = "";
          e.shown.fill(0);
          e.cursor = 0;
        }
        f.current && (f.current.innerHTML = "");
        t.lastRv = -1;
        t.histDone = false;
        a.style.setProperty("--fan-alive", "0");
        a.style.setProperty("--fan-bloom", "0");
        return;
      }
      y(e);
    }
  });
  return (
    <div
      ref={s}
      className={
        className
          ? `${scenarioFanChartStyles.chart} ${className}`
          : scenarioFanChartStyles.chart
      }
    >
      {l && <ScenarioPaper w={r.w} h={r.h} narrow={n} />}
      <div
        className={scenarioFanChartStyles.axis}
        style={{
          width: r.w,
          height: r.h,
        }}
      >
        <span className={scenarioFanChartStyles.title}>
          {"US GDP (trillions of dollars a year, in 2025 prices)"}
        </span>
        {i.yLabels.map((e) => (
          <span
            className={scenarioFanChartStyles.yLabel}
            style={{
              top: e.y - 7,
              width: i.ml - 12,
            }}
            key={e.label}
          >
            {e.label}
          </span>
        ))}
        {i.xLabels.map((e) => (
          <span
            className={scenarioFanChartStyles.xLabel}
            style={{
              left: Math.min(Math.max(e.x - 40, i.ml - 40 - 4), r.w - 57 - 4),
              top: i.floorY + 12,
            }}
            key={e.label}
          >
            {e.label}
          </span>
        ))}
        <span
          className={scenarioFanChartStyles.present}
          style={{
            left: i.nowX,
            top: i.ceilY - 11,
          }}
        >
          {"Today"}
        </span>
        {!n &&
          l &&
          i.endLabels.map((e) => (
            <span
              className={scenarioFanChartStyles.endLabel}
              style={{
                left: i.rightX + 10,
                top: e.y - 8,
                color: e.color,
                opacity: `calc(var(--fan-alive, 0) * ${e.scen ? h[e.scen] / 1 : 1})`,
              }}
              key={e.key}
            >
              {e.text}
            </span>
          ))}
        {n && l && (
          <div
            className={scenarioFanChartStyles.mobileKey}
            style={{
              opacity: +(0 !== colorStage),
            }}
          >
            {[...i.endLabels]
              .sort((e, t) => iX(e.key) - iX(t.key))
              .map((e) => (
                <span
                  className={scenarioFanChartStyles.keyItem}
                  style={{
                    opacity: `calc(var(--fan-alive, 0) * ${e.scen ? h[e.scen] / 1 : 1})`,
                  }}
                  key={e.key}
                >
                  <LegendStroke
                    ink={e.color}
                    dashed={"no-ai" === e.key}
                    seed={lG(e.key)}
                  />
                  {e.text}
                </span>
              ))}
          </div>
        )}
      </div>
      {l && (
        <svg
          className={scenarioFanChartStyles.svg}
          viewBox={`0 0 ${r.w} ${r.h}`}
          preserveAspectRatio={"xMidYMid meet"}
          role={"img"}
          aria-label={"US GDP over time under many possible dial settings"}
        >
          <defs>
            <clipPath id={"efx-fan-plot"}>
              <rect
                x={i.ml - 3}
                y={-4e3}
                width={i.rightX - i.ml + 6}
                height={i.floorY + 4e3 + 3}
              />
            </clipPath>
          </defs>
          <g filter={`url(#${RULE_FILTER_ID})`}>
            {i.rules.map((e) => (
              <g
                dangerouslySetInnerHTML={{
                  __html: e.html,
                }}
                key={e.key}
              />
            ))}
          </g>
          <g clipPath={"url(#efx-fan-plot)"}>
            <g
              className={scenarioFanChartStyles.fan}
              opacity={+(0 === colorStage)}
              filter={`url(#${MARKER_FILTER_ID})`}
              style={{
                mixBlendMode: "multiply",
              }}
            >
              <g ref={p} />
            </g>
            <g
              filter={`url(#${MARKER_FILTER_ID})`}
              style={{
                mixBlendMode: "multiply",
              }}
            >
              <g
                style={{
                  opacity: "var(--fan-bloom, 0)",
                }}
              >
                <g ref={(e) => void (g.current["no-ai"] = e)} />
              </g>
              <g ref={f} />
              {["slow", "central", "fast"].map((e) => (
                <g
                  className={scenarioFanChartStyles.spot}
                  opacity={h[e]}
                  key={e}
                >
                  <g
                    style={{
                      opacity: "var(--fan-alive, 0)",
                    }}
                  >
                    <g ref={(t) => void (g.current[e] = t)} />
                  </g>
                </g>
              ))}
              {user && (
                <g
                  style={{
                    opacity: "var(--fan-alive, 0)",
                  }}
                >
                  <g ref={(e) => void (g.current.user = e)} />
                </g>
              )}
            </g>
            <g
              filter={`url(#${RULE_FILTER_ID})`}
              dangerouslySetInnerHTML={{
                __html: i.nowPath,
              }}
            />
          </g>
        </svg>
      )}
    </div>
  );
}
let i7 = (e) => 52 + 26 * Math.round((e - 52) / 26);
export {
  iU,
  iK,
  iX,
  iJ,
  iQ,
  iZ,
  i0,
  i1,
  i2,
  i5,
  i3,
  i6,
  ThreeFuturesChart,
  i7,
};
