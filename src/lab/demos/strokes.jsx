import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { makeHandDrawnLine, hashNoise } from "../../recovered/drawing-noise.jsx";
import { makeMarkerPath, at, t6 } from "../../recovered/drawing-strokes.jsx";
import { Stage, FilterDefs, useIds } from "../ui/Stage.jsx";
import { Knob, Switch, Seg, useParams } from "../ui/Controls.jsx";
import { DemoShell } from "../ui/Card.jsx";

const MONO = "var(--anthropic-mono), monospace";
const RULE = "#87867F";

/* 一条常用的测试折线：两端各留出边距，中间三个拐点。 */
function testStroke(width, y, span) {
  let left = 70;
  let right = width - 70;
  let step = (right - left) / 4;
  return [
    [left, y],
    [left + step, y - span * 0.42],
    [left + step * 2, y + span * 0.22],
    [left + step * 3, y - span * 0.3],
    [right, y + span * 0.06],
  ];
}

/* ---------------- B1 · 手绘路径的九个参数 ---------------- */

function HandDrawnAnatomy() {
  let [p, set] = useParams({
    width: 16,
    seed: 3,
    taperIn: 0.14,
    taperOut: 0.08,
    startWidth: 0.14,
    endWidth: 0.8,
    belly: 0.07,
    wobble: 0.14,
    edge: 1.25,
    chisel: 0.35,
    followEdge: true,
    ghost: true,
    raw: false,
  });
  let width = 700;
  let height = 228;
  let pts = React.useMemo(() => testStroke(width, 128, 92), [width]);

  let opts = {
    width: p.width,
    seed: p.seed,
    taperIn: p.taperIn,
    taperOut: p.taperOut,
    startWidth: p.startWidth,
    endWidth: p.endWidth,
    belly: p.belly,
    wobble: p.wobble,
    edge: p.followEdge ? undefined : p.edge,
    chisel: p.chisel,
  };

  let drawn = makeHandDrawnLine(pts, opts);
  let ghost = makeHandDrawnLine(pts, { ...opts, wobble: 0, edge: 0, chisel: 0 });

  return (
    <DemoShell
      canvas={
        <Stage width={width} height={height} caption="细线是骨架，实心面是手绘笔画">
          {p.raw ? (
            <polyline
              points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="#c2c0b6"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ) : null}
          {p.ghost ? <path d={ghost} fill="none" stroke="#141413" strokeWidth={0.7} opacity={0.42} /> : null}
          <path d={drawn} fill="#141413" />
          <text x={70} y={208} fontFamily={MONO} fontSize={11} fill={RULE}>
            {p.ghost
              ? "调整抖动与笔锋，对比骨架和笔画"
              : "展开更多参数，可以显示骨架"}
          </text>
        </Stage>
      }
      knobs={
        <>
          <Knob label="width" value={p.width} min={1} max={40} step={0.5} onChange={(v) => set("width", v)} hint="笔画的基准宽度；实际粗细还受其他参数影响" />
          <Knob label="wobble（粗细起伏）" value={p.wobble} min={0} max={0.8} step={0.01} onChange={(v) => set("wobble", v)} hint="越大，沿线的粗细变化越明显" />
          <Knob label="belly（笔腹）" value={p.belly} min={0} max={0.6} step={0.01} onChange={(v) => set("belly", v)} hint="让笔画中间鼓起来" />
          <Knob label="chisel（笔锋）" value={p.chisel} min={0} max={1} step={0.05} onChange={(v) => set("chisel", v)} hint="改变收笔处的斜切" />
          <Knob label="seed" value={p.seed} min={1} max={60} step={1} onChange={(v) => set("seed", v)} hint="换一种手绘形状" />
          <Knob label="taperIn" value={p.taperIn} min={0} max={0.5} step={0.01} onChange={(v) => set("taperIn", v)} hint="起笔收窄区占全长的比例" />
          <Knob label="startWidth" value={p.startWidth} min={0} max={1} step={0.02} onChange={(v) => set("startWidth", v)} hint="起笔处保留的宽度比例" />
          <Knob label="taperOut" value={p.taperOut} min={0} max={0.5} step={0.01} onChange={(v) => set("taperOut", v)} />
          <Knob label="endWidth" value={p.endWidth} min={0} max={1} step={0.02} onChange={(v) => set("endWidth", v)} hint="收笔处保留的宽度比例" />
          <Switch label="edge 跟随宽度" checked={p.followEdge} onChange={(v) => set("followEdge", v)} />
          {!p.followEdge ? (
            <Knob label="edge" value={p.edge} min={0} max={4} step={0.05} onChange={(v) => set("edge", v)} hint="越大，两侧边缘的毛糙越明显" />
          ) : null}
          <Switch label="显示骨架" checked={p.ghost} onChange={(v) => set("ghost", v)} />
          <Switch label="显示原始折线" checked={p.raw} onChange={(v) => set("raw", v)} />
        </>
      }
    />
  );
}

