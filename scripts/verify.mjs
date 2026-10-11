import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";
import { build } from "esbuild";
import { collectClassUsage } from "./class-usage.mjs";

const require = createRequire(import.meta.url);
const STYLE_DIR = "src/styles";
const FONT_DIR = "public/assets/fonts";

async function listFiles(root, extensions) {
  const found = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...(await listFiles(target, extensions)));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) found.push(target);
  }
  return found;
}

async function readStyleSheets() {
  const files = (await readdir(STYLE_DIR)).filter((file) => file.endsWith(".css"));
  const sheets = [];
  for (const file of files) {
    sheets.push({ file, contents: await readFile(path.join(STYLE_DIR, file), "utf8") });
  }
  return sheets;
}

// 所有恢复模块必须能在没有 DOM、没有网络的环境里初始化。
// 这不是 UI 测试：只执行模块顶层代码，不渲染组件、不读取页面。
async function checkModulesInitialize() {
  const files = [
    ...(await listFiles("src/recovered", [".jsx", ".js"])),
    ...(await listFiles("src/runtime", [".jsx", ".js"])),
  ];
  const bundled = await build({
    stdin: {
      contents:
        files
          // esbuild 的 import 描述符必须是正斜杠路径，Windows 反斜杠会被当成转义。
          .map((file, index) => `import * as m${index} from './${file.replace(/\\/g, '/')}';`)
          .join("\n") + `\nexport const moduleCount = ${files.length};`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    jsx: "automatic",
    write: false,
    treeShaking: false,
    external: ["react", "react/jsx-runtime", "gsap", "react-dom/client"],
  });
  const sandbox = { exports: {} };
  vm.runInNewContext(bundled.outputFiles[0].text, {
    module: sandbox,
    exports: sandbox.exports,
    require,
    console,
    setTimeout,
    clearTimeout,
  });
  assert.equal(sandbox.exports.moduleCount, files.length);
  console.log(`PASS modules: ${files.length} 个模块初始化通过（未渲染组件）`);
}

// 源码与静态页头用到的类名必须都能在最终样式里找到，防止样式被裁掉还在用。
async function checkClassCoverage() {
  const { used } = await collectClassUsage();
  const sheets = await readStyleSheets();
  const shipped = new Set();
  for (const { contents } of sheets) {
    for (const match of contents.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) shipped.add(match[1]);
  }
  const missing = [...used].filter((className) => !shipped.has(className));
  assert.deepEqual(missing, [], `以下类名在源码中使用但样式里不存在：${missing.join(", ")}`);
  console.log(`PASS classes: 源码与页头引用的 ${used.size} 个类名都能在样式里找到`);
}

// 样式里引用的自定义属性必须有来源：样式内定义，或由恢复代码在运行时写入。
async function checkCustomProperties() {
  const sheets = await readStyleSheets();
  const defined = new Set();
  const referenced = new Set();
  for (const { contents } of sheets) {
    for (const match of contents.matchAll(/(--[\w-]+)\s*:/g)) defined.add(match[1]);
    // 带回退值的引用（var(--x, fallback)）在未定义时也有确定行为，不计入缺失。
    for (const match of contents.matchAll(/var\(\s*(--[\w-]+)(\s*,)?/g)) {
      if (!match[2]) referenced.add(match[1]);
    }
  }
  const writtenByCode = new Set();
  for (const file of await listFiles("src", [".js", ".jsx"])) {
    if (file.startsWith(STYLE_DIR)) continue;
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/--[\w-]+/g)) writtenByCode.add(match[0]);
  }
  const missing = [...referenced].filter((name) => !defined.has(name) && !writtenByCode.has(name));
  assert.deepEqual(missing, [], `以下自定义属性被引用但没有定义：${missing.join(", ")}`);
  console.log(`PASS variables: 样式引用的 ${referenced.size} 个自定义属性都有定义`);
}

async function checkFonts() {
  const sheets = await readStyleSheets();
  const referenced = new Set();
  for (const { contents } of sheets) {
    for (const match of contents.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      if (match[1].startsWith("/assets/fonts/")) referenced.add(path.basename(match[1]));
    }
  }
  const present = (await readdir(FONT_DIR)).filter((entry) => !entry.startsWith("."));
  for (const name of referenced) await access(path.join(FONT_DIR, name));
  const orphans = present.filter((name) => !referenced.has(name));
  assert.deepEqual(orphans, [], `字体目录里有样式未引用的文件：${orphans.join(", ")}`);
  const index = await readFile(`${STYLE_DIR}/index.css`, "utf8");
  const imported = [...index.matchAll(/@import\s+["']\.\/(.*?)["']/g)].map((match) => match[1]);
  assert.ok(imported.length > 0, "index.css 必须导入恢复的样式表");
  for (const file of imported) await access(path.join(STYLE_DIR, file));

  // 入口页（/）的样式不经过文章页的 index.css，而是由 index.html 直接 link。
  const entries = ["index.html", "origin/index.html", "component/index.html"];
  const linked = new Set();
  for (const entry of entries) {
    const html = await readFile(entry, "utf8");
    for (const match of html.matchAll(/<link[^>]+href="\/src\/styles\/([^"]+)"/g)) linked.add(match[1]);
  }
  for (const file of linked) await access(path.join(STYLE_DIR, file));

  const onDisk = (await readdir(STYLE_DIR)).filter((file) => file.endsWith(".css"));
  const unused = onDisk.filter(
    (file) =>
      !imported.includes(file) &&
      !linked.has(file) &&
      file !== "index.css" &&
      file !== "local-shell.css",
  );
  assert.deepEqual(unused, [], `存在未被导入的样式表：${unused.join(", ")}`);
  console.log(
    `PASS assets: ${referenced.size} 个字体文件被引用且无孤儿文件，` +
      `${imported.length + linked.size} 个样式表全部被导入`,
  );
}

// 三个入口文件与构建配置必须一一对应：改了目录结构而忘记改配置时在这里报出来。
async function checkEntries() {
  const entries = [
    { file: "index.html", markers: ["landing__cards", 'href="origin/"', 'href="component/"'] },
    { file: "origin/index.html", markers: ['id="site-header"', "/src/main.jsx"] },
    { file: "component/index.html", markers: ['id="lab-root"', "/src/lab/main.jsx"] },
  ];
  const config = await readFile("vite.config.js", "utf8");
  for (const { file, markers } of entries) {
    const html = await readFile(file, "utf8");
    for (const marker of markers) assert.ok(html.includes(marker), `${file} 缺少 ${marker}`);
    assert.ok(config.includes(`"${file}"`), `vite.config.js 没有把 ${file} 列为构建入口`);
  }
  console.log(`PASS entries: ${entries.length} 个入口文件与构建配置一致`);
}

await checkModulesInitialize();
await checkClassCoverage();
await checkCustomProperties();
await checkFonts();
await checkEntries();
