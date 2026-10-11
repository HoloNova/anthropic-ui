// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import { ah, an } from "./drawing-grid.jsx";
import { RULE_FILTER_ID } from "./drawing-noise.jsx";
let aI = "data-figure-knockout";
let a$ = "data-figure-sheet";
let aF = 78;
let aW = 52;
function aC(e) {
  return Math.min(1, Math.max(0, (e - 700) / 520));
}
function aR(e) {
  return (
    Math.max(Math.min(64, Math.max(32, 0.08 * e - 24)), (e - 1092) / 2) - aG
  );
}
function aB(e) {
  return e < 700
    ? -26
    : Math.min(Math.round(aF * aC(e)), Math.max(0, Math.floor(aR(e) - 26)));
}
function aE(e) {
  return (((e / 2 - aB(e)) % 26) + 26) % 26;
}
let aP = aW;
let aG = 14;
function useElementSize(e) {
  let [t, a] = React.useState({
      x: 0,
      y: 0,
    }),
    s = React.useRef({
      x: 0,
      y: 0,
    });
  s.current = t;
  React.useEffect(() => {
    let t = e.current;
    if (!t) return;
    let l = t.closest("section")?.querySelector(`[${a$}]`);
    if (!l) return;
    let o = () => {
      let e = t.getBoundingClientRect(),
        o = l.getBoundingClientRect(),
        r = (e, t) => {
          let a = (e - t) % 26;
          a < 0 && (a += 26);
          return a < 13 ? -a : 26 - a;
        },
        n = r(e.left - s.current.x, o.left + aB(o.width) + aE(o.width)),
        i = r(e.top - s.current.y, o.top + aW);
      a((e) =>
        0.5 > Math.abs(e.x - n) && 0.5 > Math.abs(e.y - i)
          ? e
          : {
              x: n,
              y: i,
            },
      );
    };
    o();
    let r = new ResizeObserver(o);
    r.observe(t);
    r.observe(l);
    return () => r.disconnect();
  }, []);
  return t;
}
/* 图表背后的手绘方格纸；ResizeObserver 让 SVG 随容器尺寸重新计算。 */
function GraphPaper({ className }) {
  let t = React.useRef(null),
    [a, s] = React.useState({
      w: 0,
      h: 0,
    }),
    [l, o] = React.useState([]);
  React.useEffect(() => {
    let e = t.current;
    if (!e) return;
    let a = e.parentElement,
      l = true,
      r = () => {
        if (!l) return;
        let t = e.getBoundingClientRect();
        if (
          (s((e) => {
            let a = Math.round(t.width),
              s = Math.round(t.height);
            return e.w === a && e.h === s
              ? e
              : {
                  w: a,
                  h: s,
                };
          }),
          !a)
        )
          return;
        let r = [],
          n = aB(t.width) + aE(t.width);
        for (let e of Array.from(a.querySelectorAll(`[${aI}]`))) {
          let a = e.getBoundingClientRect();
          a.width < 1 ||
            a.height < 1 ||
            r.push({
              left: a.left - t.left - n - aG,
              top: a.top - t.top - aP - aG,
              right: a.right - t.left - n + aG,
              bottom: a.bottom - t.top - aP + aG,
            });
        }
        o((e) => (JSON.stringify(e) === JSON.stringify(r) ? e : r));
      };
    r();
    document.fonts?.ready.then(r);
    let n = new ResizeObserver(r);
    n.observe(e);
    a && n.observe(a);
    return () => {
      l = false;
      n.disconnect();
    };
  }, []);
  let r = aB(a.w),
    n = aE(a.w),
    i = React.useMemo(() => {
      if (a.w <= 0) return "";
      let e = (function (e) {
          if (e < 700) return 0;
          let t = aR(e) - aB(e) - 26;
          return Math.min(aC(e), Math.max(0, Math.min(1, t / 64)));
        })(a.w),
        t = ah(
          a.w - 2 * r - n,
          a.h - 2 * aP,
          {
            cell: 26,
            edgeY: 44,
            edgeX: Math.round(64 * e),
            edgeShortLeft: Math.round(130 * e),
            edgeShortRight: Math.round(130 * e),
            minPiece: 20,
          },
          l.length ? l : undefined,
        ),
        s = "";
      for (let e of t)
        s += an(e, {
          opacity: 0.3,
        });
      return s;
    }, [a.w, a.h, r, n, l]);
  return (
    <div
      ref={t}
      className={className}
      aria-hidden={true}
      {...{
        [a$]: "",
      }}
    >
      {a.w > 0 && (
        <svg width={a.w} height={a.h}>
          <g
            filter={`url(#${RULE_FILTER_ID})`}
            transform={`translate(${r + n} ${aP})`}
            dangerouslySetInnerHTML={{
              __html: i,
            }}
          />
        </svg>
      )}
    </div>
  );
}
function useIsVisible(e, t = "0px") {
  let [a, s] = React.useState(true);
  React.useEffect(() => {
    let a = e.current;
    if (!a || "u" < typeof IntersectionObserver) return;
    let l = new IntersectionObserver(([e]) => s(e.isIntersecting), {
      rootMargin: t,
    });
    l.observe(a);
    return () => l.disconnect();
  }, [e, t]);
  return a;
}
function useNearViewport(e, t = "75% 0px 75% 0px") {
  let [a, s] = React.useState(false);
  React.useEffect(() => {
    if (a) return;
    let l = e.current;
    if (!l) return;
    let o = new IntersectionObserver(
      (e) => {
        e.some((e) => e.isIntersecting) &&
          (o.disconnect(), React.startTransition(() => s(true)));
      },
      {
        rootMargin: t,
      },
    );
    o.observe(l);
    return () => o.disconnect();
  }, [e, a, t]);
  return a;
}
export {
  aI,
  a$,
  aF,
  aW,
  aC,
  aR,
  aB,
  aE,
  aP,
  aG,
  useElementSize,
  GraphPaper,
  useIsVisible,
  useNearViewport,
};
