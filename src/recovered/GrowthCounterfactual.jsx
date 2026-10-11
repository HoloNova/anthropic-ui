// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import growthBarsStyles from "../styles/GrowthBars.classes.js";
import { BASELINE_INK } from "./palette.jsx";
import { useScrollDraw } from "./scroll-hooks.jsx";
import {
  RULE_FILTER_ID,
  MARKER_FILTER_ID,
  hashNoise,
} from "./drawing-noise.jsx";
import { makeRuleStroke } from "./drawing-strokes-2.jsx";
import { oH } from "./LineChart.jsx";
import { aw } from "./drawing-tasks.jsx";
function GrowthCounterfactual({
  ai,
  base,
  color = BASELINE_INK,
  height = 180,
}) {
  let l = React.useRef(null),
    o = useScrollDraw(l),
    r = o > 0 ? Math.min(1, o / 560) : 1,
    n = React.useMemo(() => {
      if (!ai.length) return null;
      let a = base[0]?.v ?? 0,
        l = 1.25 * Math.max(...ai.map((e) => e.v), a),
        o = height - 26 - 26,
        r = (e) => 26 + o - (e / Math.max(1e-6, l)) * o,
        n = (base.length >= ai.length ? base : ai).map((e) => e.t),
        i = 450 / n.length,
        d = Math.min(64, 0.62 * i),
        c = (e) => {
          let t = n.findIndex((t) => 1e-6 > Math.abs(t - e));
          return 34 + i * ((t < 0 ? n.length - 1 : t) + 0.5);
        };
      return {
        floor: 26 + o,
        baseY: r(a),
        baseline: a,
        years: n.map((e) => ({
          t: e,
          cx: c(e),
        })),
        bars: ai.map((e) => {
          let t = c(e.t),
            a = r(e.v);
          return {
            t: e.t,
            v: e.v,
            x: t - d / 2,
            w: d,
            y: a,
            h: 26 + o - a,
            cx: t,
          };
        }),
      };
    }, [ai, base, height]);
  return n ? (
    <div className={growthBarsStyles.chart}>
      <svg
        ref={l}
        viewBox={`0 0 560 ${height}`}
        width={"100%"}
        height={height}
        role={"img"}
        aria-label={"GDP growth per year, against the same economy without AI"}
      >
        <line
          x1={34}
          y1={n.floor}
          x2={484}
          y2={n.floor}
          stroke={"var(--color-slate-300, #d1cfc5)"}
          strokeWidth={1 / r}
        />
        <g
          filter={`url(#${RULE_FILTER_ID})`}
          dangerouslySetInnerHTML={{
            __html: makeRuleStroke(
              [
                [34, n.baseY],
                [259, n.baseY],
                [484, n.baseY],
              ],
              {
                width: 2.6,
                dashLength: 5.2,
                gap: 4.2,
                color: oH,
                seed: 7,
                opacity: 0.9,
                neat: true,
                samples: 160,
              },
            ),
          }}
        />
        <g
          filter={`url(#${MARKER_FILTER_ID})`}
          style={{
            mixBlendMode: "multiply",
            isolation: "isolate",
          }}
          dangerouslySetInnerHTML={{
            __html: n.bars
              .map((e, t) =>
                e.h < 0.6
                  ? ""
                  : aw(e.x, e.y, e.w, e.h, {
                      color,
                      seed: 7.3 + 13.1 * t + 3 * hashNoise(t),
                      strokeWidth: Math.max(
                        2,
                        Math.min(7, Math.min(0.5 * e.w, e.h)),
                      ),
                      direction: "h",
                      endScatter: 0.3,
                    }),
              )
              .join(""),
          }}
        />
        {n.bars.map((e) => (
          <text
            x={e.cx}
            y={e.y - 8}
            className={growthBarsStyles.value}
            textAnchor={"middle"}
            style={{
              fontSize: 11 / r,
            }}
            key={e.t}
          >
            {e.v.toFixed(1)}
            {"%"}
          </text>
        ))}
        {n.years.map((e) => (
          <text
            x={e.cx}
            y={height - 8}
            className={growthBarsStyles.year}
            textAnchor={"middle"}
            style={{
              fontSize: 11 / r,
            }}
            key={e.t}
          >
            {e.t}
          </text>
        ))}
        <text
          x={560}
          y={n.baseY}
          className={growthBarsStyles.baseLabel}
          textAnchor={"end"}
          dominantBaseline={"central"}
          style={{
            fontSize: 11 / r,
          }}
        >
          {"Without AI"}
        </text>
      </svg>
    </div>
  ) : null;
}
export { GrowthCounterfactual };
