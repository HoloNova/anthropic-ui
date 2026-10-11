// 数据层回归检查：不挂载 React，不操作浏览器，不进行 UI 单元测试。
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse } from "@babel/parser";
import { splitNoteCode } from "../src/lab/ui/note-code.mjs";
import { CONCEPTS, splitConceptTerms } from "../src/lab/ui/concepts.mjs";
import { SEEDED_BASELINE, seededValueY, seededSampleY } from "../src/lab/demos/seeded-projection.mjs";

for (let i = 0; i <= 1000; i++) {
  const sample = i / 1000;
  const independent = seededSampleY(sample);
  const smooth = seededValueY(2 * sample - 1);
  assert.equal(independent, smooth, "两种形态必须使用相同的坐标映射");
  assert.ok(independent >= 24 && independent <= 164, "样本必须在画布内且不侵占图例");
}
assert.equal(seededSampleY(0.5), SEEDED_BASELINE);
assert.equal(seededValueY(0), SEEDED_BASELINE);
console.log("PASS A2: 1001 个样本的刻度一致、画布边界及零值基线");

const cases = [
  ["createSeededNormal(seed, count) 中间用 smoothstep 补", ["createSeededNormal(seed, count)", "smoothstep"]],
  ["默认 clamp(round(长度/5), 16, 160)，输出恒定", ["clamp(round(长度/5), 16, 160)"]],
  ["宽度是 0.055×width + 0.35，沿线变化", ["0.055×width + 0.35"]],
  ["0.65 × noise(x/blob) + 0.35 × noise(x/(0.4×blob))，大斑块上挂小斑块", ["0.65 × noise(x/blob) + 0.35 × noise(x/(0.4×blob))"]],
  ["SVG 用 <clipPath> 包住 <text>，AI 与 DOM 是说明文字", ["<clipPath>", "<text>"]],
  ["--color-slate-050 和 #FAF9F5", ["--color-slate-050", "#FAF9F5"]],
  ["普通中文，不改变文字。", []],
  ["未闭合 fn(x 也不吞掉文字", ["fn(x"]],
  ["", []],
];
for (const [text, expected] of cases) {
  const parts = splitNoteCode(text);
  assert.equal(parts.map((part) => part.text).join(""), text, "标记样式不得改变文字");
  assert.deepEqual(parts.filter((part) => part.code).map((part) => part.text), expected);
}
console.log("PASS 要点标记: 函数/嵌套表达式/变量/色号及普通文字");

assert.equal(Object.keys(CONCEPTS).length, 12, "仅允许已审定的十二项说明");
for (const [term, content] of Object.entries(CONCEPTS)) {
  const text = `前文 ${term} 后文`;
  const parts = splitConceptTerms(text);
  assert.equal(parts.map((part) => part.text).join(""), text);
  assert.deepEqual(parts.filter((part) => part.content).map((part) => part.text), [term]);
  assert.ok(content.trim());
}
const terms = splitConceptTerms("seeded seed+2 amountScale amount <clipPath> smoothstep(t) RGB 通道");
assert.deepEqual(terms.filter((part) => part.content).map((part) => part.text), ["seed", "amount", "clipPath", "smoothstep", "RGB 通道"]);
assert.equal(splitNoteCode("RGB 通道")[0].text, "RGB 通道", "多词术语不得被代码标记拆开");
console.log("PASS 术语数据: 十二项审定说明、英文边界及多词匹配");

function verifyStrings(node) {
  if (!node || typeof node !== "object") return 0;
  if (Array.isArray(node)) return node.reduce((count, child) => count + verifyStrings(child), 0);
  if (node.type === "StringLiteral") {
    assert.equal(splitNoteCode(node.value).map((part) => part.text).join(""), node.value);
    return 1;
  }
  return Object.values(node).reduce((count, child) => count + verifyStrings(child), 0);
}

const paths = [
  "Part1Atoms", "Part2Strokes", "Part3Materials", "Part4Wash",
  "Part5Ink", "Part6Molecules", "Part7Assembly",
];
let verified = 0;
for (const name of paths) {
  const source = await readFile(new URL(`../src/lab/parts/${name}.jsx`, import.meta.url), "utf8");
  verified += verifyStrings(parse(source, { sourceType: "module", plugins: ["jsx"] }));
}
console.log(`PASS 章节原文: ${verified} 个字符串格式化后逐字一致`);

// lab.md 的结构完整性：卡片数、章节数、代码块成对、源码索引齐全。
const markdown = await readFile(new URL("../public/component.md", import.meta.url), "utf8");
const nav = await readFile(new URL("../src/lab/nav.js", import.meta.url), "utf8");
const cardIds = [...nav.matchAll(/\["([a-z0-9-]+)", "[^"]+"\]/g)]
  .map((match) => match[1])
  .filter((id) => id !== "overview-scene");
assert.equal(cardIds.length, 30, "导航里的卡片数应仍是 30");
assert.equal(
  (markdown.match(/^### /gm) || []).length,
  cardIds.length,
  "lab.md 的卡片数与导航不一致",
);
assert.equal((markdown.match(/^## /gm) || []).length, 9, "lab.md 应包含 0–8 共 9 章");
assert.equal(
  (markdown.match(/^```/gm) || []).length % 2,
  0,
  "lab.md 的代码围栏必须成对",
);
const indexPaths = [...markdown.matchAll(/^- `(src\/[^`]+)` · \d+ 行 — /gm)].map((match) => match[1]);
assert.equal(indexPaths.length, 18, "lab.md 末尾应列出 18 个源文件");
for (const path of indexPaths) await readFile(new URL(`../${path}`, import.meta.url), "utf8");
console.log(`PASS component.md 结构: ${cardIds.length} 卡 / 9 章 / ${indexPaths.length} 个源文件清单`);
