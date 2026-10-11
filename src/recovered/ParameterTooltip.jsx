// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import infoTipStyles from "../styles/InfoTip.classes.js";
function ParameterTooltip({ label, text }) {
  let [a, s] = React.useState(false),
    [l, o] = React.useState(false),
    r = React.useRef(null),
    n = React.useRef(null),
    i = React.useId();
  React.useEffect(() => {
    if (!a) return void o(false);
    let e = n.current;
    if (!e) return;
    let t = window.innerHeight;
    for (let a = e.parentElement; a; a = a.parentElement)
      if ("visible" !== getComputedStyle(a).overflow) {
        t = Math.min(t, a.getBoundingClientRect().bottom);
        break;
      }
    o(e.getBoundingClientRect().bottom > t);
  }, [a]);
  React.useEffect(() => {
    if (!a) return;
    let e = (e) => {
        "Escape" === e.key && s(false);
      },
      t = (e) => {
        r.current?.contains(e.target) || s(false);
      };
    document.addEventListener("keydown", e);
    document.addEventListener("pointerdown", t);
    return () => {
      document.removeEventListener("keydown", e);
      document.removeEventListener("pointerdown", t);
    };
  }, [a]);
  return (
    <span
      className={infoTipStyles.wrap}
      ref={r}
      onMouseEnter={() => s(true)}
      onMouseLeave={() => s(false)}
    >
      <button
        type={"button"}
        className={infoTipStyles.button}
        aria-label={`About ${label}`}
        aria-expanded={a}
        aria-describedby={a ? i : undefined}
        onFocus={() => s(true)}
        onBlur={() => s(false)}
        onClick={(e) => {
          e.stopPropagation();
          s(true);
        }}
      >
        <svg
          className={infoTipStyles.icon}
          width={"20"}
          height={"20"}
          viewBox={"0 0 20 20"}
          fill={"none"}
          aria-hidden={true}
        >
          <circle
            cx={"10"}
            cy={"10"}
            r={"7.25"}
            stroke={"currentColor"}
            strokeWidth={"1.2"}
          />
          <path
            d={"M10 9.25V13.5"}
            stroke={"currentColor"}
            strokeWidth={"1.2"}
            strokeLinecap={"round"}
          />
          <circle cx={"10"} cy={"6.6"} r={"0.8"} fill={"currentColor"} />
        </svg>
      </button>
      {a && (
        <span
          className={infoTipStyles.tip}
          id={i}
          role={"tooltip"}
          ref={n}
          data-above={l || undefined}
        >
          {text}
        </span>
      )}
    </span>
  );
}
export { ParameterTooltip };
