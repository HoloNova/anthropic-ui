import { defineConfig } from "vite";
import { resolve } from "node:path";

/* 部署在子路径（例如 https://example.com/study/）时用 BASE=/study/ npm run build。
   默认部署在域名根目录。 */
const base = process.env.BASE ?? "/";

/* 静态服务器给 .md 的默认 Content-Type 只有 text/markdown，没有 charset。
   浏览器直接打开这个地址时会退回系统默认编码（中文 Windows 上是 GBK），
   于是同一份 UTF-8 文件在剪贴板里正常、在地址栏里变成乱码。
   这里只给 .md 响应补上 charset，其它文件的类型不动。
   线上由 public/_headers 提供同样的规则（Netlify / Cloudflare Pages）。 */
const MARKDOWN_TYPE = "text/markdown; charset=utf-8";

/* 两个页面是目录入口：/origin/ 与 /component/。
   真实的静态托管（Netlify、Cloudflare Pages、nginx、Apache）都会把不带斜杠的
   /origin 重定向到 /origin/，这里让本地开发服务器与 preview 保持同样的行为，
   否则 Vite 会按 SPA 回退把入口页当成 /origin 的内容。 */
function staticSiteRoutes() {
  const prefix = base.endsWith("/") ? base.slice(0, -1) : base;
  const pages = [`${prefix}/origin`, `${prefix}/component`];

  const attach = (server) => {
    server.middlewares.use((req, res, next) => {
      if (!req.url) return next();
      const [pathname, search] = req.url.split(/(?=\?)/);

      if (pages.includes(pathname)) {
        res.writeHead(301, { Location: `${pathname}/${search ?? ""}` });
        res.end();
        return;
      }

      if (pathname.endsWith(".md")) {
        const setHeader = res.setHeader.bind(res);
        res.setHeader = (name, value) => {
          const key = String(name);
          const isMarkdown = /^content-type$/i.test(key) && /^text\/markdown\b/i.test(String(value));
          return setHeader(key, isMarkdown ? MARKDOWN_TYPE : value);
        };
      }

      next();
    });
  };

  return { name: "static-site-routes", configureServer: attach, configurePreviewServer: attach };
}

export default defineConfig({
  base,
  plugins: [staticSiteRoutes()],
  // 静态多页站点：未知路径应当 404，而不是回退到入口页。
  appType: "mpa",
  // JSX 自动运行时让新写的薄封装与恢复的组件都无需手动 default import React。
  esbuild: { jsx: "automatic" },
  build: {
    // 便于在本地研究构建结果；源文件仍然位于 src/，不以 dist/ 作为源码交付。
    sourcemap: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      // 三个入口：入口页 /，原页面 /origin，渲染引擎拆解 /component。
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        origin: resolve(import.meta.dirname, "origin/index.html"),
        component: resolve(import.meta.dirname, "component/index.html"),
      },
    },
  },
});
