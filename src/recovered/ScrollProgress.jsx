// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import scrollProgressStyles from "../styles/ScrollProgress.classes.js";
import { getStableViewportHeight } from "./viewport.jsx";
/* 使用 requestAnimationFrame 合并滚动更新；进度条只在当前叙事段落内显示。 */
function ScrollProgress({ children, className }) {
  let a = React.useRef(null),
    s = React.useRef(null),
    l = React.useRef(null);
  React.useEffect(() => {
    let e = 0,
      t = 0,
      o = 0,
      r = -1,
      n = null,
      i = () => {
        if (!t) return;
        let a = window.scrollY,
          o = t - getStableViewportHeight(),
          i = o <= 0 ? (a - e) / Math.max(t, 1) : (a - e) / o,
          d = i >= 0 && i <= 1;
        d !== n &&
          ((n = d), s.current && (s.current.style.opacity = d ? "1" : "0"));
        let c = Math.round(400 * Math.max(0, Math.min(1, i))) / 400;
        c !== r &&
          ((r = c), l.current && (l.current.style.transform = `scaleX(${c})`));
      },
      d = () => {
        o ||
          (o = requestAnimationFrame(() => {
            o = 0;
            i();
          }));
      },
      c = () => {
        let s;
        (s = a.current) &&
          ((e = s.getBoundingClientRect().top + window.scrollY),
          (t = s.offsetHeight));
        i();
      },
      u = requestAnimationFrame(c);
    window.addEventListener("scroll", d, {
      passive: true,
    });
    window.addEventListener("resize", c);
    return () => {
      cancelAnimationFrame(u);
      o && cancelAnimationFrame(o);
      window.removeEventListener("scroll", d);
      window.removeEventListener("resize", c);
    };
  }, []);
  return (
    <div
      ref={a}
      className={
        className
          ? `${scrollProgressStyles.wrapper} ${className}`
          : scrollProgressStyles.wrapper
      }
    >
      <div
        ref={s}
        className={scrollProgressStyles.track}
        style={{
          opacity: 0,
        }}
        aria-hidden={"true"}
      >
        <div ref={l} className={scrollProgressStyles.fill} />
      </div>
      {children}
    </div>
  );
}
export { ScrollProgress };
