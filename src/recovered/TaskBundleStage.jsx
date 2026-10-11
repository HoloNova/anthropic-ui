// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import taskFieldStyles from "../styles/TaskField.classes.js";
import * as React from "react";
import { getStableViewportHeight } from "./viewport.jsx";
import {
  NEUTRAL_INK,
  NEW_TASK_INK,
  AUGMENTATION_INK,
  AUTOMATION_INK,
  CHART_THEME,
} from "./palette.jsx";
import {
  TASK_CELL_SIZE,
  af,
  ag,
  ax,
  aL,
  ak,
  makeTaskSquare,
  av,
} from "./drawing-tasks.jsx";
import { ib } from "./TaskBundleStage-2.jsx";
import {
  hashNoise,
  MARKER_FILTER_ID,
  RULE_FILTER_ID,
} from "./drawing-noise.jsx";
import { au, an } from "./drawing-grid.jsx";
let i;
let n2 = {
  nurse: {
    key: "nurse",
    job: "nurse",
    shortJob: "nurse",
    jobPlural: "nurses",
    possessive: "her",
    zoomLine: "Nurses are doing their work on every ward and on every shift.",
    dayLine:
      "She does rounds to check on a sick patient. She draws blood. She triages incoming patients, charts patients’ vitals, and orders supplies for the ward. That’s just the start of the list.",
    goneLine: "hardly anyone hand-writes paper charts anymore",
    arrivedLine: "30 years ago, no one monitored patients remotely",
    humanLine: "AI can’t bathe a patient.",
    augLine:
      "AI helps the nurse draft discharge instructions, monitor patients remotely, and plan the shift’s care schedule.",
    autoLine: "AI may chart a patient’s vitals, or order the ward’s supplies.",
    newLine:
      "For a nurse, that might be checking how well an AI triages patients, or reviewing an AI-proposed care plan.",
    tasks: [
      ["Triage the incoming patients", "aug"],
      ["Hand-write the paper chart", "ghost"],
      ["Chart vitals", "auto"],
      ["Chat with a patient", "human"],
      ["Bathe a patient", "human"],
      ["Plan the shift’s care schedule", "aug"],
      ["Do the rounds", "human"],
      ["Walk the paper notes to records", "ghost"],
      ["Order supplies for the ward", "auto"],
      ["Draw blood", "human"],
      ["Call in the supply order by phone", "ghost"],
      ["Coordinate with the doctors", "aug"],
      ["Count the ward stock by hand", "ghost"],
      ["Draft the discharge instructions", "aug"],
      ["Schedule the follow-up visits", "auto"],
      ["Train a new nurse", "human"],
      ["Monitor patients remotely", "newnorm"],
      ["Run the ward’s dashboards", "newnorm"],
      ["Check how well the AI triaged", "newt"],
      ["Review the care plan the AI proposed", "newt"],
    ],
  },
  teacher: {
    key: "teacher",
    job: "schoolteacher",
    shortJob: "teacher",
    jobPlural: "teachers",
    possessive: "their",
    zoomLine: "“Grade the essays” happens in every classroom, every week.",
    dayLine:
      "They run the class discussion and spot the kid who is struggling. They grade the essays, plan tomorrow’s lesson, take attendance, and write the report cards. And that’s just the start of the list.",
    goneLine: "hardly anyone runs a mimeograph anymore",
    arrivedLine: "no one posted to a class group chat thirty years ago",
    humanLine: "AI cannot comfort a crying student.",
    augLine: "AI helps the teacher grade a stack of essays.",
    autoLine: "AI may take the attendance, or collate the test scores.",
    newLine:
      "For a teacher, that might be reviewing the progress summaries an AI wrote, or teaching it each student’s quirks.",
    tasks: [
      ["Grade the essays", "aug"],
      ["Run the mimeograph machine", "ghost"],
      ["Take attendance", "auto"],
      ["Plan tomorrow’s lesson", "aug"],
      ["Comfort a crying student", "human"],
      ["Write the report cards", "aug"],
      ["Run the class discussion", "human"],
      ["Write the register in ink", "ghost"],
      ["Chase the permission slips", "auto"],
      ["Spot a kid who’s struggling", "human"],
      ["Cut stencils for the handouts", "ghost"],
      ["Design the quiz", "aug"],
      ["File the paper report cards", "ghost"],
      ["Prepare the parent-evening notes", "aug"],
      ["Collate the test scores", "auto"],
      ["Chaperone the field trip", "human"],
      ["Update the class portal", "newnorm"],
      ["Post to the class group chat", "newnorm"],
      ["Review the AI’s progress summaries", "newt"],
      ["Teach the AI each student’s quirks", "newt"],
    ],
  },
};
Object.keys(n2);
let n5 = "nurse";
let n3 = [
  {
    bundleStep: -1,
    caption: "",
  },
  {
    bundleStep: 0,
    caption: "One job, a bundle of tasks",
  },
  {
    bundleStep: 1,
    caption: "Tasks leave the bundle; new ones arrive",
  },
  {
    bundleStep: 2,
    caption: "Human-only: work only a human does",
  },
  {
    bundleStep: 3,
    caption: "Augmented: a human does the task, with AI help",
  },
  {
    bundleStep: 4,
    caption: "Automated: AI does the task",
  },
  {
    bundleStep: 5,
    caption: "New: tasks created by AI itself",
  },
  {
    bundleStep: 6,
    caption:
      "Productivity: AI gets better at the tasks it can complete — those squares grow",
  },
  {
    bundleStep: 7,
    caption: "Adoption: fill = the share of a task’s instances done with AI",
  },
  {
    bundleStep: 8,
    caption: "Every square is paid work — the bundle is a slice of the economy",
  },
];
let n6 = n3.length;
function n4(e) {
  return Math.min(1, (window.innerWidth - 16) / e);
}
function n8(e, t, a) {
  let s = n4(e);
  return a
    ? Math.min(
        s,
        Math.max(0.62, (getStableViewportHeight() - a.offsetTop - 88 - 32) / t),
      )
    : s;
}
function n7(e) {
  let t = e.offsetTop + e.offsetHeight - getStableViewportHeight();
  if (t <= 8) return 0;
  let a = e.firstElementChild;
  return -Math.min(t, a ? a.offsetHeight + 24 : 0);
}
function n9(e, t) {
  let a = getStableViewportHeight(),
    s = a - 32 - e.offsetTop - e.offsetHeight;
  return s <= 0
    ? 0
    : Math.max(
        0,
        Math.min(a / 2 - (e.offsetTop + t.offsetTop + t.offsetHeight / 2), s),
      );
}
let ie = {
  neutral: NEUTRAL_INK,
  fresh: NEW_TASK_INK,
  aug: AUGMENTATION_INK,
  auto: AUTOMATION_INK,
  paid: "#217D5D",
};
let it = (e) => ("current" === e ? "currentColor" : ie[e]);
let ia = `${-0.2 * TASK_CELL_SIZE} ${-0.2 * TASK_CELL_SIZE} ${1.4 * TASK_CELL_SIZE} ${1.4 * TASK_CELL_SIZE}`;
let is = (e) => ((e % 24) + 24) % 24;
let il = (e, t = "tile") => `efx-task-${t}-${is(e)}`;
let io = {
  fill: 1,
  scale: 2,
};
function ir(e, t, a, s = io) {
  let l = TASK_CELL_SIZE * s.scale,
    o = af(e),
    r = (e) => e - Math.round(e * s.fill),
    n = ag(0, 0, l, l, (e, s) => (e < r(s) ? t : a), {
      seed: o,
      paper: CHART_THEME.paper,
    }),
    i = ax(0, 0, l, l, {
      color: t,
      seed: o,
      paper: CHART_THEME.paper,
    });
  return {
    passes: n,
    split: r(n.length),
    weather: i,
    mark: l,
    offset: -(l - TASK_CELL_SIZE) / 2,
  };
}
let id = {
  color: "#87867F",
  opacity: 0.3,
  edgeY: 44,
  edgeX: 64,
  edgeShort: 130,
};
let ic = (e) => 3 * e + 1;
let iu = (e) => 3 * e;
let ih = (e, t) => (t + 512) * 1024 + (e + 512);
let im = (e, t) => ih(ic(e), iu(t));
let ip = new Set();
for (let e = 0; e < 20; e++) ip.add(`${ic(e % 4)},${iu(Math.floor(e / 4))}`);
let ig = (e, t) => Math.max(0, Math.ceil((e / 0.5 - t) / 2 / 52)) + ix;
let ix = 1;
let i_ = (e) => {
  let t = e < 0 ? 0 : e > 1 ? 1 : e;
  return 0.5 + t * t * (3 - 2 * t) * 0.5;
};
let iy = 6;
let iw = 6;
let iv = ib[0].length;
let ik = ib.length;
let iM =
  0 == (i = (((1248 - ((ik - 1) / 2) * 78 - 26 + -936) % 26) + 26) % 26)
    ? 0
    : 26 - i;
