// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import dialSliderStyles from "../styles/DialSlider.classes.js";
import * as React from "react";
import { tx } from "./question-specs.jsx";
function FractionLabel({ text }) {
  let t = text.match(/^(\d[\d,.]*%?)\s+of\s+(\d[\d,.]*%?)$/);
  return t ? (
    <span className={dialSliderStyles.frac} aria-label={text}>
      <span aria-hidden={true}>{t[1]}</span>
      <span className={dialSliderStyles.fracSlash} aria-hidden={true} />
      <span aria-hidden={true}>{t[2]}</span>
    </span>
  ) : (
    <React.Fragment>{text}</React.Fragment>
  );
}
let ow = (e) => Math.max(0, Math.min(1, e));
let ob = (e) => ({
  "--f": e,
});
function QuestionSlider({
  spec,
  value,
  onChange,
  label,
  today = null,
  showReadout = true,
  dense = false,
}) {
  let n = spec.stops,
    i = n ? 0 : spec.min,
    d = n ? n.length - 1 : spec.max,
    u = n ? 1 : spec.step,
    h = n ? tx(n, value) : value,
    m = d - i,
    p = m > 0 ? (h - i) / m : 0,
    f = null == today ? null : n ? tx(n, today) : today,
    g = null != f && m > 0 ? ow((f - i) / m) : null,
    x = null != g && Math.abs(p - g) > 0.002;
  return (
    <div
      className={
        dense
          ? `${dialSliderStyles.slider} ${dialSliderStyles.dense}`
          : dialSliderStyles.slider
      }
    >
      {showReadout && spec.formatValue && (
        <p className={dialSliderStyles.readout}>
          {dense ? (
            <FractionLabel
              text={(spec.formatStat ?? spec.formatValue)(value)}
            />
          ) : (
            <React.Fragment>
              <FractionLabel text={spec.formatValue(value)} />{" "}
              {spec.formatLabel?.(value)}
            </React.Fragment>
          )}
        </p>
      )}
      <div className={dialSliderStyles.pill}>
        <div className={dialSliderStyles.track} style={ob(ow(p))}>
          <input
            type={"range"}
            className={dialSliderStyles.input}
            min={i}
            max={d}
            step={u}
            value={h}
            aria-label={label}
            aria-valuetext={n ? n[tx(n, value)]?.label : undefined}
            onChange={(e) => {
              let s = Number(e.target.value);
              onChange(n ? (n[s]?.v ?? value) : s);
            }}
          />
          <span className={dialSliderStyles.rail} aria-hidden={true} />
          {n &&
            n.length > 1 &&
            n.map((e, t) => (
              <span
                className={dialSliderStyles.tick}
                style={ob(t / (n.length - 1))}
                aria-hidden={true}
                key={e.label}
              />
            ))}
          <span className={dialSliderStyles.fill} aria-hidden={true} />
          {x && (
            <span
              className={dialSliderStyles.notch}
              style={ob(g)}
              aria-hidden={true}
            />
          )}
          <span className={dialSliderStyles.thumb} aria-hidden={true} />
          {null != g && (
            <span className={dialSliderStyles.tooltip} style={ob(g)}>
              {"Today"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
let ok = {
  drawn: false,
  settled: false,
};
export { FractionLabel, ow, ob, QuestionSlider, ok };
