// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import scenarioLineStyles from "../styles/ScenarioLine.classes.js";
import { lk } from "./scroll-hooks.jsx";
import { NEUTRAL_INK } from "./palette.jsx";
import { RULE_FILTER_ID } from "./drawing-noise.jsx";
import { am } from "./drawing-tasks.jsx";
function GrowthBenchmark({
  presets,
  cloud,
  you,
  committed,
  youInk,
  owned = true,
}) {
  let r,
    n,
    [i, d] = ((n = lk((r = React.useRef(null)))), [r, n]),
    h = React.useMemo(() => {
      if (d.w < 200) return null;
      let l = [
          ...presets.map((e) => e.gdp),
          ...cloud,
          you,
          ...(null === committed ? [] : [committed]),
        ],
        o = Math.min(...l),
        r = Math.max(...l),
        n = Math.max(1, (r - o) * 0.14),
        i = (e) =>
          rC.l +
          ((e - (o - n)) / (r + n - (o - n))) * Math.max(1, d.w - rC.l - rC.r),
        c = presets.map((e, t) => ({
          ...e,
          cx: i(e.gdp),
          anchor: 0 === t ? "end" : "start",
        })),
        u = (e) => 7.1 * e.length,
        h = -1 / 0;
      for (let e of c) {
        if ("end" === e.anchor) {
          e.cx = Math.max(e.cx, rC.l + 4 + u(e.label));
          h = e.cx - 4 + 8;
          continue;
        }
        e.cx = Math.max(e.cx, h - 4);
        h = e.cx + 4 + u(e.label) + 8;
      }
      let m = d.w - rC.r;
      for (let e = c.length - 1; e >= 0; e--) {
        let t = c[e];
        if ("end" === t.anchor) break;
        let a = t.cx + 4 + u(t.label);
        if (a <= m) break;
        t.cx -= a - m;
        m = t.cx + 4 - 8;
      }
      return {
        x: i,
        y: 34,
        placed: c,
      };
    }, [d.w, presets, cloud, you, committed]);
  return (
    <div className={scenarioLineStyles.scenarioLine} ref={i}>
      {h && (
        <svg
          width={d.w}
          height={70}
          viewBox={`0 0 ${d.w} 70`}
          aria-hidden={true}
        >
          <line
            x1={rC.l}
            y1={h.y}
            x2={d.w - rC.r}
            y2={h.y}
            stroke={NEUTRAL_INK}
            strokeWidth={1}
            opacity={0.6}
          />
          <g
            filter={`url(#${RULE_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
              isolation: "isolate",
            }}
            dangerouslySetInnerHTML={{
              __html:
                cloud
                  .map((t, a) => {
                    let s = presets.reduce((e, a) =>
                      Math.abs(a.gdp - t) < Math.abs(e.gdp - t) ? a : e,
                    );
                    return am(h.x(t), h.y - 6, h.x(t), h.y + 6, 3.3 + 1.7 * a, {
                      width: 3.2,
                      color: s.ink,
                      opacity: 0.55,
                    });
                  })
                  .join("") +
                presets
                  .map((e, t) =>
                    am(
                      h.x(e.gdp),
                      h.y - 8,
                      h.x(e.gdp),
                      h.y + 8,
                      11.3 + 3.7 * t,
                      {
                        width: 5.5,
                        color: e.ink,
                        opacity: 1,
                      },
                    ),
                  )
                  .join("") +
                (null === committed
                  ? ""
                  : am(h.x(committed), h.y - 8, h.x(committed), h.y + 8, 41.3, {
                      width: 5.5,
                      color: youInk,
                      opacity: 0.35,
                    })) +
                am(h.x(you), h.y - 8, h.x(you), h.y + 8, 29.7, {
                  width: 5.5,
                  color: youInk,
                  opacity: 1,
                }),
            }}
          />
          {null !== committed && (
            <text
              x={h.x(committed)}
              y={h.y - 8 - 5}
              className={scenarioLineStyles.lineWere}
              textAnchor={"middle"}
            >
              {"You"}
            </text>
          )}
          <text
            x={h.x(you)}
            y={h.y - 8 - 5}
            className={scenarioLineStyles.lineYou}
            textAnchor={"middle"}
          >
            {null === committed && owned ? "You" : "Now"}
          </text>
          {h.placed.map((e) => (
            <text
              x={e.cx + ("end" === e.anchor ? -4 : 4)}
              y={h.y + 26}
              className={scenarioLineStyles.lineName}
              textAnchor={e.anchor}
              key={e.key}
            >
              {e.label}
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}
let rC = {
  l: 10,
  r: 10,
};
export { GrowthBenchmark, rC };
