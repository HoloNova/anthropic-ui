# 怎么读这份源码

## 页面是怎样组织的

`src/main.jsx` 注入页面的静态页头（`src/content/header.html`），再渲染 `EconomicFutures`。这个组件按原文章顺序组合章节，并持有两份状态：`userScenario` 是自定义模型输入，`answers` 是问卷答案；它们传到调查对比和后续结果章节，不各自维护互相矛盾的副本。

核心顺序是首屏、介绍正文、任务方块叙事、三种未来、问卷、公众调查对比、GDP、岗位迁移、失业、工资、劳资份额、总结与瀑布图。页脚已移除，页面止于正文结尾。

`SectionProse` 负责文章排版和指定的进入动画；正文字符串留在 JSX 里，所以看源码即可完整读文章，不是请求另一个网站再嵌入 iframe。

## 首屏不是背景图片

`SectionHero` 用 `ResizeObserver` 测量图表和文本容器，把文案在图表坐标里的位置传给 `HeroChart`，让曲线绕开或延伸到文案区域，不依赖固定截图尺寸。

首屏按钮通过段落／问卷的实际位置滚动，尊重 `prefers-reduced-motion`。图表路径、网格与曲线效果在 `HeroChart.jsx` 和 `drawing-*.jsx` 中。

## 手绘感是怎样实现的

`drawing-noise.jsx` 提供确定性的噪声与带种子的随机函数；相同情景与尺寸会得到一致的线条，不会每次 React render 随机跳动。

`drawing-strokes.jsx`、`drawing-grid.jsx` 和 `drawing-tasks.jsx` 生成不完全笔直的路径、网格与任务方块。不要把其中的抖动替换成每帧 `Math.random()`，否则图表会闪烁且难以复现。

`MarkerFilters` 定义 `mk-marker`、`mk-dry`、`mk-rule` 等 SVG filter；`feTurbulence`、透明度混合与位移让笔触有纹理，移动端样式切到简化 filter 以降低绘制成本。`GraphPaper` 随容器尺寸重算纸张格线。

## 滚动如何驱动叙事

`viewport.jsx` 的隐藏 `100vh` 探针提供稳定舞台高度，避免移动浏览器地址栏收缩时整个长动画改变比例。

`ScrollProgress` 和 `scroll-hooks.jsx` 用 `requestAnimationFrame` 合并滚动事件，避免每次 scroll 都触发复杂绘制。

`SectionTaskBundle` 与 `TaskBundleStage*.jsx` 把章节滚动进度映射到任务方块的位置、颜色和状态；增强、自动化和新任务不是三张静态插图。`ThreeFuturesChart` 与 `SectionWaterfall` 用同一套绘图语言展示情景曲线。

## 页头交互

`src/runtime/site-shell.js` 是本地重写的可读实现：桌面下拉在展开时才插入面板，所以 `Dropdown__dropdown` 的淡入动画每次都会播放；收起页头用的是原站机制 `html[data-explore-nav="hidden"]`（见 `src/styles/SiteHeader.css`），没有额外自造样式。移动菜单的结构与类名对齐 `SiteMobileNav.css` 的假设（折叠分类、展开动画、底部 CTA）。

要改导航数据，改 `src/data/navigation.json`；要改交互行为，改 `src/runtime/site-shell.js`；这两处都不需要动恢复出来的文章代码。

## 问卷和经济模型

从 `SectionQuiz.jsx` 读问题导航、答案状态、跳过／完成行为；从 `question-specs*.jsx` 读问题定义、默认答案和映射。

模型链路可以理解为：

```text
问卷答案 / 预设
    ↓
getPresetScenario、cloneScenarioInputs 等输入转换
    ↓
runScenario
    ↓
ModelKernel 的求根、稳态和逐月模拟
    ↓
model-metrics / model-series 的年度与百分比转换
    ↓
GDP / 就业 / 失业 / 工资 / 劳资份额图表
```

`CALIBRATION_DATA` 在 `calibration.jsx`。内核保持实际数值代码，没有用插值的“三条假曲线”代替。

短名称与可读名称的对照在 `docs/symbol-map.json`；无法从代码确定含义的局部变量保持原样，没有猜测性改名。

## 响应式与字体

`SectionHero.css`、`SectionQuiz.css`、`SectionTaskBundle.css`、`EconomicFutures.css` 等保留原站媒体查询；`foundation-1/2/3.css` 保存共享重置、通用排版与设计变量。站点级 chrome（`SiteHeader.css`、`SiteMobileNav.css`、`Dropdown.css`、`LogoWordmark.css`、`Icon.css`）也在这份仓库里，因为页头需要它们。

样式按实际使用裁剪过：只保留页面真正命中的规则与 3 个字体族（`anthropicSans`、`anthropicSerif`、`anthropicMono`）。字体文件与 `index.html` 上的字体变量类同步保留，所以不是拿系统字体近似替换。

`*.classes.js` 是可读类名映射，不是 CSS-in-JS。遇到 `styles.headline`，到对应 `.css` 查 `.SectionHero__headline` 即可。

## 可以从哪里开始修改

- 只学结构：`EconomicFutures.jsx` 和 `SectionHero.jsx`。
- 只学动效：`HeroChart.jsx`、`drawing-*.jsx`、`scroll-hooks.jsx`。
- 只学模型：`ModelKernel.jsx` 和 `scenario-inputs*.jsx`，改动后运行 `npm run verify`。
- 改导航、提交行为或错误提示：动 `src/runtime/`（问卷的本地提交函数在 `src/recovered/survey-client.jsx`），不要碰文章文案。

`src/recovered` 与 `src/styles` 现在是普通源文件，可以直接编辑；仓库里没有会覆盖它们的生成脚本。
