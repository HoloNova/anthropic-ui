// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionScenarioSquaresStyles from "../styles/SectionScenarioSquares.classes.js";
import { lm } from "./model-series.jsx";
import { useElementSize, GraphPaper } from "./layout-hooks.jsx";
import { FindingHead } from "./FindingHead.jsx";
import { ScenarioRows } from "./ScenarioSquareRow.jsx";
import { lz, ChartKey } from "./ChartKey.jsx";
function SectionScenarioSquares({ user, flushTop = false, className }) {
  let s = React.useMemo(
      () => [...lm(user)].sort((e, t) => e.gdp2030 - t.gdp2030),
      [user],
    ),
    l = React.useRef(null),
    o = useElementSize(l),
    r = Math.max(...s.map((e) => e.levelRatio));
  return (
    <React.Fragment>
      <FindingHead
        flushTop={flushTop}
        eyebrow={"Finding 1: GDP growth"}
        title={
          "AI grows the economy in every scenario, but some more than others"
        }
      >
        {
          "AI drives GDP growth in all scenarios, although the scale varies enormously depending on the scenario."
        }
      </FindingHead>
      <section
        className={
          className
            ? `${sectionScenarioSquaresStyles.section} ${className}`
            : sectionScenarioSquaresStyles.section
        }
      >
        <div className={sectionScenarioSquaresStyles.figures}>
          <GraphPaper className={sectionScenarioSquaresStyles.paper} />
          <p className={sectionScenarioSquaresStyles.chartTitle}>
            {"US GDP in 2030, by scenario (measured in trillions of dollars)*"}
          </p>
          <div
            className={sectionScenarioSquaresStyles.rows}
            ref={l}
            style={
              o.x || o.y
                ? {
                    transform: `translate(${o.x}px, ${o.y}px)`,
                  }
                : undefined
            }
          >
            {s.map((e, t) => (
              <ScenarioRows
                label={e.label}
                comp={lz(e.comp)}
                gainPct={e.gainPct}
                levelRatio={e.levelRatio}
                gdp2030={e.gdp2030}
                maxLevelRatio={r}
                blurb={e.blurb}
                isYou={e.isYou}
                seed={t + 1}
                key={e.key}
              />
            ))}
          </div>
        </div>
        <div className={sectionScenarioSquaresStyles.keyRow}>
          <ChartKey
            items={["augmented", "automated", "newWork"]}
            sizeNote={"Productivity"}
            className={sectionScenarioSquaresStyles.taskKey}
            title={"Task types"}
          />
        </div>
        <p className={sectionScenarioSquaresStyles.caption}>
          {"*GDP is calculated at 2025 price levels"}
        </p>
      </section>
    </React.Fragment>
  );
}
export { SectionScenarioSquares };
