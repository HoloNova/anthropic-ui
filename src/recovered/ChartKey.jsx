// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import chartKeyStyles from "../styles/ChartKey.classes.js";
import * as React from "react";
import { makeRuleStroke } from "./drawing-strokes-2.jsx";
import { makeMarkerStroke } from "./drawing-strokes.jsx";
import { MARKER_FILTER_ID } from "./drawing-noise.jsx";
import { ag, af, ax } from "./drawing-tasks.jsx";
function LegendStroke({ ink, dashed, lead, seed }) {
  let l = dashed ? 22 : 18,
    o = [
      [1, 5.4],
      [l / 2, 4.6],
      [l - 1, 5.2],
    ],
    r = {
      width: lead ? 4.86 : 3.6,
      color: ink,
      seed,
      opacity: lead ? 1 : 0.86,
    },
    n = dashed
      ? makeRuleStroke(o, {
          ...r,
          neat: true,
          landOnEnd: true,
          samples: 24,
          dashLength: 7,
          gap: 5,
        })
      : makeMarkerStroke(o, {
          ...r,
          taperIn: 0.07,
          taperOut: 0.07,
          startWidth: 0.6,
          endWidth: 0.85,
        });
  return (
    <svg
      width={l}
      height={10}
      viewBox={`0 0 ${l} 10`}
      style={{
        overflow: "visible",
        display: "block",
        flex: "none",
      }}
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
          __html: n,
        }}
      />
    </svg>
  );
}
function LegendSquare({ px, ink, seed }) {
  let s =
    ag(0, 0, 52, 52, () => ink, {
      seed: af(seed),
      paper: "#FAF9F5",
    }).join("") +
    ax(0, 0, 52, 52, {
      color: ink,
      seed: af(seed),
      paper: "#FAF9F5",
    });
  return (
    <svg
      width={px}
      height={px}
      viewBox={"0 0 52 52"}
      style={{
        overflow: "visible",
        display: "block",
        flex: "none",
      }}
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
          __html: s,
        }}
      />
    </svg>
  );
}
let lG = (e) => {
  let t = 0;
  for (let a = 0; a < e.length; a++) t = (31 * t + e.charCodeAt(a)) % 997;
  return t + 5;
};
let lO = {
  exposed: {
    label: "Knowledge workers",
    ink: "var(--ink-exposed)",
  },
  other: {
    label: "All other workers",
    ink: "var(--ink-other)",
  },
  all: {
    label: "Total",
    ink: "var(--ink-all)",
    lead: true,
  },
  displaced: {
    label: "Displaced",
    ink: "var(--ink-displaced)",
  },
  labour: {
    label: "To labor",
    ink: "var(--ink-labour)",
  },
  capital: {
    label: "To capital",
    ink: "var(--ink-capital)",
  },
  moved: {
    label: "Moved to capital",
    ink: "var(--ink-moved)",
  },
  you: {
    label: "You",
    ink: "var(--ink-you)",
  },
  noAi: {
    label: "Without AI",
    ink: "var(--ink-no-ai)",
    dashed: true,
  },
  withAi: {
    label: "With AI",
    ink: "var(--ink-all)",
  },
  productivity: {
    label: "Output per worker",
    ink: "var(--ink-all)",
  },
  wages: {
    label: "Wages",
    ink: "var(--sq-aug)",
  },
  automated: {
    label: "Tasks automated",
    ink: "var(--sq-auto)",
    square: true,
  },
  augmented: {
    label: "Tasks augmented",
    ink: "var(--sq-aug)",
    square: true,
  },
  newWork: {
    label: "New tasks created by AI",
    ink: "var(--sq-new)",
    square: true,
  },
  untouched: {
    label: "Tasks unchanged by AI",
    ink: "var(--accent-light)",
    square: true,
  },
};
function ChartKey({
  items,
  note,
  sizeNote,
  labels,
  inks,
  stacked,
  title,
  className,
}) {
  let i = [chartKeyStyles.key, stacked && chartKeyStyles.stacked, className]
    .filter(Boolean)
    .join(" ");
  return (
    <p className={i}>
      {title && <span className={chartKeyStyles.title}>{title}</span>}
      {items.map((e) => {
        let t = lO[e],
          a = inks?.[e] ?? t.ink,
          o = "dashed" in t && t.dashed,
          r = "lead" in t && t.lead,
          n = "square" in t && t.square;
        return (
          <span className={chartKeyStyles.item} key={e}>
            {n ? (
              <LegendSquare px={12} ink={a} seed={lG(e)} />
            ) : (
              <LegendStroke ink={a} dashed={o} lead={r} seed={lG(e)} />
            )}
            {labels?.[e] ?? t.label}
          </span>
        );
      })}
      {sizeNote && (
        <span className={chartKeyStyles.item}>
          <span className={chartKeyStyles.sizePair} aria-hidden={true}>
            <LegendSquare
              px={8}
              ink={"var(--color-slate-400)"}
              seed={lG("size-small")}
            />
            <LegendSquare
              px={13}
              ink={"var(--color-slate-400)"}
              seed={lG("size-large")}
            />
          </span>
          {sizeNote}
        </span>
      )}
      {note && <span className={chartKeyStyles.note}>{note}</span>}
    </p>
  );
}
function lz(e) {
  let t = Math.round(30 * e.reached),
    a = Math.round(30 * e.automated),
    s = 30 * e.created;
  return {
    autoN: a,
    augN: Math.max(0, t - a),
    newN: Math.ceil(s - 1e-9),
    newFrac: s,
    adoption: e.adopted,
    productivity: e.gain,
  };
}
export { LegendStroke, LegendSquare, lG, lO, ChartKey, lz };
