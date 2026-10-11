// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import taskFieldStyles from "../styles/TaskField.classes.js";
import { aM, TASK_CELL_SIZE, makeTaskSquare, af } from "./drawing-tasks.jsx";
import {
  id,
  n8,
  n4,
  ij,
  n7,
  n9,
  ig,
  iy,
  iA,
  iN,
  is,
  it,
  iT,
  iL,
  iI,
  im,
  io,
  TaskAnimationLayer,
  TaskField,
  RecoveredComponent_iE,
  RecoveredComponent_iR,
  TaskSvg,
  ia,
  TaskPasses,
  iP,
  TaskArrow,
} from "./TaskBundleStage.jsx";
import {
  getStableViewportHeight,
  subscribeViewportHeight,
} from "./viewport.jsx";
import { useNearViewport } from "./layout-hooks.jsx";
import { iS } from "./TaskBundleStage-2.jsx";
function TaskBundleStage({
  step,
  occupation,
  density = aM,
  paper = id,
  className,
}) {
  let o = React.useRef(null),
    r = React.useRef(null),
    n = React.useRef(null);
  React.useEffect(() => {
    let e = 0,
      t = () => {
        let e = r.current,
          t = n.current;
        if (!e || !t) return;
        e.style.setProperty("--field-scale", String(0.5));
        let a = o.current,
          s = n8(624, 780, a);
        e.style.setProperty("--bundle-scale", String(s));
        e.style.setProperty("--width-scale", String(n4(624)));
        let l = Math.min(
          n8(624, 780, a),
          (getStableViewportHeight() - 40) / ij,
        );
        if ((e.style.setProperty("--glyph-scale", String(l)), a && s > 0)) {
          let t = n7(a);
          t < 0
            ? (a.style.setProperty("--stage-lift", `${t}px`),
              (a.dataset.lifted = "true"))
            : (a.style.setProperty("--stage-lift", "0px"),
              delete a.dataset.lifted);
          let o = n9(a, e);
          a.style.setProperty("--drawing-drop", `${o.toFixed(2)}px`);
          a.style.setProperty(
            "--tag-drop",
            `${Math.max(0, o - 26).toFixed(2)}px`,
          );
          let r = e.offsetTop + e.offsetHeight / 2,
            n = getStableViewportHeight() / 2 - a.offsetTop - t,
            i = (n - r - o) / s;
          e.style.setProperty("--centre-nudge", `${26 * Math.round(i / 26)}px`);
          let d = (n - r - o) / (l || 1);
          e.style.setProperty("--glyph-nudge", `${d.toFixed(2)}px`);
        }
        e.dataset.ready = "true";
      },
      a = () => {
        cancelAnimationFrame(e);
        e = requestAnimationFrame(t);
      };
    a();
    let s = window.innerWidth,
      l = () => {
        window.innerWidth !== s && ((s = window.innerWidth), a());
      };
    window.addEventListener("resize", l);
    let i = subscribeViewportHeight(a),
      d = new ResizeObserver(a);
    n.current && d.observe(n.current);
    return () => {
      cancelAnimationFrame(e);
      window.removeEventListener("resize", l);
      i();
      d.disconnect();
    };
  }, [r, n, o, 624, 780, ij, 0.5]);
  let i = (function (e, t) {
      let [a, s] = React.useState(null);
      React.useEffect(() => {
        let a = 0,
          l = () => {
            var a, l, o;
            let r,
              n,
              i,
              d,
              c = e.current,
              u = n8(624, 780, c),
              h = getStableViewportHeight(),
              m = Math.max(0, Math.round((h / u - 624) / 2 / 26)),
              p = Math.max(
                0,
                Math.floor((window.innerWidth / 2 - 312 - 52) / 26),
              ),
              f = {
                paper: {
                  x: p,
                  y: m,
                },
                dense:
                  ((r = t.current),
                  (i = ig(
                    2 *
                      Math.max(
                        (n =
                          c && r
                            ? c.offsetTop +
                              n7(c) +
                              n9(c, r) +
                              r.offsetTop +
                              r.offsetHeight / 2
                            : h / 2),
                        h - n,
                      ),
                    624,
                  )),
                  {
                    x: (d = ig(window.innerWidth, 624)),
                    y: i,
                    clearTop:
                      ((a = e.current),
                      (l = t.current),
                      (o = i),
                      a && l
                        ? Math.max(
                            1,
                            Math.ceil(
                              Math.max(
                                0,
                                -(
                                  a.offsetTop +
                                  n7(a) +
                                  n9(a, l) +
                                  l.offsetTop +
                                  l.offsetHeight / 2 -
                                  ((624 + 2 * o * 52) * 0.5) / 2
                                ),
                              ) / 26,
                            ) + 0,
                          )
                        : 1),
                    clearSide: Math.max(0, d - p - iy),
                  }),
              };
            s((e) =>
              e &&
              e.paper.x === f.paper.x &&
              e.paper.y === f.paper.y &&
              e.dense.x === f.dense.x &&
              e.dense.y === f.dense.y &&
              e.dense.clearTop === f.dense.clearTop &&
              e.dense.clearSide === f.dense.clearSide
                ? e
                : f,
            );
          },
          o = () => {
            cancelAnimationFrame(a);
            a = requestAnimationFrame(l);
          };
        o();
        let r = window.innerWidth,
          n = () => {
            window.innerWidth !== r && ((r = window.innerWidth), o());
          };
        window.addEventListener("resize", n);
        let i = subscribeViewportHeight(o),
          d = new ResizeObserver(o);
        e.current && d.observe(e.current);
        return () => {
          cancelAnimationFrame(a);
          window.removeEventListener("resize", n);
          i();
          d.disconnect();
        };
      }, [e, t]);
      return a;
    })(o, r),
    d = useNearViewport(o),
    h = !!i && d,
    m = step < 0,
    p = step >= 8,
    f = React.useMemo(
      () =>
        (function (e) {
          let t = e.tasks
              .map((e, t) => t)
              .filter((t) => "ghost" !== e.tasks[t][1]),
            a = new Map(),
            s = [];
          for (let e of iS) {
            let l = iA(e);
            if (!t.length) {
              s.push(e);
              continue;
            }
            let o = 0,
              r = 1 / 0;
            t.forEach((e, t) => {
              let a = iN(e),
                s = (a.x - l.x) ** 2 + (a.y - l.y) ** 2;
              s < r && ((r = s), (o = t));
            });
            let n = t.splice(o, 1)[0],
              i = iN(n);
            a.set(n, {
              dx: Math.round(l.x - i.x),
              dy: Math.round(l.y - i.y),
            });
          }
          return {
            forTask: a,
            extras: s,
          };
        })(occupation),
      [occupation],
    ),
    g = React.useMemo(
      () =>
        d
          ? ((e = TASK_CELL_SIZE) =>
              Array.from(
                {
                  length: 24,
                },
                (t, a) => makeTaskSquare(a, e),
              ))()
          : [],
      [d],
    ),
    x = (e) => g[is(e)],
    _ = React.useMemo(
      () =>
        d
          ? f.extras.map((e, t) =>
              makeTaskSquare(5 * t + 2, TASK_CELL_SIZE, it("paid")),
            )
          : [],
      [f, d],
    ),
    b = [];
  for (let a = 0; d && a < 5; a++)
    for (let s = 0; s < 4; s++) {
      let l = 4 * a + s,
        o = occupation.tasks[l];
      {
        let [t, r] = o,
          n = m
            ? iT
            : {
                hidden:
                  ("ghost" === r && step >= 1) ||
                  ("newnorm" === r && step < 1) ||
                  ("newt" === r && step < 5),
                aug:
                  ("aug" === r && step >= 3) || ("newnorm" === r && step >= 3),
                auto: "auto" === r && step >= 4,
                fresh: "newt" === r && step >= 5,
                inst:
                  (6 === step || 7 === step) && ("aug" === r || "auto" === r),
                drained: 7 === step && ("aug" === r || "auto" === r),
                priced: step >= 8 && "ghost" !== r,
              },
          i = n.aug || n.auto,
          d = !m && !p && n.fresh,
          u = !m && !p && n.inst,
          h = !m && !p && !d && !u && !!iL(r) && i,
          g = +(!m && !p && !d && !u),
          _ = p ? f.forTask.get(l) : undefined,
          y = [
            taskFieldStyles.task,
            n.hidden ? taskFieldStyles.isHidden : taskFieldStyles.isIn,
            n.aug && taskFieldStyles.isAug,
            n.auto && taskFieldStyles.isAuto,
            n.fresh && taskFieldStyles.isFresh,
            n.inst && taskFieldStyles.isInst,
            n.drained && taskFieldStyles.isDrained,
            n.priced && taskFieldStyles.isPriced,
            h && taskFieldStyles.isInked,
          ]
            .filter(Boolean)
            .join(" ");
        b.push(
          <div
            className={y}
            style={{
              "--gx": `${_?.dx ?? 0}px`,
              "--gy": `${_?.dy ?? 0}px`,
              "--br": String(a),
              "--td": `${Math.round(130 * iI(af(l)))}ms`,
              "--te": `${Math.round((1 - iI(af(l))) * 130)}ms`,
              "--fd": `${Math.round(700 * iI(af(im(s, a))))}ms`,
              "--inst-scale": io.scale,
              gridColumn: 11 + s + 1,
              gridRow: 6 + a + 1,
            }}
            key={`${a}-${s}`}
          >
            <div className={taskFieldStyles.sq}>
              <TaskAnimationLayer
                index={l}
                fieldMark={x(l)}
                cls={r}
                show={{
                  field: +!!m,
                  classPair: g,
                  fresh: +!!d,
                  inst: +!!u,
                  paid: +!!p,
                }}
              />
            </div>
            <div className={taskFieldStyles.label}>{t}</div>
          </div>,
        );
      }
    }
  let v = step >= 2 && !p;
  return (
    <div
      ref={o}
      className={
        className
          ? `${taskFieldStyles.root} ${className}`
          : taskFieldStyles.root
      }
    >
      <p
        className={`${taskFieldStyles.jobtag} ${m || p ? taskFieldStyles.jobtagOff : ""}`}
        aria-hidden={m || p}
      >
        {"A "}
        {occupation.job}
        {"’s tasks"}
      </p>
      <TaskField fieldPool={g} />
      <div
        ref={r}
        className={[
          taskFieldStyles.wrap,
          !m && taskFieldStyles.wrapZoomed,
          p && taskFieldStyles.wrapGlyph,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {i && d && (
          <React.Fragment>
            <div
              className={`${taskFieldStyles.paperLayer} ${taskFieldStyles.paperOn}`}
              aria-hidden={true}
            >
              <RecoveredComponent_iE x={i.paper.x} y={i.paper.y} opts={paper} />
            </div>
            <RecoveredComponent_iR
              on={m}
              drawn={h}
              settled={h}
              x={i.dense.x}
              y={i.dense.y}
              clearTop={i.dense.clearTop}
              clearSide={i.dense.clearSide}
              density={density}
            />
          </React.Fragment>
        )}
        <div
          ref={n}
          className={[
            taskFieldStyles.field,
            (m || p) && taskFieldStyles.labelsOff,
            m && taskFieldStyles.wideField,
            m && h && taskFieldStyles.wideFieldDrawn,
            m && h && taskFieldStyles.wideFieldSettled,
            p && taskFieldStyles.glyph,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {b}
          {d &&
            f.extras.map((e, t) => {
              let a = iA(e);
              return (
                <div
                  className={`${taskFieldStyles.extra} ${p ? taskFieldStyles.extraOn : ""}`}
                  style={{
                    left: Math.round(a.x - 26),
                    top: Math.round(a.y - 26),
                  }}
                  aria-hidden={true}
                  key={`x${t}`}
                >
                  <TaskSvg viewBox={ia} className={taskFieldStyles.mark}>
                    <TaskPasses
                      passes={_[t].passes}
                      weather={_[t].weather}
                      ink={"paid"}
                    />
                  </TaskSvg>
                </div>
              );
            })}
        </div>
      </div>
      <ul
        className={`${taskFieldStyles.legend} ${v ? taskFieldStyles.legendOn : ""}`}
        aria-hidden={!v}
      >
        {iP.map(({ key, label, ink }) => (
          <li className={taskFieldStyles.legendItem} key={key}>
            <span className={taskFieldStyles.chip}>
              <TaskArrow ink={ink} />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
export { TaskBundleStage };
