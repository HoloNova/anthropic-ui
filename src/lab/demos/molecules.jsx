import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import {
  a7 as FAMILY,
  sl as FAN_DEFAULTS,
  st as SORTED,
  sa as MIN_END,
  ss as MAX_END,
} from "../../recovered/HeroChart.jsx";
import { hashNoise, tD, clampRange } from "../../recovered/drawing-noise.jsx";
import { at, makeMarkerStroke, makeMarkerPath } from "../../recovered/drawing-strokes.jsx";
import { ar, an } from "../../recovered/drawing-grid.jsx";
import { SCENARIO_PALETTES, pickPaletteShade } from "../../recovered/palette.jsx";
import { useScrollDraw } from "../../recovered/scroll-hooks.jsx";
import { ShareStrokes } from "../../recovered/ShareStrokes.jsx";
import { DropCap, l6 } from "../../recovered/DropCap.jsx";
import { STAGE_PAPER } from "./papers.js";
import { Stage } from "../ui/Stage.jsx";
import { Knob, Switch, Seg, useParams } from "../ui/Controls.jsx";
import { DemoShell } from "../ui/Card.jsx";

const MONO = "var(--anthropic-mono), monospace";
const RULE = "#87867F";

/* ---------------- F1 · 扇形绽放 ---------------- */

/* 布局算法复刻自 HeroChart.jsx:218-319 的 useMemo。
   曲线族 FAMILY、排序 SORTED、参数默认值 FAN_DEFAULTS 都是原文导出的真实对象。 */
