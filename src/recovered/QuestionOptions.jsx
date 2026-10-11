// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionExplorerStyles from "../styles/SectionExplorer.classes.js";
import { useIsVisible } from "./layout-hooks.jsx";
import { TECHNICAL_REPORT_URL, EXTERNAL_LINK_PROPS } from "./viewport.jsx";
import { s1 } from "./model-metrics.jsx";
import { AdvancedParameters } from "./AdvancedParameters.jsx";
import { tF } from "./question-specs-2.jsx";
import { ParameterTooltip } from "./ParameterTooltip.jsx";
import { FractionLabel, QuestionSlider } from "./QuestionSlider.jsx";
import { tW } from "./question-specs.jsx";
function DialValueMarquee({ children }) {
  let t = React.useRef(null),
    a = React.useRef(null),
    [s, l] = React.useState(0);
  React.useEffect(() => {
    let e = t.current,
      s = a.current;
    if (!e || !s) return;
    let o = () => {
      let t = s.offsetWidth,
        a = t <= e.clientWidth + 0.5;
      l((e) => (a ? 0 : 1 > Math.abs(e - t) ? e : Math.ceil(t)));
    };
    o();
    let r = new ResizeObserver(o);
    r.observe(e);
    r.observe(s);
    return () => r.disconnect();
  }, []);
  let o = useIsVisible(t),
    r = s + 24;
  return (
    <p
      className={sectionExplorerStyles.dialVal}
      ref={t}
      data-over={s > 0 ? "" : undefined}
      data-still={o ? undefined : "true"}
      style={
        s > 0
          ? {
              "--dial-gap": "24px",
              "--dial-loop": `${r}px`,
              "--dial-dur": `${(r / 45).toFixed(2)}s`,
            }
          : undefined
      }
    >
      <span className={sectionExplorerStyles.dialValTrack}>
        <span className={sectionExplorerStyles.dialValCopy} ref={a}>
          {children}
        </span>
        {s > 0 && (
          <span
            className={sectionExplorerStyles.dialValCopy}
            aria-hidden={true}
          >
            {children}
          </span>
        )}
      </span>
    </p>
  );
}
function ExplorerChevron() {
  return (
    <svg
      className={sectionExplorerStyles.selectCaret}
      viewBox={"0 0 8 5"}
      width={8}
      height={5}
      aria-hidden={true}
    >
      <path
        d={
          "M7.3016 0.231808C7.44932 0.0678162 7.70306 0.0546398 7.86724 0.20212C8.03137 0.349888 8.04461 0.603568 7.89692 0.767766L4.29684 4.76791L4.23434 4.82417C4.16662 4.87328 4.08425 4.89995 3.99918 4.89995C3.88588 4.89989 3.77733 4.85213 3.70152 4.76791L0.10144 0.767766L0.0537825 0.702139C-0.040206 0.541753 -0.0124254 0.331356 0.131128 0.20212C0.274775 0.0728844 0.486972 0.0674593 0.636608 0.1779L0.696765 0.231808L3.99918 3.90148L7.3016 0.231808Z"
        }
        fill={"currentColor"}
      />
    </svg>
  );
}
function ExplorerControls({
  answers,
  onChange,
  preset,
  onPreset,
  advancedOpen,
  onAdvanced,
  inputs,
  onInputs,
  className,
}) {
  let [d, p] = React.useState(false),
    f = React.useRef(null);
  React.useEffect(() => {
    if (!d) return;
    let e = (e) => {
        f.current?.contains(e.target) || p(false);
      },
      t = (e) => {
        "Escape" === e.key && p(false);
      };
    document.addEventListener("pointerdown", e);
    document.addEventListener("keydown", t);
    return () => {
      document.removeEventListener("pointerdown", e);
      document.removeEventListener("keydown", t);
    };
  }, [d]);
  return (
    <div
      className={
        className
          ? `${sectionExplorerStyles.rail} ${className}`
          : sectionExplorerStyles.rail
      }
    >
      <div className={sectionExplorerStyles.heldRow}>
        <span
          className={sectionExplorerStyles.settingsLabel}
          id={"explorer-settings-label"}
        >
          {"Model settings"}
        </span>
        <button
          type={"button"}
          className={sectionExplorerStyles.advancedToggle}
          aria-expanded={advancedOpen}
          aria-controls={"explorer-advanced"}
          aria-describedby={"explorer-settings-label"}
          onClick={onAdvanced}
        >
          {advancedOpen ? "Simple" : "Advanced"}
        </button>
      </div>
      {advancedOpen && (
        <p className={sectionExplorerStyles.paperNote}>
          {"You can see the full economic model in our"}{" "}
          <a href={TECHNICAL_REPORT_URL} {...EXTERNAL_LINK_PROPS}>
            {"technical report"}
          </a>
          {"."}
        </p>
      )}
      <div className={sectionExplorerStyles.scenario} ref={f}>
        <p
          className={sectionExplorerStyles.dialName}
          id={"explorer-scenario-label"}
        >
          {"Scenario"}
        </p>
        <div className={sectionExplorerStyles.selectWrap}>
          <button
            type={"button"}
            className={sectionExplorerStyles.selectTrigger}
            aria-haspopup={"listbox"}
            aria-expanded={d}
            aria-labelledby={"explorer-scenario-label"}
            onClick={() => p((e) => !e)}
          >
            {preset
              ? (s1.find((e) => e.key === preset)?.label ?? "Custom")
              : "Custom"}
            <ExplorerChevron />
          </button>
          {d && (
            <ul
              className={sectionExplorerStyles.menu}
              role={"listbox"}
              aria-labelledby={"explorer-scenario-label"}
            >
              {s1.map((e) => (
                <li role={"presentation"} key={e.key}>
                  <button
                    type={"button"}
                    role={"option"}
                    aria-selected={preset === e.key}
                    className={
                      preset === e.key
                        ? `${sectionExplorerStyles.menuItem} ${sectionExplorerStyles.menuItemOn}`
                        : sectionExplorerStyles.menuItem
                    }
                    onClick={() => {
                      onPreset(e.key);
                      p(false);
                    }}
                    onKeyDown={(e) => {
                      if ("ArrowDown" !== e.key && "ArrowUp" !== e.key) return;
                      e.preventDefault();
                      let t = Array.from(
                          f.current?.querySelectorAll('[role="option"]') ?? [],
                        ),
                        a = t.indexOf(e.currentTarget),
                        s =
                          t[
                            (a + ("ArrowDown" === e.key ? 1 : t.length - 1)) %
                              t.length
                          ];
                      s?.focus();
                    }}
                  >
                    {e.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {advancedOpen ? (
        <div
          id={"explorer-advanced"}
          className={sectionExplorerStyles.advancedSlot}
        >
          <AdvancedParameters inputs={inputs} onInputs={onInputs} />
        </div>
      ) : (
        tF.map((a) => (
          <div className={sectionExplorerStyles.dial} key={a.id}>
            <div className={sectionExplorerStyles.dialHead}>
              <span className={sectionExplorerStyles.dialNameWrap}>
                <p className={sectionExplorerStyles.dialName}>{a.category}</p>
                <ParameterTooltip label={a.category} text={a.dialDesc} />
              </span>
              <DialValueMarquee>
                <FractionLabel
                  text={a.slider.formatValue(answers[a.slider.key])}
                />
              </DialValueMarquee>
            </div>
            <QuestionSlider
              spec={a.slider}
              value={answers[a.slider.key]}
              onChange={(s) =>
                onChange({
                  ...answers,
                  [a.slider.key]: s,
                })
              }
              label={a.category}
              today={tW(a.slider)}
              showReadout={false}
              dense={true}
            />
          </div>
        ))
      )}
    </div>
  );
}
function rU(e) {
  return Array.from(e.children).flatMap((e) =>
    "contents" === getComputedStyle(e).display ? rU(e) : [e],
  );
}
function useNarrowViewport() {
  let [e, t] = React.useState(false);
  React.useEffect(() => {
    let e = window.matchMedia("(max-width: 1100px)"),
      a = () => t(e.matches);
    a();
    e.addEventListener("change", a);
    return () => e.removeEventListener("change", a);
  }, []);
  return e;
}
function QuestionArrow({ dir }) {
  return (
    <svg
      className={sectionExplorerStyles.deckIcon}
      viewBox={"0 0 20 20"}
      fill={"none"}
      aria-hidden={true}
      focusable={"false"}
    >
      <path
        d={
          "left" === dir
            ? "M16.5 10H4.5M9 5.5L4.5 10L9 14.5"
            : "M3.5 10h12M11 5.5l4.5 4.5L11 14.5"
        }
        stroke={"currentColor"}
        strokeWidth={"1.6"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
    </svg>
  );
}
function TouchScrollTrack({ children, stretch = false }) {
  let a = useNarrowViewport(),
    s = React.useRef(null),
    l = React.useRef(null),
    [o, r] = React.useState(0),
    [n, i] = React.useState(0),
    d = a && n > 1 ? n / 2 : n,
    h = (e, t) => t.offsetLeft - (e.clientWidth - t.offsetWidth) / 2,
    m = React.useCallback(() => {
      let e = s.current;
      if (!e) return;
      let t = rU(e);
      i(t.length);
      let a = 0,
        l = 1 / 0;
      t.forEach((t, s) => {
        let o = Math.abs(h(e, t) - e.scrollLeft);
        o < l && ((l = o), (a = s));
      });
      r(a);
    }, []),
    p = React.useCallback(() => {
      let e = s.current;
      if (!e) return;
      let t = rU(e),
        l = a && t.length > 1 ? t.length / 2 : t.length;
      if (l < 1 || l === t.length) return;
      let o = 0,
        r = 1 / 0;
      t.forEach((t, a) => {
        let s = Math.abs(h(e, t) - e.scrollLeft);
        s < r && ((r = s), (o = a));
      });
      o >= l && ((e.scrollLeft -= t[l].offsetLeft - t[0].offsetLeft), m());
    }, [a, m]);
  React.useEffect(() => {
    m();
    let e = s.current;
    if (!e) return;
    let t = new ResizeObserver(m);
    t.observe(e);
    return () => {
      t.disconnect();
      l.current && clearTimeout(l.current);
    };
  }, [m, children, a]);
  let f = (e) => {
      let t = s.current;
      if (!t) return;
      let l = rU(t),
        r = a && l.length > 1 ? l.length / 2 : l.length,
        n = !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        i = o;
      -1 === e &&
        0 === o &&
        r < l.length &&
        ((t.scrollLeft += l[r].offsetLeft - l[0].offsetLeft), (i = r));
      let d = Math.max(0, Math.min(l.length - 1, i + e));
      t.scrollTo({
        left: l[d] ? h(t, l[d]) : 0,
        behavior: n ? "smooth" : "auto",
      });
    },
    g = (e) => String(e).padStart(2, "0"),
    x = a && d > 1 && d < n;
  return (
    <React.Fragment>
      <div
        className={
          stretch
            ? `${sectionExplorerStyles.deck} ${sectionExplorerStyles.deckStretch}`
            : sectionExplorerStyles.deck
        }
        ref={s}
        onScroll={() => {
          m();
          l.current && clearTimeout(l.current);
          l.current = setTimeout(p, 150);
        }}
      >
        {children}
        {a && (
          <div
            className={sectionExplorerStyles.deckLoop}
            inert={true}
            aria-hidden={true}
          >
            {children}
          </div>
        )}
      </div>
      {d > 1 && (
        <div className={sectionExplorerStyles.deckNav}>
          <button
            type={"button"}
            className={sectionExplorerStyles.deckBtn}
            onClick={() => f(-1)}
            disabled={!x && o <= 0}
            aria-label={"Previous chart"}
          >
            <QuestionArrow dir={"left"} />
          </button>
          <span
            className={sectionExplorerStyles.deckCount}
            aria-live={"polite"}
          >
            {g((o % d) + 1)}
            {"/"}
            {g(d)}
          </span>
          <button
            type={"button"}
            className={sectionExplorerStyles.deckBtn}
            onClick={() => f(1)}
            disabled={!x && o >= n - 1}
            aria-label={"Next chart"}
          >
            <QuestionArrow dir={"right"} />
          </button>
        </div>
      )}
    </React.Fragment>
  );
}
export {
  DialValueMarquee,
  ExplorerChevron,
  ExplorerControls,
  rU,
  useNarrowViewport,
  QuestionArrow,
  TouchScrollTrack,
};
