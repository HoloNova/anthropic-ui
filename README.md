# Anthropic Economic Scenarios：可读源码版

目标页面：<https://www.anthropic.com/institute/econ-scenarios>

**这是一个能直接读、直接改、直接跑的 React 工程。** 页面文章、图表、问卷与经济模型都在 `src/` 里以可编辑的 JSX / CSS 形式存在。

不是官方仓库。官方仓库里的 TS/SCSS 源码、类型定义和开发注释没有公开，这份代码是从该页面实际发布的 JS/CSS 里恢复出来的组件、模型和绘制逻辑；恢复过程不改变公式、数值、文案和数据结构，只把打包器外壳换成标准 ES 模块，并补上中文注释与可读命名。

本仓库**只保留源码**：没有编译产物备份、没有原始 bundle 归档、没有打包好的 zip。

## 运行

建议 Node.js 24（Vite 7 支持 Node.js 20.19+ / 22.12+）。

```sh
npm ci --include=dev   # 本机 NODE_ENV=production，需显式带上开发依赖
npm run dev
```

终端会给出本地地址，通常是 `http://127.0.0.1:5173`。三个入口：

| 路径 | 内容 |
|---|---|
| `/` | 入口页：两个链接与来源说明 |
| `/origin` | 恢复后的原页面（文章 + 交互 + 手绘视觉） |
| `/component` | 手绘水彩渲染引擎拆解 |

```sh
npm run dev:origin # 启动后自动打开 /origin
npm run dev:lab    # 启动后自动打开 /component
```

```sh
npm run verify    # 不打开浏览器：模块初始化、类名覆盖、CSS 变量、字体资源
npm run lab:smoke # 用 SSR 把拆解页渲染一遍：任一 demo 调错参数都会在这里报出来
npm run lab:check # 确认 public/component.md 没落后于卡片与源码，并检查数据层
npm run lab:md    # 重新生成 public/component.md（npm run build 也会先生成一次）
npm run build     # 生成 dist/（构建产物，可随时删除）
npm run preview   # 需要检查构建结果时手动启动
```

页面本身不访问官网接口：字体已本地化，问卷答案只写进本机 `localStorage`。文章里的外部链接（论文、官网其他页面）仍指向原站。

部署到公网的路径、子路径构建与响应头配置见 [`docs/DEPLOY.md`](docs/DEPLOY.md)。

## 渲染引擎拆解（/component）

`/component` 是第二个页面，把这份源码里的手绘 / 水彩渲染手法拆成可以上手拖参数的卡片：
从一根笔触、一张网格纸开始，逐层组合到整页装配。

关键性质：每个 demo 都直接调用 `src/recovered/` 里的真实函数（不是重写的仿制品），
所以改绘制代码这一页会跟着变；折叠的源码块由 Vite 的 `?raw` 在构建时读入，
物理上不可能和 `src/` 不一致。

版式参考 claude.dev 的文章页：12 栏网格 + sticky 侧边栏（树形章节、字符进度条、
当前章节展开子项）+ 窄正文列；配色、字体与笔触全部沿用本站的 ivory 主题。
窄屏（≤1080px）进入正文后，右上角出现三横杠目录，展开沿用同一份章节数据。
顶部的项目名指向官方源站，右上角的 `Original Page` 回到 `/origin`。

八个章节共 30 张元素卡，自底向上排列：概览（用真实绘制函数拼出的元素地图）、
基座（确定性哈希、种子随机、路径几何、墨色暗化）、笔触（手绘路径、种子家族、马克笔三层、
干笔分段、滤镜配方台、multiply 叠加）、纸与材质（纸张方格、网格挖洞、墨块、值噪声斑块）、
水彩铺色（铺色、干燥痕迹、任务方格）、墨与色（情景色板、语义墨水色、CHART_THEME、字体与字号）、
组合（扇形绽放、比例横条、首字下沉、尺寸与重绘、交错入场、方框与光标）、
装配（逐层组成画面、笔触生成过程、性能账），最后是 18 个源文件的索引。

`public/component.md` 是这一页的文本版：由 `scripts/build-lab-md.mjs` 从卡片定义与真实源码生成，
`npm run build` 时会先重新生成，侧栏的 `Copy markdown` 复制它。

新增文件都在 `src/lab/`，不影响文章页；`vite.config.js` 是三个入口的多页配置。

## 目录

