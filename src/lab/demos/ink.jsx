import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { AUGMENTATION_INK, AUTOMATION_INK, BASELINE_INK, CHART_THEME, EXTREME_PALETTE, MODEST_PALETTE, NEUTRAL_INK, NEW_TASK_INK, SUBSTANTIAL_PALETTE, pickPaletteShade } from '../../recovered/palette.jsx';
import { Knob, useParams } from "../ui/Controls.jsx";
import { DemoShell } from "../ui/Card.jsx";
import { tU } from "../../recovered/drawing-noise.jsx";

const MONO = "var(--anthropic-mono), monospace";

/* ---------------- E1 · 三档情景色板 ---------------- */

const PALETTE_ROWS = [
  ["slow · MODEST", MODEST_PALETTE, "增长平淡的情景"],
  ["central · SUBSTANTIAL", SUBSTANTIAL_PALETTE, "中间情景"],
  ["fast · EXTREME", EXTREME_PALETTE, "极端情景"],
];

function ScenarioPalettes() {
  let [p, set] = useParams({ t: 0.3, shadeOp: 0 });
  return (
    <DemoShell
      canvas={
        <div className="lab-palette-preview">
          {PALETTE_ROWS.map(([name, palette]) => {
            const color = pickPaletteShade(palette, p.t);
            return <div key={name}>
              <p className="lab-hint">{name}</p>
              <div className="lab-palette-row">
                {palette.map((shade) => <span key={shade} title={shade}
                  data-on={shade === color ? "true" : undefined} style={{ background: shade }} />)}
              </div>
              <div className="lab-palette-pair">
                <span style={{ background: color }}>{color}</span>
                <span style={{ background: tU(color, p.shadeOp) }}>{tU(color, p.shadeOp)}</span>
              </div>
            </div>;
          })}
        </div>
      }
      knobs={
        <>
          <Knob label="t（情景强度）" value={p.t} min={0} max={1} step={0.01}
            onChange={(v) => set("t", v)} hint="高亮显示当前选中的色阶" />
          <Knob label="tU 暗化量" value={p.shadeOp} min={0} max={0.4} step={0.01}
            onChange={(v) => set("shadeOp", v)} hint="预览左边是原色，右边是暗化后的颜色" />
        </>
      }
    />
  );
}

/* ---------------- E2 · 语义墨水色 ---------------- */

const INKS = [
  [NEUTRAL_INK, "NEUTRAL_INK", "没被 AI 碰过的任务"],
  [AUGMENTATION_INK, "AUGMENTATION_INK", "AI 增强人类"],
  [AUTOMATION_INK, "AUTOMATION_INK", "AI 替代人类"],
  [NEW_TASK_INK, "NEW_TASK_INK", "AI 催生的新任务"],
  [BASELINE_INK, "BASELINE_INK", "基准线 / 历史走势"],
  ["#217D5D", "paid（TaskBundleStage）", "被付费的部分"],
];

