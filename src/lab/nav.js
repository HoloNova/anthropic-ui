/* 章节结构。Rail 与各 Part 共用这一份，id 必须与卡片上的 id 一致。 */

/* 官方源站：拆解页顶部的项目名指向它。 */
const OFFICIAL_URL = "https://www.anthropic.com/institute/econ-scenarios";

const NAV = [
  {
    id: "overview",
    no: "0",
    title: "概览",
    items: [
      ["overview-scene", "元素地图"],
    ],
  },
  {
    id: "atoms",
    no: "1",
    title: "基座",
    items: [
      ["hash-noise", "A1 确定性哈希"],
      ["seeded", "A2 种子随机"],
      ["path-geometry", "A3 路径几何"],
      ["ink-darkening", "A4 墨色暗化"],
    ],
  },
  {
    id: "strokes",
    no: "2",
    title: "笔触",
    items: [
      ["hand-drawn-line", "B1 手绘路径"],
      ["seed-family", "B2 种子家族"],
      ["marker-layers", "B3 马克笔三层"],
      ["dry-brush", "B4 干笔分段"],
      ["filters", "B5 滤镜配方台"],
      ["blend", "B6 multiply 叠加"],
    ],
  },
  {
    id: "materials",
    no: "3",
    title: "纸与材质",
    items: [
      ["paper-grid", "C1 纸张方格"],
      ["grid-holes", "C2 网格挖洞"],
      ["ink-blob", "C3 墨块"],
      ["wash-blob", "C4 值噪声斑块"],
    ],
  },
  {
    id: "wash",
    no: "4",
    title: "水彩铺色",
    items: [
      ["wash-fill", "D1 铺色"],
      ["weather", "D2 干燥痕迹"],
      ["task-squares", "D3 任务方格"],
    ],
  },
  {
    id: "ink",
    no: "5",
    title: "墨与色",
    items: [
      ["palettes", "E1 情景色板"],
      ["semantic-inks", "E2 语义墨水色"],
      ["chart-theme", "E3 CHART_THEME"],
      ["typography", "E4 字体与字号"],
    ],
  },
  {
    id: "molecules",
    no: "6",
    title: "组合",
    items: [
      ["fan", "F1 扇形绽放"],
      ["share-bar", "F2 比例横条"],
      ["dropcap", "F3 首字下沉"],
      ["scroll-draw", "F4 尺寸与重绘"],
      ["stagger", "F5 交错入场"],
      ["little-things", "F6 方框与光标"],
    ],
  },
  {
    id: "assembly",
    no: "7",
    title: "装配",
    items: [
      ["layers", "G1 八层装配"],
      ["own", "G2 工作原理"],
      ["performance", "G3 性能账"],
    ],
  },
  {
    id: "sources",
    no: "8",
    title: "源码索引",
    items: [],
  },
];

export { NAV, OFFICIAL_URL };
