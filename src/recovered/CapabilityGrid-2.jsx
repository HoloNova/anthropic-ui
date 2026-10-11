// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import taskGridStyles from "../styles/TaskGrid.classes.js";
import {
  QuietGraphPaper,
  ns,
  na,
  nb,
  nl,
  no,
  np,
  r9,
  nv,
  nf,
  r7,
  nm,
  n_,
  RecoveredComponent_nx,
  nM,
  nw,
  nk,
  ny,
  QuizPaper,
  r4,
  r6,
  nd,
  nr,
  nn,
  ni,
  TaskKey,
} from "./CapabilityGrid.jsx";
import { tx, eQ } from "./question-specs.jsx";
import { BASELINE_INK, AUTOMATION_INK, NEUTRAL_INK } from "./palette.jsx";
import { RULE_FILTER_ID, MARKER_FILTER_ID } from "./drawing-noise.jsx";
import { an } from "./drawing-grid.jsx";
function CapabilityGrid(e) {
  let { stage: t, annotationRule: a = true, onPaint: s, className: l } = e,
    o = React.useDeferredValue(e.capability),
    r = React.useDeferredValue(e.adoption),
    n = React.useDeferredValue(e.alone),
    i = React.useDeferredValue(e.gain),
    d = React.useDeferredValue(e.annotation?.text ?? null),
    h =
      null === d
        ? null
        : {
            text: d,
          },
    m = React.useRef(null),
    p = React.useRef(false),
    f = QuietGraphPaper(),
    g = "pace" === t,
    x = g ? ns : na,
    _ =
      h && a
        ? (function (e, t, a, s) {
            if ("capable" === e) {
              let e = Math.round(10 * nb(t) * 10),
                a = Math.floor(e / 10),
                s = 0 === a ? nl : no(a - 1),
                l = no(Math.min(a, 9));
              return 26 * Math.ceil((s - ((e - 10 * a) / 10) * (s - l)) / 26);
            }
            let l = "split" === e ? nb(a) * nb(s) : nb(a),
              o = np[0].length;
            return nl - (Math.round(l * o) / o) * r9;
          })(t, o, r, n)
        : null,
    y = null == _ ? -1 : Math.max(0, Math.round(_ / 26) - 1),
    w = null == _ ? undefined : x.rules.find((e) => e.key.startsWith(`h${y}-`)),
    b = null == _ ? 0 : _ - (y + 1) * 26,
    v = g ? tx(eQ, i) : 0,
    k = Math.round(100 * nb(o)),
    M = "split" === t || "pace" === t,
    j = React.useMemo(
      () =>
        nv.map((e, a) => {
          var s;
          let l, o, i;
          s =
            "capable" === t
              ? 1
              : ((l = nb(r)), nb(l + 0.18 * nv[a] * Math.sin(Math.PI * l)));
          i = (o = nb(s)) * nb(n);
          return {
            human: [0, 1],
            doing: [0, M ? 0 : o],
            auto: [0, M ? i : 0],
            aug: M ? [i, o] : [0, 0],
          };
        }),
      [t, r, n, M],
    ),
    S =
      "capable" === t || "doing" === t
        ? BASELINE_INK
        : "split" === t
          ? AUTOMATION_INK
          : NEUTRAL_INK,
    N = g ? `s${v}` : "r",
    A = g ? nf[v] : np,
    T = g ? 26 * r7[v] : r9,
    L = React.useMemo(() => nm(T), [T]),
    $ = React.useMemo(() => {
      let e = nm(r9);
      return Array.from(
        {
          length: 24,
        },
        (t, a) => (
          <g id={n_(a)} key={a}>
            <RecoveredComponent_nx passes={np[a]} weather={e[a].human} />
          </g>
        ),
      );
    }, []),
    W = React.useMemo(
      () =>
        nM.map((e) =>
          ("human" === e ? [0] : nv.map((e, t) => t)).map((t) =>
            A.map((a, s) => (
              <g id={nw(N, e, t, s)} key={`${e}${t}${s}`}>
                <RecoveredComponent_nx
                  passes={a}
                  band={j[t][e]}
                  weather={L[s][e]}
                />
              </g>
            )),
          ),
        ),
      [A, N, j, L],
    ),
    R = React.useMemo(() => {
      let e = x.pitch,
        t = [];
      for (let a = 0; a < 10; a++)
        for (let s = 0; s < 10; s++) {
          let l = (9 - a) * 10 + s,
            o = l < k ? null : NEUTRAL_INK,
            r = l < k,
            n = l % 24,
            i = g && r && v > 0 ? ((r7[v] - 2) / 2) * 26 : 0,
            d = `translate(${104 + s * e - i} ${104 + a * e - i})`,
            u = (
              <use
                className={
                  o
                    ? `${taskGridStyles.ink} ${taskGridStyles.on}`
                    : `${taskGridStyles.ink} ${taskGridStyles.off}`
                }
                href={`#${n_(n)}`}
                transform={d}
                strokeDasharray={1}
                strokeDashoffset={+!o}
                style={{
                  color: o ?? NEUTRAL_INK,
                }}
                key={"flat"}
              />
            ),
            h = nk(l),
            m = (e) => (
              <use
                className={
                  r
                    ? `${taskGridStyles.ink} ${taskGridStyles.on}`
                    : `${taskGridStyles.ink} ${taskGridStyles.off}`
                }
                href={`#${nw(N, e, "human" === e ? 0 : h, n)}`}
                transform={d}
                strokeDasharray={1}
                style={{
                  color: ny[e],
                }}
                key={e}
              />
            );
          t.push(
            <g key={l}>
              {u}
              {nM.map(m)}
            </g>,
          );
        }
      return t;
    }, [g, v, x, k, N]),
    B = (e) => {
      let t = m.current;
      if (!t || !s) return;
      let a = t.getScreenCTM();
      a &&
        s(
          Math.max(
            0,
            Math.min(
              1,
              1 -
                (new DOMPoint(0, e).matrixTransform(a.inverse()).y - 104) /
                  (x.height - 208),
            ),
          ),
        );
    };
  return (
    <div className={l ? `${taskGridStyles.wrap} ${l}` : taskGridStyles.wrap}>
      {s && <QuizPaper shown={f.shown} />}
      <div
        className={taskGridStyles.sheetBox}
        style={{
          "--sheet-top-border": `${((104 / x.width) * 100).toFixed(3)}%`,
          "--sheet-side-share": (104 / x.width).toFixed(4),
        }}
      >
        <svg
          ref={m}
          className={
            s
              ? `${taskGridStyles.grid} ${taskGridStyles.paintable}`
              : taskGridStyles.grid
          }
          style={
            s
              ? {
                  cursor: r4(S),
                }
              : undefined
          }
          viewBox={`0 0 ${x.width} ${x.height}`}
          onPointerEnter={s ? f.onEnter : undefined}
          onPointerLeave={s ? f.onLeave : undefined}
          onPointerDown={
            s
              ? (e) => {
                  f.onUse();
                  p.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  B(e.clientY);
                }
              : undefined
          }
          onPointerMove={s ? (e) => p.current && B(e.clientY) : undefined}
          onPointerUp={
            s
              ? (e) => {
                  p.current = false;
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
              : undefined
          }
          aria-hidden={true}
          focusable={"false"}
        >
          <defs>
            {$}
            {W}
          </defs>
          {w && (
            <g
              className={taskGridStyles.markRule}
              filter={`url(#${RULE_FILTER_ID})`}
              transform={`translate(0 ${b})`}
              dangerouslySetInnerHTML={{
                __html: an(
                  w,
                  {
                    ...r6,
                    width: 1 / nd,
                    opacity: 1,
                  },
                  {
                    from: nr,
                    to: nn,
                  },
                ),
              }}
            />
          )}
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
            }}
          >
            {R}
          </g>
        </svg>
        {h && (
          <p
            className={taskGridStyles.annotation}
            style={{
              top: `${null == _ ? 50 : ni(_, x.width, x.height)}%`,
              "--annotation-x": `${(nn / x.width) * 100}%`,
            }}
            aria-live={"polite"}
          >
            {h.text}
          </p>
        )}
      </div>
      <TaskKey stage={t} />
    </div>
  );
}
export { CapabilityGrid };
