/*
 * 生成 public/component.md —— 图鉴（/component）的文本版。
 *
 * 内容不手写：章节、卡片、说明、要点与源码都从 src/lab/parts/ 的 JSX 里读出来，
 * 代码片段按 Snippet 的 path/start/end 从磁盘上的真实文件切片，
 * 所以 lab.md 与页面不会各自漂移。
 *
 * 用法：node scripts/build-lab-md.mjs
 */
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { parse } from "@babel/parser";

const PARTS = [
  "Part0Overview",
  "Part1Atoms",
  "Part2Strokes",
  "Part3Materials",
  "Part4Wash",
  "Part5Ink",
  "Part6Molecules",
  "Part7Assembly",
];

const SOURCE_FILE = "src/lab/sources.js";
const OUTPUT = "public/component.md";

/* ---------- JSX → 文本 ---------- */

function parseModule(code) {
  return parse(code, { sourceType: "module", plugins: ["jsx"] });
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit);
    return;
  }
  if (typeof node.type === "string") visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === "loc" || key === "start" || key === "end" || key === "type") continue;
    walk(value, visit);
  }
}

function jsxName(node) {
  if (!node) return "";
  if (node.type === "JSXIdentifier") return node.name;
  if (node.type === "JSXMemberExpression") return `${jsxName(node.object)}.${jsxName(node.property)}`;
  return "";
}

/* 模块内 const NAME = "字面量" / { key: "字面量" } 的表，用于解析引用与 {...spread}。 */
function collectConsts(ast) {
  const consts = new Map();
  const objects = new Map();
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator") return;
    if (node.id.type !== "Identifier" || !node.init) return;
    const value = literalText(node.init);
    if (value != null) {
      consts.set(node.id.name, value);
      return;
    }
    if (node.init.type !== "ObjectExpression") return;
    const fields = new Map();
    for (const property of node.init.properties) {
      if (property.type !== "ObjectProperty") continue;
      const key = property.key.value ?? property.key.name;
      const text = literalText(property.value);
      if (key && text != null) fields.set(String(key), text);
    }
    objects.set(node.id.name, fields);
  });
  return { consts, objects };
}

function literalText(node) {
  if (!node) return null;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis.map((quasi) => quasi.value.cooked).join("");
  }
  return null;
}

function toText(node, consts) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map((child) => toText(child, consts)).join("");
  switch (node.type) {
    case "StringLiteral":
      return node.value;
    case "TemplateLiteral":
      return node.quasis
        .map((quasi, index) => quasi.value.cooked + toText(node.expressions[index], consts))
        .join("");
    case "JSXText":
      return node.value;
    case "JSXFragment":
      return toText(node.children, consts);
    case "JSXElement": {
      const name = jsxName(node.openingElement.name);
      const inner = toText(node.children, consts);
      if (name === "InlineCode" || name === "code" || name === "kbd") return `\`${inner.trim()}\``;
      if (name === "b" || name === "strong") return `**${inner.trim()}**`;
      if (name === "br") return "\n";
      if (name === "a") {
        const href = node.openingElement.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name.name === "href",
        );
        const url = href ? toText(href.value, consts) : "";
        return url ? `[${inner.trim()}](${url})` : inner;
      }
      return inner;
    }
    case "JSXExpressionContainer":
      return toText(node.expression, consts);
    case "Identifier":
      return consts.get(node.name) ?? "";
    case "LogicalExpression":
      return toText(node.right, consts);
    case "ConditionalExpression":
      return toText(node.consequent, consts);
    case "ArrayExpression":
      return node.elements.map((element) => toText(element, consts)).join("");
    default:
      return "";
  }
}

/* JSX 源码里的换行与缩进只用于排版，输出时压成一行。 */
function clean(text) {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s+([,.;:）)])/g, "$1")
    .trim();
}

/* ---------- 读取属性 ---------- */

function attrs(node, { objects } = {}) {
  const out = new Map();
  for (const attr of node.openingElement.attributes) {
    if (attr.type === "JSXSpreadAttribute") {
      // <Part {...meta} />：把常量对象的字段摊平成属性。
      const fields = attr.argument.type === "Identifier" ? objects?.get(attr.argument.name) : null;
      for (const [key, value] of fields ?? []) out.set(key, value);
      continue;
    }
    if (attr.type !== "JSXAttribute") continue;
    out.set(attr.name.name, attr.value);
  }
  return out;
}

function valueOf(map, name, consts, fallback = "") {
  if (!map.has(name)) return fallback;
  const value = map.get(name);
  if (value == null) return true;
  const text = clean(toText(value, consts));
  return text || fallback;
}

function numberOf(map, name) {
  if (!map.has(name)) return null;
  const value = map.get(name);
  if (value?.type === "JSXExpressionContainer" && value.expression.type === "NumericLiteral") {
    return value.expression.value;
  }
  return null;
}

