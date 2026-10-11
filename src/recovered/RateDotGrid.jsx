// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import unemploymentSlopeStyles from "../styles/UnemploymentSlope.classes.js";
import { useScrollDraw } from "./scroll-hooks.jsx";
import { hashNoise, tX, MARKER_FILTER_ID } from "./drawing-noise.jsx";
import { makeMarkerStroke } from "./drawing-strokes.jsx";
import { makeRuleStroke } from "./drawing-strokes-2.jsx";
let oV = {
  taperIn: 0.02,
  taperOut: 0.07,
  startWidth: 0.95,
  endWidth: 0.85,
};
function RateDotGrid({ rates, height = 200 }) {
  let a = React.useRef(null),
    s = useScrollDraw(a),
    l = React.useMemo(() => {
      let a,
        { affected: l, other: o, all: r } = rates,
        n = Math.max(1, s - 46 - 52),
        i = height - 30 - 16,
        { at: d, top: c } = (function (e) {
          let t = e / 4,
            a = 10 ** Math.floor(Math.log10(Math.max(t, 0.001))),
            s =
              [1, 2, 2.5, 5, 10].map((e) => e * a).find((e) => e >= t) ??
              10 * a,
            l = Math.ceil((e - 1e-9) / s) * s,
            o = [];
          for (let e = 0; e <= l + 1e-9; e += s)
            o.push(Math.round(100 * e) / 100);
          return {
            at: o,
            top: l,
          };
        })(1.08 * Math.max(...l, ...o, ...r, 4)),
        u = (e) => 30 + i - (e / c) * i,
        h = (e, t) => [
          [46 + 0 * n, u(e[0])],
          [
            (46 + 0 * n + (46 + +n)) / 2,
            (u(e[0]) + u(e[1])) / 2 + (hashNoise(t) - 0.5) * 1.4,
          ],
          [46 + +n, u(e[1])],
        ],
        m = (e) => ({
          width: 4.6 + 1.6 * hashNoise(7.7 * e + 6),
          seed: e,
          opacity: 0.86,
        }),
        p = (e, t, a) =>
          makeMarkerStroke(h(e, t), {
            ...m(t),
            color: a,
            ...oV,
          });
      return {
        x0: 46 + 0 * n,
        x1: 46 + +n,
        yTop: 30,
        yBot: 30 + i,
        ticks: d.map((e) => ({
          v: e,
          y: u(e),
        })),
        ink:
          makeRuleStroke((a = h(r, 15.3)), {
            ...m(15.3),
            color: "#73726c",
            neat: true,
            landOnEnd: true,
            samples: Math.max(48, Math.round(tX(a) / 5)),
          }) +
          p(o, 9.1, "#6a9bcc") +
          p(l, 3.7, "#c98500"),
        ends: {
          affected: [u(l[0]), u(l[1])],
          other: [u(o[0]), u(o[1])],
          all: [u(r[0]), u(r[1])],
        },
        normAll: u(rates.normalAll),
      };
    }, [rates, s, height]),
    o = (e) => `${e.toFixed(1)}%`,
    [r, n] = [l.ends.affected[1], l.ends.other[1]];
  if (19 > Math.abs(r - n)) {
    let e = (r + n) / 2,
      t = r <= n ? -1 : 1;
    r = e + (19 * t) / 2;
    n = e - (19 * t) / 2;
  }
  return (
    <div className={unemploymentSlopeStyles.wrap} ref={a}>
      {s > 0 && (
        <svg
          width={s}
          height={height}
          className={unemploymentSlopeStyles.svg}
          aria-hidden={true}
        >
          <g stroke={"var(--color-slate-300, #d1cfc5)"} strokeWidth={"1"}>
            {l.ticks.map((e) => (
              <line x1={l.x0} y1={e.y} x2={l.x1} y2={e.y} key={e.v} />
            ))}
          </g>
          <g stroke={"var(--color-slate-400)"} strokeWidth={"1"}>
            <line x1={l.x0} y1={l.yTop} x2={l.x0} y2={l.yBot} />
            <line x1={l.x1} y1={l.yTop} x2={l.x1} y2={l.yBot} />
          </g>
          {l.ticks.map((e, t) => (
            <text
              x={l.x0 - 7}
              y={e.y + 3.5}
              className={unemploymentSlopeStyles.tick}
              textAnchor={"end"}
              key={e.v}
            >
              {t === l.ticks.length - 1 ? `${e.v}%` : e.v}
            </text>
          ))}
          <text
            x={l.x0}
            y={14}
            className={unemploymentSlopeStyles.year}
            textAnchor={"middle"}
          >
            {rates.years[0]}
          </text>
          <text
            x={l.x1}
            y={14}
            className={unemploymentSlopeStyles.year}
            textAnchor={"middle"}
          >
            {rates.years[1]}
          </text>
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
              isolation: "isolate",
            }}
            dangerouslySetInnerHTML={{
              __html: l.ink,
            }}
          />
          <text
            x={l.x1 + 7}
            y={r + 4}
            className={unemploymentSlopeStyles.valExposed}
          >
            {o(rates.affected[1])}
          </text>
          <text
            x={l.x1 + 7}
            y={n + 4}
            className={unemploymentSlopeStyles.valOther}
          >
            {o(rates.other[1])}
          </text>
        </svg>
      )}
      <p className={unemploymentSlopeStyles.key}>
        <span className={unemploymentSlopeStyles.keyExposed}>
          {"occupations AI reaches"}
        </span>
        <span className={unemploymentSlopeStyles.keyOther}>
          {"everyone else"}
        </span>
        <span className={unemploymentSlopeStyles.keyAll}>{"everyone"}</span>
      </p>
    </div>
  );
}
export { oV, RateDotGrid };
