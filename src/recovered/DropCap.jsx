// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import dropCapStyles from "../styles/DropCap.classes.js";
import sectionProseStyles from "../styles/SectionProse.classes.js";
import { hashNoise, MARKER_FILTER_ID } from "./drawing-noise.jsx";
import { ag, ax } from "./drawing-tasks.jsx";
import { makeRuleStroke } from "./drawing-strokes-2.jsx";
let lZ = "#4A4A45";
let l0 = (e) => {
  let t = hashNoise(3.3 * l1 + 7.7 * e);
  return t < 0.28 ? "#575650" : t > 0.78 ? "#3D3C38" : lZ;
};
let l1 = 11;
function DropCap({ letter = "A" }) {
  let t = React.useRef(null),
    [a, s] = React.useState(null);
  React.useEffect(() => {
    let a = true,
      l = () => {
        let l = t.current;
        if (!a || !l) return;
        let o = getComputedStyle(l).fontFamily,
          r = document.createElement("canvas").getContext("2d");
        if (!r) return;
        r.font = `700 92px ${o}`;
        let n = r.measureText(letter),
          i = n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
          d = n.actualBoundingBoxAscent + n.actualBoundingBoxDescent;
        i > 0 &&
          d > 0 &&
          s({
            x: -n.actualBoundingBoxLeft,
            y: 92 - n.actualBoundingBoxAscent,
            w: i,
            h: d,
          });
      };
    "u" > typeof document && document.fonts?.ready
      ? document.fonts.ready.then(l)
      : l();
    return () => {
      a = false;
    };
  }, [letter]);
  let l = a ? Math.round((64 * a.w) / a.h) : null,
    o = `efx-dropcap-${letter}`;
  return (
    <span className={dropCapStyles.drop} ref={t}>
      <span className={a ? dropCapStyles.sr : dropCapStyles.glyph}>
        {letter}
      </span>
      {a && null != l && (
        <svg
          className={dropCapStyles.art}
          style={{
            width: l,
          }}
          viewBox={`${a.x} ${a.y} ${a.w} ${a.h}`}
          aria-hidden={true}
        >
          <clipPath id={o}>
            <text className={dropCapStyles.glyphType} x={"0"} y={92}>
              {letter}
            </text>
          </clipPath>
          <g filter={`url(#${MARKER_FILTER_ID})`}>
            <g
              clipPath={`url(#${o})`}
              dangerouslySetInnerHTML={{
                __html:
                  '<g class="mk" style="mix-blend-mode:multiply"><g opacity="0.94">' +
                  ag(a.x - 4, a.y - 4, a.w + 8, a.h + 8, l0, {
                    seed: l1,
                    color: lZ,
                    paper: "#FAF9F5",
                  }).join("") +
                  "</g>" +
                  ax(a.x - 4, a.y - 4, a.w + 8, a.h + 8, {
                    seed: l1,
                    color: lZ,
                    paper: "#FAF9F5",
                  }) +
                  "</g>",
              }}
            />
          </g>
        </svg>
      )}
    </span>
  );
}
function PullQuote({ children, className }) {
  return (
    <p
      className={
        className
          ? `${sectionProseStyles.pull} ${className}`
          : sectionProseStyles.pull
      }
    >
      {children}
    </p>
  );
}
let l3 = "#B0403A";
function l6(e, t, a, s, l, o = l3) {
  return makeRuleStroke(
    [
      [e, t],
      [e + a, t + 1],
      [e + a + 1, t + s / 2],
      [e + a, t + s],
      [e, t + s - 1],
      [e - 1, t + s / 2],
      [e, t + 1],
    ],
    {
      width: 2.6,
      color: o,
      seed: l,
      dashLength: 9,
      gap: 5.5,
    },
  );
}
export { lZ, l0, l1, DropCap, PullQuote, l3, l6 };