function buildFan(width, height, contentX, s) {
  let centerY = height / 2;
  let startGap = s.startGap;
  let startX = startGap - s.startHide;
  let fanLength = Math.max(1, s.fanLen * contentX - startX);
  let reach = clampRange(fanLength / 1.15, height * s.fanReach, 2.2 * height);
  let bloomSpan = Math.min(fanLength, 1.15 * reach);
  let pxPerYear = bloomSpan / 5.28;
  let spreadBase = Math.pow(1.32, s.bloom) + s.startSpread;
  let halfRange = reach / 2 / spreadBase;
  let toX = (year) => startX + (year - 2026) * pxPerYear;
  let lineCount = clampRange(
    Math.round((2 * halfRange * spreadBase) / (4.3 * Math.max(0.2, s.linePitch))),
    16,
    FAMILY.length,
  );
  let picks = Array.from({ length: lineCount }, (_, index) =>
    SORTED[lineCount > 1 ? Math.round((index * (FAMILY.length - 1)) / (lineCount - 1)) : 0],
  );

  return {
    centerY,
    clipX: startGap,
    lineCount,
    runs: picks.map((pick, index) => {
      let line = FAMILY[pick];
      let laneIndex = (Math.floor(index / 2) + 0.5) / Math.ceil(lineCount / 2);
      let lanePos =
        ((0.5 + clampRange((line.end - MIN_END) / (MAX_END - MIN_END), 0, 1) * (lineCount - 1)) / lineCount) *
          (1 - s.spacing) +
        laneIndex * s.spacing;
      let side =
        (index % 2 === 0 ? -1 : 1) *
        clampRange(lanePos + (hashNoise(9.1 * pick + 4.4) - 0.5) * 0.012, 0, 1.02);
      let extent =
        (hashNoise(2.7 * pick + 5) < s.fullRuns
          ? 1
          : 0.5 + 0.5 * Math.pow(hashNoise(4.41 * pick + 8.7), 0.8)) * 1.32;
      let feather = extent * s.startFeather * hashNoise(1.37 * pick + 3.3);
      let curve = s.bloom + (line.curve - s.bloom) * (1 - s.curveSoft);
      let spread = side * s.startSpread * halfRange;
      let yAt = (progress) => centerY + side * halfRange * Math.pow(progress, curve);

      let sample = (from, to) => {
        let steps = clampRange(
          Math.round(
            Math.hypot(4 * (to - from) * pxPerYear, Math.abs(yAt(to) - yAt(from))) / 24,
          ),
          12,
          60,
        );
        let points = [];
        for (let step = 0; step <= steps; step++) {
          let progress = from + (step / steps) * (to - from);
          let year = 2026 + 4 * progress;
          let damping = clampRange(progress / 0.12, 0, 1);
          points.push([
            toX(year) + (tD(8.3 * pick + 3.1 * year + 5) - 0.5) * s.wobble * damping,
            yAt(progress) + spread + (tD(4.7 * pick + 2.3 * year) - 0.5) * s.wobble * damping,
          ]);
        }
        return points;
      };

      let weight = 0.87 + 0.26 * line.j;
      let color = pickPaletteShade(SCENARIO_PALETTES[line.family], hashNoise(3.7 * pick + 1.9));
      let variance = hashNoise(7.77 * pick + 0.9);
      let tailAt = Math.max(0.396, extent - 1.32 * s.tailShare);
      let pieces = [
        ...at(sample(feather, tailAt), {
          width: 4.3 * weight,
          color,
          seed: 13 * pick + 1,
          dashLength: 6.2 + 1.6 * variance,
          gap: 5.4 + 1.6 * variance,
          opacity: s.opacity,
          samples: 160,
        }),
        ...at(sample(tailAt, extent), {
          width: 4.3 * weight * 0.9,
          color,
          seed: 13 * pick + 4,
          dashLength: 5.5 + 1.5 * variance,
          gap: 12 + 9 * variance,
          opacity: 0.8 * s.opacity,
          samples: 80,
        }),
      ];
      return {
        key: pick,
        pieces,
        offset: hashNoise(2.71 * pick + 0.5) * s.laneStagger,
        span: s.laneSpan + hashNoise(3.31 * pick + 1.1) * s.laneSpanVar,
      };
    }),
  };
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function FanBloom() {
  let [p, set] = useParams({
    fanReach: FAN_DEFAULTS.fanReach,
    linePitch: FAN_DEFAULTS.linePitch,
    bloom: FAN_DEFAULTS.bloom,
    fullRuns: FAN_DEFAULTS.fullRuns,
    tailShare: FAN_DEFAULTS.tailShare,
    startSpread: FAN_DEFAULTS.startSpread,
    startHide: FAN_DEFAULTS.startHide,
    drawMs: FAN_DEFAULTS.drawMs,
    contentX: 0.62,
  });
  let width = 720;
  let height = 380;
  let [progress, setProgress] = React.useState(1);
  let frame = React.useRef(0);

  let settings = React.useMemo(
    () => ({
      ...FAN_DEFAULTS,
      fanReach: p.fanReach,
      linePitch: p.linePitch,
      bloom: p.bloom,
      fullRuns: p.fullRuns,
      tailShare: p.tailShare,
      startSpread: p.startSpread,
      startHide: p.startHide,
      opacity: 1,
    }),
    [p],
  );

  let grid = React.useMemo(() => {
    let lines = ar(-78, 0, width, height, { cell: 26, rag: 40, heavyEvery: 4 });
    return lines.map((line) => an(line, { opacity: 0.3 })).join("");
  }, [width, height]);

  let fan = React.useMemo(
    () => buildFan(width, height, width * p.contentX, settings),
    [width, height, p.contentX, settings],
  );

  let pieces = React.useMemo(
    () =>
      fan.runs.map((run) => {
        let local = clampRange((progress - run.offset) / run.span, 0, 1);
        let shown = Math.floor(easeInOut(local) * run.pieces.length);
        return run.pieces.slice(0, Math.max(progress >= 1 ? run.pieces.length : shown, 0));
      }),
    [fan, progress],
  );

  let total = fan.runs.reduce((sum, run) => sum + run.pieces.length, 0);
  let visible = pieces.reduce((sum, list) => sum + list.length, 0);

  let play = () => {
    window.cancelAnimationFrame(frame.current);
    let start = performance.now();
    setProgress(0);
    let tick = (now) => {
      let t = clampRange((now - start) / p.drawMs, 0, 1);
      setProgress(t);
      if (t < 1) frame.current = window.requestAnimationFrame(tick);
    };
    frame.current = window.requestAnimationFrame(tick);
  };

  React.useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  return (
    <DemoShell
      canvas={
        <div className="lab-canvas">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="扇形绽放的曲线">
            <g filter="url(#mk-rule)" dangerouslySetInnerHTML={{ __html: grid }} />
            <g filter="url(#mk-marker)" style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
              {pieces.map((list, index) => (
                <g key={fan.runs[index].key} dangerouslySetInnerHTML={{ __html: list.join("") }} />
              ))}
            </g>
          </svg>
          <span className="lab-canvas__cap">
            {`${fan.lineCount} 条轨迹 · ${visible}/${total} 段笔触 · progress ${progress.toFixed(2)}`}
          </span>
        </div>
      }
      knobs={
        <>
          <button type="button" className="lab-btn" onClick={play}>
            重播绽放动画
          </button>
          <Knob
            label="fanReach"
            value={p.fanReach}
            min={0.3}
            max={1.6}
            step={0.01}
            onChange={(v) => set("fanReach", v)}
            hint="扇面最远张开到画布高度的多少倍"
          />
          <Knob
            label="bloom"
            value={p.bloom}
            min={1}
            max={5}
            step={0.05}
            onChange={(v) => set("bloom", v)}
            hint="控制展开节奏；越大，越靠后才明显展开"
          />
          <Knob
            label="linePitch"
            value={p.linePitch}
            min={0.6}
            max={5}
            step={0.05}
            onChange={(v) => set("linePitch", v)}
            hint="相邻轨迹的间距。越小条数越多、越密"
          />
          <Knob
            label="fullRuns"
            value={p.fullRuns}
            min={0}
            max={0.6}
            step={0.01}
            onChange={(v) => set("fullRuns", v)}
            hint="有多大比例的线会一路画到底，而不是中途收笔"
          />
          <Knob
            label="tailShare"
            value={p.tailShare}
            min={0}
            max={0.6}
            step={0.01}
            onChange={(v) => set("tailShare", v)}
            hint="尾部多长的一段进入「稀疏散逸」状态"
          />
          <Knob
            label="startSpread"
            value={p.startSpread}
            min={0}
            max={0.5}
            step={0.005}
            onChange={(v) => set("startSpread", v)}
            hint="起点横向散开量，决定扇根有多宽"
          />
          <Knob
            label="startHide"
            value={p.startHide}
            min={0}
            max={160}
            step={2}
            onChange={(v) => set("startHide", v)}
            hint="起点藏在画布左边以外多远"
          />
          <Knob
            label="contentX（文案起点）"
            value={p.contentX}
            min={0.3}
            max={0.95}
            step={0.01}
            onChange={(v) => set("contentX", v)}
            hint="曲线绕开文案的位置，对应首屏文案块的左边缘"
          />
          <Knob label="drawMs" value={p.drawMs} min={600} max={7000} step={100} onChange={(v) => set("drawMs", v)} />
          <dl className="lab-readout">
            <dt>轨迹条数</dt>
            <dd>{fan.lineCount}</dd>
            <dt>笔触段数</dt>
            <dd>{total}</dd>
          </dl>
          <p className="lab-hint">
            先生成曲线，再拆成断续笔触。尾部的 gap 更大，所以逐渐稀疏。
          </p>
        </>
      }
    />
  );
}

/* ---------------- F2 · 比例横条 ---------------- */

function ShareBar() {
  let [p, set] = useParams({
    cents: 52,
    todayCents: 100,
    widthFraction: 0.52,
    seed: 2,
    splitGap: 0,
    outlined: false,
  });
  return (
    <DemoShell
      canvas={
        <div
          style={{
            background: STAGE_PAPER,
            border: "1px solid var(--border-faint)",
            borderRadius: 3,
            padding: "26px 20px 30px",
          }}
        >
          <ShareStrokes
            cents={p.cents}
            todayCents={p.todayCents}
            widthFraction={p.widthFraction}
            sizeLabel={`${Math.round(p.cents)}¢`}
            seed={p.seed}
            splitGap={p.splitGap}
            outlined={p.outlined}
          />
          <p className="lab-hint" style={{ marginTop: 18 }}>
            这一条是原组件 <InlineCode>&lt;ShareStrokes /&gt;</InlineCode> 的实机渲染，
            右侧数字跟着一起走。
          </p>
        </div>
      }
      knobs={
        <>
          <Knob
            label="cents（今日份额）"
            value={p.cents}
            min={1}
            max={99}
            step={1}
            onChange={(v) => set("cents", v)}
            hint="0–100，用「每美元里的多少美分」表达份额"
          />
          <Knob label="todayCents" value={p.todayCents} min={20} max={140} step={1} onChange={(v) => set("todayCents", v)} />
          <Knob
            label="widthFraction"
            value={p.widthFraction}
            min={0.05}
            max={1}
            step={0.01}
            onChange={(v) => set("widthFraction", v)}
            hint="把美分换算成像素长度，所以条长 = 容器宽 × 这个值 × 份额"
          />
          <Knob label="splitGap" value={p.splitGap} min={0} max={60} step={1} onChange={(v) => set("splitGap", v)} />
          <Knob label="seed" value={p.seed} min={1} max={20} step={1} onChange={(v) => set("seed", v)} />
          <Switch label="outlined（虚线轮廓）" checked={p.outlined} onChange={(v) => set("outlined", v)} />
          <p className="lab-hint">
            条子的颜色不是单一色，而是沿 x 轴排开的{" "}
            <InlineCode>linearGradient</InlineCode>：蓝（劳动）→ 灰（资本）→ 深（已迁移）。
            每一段边界都带一点哈希偏移，所以换 seed 会得到轻微不同的分界位置。
          </p>
        </>
      }
    />
  );
}

/* ---------------- F3 · 首字下沉 ---------------- */

function DropCapDemo() {
  let [p, set] = useParams({ letter: "W", para: 0 });
  let paragraphs = [
    "e study how AI is reshaping the economy because we're committed to ensuring that this transition is beneficial for society, including workers.",
    "hile our Economic Index measures how AI is being used across the economy right now, this scenario explorer is about looking ahead.",
  ];
  return (
    <DemoShell
      wide
      canvas={
        <div
          style={{
            background: STAGE_PAPER,
            border: "1px solid var(--border-faint)",
            borderRadius: 3,
            padding: "28px 32px",
            fontFamily: "var(--anthropic-serif), serif",
            fontSize: 19,
            lineHeight: 1.55,
            maxWidth: "none",
          }}
        >
          <p style={{ margin: 0 }}>
            <DropCap letter={p.letter} />
            {paragraphs[p.para]}
          </p>
        </div>
      }
      knobs={
        <>
          <Knob
            label="letter"
            value={p.letter.charCodeAt(0)}
            min={65}
            max={90}
            step={1}
            onChange={(v) => set("letter", String.fromCharCode(v))}
            format={() => p.letter}
            hint="拖动换字母，可以看到字形的包围盒是实时量出来的"
          />
          <Seg
            label="段落"
            value={p.para}
            onChange={(v) => set("para", v)}
            options={[
              { value: 0, label: "第 1 段" },
              { value: 1, label: "第 2 段" },
            ]}
          />
          <p className="lab-hint">
            首字母不是「用字体放大」，也不是 SVG 文字填充：
            先用 canvas <InlineCode>measureText</InlineCode> 量出字形的真实包围盒，
            再用 <InlineCode>&lt;text&gt;</InlineCode> 作 <InlineCode>clipPath</InlineCode>，
            把一整块水彩铺色裁成字母形状。
            所以它能吃到 <InlineCode>mk-marker</InlineCode> 的颗粒感。
          </p>
        </>
      }
    />
  );
}

/* ---------------- F4 · 滚动驱动重算 ---------------- */

function ScrollDrawDemo() {
  let [p, set] = useParams({ trackWidth: 62, strokeWidth: 9, seed: 4 });
  let trackRef = React.useRef(null);
  let measured = useScrollDraw(trackRef);
  let span = Math.max(120, Math.round(measured)) || 120;

  let html = React.useMemo(
    () =>
      makeMarkerStroke(
        [
          [4, 26],
          [span * 0.34, 12],
          [span * 0.68, 34],
          [span - 4, 18],
        ],
        { width: p.strokeWidth, seed: p.seed, color: "#D97757", opacity: 0.9, paper: STAGE_PAPER },
      ),
    [span, p.strokeWidth, p.seed],
  );

  return (
    <DemoShell
      wide
      canvas={
        <div
          style={{
            background: STAGE_PAPER,
            border: "1px solid var(--border-faint)",
            borderRadius: 3,
            padding: 18,
          }}
        >
          <div
            ref={trackRef}
            style={{
              width: `${p.trackWidth}%`,
              transition: "width 0.18s cubic-bezier(0.33, 1, 0.68, 1)",
              borderRight: "1px dashed var(--border-subtle)",
            }}
          >
            <svg
              width={span}
              height={46}
              viewBox={`0 0 ${span} 46`}
              style={{ display: "block", width: "100%", overflow: "visible" }}
              aria-label="随宽度重算的笔触"
            >
              <g filter="url(#mk-marker)" style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
                <g dangerouslySetInnerHTML={{ __html: html }} />
              </g>
            </svg>
          </div>
          <dl className="lab-readout" style={{ marginTop: 18 }}>
            <dt>useScrollDraw 读到的宽度</dt>
            <dd>{Math.round(measured)}px</dd>
            <dt>笔触重算范围</dt>
            <dd>0 → {span}px</dd>
          </dl>
        </div>
      }
      knobs={
        <>
          <Knob
            label="容器宽度"
            value={p.trackWidth}
            min={20}
            max={100}
            step={1}
            onChange={(v) => set("trackWidth", v)}
            format={(v) => `${v}%`}
            hint="拖动它，ResizeObserver 会把新宽度喂给笔触生成器，整条线重新生成"
          />
          <Knob label="strokeWidth" value={p.strokeWidth} min={2} max={22} step={0.5} onChange={(v) => set("strokeWidth", v)} />
          <Knob label="seed" value={p.seed} min={1} max={20} step={1} onChange={(v) => set("seed", v)} />
          <p className="lab-hint">
            注意折点位置始终按宽度比例走：这是「重算」而不是「缩放」。
            整页图表在响应式变化时不会把笔触拉变形，就是这个机制。
          </p>
        </>
      }
    />
  );
}

/* ---------------- F5 · 交错入场 ---------------- */

const STAGGER_RULES = [
  ["--dd", "延迟", "该笔触比同伴晚多久开始"],
  ["--de", "提前量", "该笔触把结束时间提前多少"],
];

function StaggerDemo() {
  let [p, set] = useParams({ count: 14, spread: 200, duration: 460, replay: 0, mode: "hash" });
  let width = 760;
  let height = 168;
  let step = (width - 80) / (p.count - 1 || 1);

  let marks = React.useMemo(
    () =>
      Array.from({ length: p.count }, (_, index) => {
        let mixed = p.mode === "hash" ? hashNoise(13.3 * index + 7) : index / p.count;
        let delay = Math.round(p.spread * mixed);
        let early = Math.round((1 - mixed) * p.spread * 0.5);
        let x = 40 + index * step;
        return {
          key: index,
          delay,
          early,
          html: makeMarkerStroke(
            [
              [x, 128],
              [x + 6, 60 + Math.sin(index * 0.9) * 26],
              [x + 10, 92],
            ],
            {
              width: 9,
              seed: index * 3 + 1,
              color: index % 3 === 0 ? "#6A9BCC" : "#141413",
              opacity: 0.86,
              paper: STAGE_PAPER,
            },
          ),
        };
      }),
    [p.count, p.spread, p.mode, step],
  );

  return (
    <DemoShell
      wide
      canvas={
        <div className="lab-canvas" key={`${p.replay}-${p.mode}`}>
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="交错入场的笔触">
            <g filter="url(#mk-marker)" style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
              {marks.map((mark) => (
                <g
                  key={mark.key}
                  style={{
                    animation: `lab-rise ${p.duration}ms cubic-bezier(0.33, 1, 0.68, 1) both`,
                    animationDelay: `${mark.delay}ms`,
                  }}
                  dangerouslySetInnerHTML={{ __html: mark.html }}
                />
              ))}
            </g>
          </svg>
          <span className="lab-canvas__cap">
            {`${p.count} 条 · 延迟 0–${p.spread}ms · 用 ${p.mode === "hash" ? "hashNoise" : "线性"} 排序`}
          </span>
        </div>
      }
      knobs={
        <>
          <button type="button" className="lab-btn" onClick={() => set("replay", p.replay + 1)}>
            重播
          </button>
          <Knob label="条数" value={p.count} min={4} max={22} step={1} onChange={(v) => set("count", v)} />
          <Knob label="延迟跨度" value={p.spread} min={0} max={600} step={10} onChange={(v) => set("spread", v)} hint="毫秒" />
          <Knob label="单条时长" value={p.duration} min={120} max={1200} step={20} onChange={(v) => set("duration", v)} hint="毫秒" />
          <Seg
            label="延迟来源"
            value={p.mode}
            onChange={(v) => set("mode", v)}
            options={[
              { value: "hash", label: "hashNoise" },
              { value: "linear", label: "从左到右" },
            ]}
          />
          <dl className="lab-readout">
            {STAGGER_RULES.map(([token, name, note]) => (
              <React.Fragment key={token}>
                <dt>{name}</dt>
                <dd>
                  {token} — {note}
                </dd>
              </React.Fragment>
            ))}
          </dl>
          <p className="lab-hint">
            点重播观察顺序；增加延迟跨度，元素之间的先后差异会更明显。
          </p>
        </>
      }
    />
  );
}

/* ---------------- F6 · 手绘方框与铅笔光标 ---------------- */

const PENCIL_SHAPE = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g transform="rotate(38 6 26)"><path d="M2 9.5Q2 8 3.5 8h5Q10 8 10 9.5V24l-4 5-4-5z" fill="${color}" stroke="#3c3733" stroke-width="1" stroke-linejoin="round"/><rect x="2" y="12" width="8" height="5" fill="#fffdf8" fill-opacity=".7"/><path d="M2 24h8" stroke="#3c3733" stroke-width="1" stroke-opacity=".55"/></g></svg>`;

function LittleThings() {
  let [p, set] = useParams({ boxW: 150, boxH: 96, seed: 11, color: "#B0403A", pencil: "#f0c14b" });

  let box = React.useMemo(
    () =>
      l6(60, 46, p.boxW, p.boxH, p.seed, p.color),
    [p.boxW, p.boxH, p.seed, p.color],
  );

  let cursor = `url("data:image/svg+xml,${encodeURIComponent(PENCIL_SHAPE(p.pencil))}") 4 28, crosshair`;

  return (
    <DemoShell
      wide
      canvas={
        <div style={{ display: "grid", gap: 16 }}>
          <Stage
            width={420}
            height={200}
            caption="l6 —— 用 6 个点和干笔描出来的「学习曲线」方框"
            html={`<g style="mix-blend-mode:multiply">${box}</g>`}
          />
          <div
            style={{
              cursor,
              border: "1px dashed var(--border-subtle)",
              borderRadius: 3,
              padding: "22px 20px",
              background: STAGE_PAPER,
              fontFamily: "var(--anthropic-sans), sans-serif",
              fontSize: 13,
              color: "var(--foreground-secondary)",
            }}
          >
            把鼠标移到这块区域上 —— 光标是一支内联的 SVG 铅笔，
            32×32、data-URI、带 38° 旋转和热点偏移 <InlineCode>4 28</InlineCode>。
            用在「自己动手画一个预测」的方格纸上。
          </div>
        </div>
      }
      knobs={
        <>
          <Knob label="方框宽" value={p.boxW} min={60} max={240} step={2} onChange={(v) => set("boxW", v)} />
          <Knob label="方框高" value={p.boxH} min={40} max={150} step={2} onChange={(v) => set("boxH", v)} />
          <Knob label="seed" value={p.seed} min={1} max={40} step={1} onChange={(v) => set("seed", v)} />
          <Seg
            label="笔杆色"
            value={p.pencil}
            onChange={(v) => set("pencil", v)}
            options={[
              { value: "#f0c14b", label: "黄" },
              { value: "#D97757", label: "陶" },
              { value: "#6A9BCC", label: "蓝" },
            ]}
          />
          <p className="lab-hint">
            方框只有 6 个顶点就够：左右各两条竖边、上下各一条横边，
            转角处由 <InlineCode>makeHandDrawnLine</InlineCode> 自己去圆。
            干笔参数是 <InlineCode>dashLength 9 / gap 5.5</InlineCode>。
          </p>
        </>
      }
    />
  );
}

/* 首屏的「成长曲线」轮廓：布局算法复刻自 HeroChart，零件全部来自真实导出。 */
export { FanBloom, ShareBar, DropCapDemo, ScrollDrawDemo, StaggerDemo, LittleThings, buildFan };