let ij = (ik - 1) * 78 + 52;
let iN = (e) => ({
  x: (11 + (e % 4)) * 156 + 78,
  y: (6 + Math.floor(e / 4)) * 156 + 26,
});
let iA = ({ c, r }) => ({
  x: 2028 + (c - (iv - 1) / 2) * 78,
  y: 1248 + iM + (r - (ik - 1) / 2) * 78,
});
let iT = {
  hidden: false,
  aug: false,
  auto: false,
  fresh: false,
  inst: false,
  drained: false,
  priced: false,
};
let iL = (e) =>
  "aug" === e || "newnorm" === e ? "aug" : "auto" === e ? "auto" : null;
let iI = (e) => hashNoise(13.3 * e + 7);
function TaskPasses({ passes, weather, ink }) {
  let s = it(ink);
  return (
    <g
      style={{
        isolation: "isolate",
        ...("current" === ink
          ? null
          : {
              color: s,
            }),
      }}
    >
      {passes.map((e, t) => (
        <g
          className={taskFieldStyles.sline}
          style={{
            "--dd": `${Math.round(110 * iI(t))}ms`,
            "--de": `${Math.round((1 - iI(t)) * 110)}ms`,
          }}
          dangerouslySetInnerHTML={{
            __html: e,
          }}
          key={t}
        />
      ))}
      {weather ? (
        <g
          className={taskFieldStyles.sline}
          style={{
            "--dd": "110ms",
            "--de": "0ms",
          }}
          dangerouslySetInnerHTML={{
            __html: weather,
          }}
        />
      ) : null}
    </g>
  );
}
function TaskDrain({ full, drained }) {
  let a = full.passes.length,
    s = drained.split,
    l = (e) => `${Math.round((s > 1 ? e / (s - 1) : 0) * 350)}ms`;
  return (
    <g
      style={{
        isolation: "isolate",
      }}
    >
      <g
        transform={`translate(${full.offset.toFixed(3)} ${full.offset.toFixed(3)})`}
      >
        {full.passes.map((e, t) => (
          <g
            className={t < s ? taskFieldStyles.dline : taskFieldStyles.gline}
            style={{
              "--gd": `${Math.round((a > 1 ? Math.abs(t - (a - 1) / 2) / ((a - 1) / 2) : 0) * 300)}ms`,
              ...(t < s
                ? {
                    "--rd": l(t),
                  }
                : null),
            }}
            dangerouslySetInnerHTML={{
              __html: e,
            }}
            key={t}
          />
        ))}
        {drained.passes.slice(0, s).map((e, t) => (
          <g
            className={taskFieldStyles.rline}
            style={{
              "--rd": l(t),
            }}
            dangerouslySetInnerHTML={{
              __html: e,
            }}
            key={`g${t}`}
          />
        ))}
        <g
          className={taskFieldStyles.gline}
          style={{
            "--gd": "300ms",
          }}
          dangerouslySetInnerHTML={{
            __html: full.weather,
          }}
        />
      </g>
    </g>
  );
}
function TaskSvg({ viewBox, className, children }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      aria-hidden={true}
      focusable={"false"}
    >
      <g
        filter={`url(#${MARKER_FILTER_ID})`}
        style={{
          mixBlendMode: "multiply",
        }}
      >
        {children}
      </g>
    </svg>
  );
}
function TaskField({ fieldPool }) {
  return (
    <svg
      className={taskFieldStyles.defs}
      aria-hidden={true}
      focusable={"false"}
    >
      <defs>
        {fieldPool.map((e, t) => (
          <g id={il(t, "field")} key={`f${t}`}>
            <TaskPasses passes={e.passes} weather={e.weather} ink={"current"} />
          </g>
        ))}
      </defs>
    </svg>
  );
}
let RecoveredComponent_iR = React.memo(function ({
  on,
  drawn,
  settled,
  x,
  y,
  clearTop,
  clearSide,
  density,
}) {
  let i = 52 * x,
    d = 52 * y,
    h = 624 + 2 * i,
    m = 624 + 2 * d,
    [p, f] = React.useState(false);
  React.useEffect(() => {
    if (on) return void f(false);
    let t = window.setTimeout(() => f(true), 780);
    return () => window.clearTimeout(t);
  }, [on]);
  let g = React.useMemo(() => {
    let e = [],
      t = m / 52,
      a = x + iy,
      i = y + iw,
      d = -x + clearSide,
      u = h / 52 - x - 1 - clearSide;
    for (let r = -y; r < t - y; r++) {
      if (r < -y + clearTop) continue;
      let t = i_((r - (-y + clearTop) + 1) / 3);
      for (let o = d; o <= u; o++) {
        if (ip.has(`${o},${r}`)) continue;
        let h = Math.min(t, i_((Math.min(o - d, u - o) + 1) / 3)),
          m = o - iy,
          p = r - iw;
        if (!aL(m, p, a, i, density, h)) continue;
        let f = ih(o, r),
          g = Math.min(1, Math.max(Math.abs(m) / a, Math.abs(p) / i));
        e.push(
          <use
            href={`#${il(f, "field")}`}
            className={taskFieldStyles.fillerUse}
            transform={`translate(${(o + x) * 52} ${(r + y) * 52})`}
            style={{
              "--ring-delay": `${Math.round((1 - g) * 320)}ms`,
              "--fd": `${Math.round(700 * iI(af(f)))}ms`,
              color: ak(f),
            }}
            key={f}
          />,
        );
      }
    }
    return e;
  }, [x, y, h, m, clearTop, clearSide, density]);
  return (
    <svg
      className={[
        taskFieldStyles.fillerField,
        drawn && taskFieldStyles.fillerFieldDrawn,
        settled && taskFieldStyles.fillerFieldSettled,
        !on && taskFieldStyles.fillerFieldOff,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: -i,
        top: -d,
        width: h,
        height: m,
        ...(p
          ? {
              display: "none",
            }
          : null),
      }}
      viewBox={`0 0 ${h} ${m}`}
      aria-hidden={true}
      focusable={"false"}
    >
      <g
        filter={`url(#${MARKER_FILTER_ID})`}
        style={{
          mixBlendMode: "multiply",
        }}
      >
        {g}
      </g>
    </svg>
  );
});
function TaskAnimationLayer({ index, fieldMark, cls, show }) {
  let l = iL(cls),
    o = "newt" === cls ? "fresh" : null,
    r = React.useMemo(() => {
      let t = (t) => makeTaskSquare(index, TASK_CELL_SIZE, it(t));
      return {
        neutral: t("neutral"),
        takes: l ? t(l) : null,
        fresh: o ? t("fresh") : null,
        paid: t("paid"),
      };
    }, [index, l, o]),
    n = React.useMemo(
      () =>
        "aug" === cls || "auto" === cls
          ? ir(index, it("neutral"), it(l ?? "neutral"))
          : null,
      [cls, index, l],
    ),
    i = React.useMemo(
      () =>
        "aug" === cls || "auto" === cls
          ? ir(index, it("neutral"), it(l ?? "neutral"), {
              fill: 0.12 + 0.73 * hashNoise(5.3 * af(index) + 0.9),
              scale: io.scale,
            })
          : null,
      [cls, index, l],
    );
  return (
    <TaskSvg viewBox={ia} className={taskFieldStyles.mark}>
      <g
        className={taskFieldStyles.inkLayer}
        data-ink={"field"}
        opacity={show.field}
      >
        <TaskPasses
          passes={fieldMark.passes}
          weather={fieldMark.weather}
          ink={av(index)}
        />
      </g>
      <g
        className={taskFieldStyles.inkLayer}
        data-ink={"neutral"}
        opacity={show.classPair}
      >
        <TaskPasses
          passes={r.neutral.passes}
          weather={r.neutral.weather}
          ink={"neutral"}
        />
      </g>
      {r.takes && l && (
        <g
          className={taskFieldStyles.inkLayer}
          data-ink={"takes"}
          opacity={show.classPair}
        >
          <TaskPasses
            passes={r.takes.passes}
            weather={r.takes.weather}
            ink={l}
          />
        </g>
      )}
      {r.fresh && (
        <g
          className={taskFieldStyles.inkLayer}
          data-ink={"fresh"}
          opacity={show.fresh}
        >
          <TaskPasses
            passes={r.fresh.passes}
            weather={r.fresh.weather}
            ink={"fresh"}
          />
        </g>
      )}
      {n && i && (
        <g
          className={taskFieldStyles.inkLayer}
          data-ink={"inst"}
          opacity={show.inst}
        >
          <TaskDrain full={n} drained={i} />
        </g>
      )}
      <g
        className={taskFieldStyles.inkLayer}
        data-ink={"paid"}
        opacity={show.paid}
      >
        <TaskPasses
          passes={r.paid.passes}
          weather={r.paid.weather}
          ink={"paid"}
        />
      </g>
    </TaskSvg>
  );
}
let RecoveredComponent_iE = React.memo(function ({ x, y, opts }) {
  let s = 26 * x,
    l = 26 * y,
    o = 624 + 2 * s,
    r = 624 + 2 * l,
    n = React.useMemo(
      () =>
        au(o, r, {
          ...opts,
          cell: 26,
        }),
      [o, r, opts],
    );
  return (
    <svg
      className={taskFieldStyles.paper}
      style={{
        left: -s,
        top: -l,
        width: o,
        height: r,
      }}
      viewBox={`0 0 ${o} ${r}`}
      aria-hidden={true}
      focusable={"false"}
    >
      <g
        filter={`url(#${RULE_FILTER_ID})`}
        dangerouslySetInnerHTML={{
          __html: n.visible.map((e) => an(e, opts)).join(""),
        }}
      />
    </svg>
  );
});
let iP = [
  {
    key: "human",
    label: "Tasks unchanged by AI",
    ink: "neutral",
  },
  {
    key: "aug",
    label: "Tasks augmented",
    ink: "aug",
  },
  {
    key: "auto",
    label: "Tasks automated",
    ink: "auto",
  },
  {
    key: "fresh",
    label: "New tasks created by AI",
    ink: "fresh",
  },
];
let iG = Object.fromEntries(
  ["neutral", "aug", "auto", "fresh"].map((e) => [
    e,
    makeTaskSquare(5, TASK_CELL_SIZE, it(e)),
  ]),
);
function TaskArrow({ ink }) {
  let t = iG[ink];
  return (
    <TaskSvg viewBox={ia} className={taskFieldStyles.chipMark}>
      <TaskPasses passes={t.passes} weather={t.weather} ink={ink} />
    </TaskSvg>
  );
}
function useTaskScrollProgress(e, t = 0.62) {
  let [a, s] = React.useState(0),
    l = React.useRef([]),
    o = React.useRef([]),
    r = React.useCallback(
      (e) => (
        (o.current[e] ??= (t) => {
          l.current[e] = t;
        }),
        o.current[e]
      ),
      [],
    );
  React.useEffect(() => {
    let a = 0,
      o = 0,
      r = false,
      n = () => {
        o = 0;
        let a = Math.max(getStableViewportHeight(), 400) * t,
          r = 0;
        for (let t = 0; t < e; t++) {
          let e = l.current[t];
          e && e.getBoundingClientRect().top < a && (r = t);
        }
        s(r);
      },
      i = () => {
        r && !o && (o = requestAnimationFrame(n));
      },
      d = () => {
        cancelAnimationFrame(a);
        a = requestAnimationFrame(n);
      },
      c = new IntersectionObserver(
        ([e]) => {
          (r = e.isIntersecting) && i();
        },
        {
          rootMargin: "25% 0px",
        },
      ),
      u = l.current.find(Boolean)?.closest("section") ?? null;
    u ? c.observe(u) : (r = true);
    let h = window.innerWidth,
      m = () => {
        window.innerWidth !== h && ((h = window.innerWidth), d());
      };
    d();
    window.addEventListener("scroll", i, {
      passive: true,
    });
    window.addEventListener("resize", m);
    return () => {
      c.disconnect();
      cancelAnimationFrame(a);
      cancelAnimationFrame(o);
      window.removeEventListener("scroll", i);
      window.removeEventListener("resize", m);
    };
  }, [e, t]);
  return {
    active: a,
    register: r,
  };
}
export {
  i,
  n2,
  n5,
  n3,
  n6,
  n4,
  n8,
  n7,
  n9,
  ie,
  it,
  ia,
  is,
  il,
  io,
  ir,
  id,
  ic,
  iu,
  ih,
  im,
  ip,
  ig,
  ix,
  i_,
  iy,
  iw,
  iv,
  ik,
  iM,
  ij,
  iN,
  iA,
  iT,
  iL,
  iI,
  TaskPasses,
  TaskDrain,
  TaskSvg,
  TaskField,
  RecoveredComponent_iR,
  TaskAnimationLayer,
  RecoveredComponent_iE,
  iP,
  iG,
  TaskArrow,
  useTaskScrollProgress,
};
