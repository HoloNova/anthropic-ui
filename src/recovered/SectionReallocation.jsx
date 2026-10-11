// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionReallocationStyles from "../styles/SectionReallocation.classes.js";
import { lO, ChartKey } from "./ChartKey.jsx";
import {
  makeHandDrawnLine,
  tK,
  MARKER_FILTER_ID,
  RULE_FILTER_ID,
  tU,
} from "./drawing-noise.jsx";
import { useReducedMotion } from "./viewport.jsx";
import { useElementSize, useIsVisible, GraphPaper } from "./layout-hooks.jsx";
import { useScrollDraw } from "./scroll-hooks.jsx";
import { ao, al } from "./drawing-grid.jsx";
import { l3, l6 } from "./DropCap.jsx";
import { lb, runUserScenario, lw } from "./model-series.jsx";
import { getPresetScenario } from "./question-specs.jsx";
import { SCENARIO_PRESETS, s1, la } from "./model-metrics.jsx";
import { FindingHead } from "./FindingHead.jsx";
let l8 = () => () => {};
let l7 = lO.exposed.label;
let l9 = lO.other.label;
let oe = (e) => {
  let t = e.lastIndexOf(" ");
  return t < 0 ? [e, ""] : [e.slice(0, t), e.slice(t + 1)];
};
let [ot, oa] = oe(l7);
let [os, ol] = oe(l9);
let oo = (e) => {
  let t = makeHandDrawnLine(
      tK(
        [
          [-7.5, 0.25],
          [0, -0.3],
          [5.5, 0],
        ],
        12,
      ),
      {
        width: 1.6,
        seed: e,
        taperIn: 0.3,
        taperOut: 0.06,
        belly: 0.08,
        wobble: 0.08,
        chisel: 0.2,
      },
    ),
    a = (e, t) =>
      makeHandDrawnLine(
        tK(
          [
            [-0.8, 4.9 * e],
            [5.8, 0.15 * e],
          ],
          8,
        ),
        {
          width: 1.6,
          seed: t,
          taperIn: 0.35,
          taperOut: 0.08,
          wobble: 0.1,
          chisel: 0.25,
        },
      );
  return [t, a(-1, e + 1), a(1, e + 2)].filter(Boolean).join(" ");
};
let or = "#C98500";
let on = "#6A9BCC";
function WorkerFlows({
  flows,
  stage = 5,
  dots = false,
  search,
  showChurn = false,
  height = 468,
  callout,
  calloutKey,
}) {
  let i = flows.year ?? 2030,
    d = useReducedMotion(),
    h = React.useRef(null),
    m = useElementSize(h),
    p = useScrollDraw(h),
    f = useIsVisible(h),
    g = p > 0 && p < 700,
    x = g ? Math.max(260, p) : 900,
    _ = g ? 13 : 182,
    y = g ? x - 13 - 13 : 676,
    w = g ? 26 * Math.round((_ + y) / 2 / 26) : 442,
    v = g ? 78 : 40,
    k = g ? 65 : 13,
    M = g ? height + 78 : height,
    {
      cStart: j,
      oStart: S,
      cStay: N,
      moved: A,
      stuck: T,
      oTarget: L,
      normal: I,
    } = flows,
    $ = showChurn ? I : 0,
    F = Math.max(0, j - N),
    W = S + A,
    C = callout && callout.length ? 34 * callout.length + 46 : 0,
    R = Math.max(18, F + $ + 4, T + 8),
    B = Math.max(j, N),
    E = (M - v - 16 - k) / (B + Math.max(S, W) + R),
    P = R * E + k,
    G = v + B * E,
    O = {
      y: G - j * E,
      h: j * E,
    },
    q = {
      y: G + P,
      h: S * E,
    },
    z = {
      y: G - N * E,
      h: N * E,
    },
    H = {
      y: G + P,
      h: A * E,
    },
    D = {
      y: H.y + H.h,
      h: S * E,
    },
    V = T * E,
    Y = {
      y: G + P - V - 4 * E,
      h: V,
    },
    U = {
      y: 0,
      h: (F + $) * E,
    },
    K = G + P - U.h - 5;
  U.y = Math.max(G + 5, Math.min(K, G + (P - U.h) / 2));
  let X = {
      y: U.y,
      h: $ * E,
    },
    J = {
      y: U.y + X.h,
      h: T * E,
    },
    Q = {
      y: J.y + J.h,
      h: A * E,
    },
    Z = (e, t, a, s, l, o) => {
      let r = (e + s) / 2,
        n = t + a / 2,
        i = l + o / 2;
      return `M${e},${n} C${r},${n} ${r},${i} ${s},${i}`;
    },
    ee = (e, t, a, s, l, o, r) => {
      let n = t + a / 2,
        i = l + o / 2,
        d = (e + s) / 2,
        c = (t) => {
          let a = 1 - t;
          return [
            a * a * a * e +
              3 * a * a * t * d +
              3 * a * t * t * d +
              t * t * t * s,
            a * a * a * n +
              3 * a * a * t * n +
              3 * a * t * t * i +
              t * t * t * i,
          ];
        },
        u = Math.min(a, o);
      if (u < 14) return "";
      let h = Math.min(9, Math.max(5, 0.16 * u)),
        m = [];
      for (let e = 0; e <= 12; e++) m.push(c(0.14 + (e / 12) * 0.18));
      let p = m[m.length - 1],
        f = m[m.length - 2],
        g = Math.atan2(p[1] - f[1], p[0] - f[0]),
        x = (e) => [p[0] - h * Math.cos(g - e), p[1] - h * Math.sin(g - e)],
        _ = (e) => (e ? `<path d="${e}"/>` : "");
      return (
        _(
          makeHandDrawnLine(tK(m, 24), {
            width: 1.6,
            seed: r,
            taperIn: 0.2,
            taperOut: 0.1,
          }),
        ) +
        _(
          makeHandDrawnLine(tK([x(0.5), p], 8), {
            width: 1.6,
            seed: r + 1,
            taperIn: 0.3,
          }),
        ) +
        _(
          makeHandDrawnLine(tK([x(-0.5), p], 8), {
            width: 1.6,
            seed: r + 2,
            taperIn: 0.3,
          }),
        )
      );
    },
    et = _ + 13,
    ea = w + 13,
    es = Z(et, O.y + N * E, F * E, w, U.y, U.h),
    el = Z(ea, Q.y, Q.h, y, H.y, H.h),
    eo = React.useSyncExternalStore(
      l8,
      () => true,
      () => false,
    ),
    er = React.useMemo(() => {
      let e = (e) => {
          let t = Math.min(2.5, Math.min(5, Math.max(0, 0.35 * e)));
          return {
            thin: t,
            thick: 5 - t,
          };
        },
        t = e(F * E),
        a = e(Q.h),
        s = (e, t) => (e < 8 ? 0.75 : t),
        l = ao({
          x0: et,
          y0: O.y,
          h0: N * E - t.thick,
          x1: y,
          y1: z.y,
          h1: z.h,
          c0: or,
          opacity: 0.55,
          rim: false,
          pressure: true,
          seed: 41,
        }),
        o = ao({
          x0: et,
          y0: q.y,
          h0: q.h,
          x1: y,
          y1: D.y + a.thick,
          h1: D.h - a.thick,
          c0: on,
          opacity: 0.55,
          rim: false,
          pressure: true,
          seed: 44,
        }),
        r = ao({
          x0: et,
          y0: O.y + N * E + t.thin,
          h0: Math.max(1.2, F * E - t.thin),
          x1: w - 5,
          y1: U.y,
          h1: U.h,
          c0: or,
          c1: "#C9837D",
          opacity: s(F * E, 0.55),
          rim: false,
          seed: 42,
        }),
        n = ao({
          x0: ea,
          y0: Q.y,
          h0: Math.max(1.2, Q.h - a.thin),
          x1: y,
          y1: H.y,
          h1: Math.max(1.2, H.h - a.thin),
          c0: l3,
          c1: on,
          opacity: s(Q.h, 0.55),
          rim: false,
          seed: 43,
        }),
        i =
          T > 0.05
            ? ao({
                x0: ea,
                y0: J.y,
                h0: J.h,
                x1: y,
                y1: Y.y,
                h1: Y.h,
                fill: false,
                dashedEdges: true,
                edgeColor: l3,
                edgeWidth: 2.8,
                edgeDashLength: 12,
                edgeGap: 9,
                seed: 45,
              })
            : "";
      return {
        stayBand: l,
        keptBand: o,
        stayArrow: ee(et, O.y, N * E - t.thick, y, z.y, z.h, 61),
        keptArrow: ee(et, q.y, q.h, y, D.y + a.thick, D.h - a.thick, 63),
        outBand: r,
        onBand: n,
        stuckPath: i,
        nodes: {
          lC: al(_ + 6.5, O.y, O.h, {
            color: or,
            seed: 51,
            width: 13,
          }),
          lO: al(_ + 6.5, q.y, q.h, {
            color: on,
            seed: 52,
            width: 13,
          }),
          mid: al(w + 6.5, U.y, U.h, {
            color: l3,
            seed: 53,
            width: 13,
          }),
          rC: al(y + 6.5, z.y, z.h, {
            color: or,
            seed: 54,
            width: 13,
          }),
          rO: al(y + 6.5, H.y, H.h + D.h, {
            color: on,
            seed: 55,
            width: 13,
          }),
          ghost: l6(y, Y.y, 13, Y.h, 46),
        },
      };
    }, [N, F, A, T, j, S, L, $, M, x]),
    en = Math.max(F, A, 0.1),
    ei = (e) => (e < 0.05 ? 0 : Math.max(1, Math.round((e / en) * 9))),
    ed = Math.min(14, Math.max(1, (search?.exposed ?? 6) * 0.3)),
    ec = (e) => `${Number(e.toFixed(1))}%`,
    eu = stage >= 1,
    eh = stage >= 2,
    em = stage >= 3,
    ep = stage >= 4,
    ef = stage >= 5;
  return (
    <div
      className={sectionReallocationStyles.chartWrap}
      ref={h}
      data-still={f ? undefined : "true"}
      style={{
        transform: `translate(${m.x}px, ${m.y}px)`,
      }}
    >
      <svg
        viewBox={`0 0 ${x} ${M + C + (g && !C ? 48 : 0)}`}
        className={sectionReallocationStyles.chart}
        style={{
          width: x,
        }}
        role={"img"}
        aria-label={`the share of all workers in each place in 2026, in transit, and in ${i}`}
      >
        <text x={_} y={22} className={sectionReallocationStyles.head2}>
          {2026}
        </text>
        <text
          x={y + 13}
          y={22}
          className={sectionReallocationStyles.head2}
          textAnchor={"end"}
        >
          {i}
        </text>
        {eo && (
          <g
            className={sectionReallocationStyles.flows}
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
            }}
          >
            {eh && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.stayBand,
                }}
              />
            )}
            {eh && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.keptBand,
                }}
              />
            )}
            {em && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.outBand,
                }}
              />
            )}
            {ep && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.onBand,
                }}
              />
            )}
            {ef && er.stuckPath && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.stuckPath,
                }}
              />
            )}
            <g
              dangerouslySetInnerHTML={{
                __html: er.nodes.lC,
              }}
            />
            <g
              dangerouslySetInnerHTML={{
                __html: er.nodes.lO,
              }}
            />
            {em && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.nodes.mid,
                }}
              />
            )}
            {eu && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.nodes.rC,
                }}
              />
            )}
            {eu && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.nodes.rO,
                }}
              />
            )}
            {ef && T > 0.05 && (
              <g
                dangerouslySetInnerHTML={{
                  __html: er.nodes.ghost,
                }}
              />
            )}
          </g>
        )}
        {eo && (
          <g
            filter={`url(#${RULE_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
            }}
          >
            {eh && er.stayArrow && (
              <g
                fill={tU(or, 0.22)}
                opacity={0.75}
                dangerouslySetInnerHTML={{
                  __html: er.stayArrow,
                }}
              />
            )}
            {eh && er.keptArrow && (
              <g
                fill={tU(on, 0.22)}
                opacity={0.75}
                dangerouslySetInnerHTML={{
                  __html: er.keptArrow,
                }}
              />
            )}
          </g>
        )}
        {dots && !d && (
          <g className={sectionReallocationStyles.dots}>
            {Array.from(
              {
                length: ei(F),
              },
              (e, t) => (
                <path
                  d={oo(7 * t + 1)}
                  fill={l3}
                  style={{
                    offsetPath: `path('${es}')`,
                    animationDuration: "2.2s",
                    animationDelay: `${(2.2 * t) / Math.max(1, ei(F))}s`,
                  }}
                  key={`o${t}`}
                />
              ),
            )}
            {ep &&
              Array.from(
                {
                  length: ei(A),
                },
                (e, t) => (
                  <path
                    d={oo(11 * t + 5)}
                    fill={on}
                    style={{
                      offsetPath: `path('${el}')`,
                      animationDuration: `${ed.toFixed(2)}s`,
                      animationDelay: `${(t * ed) / Math.max(1, ei(A))}s`,
                    }}
                    key={`m${t}`}
                  />
                ),
              )}
          </g>
        )}
        {g ? (
          <React.Fragment>
            <text x={_} y={O.y - 28} className={sectionReallocationStyles.val}>
              {ec(j)}
            </text>
            <text x={_} y={O.y - 10} className={sectionReallocationStyles.node}>
              {l7}
            </text>
            <text x={_} y={q.y - 26} className={sectionReallocationStyles.val}>
              {ec(S)}
            </text>
            <text x={_} y={q.y - 8} className={sectionReallocationStyles.node}>
              {l9}
            </text>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <text
              x={_ - 10}
              y={O.y + O.h / 2 - 16}
              className={sectionReallocationStyles.val}
              textAnchor={"end"}
            >
              {ec(j)}
            </text>
            <text
              x={_ - 10}
              y={O.y + O.h / 2 + 2}
              className={sectionReallocationStyles.node}
              textAnchor={"end"}
            >
              {ot}
            </text>
            <text
              x={_ - 10}
              y={O.y + O.h / 2 + 18}
              className={sectionReallocationStyles.node}
              textAnchor={"end"}
            >
              {oa}
            </text>
            <text
              x={_ - 10}
              y={q.y + q.h / 2 - 16}
              className={sectionReallocationStyles.val}
              textAnchor={"end"}
            >
              {ec(S)}
            </text>
            <text
              x={_ - 10}
              y={q.y + q.h / 2 + 2}
              className={sectionReallocationStyles.node}
              textAnchor={"end"}
            >
              {os}
            </text>
            <text
              x={_ - 10}
              y={q.y + q.h / 2 + 18}
              className={sectionReallocationStyles.node}
              textAnchor={"end"}
            >
              {ol}
            </text>
          </React.Fragment>
        )}
        {em && (
          <React.Fragment>
            <text
              x={w + 6.5}
              y={U.y - 24}
              className={sectionReallocationStyles.val}
              textAnchor={"middle"}
            >
              {ec(F)}
            </text>
            <text
              x={w + 6.5}
              y={U.y - 7}
              className={sectionReallocationStyles.node}
              textAnchor={"middle"}
            >
              {"Displaced"}
            </text>
            {$ > 0 && (
              <text
                x={w + 13 + 9}
                y={X.y + X.h / 2 + 4}
                className={sectionReallocationStyles.delta}
              >
                {ec($)}
                {" between jobs anyway"}
              </text>
            )}
            {ep && A > 0.05 && (
              <React.Fragment>
                <text
                  x={(ea + y) / 2}
                  y={(Q.y + Q.h + (H.y + H.h)) / 2 + 22}
                  className={sectionReallocationStyles.val}
                  textAnchor={"middle"}
                >
                  {ec(A)}
                </text>
                <text
                  x={(ea + y) / 2}
                  y={(Q.y + Q.h + (H.y + H.h)) / 2 + 39}
                  className={sectionReallocationStyles.node}
                  textAnchor={"middle"}
                >
                  {"Crossed over"}
                </text>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {eu &&
          (g ? (
            <React.Fragment>
              <text
                x={y + 13}
                y={z.y - 26}
                className={sectionReallocationStyles.val}
                textAnchor={"end"}
              >
                {ec(N)}
              </text>
              <text
                x={y + 13}
                y={z.y - 8}
                className={sectionReallocationStyles.node}
                textAnchor={"end"}
              >
                {"Still there"}
              </text>
              <text
                x={y + 13}
                y={D.y + D.h + 24}
                className={sectionReallocationStyles.val}
                textAnchor={"end"}
              >
                {ec(W)}
              </text>
              <text
                x={y + 13}
                y={D.y + D.h + 42}
                className={sectionReallocationStyles.node}
                textAnchor={"end"}
              >
                {l9}
              </text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <text
                x={y + 13 + 10}
                y={z.y + z.h / 2 + 2}
                className={sectionReallocationStyles.val}
              >
                {ec(N)}
              </text>
              <text
                x={y + 13 + 10}
                y={z.y + z.h / 2 + 20}
                className={sectionReallocationStyles.node}
              >
                {"Still there"}
              </text>
              <text
                x={y + 13 + 10}
                y={D.y + D.h / 2 - 16}
                className={sectionReallocationStyles.val}
              >
                {ec(W)}
              </text>
              <text
                x={y + 13 + 10}
                y={D.y + D.h / 2 + 2}
                className={sectionReallocationStyles.node}
              >
                {os}
              </text>
              <text
                x={y + 13 + 10}
                y={D.y + D.h / 2 + 18}
                className={sectionReallocationStyles.node}
              >
                {ol}
              </text>
            </React.Fragment>
          ))}
        {callout && callout.length > 0 && em && (
          <g>
            <line
              x1={w + 6.5}
              y1={U.y + U.h}
              x2={w + 6.5}
              y2={M + 4}
              stroke={l3}
              strokeWidth={"1"}
              strokeDasharray={"3 3"}
            />
            <text
              x={152}
              y={M + 18}
              className={sectionReallocationStyles.calloutHead}
            >
              {"of everyone displaced, who crossed over by 2030"}
            </text>
            {callout.map((e, t) => {
              let a = M + 40 + 34 * t,
                s = Math.max(...callout.map((e) => e.displaced), 0.1),
                l = Math.max(1, (e.displaced / s) * 290),
                o = e.displaced > 0 ? (e.moved / e.displaced) * l : 0,
                i =
                  e.displaced > 0
                    ? Math.round((e.moved / e.displaced) * 100)
                    : 0,
                d = e.key === calloutKey;
              return (
                <g opacity={d ? 1 : 0.5} key={e.key}>
                  <text
                    x={152}
                    y={a + 4}
                    className={sectionReallocationStyles.calloutName}
                    fill={e.color}
                  >
                    {e.label}
                  </text>
                  {eo && (
                    <g
                      filter={`url(#${MARKER_FILTER_ID})`}
                      style={{
                        mixBlendMode: "multiply",
                      }}
                    >
                      <g
                        dangerouslySetInnerHTML={{
                          __html:
                            l6(248, a - 8, l, 16, 71 + 3.7 * t) +
                            (o > 2
                              ? ao({
                                  x0: 248,
                                  y0: a - 8,
                                  h0: 16,
                                  x1: 248 + o,
                                  y1: a - 8,
                                  h1: 16,
                                  c0: on,
                                  opacity: 0.55,
                                  rim: false,
                                  seed: 31.7 + 5.3 * t,
                                })
                              : ""),
                        }}
                      />
                    </g>
                  )}
                  <text
                    x={248 + l + 8}
                    y={a + 4}
                    className={sectionReallocationStyles.calloutVal}
                  >
                    {i}
                    {"% of "}
                    {ec(e.displaced)}
                  </text>
                </g>
              );
            })}
          </g>
        )}
        {ef &&
          T > 0.05 &&
          (g ? (
            <React.Fragment>
              <text
                x={y + 13}
                y={z.y + z.h + 28}
                className={sectionReallocationStyles.val}
                textAnchor={"end"}
              >
                {ec(T)}
              </text>
              <text
                x={y + 13}
                y={z.y + z.h + 46}
                className={sectionReallocationStyles.node}
                textAnchor={"end"}
              >
                {"Still need to move"}
              </text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <text
                x={y + 13 + 10}
                y={Y.y + Y.h / 2 - 21}
                className={sectionReallocationStyles.val}
              >
                {ec(T)}
              </text>
              <text
                x={y + 13 + 10}
                y={Y.y + Y.h / 2 - 3}
                className={sectionReallocationStyles.node}
              >
                {"Still need"}
              </text>
              <text
                x={y + 13 + 10}
                y={Y.y + Y.h / 2 + 13}
                className={sectionReallocationStyles.node}
              >
                {"to move"}
              </text>
            </React.Fragment>
          ))}
      </svg>
    </div>
  );
}
function SectionReallocation({ user, flushTop = false, className }) {
  let [s, l] = React.useState("central"),
    o = "you" !== s || user ? s : "central",
    r = React.useMemo(
      () =>
        "you" === o && user
          ? lb(runUserScenario(user))
          : lb(getPresetScenario(SCENARIO_PRESETS[o])),
      [o, user],
    ),
    n = React.useMemo(
      () =>
        s1.map((e) => {
          let t = lb(getPresetScenario(SCENARIO_PRESETS[e.key]));
          return {
            key: e.key,
            label: e.label.toLowerCase(),
            color: e.color,
            displaced: la(Math.max(0, t.cStart - t.cStay)),
            moved: la(t.moved),
            stuck: la(t.stuck),
          };
        }),
      [],
    ),
    i = React.useMemo(() => {
      let t = new Map(n.map((e) => [e.key, e.displaced])),
        a = s1.map((e) => ({
          key: e.key,
          label: e.label,
        })),
        s = (a) => {
          if ("you" !== a) return t.get(a) ?? 0;
          let s = lb(runUserScenario(user));
          return Math.max(0, s.cStart - s.cStay);
        };
      return (
        user
          ? [
              ...a,
              {
                key: "you",
                label: "You",
              },
            ]
          : a
      ).sort((e, t) => s(e.key) - s(t.key));
    }, [n, user]),
    d = React.useMemo(
      () =>
        "you" === o && user
          ? lw(runUserScenario(user))
          : lw(getPresetScenario(SCENARIO_PRESETS[o])),
      [o, user],
    );
  return (
    <React.Fragment>
      <FindingHead
        flushTop={flushTop}
        eyebrow={"Finding 2: Job reallocation"}
        title={
          "In more transformative scenarios, more workers have to change occupations. That may mean higher unemployment."
        }
      >
        <p>
          {
            "There is always some churn in the job market—people losing jobs and finding new ones. In normal times, this process can be painful, but works relatively well from a macroeconomic perspective. Most job seekers find new jobs fairly quickly."
          }
        </p>
        <p>
          {
            "In our substantial and extreme scenarios, knowledge workers may see a lot of automation and displacement. At the individual level, it means coders and call service center agents may have to switch to jobs like electrician and nurse, which are less exposed to AI."
          }
        </p>
        <p>
          {
            "But changing occupations entirely is hard, and it takes many people a long time to land a new job. The more of this switching a scenario requires, the more people will be between jobs."
          }
        </p>
      </FindingHead>
      <section
        className={
          className
            ? `${sectionReallocationStyles.section} ${className}`
            : sectionReallocationStyles.section
        }
      >
        <div className={sectionReallocationStyles.figures}>
          <GraphPaper className={sectionReallocationStyles.paper} />
          <p className={sectionReallocationStyles.chartTitle}>
            {"Where workers are in 2030 (percent of all workers)"}
          </p>
          <div
            className={sectionReallocationStyles.toggle}
            role={"group"}
            aria-label={"Scenario"}
          >
            {i.map((e) => (
              <button
                type={"button"}
                className={
                  o === e.key
                    ? `${sectionReallocationStyles.preset} ${sectionReallocationStyles.presetOn}`
                    : sectionReallocationStyles.preset
                }
                aria-pressed={o === e.key}
                onClick={() => l(e.key)}
                key={e.key}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className={sectionReallocationStyles.figure}>
            <WorkerFlows flows={r} dots={true} search={d} />
          </div>
        </div>
        <div className={sectionReallocationStyles.figure}>
          <ChartKey
            items={["exposed", "other", "displaced"]}
            className={sectionReallocationStyles.sankeyKey}
          />
          <p className={sectionReallocationStyles.spell}>
            {
              "As we progress from 2026 to 2030, the number of jobs available in occupations AI affects (knowledge work) decreases, while the jobs available in occupations AI doesn’t affect increase."
            }
          </p>
        </div>
      </section>
    </React.Fragment>
  );
}
export {
  l8,
  l7,
  l9,
  oe,
  ot,
  oa,
  os,
  ol,
  oo,
  or,
  on,
  WorkerFlows,
  SectionReallocation,
};
