import * as React from "react";
import { ConceptHint, InlineCode } from "../ui/ConceptHint.jsx";
import {
  hashNoise,
  tU,
  tK,
  tX,
  tJ,
  tQ,
  clampRange,
  roundToTenth,
} from "../../recovered/drawing-noise.jsx";
import {
  createSeededRandom,
  createSeededNormal,
} from "../../recovered/question-specs-2.jsx";
import { Stage } from "../ui/Stage.jsx";
import { Knob, Switch, Seg, useParams } from "../ui/Controls.jsx";
import { DemoShell } from "../ui/Card.jsx";

import { SEEDED_BASELINE, seededValueY, seededSampleY } from "./seeded-projection.mjs";

const MONO = "var(--anthropic-mono), monospace";
const INK = "#141413";
const CLAY = "#d97757";
const RULE = "#87867F";

/* ---------------- A1 · 确定性哈希 ---------------- */

function NoiseDeterminism() {
  let [p, set] = useParams({ samples: 26, reseed: 0 });
  let n = p.samples;
  let seeded = React.useMemo(
    () => Array.from({ length: n }, (_, i) => hashNoise(i)),
    [n],
  );
  let random = React.useMemo(
    () => Array.from({ length: n }, () => Math.random()),
    [n, p.reseed],
  );
  /* viewBox 固定，采样数只改变柱子的密度，不改变画布比例。
     否则采样数少时 viewBox 变窄，整张图会被等比放大成很高的一条。 */
  let width = 700;
  let height = 258;
  let trackLeft = 68;
  let trackWidth = width - trackLeft - 10;
  let pitch = Math.min(30, trackWidth / n);
  let barWidth = Math.min(18, Math.max(2, pitch - 5));
  let trackStart = trackLeft + (trackWidth - pitch * n) / 2;
  let baselineTop = 108;
  let baselineBottom = 238;

  return (
    <DemoShell
      canvas={
        <Stage width={width} height={height}>
          {[
            ["hashNoise(i)", seeded, INK, baselineTop],
            ["Math.random()", random, "#b0aea5", baselineBottom],
          ].map(([label, values, color, base]) => (
            <g key={label}>
              <text x={10} y={base - 84} fontFamily={MONO} fontSize={11} fill={RULE}>
                {label}
              </text>
              <line
                x1={10}
                y1={base + 0.5}
                x2={width - 10}
                y2={base + 0.5}
                stroke="#dedcd1"
                strokeWidth={1}
              />
              {values.map((value, index) => {
                let h = Math.max(1, value * 84);
                return (
                  <rect
                    key={index}
                    x={trackStart + index * pitch}
                    y={base - h}
                    width={barWidth}
                    height={h}
                    fill={color}
                    opacity={0.82}
                  />
                );
              })}
            </g>
          ))}
        </Stage>
      }
      knobs={
        <>
          <Knob
            label="采样数"
            value={p.samples}
            min={6}
            max={40}
            step={1}
            onChange={(v) => set("samples", v)}
          />
          <button
            type="button"
            className="lab-btn"
            onClick={() => set("reseed", p.reseed + 1)}
          >
            重新采样
          </button>
        </>
      }
    />
  );
}

/* ---------------- A2 · 种子随机与平滑插值 ---------------- */

function linearNormal(seed, count) {
  let random = createSeededRandom(seed);
  let pool = [];
  for (let i = 0; i <= count + 1; i++) pool.push(2 * random() - 1);
  return (x) => {
    let t = clampRange(x, 0, 1) * count;
    let index = Math.floor(t);
    let frac = t - index;
    return pool[index] + (pool[index + 1] - pool[index]) * frac;
  };
}

