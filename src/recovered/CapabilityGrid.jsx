// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import taskGridStyles from "../styles/TaskGrid.classes.js";
import { eQ } from "./question-specs.jsx";
import { ar, an } from "./drawing-grid.jsx";
import { ag, ax, aw } from "./drawing-tasks.jsx";
import {
  hashNoise,
  MARKER_FILTER_ID,
  RULE_FILTER_ID,
} from "./drawing-noise.jsx";
import {
  BASELINE_INK,
  AUTOMATION_INK,
  AUGMENTATION_INK,
  NEUTRAL_INK,
} from "./palette.jsx";
import { useScrollDraw } from "./scroll-hooks.jsx";
function QuietGraphPaper() {
  let [e, t] = React.useState(false),
    [a, s] = React.useState(false);
  return {
    shown: e && !a,
    onEnter: () => t(true),
    onLeave: () => {
      t(false);
      s(false);
    },
    onUse: () => s(true),
  };
}
function QuizPaper({ shown }) {
  return (
    <p
      className={
        shown
          ? `${taskGridStyles.hint} ${taskGridStyles.hintOn}`
          : taskGridStyles.hint
      }
      aria-hidden={true}
    >
      {"Or draw your prediction here — drag up or down"}
    </p>
  );
}
let r6 = {
  cell: 26,
  rag: 24,
  opacity: 0.3,
};
let r4 = (e) => {
  let t = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g transform="rotate(38 6 26)"><path d="M2 9.5Q2 8 3.5 8h5Q10 8 10 9.5V24l-4 5-4-5z" fill="${e}" stroke="#3c3733" stroke-width="1" stroke-linejoin="round"/><rect x="2" y="12" width="8" height="5" fill="#fffdf8" fill-opacity=".7"/><path d="M2 24h8" stroke="#3c3733" stroke-width="1" stroke-opacity=".55"/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(t)}") 4 28, crosshair`;
};
let r8 = eQ.length;
let r7 = Array.from(
  {
    length: r8,
  },
  (e, t) => 2 + (0.75 * t) / (r8 - 1),
);
let r9 = 52;
let ne = 78;
function nt(e, t = ne, a = r9) {
  let s = 9 * t + a + 208,
    l = (e - 1) * t + a + 208;
  return {
    width: s,
    height: l,
    pitch: t,
    rules: ar(0, 0, s, l, r6),
  };
}
let na = nt(10);
let ns = nt(10, 78, r9);
let nl = 104 + 9 * ne + r9;
let no = (e) => 104 + (9 - e) * ne;
let nr = 78;
let nn = 104 + 9 * ne + r9 + 26;
let ni = (e, t, a) => 100 * ((1 - a / t) / 2 + e / t);
let nd = 665 / na.width;
let nc = {
  finePass: true,
};
let nu = (e) =>
  Array.from(
    {
      length: 24,
    },
    (t, a) =>
      ag(0, 0, e, e, () => "currentColor", {
        seed: 7 * a + 3,
        strokeWidth: 3.2 / nd,
        ...nc,
        paper: "#FAF9F5",
      }),
  );