/* ---------------- B2 · 同参数下的种子家族 ---------------- */

function SeedFamily() {
  let [p, set] = useParams({
    width: 13,
    count: 18,
    wobble: 0.14,
    edge: 1.05,
    belly: 0.07,
    taperIn: 0.14,
    seedBase: 1,
  });
  let cols = 3;
  let rows = Math.ceil(p.count / cols);
  let cellW = 224;
  let cellH = 62;
  let svgW = cols * cellW + 40;
  let svgH = rows * cellH + 34;

  return (
    <DemoShell
      canvas={
        <Stage
          width={svgW}
          height={svgH}
          caption="同一组参数，18 个种子 —— 这就是手工感的分布"
        >
          {Array.from({ length: p.count }, (_, index) => {
            let col = index % cols;
            let row = Math.floor(index / cols);
            let x0 = 20 + col * cellW;
            let y0 = 22 + row * cellH + cellH / 2;
            let seed = p.seedBase + index * 7;
            let pts = [
              [x0, y0 - 5],
              [x0 + 62, y0 + 4],
              [x0 + 118, y0 - 6],
              [x0 + 182, y0 + 3],
            ];
            return (
              <path
                key={index}
                d={makeHandDrawnLine(pts, {
                  width: p.width,
                  seed,
                  taperIn: p.taperIn,
                  taperOut: 0.08,
                  startWidth: 0.14,
                  endWidth: 0.8,
                  belly: p.belly,
                  wobble: p.wobble,
                  edge: p.edge,
                  chisel: 0.35,
                })}
                fill="#141413"
                opacity={0.9}
              />
            );
          })}
        </Stage>
      }
      knobs={
        <>
          <Knob label="条数" value={p.count} min={3} max={24} step={3} onChange={(v) => set("count", v)} />
          <Knob label="width" value={p.width} min={2} max={30} step={0.5} onChange={(v) => set("width", v)} />
          <Knob label="wobble" value={p.wobble} min={0} max={0.8} step={0.01} onChange={(v) => set("wobble", v)} />
          <Knob label="edge" value={p.edge} min={0} max={4} step={0.05} onChange={(v) => set("edge", v)} />
          <Knob label="belly" value={p.belly} min={0} max={0.6} step={0.01} onChange={(v) => set("belly", v)} />
          <Knob label="taperIn" value={p.taperIn} min={0} max={0.5} step={0.01} onChange={(v) => set("taperIn", v)} />
          <p className="lab-hint">
            抖动来自 seed 而不是时间，所以来回滚动多少次都一样。
          </p>
        </>
      }
    />
  );
}

/* ---------------- B3 · 马克笔的三层结构 ---------------- */

