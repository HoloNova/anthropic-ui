// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionThreeFuturesStyles from "../styles/SectionThreeFutures.classes.js";
import { la, sy, sg, SCENARIO_PRESETS, sW } from "./model-metrics.jsx";
import { getPresetScenario } from "./question-specs.jsx";
import { SCENARIO_PALETTES } from "./palette.jsx";
import { lk } from "./scroll-hooks.jsx";
import { makeMarkerStroke } from "./drawing-strokes.jsx";
import { DRY_FILTER_ID } from "./drawing-noise.jsx";
import { useTaskScrollProgress } from "./TaskBundleStage.jsx";
import { useNearViewport } from "./layout-hooks.jsx";
import { ThreeFuturesChart } from "./ThreeFuturesChart.jsx";
let d;
let de = {
  terminal: la(
    (d =
      2 +
      sy(sg(getPresetScenario(SCENARIO_PRESETS.fast)), 2030, (e) => e.lnY_act)),
  ),
  doubling: sW(d),
};
let dt = {
  modest: SCENARIO_PALETTES.slow[0],
  substantial: SCENARIO_PALETTES.central[0],
  extreme: SCENARIO_PALETTES.fast[0],
};
function ScenarioCaption({ text, tone }) {
  let a,
    s,
    [l, o] = ((s = lk((a = React.useRef(null)))), [a, s]),
    r =
      o.w > 12
        ? makeMarkerStroke(
            [
              [0, 7],
              [o.w + 12, 7],
            ],
            {
              width: 4,
              color: tone,
              seed: 61,
              opacity: 0.95,
              taperIn: 0,
              taperOut: 0,
              startWidth: 1,
              endWidth: 1,
              blend: false,
            },
          )
        : "";
  return (
    <span className={sectionThreeFuturesStyles.scenarioWord} ref={l}>
      {text}
      {r && (
        <span
          className={sectionThreeFuturesStyles.scenarioUnderline}
          aria-hidden={true}
        >
          <svg
            width={o.w + 12}
            height={16}
            viewBox={`0 0 ${o.w + 12} 16`}
            className={sectionThreeFuturesStyles.underlineSvg}
            aria-hidden={true}
          >
            <g
              filter={`url(#${DRY_FILTER_ID})`}
              style={{
                mixBlendMode: "multiply",
                isolation: "isolate",
              }}
              dangerouslySetInnerHTML={{
                __html: r,
              }}
            />
          </svg>
        </span>
      )}
    </span>
  );
}
function ScenarioLabel({ text, tone }) {
  return (
    <React.Fragment>
      {text.split(" ").map((e, a) => (
        <React.Fragment key={`${e}-${a}`}>
          {a > 0 && " "}
          <ScenarioCaption text={e} tone={tone} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
let dl = [
  <React.Fragment>
    <h2>
      {
        "There are many possible futures, but we’re highlighting three scenarios"
      }
    </h2>
    <p>
      {
        "The future will depend on how AI’s capabilities advance, and how industries and workers adopt those capabilities. The three scenarios we share capture distinct kinds of impact."
      }
    </p>
    <p>
      {"In the "}
      <ScenarioLabel text={"modest scenario"} tone={dt.modest} />
      {
        ", it’s hard to see the effect of AI in macroeconomic data: its economic impact is something like the internet’s. In the"
      }{" "}
      <ScenarioLabel text={"substantial scenario"} tone={dt.substantial} />
      {
        ", AI makes a bigger impact than the internet, or the railroad. And in the"
      }{" "}
      <ScenarioLabel text={"extreme scenario"} tone={dt.extreme} />
      {
        ", AI drives a completely transformed, unprecedented economy, likely driven by"
      }{" "}
      <a
        href={"https://www.anthropic.com/institute/recursive-self-improvement"}
        target={"_blank"}
        rel={"noopener noreferrer"}
      >
        {"recursively self-improving AI systems"}
      </a>{" "}
      {"and a faster rate of AI adoption."}
    </p>
  </React.Fragment>,
  <React.Fragment>
    <p className={sectionThreeFuturesStyles.lead}>{"Small economic gains"}</p>
    <p>
      {"In the "}
      <ScenarioLabel text={"modest scenario"} tone={dt.modest} />
      {
        ", AI has roughly the same kind of impact as the internet did. It drives real economic gains, but they’re within the historical norm for new technologies, and they arrive gradually."
      }
    </p>
  </React.Fragment>,
  <React.Fragment>
    <p className={sectionThreeFuturesStyles.lead}>
      {"A revolution in knowledge work"}
    </p>
    <p>
      {"In the "}
      <ScenarioLabel text={"substantial scenario"} tone={dt.substantial} />
      {
        ", AI is capable of doing half of all knowledge work by 2030, the majority of it autonomously, but it’s not adopted for all of that work: most knowledge work tasks are still done without AI. The economy grows at twice its normal rate. Wages for knowledge workers don’t rise, but other workers see gains."
      }
    </p>
  </React.Fragment>,
  <React.Fragment>
    <p className={sectionThreeFuturesStyles.lead}>
      {"A profound economic transformation"}
    </p>
    <p>
      {"In the "}
      <ScenarioLabel text={"extreme scenario"} tone={dt.extreme} />
      {
        ", AI is more productive than humans at the vast majority of knowledge-work tasks. It does nearly all of them autonomously, and it creates essentially no new knowledge tasks for people. This scenario would likely require recursively self-improving AI, adopted quickly for knowledge work."
      }
    </p>
    <p>
      {"As AI diffuses, annual GDP growth rates reach "}
      {Math.round(de.terminal)}
      {"% a year, leading the economy to double in size every "}
      {de.doubling}
      {
        " years. As a society, we’re far richer than we’ve ever been, but many fewer workers have jobs in knowledge work, and unemployment has risen beyond typical recessionary levels."
      }
    </p>
  </React.Fragment>,
];
function SectionThreeFutures({ user = null, intro = null, className }) {
  let s = React.useRef(null),
    { active: l, register: o } = useTaskScrollProgress(dl.length, 0.88),
    r = Math.min(dl.length - 1, Math.max(0, l)),
    n = useNearViewport(s);
  return (
    <section
      ref={s}
      className={
        className
          ? `${sectionThreeFuturesStyles.section} ${className}`
          : sectionThreeFuturesStyles.section
      }
    >
      {intro && <div className={sectionThreeFuturesStyles.intro}>{intro}</div>}
      <div className={sectionThreeFuturesStyles.scrolly}>
        <div className={sectionThreeFuturesStyles.sticky}>
          <div className={sectionThreeFuturesStyles.stage}>
            {n && <ThreeFuturesChart colorStage={r} user={user} />}
          </div>
        </div>
        <div className={sectionThreeFuturesStyles.beats}>
          {dl.map((e, t) => (
            <div className={sectionThreeFuturesStyles.beatSlot} key={t}>
              <div className={sectionThreeFuturesStyles.card} ref={o(t)}>
                {e}
              </div>
            </div>
          ))}
          <div className={sectionThreeFuturesStyles.beatTail} />
        </div>
      </div>
    </section>
  );
}
export { d, de, dt, ScenarioCaption, ScenarioLabel, dl, SectionThreeFutures };
