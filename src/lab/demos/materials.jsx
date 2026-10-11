import * as React from "react";
import { clampRange } from "../../recovered/drawing-noise.jsx";
import { ar, an, au, ao } from "../../recovered/drawing-grid.jsx";
import { aL, aM } from "../../recovered/drawing-tasks.jsx";
import { STAGE_PAPER } from "./papers.js";
import { Stage } from "../ui/Stage.jsx";
import { Knob, Switch, Seg, useParams } from "../ui/Controls.jsx";
import { DemoShell } from "../ui/Card.jsx";

const MONO = "var(--anthropic-mono), monospace";
const RULE = "#87867F";

/* ---------------- C1 · 纸张方格 ---------------- */

function PaperGrid() {
  let [p, set] = useParams({
    cell: 26,
    rag: 26,
    heavyEvery: 4,
    weight: 1.2,
    opacity: 0.24,
    color: "#87867F",
  });
  let width = 700;
  let height = 246;

  let lines = React.useMemo(
    () => ar(0, 0, width, height, { cell: p.cell, rag: p.rag, heavyEvery: p.heavyEvery }),
    [p.cell, p.rag, p.heavyEvery, width, height],
  );
  let html = React.useMemo(
    () => lines.map((line) => an(line, { color: p.color, weight: p.weight, opacity: p.opacity })).join(""),
    [lines, p.color, p.weight, p.opacity],
  );

  return (
    <DemoShell
      canvas={
      <div className="lab-grid-comparison">
      <div
        style={{
          height: 96,
          marginBottom: 10,
          border: "1px solid var(--border-faint)",
          borderRadius: 3,
          backgroundColor: STAGE_PAPER,
          backgroundImage:
            "repeating-linear-gradient(0deg, #87867F 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, #87867F 0 1px, transparent 1px 26px)",
          opacity: 0.85,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 8,
            top: 6,
            fontFamily: MONO,
            fontSize: 10,
            color: RULE,
          }}
        >
          规则网格 / 手绘网格
        </span>
      </div>
          <Stage
            width={width}
            height={height}
            caption={`ar + an　cell ${p.cell} / rag ${p.rag} / heavyEvery ${p.heavyEvery}`}
            html={html}
            filter="url(#mk-rule)"
          />
      </div>
        }
        knobs={
          <>
            <Knob
              label="cell"
              value={p.cell}
              min={12}
              max={64}
              step={1}
              onChange={(v) => set("cell", v)}
              hint="格距。原页面正文用 26，与正文行高呼应"
            />
            <Knob
              label="rag"
              value={p.rag}
              min={0}
              max={60}
              step={1}
              onChange={(v) => set("rag", v)}
              hint="每条线两端各自独立地横向/纵向偏这么多像素"
            />
            <Knob
              label="heavyEvery"
              value={p.heavyEvery}
              min={0}
              max={8}
              step={1}
              onChange={(v) => set("heavyEvery", v)}
              hint="每 N 条加粗一格；0 = 全部一样粗。这是「作业本」节奏的来源"
            />
            <Knob label="weight" value={p.weight} min={0.3} max={3} step={0.1} onChange={(v) => set("weight", v)} />
            <Knob label="opacity" value={p.opacity} min={0.04} max={0.7} step={0.02} onChange={(v) => set("opacity", v)} />
            <Seg label="线色" value={p.color} onChange={(v) => set("color", v)} options={[
              { value: "#87867F", label: "灰" },
              { value: "#788C5D", label: "绿" },
              { value: "#6A9BCC", label: "蓝" },
            ]} />
            <dl className="lab-readout">
              <dt>线数</dt>
              <dd>{lines.length}</dd>
              <dt>加粗线</dt>
              <dd>{lines.filter((line) => line.heavy).length}</dd>
            </dl>
          </>
        }
      />
  );
}

/* ---------------- C2 · 网格挖洞 ---------------- */

