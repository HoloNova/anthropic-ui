// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import * as animation from "gsap";
import sectionProseStyles from "../styles/SectionProse.classes.js";
import { useReducedMotion } from "./viewport.jsx";
/* 文章段落组件；正文字符串逐字保留，只恢复渲染结构。 */
function SectionProse({
  children,
  flushTop = false,
  opening = false,
  closing = false,
  flushBottom = false,
  beforeHeading = false,
  reveal = false,
  className,
}) {
  let i = React.useRef(null);
  !(function (e, t = {}) {
    let a = useReducedMotion(),
      {
        y: s = 18,
        duration: l = 0.8,
        threshold: o = 0.35,
        delay: r = 0,
        enabled: n = true,
      } = t;
    React.useEffect(() => {
      let t = e.current;
      if (!t || !n) return;
      if (a)
        return void animation.gsap.set(t, {
          clearProps: "opacity,visibility,transform",
        });
      animation.gsap.set(t, {
        autoAlpha: 0,
        y: s,
      });
      let i = null,
        d = () => {
          c.disconnect();
          i = animation.gsap.to(t, {
            autoAlpha: 1,
            y: 0,
            duration: l,
            delay: r,
            ease: "power2.out",
          });
        },
        c =
          t.getBoundingClientRect().height * o > window.innerHeight
            ? new IntersectionObserver(
                (e) => {
                  e[e.length - 1].isIntersecting && d();
                },
                {
                  rootMargin: `0px 0px -${Math.round(100 * o)}% 0px`,
                },
              )
            : new IntersectionObserver(
                (e) => {
                  e[e.length - 1].intersectionRatio < o || d();
                },
                {
                  threshold: [o],
                },
              );
      c.observe(t);
      return () => {
        c.disconnect();
        i?.kill();
        animation.gsap.set(t, {
          clearProps: "opacity,visibility,transform",
        });
      };
    }, [e, a, n]);
  })(i, {
    threshold: 0.2,
    enabled: reveal,
  });
  let d = [
    sectionProseStyles.section,
    flushTop && sectionProseStyles.flushTop,
    opening && sectionProseStyles.opening,
    closing && sectionProseStyles.closing,
    flushBottom && sectionProseStyles.flushBottom,
    beforeHeading && sectionProseStyles.beforeHeading,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={d}>
      <div className={sectionProseStyles.content} ref={i}>
        {children}
      </div>
    </section>
  );
}
export { SectionProse };
