// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import shareStrokesStyles from "../styles/ShareStrokes.classes.js";
import { useScrollDraw } from "./scroll-hooks.jsx";
import { ag, ax } from "./drawing-tasks.jsx";
import { hashNoise, MARKER_FILTER_ID } from "./drawing-noise.jsx";
import { NEUTRAL_INK } from "./palette.jsx";
function ShareStrokes({
  cents,
  todayCents,
  widthFraction,
  sizeLabel,
  sizeAt = "row-end",
  sizeCut = "caption-2",
  outlined = false,
  seed = 0,
  splitGap = 0,
  anchorFraction,
}) {
  let h = React.useRef(null),
    m = React.useId().replace(/[^a-zA-Z0-9_-]/g, ""),
    p = useScrollDraw(h),
    f = Math.round(cents),
    g = Math.max(0, Math.round(todayCents) - f),
    x = Math.max(0, Math.round(splitGap)),
    _ = Math.max(0, p - x),
    y = Math.max(0, Math.round(_ * widthFraction)),
    w = y / 100,
    b = y + x,
    v = 97.3 * seed + 3,
    k = f * w,
    M = (f + g) * w + x,
    j = "",
    S =
      y > 2
        ? ag(
            0,
            0,
            b,
            46,
            (e) => {
              let t = `shs-${m}-${e}`,
                a = (hashNoise(v + 7.7 * e) - 0.5) * 2,
                s = (hashNoise(v + 7.7 * e + 5.9) - 0.5) * 2,
                l = (hashNoise(v + 7.7 * e + 3.1) - 0.5) * 2,
                o = (e) => Math.max(0, Math.min(1, e / Math.max(1, b))),
                r = o(k + a),
                n = x > 0 ? Math.max(r, o(k + x + s)) : r,
                i = Math.max(n, o(M + l));
              j +=
                `<linearGradient id="${t}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${b}" y2="0"><stop offset="${r.toFixed(4)}" stop-color="var(--stroke-labour)"/>` +
                (x > 0
                  ? `<stop offset="${r.toFixed(4)}" stop-color="var(--stroke-labour)" stop-opacity="0"/><stop offset="${n.toFixed(4)}" stop-color="var(--stroke-moved)" stop-opacity="0"/>`
                  : "") +
                `<stop offset="${n.toFixed(4)}" stop-color="var(--stroke-moved)"/>` +
                `<stop offset="${i.toFixed(4)}" stop-color="var(--stroke-moved)"/>` +
                `<stop offset="${i.toFixed(4)}" stop-color="var(--stroke-capital)"/>` +
                "</linearGradient>";
              return `url(#${t})`;
            },
            {
              seed: v,
              paper: "#FAF9F5",
              endScatter: 0.3,
            },
          ).join("")
        : "",
    N =
      x > 0
        ? ax(0, 0, k, 46, {
            color: NEUTRAL_INK,
            seed: v,
            paper: "#FAF9F5",
          }) +
          ax(k + x, 0, b - k - x, 46, {
            color: NEUTRAL_INK,
            seed: v + 11,
            paper: "#FAF9F5",
          })
        : ax(0, 0, b, 46, {
            color: NEUTRAL_INK,
            seed: v,
            paper: "#FAF9F5",
          }),
    A = S ? `<defs>${j}</defs>` + S + N : "",
    T =
      null != anchorFraction
        ? Math.max(0, Math.round(_ * anchorFraction - k))
        : 0;
  return (
    <span className={shareStrokesStyles.barLine}>
      <span
        className={shareStrokesStyles.track}
        ref={h}
        style={
          T
            ? {
                "--anchor-inset": `${T}px`,
              }
            : undefined
        }
      >
        <svg
          className={
            outlined
              ? `${shareStrokesStyles.bar} ${shareStrokesStyles.outlined}`
              : shareStrokesStyles.bar
          }
          width={b}
          height={46}
          viewBox={`0 0 ${Math.max(1, b)} 46`}
          style={{
            overflow: "visible",
          }}
          aria-hidden={true}
        >
          {y > 0 && A && (
            <g
              filter={`url(#${MARKER_FILTER_ID})`}
              style={{
                isolation: "isolate",
                mixBlendMode: "multiply",
              }}
              dangerouslySetInnerHTML={{
                __html: A,
              }}
            />
          )}
        </svg>
        {sizeLabel && "bar-end" === sizeAt && (
          <span
            className={`${shareStrokesStyles.size} ${"caption-1" === sizeCut ? shareStrokesStyles.sizeUp : ""} ${shareStrokesStyles.sizeBarEnd}`}
            style={{
              left: b + 14,
            }}
          >
            {sizeLabel}
          </span>
        )}
      </span>
      {sizeLabel && "row-end" === sizeAt && (
        <span
          className={`${shareStrokesStyles.size} ${"caption-1" === sizeCut ? shareStrokesStyles.sizeUp : ""}`}
        >
          {sizeLabel}
        </span>
      )}
    </span>
  );
}
export { ShareStrokes };
