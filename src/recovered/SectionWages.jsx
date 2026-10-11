// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionWagesStyles from "../styles/SectionWages.classes.js";
import { s1, SCENARIO_PRESETS, sR } from "./model-metrics.jsx";
import { getPresetScenario } from "./question-specs.jsx";
import {
  lc,
  ly,
  lf,
  l_,
  runUserScenario,
  lu,
  lg,
  lx,
} from "./model-series.jsx";
import { LineChart } from "./LineChart.jsx";
import { ChartKey } from "./ChartKey.jsx";
import { FindingHead } from "./FindingHead.jsx";
function SectionWages({ user, className }) {
  let a = React.useMemo(
      () =>
        (function (e) {
          let t = s1.map((e) => {
            let t = getPresetScenario(SCENARIO_PRESETS[e.key]);
            return {
              key: e.key,
              label: lc(e.label),
              color: e.color,
              ...ly(lf(t).wageGap),
              end: sR(t),
            };
          });
          if (!e) return t.sort((t, a) => l_(t.key, e) - l_(a.key, e));
          let a = runUserScenario(e);
          return [
            ...t,
            {
              key: "you",
              label: lu,
              color: "var(--foreground-primary)",
              ...ly(lf(a).wageGap),
              end: sR(a),
            },
          ].sort((t, a) => l_(t.key, e) - l_(a.key, e));
        })(user),
      [user],
    ),
    s = React.useMemo(() => {
      let e = a.flatMap((e) =>
        [...e.wages, ...e.cognitive, ...e.other].map((e) => e.v),
      );
      return {
        lo: Math.min(0, ...e),
        hi: Math.max(...e),
      };
    }, [a]),
    l = (
      <div className={sectionWagesStyles.figures}>
        <p className={sectionWagesStyles.rowTitle}>
          {"Pay by occupation group, percent above the same economy without AI"}
        </p>
        <div className={sectionWagesStyles.panels}>
          {a.map((e) => (
            <LineChart
              title={e.label}
              unit={"%"}
              height={200}
              domain={s}
              years={lg}
              note={lx(e.end)}
              frame={"you" === e.key ? 0.62 : 0.3}
              ticksInside={true}
              series={[
                {
                  key: "exposed",
                  points: e.cognitive,
                  color: "var(--ink-exposed)",
                },
                {
                  key: "other",
                  points: e.other,
                  color: "var(--ink-other)",
                },
                {
                  key: "all",
                  label: "Average",
                  points: e.wages,
                  color: "var(--ink-all)",
                },
              ]}
              key={e.key}
            />
          ))}
        </div>
        <div className={sectionWagesStyles.panelKey}>
          <ChartKey
            items={["exposed", "other", "all"]}
            labels={{
              all: "Average",
            }}
          />
        </div>
      </div>
    ),
    o = (
      <FindingHead
        eyebrow={"Finding 3: Wages"}
        title={
          "Across the three scenarios, average wages rise, but this increase is concentrated in occupations outside of knowledge work."
        }
      >
        {
          "That’s because it takes time for workers to switch to occupations where demand is rising. If there’s less demand for human knowledge work, that puts downward pressure on wages. Meanwhile, as AI increases productivity within knowledge work, the demand for manual work that benefits from that productivity will increase. For example, more quickly producing designs and permitting for physical infrastructure could increase the number of construction projects, resulting in rising demand for construction workers, which pushes those wages higher. In the substantial scenario, wages for knowledge workers are essentially flat. In the extreme scenario, they fall by more than 10% by 2030."
        }
      </FindingHead>
    );
  return (
    <React.Fragment>
      {o}
      <section
        className={`${sectionWagesStyles.section} ${sectionWagesStyles.static} ${className ?? ""}`}
      >
        {l}
      </section>
    </React.Fragment>
  );
}
export { SectionWages };
