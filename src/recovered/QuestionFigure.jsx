// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import resultPortraitStyles from "../styles/ResultPortrait.classes.js";
import { SCENARIO_PALETTES, CHART_THEME, NEUTRAL_INK } from "./palette.jsx";
import { lk } from "./scroll-hooks.jsx";
import {
  RULE_FILTER_ID,
  DRY_FILTER_ID,
  MARKER_FILTER_ID,
  hashNoise,
  tD,
  tX,
} from "./drawing-noise.jsx";
import { am, aw } from "./drawing-tasks.jsx";
import { makeMarkerStroke } from "./drawing-strokes.jsx";
import { makeRuleStroke } from "./drawing-strokes-2.jsx";
import { oH } from "./LineChart.jsx";
import { tB } from "./question-specs.jsx";
import { runUserScenario, ld, lp, lx } from "./model-series.jsx";
import { rg } from "./outcome-specs-3.jsx";
import { ti } from "./scenario-presets.jsx";
import { sR, lt } from "./model-metrics.jsx";
import { ChartKey, lO } from "./ChartKey.jsx";
let r_ = {
  taperIn: 0.02,
  taperOut: 0.07,
  startWidth: 0.95,
  endWidth: 0.85,
};
let ry = {
  conservative: SCENARIO_PALETTES.slow,
  central: SCENARIO_PALETTES.central,
  fast: SCENARIO_PALETTES.fast,
};
function rw() {
  let e = React.useRef(null),
    t = lk(e);
  return [e, t];
}
function RecoveredComponent_rb({ w, h, rule, ruled, ink, fine = false }) {
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={resultPortraitStyles.svg}
      aria-hidden={true}
    >
      {rule && (
        <g
          dangerouslySetInnerHTML={{
            __html: rule,
          }}
        />
      )}
      {ruled && (
        <g
          filter={`url(#${RULE_FILTER_ID})`}
          style={{
            mixBlendMode: "multiply",
            isolation: "isolate",
          }}
          dangerouslySetInnerHTML={{
            __html: ruled,
          }}
        />
      )}
      <g
        filter={`url(#${fine ? DRY_FILTER_ID : MARKER_FILTER_ID})`}
        style={{
          mixBlendMode: "multiply",
          isolation: "isolate",
        }}
        dangerouslySetInnerHTML={{
          __html: ink,
        }}
      />
    </svg>
  );
}
function RecoveredComponent_rv({ down = false }) {
  return (
    <svg
      className={resultPortraitStyles.deltaIcon}
      viewBox={"0 0 16 16"}
      fill={"none"}
      aria-hidden={true}
      focusable={"false"}
      style={
        down
          ? {
              transform: "scaleY(-1)",
            }
          : undefined
      }
    >
      <path
        d={"M8 13.5V3M3.8 6.9 8 2.8l4.2 4.1"}
        stroke={"currentColor"}
        strokeWidth={"1.6"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
    </svg>
  );
}
function RecoveredComponent_rk({ seed }) {
  let [t, a] = rw(),
    s = React.useMemo(() => {
      if (a.w < 60 || a.h < 60) return "";
      let t = (e, t, a, s, l) =>
        am(e, t, a, s, l, {
          width: 1.6 * (0.9 + 0.35 * hashNoise(l)),
          color: CHART_THEME.rule,
          opacity: 0.62,
        });
      return (
        t(1, 1, a.w - 1, 1, 17.3 * seed) +
        t(a.w - 1, 1, a.w - 1, a.h - 1, 17.3 * seed + 8.6) +
        t(a.w - 1, a.h - 1, 1, a.h - 1, 17.3 * seed + 21.9) +
        t(1, a.h - 1, 1, 1, 17.3 * seed + 35.1)
      );
    }, [a, seed]);
  return (
    <div className={resultPortraitStyles.ruleBox} ref={t} aria-hidden={true}>
      {s && (
        <svg width={a.w} height={a.h} className={resultPortraitStyles.svg}>
          <g
            filter={`url(#${RULE_FILTER_ID})`}
            dangerouslySetInnerHTML={{
              __html: s,
            }}
          />
        </svg>
      )}
    </div>
  );
}
function QuizFigure({
  solid,
  lead,
  tone,
  startLabel,
  leadLabel = "",
  leadInk = NEUTRAL_INK,
  topPad = 16,
  extra,
  endYear,
}) {
  let [d, h] = rw(),
    m = React.useMemo(() => {
      if (h.w < 120 || h.h < 120 || solid.length < 2 || lead.length < 2)
        return null;
      let s = Math.max(1, h.w - 8 - 20),
        l = Math.max(1, h.h - topPad - 40),
        i = solid[0].t,
        d = solid[solid.length - 1].t,
        c = extra ? extra.pts.map((e) => e.v) : [],
        u = Math.max(...solid.map((e) => e.v), ...lead.map((e) => e.v), ...c),
        m = Math.min(...solid.map((e) => e.v), ...lead.map((e) => e.v), ...c),
        p = m - Math.max(1.5, (u - m) * 0.06),
        f = (e) => topPad + l - ((e - p) / Math.max(1e-6, u - p)) * l,
        g = (e, t) =>
          e.map((e, a) => [
            8 +
              ((e.t - i) / Math.max(1e-6, d - i)) * s +
              (tD(37.13 * a + t) - 0.5) * 0.7,
            f(e.v) + (tD(61.77 * a + t + 5) - 0.5) * 0.7,
          ]),
        x = g(lead, 15.3),
        _ = g(solid, 3.7),
        y = extra ? g(extra.pts, 9.1) : null,
        w = topPad + l + 8;
      return {
        rule: `<line x1="8" y1="${w}" x2="${8 + s}" y2="${w}" stroke="var(--color-slate-300, #d1cfc5)" stroke-width="1"/>`,
        ink:
          makeMarkerStroke(x, {
            width: 6.21,
            color: leadInk,
            seed: 15,
            opacity: 1,
            ...r_,
          }) +
          (y && extra
            ? makeMarkerStroke(y, {
                width: 4.6 + 0.9 * hashNoise(76.07),
                color: extra.ink,
                seed: 27,
                opacity: 0.86,
                ...r_,
              })
            : "") +
          makeMarkerStroke(_, {
            width: 4.6 + 0.9 * hashNoise(3.7 * 7.7 + 6),
            color: tone,
            seed: 21,
            opacity: 0.86,
            ...r_,
          }),
        leadEndY: f(lead[lead.length - 1].v),
      };
    }, [h, solid, lead, tone, leadInk, topPad, extra]);
  return (
    <div className={resultPortraitStyles.chart} ref={d}>
      {m && <RecoveredComponent_rb w={h.w} h={h.h} rule={m.rule} ink={m.ink} />}
      {m && leadLabel && (
        <p
          className={`${resultPortraitStyles.cap} ${resultPortraitStyles.capFaint} ${resultPortraitStyles.leadCap}`}
          style={{
            top: m.leadEndY - 24,
          }}
        >
          {leadLabel}
        </p>
      )}
      <p
        className={`${resultPortraitStyles.cap} ${resultPortraitStyles.axisStart}`}
      >
        {startLabel}
      </p>
      <p
        className={`${resultPortraitStyles.cap} ${resultPortraitStyles.axisEnd}`}
      >
        {endYear}
      </p>
    </div>
  );
}
function QuizRatio({ title, stat, sub, seed, className, head, children }) {
  return (
    <section
      className={
        className
          ? `${resultPortraitStyles.tile} ${className}`
          : resultPortraitStyles.tile
      }
    >
      <RecoveredComponent_rk seed={seed} />
      {head ?? (
        <header className={resultPortraitStyles.tileHead}>
          <h3 className={resultPortraitStyles.tileTitle}>{title}</h3>
          <div className={resultPortraitStyles.tileStat}>
            <p className={resultPortraitStyles.big}>{stat}</p>
            {sub}
          </div>
        </header>
      )}
      {children}
    </section>
  );
}
function AnswerCaption({ text, tone }) {
  let [a, s] = rw(),
    l =
      s.w > 12
        ? makeMarkerStroke(
            [
              [0, 7],
              [s.w + 12, 7],
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
    <span className={resultPortraitStyles.scenarioWord} ref={a}>
      {text}
      {l && (
        <span
          className={resultPortraitStyles.scenarioUnderline}
          aria-hidden={true}
        >
          <RecoveredComponent_rb w={s.w + 12} h={16} ink={l} fine={true} />
        </span>
      )}
    </span>
  );
}
function AnswerLabel({ text, tone }) {
  return (
    <React.Fragment>
      {text.split(" ").map((e, a) => (
        <React.Fragment key={`${e}-${a}`}>
          {a > 0 && " "}
          <AnswerCaption text={e} tone={tone} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
function QuizValue({
  statRight,
  ai,
  base,
  gdp2030,
  gdpToday,
  gainPct,
  tone,
  endYear,
}) {
  let [i, d] = rw(),
    h = React.useMemo(() => {
      if (d.w < 120 || d.h < 160 || ai.length < 2 || base.length < 2)
        return null;
      let e = Math.max(1, d.w - 8 - 20),
        s = Math.max(1, d.h - 104 - 40),
        l = ai[0].t,
        o = ai[ai.length - 1].t,
        n = Math.max(...ai.map((e) => e.v), ...base.map((e) => e.v)),
        i = Math.min(...ai.map((e) => e.v), ...base.map((e) => e.v)) - 3,
        c = (t, a) =>
          t.map((t, r) => [
            8 +
              ((t.t - l) / Math.max(1e-6, o - l)) * e +
              (tD(37.13 * r + a) - 0.5) * 0.7,
            104 +
              s -
              ((t.v - i) / Math.max(1e-6, n - i)) * s +
              (tD(61.77 * r + a + 5) - 0.5) * 0.7,
          ]),
        u = c(base, 15.3),
        h = c(ai, 3.7),
        m = 104 + s + 8;
      return {
        rule: `<line x1="8" y1="${m}" x2="${8 + e}" y2="${m}" stroke="var(--color-slate-300, #d1cfc5)" stroke-width="1"/>`,
        ink:
          makeRuleStroke(u, {
            width: 4.6,
            color: oH,
            seed: 15,
            neat: true,
            landOnEnd: true,
            opacity: 0.86,
            samples: Math.max(48, Math.round(tX(u) / 5)),
          }) +
          makeMarkerStroke(h, {
            width: 4.6 + 0.9 * hashNoise(3.7 * 7.7 + 6),
            color: tone,
            seed: 21,
            opacity: 0.86,
            ...r_,
          }),
      };
    }, [d, ai, base, tone]);
  return (
    <div className={resultPortraitStyles.chart} ref={i}>
      {h && <RecoveredComponent_rb w={d.w} h={d.h} rule={h.rule} ink={h.ink} />}
      <div
        className={
          statRight
            ? `${resultPortraitStyles.gdpFigure} ${resultPortraitStyles.gdpFigureRight}`
            : resultPortraitStyles.gdpFigure
        }
      >
        <p className={resultPortraitStyles.big}>
          {"$"}
          {Math.round(gdp2030)}
          {"T"}
        </p>
        <p className={resultPortraitStyles.delta}>
          <RecoveredComponent_rv down={gainPct < 0} />
          {Math.abs(gainPct).toFixed(1)}
          {"%"}
        </p>
      </div>
      <p
        className={`${resultPortraitStyles.cap} ${resultPortraitStyles.axisStart}`}
      >
        {"Today "}
        <span className={resultPortraitStyles.capFaint}>
          {"$"}
          {Math.round(gdpToday)}
          {"T"}
        </span>
      </p>
      <p
        className={`${resultPortraitStyles.cap} ${resultPortraitStyles.axisEnd}`}
      >
        {endYear}
      </p>
    </div>
  );
}
let rT = "#6B675E";
function WageStroke({ zero, value, color, seed }) {
  let [l, o] = rw(),
    { x: r, w: n } = (function (e, t, a) {
      if (a <= 0)
        return {
          x: 0,
          w: 0,
        };
      let s = (e) => Math.max(0, Math.min(1, e)),
        l = Math.round(a * s(e)),
        o = Math.round(a * s(t)),
        r = t < e,
        n = Math.max(0, Math.min(r ? l : a - l, Math.max(14, Math.abs(o - l))));
      return {
        x: r ? l - n : l,
        w: n,
      };
    })(zero, value, o.w),
    i = value < zero ? r : r + 4,
    d = Math.max(0, n - 4),
    u =
      d > 2 && o.h > 12
        ? d <= 32
          ? makeMarkerStroke(
              [
                [i + d / 2, 2],
                [i + d / 2, o.h / 2],
                [i + d / 2, o.h - 2],
              ],
              {
                width: d,
                color,
                seed,
                opacity: 0.9,
                taperIn: 0.05,
                taperOut: 0.05,
                startWidth: 0.92,
                endWidth: 0.92,
                belly: 0,
                wobble: 0.25,
                chisel: 0.12,
              },
            )
          : aw(i, 0, d, o.h, {
              seed,
              color,
              paper: "#FAF9F5",
              endScatter: 0.3,
            })
        : "";
  return (
    <span className={resultPortraitStyles.wageTrack} ref={l}>
      {u && (
        <svg
          width={Math.max(1, o.w) + 16}
          height={o.h + 16}
          viewBox={`-8 -8 ${Math.max(1, o.w) + 16} ${o.h + 16}`}
          className={resultPortraitStyles.barSvg}
          aria-hidden={true}
        >
          <g
            filter={`url(#${MARKER_FILTER_ID})`}
            style={{
              isolation: "isolate",
            }}
            dangerouslySetInnerHTML={{
              __html: u,
            }}
          />
        </svg>
      )}
    </span>
  );
}
function WageCents({ cents, centsToday, shareInk }) {
  let [s, l] = rw(),
    o = React.useMemo(() => {
      if (l.w < 200 || l.h < 200) return null;
      let s = l.w / 2,
        o = l.h / 2,
        r = Math.max(56, Math.min(l.h / 2 - 44, l.w / 2 - 108)),
        n = Math.max(13, Math.min(20, 0.16 * r)),
        i = (e, t) => {
          let a = Math.max(16, Math.round(24 * Math.abs(t - e))),
            l = [];
          for (let n = 0; n <= a; n++) {
            let i = e + ((t - e) * n) / a;
            l.push([s + r * Math.cos(i), o + r * Math.sin(i)]);
          }
          return l;
        },
        d = -Math.PI / 2,
        c = Math.max(0, Math.min(1, cents / 100)),
        u = d + 2 * Math.PI * c,
        h = d + 2 * Math.PI * (Math.max(0, Math.min(100, centsToday)) / 100),
        m = d + Math.PI * c,
        p = d + Math.PI * (1 + c),
        f = (e) => ({
          left: s + (r + n + 10) * Math.cos(e),
          top: o + (r + n + 10) * Math.sin(e),
          end: 0 > Math.cos(e),
        });
      return {
        ink:
          makeMarkerStroke(i(u + 0.03, d + 2 * Math.PI - 0.03), {
            width: n,
            color: "#87867f",
            seed: 51,
            opacity: 0.8,
            taperIn: 0.02,
            taperOut: 0.02,
            startWidth: 0.85,
            endWidth: 0.85,
            belly: 0,
            core: false,
            samples: Math.max(24, Math.round(110 * (1 - c))),
          }) +
          makeMarkerStroke(i(d, u), {
            width: 1.05 * n,
            color: shareInk,
            seed: 53,
            opacity: 0.95,
            taperIn: 0.03,
            taperOut: 0.03,
            startWidth: 0.8,
            endWidth: 0.8,
            belly: 0,
            core: false,
            samples: Math.max(24, Math.round(110 * c)),
          }),
        ruled: [
          [h, 57],
          [m, 61],
          [p, 63],
        ]
          .map(([e, t]) =>
            makeRuleStroke(
              [
                [
                  s + (r - 0.95 * n) * Math.cos(e),
                  o + (r - 0.95 * n) * Math.sin(e),
                ],
                [
                  s + (r + 0.95 * n) * Math.cos(e),
                  o + (r + 0.95 * n) * Math.sin(e),
                ],
              ],
              {
                width: 2.8,
                color: "#5E5D59",
                seed: t,
                dashLength: 4,
                gap: 3.4,
              },
            ),
          )
          .join(""),
        todayAt: {
          left: s + (r + n + 6) * Math.cos(h),
          top: o + (r + n + 6) * Math.sin(h),
        },
        workers: f(m),
        capital: f(p),
      };
    }, [l, cents, centsToday, shareInk]);
  return (
    <div className={resultPortraitStyles.shareBody} ref={s}>
      {o && (
        <RecoveredComponent_rb w={l.w} h={l.h} ruled={o.ruled} ink={o.ink} />
      )}
      {o && (
        <React.Fragment>
          <div
            className={
              o.workers.end
                ? `${resultPortraitStyles.shareStat} ${resultPortraitStyles.shareStatEnd}`
                : resultPortraitStyles.shareStat
            }
            style={{
              left: o.workers.left,
              top: o.workers.top,
            }}
          >
            <p className={resultPortraitStyles.big}>
              {cents.toFixed(1)}
              {"¢"}
            </p>
            <p className={resultPortraitStyles.sub}>{"To workers"}</p>
          </div>
          <div
            className={
              o.capital.end
                ? `${resultPortraitStyles.shareStat} ${resultPortraitStyles.shareStatEnd}`
                : resultPortraitStyles.shareStat
            }
            style={{
              left: o.capital.left,
              top: o.capital.top,
            }}
          >
            <p className={resultPortraitStyles.big}>
              {(100 - cents).toFixed(1)}
              {"¢"}
            </p>
            <p className={resultPortraitStyles.sub}>{"To capital"}</p>
          </div>
          <p
            className={`${resultPortraitStyles.cap} ${resultPortraitStyles.todayTick}`}
            style={{
              left: o.todayAt.left,
              top: o.todayAt.top,
            }}
          >
            {"Today "}
            <span className={resultPortraitStyles.capFaint}>
              {Math.round(centsToday)}
              {"¢"}
            </span>
          </p>
        </React.Fragment>
      )}
    </div>
  );
}
function QuestionFigure({ answers, held, part, preset }) {
  let l,
    o,
    r,
    n = React.useMemo(() => {
      let a = tB(answers),
        s = held ?? runUserScenario(a),
        l = held
          ? rg(held)
          : (function (e) {
              let { inputs: t, trace: a } = ti(e, undefined);
              return {
                ...rg(t, e),
                mapping: a,
              };
            })(answers),
        o = sR(s),
        r = ld(s, undefined, o),
        n = lp(s, o);
      return {
        run: l,
        end: o,
        row: r,
        gdp: n.gdp,
        wages: n.wageGap.wages,
        wageGap: n.wageGap,
        unemployment: n.unemployment,
      };
    }, [answers, held]),
    i = ry[n.run.scenario],
    d = n.run.stats,
    h = n.wages[n.wages.length - 1]?.v ?? d.wagePct,
    m = lx(n.end),
    p =
      (l = n.end) < 2030
        ? `Shown for ${l}, the year growth peaks in this scenario.`
        : undefined,
    f = React.useMemo(() => {
      let e,
        t,
        a = (e) => e[e.length - 1]?.v ?? 0,
        s = [h, a(n.wageGap.cognitive), a(n.wageGap.other)],
        { at: l } =
          ((e = 1.15 * Math.min(0, ...s)),
          (t = Math.max(24, 1.15 * Math.max(0, ...s))),
          {
            at: (a) => (a - e) / (t - e || 1),
          });
      return {
        zero: l(0),
        overall: l(h),
        cognitive: l(s[1]),
        other: l(s[2]),
        cognitiveV: s[1],
        otherV: s[2],
      };
    }, [h, n.wageGap]),
    g = (
      <React.Fragment>
        <div className={resultPortraitStyles.forecastBody}>
          <p className={resultPortraitStyles.verdict}>
            {
              ((o = lt[n.run.scenario]),
              (r = /^[aeiou]/i.test(o) ? "an " : "a "),
              (
                <React.Fragment>
                  {preset ? "Our " : `You predict ${r}`}
                  <AnswerLabel text={`${o} scenario`} tone={i[0]} />
                  {`: the economy grows to $${Math.round(n.row.gdp2030)}T by ${n.end}, about ${n.row.gainPct.toFixed(1)}% larger than it would be without AI.`}
                </React.Fragment>
              ))
            }
          </p>
          <ul className={resultPortraitStyles.facts}>
            <li>
              {"The unemployment rate is "}
              {n.row.rates.all[1].toFixed(1)}
              {"%."}
            </li>
            <li>{`Wages are ${Math.abs(h).toFixed(1)}% ${h < 0 ? "lower" : "higher"} than they\u2019d be without AI.`}</li>
            <li>
              {n.row.cents.toFixed(1)}
              {"¢ of every dollar goes to workers."}
            </li>
          </ul>
        </div>
      </React.Fragment>
    ),
    x = (e, t) => (
      <header className={resultPortraitStyles.head}>
        <p className={resultPortraitStyles.eyebrow}>{e}</p>
        <h3 className={resultPortraitStyles.question}>{t}</h3>
      </header>
    );
  if ("forecast" === part)
    return (
      <section className={resultPortraitStyles.forecastAlone}>{g}</section>
    );
  let _ = (
    <section
      className={
        "tiles" === part
          ? `${resultPortraitStyles.sheetPanel} ${resultPortraitStyles.sheetPanelHosted}`
          : resultPortraitStyles.sheetPanel
      }
    >
      <div className={resultPortraitStyles.tiles}>
        <QuizRatio seed={3} head={x("GDP", "How big does the economy get?")}>
          <QuizValue
            ai={n.gdp.ai}
            base={n.gdp.base}
            gdp2030={n.row.gdp2030}
            gdpToday={d.gdpToday}
            gainPct={n.row.gainPct}
            tone={i[0]}
            endYear={n.end}
            statRight={true}
          />
          <div className={resultPortraitStyles.tileFoot}>
            <ChartKey
              items={["withAi", "noAi"]}
              inks={{
                withAi: i[0],
              }}
            />
            {m && <p className={resultPortraitStyles.cutNote}>{m}</p>}
            <p className={resultPortraitStyles.priceBase}>
              {"All $ numbers are in 2025 prices"}
            </p>
          </div>
        </QuizRatio>
        <QuizRatio
          seed={7}
          head={x("Unemployment", "Who’s still looking for work?")}
        >
          <div className={resultPortraitStyles.unempFull}>
            <QuizFigure
              solid={n.unemployment.affected}
              lead={n.unemployment.all}
              extra={{
                pts: n.unemployment.other,
                ink: NEUTRAL_INK,
              }}
              tone={rT}
              leadInk={i[0]}
              startLabel={"Today"}
              topPad={112}
              endYear={n.end}
            />
            <div className={resultPortraitStyles.unempOverlay}>
              <p className={resultPortraitStyles.big}>
                {n.row.rates.all[1].toFixed(1)}
                {"%"}
              </p>
              <p className={resultPortraitStyles.sub}>
                {lO.all.label}
                {" unemployment"}
              </p>
            </div>
          </div>
          <div
            className={resultPortraitStyles.unempKey}
            style={{
              "--ink-exposed": rT,
              "--ink-other": NEUTRAL_INK,
              "--ink-all": i[0],
            }}
          >
            <ChartKey items={["exposed", "other", "all"]} />
          </div>
          {m && <p className={resultPortraitStyles.cutNote}>{m}</p>}
        </QuizRatio>
        <QuizRatio seed={11} head={x("Wages", "How are wages affected?")}>
          <div className={resultPortraitStyles.wageRows}>
            <div
              className={resultPortraitStyles.barRule}
              style={{
                "--at": f.zero,
              }}
              aria-hidden={true}
            />
            <div className={resultPortraitStyles.wageRow}>
              <WageStroke
                zero={f.zero}
                value={f.overall}
                color={i[0]}
                seed={41}
              />
              <span className={resultPortraitStyles.wageVal}>
                <span className={resultPortraitStyles.big}>
                  {h.toFixed(1)}
                  {"%"}
                </span>
                <span className={resultPortraitStyles.sub}>
                  {h < 0 ? "Total decrease" : "Total increase"}
                </span>
              </span>
            </div>
            <div className={resultPortraitStyles.wageRow}>
              <WageStroke
                zero={f.zero}
                value={f.cognitive}
                color={rT}
                seed={43}
              />
              <span className={resultPortraitStyles.wageVal}>
                <span className={resultPortraitStyles.big}>
                  {f.cognitiveV.toFixed(1)}
                  {"%"}
                </span>
                <span className={resultPortraitStyles.sub}>
                  {lO.exposed.label}
                </span>
              </span>
            </div>
            <div className={resultPortraitStyles.wageRow}>
              <WageStroke
                zero={f.zero}
                value={f.other}
                color={NEUTRAL_INK}
                seed={47}
              />
              <span className={resultPortraitStyles.wageVal}>
                <span className={resultPortraitStyles.big}>
                  {f.otherV.toFixed(1)}
                  {"%"}
                </span>
                <span className={resultPortraitStyles.sub}>
                  {lO.other.label}
                </span>
              </span>
            </div>
          </div>
          <div className={resultPortraitStyles.tileFoot}>
            {p && <p className={resultPortraitStyles.cutNote}>{p}</p>}
            <p className={resultPortraitStyles.priceBase}>
              {"All $ numbers are in 2025 prices"}
            </p>
          </div>
        </QuizRatio>
        <QuizRatio
          seed={13}
          head={x(
            "Labor share",
            "How much of the growth goes to people’s wages?",
          )}
        >
          <WageCents
            cents={n.row.cents}
            centsToday={d.centsToday}
            shareInk={i[0]}
          />
          <div className={resultPortraitStyles.tileFoot}>
            {p && <p className={resultPortraitStyles.cutNote}>{p}</p>}
            <div
              className={resultPortraitStyles.captionSpacer}
              aria-hidden={true}
            />
          </div>
        </QuizRatio>
      </div>
    </section>
  );
  return "tiles" === part ? (
    _
  ) : (
    <div className={resultPortraitStyles.portrait3}>
      <section className={resultPortraitStyles.forecast3}>{g}</section>
      {_}
    </div>
  );
}
export {
  r_,
  ry,
  rw,
  RecoveredComponent_rb,
  RecoveredComponent_rv,
  RecoveredComponent_rk,
  QuizFigure,
  QuizRatio,
  AnswerCaption,
  AnswerLabel,
  QuizValue,
  rT,
  WageStroke,
  WageCents,
  QuestionFigure,
};