function SemanticInks() {
  return (
    <div className="lab-demo-surface">
    <div className="lab-inks">
      {INKS.map(([color, name, note]) => (
        <div className="lab-ink" key={name}>
          <div className="lab-ink__chip" style={{ background: color }} />
          <div className="lab-ink__meta">
            <b>{note}</b>
            <InlineCode>{name}</InlineCode>
            <br />
            <InlineCode>{color}</InlineCode>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

/* ---------------- E3 · CHART_THEME 与中性色阶 ---------------- */

const SLATE_SCALE = [
  ["1000", "#0f0f0e"],
  ["950", "#141413"],
  ["900", "#1a1918"],
  ["850", "#1f1e1d"],
  ["800", "#262624"],
  ["750", "#30302e"],
  ["700", "#3d3d3a"],
  ["650", "#4d4c48"],
  ["600", "#5e5d59"],
  ["550", "#73726c"],
  ["500", "#87867f"],
  ["450", "#9c9a92"],
  ["400", "#b0aea5"],
  ["350", "#c2c0b6"],
  ["300", "#d1cfc5"],
  ["250", "#dedcd1"],
  ["200", "#e8e6dc"],
  ["150", "#f0eee6"],
  ["100", "#f5f4ed"],
  ["050", "#faf9f5"],
];

const BRAND_SCALE = [
  ["clay", "#d97757"],
  ["oat", "#e3dacc"],
  ["olive", "#788c5d"],
  ["cactus", "#bcd1ca"],
  ["sky", "#6a9bcc"],
  ["heather", "#cbcadb"],
  ["fig", "#c46686"],
  ["coral", "#ebcece"],
];

function ChartTheme() {
  return (
    <div className="lab-demo-surface">
      <div className="lab-palette-preview">
        <div className="lab-inks">
          {Object.entries(CHART_THEME).map(([key, value]) => (
            <div className="lab-ink" key={key}>
              <div className="lab-ink__chip" style={{ background: value }} />
              <div className="lab-ink__meta"><b>{key}</b><InlineCode>{value}</InlineCode></div>
            </div>
          ))}
        </div>
        <div className="lab-palette-row">
          {SLATE_SCALE.map(([step, color]) => <span key={step} title={`slate-${step}: ${color}`} style={{ background: color }} />)}
        </div>
        <div className="lab-palette-row">
          {BRAND_SCALE.map(([name, color]) => <span key={name} title={`${name}: ${color}`} style={{ background: color }} />)}
        </div>
      </div>
    </div>
  );
}

/* ---------------- E4 · 字体与字号 ---------------- */

const TYPE_SCALE = [
  ["--display-1", 42, "display", 400],
  ["--headline-1", 32, "display", 500],
  ["--headline-4", 23, "display", 500],
  ["--body-large-1", 22, "serif", 400],
  ["--body-1", 19, "serif", 400],
  ["--body-3", 15, "sans", 400],
  ["--caption", 14, "sans", 400],
  ["--micro", 10, "sans", 500],
];

const FONT_SAMPLES = [
  ["anthropicSerif", "serif", "The future is not predetermined. 经济情景探索器 0123456789"],
  ["anthropicSans", "sans", "Hand-drawn strokes over graph paper. 笔触与纸面 0123456789"],
  ["anthropicMono", "mono", "makeHandDrawnLine(pts, { width: 4, seed: 1 }) 0123456789"],
];

function TypographyScale() {
  return (
    <div className="lab-demo-surface">
    <div style={{ display: "grid", gap: 26 }}>
      <div style={{ display: "grid", gap: 14 }}>
        <span className="lab-knobs__legend">三个字体族（本地 woff2，未经系统字体近似）</span>
        {FONT_SAMPLES.map(([name, family, sample]) => (
          <div
            key={name}
            style={{
              fontFamily:
                family === "serif"
                  ? "var(--anthropic-serif), serif"
                  : family === "sans"
                    ? "var(--anthropic-sans), sans-serif"
                    : "var(--anthropic-mono), monospace",
              fontSize: 19,
              lineHeight: 1.45,
              borderBottom: "1px solid var(--border-faint)",
              paddingBottom: 10,
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--foreground-tertiary)", display: "block" }}>
              {name}
            </span>
            {sample}
          </div>
        ))}
      </div>
      <div className="lab-keys">
        {TYPE_SCALE.map(([token, size, family, weight]) => (
          <div className="lab-key" key={token}>
            <span className="lab-key__spec">
              <b>{token}</b>
              {size}px · {family} · {weight}
            </span>
            <span
              style={{
                fontFamily:
                  family === "serif"
                    ? "var(--anthropic-serif), serif"
                    : family === "sans"
                      ? "var(--anthropic-sans), sans-serif"
                      : "var(--anthropic-mono), monospace",
                fontSize: size,
                fontWeight: weight,
                lineHeight: 1.25,
                letterSpacing: family === "sans" ? 0 : "-0.01em",
              }}
            >
              Scenarios for our economic future
            </span>
          </div>
        ))}
      </div>
      <p className="lab-hint">
        字体加载前使用度量覆盖减少布局变化；Mono 的符号由等宽字体兜底，中文由系统中文字体补齐。
      </p>
    </div>
    </div>
  );
}

export { ScenarioPalettes, SemanticInks, ChartTheme, TypographyScale };