function GridHoles() {
  let [p, set] = useParams({
    cell: 26,
    jut: 12,
    edgeShort: 130,
    minPiece: 0,
    opacity: 0.34,
    box: { x: 236, y: 62, w: 248, h: 118 },
  });
  let width = 700;
  let height = 250;
  let drag = React.useRef(null);
  let svgRef = React.useRef(null);

  let result = React.useMemo(
    () =>
      au(
        width,
        height,
        { cell: p.cell, jut: p.jut, edgeShort: p.edgeShort, minPiece: p.minPiece },
        [
          {
            left: p.box.x,
            top: p.box.y,
            right: p.box.x + p.box.w,
            bottom: p.box.y + p.box.h,
          },
        ],
      ),
    [width, height, p.cell, p.jut, p.edgeShort, p.minPiece, p.box],
  );

  let visibleHtml = React.useMemo(
    () => result.visible.map((line) => an(line, { opacity: p.opacity }, undefined)).join(""),
    [result.visible, p.opacity],
  );
  let patchHtml = React.useMemo(
    () =>
      result.patch
        .map((line) => an(line, { opacity: p.opacity * 0.5, color: "#c9a37a" }))
        .join(""),
    [result.patch, p.opacity],
  );

  let onDown = (event) => {
    let svg = svgRef.current;
    if (!svg) return;
    drag.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      box: p.box,
      scale: width / svg.getBoundingClientRect().width,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  let onMove = (event) => {
    if (!drag.current) return;
    let { pointerX, pointerY, box, scale } = drag.current;
    let dx = (event.clientX - pointerX) * scale;
    let dy = (event.clientY - pointerY) * scale;
    set("box", {
      ...box,
      x: Math.round(clampRange(box.x + dx, 0, width - box.w)),
      y: Math.round(clampRange(box.y + dy, 0, height - box.h)),
    });
  };
  let onUp = () => {
    drag.current = null;
  };

  return (
    <DemoShell
      canvas={
        <div className="lab-canvas">
          <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="网格挖洞示例">
            <g filter="url(#mk-rule)">
              <g dangerouslySetInnerHTML={{ __html: visibleHtml }} />
              <g dangerouslySetInnerHTML={{ __html: patchHtml }} />
            </g>
            <rect
              x={p.box.x}
              y={p.box.y}
              width={p.box.w}
              height={p.box.h}
              fill="rgba(217, 119, 87, 0.10)"
              stroke="#d97757"
              strokeWidth={1}
              strokeDasharray="5 4"
              style={{ cursor: "grab" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
            <text
              x={p.box.x + 10}
              y={p.box.y + 20}
              fontFamily={MONO}
              fontSize={11}
              fill="#d97757"
              style={{ pointerEvents: "none" }}
            >
              拖我
            </text>
          </svg>
          <span className="lab-canvas__cap">拖动方块，看网格自己让路</span>
        </div>
      }
      knobs={
        <>
          <Knob
            label="cell"
            value={p.cell}
            min={13}
            max={52}
            step={1}
            onChange={(v) => set("cell", v)}
            hint="障碍块的边界会先被吸附到格线上，再按格切分线段"
          />
          <Knob
            label="jut"
            value={p.jut}
            min={0}
            max={30}
            step={0.5}
            onChange={(v) => set("jut", v)}
            hint="每段线的端点各让开这么远，让断口不是齐齐一刀"
          />
          <Knob
            label="edgeShort"
            value={p.edgeShort}
            min={0}
            max={200}
            step={5}
            onChange={(v) => set("edgeShort", v)}
            hint="离纸张边缘越近的线越短，形成渐隐的边界"
          />
          <Knob
            label="minPiece"
            value={p.minPiece}
            min={0}
            max={60}
            step={1}
            onChange={(v) => set("minPiece", v)}
            hint="比这个长度还短的碎段直接丢掉"
          />
          <Knob label="opacity" value={p.opacity} min={0.06} max={0.7} step={0.02} onChange={(v) => set("opacity", v)} />
          <dl className="lab-readout">
            <dt>露出线段</dt>
            <dd>{result.visible.length}</dd>
            <dt>补丁线段</dt>
            <dd>{result.patch.length}</dd>
          </dl>
          <p className="lab-hint">
            橙色是 patch 层：被障碍压住的那一小段会用更浅的笔触补回来，
            所以内容块周围不会出现一块生硬的空白。
          </p>
        </>
      }
    />
  );
}

/* ---------------- C3 · 墨块 ---------------- */

const BLOB_COLORS = ["#C4D9EA", "#B3C1A0", "#D89EB0", "#E3DACC", "#BDBAAE"];

function InkBlob() {
  let [p, set] = useParams({
    h0: 62,
    h1: 82,
    c0: "#B3C1A0",
    c1: "#788C5D",
    context: false,
    seed: 6,
    samples: 44,
    opacity: 0.64,
    pressure: true,
    rim: true,
    dashedEdges: false,
  });
  let width = 700;
  let height = 250;

  let html = React.useMemo(
    () =>
      ao({
        x0: 68,
        y0: 78,
        x1: 632,
        y1: 88,
        h0: p.h0,
        h1: p.h1,
        c0: p.c0,
        c1: p.c1,
        seed: p.seed,
        samples: p.samples,
        opacity: p.opacity,
        pressure: p.pressure,
        rim: p.rim,
        dashedEdges: p.dashedEdges,
        edgeWidth: 3,
      }),
    [p],
  );

  return (
    <DemoShell
      canvas={
        <Stage width={width} height={height} caption="平行笔触叠成水彩色带">
          {p.context ? <g filter="url(#mk-rule)" dangerouslySetInnerHTML={{ __html:
            ar(0, 0, width, height, { cell: 26, rag: 20, heavyEvery: 4 }).map((line) => an(line, { opacity: 0.14 })).join("")
          }} /> : null}
          <g style={{ mixBlendMode: "multiply", isolation: "isolate" }} dangerouslySetInnerHTML={{ __html: html }} />
          {p.context ? <text x="94" y="130" fontFamily="var(--anthropic-serif)" fontSize="28" fill="#30302e">One possible future</text> : null}
        </Stage>
      }
      knobs={
        <>
          <Seg label="观察方式" value={p.context} onChange={(v) => set("context", v)} options={[
            { value: false, label: "单独看" }, { value: true, label: "放回画面" },
          ]} />
          <Knob label="h0（左端厚度）" value={p.h0} min={20} max={150} step={1} onChange={(v) => set("h0", v)} />
          <Knob label="h1（右端厚度）" value={p.h1} min={20} max={150} step={1} onChange={(v) => set("h1", v)} />
          <Seg
            label="左端色 c0"
            value={p.c0}
            onChange={(v) => set("c0", v)}
            options={BLOB_COLORS.slice(0, 3).map((c) => ({ value: c, label: ["蓝", "绿", "粉"][BLOB_COLORS.indexOf(c)] }))}
          />
          <Seg
            label="右端色 c1"
            value={p.c1}
            onChange={(v) => set("c1", v)}
            options={[
              { value: p.c0, label: "同色" },
              { value: "#6A9BCC", label: "蓝" },
              { value: "#788C5D", label: "绿" },
              { value: "#C46686", label: "粉" },
            ]}
          />
          <Knob label="seed" value={p.seed} min={1} max={30} step={1} onChange={(v) => set("seed", v)} />
          <Knob
            label="samples"
            value={p.samples}
            min={8}
            max={120}
            step={2}
            onChange={(v) => set("samples", v)}
            hint="上下边界的采样点数；太少可能出现折角"
          />
          <Knob label="opacity" value={p.opacity} min={0.1} max={0.9} step={0.02} onChange={(v) => set("opacity", v)} />
          <Switch label="pressure 压力条痕" checked={p.pressure} onChange={(v) => set("pressure", v)} />
          <Switch label="rim 边缘加重" checked={p.rim} onChange={(v) => set("rim", v)} />
          <Switch label="dashedEdges 干笔描边" checked={p.dashedEdges} onChange={(v) => set("dashedEdges", v)} />
          <p className="lab-hint">
            调两端颜色看渐变；开启 pressure 或 rim，观察表面和边缘的变化。
          </p>
        </>
      }
    />
  );
}

/* ---------------- C4 · 值噪声斑块 ---------------- */

function WashBlob() {
  let [p, set] = useParams({
    core: aM.core,
    edge: aM.edge,
    coreRadius: aM.coreRadius,
    blob: aM.blob,
    gain: aM.gain,
    scale: 1,
    ink: "#6A9BCC",
    size: 96,
  });
  let canvasRef = React.useRef(null);
  let logicalW = 300;
  let logicalH = 168;

  React.useEffect(() => {
    let canvas = canvasRef.current;
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;
    let image = ctx.createImageData(logicalW, logicalH);
    let rgb = [parseInt(p.ink.slice(1, 3), 16), parseInt(p.ink.slice(3, 5), 16), parseInt(p.ink.slice(5, 7), 16)];
    let rx = p.size;
    let ry = p.size * 0.56;
    for (let py = 0; py < logicalH; py++) {
      for (let px = 0; px < logicalW; px++) {
        let x = px - logicalW / 2;
        let y = py - logicalH / 2;
        let outer = aL(x, y, rx, ry, { ...aM, core: p.core, edge: p.edge, coreRadius: p.coreRadius, blob: p.blob, gain: p.gain }, p.scale);
        let inner = outer && aL(x * 1.8, y * 1.8, rx, ry, { ...aM, core: p.core, edge: p.edge, coreRadius: p.coreRadius, blob: p.blob, gain: p.gain }, p.scale);
        let index = (py * logicalW + px) * 4;
        if (!outer) {
          image.data[index] = 250;
          image.data[index + 1] = 249;
          image.data[index + 2] = 245;
          image.data[index + 3] = 255;
        } else {
          let alpha = inner ? 0.62 : 0.24;
          image.data[index] = Math.round(250 + (rgb[0] - 250) * alpha);
          image.data[index + 1] = Math.round(249 + (rgb[1] - 249) * alpha);
          image.data[index + 2] = Math.round(245 + (rgb[2] - 245) * alpha);
          image.data[index + 3] = 255;
        }
      }
    }
    ctx.putImageData(image, 0, 0);
  }, [p]);

  return (
    <DemoShell
      canvas={
        <div className="lab-canvas">
          <canvas
            ref={canvasRef}
            width={logicalW}
            height={logicalH}
            style={{ display: "block", width: "100%", maxWidth: 460, height: "auto", marginInline: "auto", imageRendering: "pixelated" }}
          />
          <span className="lab-canvas__cap">aL —— 每个像素判一次「这里该不该有颜料」</span>
        </div>
      }
      knobs={
        <>
          <Knob
            label="blob（噪点波长）"
            value={p.blob}
            min={2}
            max={40}
            step={0.5}
            onChange={(v) => set("blob", v)}
            hint="第一层值噪声的格距。越大斑块越舒展"
          />
          <Knob
            label="gain"
            value={p.gain}
            min={0.5}
            max={6}
            step={0.1}
            onChange={(v) => set("gain", v)}
            hint="拉开噪声值的差异，改变斑块形状和碎片分布"
          />
          <Knob label="core（中心阈值）" value={p.core} min={0} max={1} step={0.01} onChange={(v) => set("core", v)} />
          <Knob label="edge（边缘阈值）" value={p.edge} min={0} max={1} step={0.01} onChange={(v) => set("edge", v)} />
          <Knob
            label="coreRadius"
            value={p.coreRadius}
            min={0.05}
            max={0.95}
            step={0.01}
            onChange={(v) => set("coreRadius", v)}
            hint="超过这个范围后，从中心阈值逐渐过渡到边缘阈值"
          />
          <Knob label="scale（覆盖程度）" value={p.scale} min={0.3} max={1.6} step={0.02} onChange={(v) => set("scale", v)} />
          <Knob label="size（半径）" value={p.size} min={30} max={150} step={2} onChange={(v) => set("size", v)} />
          <Seg
            label="颜料"
            value={p.ink}
            onChange={(v) => set("ink", v)}
            options={[
              { value: "#6A9BCC", label: "蓝" },
              { value: "#788C5D", label: "绿" },
              { value: "#C46686", label: "品红" },
              { value: "#F0AC54", label: "橙" },
            ]}
          />
          <p className="lab-hint">
            判定是纯函数：两次值噪声加每像素一次哈希，没有状态，换尺寸也稳。
          </p>
        </>
      }
    />
  );
}

export { PaperGrid, GridHoles, InkBlob, WashBlob };