function SeededSequence() {
  let [p, set] = useParams({ seed: 7, count: 26, mode: "smooth" });
  let samples = 220;
  let height = 220;
  let width = 640;

  let curves = React.useMemo(() => {
    if (p.mode === "uniform") {
      let random = createSeededRandom(p.seed);
      return [
        {
          key: "uniform",
          color: "#b0aea5",
          label: "createSeededRandom —— 每点独立",
          points: Array.from({ length: p.count + 1 }, (_, i) => [
            40 + (i / p.count) * (width - 70),
            seededSampleY(random()),
          ]),
        },
      ];
    }
    let smoothFn = createSeededNormal(p.seed, p.count);
    let linearFn = linearNormal(p.seed, p.count);
    let make = (fn) =>
      Array.from({ length: samples + 1 }, (_, i) => {
        let t = i / samples;
        return [40 + t * (width - 70), seededValueY(fn(t))];
      });
    return [
      {
        key: "smooth",
        color: INK,
        label: "createSeededNormal —— smoothstep 插值",
        points: make(smoothFn),
      },
      {
        key: "linear",
        color: CLAY,
        label: "同一组样本的线性插值",
        points: make(linearFn),
      },
    ];
  }, [p.seed, p.count, p.mode]);

  return (
    <DemoShell
      canvas={
        <Stage width={width} height={height} caption={`seed = ${p.seed}　${p.mode}`}>
          <line
            x1={40}
            y1={SEEDED_BASELINE + 0.5}
            x2={width - 30}
            y2={SEEDED_BASELINE + 0.5}
            stroke="#dedcd1"
            strokeDasharray="2 4"
          />
          {curves.map((curve) => (
            <polyline
              key={curve.key}
              points={curve.points.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke={curve.color}
              strokeWidth={1.6}
            />
          ))}
          {curves.map((curve, index) => (
            <text
              key={curve.key}
              x={40}
              y={190 + index * 15}
              fontFamily={MONO}
              fontSize={11}
              fill={curve.color}
            >
              {curve.label}
            </text>
          ))}
        </Stage>
      }
      knobs={
        <>
          <Knob
            label="seed"
            value={p.seed}
            min={1}
            max={40}
            step={1}
            onChange={(v) => set("seed", v)}
          />
          <Knob
            label="样本数 count"
            value={p.count}
            min={4}
            max={60}
            step={1}
            onChange={(v) => set("count", v)}
          />
          <Seg
            label="形态"
            value={p.mode}
            onChange={(v) => set("mode", v)}
            options={[
              { value: "smooth", label: "平滑" },
              { value: "uniform", label: "独立" },
            ]}
          />
          <p className="lab-hint">
            count 越大，起伏越密；越小，起伏越宽缓。取值范围仍是 −1…1。
          </p>
        </>
      }
    />
  );
}

/* ---------------- A3 · 路径几何工具 ---------------- */

function PathGeometry() {
  let [p, set] = useParams({
    samples: 24,
    offset: 9,
    showNormals: true,
    showResample: true,
    showOffset: true,
    shape: "wave",
  });
  let width = 640;
  let height = 220;

  let raw = React.useMemo(() => {
    if (p.shape === "line") return [[40, 140], [600, 80]];
    if (p.shape === "zigzag")
      return Array.from({ length: 7 }, (_, i) => [40 + i * 93, i % 2 ? 80 : 160]);
    return Array.from({ length: 9 }, (_, i) => [
      40 + i * 70,
      120 + Math.sin(i * 0.8) * 46,
    ]);
  }, [p.shape]);

  let resampled = React.useMemo(() => tK(raw, p.samples), [raw, p.samples]);
  let normals = React.useMemo(() => tJ(resampled), [resampled]);
  let offsetLine = React.useMemo(
    () => tQ(resampled, (t) => Math.sin(t * Math.PI * 2.2) * p.offset),
    [resampled, p.offset],
  );

  let length = tX(raw);

  return (
    <DemoShell
      canvas={
        <Stage width={width} height={height} caption={`tX(raw) = ${roundToTenth(length)}px`}>
          <polyline
            points={raw.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="#d1cfc5"
            strokeWidth={1.4}
            strokeDasharray="5 4"
          />
          {p.showOffset ? (
            <polyline
              points={offsetLine.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke={CLAY}
              strokeWidth={1.4}
            />
          ) : null}
          {p.showNormals
            ? resampled.map(([x, y], index) => {
                let [nx, ny] = normals[index];
                return (
                  <line
                    key={index}
                    x1={x}
                    y1={y}
                    x2={x - ny * 13}
                    y2={y + nx * 13}
                    stroke="#9c9a92"
                    strokeWidth={0.8}
                  />
                );
              })
            : null}
          {p.showResample
            ? resampled.map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r={2.2} fill={INK} />
              ))
            : null}
          <text x={40} y={200} fontFamily={MONO} fontSize={11} fill={RULE}>
            虚线 = 原始折线　圆点 = tK 重采样　短线 = 法线方向　橙线 = tQ 沿法线偏移
          </text>
        </Stage>
      }
      knobs={
        <>
          <Seg
            label="输入折线"
            value={p.shape}
            onChange={(v) => set("shape", v)}
            options={[
              { value: "wave", label: "波浪" },
              { value: "line", label: "两点" },
              { value: "zigzag", label: "折角" },
            ]}
          />
          <Knob
            label="tK 采样数"
            value={p.samples}
            min={2}
            max={60}
            step={1}
            onChange={(v) => set("samples", v)}
          />
          <Knob
            label="tQ 偏移幅度"
            value={p.offset}
            min={0}
            max={30}
            step={0.5}
            onChange={(v) => set("offset", v)}
          />
          <Switch
            label="法线方向"
            checked={p.showNormals}
            onChange={(v) => set("showNormals", v)}
          />
          <Switch
            label="tK 重采样"
            checked={p.showResample}
            onChange={(v) => set("showResample", v)}
          />
          <Switch
            label="tQ 偏移线"
            checked={p.showOffset}
            onChange={(v) => set("showOffset", v)}
          />
          <p className="lab-hint">
            打开法线看向两侧移动的方向，打开偏移线看整条路径如何移到侧边。
          </p>
        </>
      }
    />
  );
}

/* ---------------- A4 · 墨色暗化 ---------------- */

const INK_BASES = [
  ["BASELINE_INK", "#D97757"],
  ["AUTOMATION_INK", "#6A9BCC"],
  ["AUGMENTATION_INK", "#918BD6"],
  ["NEW_TASK_INK", "#F0AC54"],
  ["NEUTRAL_INK", "#BDBAAE"],
  ["SUBSTANTIAL[0]", "#788C5D"],
];

function InkDarkening() {
  let [p, set] = useParams({ base: 0, amount: 0.16 });
  let base = INK_BASES[p.base][1];
  let steps = [0, 0.08, 0.16, 0.24, 0.36, 0.5];
  let currentInk = tU(base, p.amount);

  return (
    <DemoShell
      canvas={
        <Stage width={720} height={240} caption="tU(color, amount)">
          <text x={24} y={16} fontFamily={MONO} fontSize={14} fill={RULE}>原色</text>
          <text x={370} y={16} fontFamily={MONO} fontSize={14} fill={RULE}>
            {`暗化结果 · amount = ${p.amount.toFixed(2)}`}
          </text>
          <rect x={24} y={22} width={326} height={54} rx={2} fill={base} />
          <rect x={370} y={22} width={326} height={54} rx={2} fill={currentInk} />
          <text x={24} y={94} fontFamily={MONO} fontSize={12} fill={RULE}>{base}</text>
          <text x={370} y={94} fontFamily={MONO} fontSize={12} fill={RULE}>{currentInk}</text>
          <g transform="translate(0, 116)">
            {steps.map((step, index) => (
              <g key={step}>
                <rect
                  x={24 + index * 114}
                  y={22}
                  width={98}
                  height={54}
                  rx={2}
                  fill={tU(base, step)}
                />
                <text
                  x={24 + index * 114}
                  y={94}
                  fontFamily={MONO}
                  fontSize={11}
                  fill={RULE}
                >
                  {step.toFixed(2)}
                </text>
                <text
                  x={24 + index * 114}
                  y={108}
                  fontFamily={MONO}
                  fontSize={10.5}
                  fill="#b0aea5"
                >
                  {tU(base, step)}
                </text>
              </g>
            ))}
          </g>
        </Stage>
      }
      knobs={
        <>
          <Seg
            label="基色"
            value={p.base}
            onChange={(v) => set("base", v)}
            options={INK_BASES.map(([name], index) => ({
              value: index,
              label: name.replace("_INK", "").slice(0, 6),
            }))}
          />
          <Knob
            label="amount"
            value={p.amount}
            min={0}
            max={0.6}
            step={0.01}
            onChange={(v) => set("amount", v)}
          />
          <p className="lab-hint">
            公式：每个通道 <ConceptHint content="保持最强的原色，其他的再降低一点，从而达到让相应颜色更突出的效果"><InlineCode>max(0, (c + (c − max) × 0.25) × (1 − amount))</InlineCode></ConceptHint>。
            上方右块随 amount 实时变化，下方六块是固定的深浅参考。
          </p>
        </>
      }
    />
  );
}

export { NoiseDeterminism, SeededSequence, PathGeometry, InkDarkening };