function MarkerLayers() {
  let [p, set] = useParams({
    width: 26,
    seed: 5,
    opacity: 0.92,
    color: "#6A9BCC",
    core: false,
    streaks: false,
    paper: "#FAF9F5",
  });
  let width = 700;
  let height = 200;
  let pts = React.useMemo(
    () => [
      [70, 132],
      [230, 106],
      [400, 138],
      [560, 104],
      [630, 120],
    ],
    [],
  );
  let html = makeMarkerPath(pts, {
    width: p.width,
    seed: p.seed,
    color: p.color,
    opacity: p.opacity,
    paper: p.paper,
    taperIn: 0.12,
    taperOut: 0.1,
    startWidth: 0.16,
    endWidth: 0.7,
    belly: 0.08,
    wobble: 0.12,
    chisel: 0.3,
    core: p.core,
    streaks: p.streaks,
  });

  return (
    <DemoShell
      canvas={
        <>
          <Stage
            width={width}
            height={height}
            caption={`width = ${p.width}`}
            html={`<g style="mix-blend-mode:multiply">${html}</g>`}
          />
          <div className="lab-btnbar" style={{ marginTop: 8 }}>
            {[
              ["width < 3.5", "只有主体"],
              ["width ≥ 3.5", "＋ core 笔芯"],
              ["width ≥ 14", "＋ 3 条 streaks 漏白"],
            ].map(([when, what], index) => (
              <span
                key={when}
                className="lab-chip"
                data-tone={
                  (index === 0 && p.width < 3.5) ||
                  (index === 1 && p.core && p.width >= 3.5 && (p.width < 14 || !p.streaks)) ||
                  (index === 2 && p.streaks && p.width >= 14)
                    ? "core"
                    : undefined
                }
              >
                {when} → {what}
              </span>
            ))}
          </div>
        </>
      }
      knobs={
        <>
          <Knob
            label="width"
            value={p.width}
            min={0.5}
            max={44}
            step={0.5}
            onChange={(v) => set("width", v)}
            hint="先开启对应开关；笔宽达到 3.5 出现笔芯，达到 14 出现漏白"
          />
          <Knob label="seed" value={p.seed} min={1} max={40} step={1} onChange={(v) => set("seed", v)} />
          <Knob label="opacity" value={p.opacity} min={0.2} max={1} step={0.02} onChange={(v) => set("opacity", v)} />
          <Switch label="core 笔芯层" checked={p.core} onChange={(v) => set("core", v)} />
          <Switch label="streaks 漏白" checked={p.streaks} onChange={(v) => set("streaks", v)} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            {["#6A9BCC", "#788C5D", "#C46686", "#D97757"].map((color) => (
              <button
                key={color}
                type="button"
                className="lab-btn"
                style={{ background: color, borderColor: color, height: 26 }}
                onClick={() => set("color", color)}
                aria-label={`换成 ${color}`}
              />
            ))}
          </div>
          <p className="lab-hint">
            core 添加深色笔芯，streaks 添加纸色漏白。两者都可以独立关闭。
          </p>
        </>
      }
    />
  );
}

/* ---------------- B4 · 干笔分段 ---------------- */

function DryBrush() {
  let [p, set] = useParams({
    width: 11,
    seed: 4,
    dashLength: 37,
    gap: 18,
    opacity: 1,
    neat: false,
    landOnEnd: true,
  });
  let width = 700;
  let height = 214;
  let pts = React.useMemo(
    () => [
      [60, 74],
      [250, 62],
      [440, 92],
      [640, 66],
    ],
    [],
  );
  let second = React.useMemo(
    () => [
      [60, 158],
      [250, 146],
      [440, 176],
      [640, 150],
    ],
    [],
  );

  let loose = at(pts, {
    width: p.width,
    seed: p.seed,
    color: "#141413",
    dashLength: p.dashLength,
    gap: p.gap,
    opacity: p.opacity,
    neat: false,
    landOnEnd: p.landOnEnd,
  });
  let neat = at(second, {
    width: p.width,
    seed: p.seed,
    color: "#87867F",
    dashLength: p.dashLength,
    gap: p.gap,
    opacity: p.opacity,
    neat: true,
    landOnEnd: p.landOnEnd,
  });

  return (
    <DemoShell
      canvas={
        <Stage
          width={width}
          height={height}
          caption="上一行：neat = false（手绘）　下一行：neat = true（网格线）"
          html={
            `<g style="mix-blend-mode:multiply">` +
            loose.join("") +
            `</g><g>${neat.join("")}</g>`
          }
        />
      }
      knobs={
        <>
          <Knob label="width" value={p.width} min={1} max={26} step={0.5} onChange={(v) => set("width", v)} />
          <Knob
            label="dashLength"
            value={p.dashLength}
            min={3}
            max={120}
            step={1}
            onChange={(v) => set("dashLength", v)}
            hint="从 makeMarkerStroke 默认的 3.4×width 起步更自然"
          />
          <Knob label="gap" value={p.gap} min={0} max={90} step={1} onChange={(v) => set("gap", v)} />
          <Knob label="opacity" value={p.opacity} min={0.2} max={1} step={0.02} onChange={(v) => set("opacity", v)} />
          <Switch label="landOnEnd（落笔）" checked={p.landOnEnd} onChange={(v) => set("landOnEnd", v)} />
          <dl className="lab-readout">
            <dt>松散段数</dt>
            <dd>{loose.length}</dd>
            <dt>整齐段数</dt>
            <dd>{neat.length}</dd>
            <dt>样本数 t6</dt>
            <dd>{t6(pts, {})}</dd>
          </dl>
          <p className="lab-hint">
            对比两行：neat 收紧各段的变化，让同一套笔触更规整。
          </p>
        </>
      }
    />
  );
}

