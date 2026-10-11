// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import sectionQuizStyles from "../styles/SectionQuiz.classes.js";
import * as featureFlags from "../runtime/feature-flags.jsx";
import * as React from "react";
import { tR, tF } from "./question-specs-2.jsx";
import { n0, nZ } from "./SectionQuiz-2.jsx";
import { useReducedMotion, subscribeViewportHeight } from "./viewport.jsx";
import { tC, tg, tx, eQ, e4, tB, tW } from "./question-specs.jsx";
import { EXPLORER_ANCHOR_ID } from "./SectionBeliefs.jsx";
import { ScenarioExplorer } from "./QuestionCard.jsx";
import { SurveyPrivacy, ox } from "./SurveyPrivacy.jsx";
import {
  submitSurvey,
  SURVEY_ENDPOINTS,
  prepareSurveySubmission,
} from "./survey-client.jsx";
import { AdjustmentGrid } from "./CapabilityGrid.jsx";
import { CapabilityGrid } from "./CapabilityGrid-2.jsx";
import { QuestionSlider } from "./QuestionSlider.jsx";
import { useNearViewport } from "./layout-hooks.jsx";
import { QuizGrid } from "./QuizGrid.jsx";
let t;
let nV = "data-header-scroll-hold";
let nY = false;
let nU = () => {
  window.clearTimeout(t);
  t = window.setTimeout(() => {
    document.documentElement.removeAttribute(nV);
    window.removeEventListener("scroll", nU);
    nY = false;
  }, 160);
};
function holdSiteHeader() {
  document.documentElement.setAttribute(nV, "");
  nY ||
    (window.addEventListener("scroll", nU, {
      passive: true,
    }),
    (nY = true));
  nU();
}
function QuizArrow({ dir }) {
  return (
    <svg
      className={sectionQuizStyles.icon}
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
/* 问卷驱动自定义情景；完成后把模型输入和答案传回页面，更新下方图表。 */
function SectionQuiz({ onComplete, onSkip, className }) {
  let s = featureFlags.useFeatureEnabled("econSurveyIntake"),
    l = React.useRef(false),
    o = React.useRef(null),
    [r, n] = React.useState(tR),
    [i, d] = React.useState(0),
    [h, m] = React.useState(false),
    [p, f] = React.useState(false),
    [g, x] = React.useState(null),
    [_, y] = React.useState(() => new Set()),
    v = tF[i],
    k = i === tF.length - 1,
    M = (function () {
      let [e, t] = React.useState(false);
      React.useEffect(() => {
        let e = window.matchMedia(`(max-width: ${n0}px)`),
          a = () => t(e.matches);
        a();
        e.addEventListener("change", a);
        return () => e.removeEventListener("change", a);
      }, []);
      return e;
    })(),
    j = React.useRef(null),
    S = p && null === g,
    N = useReducedMotion(),
    A = () => {
      let e = j.current;
      e &&
        (holdSiteHeader(),
        window.scrollTo({
          top: window.scrollY + e.getBoundingClientRect().top,
          behavior: N ? "instant" : "smooth",
        }));
    };
  React.useEffect(() => {
    let e;
    if (!h && !p) return;
    let t = j.current;
    if (!t) return;
    let a = false,
      s = new IntersectionObserver(([e]) => {
        a = e.isIntersecting;
      });
    s.observe(t);
    let l = () => {
        window.clearTimeout(e);
        e = window.setTimeout(() => {
          a &&
            (holdSiteHeader(),
            window.scrollTo({
              top: window.scrollY + t.getBoundingClientRect().top,
              behavior: "instant",
            }));
        }, 150);
      },
      o = subscribeViewportHeight(l),
      r = window.innerWidth,
      n = () => {
        window.innerWidth !== r && ((r = window.innerWidth), l());
      };
    window.addEventListener("resize", n);
    return () => {
      s.disconnect();
      window.clearTimeout(e);
      window.removeEventListener("resize", n);
      o();
    };
  }, [h, p]);
  React.useEffect(() => {
    if (!S) return;
    let e = j.current;
    if (!e) return;
    let t = new IntersectionObserver(([e]) => {
      e.isIntersecting || (m(false), f(false), d(0));
    });
    t.observe(e);
    return () => t.disconnect();
  }, [S]);
  let T = (e) => {
      n(e);
      y((e) => (e.has(v.id) ? e : new Set(e).add(v.id)));
    },
    L = _.has(v.id)
      ? ((e, t) => {
          let a = e.primaryValue ? e.primaryValue(t) : t[e.slider.key],
            s = null;
          for (let t of e.items) tC(t, a) && (s = t);
          return s;
        })(v, r)
      : null,
    I = L
      ? {
          text: L.text,
        }
      : null,
    $ = M
      ? undefined
      : (e) => {
          let t = (e) => Math.max(0, Math.min(1, e));
          switch (v.illo) {
            case "capable":
              T({
                ...r,
                capability: t(e),
              });
              break;
            case "doing":
              T({
                ...r,
                adoption: t(e),
              });
              break;
            case "split":
              if (r.adoption > 0) {
                let a = t(e / r.adoption);
                T({
                  ...r,
                  alone: tg[tx(tg, a)].v,
                });
              }
              break;
            case "pace": {
              let a = Math.round(t(e) * (eQ.length - 1));
              T({
                ...r,
                gain: eQ[a].v,
              });
              break;
            }
            case "months": {
              let a = Math.round(t(1 - e) * (e4.length - 1));
              T({
                ...r,
                months: e4[a].v,
              });
            }
          }
        },
    F = [sectionQuizStyles.section, h && sectionQuizStyles.bounded, className]
      .filter(Boolean)
      .join(" ");
  return (
    <div className={sectionQuizStyles.cover}>
      <div className={sectionQuizStyles.coverFeather} aria-hidden={true} />
      <section ref={j} id={EXPLORER_ANCHOR_ID} className={F}>
        <div className={sectionQuizStyles.stage}>
          {h ? (
            p ? (
              <ScenarioExplorer
                user={g}
                skipped={null === g}
                onAnchor={A}
                className={sectionQuizStyles.explorerInStage}
                onRetake={() => {
                  A();
                  m(false);
                  f(false);
                  d(0);
                }}
              />
            ) : (
              <div className={sectionQuizStyles.grid}>
                <div className={sectionQuizStyles.column}>
                  <div className={sectionQuizStyles.head}>
                    <p className={sectionQuizStyles.eyebrow}>
                      <span className={sectionQuizStyles.category}>
                        {v.category}
                      </span>
                      <span className={sectionQuizStyles.count}>
                        {i + 1}
                        {"/"}
                        {tF.length}
                      </span>
                    </p>
                    <h2 className={sectionQuizStyles.prompt}>
                      {v.askFor ? v.askFor(r) : v.ask}
                    </h2>
                    <p className={sectionQuizStyles.context}>{v.context}</p>
                  </div>
                  <div className={sectionQuizStyles.controlSlot}>
                    <QuizQuestion
                      question={v}
                      answers={r}
                      onAnswer={(e, t) =>
                        T({
                          ...r,
                          [e]: t,
                        })
                      }
                    />
                  </div>
                  <div className={sectionQuizStyles.consentActions}>
                    {k && <SurveyPrivacy collapsible={true} />}
                    <div className={sectionQuizStyles.actions}>
                      <button
                        type={"button"}
                        className={sectionQuizStyles.tertiary}
                        onClick={() => {
                          A();
                          i > 0 ? d(i - 1) : m(false);
                        }}
                      >
                        <QuizArrow dir={"left"} />
                        {"Back"}
                      </button>
                      <button
                        type={"button"}
                        className={sectionQuizStyles.next}
                        onClick={() => {
                          if ((A(), !k)) return void d(i + 1);
                          (f(true), x(tB(r)), s && o.current && !l.current) &&
                            ((l.current = true),
                            submitSurvey(
                              SURVEY_ENDPOINTS.econSurvey,
                              o.current,
                              {
                                v: 1,
                                capability: ox(r.capability),
                                adoption: ox(r.adoption),
                                autonomy: tx(tg, r.alone) + 1,
                                productivity: tx(eQ, r.gain) + 1,
                                adjustment: tx(e4, r.months) + 1,
                              },
                            ));
                          onComplete?.(tB(r), r);
                        }}
                      >
                        {k ? "Model my 2030" : "Next"}
                        <QuizArrow dir={"right"} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={sectionQuizStyles.artColumn}>
                  {"months" === v.illo ? (
                    <AdjustmentGrid
                      months={r.months}
                      annotation={I}
                      onPaint={$}
                    />
                  ) : v.illo ? (
                    <CapabilityGrid
                      stage={v.illo}
                      capability={r.capability}
                      adoption={r.adoption}
                      alone={r.alone}
                      gain={r.gain}
                      annotation={I}
                      annotationRule={"pace" !== v.illo}
                      onPaint={$}
                    />
                  ) : null}
                </div>
              </div>
            )
          ) : (
            <QuizIntro
              onStart={() => {
                !s ||
                  l.current ||
                  o.current ||
                  (o.current = prepareSurveySubmission(
                    SURVEY_ENDPOINTS.econSurvey,
                  ));
                A();
                m(true);
              }}
              onSkip={() => {
                A();
                m(true);
                f(true);
                x(null);
                onSkip?.();
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
function QuizQuestion({ question, answers, onAnswer }) {
  let s = question.slider;
  return (
    <QuestionSlider
      spec={s}
      value={answers[s.key]}
      onChange={(e) => onAnswer(s.key, e)}
      label={question.category}
      today={tW(s)}
    />
  );
}
function QuizIntro({ onStart, onSkip }) {
  let a = React.useRef(null),
    s = useNearViewport(a),
    l = React.useRef(null),
    o = React.useRef(null),
    r = React.useRef(null),
    [n, i] = React.useState({
      width: 0,
      height: 0,
      clear: [],
    });
  React.useEffect(() => {
    let e = a.current,
      t = [
        {
          el: l.current,
          fixed: nZ,
        },
        {
          el: o.current,
          fixed: null,
        },
        {
          el: r.current,
          fixed: null,
        },
      ];
    if (!e || t.some((e) => !e.el)) return;
    let s = () => {
      let a = e.getBoundingClientRect(),
        s = a.width - 104 >= nZ.width;
      i({
        width: Math.round(a.width),
        height: Math.round(a.height),
        clear: t.map(({ el, fixed }) => {
          let l = s ? fixed : null,
            o = el.getBoundingClientRect();
          if (l) {
            let e = o.left + o.width / 2 - a.left,
              t = o.top + o.height / 2 - a.top,
              s = Math.min(l.width, a.width - 104),
              r = Math.min(l.height, a.height - 104);
            return {
              left: Math.round(e - s / 2),
              top: Math.round(t - r / 2),
              right: Math.round(e + s / 2),
              bottom: Math.round(t + r / 2),
            };
          }
          let r = ((e, t) => {
            let a = getComputedStyle(e),
              s = parseFloat(a.fontSize),
              l = parseFloat(a.lineHeight);
            if (!Number.isFinite(s) || !Number.isFinite(l))
              return {
                top: t.top,
                bottom: t.bottom,
              };
            let o = Math.max(0, (l - 0.72 * s) / 2);
            return {
              top: t.top + o,
              bottom: t.bottom - o,
            };
          })(el, o);
          return {
            left: Math.round(o.left - a.left),
            top: Math.round(r.top - a.top),
            right: Math.round(o.right - a.left),
            bottom: Math.round(r.bottom - a.top),
          };
        }),
      });
    };
    s();
    let n = new ResizeObserver(s);
    n.observe(e);
    t.forEach(({ el }) => n.observe(el));
    document.fonts?.ready.then(s).catch(() => {});
    return () => n.disconnect();
  }, []);
  return (
    <div ref={a} className={sectionQuizStyles.introStage}>
      {s && (
        <QuizGrid
          width={n.width}
          height={n.height}
          clear={n.clear}
          compact={n.width > 0 && n.width <= n0}
        />
      )}
      <div className={sectionQuizStyles.centred}>
        <h2 ref={l} className={sectionQuizStyles.title}>
          {"How might powerful AI change the economy?"}
        </h2>
        <p ref={o} className={sectionQuizStyles.standfirst}>
          {
            "How do you think AI development will go over the next few years? And what would that path mean for the economy? We invite you to consider these questions, and explore potential answers with our scenario explorer."
          }
        </p>
        <div ref={r} className={sectionQuizStyles.actions}>
          <button
            type={"button"}
            className={sectionQuizStyles.primary}
            onClick={onStart}
          >
            {"Make your predictions"}
          </button>
          <button
            type={"button"}
            className={sectionQuizStyles.skip}
            onClick={onSkip}
          >
            {"Skip to the scenarios"}
          </button>
        </div>
      </div>
    </div>
  );
}
export {
  t,
  nV,
  nY,
  nU,
  holdSiteHeader,
  QuizArrow,
  SectionQuiz,
  QuizQuestion,
  QuizIntro,
};
