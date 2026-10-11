/* 真实源码的唯一入口：全部用 `?raw` 从磁盘读，
   所以图鉴里折叠展示的代码在物理上不可能和 src/ 不一致。 */

import drawingNoise from "../recovered/drawing-noise.jsx?raw";
import drawingStrokes from "../recovered/drawing-strokes.jsx?raw";
import drawingStrokes2 from "../recovered/drawing-strokes-2.jsx?raw";
import drawingGrid from "../recovered/drawing-grid.jsx?raw";
import drawingTasks from "../recovered/drawing-tasks.jsx?raw";
import palette from "../recovered/palette.jsx?raw";
import seeded from "../recovered/question-specs-2.jsx?raw";
import heroChart from "../recovered/HeroChart.jsx?raw";
import shareStrokes from "../recovered/ShareStrokes.jsx?raw";
import dropCap from "../recovered/DropCap.jsx?raw";
import scrollHooks from "../recovered/scroll-hooks.jsx?raw";
import sectionLaborShare from "../recovered/SectionLaborShare.jsx?raw";
import taskBundleStage from "../recovered/TaskBundleStage.jsx?raw";
import sectionHero from "../recovered/SectionHero.jsx?raw";
import sectionTaskBundle from "../recovered/SectionTaskBundle.jsx?raw";
import capGrid from "../recovered/CapabilityGrid.jsx?raw";
import economicFutures from "../recovered/EconomicFutures.jsx?raw";
import foundation2 from "../styles/foundation-2.css?raw";
import foundation1 from "../styles/foundation-1.css?raw";
import labDemoCss from "./lab-demo.css?raw";

const SOURCES = {
  drawingNoise,
  drawingStrokes,
  drawingStrokes2,
  drawingGrid,
  drawingTasks,
  palette,
  seeded,
  heroChart,
  shareStrokes,
  dropCap,
  scrollHooks,
  sectionLaborShare,
  taskBundleStage,
  sectionHero,
  sectionTaskBundle,
  capGrid,
  economicFutures,
  foundation2,
  foundation1,
  labDemoCss,
};

/* 源码索引页的清单：路径 + 一句话职责 + 有没有被图鉴引用展示。 */
const SOURCE_INDEX = [
  {
    key: "drawingNoise",
    path: "src/recovered/drawing-noise.jsx",
    role: "噪声基座 + 手绘路径生成器：hashNoise、tD 查表、tU 墨色、makeHandDrawnLine。",
  },
  {
    key: "drawingStrokes",
    path: "src/recovered/drawing-strokes.jsx",
    role: "马克笔三层合成（主体 / core / streaks）、干笔分段 at、滤镜工厂 makeLiteFilter。",
  },
  {
    key: "drawingStrokes2",
    path: "src/recovered/drawing-strokes-2.jsx",
    role: "干笔 / 细线两种输出的薄包装，分出带 multiply 混合与不带两种用法。",
  },
  {
    key: "drawingGrid",
    path: "src/recovered/drawing-grid.jsx",
    role: "纸张网格（ar/an）、网格挖洞避让（au）、墨块渐变色块（ao）、贝塞尔上下边界（as）。",
  },
  {
    key: "drawingTasks",
    path: "src/recovered/drawing-tasks.jsx",
    role: "水彩铺色 a_、值噪声斑块 aL、52px 任务方格、中性/增强/自动化三色分配。",
  },
  {
    key: "palette",
    path: "src/recovered/palette.jsx",
    role: "三档情景色板（蓝/绿/品红各 4 阶）、语义墨水色、CHART_THEME。",
  },
  {
    key: "seeded",
    path: "src/recovered/question-specs-2.jsx",
    role: "createSeededRandom（mulberry32）与 createSeededNormal（平滑插值序列）。",
  },
  {
    key: "heroChart",
    path: "src/recovered/HeroChart.jsx",
    role: "首屏扇形绽放：180 条种子化轨迹、弧面展开、rAF 增量补画、滚出即清空。",
  },
  {
    key: "shareStrokes",
    path: "src/recovered/ShareStrokes.jsx",
    role: "比例横条：按容器宽度实时重算笔触，三段 linearGradient 上色。",
  },
  {
    key: "dropCap",
    path: "src/recovered/DropCap.jsx",
    role: "首字下沉：canvas measureText 量字形 → clipPath 裁水彩；手绘方框 l6。",
  },
  {
    key: "scrollHooks",
    path: "src/recovered/scroll-hooks.jsx",
    role: "useScrollDraw：ResizeObserver + IntersectionObserver + rAF 合并，把容器宽度直接喂给笔触生成器。",
  },
  {
    key: "sectionLaborShare",
    path: "src/recovered/SectionLaborShare.jsx",
    role: "MarkerFilters：mk-marker / mk-dry / mk-rule 三档噪点滤镜与移动端 lite 版。",
  },
  {
    key: "taskBundleStage",
    path: "src/recovered/TaskBundleStage.jsx",
    role: "任务方块舞台：defs 池化 24 个 tile、passes/weather 分层、CSS 变量交错入场。",
  },
  {
    key: "sectionHero",
    path: "src/recovered/SectionHero.jsx",
    role: "首屏布局：ResizeObserver 把文案边界换算给图表，尊重 prefers-reduced-motion。",
  },
  {
    key: "capGrid",
    path: "src/recovered/CapabilityGrid.jsx",
    role: "可拖拽画预测的方格纸，内含手绘铅笔 data-URI 光标。",
  },
  {
    key: "economicFutures",
    path: "src/recovered/EconomicFutures.jsx",
    role: "页面装配：章节顺序、状态共享、MARKER_FILTER_ID 注入点。",
  },
  {
    key: "foundation1",
    path: "src/styles/foundation-1.css",
    role: "三个字体族的 @font-face 与 fallback 度量覆盖（ascent/descent/size-adjust）。",
  },
  {
    key: "foundation2",
    path: "src/styles/foundation-2.css",
    role: "设计变量：slate 色阶、间距、圆角、字号 scale、ivory/slate 主题。",
  },
];

export { SOURCES, SOURCE_INDEX };