/* ---------------- B5 · 噪点滤镜配方台 ---------------- */

/* 原文里写死的三档配方，照抄自 SectionLaborShare.jsx 的 MarkerFilters。 */
const FIXTURES = [
  {
    key: "rule",
    label: "mk-rule",
    desc: "细线几乎不碎",
    def: { baseFrequency: 0.72, numOctaves: 2, seed: 5, k3: -0.12, warpFrequency: 0.07, scale: 0.6 },
  },
  {
    key: "marker",
    label: "mk-marker",
    desc: "中等破碎",
    def: { baseFrequency: 0.55, numOctaves: 2, seed: 7, k3: -0.3, warpFrequency: 0.11, scale: 2.6 },
  },
  {
    key: "dry",
    label: "mk-dry",
    desc: "碎成颗粒",
    def: { baseFrequency: 0.9, numOctaves: 2, seed: 4, k3: -0.55, warpFrequency: 0.18, scale: 1.8 },
  },
];

function FilterBench() {
  let [p, set] = useParams({
    baseFrequency: 0.55,
    numOctaves: 3,
    seed: 7,
    k3: -0.3,
    warpFrequency: 0.11,
    scale: 2.6,
  });
  let ids = useIds("bench", ["custom"]);
  let defs = React.useMemo(
    () => [
      {
        id: ids.custom,
        baseFrequency: p.baseFrequency,
        numOctaves: p.numOctaves,
        seed: p.seed,
        k3: p.k3,
        warpFrequency: p.warpFrequency,
        scale: p.scale,
      },
    ],
    [ids, p],
  );

  /* 前三列直接用页面里真实注册的滤镜 id（由 <MarkerFilters /> 提供），
     只有最后一列是现场生成的。 */
  let columns = [
    { key: "none", label: "无滤镜", caption: "原样输出", filterId: null },
    ...FIXTURES.map((fixture) => ({
      key: fixture.key,
      label: fixture.label,
      caption: fixture.desc,
      filterId: `mk-${fixture.key}`,
    })),
    { key: "custom", label: "你的配方", caption: "下面六个旋钮", filterId: ids.custom },
  ];

  let colW = 138;
  let width = colW * columns.length + 24;
  let height = 250;
  let stroke = [
    [18, 54],
    [68, 40],
    [118, 64],
  ];

  return (
    <>
      <FilterDefs defs={defs} />
      <DemoShell
        canvas={
          <Stage width={width} height={height} caption="同一个笔触 + 一条细线，五套滤镜配方">
            {columns.map((column, index) => {
              let x = 12 + index * colW;
              let html =
                `<g style="mix-blend-mode:multiply"` +
                (column.filterId ? ` filter="url(#${column.filterId})"` : "") +
                ">" +
                makeMarkerPath(
                  stroke.map(([sx, sy]) => [x + sx, sy]),
                  { width: 17, seed: 9, color: "#141413", opacity: 0.9, paper: "#FAF9F5" },
                ) +
                makeMarkerPath(
                  [
                    [x + 18, 150],
                    [x + 72, 146],
                    [x + 118, 152],
                  ],
                  {
                    width: 1.6,
                    seed: 12,
                    color: "#87867F",
                    opacity: 0.72,
                    paper: "#FAF9F5",
                    core: false,
                  },
                ) +
                "</g>";
              return (
                <g key={column.key}>
                  <g dangerouslySetInnerHTML={{ __html: html }} />
                  <text
                    x={x + 18}
                    y={196}
                    fontFamily={MONO}
                    fontSize={11}
                    fill={column.key === "custom" ? "#d97757" : RULE}
                  >
                    {column.label}
                  </text>
                  <text x={x + 18} y={212} fontFamily={MONO} fontSize={10.5} fill="#b0aea5">
                    {column.caption}
                  </text>
                  {column.key === "custom" ? (
                    <text x={x + 18} y={226} fontFamily={MONO} fontSize={10.5} fill="#b0aea5">
                      {`k3 ${p.k3}`}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </Stage>
        }
        knobs={
          <>
            <p className="lab-hint" style={{ marginTop: 0 }}>
              下面这组旋钮只作用在最右一列。
            </p>
            <Knob
              label="baseFrequency"
              value={p.baseFrequency}
              min={0.05}
              max={1.4}
              step={0.01}
              onChange={(v) => set("baseFrequency", v)}
              hint="噪点颗粒的密度。越大颗粒越碎"
            />
            <Knob label="numOctaves" value={p.numOctaves} min={1} max={5} step={1} onChange={(v) => set("numOctaves", v)} />
            <Knob label="seed" value={p.seed} min={1} max={60} step={1} onChange={(v) => set("seed", v)} />
            <Knob
              label="k3（吃边强度）"
              value={p.k3}
              min={-0.9}
              max={0}
              step={0.01}
              onChange={(v) => set("k3", v)}
              hint="feComposite 的第三项。越负，边缘被噪点吃掉的越多"
            />
            <Knob label="warpFrequency" value={p.warpFrequency} min={0.02} max={0.4} step={0.01} onChange={(v) => set("warpFrequency", v)} />
            <Knob
              label="scale（位移量）"
              value={p.scale}
              min={0}
              max={8}
              step={0.1}
              onChange={(v) => set("scale", v)}
              hint="feDisplacementMap：把边缘整体扭一扭"
            />
          </>
        }
      />
    </>
  );
}

/* ---------------- B6 · multiply 叠加 ---------------- */

function BlendStack() {
  let [p, set] = useParams({ count: 9, opacity: 0.5, width: 13, seed: 2 });
  let width = 700;
  let height = 224;
  let lines = React.useMemo(
    () =>
      Array.from({ length: p.count }, (_, index) => {
        let t = p.count === 1 ? 0.5 : index / (p.count - 1);
        return [
          [90 + t * 40, 40 + t * 140],
          [270 + t * 60, 40 + t * 140],
          [470 - t * 30, 40 + t * 140],
          [620 + t * 30, 40 + t * 140],
        ];
      }),
    [p.count],
  );

  let build = (dx) =>
    lines
      .map((pts) => {
        let html = makeMarkerPath(
          pts.map(([x, y]) => [x + dx, y]),
          {
            width: p.width,
            seed: p.seed + Math.round(pts[0][0]) % 17,
            color: "#6A9BCC",
            opacity: p.opacity,
            paper: "#FAF9F5",
            taperIn: 0.16,
            taperOut: 0.16,
            core: false,
          },
        );
        return html;
      })
      .join("");

  return (
    <DemoShell
      canvas={
        <Stage
          width={width}
          height={height}
          caption="左：默认叠加（会出现盖住的白边）　右：mix-blend-mode: multiply"
          html={
            `<g>${build(0)}</g>` +
            `<g style="mix-blend-mode:multiply">${build(340)}</g>` +
            `<text x="90" y="212" font-family="${MONO}" font-size="11" fill="${RULE}">normal</text>` +
            `<text x="430" y="212" font-family="${MONO}" font-size="11" fill="#d97757">multiply</text>`
          }
        />
      }
      knobs={
        <>
          <Knob label="条数" value={p.count} min={2} max={14} step={1} onChange={(v) => set("count", v)} />
          <Knob label="opacity" value={p.opacity} min={0.1} max={1} step={0.02} onChange={(v) => set("opacity", v)} />
          <Knob label="width" value={p.width} min={3} max={26} step={0.5} onChange={(v) => set("width", v)} />
          <Knob label="seed" value={p.seed} min={1} max={30} step={1} onChange={(v) => set("seed", v)} />
          <p className="lab-hint">
            所有笔触都用 <InlineCode>mix-blend-mode: multiply</InlineCode> 叠在纸色上。
            这是水彩感的来源：重叠处颜色相乘变深，而不是互相盖住。
          </p>
        </>
      }
    />
  );
}

export {
  HandDrawnAnatomy,
  SeedFamily,
  MarkerLayers,
  DryBrush,
  FilterBench,
  BlendStack,
};
