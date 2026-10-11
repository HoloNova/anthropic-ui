import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { ag, ax, a_, makeTaskSquare, av, ak, TASK_CELL_SIZE } from "../../recovered/drawing-tasks.jsx";
import { NEUTRAL_INK, AUGMENTATION_INK, AUTOMATION_INK } from "../../recovered/palette.jsx";
import { STAGE_PAPER } from "./papers.js";
import { Stage } from "../ui/Stage.jsx";
import { Knob, Switch, Seg, useParams } from "../ui/Controls.jsx";
import { DemoShell } from "../ui/Card.jsx";

const MONO = "var(--anthropic-mono), monospace";
const RULE = "#87867F";

function wrap(html) {
  return `<g style="mix-blend-mode:multiply">${html}</g>`;
}

/* ---------------- D1 · 水彩铺色 ---------------- */

function WashFill() {
  let [p, set] = useParams({
    seed: 3,
    strokeWidth: 24,
    finePass: false,
    pressure: true,
    mottle: true,
    rim: true,
    endScatter: 1,
    direction: "v",
    opacity: 0.96,
    ink: "#8AA16D",
  });
  let width = 700;
  let height = 274;
  let box = { x: 200, y: 26, w: 300, h: 222 };

  let result = React.useMemo(
    () =>
      a_(
        box.x,
        box.y,
        box.w,
        box.h,
        {
          seed: p.seed,
          direction: p.direction,
          strokeWidth: p.strokeWidth,
          finePass: p.finePass,
          color: p.ink,
          paper: STAGE_PAPER,
          pressure: p.pressure,
          mottle: p.mottle,
          rim: p.rim,
          endScatter: p.endScatter,
        },
        () => p.ink,
      ),
    [p, box.x, box.y, box.w, box.h],
  );

  let html =
    `<g opacity="${p.opacity}">${result.passes.join("")}</g>` + result.weather;

  return (
    <DemoShell
      canvas={
        <Stage
          width={width}
          height={height}
          caption={`passes ${result.passes.length} 条 · weather ${result.weather ? 1 : 0} 组`}
          html={wrap(html)}
        />
      }
      knobs={
        <>
          <Knob
            label="strokeWidth"
            value={p.strokeWidth}
            min={4}
            max={60}
            step={1}
            onChange={(v) => set("strokeWidth", v)}
            hint="改变单道笔触的宽度，铺满区域所需的笔数也会变化"
          />
          <Switch label="finePass" checked={p.finePass} onChange={(v) => set("finePass", v)} />
          <Switch label="pressure 压力痕" checked={p.pressure} onChange={(v) => set("pressure", v)} />
          <Switch label="mottle 斑驳" checked={p.mottle} onChange={(v) => set("mottle", v)} />
          <Switch label="rim 边缘" checked={p.rim} onChange={(v) => set("rim", v)} />
          <Knob
            label="endScatter"
            value={p.endScatter}
            min={0}
            max={3}
            step={0.1}
            onChange={(v) => set("endScatter", v)}
            hint="每条笔触起止点的随机伸缩量，0 = 每一条都齐平"
          />
          <Seg
            label="direction"
            value={p.direction}
            onChange={(v) => set("direction", v)}
            options={[
              { value: "v", label: "竖向" },
              { value: "h", label: "横向" },
            ]}
          />
          <Knob label="seed" value={p.seed} min={1} max={40} step={1} onChange={(v) => set("seed", v)} />
          <Knob label="opacity" value={p.opacity} min={0.3} max={1} step={0.02} onChange={(v) => set("opacity", v)} />
          <Seg
            label="颜料"
            value={p.ink}
            onChange={(v) => set("ink", v)}
            options={[
              { value: "#8AA16D", label: "绿" },
              { value: "#8BADCF", label: "蓝" },
              { value: "#CC7D98", label: "品红" },
              { value: "#B0AEA5", label: "灰" },
            ]}
          />
          <p className="lab-hint">
            先看底色，再开启表面痕迹，对比色块的变化。
          </p>
        </>
      }
    />
  );
}

/* ---------------- D2 · 三层痕迹分解 ---------------- */

const WEATHER_COLUMNS = [
  { key: "base", label: "只有 passes", pressure: false, mottle: false, rim: false },
  { key: "pressure", label: "+ pressure", pressure: true, mottle: false, rim: false },
  { key: "mottle", label: "+ mottle", pressure: false, mottle: true, rim: false },
  { key: "rim", label: "+ rim", pressure: false, mottle: false, rim: true },
];

function WeatherBreakdown() {
  let [p, set] = useParams({ width: 20, seed: 3, ink: "#8BADCF" });
  let colW = 178;
  let svgW = colW * WEATHER_COLUMNS.length + 30;
  let svgH = 250;
  let blockW = 128;
  let blockH = 150;

  return (
    <DemoShell
      canvas={
        <Stage
          width={svgW}
          height={svgH}
          caption="同一块颜料，一层一层拆开看"
          html={WEATHER_COLUMNS.map((column, index) => {
            let x = 20 + index * colW;
            let result = a_(
              x,
              blockW / 2 - 24,
              blockW,
              blockH,
              {
                seed: p.seed,
                color: p.ink,
                paper: STAGE_PAPER,
                strokeWidth: p.width,
                pressure: column.pressure,
                mottle: column.mottle,
                rim: column.rim,
              },
              () => p.ink,
            );
            return (
              `<g opacity="0.96">${result.passes.join("")}</g>` +
              result.weather +
              `<text x="${x + 12}" y="${blockH + 62}" font-family="${MONO}" font-size="11" fill="${
                index === 0 ? RULE : "#d97757"
              }">${column.label}</text>` +
              `<text x="${x + 12}" y="${blockH + 78}" font-family="${MONO}" font-size="10.5" fill="#b0aea5">${
                result.passes.length
              } 条</text>`
            );
          }).join("")}
          filter="url(#mk-marker)"
          groupStyle={{ mixBlendMode: "multiply", isolation: "isolate" }}
        />
      }
      knobs={
        <>
          <Knob label="strokeWidth" value={p.width} min={8} max={40} step={1} onChange={(v) => set("width", v)} />
          <Knob label="seed（四列共用）" value={p.seed} min={1} max={30} step={1} onChange={(v) => set("seed", v)} />
          <Seg
            label="颜料"
            value={p.ink}
            onChange={(v) => set("ink", v)}
            options={[
              { value: "#8BADCF", label: "蓝" },
              { value: "#8AA16D", label: "绿" },
              { value: "#CC7D98", label: "品红" },
            ]}
          />
          <p className="lab-hint">
            四列底色相同，用来分别观察 pressure、mottle 和 rim 的作用。
          </p>
        </>
      }
    />
  );
}