/* notes={{ keys: [...], dont: [...] }}：只取字符串/JSX 文本，忽略样式与结构。 */
function readNotes(map, consts) {
  const value = map.get("notes");
  if (value?.type !== "JSXExpressionContainer") return { keys: [], dont: [] };
  const object = value.expression;
  if (object.type !== "ObjectExpression") return { keys: [], dont: [] };
  const out = { keys: [], dont: [] };
  for (const property of object.properties) {
    if (property.type !== "ObjectProperty") continue;
    const key = property.key.value ?? property.key.name;
    if (key !== "keys" && key !== "dont") continue;
    if (property.value.type !== "ArrayExpression") continue;
    out[key] = property.value.elements
      .map((element) => clean(toText(element, consts)))
      .filter(Boolean);
  }
  return out;
}

/* G3 这类卡把内容放在 demo 的 .lab-notes 结构里，也一并读出来。 */
function readDemoNotes(map, consts) {
  const value = map.get("demo");
  if (value?.type !== "JSXExpressionContainer") return [];
  const columns = [];
  walk(value.expression, (node) => {
    if (node.type !== "JSXElement" || jsxName(node.openingElement.name) !== "div") return;
    const className = attrs(node).get("className");
    if (className?.value !== "lab-notes__col") return;
    const children = node.children;
    const heading = children.find(
      (child) => child.type === "JSXElement" && jsxName(child.openingElement.name) === "h4",
    );
    const list = children.find(
      (child) => child.type === "JSXElement" && jsxName(child.openingElement.name) === "ul",
    );
    if (!list) return;
    columns.push({
      title: clean(toText(heading?.children, consts)) || "说明",
      items: list.children
        .filter((child) => child.type === "JSXElement" && jsxName(child.openingElement.name) === "li")
        .map((child) => clean(toText(child.children, consts)))
        .filter(Boolean),
    });
  });
  return columns;
}

function readSnippets(node, consts) {
  const out = [];
  walk(node, (child) => {
    if (child.type !== "JSXElement") return;
    if (jsxName(child.openingElement.name) !== "Snippet") return;
    const map = attrs(child);
    out.push({
      title: valueOf(map, "title", consts, "源码"),
      path: valueOf(map, "path", consts),
      start: numberOf(map, "start"),
      end: numberOf(map, "end"),
      note: valueOf(map, "note", consts),
    });
  });
  return out;
}

function readCards(scope) {
  const { consts } = scope;
  const cards = [];
  walk(scope.ast, (node) => {
    if (node.type !== "JSXElement") return;
    if (jsxName(node.openingElement.name) !== "Card") return;
    const map = attrs(node, scope);
    cards.push({
      id: valueOf(map, "id", consts),
      index: valueOf(map, "index", consts),
      title: valueOf(map, "title", consts),
      summary: valueOf(map, "summary", consts),
      notes: readNotes(map, consts),
      demoNotes: readDemoNotes(map, consts),
      snippets: readSnippets(node, consts),
    });
  });
  return cards;
}

/* Part 的标题：优先取 const meta，其次取 <Part> 的行内属性。 */
function readPartMeta(scope) {
  const { consts } = scope;
  const meta = {};
  walk(scope.ast, (node) => {
    if (node.type !== "JSXElement" || jsxName(node.openingElement.name) !== "Part") return;
    const map = attrs(node, scope);
    meta.id ??= valueOf(map, "id", consts);
    meta.no ??= valueOf(map, "no", consts);
    meta.title ??= valueOf(map, "title", consts);
    meta.lede ??= valueOf(map, "lede", consts);
  });
  return meta;
}

/* ---------- 组装 ---------- */

const LANGUAGE = { jsx: "jsx", js: "js", mjs: "js", ts: "ts", css: "css", md: "md" };
const fileCache = new Map();

async function readSource(path) {
  if (!fileCache.has(path)) fileCache.set(path, await readFile(path, "utf8"));
  return fileCache.get(path);
}

async function slice(path, start, end) {
  const source = await readSource(path);
  const lines = source.split("\n");
  const from = start ? start - 1 : 0;
  const to = end ? end : lines.length;
  return { text: lines.slice(from, to).join("\n"), count: to - from, offset: start || 1 };
}

function readSourceIndex(ast) {
  const entries = [];
  walk(ast, (node) => {
    if (node.type !== "VariableDeclarator" || node.id.name !== "SOURCE_INDEX") return;
    for (const element of node.init.elements) {
      const item = {};
      for (const property of element.properties) {
        item[property.key.name ?? property.key.value] = property.value.value;
      }
      entries.push(item);
    }
  });
  return entries;
}

