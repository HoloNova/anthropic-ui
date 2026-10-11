// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import beliefSwarmStyles from "../styles/BeliefSwarm.classes.js";
import { tL, t_, tx, e4, tP, tE } from "./question-specs.jsx";
import { am } from "./drawing-tasks.jsx";
import {
  RULE_FILTER_ID,
  makeHandDrawnLine,
  MARKER_FILTER_ID,
  hashNoise,
  tD,
} from "./drawing-noise.jsx";
import { useElementSize, useNearViewport, aI } from "./layout-hooks.jsx";
import { tF, tG } from "./question-specs-2.jsx";
import { CHART_THEME } from "./palette.jsx";
function aV(e, t) {
  let a = t[e.slider.key];
  return "productivity" === e.id
    ? tL(a)
    : "adjust" === e.id
      ? (t_[tx(e4, a)] ?? "")
      : `${Math.round(100 * a)}%`;
}
function aY(e, t, a, s) {
  return am(e, t, e, a, s, {
    width: 2.6,
    color: "#141413",
    opacity: 1,
  });
}
function RecoveredComponent_aU() {
  let e = React.useMemo(() => aY(3, 1, 13, 91.7), []);
  return (
    <svg
      width={6}
      height={14}
      viewBox={"0 0 6 14"}
      className={beliefSwarmStyles.swatchSvg}
      aria-hidden={true}
    >
      <g
        filter={`url(#${RULE_FILTER_ID})`}
        dangerouslySetInnerHTML={{
          __html: e,
        }}
      />
    </svg>
  );
}
function BeliefSwatch({ ink, seed }) {
  let a = React.useMemo(
    () =>
      '<path d="' +
      makeHandDrawnLine(
        [
          [3.8, 6],
          [10.2, 6],
        ],
        {
          width: 4.6,
          seed: 41.7 * seed + 5.3,
          wobble: 0.6,
          taperIn: 0.35,
          taperOut: 0.35,
        },
      ) +
      '"/>',
    [seed],
  );
  return (
    <svg
      width={14}
      height={12}
      viewBox={"0 0 14 12"}
      className={beliefSwarmStyles.swatchSvg}
      aria-hidden={true}
    >
      <g
        filter={`url(#${MARKER_FILTER_ID})`}
        style={{
          mixBlendMode: "multiply",
          isolation: "isolate",
        }}
        fill={ink}
        dangerouslySetInnerHTML={{
          __html: a,
        }}
      />
    </svg>
  );
}
function BeliefSwarm({ answers, survey }) {
  let a = React.useRef(null),
    [s, l] = React.useState(720),
    o = useElementSize(a),
    r = useNearViewport(a);
  React.useEffect(() => {
    let e = a.current;
    if (!e) return;
    let t = () => {
      let t = Math.round(
        (e.querySelector("[data-chart]") ?? e).getBoundingClientRect().width,
      );
      l((e) => (1 > Math.abs(e - t) || t <= 0 ? e : t));
    };
    t();
    let s = new ResizeObserver(t);
    s.observe(e);
    return () => s.disconnect();
  }, []);
  let n = survey.cohorts.map((e) => e.key),
    i = s < 700,
    d = React.useMemo(
      () =>
        survey.questions
          .map((t) => {
            let a = tF.find((e) => e.id === t.id);
            if (!a) return null;
            let l = s - 8 - 8,
              o = t.stops.map((e, s) => ({
                i: s,
                cx: 8 + e * l,
                label: (function (e, t, a, s = false) {
                  let l = t.indices[a];
                  if (!t.ordinal) {
                    let e = t.stops.length - 1;
                    return t.stops.length > 12
                      ? 0 === a || a === e
                        ? `${l}%`
                        : null
                      : t.stops.length > 6 && a % 2 == 1 && a !== e
                        ? null
                        : `${l}%`;
                  }
                  if ("productivity" === e.id) {
                    let t = e.slider.stops?.[l];
                    return t
                      ? t.v < 1.05
                        ? "Same"
                        : l === (e.slider.stops?.length ?? 0) - 1
                          ? `${tL(t.v)}+`
                          : tL(t.v)
                      : null;
                  }
                  if ("adjust" === e.id) return (s ? tP[l] : t_[l]) ?? null;
                  let o = e.slider.stops?.[l];
                  return o
                    ? s && tE[o.label]
                      ? tE[o.label]
                      : o.label.split(",")[0].split(" (")[0]
                    : null;
                })(a, t, s, i),
                mark: false,
              }));
            if (i) {
              let e = o.filter((e) => e.label),
                t = (e) => {
                  let t = 6 * e.label.length + 4,
                    a = e.cx / s;
                  return a > 0.97
                    ? [e.cx - t, e.cx]
                    : a < 0.03
                      ? [e.cx, e.cx + t]
                      : [e.cx - t / 2, e.cx + t / 2];
                };
              if (
                e.some((a, s) => s > 0 && t(e[s - 1])[1] > t(a)[0]) &&
                e.length >= 4
              ) {
                let t = new Set([
                  e[0].i,
                  e[Math.floor((e.length - 1) / 2)].i,
                  e[e.length - 1].i,
                ]);
                for (let e of o)
                  e.label && !t.has(e.i) && ((e.label = null), (e.mark = true));
              }
            }
            return {
              dist: t,
              q: a,
              ticks: o,
              rows: n.map((e) => ({
                cohort: e,
                cells: (t.density[e] ?? []).map((e, a) => ({
                  cx: 8 + t.stops[a] * l,
                  share: e,
                })),
              })),
              you: answers
                ? (function (e, t) {
                    let a = e.slider,
                      s = t[a.key];
                    if (a.stops)
                      return tx(a.stops, s) / Math.max(1, a.stops.length - 1);
                    let l = a.max - a.min;
                    return l > 0
                      ? Math.max(0, Math.min(1, (s - a.min) / l))
                      : 0;
                  })(a, answers)
                : null,
            };
          })
          .filter(Boolean),
      [survey.questions, n.join(","), answers, s, i],
    );
  return (
    <div className={beliefSwarmStyles.swarm}>
      <p className={beliefSwarmStyles.chartTitle}>
        {
          "How people answered the five questions (share of respondents at each answers)"
        }
      </p>
      <ul
        className={beliefSwarmStyles.lanes}
        ref={a}
        style={
          o.x || o.y
            ? {
                transform: `translate(${o.x}px, ${o.y}px)`,
              }
            : undefined
        }
      >
        {d.map(({ dist, q, rows, ticks, you }, i) => (
          <li className={beliefSwarmStyles.lane} key={dist.id}>
            <div
              className={beliefSwarmStyles.laneLabel}
              {...{
                [aI]: "",
              }}
            >
              <p className={beliefSwarmStyles.laneTitle}>{q.category}</p>
              <span className={beliefSwarmStyles.laneDesc}>{q.dialDesc}</span>
            </div>
            <div className={beliefSwarmStyles.laneChart} data-chart={true}>
              {null !== you && answers && (
                <span
                  className={beliefSwarmStyles.youVal}
                  style={{
                    left: `${((8 + you * (s - 8 - 8)) / s) * 100}%`,
                    transform:
                      (8 + you * (s - 8 - 8)) / s > 0.95
                        ? "translateX(-100%)"
                        : (8 + you * (s - 8 - 8)) / s < 0.05
                          ? "none"
                          : "translateX(-50%)",
                  }}
                  aria-hidden={true}
                >
                  {aV(q, answers)}
                </span>
              )}
              <svg
                className={beliefSwarmStyles.rail}
                viewBox={`0 0 ${s} 52`}
                width={"100%"}
                height={52}
                role={"img"}
                aria-label={`${q.category}: how each group answered${answers ? `, against your own (${aV(q, answers)})` : ""}`}
              >
                <g
                  filter={`url(#${RULE_FILTER_ID})`}
                  dangerouslySetInnerHTML={{
                    __html: am(8, 26, s - 8, 26, 57.1 + 13.7 * i, {
                      width: 1.6 * (0.9 + 0.35 * hashNoise(57.1 + 13.7 * i)),
                      color: CHART_THEME.rule,
                      opacity: 0.62,
                    }),
                  }}
                />
                {rows.map(({ cohort, cells }, a) => {
                  let s = r
                    ? (function (e, t) {
                        let a = e.map(() => 0),
                          s = e.reduce((e, t) => e + t.share, 0);
                        if (s > 0) {
                          let t = 0,
                            l = e[0].share;
                          for (let o = 0; o < 100; o++) {
                            let r = ((o + 0.5) / 100) * s;
                            for (; l < r && t < e.length - 1;)
                              l += e[++t].share;
                            a[t]++;
                          }
                        }
                        let l = Math.min(
                            44,
                            Math.max(
                              5,
                              0.8 *
                                (e.length > 1
                                  ? Math.abs(e[1].cx - e[0].cx)
                                  : 24),
                            ),
                          ),
                          o = e.length ? Math.min(...e.map((e) => e.cx)) : 0,
                          r = e.length ? Math.max(...e.map((e) => e.cx)) : 0,
                          n = [],
                          i = 0;
                        for (let s = 0; s < e.length; s++)
                          for (let d = 0; d < a[s]; d++) {
                            let a = 41.7 * t + 13.1 * i,
                              d = (tD(a) + tD(a + 101) - 1) * l,
                              c =
                                (hashNoise(a + 3) + hashNoise(a + 211) - 1) *
                                21,
                              u = (function (e, t, a) {
                                if (a <= t) return t;
                                let s = e;
                                for (let e = 0; e < 4 && (s < t || s > a); e++)
                                  s = s < t ? t + (t - s) : a - (s - a);
                                return Math.min(a, Math.max(t, s));
                              })(e[s].cx + d, o, r),
                              h = 26 + c,
                              m = 2.7 + 1.1 * hashNoise(a + 7);
                            n.push(
                              '<path d="' +
                                makeHandDrawnLine(
                                  [
                                    [u - m, h],
                                    [u + m, h],
                                  ],
                                  {
                                    width: 3.8 + 1.4 * hashNoise(a + 13),
                                    seed: a,
                                    wobble: 0.6,
                                    taperIn: 0.35,
                                    taperOut: 0.35,
                                  },
                                ) +
                                '"/>',
                            );
                            i++;
                          }
                        return n.join("");
                      })(cells, 101 * a + 7)
                    : "";
                  return (
                    <g
                      filter={`url(#${MARKER_FILTER_ID})`}
                      style={{
                        mixBlendMode: "multiply",
                        isolation: "isolate",
                      }}
                      fill={tG[cohort]}
                      dangerouslySetInnerHTML={{
                        __html: s,
                      }}
                      key={cohort}
                    />
                  );
                })}
                {null !== you && (
                  <g
                    filter={`url(#${RULE_FILTER_ID})`}
                    dangerouslySetInnerHTML={{
                      __html: aY(
                        8 + you * (s - 8 - 8),
                        4,
                        48,
                        173.3 + 29.7 * i,
                      ),
                    }}
                  />
                )}
                {ticks.some((e) => e.mark) && (
                  <g
                    filter={`url(#${RULE_FILTER_ID})`}
                    dangerouslySetInnerHTML={{
                      __html: ticks
                        .filter((e) => e.mark)
                        .map((e) =>
                          am(
                            e.cx,
                            50,
                            e.cx,
                            58,
                            219.1 + 31.9 * i + 17.3 * e.i,
                            {
                              width: 1.6,
                              color: CHART_THEME.rule,
                              opacity: 0.62,
                            },
                          ),
                        )
                        .join(""),
                    }}
                  />
                )}
              </svg>
              <div className={beliefSwarmStyles.axis} aria-hidden={true}>
                {ticks.map((e) =>
                  e.label ? (
                    <span
                      className={beliefSwarmStyles.tick}
                      style={{
                        left: `${(e.cx / s) * 100}%`,
                        transform:
                          e.cx / s > 0.97
                            ? "translateX(-100%)"
                            : e.cx / s < 0.03
                              ? "none"
                              : "translateX(-50%)",
                      }}
                      key={e.i}
                    >
                      {e.label}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <ul className={beliefSwarmStyles.key}>
        {survey.cohorts.map((e, t) => (
          <li className={beliefSwarmStyles.keyItem} key={e.key}>
            <BeliefSwatch ink={tG[e.key]} seed={17 * t + 3} />
            {e.label}
            <span className={beliefSwarmStyles.count}>
              {"n = "}
              {e.n.toLocaleString("en-US")}
            </span>
          </li>
        ))}
        {answers && (
          <li className={beliefSwarmStyles.keyItem}>
            <RecoveredComponent_aU />
            {"Your predictions"}
          </li>
        )}
      </ul>
    </div>
  );
}
export { aV, aY, RecoveredComponent_aU, BeliefSwatch, BeliefSwarm };
