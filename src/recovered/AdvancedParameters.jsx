// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import advancedControlsStyles from "../styles/AdvancedControls.classes.js";
import * as React from "react";
import { QuestionSlider } from "./QuestionSlider.jsx";
import { ParameterTooltip } from "./ParameterTooltip.jsx";
import { eS, eN, eL } from "./scenario-presets.jsx";
function ParameterInput({ spec, value, onChange }) {
  return (
    <div className={advancedControlsStyles.row} title={spec.tip}>
      <span className={advancedControlsStyles.rowHead}>
        <span className={advancedControlsStyles.rowLabel}>{spec.label}</span>
        <span className={advancedControlsStyles.rowValue}>
          {value.toFixed(spec.digits)}
        </span>
      </span>
      <QuestionSlider
        spec={{
          min: spec.min,
          max: spec.max,
          step: spec.step,
        }}
        value={value}
        onChange={onChange}
        label={spec.label}
        showReadout={false}
        dense={true}
      />
    </div>
  );
}
function ParameterGroup({ id, title, note, open, onToggle, children }) {
  let r = `adv-${id}-title`;
  return (
    <div className={advancedControlsStyles.group} data-open={open}>
      <div className={advancedControlsStyles.groupHead}>
        <button
          type={"button"}
          className={advancedControlsStyles.groupToggle}
          aria-expanded={open}
          aria-controls={`adv-${id}`}
          aria-labelledby={r}
          onClick={onToggle}
        />
        <span className={advancedControlsStyles.groupTitleWrap}>
          <span className={advancedControlsStyles.groupTitle} id={r}>
            {title}
          </span>
          {note && <ParameterTooltip label={title} text={note} />}
        </span>
        <svg
          className={advancedControlsStyles.chevron}
          width={"12"}
          height={"12"}
          viewBox={"0 0 12 12"}
          aria-hidden={true}
        >
          <path
            d={"M2.5 4.5 L6 8 L9.5 4.5"}
            fill={"none"}
            stroke={"currentColor"}
            strokeWidth={"1.5"}
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
          />
        </svg>
      </div>
      <div className={advancedControlsStyles.reveal}>
        <div id={`adv-${id}`} className={advancedControlsStyles.groupBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
function AdvancedParameters({ inputs, onInputs }) {
  let [a, s] = React.useState(""),
    l = (e) => s((t) => (t === e ? "" : e)),
    o = (s) => {
      let o = (function (e, t) {
        let [a, s] = t.split(".");
        return e[a][s];
      })(inputs, s.id);
      return (
        <ParameterGroup
          id={s.id}
          title={s.title}
          note={s.note}
          open={a === s.id}
          onToggle={() => l(s.id)}
          key={s.id}
        >
          {s.sliders.map((a) => (
            <ParameterInput
              spec={a}
              value={o[a.key]}
              onChange={(l) =>
                onInputs(
                  (function (e, t, a, s) {
                    let [l, o] = t.split("."),
                      r = structuredClone(e);
                    r[l][o][a] = s;
                    return r;
                  })(inputs, s.id, a.key, l),
                )
              }
              key={a.key}
            />
          ))}
        </ParameterGroup>
      );
    },
    r = inputs.labor;
  return (
    <div className={advancedControlsStyles.panel}>
      <h4 className={advancedControlsStyles.section}>{"Production"}</h4>
      {eS.filter((e) => "production" === e.section).map(o)}
      <ParameterGroup
        id={"production.scalars"}
        title={"Capital supply and task substitution"}
        note={
          "How easily capital is added when AI raises its return, and how easily the economy shifts between tasks."
        }
        open={"production.scalars" === a}
        onToggle={() => l("production.scalars")}
      >
        {eN
          .filter((e) => "production" === e.section)
          .map((a) => (
            <ParameterInput
              spec={a}
              value={inputs.production[a.key]}
              onChange={(s) => onInputs(eL(inputs, a.id, s))}
              key={a.id}
            />
          ))}
      </ParameterGroup>
      <h4 className={advancedControlsStyles.section}>{"Labor"}</h4>
      {eS.filter((e) => "labor" === e.section).map(o)}
      <ParameterGroup
        id={"labor.scalars"}
        title={"Finding new work"}
        note={
          "How much new work appears, how open the way into the other group is, how fast employers shed surplus workers, and what normal times look like."
        }
        open={"labor.scalars" === a}
        onToggle={() => l("labor.scalars")}
      >
        {eN
          .filter((e) => "labor" === e.section)
          .map((a) => (
            <ParameterInput
              spec={a}
              value={r[a.key]}
              onChange={(s) => onInputs(eL(inputs, a.id, s))}
              key={a.id}
            />
          ))}
      </ParameterGroup>
    </div>
  );
}
export { ParameterInput, ParameterGroup, AdvancedParameters };
