import * as React from "react";
import { CodeBlock } from "../ui/ConceptHint.jsx";
import { a7 as FAMILY } from "../../recovered/HeroChart.jsx";
import { makeHandDrawnLine, hashNoise, clampRange } from "../../recovered/drawing-noise.jsx";
import { at, makeMarkerStroke } from "../../recovered/drawing-strokes.jsx";
import { ar, an } from "../../recovered/drawing-grid.jsx";
import { SCENARIO_PALETTES, pickPaletteShade } from "../../recovered/palette.jsx";
import { Knob, useParams, ControlsPanel } from "../ui/Controls.jsx";
import { CopyButton } from "../ui/Snippet.jsx";

const PAGE_W = 840;
const PAGE_H = 480;
const PAD = 56;

const LAYERS = [
  { key: "paper", name: "纸张底色", desc: "浅纸色作为所有图层的背景", source: "palette.jsx" },
  { key: "grid", name: "方格网格", desc: "用手绘格线建立背景", source: "drawing-grid.jsx" },
  { key: "ruleFilter", name: "细线滤镜", desc: "给格线加轻微的颗粒", source: "SectionLaborShare.jsx" },
  { key: "skeleton", name: "曲线骨架", desc: "把路径骨架扩成连续笔画", source: "drawing-noise.jsx" },
  { key: "dry", name: "干笔分段", desc: "把连续笔画改成断续小段", source: "drawing-strokes.jsx" },
  { key: "markerFilter", name: "马克笔滤镜", desc: "给笔触加颗粒和边缘变化", source: "SectionLaborShare.jsx" },
  { key: "multiply", name: "multiply 混合", desc: "让重叠区域变深", source: "drawing-strokes.jsx t8()" },
  { key: "copy", name: "文案层", desc: "在画面上方单独添加文字", source: "SectionProse.css" },
];