```text
index.html                 入口页（/）：两个链接与来源说明
origin/index.html          原页面入口（/origin）
component/index.html       拆解页入口（/component）
src/
  main.jsx                 原页面：挂载静态页头，渲染正文
  recovered/               68 个恢复的页面模块，真实 JSX
  styles/                  48 个样式表 + 类名映射（*.classes.js）
  data/                    页面公开快照：调查结果、导航、功能开关
  content/header.html      页面静态页头（Logo、导航、CTA 的原样标记）
  runtime/                 本地运行封装：页头交互、功能开关、错误边界
  lab/                     拆解页：ui/ 控件、demos/ 分节示例、parts/ 章节
public/assets/fonts/       3 个字体族共 6 个字体文件
public/component.md        拆解页文本版（构建时生成，不手写）
public/_headers            Netlify / Cloudflare Pages 的响应头规则
public/favicon.svg         站点图标
scripts/                   校验与生成脚本（见下）
docs/                      部署、来源、验收清单、阅读指南与命名对照
```

`npm run verify` 的四项检查：所有 `src/recovered`、`src/runtime` 模块能在无 DOM、无网络环境下初始化；源码与页头引用的 546 个类名都能在样式里找到；样式引用的 74 个自定义属性都有定义；6 个字体文件被引用且没有孤儿文件。

## 推荐阅读顺序

1. [`src/recovered/EconomicFutures.jsx`](src/recovered/EconomicFutures.jsx)：完整文章与章节组合，自定义情景和问卷答案如何共享。
2. [`src/recovered/SectionHero.jsx`](src/recovered/SectionHero.jsx) + [`src/styles/SectionHero.css`](src/styles/SectionHero.css)：首屏布局与响应式规则。
3. [`src/recovered/HeroChart.jsx`](src/recovered/HeroChart.jsx) 与 `drawing-*.jsx`：分叉曲线、手绘线条、带种子的随机数。
4. [`src/recovered/SectionTaskBundle.jsx`](src/recovered/SectionTaskBundle.jsx) 与 `TaskBundleStage*.jsx`：滚动驱动的任务方块动画。
5. [`src/recovered/SectionQuiz.jsx`](src/recovered/SectionQuiz.jsx)：问卷与个人情景；问题定义在 `question-specs*.jsx`。
6. [`src/recovered/ModelKernel.jsx`](src/recovered/ModelKernel.jsx)、`scenario-inputs*.jsx`、`model-metrics*.jsx`：实际经济模型与图表数据。
7. [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md)：把视觉效果对应到实现文件。

短名称到可读名称的对照在 [`docs/symbol-map.json`](docs/symbol-map.json)。无法从代码确定含义的局部变量保持原样，没有猜测性重命名。

## 与官网的差异

- 正文、标题、数据不改写；模型与交互来自恢复的实际代码。
- 去掉 Next.js / Turbopack 外壳，改用 Vite 与标准 ES 模块。
- 样式按实际使用裁剪：删除了 Cookie 授权弹窗、音频播放器、世界地图、营销页等 92 个与本页无关的样式表（约 390 KB → 164 KB），未使用的 4 个字体族（JetBrains Mono、Styrene A/B、Tiempos Text）及其 13 个字体文件一并删除。
- 页脚按要求移除，页面止于正文结尾；页头里的 “Skip to footer” 链接同步删除。
- 页头交互（下拉菜单、移动菜单、滚动收起）是本地重写的可读实现，沿用原站类名与 `html[data-explore-nav="hidden"]` 机制，所以样式完全命中；Logo 的原 Lottie 动画未接入。
- 问卷提交只保存到本机 `localStorage`，不发送到官网研究库；问卷界面与原隐私说明文字保持原样。

更完整的来源与边界见 [`docs/PROVENANCE.md`](docs/PROVENANCE.md)。

## 验收状态

`npm run verify` 与 `npm run build` 均通过。恢复阶段（原始 bundle 仍保留时）还完成过这些检查：三个预设加一个自定义情景共 46,881 个模型数值与原公开脚本逐项一致；308 条可见文案与长文本逐字保留；21 个本地资源哈希一致。这些历史结果记录在 [`docs/VERIFICATION.md`](docs/VERIFICATION.md)，原始 bundle 已按要求从仓库移除，因此当前不可复跑。

没有做浏览器视觉验收，也没有 UI 单元测试。人工检查清单见 [`docs/MANUAL-QA.md`](docs/MANUAL-QA.md)。
