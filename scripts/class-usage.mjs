import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default ?? traverseModule;
const CODE_EXTENSIONS = ['.js', '.jsx'];
const STYLE_MAP_IMPORT = /styles\/([A-Za-z0-9_]+)\.classes\.js$/;
const TOKEN = /[^A-Za-z0-9_-]+/;

// 递归列出文件。样式映射本身不参与“谁引用了类名”的统计。
async function listFiles(root, extensions) {
  const found = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...(await listFiles(target, extensions)));
    else if (extensions.some(extension => entry.name.endsWith(extension))) found.push(target);
  }
  return found;
}

// 恢复出的 *.classes.js 只导出类名对象，可直接导入读取键值。
export async function loadStyleMaps(styleDir) {
  const maps = new Map();
  for (const file of await readdir(styleDir)) {
    if (!file.endsWith('.classes.js')) continue;
    const module = await import(pathToFileURL(path.join(styleDir, file)).href);
    maps.set(file.replace('.classes.js', ''), { file, classes: module.default });
  }
  return maps;
}

// 站点级组件（页头、页脚、导航）没有对应的恢复映射，只能从样式表本身收集类名。
async function collectStylesheetClasses(styleDir) {
  const classes = new Set();
  for (const file of await readdir(styleDir)) {
    if (!file.endsWith('.css') || file === 'index.css') continue;
    const contents = await readFile(path.join(styleDir, file), 'utf8');
    for (const match of contents.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classes.add(match[1]);
  }
  return classes;
}

function collectCodeFiles() {
  return listFiles('src', CODE_EXTENSIONS).then(files =>
    files.filter(file => !file.endsWith('.classes.js')));
}

// 逐文件找样式映射的成员访问；无法静态确定的访问按“整表使用”处理。
function inspectCode(source, file, maps, used, keepAll) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const mapBindings = new Map();
  traverse(ast, {
    ImportDeclaration(nodePath) {
      const match = nodePath.node.source.value.match(STYLE_MAP_IMPORT);
      if (!match) return;
      const name = match[1];
      if (!maps.has(name)) throw new Error(`${file}: unknown style map ${name}`);
      for (const specifier of nodePath.node.specifiers) mapBindings.set(specifier.local.name, name);
    },
  });
  const readKey = (mapName, key) => {
    const classes = maps.get(mapName).classes;
    if (!(key in classes)) return;
    used.add(classes[key]);
  };
  traverse(ast, {
    MemberExpression(nodePath) {
      const { node } = nodePath;
      if (!nodePath.get('object').isIdentifier()) return;
      const mapName = mapBindings.get(node.object.name);
      if (!mapName) return;
      if (!node.computed && nodePath.get('property').isIdentifier()) readKey(mapName, node.property.name);
      else if (node.computed && nodePath.get('property').isStringLiteral()) readKey(mapName, node.property.value);
      else keepAll.add(mapName);
    },
    ReferencedIdentifier(nodePath) {
      const mapName = mapBindings.get(nodePath.node.name);
      if (!mapName) return;
      // 映射被当参数传递、展开或整体使用时代码里仍有属性访问，无法在此判定。
      const parent = nodePath.parentPath;
      if (parent.isMemberExpression({ object: nodePath.node })) return;
      keepAll.add(mapName);
    },
  });
}

// 代码里的字符串可能是 class 列表、选择器或普通词；只按“模块类”与“工具类”两个来源判定。
function inspectLiterals(source, mapClasses, utilityClasses, used, literalText) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const literals = [];
  traverse(ast, {
    StringLiteral(nodePath) {
      literals.push(nodePath.node.value);
    },
    JSXAttribute(nodePath) {
      if (nodePath.node.value?.type === 'StringLiteral') literals.push(nodePath.node.value.value);
    },
    TemplateElement(nodePath) {
      // 模板字符串的片段也进入引用文本（字体变量、动画名等按全文匹配）。
      literalText.push(nodePath.node.value.raw);
    },
  });
  for (const literal of literals) {
    literalText.push(literal);
    for (const token of literal.split(TOKEN)) {
      // 代码里会大量出现 “rest”“n” 这类与样式同名的普通词。
      // 模块类（BEM 双下划线）与带连字符的工具类才采信，其余忽略。
      if (mapClasses.has(token)) used.add(token);
      else if (utilityClasses.has(token) && (token.includes('__') || (token.includes('-') && token.length >= 5)))
        used.add(token);
    }
  }
}

// 注入的页头 HTML 与 index.html 里的 class 一定会出现在 DOM 中，全部计入。
async function collectHtmlClasses(htmlFiles, used, literalText) {
  for (const file of htmlFiles) {
    const contents = await readFile(file, 'utf8');
    for (const match of contents.matchAll(/class="([^"]*)"/g)) {
      literalText.push(match[1]);
      for (const token of match[1].split(TOKEN)) {
        if (token) used.add(token);
      }
    }
  }
}

export async function collectClassUsage({ styleDir = 'src/styles', htmlFiles } = {}) {
  const pages = htmlFiles ?? [...(await listFiles('src/content', ['.html'])), 'index.html'];
  const maps = await loadStyleMaps(styleDir);
  const mapClasses = new Set([...maps.values()].flatMap(map => Object.values(map.classes)));
  const utilityClasses = await collectStylesheetClasses(styleDir);
  const allClasses = new Set([...mapClasses, ...utilityClasses]);
  const used = new Set();
  const keepAll = new Set();
  const literalText = [];
  for (const file of await collectCodeFiles()) {
    const source = await readFile(file, 'utf8');
    inspectCode(source, file, maps, used, keepAll);
    inspectLiterals(source, mapClasses, utilityClasses, used, literalText);
  }
  await collectHtmlClasses(pages, used, literalText);
  for (const mapName of keepAll) {
    for (const className of Object.values(maps.get(mapName).classes)) used.add(className);
  }
  for (const className of used) {
    if (!allClasses.has(className) && !className.startsWith('study-')) {
      // 本地封装的类名单独维护；其余类名必须来自恢复样式或样式表，否则说明映射统计有遗漏。
      throw new Error(`Class used in code but missing from styles: ${className}`);
    }
  }
  return { maps, allClasses, used, keepAll, literalText: literalText.join('\n') };
}