let nh = new Map();
let nm = (e) => {
  let t = nh.get(e);
  t ||
    ((t = Array.from(
      {
        length: 24,
      },
      (t, a) =>
        Object.fromEntries(
          nM.map((t) => [
            t,
            ax(0, 0, e, e, {
              color: ny[t],
              seed: 7 * a + 3,
              paper: "#FAF9F5",
            }),
          ]),
        ),
    )),
    nh.set(e, t));
  return t;
};
let np = nu(r9);
let nf = r7.map((e) => nu(26 * e));
let ng = (e, t) => {
  let a = e.length;
  return t ? [a - Math.round(t[1] * a), a - Math.round(t[0] * a)] : [0, a];
};
let RecoveredComponent_nx = React.memo(
  function ({ passes, band, weather }) {
    let s = passes.length,
      [l, o] = ng(passes, band);
    return (
      <g
        style={{
          isolation: "isolate",
        }}
      >
        {passes.map((e, a) => (
          <g
            className={
              band && !(a >= l && a < o)
                ? `${taskGridStyles.sline} ${taskGridStyles.soff}`
                : taskGridStyles.sline
            }
            style={{
              "--dd": `${Math.round(110 * hashNoise(2.71 * (13.3 * a + 7) + 0.5))}ms`,
            }}
            dangerouslySetInnerHTML={{
              __html: e,
            }}
            key={a}
          />
        ))}
        {weather ? (
          <g
            className={taskGridStyles.wband}
            style={
              band
                ? {
                    clipPath: `inset(${((l / s) * 100).toFixed(2)}% 0 ${(((s - o) / s) * 100).toFixed(2)}% 0)`,
                  }
                : undefined
            }
            dangerouslySetInnerHTML={{
              __html: weather,
            }}
          />
        ) : null}
      </g>
    );
  },
  (e, t) => {
    if (e.passes !== t.passes || e.weather !== t.weather) return false;
    let [a, s] = ng(e.passes, e.band),
      [l, o] = ng(t.passes, t.band);
    return a === l && s === o;
  },
);
let n_ = (e) => `efx-quiz-mark-${e}`;
let ny = {
  doing: BASELINE_INK,
  auto: AUTOMATION_INK,
  aug: AUGMENTATION_INK,
  human: NEUTRAL_INK,
};
let nw = (e, t, a, s) => `efx-quiz-${e}-${t}-${a}-${s}`;
let nb = (e) => Math.max(0, Math.min(1, e));
let nv = [-1, 0, 1];
let nk = (e) => Math.floor(hashNoise(7.31 * e + 2.4) * nv.length);
let nM = ["human", "doing", "auto", "aug"];
let nS = Object.fromEntries(
  [BASELINE_INK, AUTOMATION_INK, AUGMENTATION_INK, NEUTRAL_INK].map((e) => [
    e,
    ag(0, 0, r9, r9, () => e, {
      seed: 38,
      color: e,
      paper: "#FAF9F5",
    })
      .join("")
      .concat(
        ax(0, 0, r9, r9, {
          color: e,
          seed: 38,
          paper: "#FAF9F5",
        }),
      ),
  ]),
);
function TaskKeySquare({ ink }) {
  return (
    <svg
      className={taskGridStyles.chipMark}
      viewBox={`${-0.2 * r9} ${-0.2 * r9} ${1.4 * r9} ${1.4 * r9}`}
      aria-hidden={true}
      focusable={"false"}
    >
      <g
        filter={`url(#${MARKER_FILTER_ID})`}
        style={{
          isolation: "isolate",
          mixBlendMode: "multiply",
        }}
        dangerouslySetInnerHTML={{
          __html: nS[ink] ?? nS[NEUTRAL_INK],
        }}
      />
    </svg>
  );
}
function TaskKey({ stage }) {
  let t = "pace" === stage,
    a =
      "capable" === stage || "doing" === stage
        ? [
            {
              key: "doing",
              ink: BASELINE_INK,
              label:
                "capable" === stage
                  ? "Tasks AI is capable of doing"
                  : "How much of each capable task AI does",
            },
          ]
        : [
            {
              key: "auto",
              ink: AUTOMATION_INK,
              label: t ? "Tasks automated" : "AI doing tasks autonomously",
            },
            {
              key: "aug",
              ink: AUGMENTATION_INK,
              label: t ? "Tasks augmented" : "AI augmented tasks",
            },
          ];
  return (
    <ul className={taskGridStyles.legend}>
      {a.map((e) => (
        <li className={taskGridStyles.legendItem} key={e.key}>
          <span className={taskGridStyles.chip}>
            <TaskKeySquare ink={e.ink} />
          </span>
          {e.label}
        </li>
      ))}
      {"pace" === stage && (
        <li className={taskGridStyles.legendItem}>
          <span className={taskGridStyles.sizePair} aria-hidden={true}>
            <span
              className={`${taskGridStyles.chip} ${taskGridStyles.chipSmall}`}
            >
              <TaskKeySquare ink={NEUTRAL_INK} />
            </span>
            <span
              className={`${taskGridStyles.chip} ${taskGridStyles.chipLarge}`}
            >
              <TaskKeySquare ink={NEUTRAL_INK} />
            </span>
          </span>
          {"Productivity"}
        </li>
      )}
    </ul>
  );
}
let nT = 494;
let nL = 208;
let nI = 1066;
let n$ = 1222;
let nF = 52;
let nW = 1170;
let nC = 676;
let nR = {
  cell: 26,
  rag: 24,
  opacity: 0.3,
};
let nB = ar(0, 0, 1222, nC, nR);
let nE = 665 / Math.max(n$, nC);
let nP = Array.from(
  {
    length: 24,
  },
  (e, t) =>
    aw(0, 0, 104, 52, {
      color: "currentColor",
      seed: 7 * t + 3,
      strokeWidth: 6.5 / nE,
      paper: "#FAF9F5",
      opacity: 1,
    }),
);
let nG = "#B0403A";
let nO = (e) => [
  parseInt(e.slice(1, 3), 16),
  parseInt(e.slice(3, 5), 16),
  parseInt(e.slice(5, 7), 16),
];
let nq = 48;
let nz = (e) => `efx-quiz-cal-${e}`;
function AdjustmentGrid({ months, annotation = null, onPaint, className }) {
  let l,
    o,
    r = React.useRef(null),
    n = React.useRef(false),
    i = QuietGraphPaper(),
    d = Math.max(1, Math.min(nq, Math.round(months))),
    h = annotation
      ? {
          y: (o =
            78 +
            Math.floor(
              Math.floor((l = Math.max(0, Math.min(48, d) - 1)) / 12) / 2,
            ) *
              (nL + 104) +
            78 * Math.floor((l % 12) / 4) +
            52),
          key: `h${Math.max(0, Math.round(o / 26) - 1)}`,
        }
      : null,
    m = h ? nB.find((e) => e.key === h.key) : undefined,
    p = useScrollDraw(r),
    f = p > 0 ? p / n$ : nE,
    g = React.useMemo(() => {
      let e = [];
      for (let t = 0; t < 4; t++) {
        let a = 78 + (t % 2) * (nT + 78),
          s = 78 + Math.floor(t / 2) * (nL + 104);
        for (let l = 0; l < 12; l++) {
          let o = 12 * t + l,
            r = `translate(${a + (l % 4) * 130} ${s + 78 * Math.floor(l / 4)})`;
          e.push(
            <use
              className={`${taskGridStyles.ink} ${taskGridStyles.on}`}
              href={`#${nz(o % 24)}`}
              transform={r}
              strokeDasharray={1}
              strokeDashoffset={0}
              style={{
                color: (function (e, t) {
                  var a;
                  let s, l;
                  return e >= t
                    ? NEUTRAL_INK
                    : ((a = 0.2 + 0.8 * (t > 1 ? e / (t - 1) : 1)),
                      (s = nO(NEUTRAL_INK)),
                      (l = nO(nG)),
                      `#${s
                        .map((e, t) =>
                          Math.round(e + (l[t] - e) * a)
                            .toString(16)
                            .padStart(2, "0"),
                        )
                        .join("")}`);
                })(o, d),
              }}
              key={o}
            />,
          );
        }
      }
      return e;
    }, [d]),
    x = React.useMemo(
      () =>
        Array.from(
          {
            length: 4,
          },
          (e, t) => {
            let a = 78 + (t % 2) * (nT + 78),
              s = 78 + Math.floor(t / 2) * (nL + 104);
            return (
              <text
                x={a + nT / 2}
                y={s - 16}
                textAnchor={"middle"}
                fill={"#87867f"}
                className={taskGridStyles.yearLabel}
                fontSize={13 / f}
                key={t}
              >
                {2026 + t}
              </text>
            );
          },
        ),
      [f],
    ),
    _ = (e) => {
      let t = r.current;
      if (!t || !onPaint) return;
      let s = t.getScreenCTM();
      s &&
        onPaint(
          Math.max(
            0,
            Math.min(
              1,
              1 -
                (new DOMPoint(0, e).matrixTransform(s.inverse()).y - 78) /
                  (nC - 156),
            ),
          ),
        );
    };
  return (
    <div
      className={
        className ? `${taskGridStyles.wrap} ${className}` : taskGridStyles.wrap
      }
    >
      {onPaint && <QuizPaper shown={i.shown} />}
      <div
        className={taskGridStyles.sheetBox}
        style={{
          "--sheet-top-border": `${((78 / n$) * 100).toFixed(3)}%`,
          "--sheet-side-share": (78 / n$).toFixed(4),
        }}
      >
        <svg
          ref={r}
          className={
            onPaint
              ? `${taskGridStyles.grid} ${taskGridStyles.paintable}`
              : taskGridStyles.grid
          }
          style={
            onPaint
              ? {
                  cursor: r4(nG),
                }
              : undefined
          }
          viewBox={`0 0 ${n$} ${nC}`}
          onPointerEnter={onPaint ? i.onEnter : undefined}
          onPointerLeave={onPaint ? i.onLeave : undefined}
          onPointerDown={
            onPaint
              ? (e) => {
                  i.onUse();
                  n.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  _(e.clientY);
                }
              : undefined
          }
          onPointerMove={onPaint ? (e) => n.current && _(e.clientY) : undefined}
          onPointerUp={
            onPaint
              ? (e) => {
                  n.current = false;
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
              : undefined
          }
          aria-hidden={true}
          focusable={"false"}
        >
          <defs>
            {nP.map((e, t) => (
              <g
                id={nz(t)}
                dangerouslySetInnerHTML={{
                  __html: e,
                }}
                key={t}
              />
            ))}
          </defs>
          {m && (
            <g
              className={taskGridStyles.markRule}
              filter={`url(#${RULE_FILTER_ID})`}
              dangerouslySetInnerHTML={{
                __html: an(
                  m,
                  {
                    ...nR,
                    width: 1 / nE,
                    opacity: 1,
                  },
                  {
                    from: nF,
                    to: nW,
                  },
                ),
              }}
            />
          )}
          {x}
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              mixBlendMode: "multiply",
            }}
          >
            {g}
          </g>
        </svg>
        {annotation && h && (
          <p
            className={taskGridStyles.annotation}
            style={{
              top: `${ni(h.y, n$, nC)}%`,
              "--annotation-x": `${(nW / n$) * 100}%`,
            }}
            aria-live={"polite"}
          >
            {annotation.text}
          </p>
        )}
      </div>
    </div>
  );
}
export {
  QuietGraphPaper,
  QuizPaper,
  r6,
  r4,
  r8,
  r7,
  r9,
  ne,
  nt,
  na,
  ns,
  nl,
  no,
  nr,
  nn,
  ni,
  nd,
  nc,
  nu,
  nh,
  nm,
  np,
  nf,
  ng,
  RecoveredComponent_nx,
  n_,
  ny,
  nw,
  nb,
  nv,
  nk,
  nM,
  nS,
  TaskKeySquare,
  TaskKey,
  nT,
  nL,
  nI,
  n$,
  nF,
  nW,
  nC,
  nR,
  nB,
  nE,
  nP,
  nG,
  nO,
  nq,
  nz,
  AdjustmentGrid,
};
