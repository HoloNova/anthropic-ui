# 来源与恢复边界

## 恢复来源

目标页面：<https://www.anthropic.com/institute/econ-scenarios>。

页面主体代码来自该页面实际发布的 JavaScript chunk `/_next/static/chunks/1w-dqy0izva-0.js` 里的页面模块：组件、文章文案、问卷、经济模型、绘图算法与数据都在其中。样式来自同页引用的 5 个公开 CSS（页面实际列出 6 条引用，其中一条为重复）：

```text
/_next/static/chunks/2gepcixj9k_19.css    字体与 @font-face
/_next/static/chunks/2pnrpp88lh_gg.css    全局重置、设计变量与通用排版
/_next/static/chunks/2fv0wn39c-r51.css    文章、图表与站点图标
/_next/static/chunks/319a_2ybnnldk.css    问卷、情景探索器与各发现章节
/_next/static/chunks/31wfp4sninedi.css    页头、导航与首屏
```

每个 `src/styles/*.css` 顶部都保留了它来自哪个 chunk 的注释，方便追溯。字体文件来自这些样式里 `@font-face` 指向的公开 URL。

## 恢复方式

1. 下载页面 HTML 与它引用的 JS/CSS。
2. 解析页面模块的 AST：拆掉打包器注册器与数值模块 ID，把编译后的 `c.jsx(...)` 还原成 JSX，展开逗号表达式，按声明依赖图（Tarjan 强连通分量）拆成多个模块，保证不引入循环初始化。
3. 用组件 CSS 名、参数名与用途给顶层绑定命名；对无法确定含义的局部变量不做猜测性改名。
4. 恢复 CSS：去掉类名构建哈希、`@font-face` 指向的资源改成本地路径、按模块拆分成独立样式表并保持原始加载顺序。
5. 从页面 HTML 的 React Server Components / Flight 数据里解出调查结果、导航数据与功能开关，写成 `src/data/*.json`。

React、React DOM 与 GSAP 使用本地 npm 依赖；官方框架运行时只在恢复过程中作为参照。

## 仓库里没有的东西

按要求，这份仓库**只保留源码**。以下内容在恢复阶段使用过，但已删除、不随仓库分发：

- 页面 HTML 快照与下载的原始 JS/CSS（编译产物）；
- 原始 chunk 的 source map 探测结果：当时 20 个资源全部返回 404，没有 `sourcesContent`，因此没有官方工程可还原；
- 页面链接的论文 PDF 副本（文章里的链接仍指向官网原地址）；
- 抓取与恢复脚本、资源清单、行号对照表（`recover` 流程会在改回原始归档时覆盖生成文件，故未保留）；
- 打包好的 zip 与构建产物 `dist/`。

也就是说，这份交付是**基于实际公开代码恢复的可编辑源码**，不是官方原始仓库，也不包含原始 bundle 备份。

## 明确改写的部分

1. 构建链：Next.js / Turbopack → Vite + 标准 ES 模块。
2. 页头交互：`src/runtime/site-shell.js` 是本地重写的可读实现，但类名、DOM 结构与折叠机制（`html[data-explore-nav="hidden"]`）沿用原站，因此命中原样式。Logo 的原 Lottie 动画未接入，使用静态 wordmark SVG。
3. 问卷提交：替换为只写 `localStorage.econ-scenarios:last-response`，不访问 `/api/crumb` 或 `/api/econ-scenarios/response`。问卷界面与原隐私说明文字未改。
4. 调查面板中的站点访客人数是抓取时的快照，不再请求实时统计。
5. 新增中文注释、错误边界、精简后的校验脚本与文档。

## 样式裁剪的判定方式

裁剪不是手工挑文件，而是按真实使用情况驱动：

- 使用来源：`src/recovered/*.jsx` 对 `*.classes.js` 类名映射的成员访问（动态访问则整表保留）、`src/runtime` 与 `src/main.jsx` 字符串里的类名或选择器、`src/content/header.html` 与 `index.html` 的实际 `class`。
- 规则级：选择器里所有类名都未被使用的规则删除；**不含类名的规则一律保留**（`:root`、`body`、`*`、标签选择器、设计变量、`html{--header-nav-height}` 等），重置与主题变量不会丢。
- `@keyframes` 只保留被保留规则或源码字符串引用的；`@font-face` 只保留仍被引用的字体族；未被引用的字体变量类与 `index.html` 上的对应 class 一并去掉。
- 结果：47 个样式表、170 KB 左右；删掉 92 个文件与 13 个字体文件。`npm run verify` 会持续保证“代码用到的类名都在样式里”“样式引用的变量都有定义”“字体目录没有孤儿文件”。
