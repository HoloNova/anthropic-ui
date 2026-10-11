// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import scenarioFanChartStyles from "../styles/ScenarioFanChart.classes.js";
import { ar, an } from "./drawing-grid.jsx";
import { RULE_FILTER_ID } from "./drawing-noise.jsx";
function ScenarioPaper({ w, h, narrow = false }) {
  let s = narrow ? -52 : 52,
    l = narrow ? -52 : 52,
    o = React.useMemo(
      () =>
        (function (e, t, a, s, l = {}) {
          let o = "";
          for (let r of ar(e, t, a, s, l)) o += an(r, l);
          return o;
        })(s, l, w - 2 * s, h - 52 - l, {
          cell: 26,
          rag: 24,
          opacity: 0.3,
        }),
      [w, h, s, l],
    );
  return (
    <svg
      className={scenarioFanChartStyles.paper}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden={true}
    >
      <g
        filter={`url(#${RULE_FILTER_ID})`}
        dangerouslySetInnerHTML={{
          __html: o,
        }}
      />
    </svg>
  );
}
export { ScenarioPaper };
