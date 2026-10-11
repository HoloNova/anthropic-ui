// 图鉴页的冒烟测试：用 Vite 的 SSR 管线把 <Lab /> 渲染成字符串。
// 目的不是检查视觉，而是把「某个 demo 调错了参数 / 引用了 undefined」这类运行时错误
// 在没有浏览器的情况下提前暴露出来。不监听端口，跑完即关。
// 页面地址：/component（入口 component/index.html），文本版 /component.md。
import { createServer } from "vite";
import { createRequire } from "node:module";

// React 是 CJS，直接用 Node 的 require 加载；Vite 只负责转译工程里的 JSX 模块。
const require = createRequire(import.meta.url);
const React = require("react");
const { renderToString } = require("react-dom/server");

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  const { Lab } = await server.ssrLoadModule("/src/lab/Lab.jsx");

  const html = renderToString(React.createElement(Lab));

  const checks = [
    ["包含图鉴标题", html.includes("手绘水彩渲染引擎拆解")],
    ["项目名指向官方源站", html.includes("https://www.anthropic.com/institute/econ-scenarios")],
    ["返回原页面的链接指向 /origin/", html.includes('href="/origin/"')],
    ["markdown 入口指向 component.md", html.includes("component.md")],
    ["包含滤镜注册节点", html.includes("mk-marker")],
    ["包含侧边栏树形章节", html.includes("rail__tree") && html.includes("rail__link--sub")],
    ["包含字符进度条", html.includes("rail__prog") && html.includes("░")],
    ["包含方格网格笔触", html.includes("<path")],
    ["包含扇形曲线段", html.length > 150000],
  ];

  let failed = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
    if (!ok) failed += 1;
  }
  console.log(`\nSSR 输出 ${html.length.toLocaleString()} 字符，失败 ${failed} 项`);
  if (failed) process.exitCode = 1;
} catch (error) {
  console.error("SSR 渲染失败：\n", error);
  process.exitCode = 1;
} finally {
  await server.close();
}
