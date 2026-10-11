// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionScenarioSquaresStyles from "../styles/SectionScenarioSquares.classes.js";
import { ag, af, ax, am } from "./drawing-tasks.jsx";
import {
  MARKER_FILTER_ID,
  hashNoise,
  RULE_FILTER_ID,
} from "./drawing-noise.jsx";
import {
  useElementSize,
  useNearViewport,
  a$,
  aB,
  aE,
  aW,
  aI,
} from "./layout-hooks.jsx";
import { MarkerBar } from "./MarkerBar.jsx";
import { ls } from "./model-metrics.jsx";
function TaskSquare({ px, seed, ink, fill, faint, draw }) {
  let r = Math.max(0, Math.min(1, fill)),
    n = React.useMemo(
      () =>
        draw
          ? ag(
              0,
              0,
              52,
              52,
              (e, t) => (e >= t - Math.round(t * r) ? ink : faint),
              {
                seed: af(seed),
                paper: "#FAF9F5",
              },
            ).join("") +
            ax(0, 0, 52, 52, {
              color: faint,
              seed: af(seed),
              paper: "#FAF9F5",
            })
          : "",
      [draw, r, ink, faint, seed],
    );
  return (
    <svg
      width={px}
      height={px}
      viewBox={"0 0 52 52"}
      style={{
        overflow: "visible",
        display: "block",
      }}
      aria-hidden={true}
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
function ScenarioSquareRow({
  comp,
  scale = 1,
  callouts = [],
  caption,
  title,
  simple = false,
  fitWidth,
  growth = "size",
  cols,
  slotPx,
}) {
  let h = 30 + (comp.extraN ?? 0),
    m = [];
  for (let t = 0; t < h; t++) {
    let a =
      t < comp.autoN ? "auto" : t < comp.autoN + comp.augN ? "aug" : "open";
    m.push({
      cat: a,
    });
  }
  if (comp.newN > 0) {
    let e = cols ?? 6,
      t = (e - (m.length % e)) % e;
    for (let e = 0; e < t; e++)
      m.push({
        cat: "pad",
      });
  }
  let p = comp.newFrac ?? comp.newN;
  for (let t = 0; t < comp.newN; t++)
    m.push({
      cat: "new",
      part: Math.max(0.12, Math.min(1, p - t)),
    });
  let f = simple ? 100 : Math.max(6, Math.round(100 * comp.adoption)),
    g = cols ?? 6,
    x = !!(cols && fitWidth),
    _ = x ? 0 : Math.max(2, 6 * scale),
    y = slotPx ?? (x ? fitWidth / g : 40 * scale),
    w = x ? y * g : (fitWidth ?? g * (y + _)),
    b =
      simple || "saturation" === growth
        ? 0
        : 0.36 * Math.min(1, comp.productivity),
    v =
      "saturation" === growth
        ? Math.round(30 + 55 * Math.min(1, comp.productivity))
        : 0,
    k = React.useRef(null),
    M = useElementSize(k),
    j = useNearViewport(k),
    S = React.useRef(new Map()),
    [N, A] = React.useState([]),
    T = callouts.map((e) => `${e.index}:${e.text}`).join("|");
  React.useLayoutEffect(() => {
    let e = () => {
      let e = k.current;
      if (!e || 0 === callouts.length) return void A([]);
      let t = e.getBoundingClientRect(),
        s = callouts
          .map((e) => {
            let a = S.current.get(e.index);
            if (!a) return null;
            let s = a.getBoundingClientRect();
            return {
              text: e.text,
              accent: e.accent,
              dashed: e.dashed,
              sx: s.right - t.left,
              sy: s.top - t.top + s.height / 2,
            };
          })
          .filter((e) => null != e)
          .sort((e, t) => e.sy - t.sy),
        l = -1 / 0;
      A(
        s.map((e) => {
          let t = Math.max(e.sy - 16, l + 54);
          l = t;
          return {
            ...e,
            cy: t,
          };
        }),
      );
    };
    e();
    let t = setTimeout(e, 680);
    return () => clearTimeout(t);
  }, [
    T,
    comp.autoN,
    comp.augN,
    comp.newN,
    comp.newFrac,
    comp.adoption,
    comp.productivity,
    comp.extraN,
    simple,
    scale,
  ]);
  return (
    <div
      className={sectionScenarioSquaresStyles.grid}
      style={{
        display: "inline-block",
      }}
    >
      {title && (
        <p
          className={sectionScenarioSquaresStyles.waffleLabel}
          style={{
            margin: "0 0 8px",
          }}
        >
          <b>{title}</b>
        </p>
      )}
      <div
        ref={k}
        style={{
          position: "relative",
          display: "inline-block",
          marginRight: 240 * !!N.length,
          transform: `translate(${M.x}px, ${M.y}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap-reverse",
            alignItems: "center",
            alignContent: "flex-start",
            gap: _,
            width: w,
          }}
        >
          {m.map((e, t) => {
            var s;
            let l =
              ((s = e.cat),
              simple
                ? 0.58 * y
                : "auto" === s || "aug" === s
                  ? y * (0.58 + b)
                  : "new" === s
                    ? 0.61 * y
                    : 0.58 * y);
            if ("pad" === e.cat)
              return (
                <div
                  style={{
                    width: y,
                    height: y,
                  }}
                  key={t}
                />
              );
            let r =
                "auto" === e.cat
                  ? "var(--sq-auto)"
                  : "aug" === e.cat
                    ? "var(--sq-aug)"
                    : "var(--accent-light)",
              n =
                v && ("auto" === e.cat || "aug" === e.cat)
                  ? `color-mix(in srgb, ${r} ${v}%, var(--surface))`
                  : r,
              i = callouts.some((e) => e.index === t);
            return (
              <div
                style={{
                  width: y,
                  height: y,
                  display: "grid",
                  placeItems: "center",
                }}
                ref={
                  i
                    ? (e) => {
                        e ? S.current.set(t, e) : S.current.delete(t);
                      }
                    : undefined
                }
                key={t}
              >
                <TaskSquare
                  px={l}
                  seed={7 * t + 3}
                  ink={
                    "open" === e.cat
                      ? "var(--sq-empty-b)"
                      : "new" === e.cat
                        ? "var(--sq-new, var(--accent))"
                        : n
                  }
                  fill={
                    "open" === e.cat
                      ? 0
                      : "new" === e.cat
                        ? simple
                          ? 1
                          : (e.part ?? 1)
                        : f / 100
                  }
                  faint={
                    "new" === e.cat
                      ? "var(--sq-new-ghost)"
                      : "var(--sq-empty-b)"
                  }
                  draw={j}
                />
              </div>
            );
          })}
        </div>
        {N.map((e, t) => (
          <div
            className={sectionScenarioSquaresStyles.calloutText}
            style={{
              position: "absolute",
              left: w + 24,
              top: e.cy,
              width: 200,
              border: `2px ${e.dashed ? "dashed" : "solid"} ${e.accent ?? "var(--border-strong)"}`,
            }}
            key={t}
          >
            {e.text}
          </div>
        ))}
      </div>
      {caption && (
        <p
          className={sectionScenarioSquaresStyles.wallCap}
          style={{
            marginTop: 10,
            maxWidth: 300,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
function ScenarioGrowthOutline() {
  let e = React.useRef(null),
    [t, a] = React.useState(null);
  React.useEffect(() => {
    let t = e.current;
    if (!t) return;
    let s = () => {
      let e,
        s = t.getBoundingClientRect();
      if (s.width < 1) return;
      let l = t.closest("section")?.querySelector(`[${a$}]`);
      if (l) {
        let t = l.getBoundingClientRect(),
          a = t.left + aB(t.width) + aE(t.width) - s.left,
          o = t.top + aW - s.top,
          r = (e, t, a) => t + 26 * a((e - t) / 26),
          n = document.documentElement.clientWidth,
          i = r(0, a, Math.floor),
          d = r(s.width, a, Math.ceil);
        for (; i < 4 - s.left;) i += 26;
        for (; d > n - 4 - s.left;) d -= 26;
        e = {
          x1: i,
          y1: r(0, o, Math.floor),
          x2: d,
          y2: r(s.height, o, Math.ceil),
        };
      } else
        e = {
          x1: 1,
          y1: 1,
          x2: Math.round(s.width) - 1,
          y2: Math.round(s.height) - 1,
        };
      a((t) => (JSON.stringify(t) === JSON.stringify(e) ? t : e));
    };
    s();
    let l = new ResizeObserver(s);
    l.observe(t);
    let o = t.closest("section")?.querySelector(`[${a$}]`);
    o && l.observe(o);
    return () => l.disconnect();
  }, []);
  let s = React.useMemo(() => {
    if (!t) return "";
    let { x1: e, y1: a, x2: s, y2: l } = t,
      o = (e, t, a, s, l) =>
        am(e, t, a, s, l, {
          width: 1.6 * (0.9 + 0.35 * hashNoise(l)),
          color: "#87867F",
          opacity: 0.62,
        });
    return (
      o(e, a, s, a, 346) +
      o(e, l, s, l, 61.3) +
      o(e, a, e, l, 44.4) +
      o(s, a, s, l, 52.9)
    );
  }, [t]);
  return (
    <div
      ref={e}
      className={sectionScenarioSquaresStyles.youOutline}
      aria-hidden={true}
    >
      {t && (
        <svg
          width={t.x2 - t.x1 + 68}
          height={t.y2 - t.y1 + 68}
          viewBox={`${t.x1 - 34} ${t.y1 - 34} ${t.x2 - t.x1 + 68} ${t.y2 - t.y1 + 68}`}
          style={{
            position: "absolute",
            left: t.x1 - 34,
            top: t.y1 - 34,
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
function ScenarioRows({
  label,
  comp,
  gainPct,
  levelRatio,
  gdp2030,
  maxLevelRatio,
  blurb,
  isYou = false,
  seed = 0,
}) {
  return (
    <div
      className={
        isYou
          ? `${sectionScenarioSquaresStyles.row} ${sectionScenarioSquaresStyles.you}`
          : sectionScenarioSquaresStyles.row
      }
    >
      {isYou && <ScenarioGrowthOutline />}
      <div
        className={sectionScenarioSquaresStyles.who}
        {...{
          [aI]: "",
        }}
      >
        <p className={sectionScenarioSquaresStyles.name}>{label}</p>
        {blurb && <p className={sectionScenarioSquaresStyles.blurb}>{blurb}</p>}
      </div>
      <div className={sectionScenarioSquaresStyles.gridSlot}>
        <ScenarioSquareRow comp={comp} cols={6} fitWidth={156} />
      </div>
      <div className={sectionScenarioSquaresStyles.barSlot}>
        <MarkerBar
          fraction={levelRatio / maxLevelRatio}
          color={"var(--bar-ink)"}
          label={ls(gainPct)}
          sublabel={`$${Number(gdp2030.toFixed(1))}T GDP`}
          seed={seed}
        />
      </div>
    </div>
  );
}
export { TaskSquare, ScenarioSquareRow, ScenarioGrowthOutline, ScenarioRows };
