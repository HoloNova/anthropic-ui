// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionUnemploymentStyles from "../styles/SectionUnemployment.classes.js";
import { s1, SCENARIO_PRESETS, sR } from "./model-metrics.jsx";
import { lc, lf, l_, runUserScenario, lu, lg, lx } from "./model-series.jsx";
import { getPresetScenario } from "./question-specs.jsx";
import { FindingHead } from "./FindingHead.jsx";
import { LineChart } from "./LineChart.jsx";
import { ChartKey } from "./ChartKey.jsx";
function SectionUnemployment({ user, headless = false }) {
  let a = React.useMemo(
      () =>
        (function (e) {
          let t = s1.map((e) => ({
            key: e.key,
            label: lc(e.label),
            color: e.color,
            series: lf(getPresetScenario(SCENARIO_PRESETS[e.key])).unemployment,
            end: sR(getPresetScenario(SCENARIO_PRESETS[e.key])),
          }));
          if (!e) return t.sort((t, a) => l_(t.key, e) - l_(a.key, e));
          let a = runUserScenario(e);
          return [
            ...t,
            {
              key: "you",
              label: lu,
              color: "var(--foreground-primary)",
              series: lf(a).unemployment,
              end: sR(a),
            },
          ].sort((t, a) => l_(t.key, e) - l_(a.key, e));
        })(user),
      [user],
    ),
    s = React.useMemo(
      () => ({
        lo: 0,
        hi: Math.max(
          ...a
            .flatMap((e) => [
              ...e.series.affected,
              ...e.series.other,
              ...e.series.all,
            ])
            .map((e) => e.v),
        ),
      }),
      [a],
    );
  return (
    <React.Fragment>
      {!headless && (
        <FindingHead
          eyebrow={"Finding 2: Unemployment"}
          title={"So what does the shortfall look like?"}
        >
          {
            "This kind of occupational switch is difficult for a few reasons: workers aren’t happy to change occupations, and they face search frictions when they’re looking for a new job. The higher the rate of automation, the more reallocation is required in the economy, and the higher the unemployment driven by this kind of occupational mismatch. We see high churn and difficulty finding new roles in the extreme scenario, as large swathes of cognitive work are automated."
          }
        </FindingHead>
      )}
      <section className={sectionUnemploymentStyles.section}>
        <div className={sectionUnemploymentStyles.inner}>
          <div className={sectionUnemploymentStyles.panelSheet}>
            <div className={sectionUnemploymentStyles.rowHead}>
              <p className={sectionUnemploymentStyles.rowTitle}>
                {
                  "Unemployment in knowledge work rises; in other occupations, it falls"
                }
              </p>
            </div>
            <div className={sectionUnemploymentStyles.panels}>
              {a.map((e) => (
                <LineChart
                  title={e.label}
                  unit={"%"}
                  zero={true}
                  domain={s}
                  years={lg}
                  note={lx(e.end)}
                  height={190}
                  frame={"you" === e.key ? 0.62 : 0.3}
                  ticksInside={true}
                  series={[
                    {
                      key: "exposed",
                      points: e.series.affected,
                      color: "var(--ink-exposed)",
                    },
                    {
                      key: "other",
                      points: e.series.other,
                      color: "var(--ink-other)",
                    },
                    {
                      key: "all",
                      points: e.series.all,
                      color: "var(--ink-all)",
                    },
                  ]}
                  key={e.key}
                />
              ))}
            </div>
            <div className={sectionUnemploymentStyles.panelKey}>
              <ChartKey items={["exposed", "other", "all"]} />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
export { SectionUnemployment };
