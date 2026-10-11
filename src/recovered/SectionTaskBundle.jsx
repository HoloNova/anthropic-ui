// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionTaskBundleStyles from "../styles/SectionTaskBundle.classes.js";
import { n2, n5, useTaskScrollProgress, n6, n3 } from "./TaskBundleStage.jsx";
import { TaskBundleStage } from "./TaskBundleStage-3.jsx";
let iD = [
  () => (
    <React.Fragment>
      <h2>{"The economy is made out of tasks"}</h2>
      <p>
        {
          "This model represents all the jobs people do in the economy as bundles of tasks. AI can help people do a given task better or faster. It can automate the task. It might not affect the task at all. And it can lead to new tasks."
        }
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"Think of a day in the life of a "}
        {e.job}
      </p>
      <p>
        {"You can think of any job as a bundle of tasks that someone does. "}
        {e.dayLine}
      </p>
      <p className={sectionTaskBundleStyles.footnote}>
        {
          "Each of the tasks listed are based on the US Department of Labor’s O*NET taxonomy, listing the tasks for each occupation."
        }
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>{"Jobs change over time"}</p>
      <p>
        {"Tasks leave the bundle ("}
        {e.goneLine}
        {") and new tasks arrive ("}
        {e.arrivedLine}
        {
          "). The bundle of tasks isn’t static, and the job changes as tasks change."
        }
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"Only humans can do some tasks"}
      </p>
      <p>
        {"For instance, "}
        {e.humanLine}
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"Some tasks will get augmented"}
      </p>
      <p>
        {"AI helps a human do them better, or faster. "}
        {e.augLine}
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"Some tasks may get fully automated"}
      </p>
      <p>
        {"For instance, "}
        {e.autoLine}
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"And new tasks will appear"}
      </p>
      <p>
        {
          "Historically, new technologies have also created new tasks for workers. "
        }
        {e.newLine}
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"The result: the "}
        {e.shortJob}
        {"’s job changes"}
      </p>
      <p>
        {"As the "}
        {e.shortJob}
        {" incorporates AI into "}
        {e.possessive}
        {" job, the "}
        {e.shortJob}
        {
          " is able to oversee and accomplish more. She can spend more time talking with patients and helping them understand diagnoses. Productivity increases."
        }
      </p>
    </React.Fragment>
  ),
  (e) => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"Every task happens millions of times every day, across the country"}
      </p>
      <p>
        {e.zoomLine}
        {" As more "}
        {e.jobPlural}
        {
          " use AI, AI supports a higher percentage of these millions of instances of each task."
        }
      </p>
    </React.Fragment>
  ),
  () => (
    <React.Fragment>
      <p className={sectionTaskBundleStyles.lead}>
        {"From tasks to the economy"}
      </p>
      <p>
        {
          "Today, if you add up every single instance of tasks performed in the US, by people and by the machines and software they work with, you get the US economy: over $30 trillion of value created over the past year. So how will AI shape the economy of the future?"
        }
      </p>
    </React.Fragment>
  ),
];
/* 滚动叙事：任务方块在自动化、增强与新任务之间过渡。 */
function SectionTaskBundle({ occupation, density, paper, className }) {
  let l,
    o = Object.hasOwn(n2, (l = occupation ?? n5) ?? "") ? n2[l] : n2[n5],
    { active: r, register: n } = useTaskScrollProgress(n6, 0.88),
    i = n3[r];
  return (
    <section
      className={
        className
          ? `${sectionTaskBundleStyles.section} ${className}`
          : sectionTaskBundleStyles.section
      }
    >
      <div className={sectionTaskBundleStyles.scrolly}>
        <div className={sectionTaskBundleStyles.sticky}>
          <div className={sectionTaskBundleStyles.stage}>
            <TaskBundleStage
              step={i.bundleStep}
              occupation={o}
              density={density}
              paper={paper}
            />
          </div>
        </div>
        <div className={sectionTaskBundleStyles.beats}>
          {iD.map((e, t) => (
            <div className={sectionTaskBundleStyles.beatSlot} key={t}>
              <div className={sectionTaskBundleStyles.card} ref={n(t)}>
                {e(o)}
              </div>
            </div>
          ))}
          <div
            className={sectionTaskBundleStyles.beatTail}
            aria-hidden={true}
          />
        </div>
      </div>
    </section>
  );
}
export { iD, SectionTaskBundle };