function bullet(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

export async function buildMarkdown() {
  const out = [];
  const stats = { cards: 0, snippets: 0 };

  out.push("# 手绘水彩渲染引擎拆解");
  out.push("");
  out.push("> Anthropic Econ Scenarios · 从一根笔触到整页装配");
  out.push("");

  const chapters = [];
  for (const name of PARTS) {
    const code = await readSource(`src/lab/parts/${name}.jsx`);
    const ast = parseModule(code);
    const scope = { ast, ...collectConsts(ast) };
    chapters.push({ meta: readPartMeta(scope), cards: readCards(scope) });
  }
  const sourceIndex = readSourceIndex(parseModule(await readSource(SOURCE_FILE)));
  const cardTotal = chapters.reduce((sum, chapter) => sum + chapter.cards.length, 0);
  const snippetTotal = chapters.reduce(
    (sum, chapter) => sum + chapter.cards.reduce((n, card) => n + card.snippets.length, 0),
    0,
  );

  out.push(
    `本文是设计元素图鉴（\`/component\`）的文本版：${chapters.length} 章、${cardTotal} 张元素卡、` +
      `${sourceIndex.length} 个源文件。交互演示、参数旋钮与实时效果只在页面上；` +
      "这里保留每张卡的说明、要点、注意事项和对应源码。",
  );
  out.push("");
  out.push(
    `由 \`scripts/build-lab-md.mjs\` 从 \`src/lab/parts/\` 的卡片定义与 \`src/\` 的真实源码生成，` +
      "与页面共用同一份内容，不会各自漂移。",
  );
  out.push("");

  for (const { meta, cards } of chapters) {
    assert(meta.id && meta.no && meta.title, `Part 缺少 meta：${JSON.stringify(meta)}`);
    out.push(`## ${meta.no} ${meta.title}`);
    out.push("");
    if (meta.lede) {
      out.push(meta.lede);
      out.push("");
    }
    if (meta.id === "overview") {
      out.push(
        "> 元素地图：用 `src/recovered/` 的真实绘制函数拼出的一张画面，页面上可点击跳到对应模块。",
      );
      out.push("");
    }

    for (const card of cards) {
      assert(card.id && card.index && card.title, `卡片缺少字段：${JSON.stringify(card)}`);
      stats.cards += 1;
      out.push(`### ${card.index} ${card.title}`);
      out.push("");
      if (card.summary) {
        out.push(card.summary);
        out.push("");
      }
      if (card.notes.keys.length) {
        out.push("**要点**");
        out.push("");
        out.push(bullet(card.notes.keys));
        out.push("");
      }
      if (card.notes.dont.length) {
        out.push("**注意事项**");
        out.push("");
        out.push(bullet(card.notes.dont));
        out.push("");
      }
      for (const column of card.demoNotes) {
        out.push(`**${column.title}**`);
        out.push("");
        out.push(bullet(column.items));
        out.push("");
      }

      for (const snippet of card.snippets) {
        stats.snippets += 1;
        assert(snippet.path, `${card.id} 的源码块缺少 path`);
        const { text, count, offset } = await slice(snippet.path, snippet.start, snippet.end);
        const range = snippet.start ? `${snippet.path}:${snippet.start}–${snippet.end}` : snippet.path;
        const language = LANGUAGE[snippet.path.split(".").pop()] ?? "text";
        out.push(`#### ${snippet.title}`);
        out.push("");
        out.push(`\`${range}\` · ${count} 行`);
        out.push("");
        if (snippet.note) {
          out.push(snippet.note);
          out.push("");
        }
        out.push(`\`\`\`${language}`);
        out.push(text);
        out.push("```");
        out.push("");
        void offset;
      }
    }
  }

  out.push("## 8 源码索引");
  out.push("");
  out.push("工程里的真实文件，页面可单独复制或整体带走；这里是清单与职责。");
  out.push("");
  for (const file of sourceIndex) {
    const source = await readSource(file.path);
    const lines = source.split("\n").length;
    out.push(`- \`${file.path}\` · ${lines} 行 — ${file.role}`);
  }
  out.push("");

  const markdown = `${out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
  return { markdown, chapters: chapters.length, cards: stats.cards, snippets: stats.snippets };
}

async function main() {
  const { markdown, chapters, cards, snippets } = await buildMarkdown();
  const size = `${(markdown.length / 1024).toFixed(1)} KB`;

  // --check：只比对，不写入。用于确认仓库里的 lab.md 没有落后于卡片与源码。
  if (process.argv.includes("--check")) {
    const current = await readFile(OUTPUT, "utf8").catch(() => "");
    assert.equal(
      current,
      markdown,
      `${OUTPUT} 与当前卡片定义或源码不一致，请运行 npm run lab:md 重新生成`,
    );
    console.log(`PASS ${OUTPUT}: ${chapters} 章 / ${cards} 卡 / ${snippets} 段源码 / ${size}`);
    return;
  }

  await writeFile(OUTPUT, markdown);
  console.log(`Wrote ${OUTPUT}: ${chapters} 章 / ${cards} 卡 / ${snippets} 段源码 / ${size}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
