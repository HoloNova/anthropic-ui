import * as React from "react";
import { ConceptText } from "./ConceptHint.jsx";

/* 图鉴页的统一控件。所有 demo 用它们暴露参数，样式只此一处。 */

function formatValue(value, format) {
  if (format) return format(value);
  if (typeof value !== "number") return String(value);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function Knob({ label, value, min = 0, max = 1, step = 0.01, onChange, hint, format }) {
  let id = React.useId();
  return (
    <div className="lab-knob">
      <label className="lab-knob__label" htmlFor={id}>
        <code>{label}</code>
      </label>
      <output className="lab-knob__value" htmlFor={id}>
        {formatValue(value, format)}
      </output>
      <input
        className="lab-knob__range"
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? <p className="lab-knob__hint"><ConceptText>{hint}</ConceptText></p> : null}
    </div>
  );
}

function Switch({ label, checked, onChange, hint }) {
  return (
    <div className="lab-knob" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
      <label className="lab-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>
          <code>{label}</code>
        </span>
      </label>
      {hint ? <p className="lab-knob__hint"><ConceptText>{hint}</ConceptText></p> : null}
    </div>
  );
}

function Seg({ label, value, options, onChange }) {
  return (
    <div className="lab-knob" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
      <span className="lab-knob__label">{label}</span>
      <span className="lab-seg" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            type="button"
            key={String(option.value)}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </span>
    </div>
  );
}

/* 参数状态：initial 只在首次渲染取值，避免父组件重渲染时被重置。 */
function useParams(initial) {
  let initialRef = React.useRef(initial);
  let [params, setParams] = React.useState(initialRef.current);
  let set = React.useCallback(
    (key, value) => setParams((current) => ({ ...current, [key]: value })),
    [],
  );
  let reset = React.useCallback(() => setParams(initialRef.current), []);
  return [params, set, reset];
}

/* 一段可分组摆放旋钮的列。 */
function KnobGroup({ legend, children }) {
  return (
    <div className="lab-knobs__group">
      {legend ? <span className="lab-knobs__legend">{legend}</span> : null}
      {children}
    </div>
  );
}

/* 只展开 Fragment，不拆开自定义组件。长参数表默认四个常用项，
   其余保留在同一实例的 details 中，折叠不丢失参数状态。 */
function flattenControls(children) {
  return React.Children.toArray(children).flatMap((child) =>
    React.isValidElement(child) && child.type === React.Fragment
      ? flattenControls(child.props.children)
      : [child],
  );
}

function ControlsPanel({ children }) {
  const items = flattenControls(children);
  const isControl = (child) => React.isValidElement(child) && [Knob, Switch, Seg].includes(child.type);
  const controls = items.filter(isControl);
  const compact = controls.length > 6;
  const primary = compact ? controls.slice(0, 4) : controls;
  const more = compact ? controls.slice(4) : [];
  const extras = items.filter((child) => !isControl(child));
  const hints = extras.filter((child) => React.isValidElement(child) && ["p", "dl"].includes(child.type));
  const actions = extras.filter((child) => !hints.includes(child));
  return (
    <div className="lab-controls">
      {actions.length ? <div className="lab-controls__actions">{actions}</div> : null}
      <div className="lab-controls__grid">{primary}</div>
      {more.length ? (
        <details className="lab-controls__more">
          <summary>更多参数 <span>{more.length}</span></summary>
          <div className="lab-controls__grid">{more}</div>
        </details>
      ) : null}
      {hints.length ? (
        <details className="lab-controls__more">
          <summary>参数说明</summary>
          <div className="lab-controls__hints">{hints.map((child) => child.type === "p"
              ? React.cloneElement(child, {}, <ConceptText>{child.props.children}</ConceptText>)
              : child)}</div>
        </details>
      ) : null}
    </div>
  );
}

export { Knob, Switch, Seg, useParams, KnobGroup, ControlsPanel };