/* ---------------- D3 · 任务方格 ---------------- */

const TASK_INK_NAMES = { neutral: "中立", aug: "增强", auto: "自动化" };

function TaskSquares() {
  let [p, set] = useParams({
    cols: 8,
    rows: 4,
    seedBase: 12,
    split: 0.34,
    splitColor: "#6A9BCC",
    detailSeed: 5,
  });
  let cell = 46;
  let gap = 10;
  let svgW = p.cols * (cell + gap) + gap;
  let svgH = p.rows * (cell + gap) + gap;

  let grid = React.useMemo(() => {
    let counts = { neutral: 0, aug: 0, auto: 0 };
    let cells = Array.from({ length: p.cols * p.rows }, (_, index) => {
      let seed = p.seedBase + index * 13;
      let family = av(seed);
      counts[family] += 1;
      let color = ak(seed);
      let x = gap + (index % p.cols) * (cell + gap);
      let y = gap + Math.floor(index / p.cols) * (cell + gap);
      let passes = ag(0, 0, cell, cell, (i, total) => (i / total < p.split ? p.splitColor : color), {
        seed,
        paper: STAGE_PAPER,
      });
      return {
        key: index,
        x,
        y,
        color,
        html: `<g opacity="0.94">${passes.join("")}</g>` + ax(0, 0, cell, cell, { seed, color, paper: STAGE_PAPER }),
      };
    });
    return { cells, counts };
  }, [p.cols, p.rows, p.seedBase, p.split, p.splitColor]);
  let counts = grid.counts;

  let detail = React.useMemo(
    () => makeTaskSquare(p.detailSeed, TASK_CELL_SIZE, "#141413"),
    [p.detailSeed],
  );

  return (
    <DemoShell
      canvas={
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0,1fr) 240px" }}>
          <Stage
            width={svgW}
            height={svgH}
            caption="每格一个种子，颜色由哈希决定"
            filter="url(#mk-marker)"
            groupStyle={{ mixBlendMode: "multiply" }}
          >
            {grid.cells.map((record) => (
              <g key={record.key} transform={`translate(${record.x} ${record.y})`}>
                <rect x={-3} y={-3} width={cell + 6} height={cell + 6} fill="none" stroke="#e8e6dc" />
                <g dangerouslySetInnerHTML={{ __html: record.html }} />
              </g>
            ))}
          </Stage>
          <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <span className="lab-knobs__legend">单格放大 · makeTaskSquare</span>
            <div
              style={{
                background: STAGE_PAPER,
                border: "1px solid var(--border-faint)",
                borderRadius: 3,
                padding: 10,
              }}
            >
              <svg viewBox={`0 0 ${TASK_CELL_SIZE} ${TASK_CELL_SIZE}`} width="100%" role="img" aria-label="任务方格">
                <g filter="url(#mk-marker)" style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
                  <g
                    dangerouslySetInnerHTML={{
                      __html:
                        `<g opacity="0.94">${detail.passes.join("")}</g>` + detail.weather,
                    }}
                  />
                </g>
              </svg>
            </div>
            <dl className="lab-readout">
              <dt>中立 neutral</dt>
              <dd>
                {counts.neutral} · {NEUTRAL_INK}
              </dd>
              <dt>增强 aug</dt>
              <dd>
                {counts.aug} · {AUGMENTATION_INK}
              </dd>
              <dt>自动化 auto</dt>
              <dd>
                {counts.auto} · {AUTOMATION_INK}
              </dd>
              <dt>单格 passes</dt>
              <dd>{detail.passes.length} 条</dd>
            </dl>
          </div>
        </div>
      }
      knobs={
        <>
          <Knob label="列" value={p.cols} min={3} max={10} step={1} onChange={(v) => set("cols", v)} />
          <Knob label="行" value={p.rows} min={2} max={8} step={1} onChange={(v) => set("rows", v)} />
          <Knob label="seedBase" value={p.seedBase} min={1} max={80} step={1} onChange={(v) => set("seedBase", v)} />
          <Knob
            label="split（前段占比）"
            value={p.split}
            min={0}
            max={1}
            step={0.02}
            onChange={(v) => set("split", v)}
            hint="原文用它在同一格里表现「被自动化掉一部分」
"
          />
          <Knob label="detailSeed" value={p.detailSeed} min={1} max={30} step={1} onChange={(v) => set("detailSeed", v)} />
          <p className="lab-hint">
            <InlineCode>av(seed)</InlineCode> 用 <InlineCode>hashNoise</InlineCode> 把种子映射成三种颜色：
            小于 0.46 是中立、小于 0.76 是增强、否则是自动化。
          </p>
        </>
      }
    />
  );
}

export { WashFill, WeatherBreakdown, TaskSquares };
