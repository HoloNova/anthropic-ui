import { createRoot } from "react-dom/client";
import { EconomicFutures } from "./recovered/EconomicFutures.jsx";
import { FeatureFlagsProvider } from "./runtime/feature-flags.jsx";
import { PageErrorBoundary } from "./runtime/PageErrorBoundary.jsx";
import { initializeSiteShell } from "./runtime/site-shell.js";
import survey from "./data/survey.json";
import headerHtml from "./content/header.html?raw";
import "./styles/index.css";
import "./styles/local-shell.css";

// 静态壳来自原页面；只有文章主体交给 React，避免再实现 Logo 和导航的 SVG/链接。
// 这里注入的是项目内固定文件，不是用户输入或运行时网络返回的数据。
// 页脚已按需求移除，页面止于正文结尾。
document.querySelector("#site-header").innerHTML = headerHtml;
const disposeShell = initializeSiteShell();
const root = createRoot(document.querySelector("#main-content"));

// 不加 StrictMode：恢复的原动画按单次挂载设计，开发环境的双挂载会重复初始化时间线。
root.render(
  <PageErrorBoundary>
    <FeatureFlagsProvider>
      <EconomicFutures survey={survey} />
    </FeatureFlagsProvider>
  </PageErrorBoundary>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeShell();
    root.unmount();
  });
}
