// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import { lv } from "./model-series.jsx";
function lk(e, t = {}) {
  return lM(e, t, false);
}
function lM(e, t, a) {
  let {
      threshold: s = 1,
      margin: l = "200px 0px",
      initial: o = lv,
      box: r = "border",
    } = t,
    [n, i] = React.useState(o),
    d = React.useRef({
      threshold: s,
      margin: l,
      widthOnly: a,
      model: r,
    });
  d.current = {
    threshold: s,
    margin: l,
    widthOnly: a,
    model: r,
  };
  React.useEffect(() => {
    let t = e.current;
    if (!t) return;
    let a = 0,
      s = false,
      l = true,
      o = false,
      r = () => {
        a = 0;
        let e = t.getBoundingClientRect(),
          s = e.width;
        if ("content" === d.current.model) {
          let e = getComputedStyle(t);
          s -=
            parseFloat(e.paddingLeft || "0") +
            parseFloat(e.paddingRight || "0");
        }
        let r = Math.max(0, Math.round(s)),
          n = d.current.widthOnly ? 0 : Math.round(e.height);
        l = false;
        let c = !o;
        o = true;
        i((e) => {
          let t = d.current.threshold;
          return (!c && Math.abs(e.w - r) < t && Math.abs(e.h - n) < t) ||
            (e.w === r && e.h === n)
            ? e
            : {
                w: r,
                h: n,
              };
        });
      },
      n = () => {
        if (!s) {
          l = true;
          return;
        }
        a || (a = requestAnimationFrame(r));
      },
      c = new ResizeObserver(n);
    if ((c.observe(t), "u" < typeof IntersectionObserver)) {
      s = true;
      n();
      return () => {
        cancelAnimationFrame(a);
        c.disconnect();
      };
    }
    let u = new IntersectionObserver(
      ([e]) => {
        (s = e.isIntersecting) && l && n();
      },
      {
        rootMargin: d.current.margin,
      },
    );
    u.observe(t);
    return () => {
      cancelAnimationFrame(a);
      u.disconnect();
      c.disconnect();
    };
  }, [e]);
  return n;
}
function useScrollDraw(e, t = {}) {
  return lM(e, t, true).w;
}
export { lk, lM, useScrollDraw };
