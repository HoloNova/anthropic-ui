// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionExplorerStyles from "../styles/SectionExplorer.classes.js";
import trendLinesStyles from "../styles/TrendLines.classes.js";
import { s3, sR, sC, sB, s1, SCENARIO_PRESETS, s4 } from "./model-metrics.jsx";
import {
  runUserScenario,
  lx,
  ld,
  lb,
  lp,
  lh,
  li,
  lg,
} from "./model-series.jsx";
import { tB, getPresetScenario } from "./question-specs.jsx";
import {
  useNarrowViewport,
  ExplorerControls,
  TouchScrollTrack,
} from "./QuestionOptions.jsx";
import { SCENARIO_PALETTES, CHART_THEME } from "./palette.jsx";
import { QuestionFigure } from "./QuestionFigure.jsx";
import { td } from "./scenario-presets.jsx";
import { GrowthBenchmark } from "./GrowthBenchmark.jsx";
import { LineChart, ChartGrid } from "./LineChart.jsx";
import { LaborShareChart } from "./LaborShareChart.jsx";
import { GrowthCounterfactual } from "./GrowthCounterfactual.jsx";
let rQ = [
  {
    key: "result",
    label: "Summary",
  },
  {
    key: "economy",
    label: "Economic growth",
  },
  {
    key: "labor",
    label: "Labor market",
  },
];
let rZ = (e) => ({
  capability: e.reach,
  adoption: e.adoption,
  alone: e.autonomy,
  gain: Math.exp(e.productivity),
  months: e.months ?? 3,
});
function ExplorerDisclosureIcon({ open }) {
  return (
    <svg
      width={"20"}
      height={"20"}
      viewBox={"0 0 20 20"}
      fill={"none"}
      aria-hidden={true}
      focusable={"false"}
    >
      {open ? (
        <path
          d={"M3.5 10h13"}
          stroke={"currentColor"}
          strokeWidth={"1.6"}
          strokeLinecap={"round"}
        />
      ) : (
        <path
          d={
            "M5.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm6 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm6 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          }
          fill={"currentColor"}
        />
      )}
    </svg>
  );
}
function ScenarioExplorer({ user, skipped, onRetake, onAnchor, className }) {
  let o,
    [r, n] = React.useState(() => rZ(user ?? s3.central)),
    [i, d] = React.useState(() => runUserScenario(tB(rZ(user ?? s3.central)))),
    h = React.useDeferredValue(i),
    m = React.useDeferredValue(r),
    [p, f] = React.useState(user ?? null),
    g = user ?? (skipped ? s3.central : null),
    x = g ? rQ : rQ.filter((e) => "result" !== e.key),
    [_, y] = React.useState(g ? "result" : "economy");
  g || "result" !== _ || y("economy");
  let [w, b] = React.useState(false),
    v = useNarrowViewport(),
    [k, M] = React.useState(false),
    j = React.useRef(null),
    S = React.useRef(0),
    [N, A] = React.useState(false),
    T = "result" !== _ || w,
    I = "result" === _ && g && !w ? "forecast" : T ? "rail" : null,
    $ = React.useRef(0),
    F = React.useRef(false);
  React.useEffect(() => {
    if (!v || !I) return;
    S.current = window.scrollY;
    F.current = false;
    M(false);
    let e = 0,
      t = () => {
        if (((e = 0), performance.now() < $.current)) return;
        let t = j.current;
        if (!t) return;
        let a = t.getBoundingClientRect().top;
        a <= 96
          ? window.scrollY > S.current + 24 &&
            (($.current = performance.now() + 500), M(true))
          : a > 168 &&
            !F.current &&
            ((S.current = window.scrollY),
            ($.current = performance.now() + 500),
            M(false));
      },
      a = () => {
        e || (e = requestAnimationFrame(t));
      };
    window.addEventListener("scroll", a, {
      passive: true,
    });
    return () => {
      cancelAnimationFrame(e);
      window.removeEventListener("scroll", a);
    };
  }, [v, I]);
  let W = React.useRef(null);
  React.useEffect(() => {
    if (!v || !I) return;
    let e = W.current,
      t = e?.firstElementChild;
    if (!e || !(t instanceof HTMLElement)) return;
    let a = new ResizeObserver(() => {
      e.style.setProperty("--rail-h", `${t.scrollHeight}px`);
    });
    a.observe(t);
    return () => a.disconnect();
  }, [v, I]);
  let C = (e) => {
    F.current = e;
    S.current = window.scrollY;
    $.current = performance.now() + 500;
    M(e);
  };
  user &&
    user !== p &&
    (f(user), n(rZ(user)), d(runUserScenario(tB(rZ(user)))));
  let B = React.useMemo(() => sR(h), [h]),
    E = lx(B),
    P =
      (o = React.useMemo(
        () => ("forecast" === I && g ? sR(runUserScenario(tB(rZ(g)))) : B),
        [I, g, B],
      )) < 2030
        ? `Your settings bring AI in about as fast as the model allows, and growth peaks in ${o}. What would follow (advances in robotics, faster R&D) is outside the model, so the charts stop there.`
        : undefined,
    [G, O] = React.useState(P);
  P && P !== G && O(P);
  let q = React.useMemo(() => ld(h, "your scenario", B), [h, B]),
    z = React.useMemo(() => lb(h, B), [h, B]),
    H = React.useMemo(
      () => ("economy" === _ || "labor" === _ ? lp(h) : null),
      [h, _],
    ),
    D = React.useMemo(
      () =>
        "economy" === _
          ? (function (e) {
              let { ai: t, base: a } = sC(e);
              return {
                ai: sB(t, sR(e)),
                base: a,
              };
            })(h)
          : null,
      [h, _],
    ),
    V = (function (e) {
      for (let t of s1) {
        let a = rZ(s3[t.key]);
        if (Object.keys(a).every((t) => 1e-6 > Math.abs(a[t] - e[t])))
          return t.key;
      }
      return null;
    })(r),
    Y = React.useMemo(
      () =>
        V &&
        JSON.stringify(i) ===
          JSON.stringify(getPresetScenario(SCENARIO_PRESETS[V]))
          ? V
          : null,
      [i, V],
    ),
    U = React.useMemo(
      () =>
        s1.map((e) => ({
          key: e.key,
          label: e.label,
          gdp: lh(e.key).gdp2030,
          ink: SCENARIO_PALETTES[e.key][0],
        })),
      [],
    ),
    K = React.useMemo(() => s4.map((e) => li(e).gdp2030), []),
    X = React.useMemo(() => ld(h).gdp2030, [h]),
    J = React.useMemo(() => (user ? li(user).gdp2030 : null), [user]);
  return (
    <section
      className={
        className
          ? `${sectionExplorerStyles.section} ${className}`
          : sectionExplorerStyles.section
      }
    >
      <div className={sectionExplorerStyles.layout}>
        <div
          ref={j}
          className={
            v
              ? `${sectionExplorerStyles.leftCol} ${sectionExplorerStyles.leftColSticky}`
              : sectionExplorerStyles.leftCol
          }
        >
          {I && (
            <div
              ref={W}
              className={
                v && k
                  ? `${sectionExplorerStyles.railClip} ${sectionExplorerStyles.railClipClosed}`
                  : sectionExplorerStyles.railClip
              }
            >
              <div inert={v && k}>
                {"forecast" === I ? (
                  <QuestionFigure
                    answers={rZ(g)}
                    preset={!user}
                    part={"forecast"}
                  />
                ) : (
                  <ExplorerControls
                    className={sectionExplorerStyles.railInset}
                    answers={r}
                    onChange={(e) => {
                      n(e);
                      d((t) => td(e, t));
                    }}
                    preset={Y}
                    onPreset={(e) => {
                      var t;
                      t = SCENARIO_PRESETS[e];
                      return void (n(rZ(s3[e])), d(getPresetScenario(t)));
                    }}
                    advancedOpen={N}
                    onAdvanced={() => {
                      onAnchor?.();
                      A((e) => !e);
                    }}
                    inputs={i}
                    onInputs={(e) => {
                      d(e);
                    }}
                  />
                )}
              </div>
              {v && k && (
                <button
                  type={"button"}
                  className={sectionExplorerStyles.railReveal}
                  aria-label={
                    "forecast" === I
                      ? "Show your forecast"
                      : "Show the controls"
                  }
                  onClick={() => C(false)}
                />
              )}
            </div>
          )}
          {v && I && (
            <button
              type={"button"}
              className={sectionExplorerStyles.railToggle}
              aria-label={
                "forecast" === I
                  ? k
                    ? "Show your forecast"
                    : "Hide your forecast"
                  : k
                    ? "Show the controls"
                    : "Hide the controls"
              }
              aria-expanded={!k}
              onClick={() => C(!k)}
            >
              <ExplorerDisclosureIcon open={!k} />
            </button>
          )}
          <div className={sectionExplorerStyles.lineFoot}>
            <div
              className={
                P
                  ? `${sectionExplorerStyles.whySlot} ${sectionExplorerStyles.whySlotOpen}`
                  : sectionExplorerStyles.whySlot
              }
              aria-hidden={!P}
            >
              <div className={sectionExplorerStyles.whyInner}>
                <p className={sectionExplorerStyles.cutWhy}>{P ?? G}</p>
              </div>
            </div>
            <div className={sectionExplorerStyles.lineOnly}>
              <GrowthBenchmark
                presets={U}
                cloud={K}
                you={X}
                committed={null !== J && Math.abs(J - X) > 0.05 ? J : null}
                owned={!!user}
                youInk={CHART_THEME.text}
              />
            </div>
            <div className={sectionExplorerStyles.lineActions}>
              {onRetake && (
                <button
                  type={"button"}
                  className={sectionExplorerStyles.retake}
                  onClick={onRetake}
                >
                  <svg
                    className={sectionExplorerStyles.retakeIcon}
                    viewBox={"0 0 20 20"}
                    fill={"none"}
                    aria-hidden={true}
                  >
                    <path
                      d={"M16.5 10H4.5M9 5.5L4.5 10L9 14.5"}
                      stroke={"currentColor"}
                      strokeWidth={"1.6"}
                      strokeLinecap={"round"}
                      strokeLinejoin={"round"}
                    />
                  </svg>
                  {user ? "Change predictions" : "Make your predictions"}
                </button>
              )}
              {"result" === _ && g && (
                <button
                  type={"button"}
                  className={sectionExplorerStyles.yours}
                  onClick={() => {
                    if (w && g) {
                      let e = rZ(g);
                      n(e);
                      d(runUserScenario(tB(e)));
                    }
                    onAnchor?.();
                    b((e) => !e);
                  }}
                >
                  {w
                    ? user
                      ? "Back to predictions"
                      : "Back to the scenario"
                    : "Explore other scenarios"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={sectionExplorerStyles.views}>
          <div
            className={sectionExplorerStyles.tabs}
            role={"tablist"}
            aria-label={"Output view"}
          >
            {x.map((e) => (
              <button
                type={"button"}
                role={"tab"}
                aria-selected={_ === e.key}
                className={
                  _ === e.key
                    ? `${sectionExplorerStyles.tab} ${sectionExplorerStyles.tabOn}`
                    : sectionExplorerStyles.tab
                }
                onClick={() => {
                  e.key !== _ && onAnchor?.();
                  y(e.key);
                }}
                key={e.key}
              >
                {e.label}
              </button>
            ))}
          </div>
          <TouchScrollTrack stretch={"labor" !== _} key={_}>
            {"result" === _ && g ? (
              <QuestionFigure
                answers={w ? m : rZ(g)}
                held={w ? h : undefined}
                preset={!user}
                part={"tiles"}
              />
            ) : "result" === _ ? (
              <p className={sectionExplorerStyles.portrait}>
                {
                  "[Placeholder.] YOUR 2030 VS EACH SCENARIO HERE — SEE THE DESIGN PROTO"
                }
              </p>
            ) : "economy" === _ && H && D ? (
              <div className={trendLinesStyles.grid}>
                <LineChart
                  title={"The size of the economy"}
                  years={lg}
                  end={B}
                  ease={true}
                  hover={true}
                  unit={"T"}
                  prefix={"$"}
                  height={186}
                  frame={0.62}
                  ticksInside={true}
                  note={[E, "All $ numbers are in 2025 prices"]}
                  keyItems={["withAi", "noAi"]}
                  series={[
                    {
                      key: "withAi",
                      points: H.gdp.ai,
                      color: "var(--color-slate-600, #5e5d59)",
                    },
                    {
                      key: "noAi",
                      points: H.gdp.base,
                      color: "var(--ink-no-ai, #87867f)",
                    },
                  ]}
                />
                <LaborShareChart
                  row={q}
                  flows={z}
                  layout={"grid"}
                  panels={["share"]}
                />
                <div
                  className={`${sectionExplorerStyles.ownPanel} ${sectionExplorerStyles.spanFull}`}
                >
                  <ChartGrid opacity={0.62} />
                  <p className={sectionExplorerStyles.ownPanelHead}>
                    {"Real GDP growth per year"}
                  </p>
                  <GrowthCounterfactual ai={D.ai} base={D.base} height={210} />
                  {E && (
                    <div className={trendLinesStyles.chartFoot}>
                      <p className={trendLinesStyles.note}>{E}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : "labor" === _ && H ? (
              <div className={trendLinesStyles.grid}>
                <LineChart
                  title={"Unemployment"}
                  years={lg}
                  end={B}
                  ease={true}
                  note={E}
                  hover={true}
                  unit={"%"}
                  zero={true}
                  height={186}
                  frame={0.62}
                  ticksInside={true}
                  keyItems={["exposed", "other", "all"]}
                  keyStacked={v}
                  series={[
                    {
                      key: "exposed",
                      points: H.unemployment.affected,
                      color: "var(--ink-exposed)",
                    },
                    {
                      key: "other",
                      points: H.unemployment.other,
                      color: "var(--ink-other)",
                    },
                    {
                      key: "all",
                      points: H.unemployment.all,
                      color: "var(--ink-all)",
                    },
                  ]}
                />
                <LineChart
                  title={"Wages"}
                  years={lg}
                  end={B}
                  ease={true}
                  note={E}
                  hover={true}
                  unit={"%"}
                  height={186}
                  frame={0.62}
                  ticksInside={true}
                  keyItems={["exposed", "other", "all"]}
                  keyLabels={{
                    all: "Average",
                  }}
                  keyStacked={v}
                  series={[
                    {
                      key: "exposed",
                      points: H.wageGap.cognitive,
                      color: "var(--ink-exposed, #c98500)",
                    },
                    {
                      key: "other",
                      points: H.wageGap.other,
                      color: "var(--ink-other, #6a9bcc)",
                    },
                    {
                      key: "all",
                      label: "Average",
                      points: H.wageGap.wages,
                      color: "var(--ink-all, #73726c)",
                    },
                  ]}
                />
                <div className={sectionExplorerStyles.spanFull}>
                  <LaborShareChart
                    row={q}
                    flows={z}
                    layout={"grid"}
                    panels={["flow"]}
                    flowHeight={v ? 430 : 400}
                  />
                </div>
              </div>
            ) : (
              <LaborShareChart
                row={q}
                flows={z}
                layout={"grid"}
                arrangement={"share-first"}
              />
            )}
          </TouchScrollTrack>
        </div>
      </div>
    </section>
  );
}
export { rQ, rZ, ExplorerDisclosureIcon, ScenarioExplorer };