function AssemblyPage({ lit }) {
  let xOf = (year) => PAD + ((year - 2026) / 4) * (PAGE_W - PAD * 2);
  let yOf = (growth) => PAGE_H - 74 - ((growth - 2.2) / 11.5) * (PAGE_H - 130);

  let grid = React.useMemo(() => {
    let lines = ar(0, 0, PAGE_W, PAGE_H, { cell: 26, rag: 34, heavyEvery: 4 });
    return lines.map((line) => an(line, { opacity: 0.26 })).join("");
  }, []);

  let picks = React.useMemo(() => {
    let out = [];
    for (let index = 0; index < 9; index++) out.push(FAMILY[Math.round((index * (FAMILY.length - 1)) / 8)]);
    return out;
  }, []);

  return (
    <div style={{ position: "relative", background: lit.paper ? "#FAF9F5" : "#fff", overflow: "hidden" }}>
      <svg viewBox={`0 0 ${PAGE_W} ${PAGE_H}`} style={{ display: "block", width: "100%" }}>
        {lit.grid ? (
          <g filter={lit.ruleFilter ? "url(#mk-rule)" : undefined} dangerouslySetInnerHTML={{ __html: grid }} />
        ) : null}
        {lit.skeleton || lit.dry ? (
          <g filter={lit.markerFilter ? "url(#mk-marker)" : undefined} style={lit.multiply ? { mixBlendMode: "multiply", isolation: "isolate" } : undefined}>
            {picks.map((line, index) => {
              let points = line.pts.map(([year, growth]) => [xOf(year), yOf(growth)]);
              let color = pickPaletteShade(SCENARIO_PALETTES[line.family], hashNoise(3.7 * index + 1.9));
              if (!lit.dry) {
                return (
                  <path
                    key={index}
                    d={makeHandDrawnLine(points, {
                      width: 4.6,
                      seed: index * 9 + 2,
                      taperIn: 0.1,
                      taperOut: 0.12,
                      startWidth: 0.2,
                      endWidth: 0.6,
                      belly: 0.05,
                      wobble: 0.12,
                      chisel: 0.3,
                    })}
                    fill={color}
                    opacity={0.88}
                  />
                );
              }
              let density = hashNoise(7.77 * index + 0.9);
              let html = at(points, {
                width: 4.6,
                color,
                seed: 13 * index + 1,
                dashLength: 6.2 + 1.6 * density,
                gap: 4.4 + 1.6 * density,
                samples: 120,
                opacity: 0.95,
              }).join("");
              return <g key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            })}
          </g>
        ) : null}
      </svg>
      {lit.copy ? (
        <div
          style={{
            position: "absolute",
            left: PAD,
            top: 40,
            width: 330,
            fontFamily: "var(--anthropic-serif), serif",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            What will our economic future look like?
          </h3>
          <p
            style={{
              margin: "14px 0 0",
              fontFamily: "var(--anthropic-sans), sans-serif",
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "#30302e",
            }}
          >
            We don&rsquo;t know yet how AI will reshape the economy. Will it lead to unprecedented growth?
            Widespread unemployment? Neither, or something else?
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Assembly() {
  let [p, set] = useParams({ level: LAYERS.length, playing: false });
  let frame = React.useRef(0);
  let lit = React.useMemo(() => {
    let out = {};
    LAYERS.forEach((layer, index) => {
      out[layer.key] = index < p.level;
    });
    return out;
  }, [p.level]);

  let play = () => {
    window.cancelAnimationFrame(frame.current);
    let start = performance.now();
    let step = (now) => {
      let level = clampRange(Math.floor((now - start) / 620), 0, LAYERS.length);
      set("level", level);
      if (level < LAYERS.length) frame.current = window.requestAnimationFrame(step);
    };
    set("level", 0);
    frame.current = window.requestAnimationFrame(step);
  };

  React.useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  return (
    <div className="lab-assembly">
      <div className="lab-demo-surface"><div className="lab-assembly__stage">
        <AssemblyPage lit={lit} />
      </div></div>
      <div className="lab-split">
        <div className="lab-assembly__layers">
          {LAYERS.map((layer, index) => (
            <div className="lab-layer" key={layer.key} data-on={index < p.level ? "true" : undefined}>
              <span className="lab-layer__dot" />
              <span className="lab-layer__name">{layer.name}</span>
              <span className="lab-layer__desc">
                {layer.desc}　<span className="lab-chip">{layer.source}</span>
              </span>
            </div>
          ))}
        </div>
        <ControlsPanel>
          <button type="button" className="lab-btn" onClick={play}>
            自动播放装配过程
          </button>
          <Knob
            label="已装配层数"
            value={p.level}
            min={0}
            max={LAYERS.length}
            step={1}
            onChange={(v) => set("level", v)}
          />
          <div className="lab-btnbar">
            {LAYERS.map((layer, index) => (
              <button
                key={layer.key}
                type="button"
                className="lab-btn"
                data-active={p.level === index + 1 ? "true" : undefined}
                onClick={() => set("level", index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="lab-hint">
            拖动层数，看每一层给这张示意画面增加什么。
          </p>
        </ControlsPanel>
      </div>
    </div>
  );
}

function BuildYourOwn() {
  let [p, set] = useParams({ width: 26, seed: 7, opacity: 0.92, taperIn: 0.14, belly: 0.07 });
  let points = [
    [40, 90],
    [200, 62],
    [360, 104],
    [520, 70],
    [660, 88],
  ];
  let code = [
    'import { makeMarkerStroke } from "./drawing-strokes.jsx";',
    'import { at } from "./drawing-strokes.jsx";',
    "",
    "const points = [",
    "  [40, 90], [200, 62], [360, 104], [520, 70], [660, 88],",
    "];",
    "",
    "// 1. 输入路径和参数，生成马克笔的 SVG 片段",
    "const stroke = makeMarkerStroke(points, {",
    `  width: ${p.width}, seed: ${p.seed}, color: "#141413",`,
    `  opacity: ${p.opacity}, taperIn: ${p.taperIn}, taperOut: 0.1,`,
    `  startWidth: 0.16, endWidth: 0.7, belly: ${p.belly},`,
    "  wobble: 0.12, chisel: 0.3, paper: \"#FAF9F5\",",
    "});",
    "",
    `const width = ${p.width};`,
    "// 2. 同一条路径可以拆成一组干笔片段",
    "const dry = at(points, {",
    `  width: ${p.width}, seed: ${p.seed}, color: "#141413",`,
    "  dashLength: 3.4 * width, gap: 1.6 * width, opacity: 1,",
    "  landOnEnd: true,",
    "});",
    "",
    "// 3. 收紧随机变化，同一套算法也能画更规整的线",
    "const gridLine = [[40, 140], [660, 140]];",
    "const rule = at(gridLine, { width: 1.6, neat: true, color: \"#87867F\" });",
    "",
    "// stroke 是 SVG 字符串，dry 和 rule 是分段字符串数组。",
    "// 显示时放入 svg 容器，纸色、CSS 和滤镜定义由页面配合。",
  ].join("\n");

  let html = makeMarkerStroke(points, {
    width: p.width,
    seed: p.seed,
    color: "#141413",
    opacity: p.opacity,
    taperIn: p.taperIn,
    taperOut: 0.1,
    startWidth: 0.16,
    endWidth: 0.7,
    belly: p.belly,
    wobble: 0.12,
    chisel: 0.3,
    paper: "#FAF9F5",
  });

  return (
    <div className="lab-assembly">
      <div className="lab-demo-surface"><div className="lab-assembly__stage">
        <svg viewBox="0 0 700 180" style={{ display: "block", width: "100%" }}>
          <g filter="url(#mk-marker)" style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
            <g dangerouslySetInnerHTML={{ __html: html }} />
          </g>
        </svg>
      </div></div>
      <div className="lab-split">
        <div>
          <CodeBlock className="lab-principle-code">{code}</CodeBlock>
        </div>
        <ControlsPanel>
          <Knob label="width" value={p.width} min={0.6} max={40} step={0.4} onChange={(v) => set("width", v)} />
          <Knob label="seed" value={p.seed} min={1} max={40} step={1} onChange={(v) => set("seed", v)} />
          <Knob label="opacity" value={p.opacity} min={0.2} max={1} step={0.02} onChange={(v) => set("opacity", v)} />
          <Knob label="taperIn" value={p.taperIn} min={0} max={0.5} step={0.01} onChange={(v) => set("taperIn", v)} />
          <Knob label="belly" value={p.belly} min={0} max={0.5} step={0.01} onChange={(v) => set("belly", v)} />
          <CopyButton text={code} label="复制这段代码" />
          <p className="lab-hint">
            这段示例说明点、参数与 SVG 片段之间的关系，不包含完整页面的容器、样式和滤镜定义。
          </p>
        </ControlsPanel>
      </div>
    </div>
  );
}

export { Assembly, BuildYourOwn, LAYERS, AssemblyPage };
