// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import markerBarStyles from "../styles/MarkerBar.classes.js";
import { aw } from "./drawing-tasks.jsx";
import { MARKER_FILTER_ID } from "./drawing-noise.jsx";
function MarkerBar({
  fraction,
  color = "var(--color-slate-400)",
  label,
  sublabel,
  seed = 0,
  height = 34,
  valueAt = "bar-end",
}) {
  let n = React.useRef(null),
    i = React.useRef(null),
    d = React.useRef(null),
    [h, m] = React.useState(0),
    [p, f] = React.useState(0),
    [g, x] = React.useState(0);
  React.useEffect(() => {
    let e = [
        [n.current, m],
        [i.current, f],
        [d.current, x],
      ],
      t = () => {
        for (let [t, a] of e) {
          if (!t) continue;
          let e = Math.round(t.getBoundingClientRect().width);
          a((t) => (t === e ? t : e));
        }
      };
    t();
    let a = new ResizeObserver(t);
    for (let [t] of e) t && a.observe(t);
    return () => a.disconnect();
  }, []);
  let _ = Math.max(0, Math.round(h * Math.max(0, Math.min(1, fraction)))),
    y = g > 0 ? Math.min(_ + 14, Math.max(0, p - g)) : _ + 14,
    w = "bar-end" === valueAt,
    b = !!(label || sublabel),
    v =
      _ > 2
        ? aw(0, 0, _, height, {
            seed: 31.7 * seed + 3,
            color,
            endScatter: 0.3,
          })
        : "";
  return (
    <span className={markerBarStyles.barLine} ref={i}>
      <span className={markerBarStyles.track} ref={n}>
        <svg
          className={markerBarStyles.bar}
          width={Math.max(1, _) + 16}
          height={height + 16}
          viewBox={`-8 -8 ${Math.max(1, _) + 16} ${height + 16}`}
          style={{
            marginLeft: -8,
            marginTop: -8,
          }}
          aria-hidden={true}
        >
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              isolation: "isolate",
            }}
            dangerouslySetInnerHTML={{
              __html: v,
            }}
          />
        </svg>
        {b && w && (
          <span
            className={markerBarStyles.value}
            ref={d}
            style={{
              left: y,
            }}
          >
            {label && <b>{label}</b>}
            {sublabel && <i>{sublabel}</i>}
          </span>
        )}
      </span>
      {b && w && <span className={markerBarStyles.gutter} aria-hidden={true} />}
      {b && !w && (
        <span className={markerBarStyles.valueEnd}>
          {label && <b>{label}</b>}
          {sublabel && <i>{sublabel}</i>}
        </span>
      )}
    </span>
  );
}
export { MarkerBar };
