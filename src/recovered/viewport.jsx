// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
let TECHNICAL_REPORT_URL =
  "https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf";
let EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
};
let viewportHeight = 0;
let viewportProbe = null;
let viewportResizeFrame = 0;
let viewportInitialized = false;
let viewportSubscribers = new Set();
/* 移动端地址栏会改变 innerHeight。原实现用隐藏的 100vh 探针稳定滚动舞台高度。 */
function getStableViewportHeight() {
  !viewportInitialized &&
    "u" > typeof document &&
    ((viewportInitialized = true),
    !(function e() {
      viewportProbe ||
        ((viewportProbe = document.createElement("div")).setAttribute(
          "aria-hidden",
          "true",
        ),
        (viewportProbe.style.cssText =
          "position:fixed;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none;"),
        document.body.appendChild(viewportProbe),
        window.addEventListener("resize", () => {
          viewportResizeFrame ||
            (viewportResizeFrame = requestAnimationFrame(() => {
              viewportResizeFrame = 0;
              e();
            }));
        }));
      let t = viewportProbe.getBoundingClientRect().height;
      t > 0 &&
        t !== viewportHeight &&
        ((viewportHeight = t),
        viewportSubscribers.forEach((e) => e(viewportHeight)));
    })());
  return viewportHeight || window.innerHeight;
}
function subscribeViewportHeight(e) {
  getStableViewportHeight();
  viewportSubscribers.add(e);
  return () => {
    viewportSubscribers.delete(e);
  };
}
function useReducedMotion() {
  let [e, t] = React.useState(false);
  React.useEffect(() => {
    let e = window.matchMedia("(prefers-reduced-motion: reduce)");
    t(e.matches);
    let a = (e) => t(e.matches);
    e.addEventListener("change", a);
    return () => e.removeEventListener("change", a);
  }, []);
  return e;
}
function getSectionProgress(e) {
  return e.height <= 0
    ? null
    : clamp01((getStableViewportHeight() - e.top) / e.height);
}
let clamp01 = (e) => Math.max(0, Math.min(1, e));
export {
  TECHNICAL_REPORT_URL,
  EXTERNAL_LINK_PROPS,
  viewportHeight,
  viewportProbe,
  viewportResizeFrame,
  viewportInitialized,
  viewportSubscribers,
  getStableViewportHeight,
  subscribeViewportHeight,
  useReducedMotion,
  getSectionProgress,
  clamp01,
};
