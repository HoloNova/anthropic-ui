// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionBeliefsStyles from "../styles/SectionBeliefs.classes.js";
import { GraphPaper } from "./layout-hooks.jsx";
import { BeliefSwarm } from "./BeliefSwarm.jsx";
function SectionBeliefs({ answers, survey, className }) {
  return (
    <React.Fragment>
      <div className={sectionBeliefsStyles.headBlock}>
        <div className={sectionBeliefsStyles.head}>
          <h2 className={sectionBeliefsStyles.title}>
            {"People’s expectations about future AI capabilities vary."}
          </h2>
          <p className={sectionBeliefsStyles.standfirst}>
            {
              "In August, we surveyed more than 10,000 Americans about their views on present and future AI capabilities, adoption, and the ease of finding new work if they have to change occupations."
            }
          </p>
          <p className={sectionBeliefsStyles.standfirst}>
            {
              "The typical respondent’s answers imply outcomes close to the “substantial change” scenario: GDP is 10% higher by 2030 than it would be without AI, and the overall unemployment rate has risen to around 5%. Around 10% of respondents have views in line with the extreme scenario."
            }
          </p>
        </div>
      </div>
      <section
        className={
          className
            ? `${sectionBeliefsStyles.section} ${className}`
            : sectionBeliefsStyles.section
        }
      >
        <div className={sectionBeliefsStyles.figure}>
          <GraphPaper className={sectionBeliefsStyles.paper} />
          <div className={sectionBeliefsStyles.figureInner}>
            <BeliefSwarm answers={answers} survey={survey} />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}
let EXPLORER_ANCHOR_ID = "econ-scenarios-explorer";
function DownArrow() {
  return (
    <svg width={14} height={14} viewBox={"0 0 14 14"} aria-hidden={true}>
      <path
        d={"M7 2v10M3 8l4 4 4-4"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"1.3"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
    </svg>
  );
}
function ExternalArrow() {
  return (
    <svg width={14} height={14} viewBox={"0 0 14 14"} aria-hidden={true}>
      <path
        d={"M4 10 10 4M5 4h5v5"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"1.3"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
    </svg>
  );
}
export { SectionBeliefs, EXPLORER_ANCHOR_ID, DownArrow, ExternalArrow };
