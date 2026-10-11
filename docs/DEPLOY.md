# 部署说明

三个入口都是静态 HTML，没有服务端渲染、没有运行时接口调用，构建产物可以直接放到任意静态托管。

| 路径 | 内容 | 构建入口 | 源码 |
|---|---|---|---|
| `/` | 入口页：两个链接与来源说明 | `index.html` | 手写，样式在 `src/styles/landing.css` |
| `/origin` | 恢复后的原页面（文章 + 交互 + 手绘视觉） | `origin/index.html` | `src/main.jsx` → `src/recovered/` |
| `/component` | 手绘水彩渲染引擎拆解 | `component/index.html` | `src/lab/main.jsx` → `src/lab/` |
| `/component.md` | 拆解页的文本版 | `public/component.md` | `scripts/build-lab-md.mjs` 生成，不手写 |

## 构建

```sh
npm ci --include=dev     # 本机 NODE_ENV=production，需要显式带上开发依赖
npm run build            # 先生成 component.md，再构建 dist/
```

`dist/` 的结构：

```text
index.html          入口页
origin/index.html   原页面
component/index.html 拆解页
component.md        拆解页文本版
assets/             带哈希的 JS / CSS
assets/fonts/       三个字体族共 6 个文件
favicon.svg
_headers            Netlify / Cloudflare Pages 的响应头规则
```

产物里没有 `.map` 之外的额外文件；`dist/` 已加入 `.gitignore`，不需要提交。

## 部署到子路径

默认部署在域名根目录。若部署在子路径（例如 `https://example.com/study/`）：

```sh
BASE=/study/ npm run build
```

`vite.config.js` 会把 `base` 交给 Vite 处理资源与站内链接（`import.meta.env.BASE_URL`），入口页的两个链接本身是相对路径，因此也会跟着走。

## 必须检查的一项：markdown 的 charset

`/component.md` 是 UTF-8 文件。静态服务器默认给 `.md` 的响应头是 `text/markdown`，**不带 charset**；浏览器直接打开这个地址时会退回系统默认编码（中文 Windows 是 GBK），中文会变成乱码。

Vite 的开发服务器与 `npm run preview` 由 `vite.config.js` 里的中间件补上 `charset=utf-8`。线上需要自己配置：

- **Netlify / Cloudflare Pages**：仓库里的 `public/_headers` 会被复制到 `dist/_headers`，无需额外操作。
- **Vercel**：在 `vercel.json` 里写同样的规则：

  ```json
  {
    "headers": [
      {
        "source": "/component.md",
        "headers": [{ "key": "Content-Type", "value": "text/markdown; charset=utf-8" }]
      }
    ]
  }
  ```

- **nginx**：

  ```nginx
  location = /component.md {
    default_type "text/markdown; charset=utf-8";
  }
  ```

- **GitHub Pages**：无法自定义响应头。要么接受乱码，要么给 `public/component.md` 加上 UTF-8 BOM（`EF BB BF`），代价是复制出来的文本开头会带一个零宽字符。

## 不带斜杠的路径

`/origin` 与 `/component` 是目录入口，静态托管通常会把不带斜杠的请求重定向到带斜杠的形式：

- Netlify / Cloudflare Pages / nginx / Apache：自动 301 到 `/origin/`。
- GitHub Pages：同样会补上斜杠。
- 本地开发与 preview：`vite.config.js` 的中间件做同样的 301，行为与线上一致。

`appType: "mpa"` 保证未知路径返回 404，而不是回退到入口页。

## 部署前检查

```sh
npm run verify      # 原页面：模块初始化、类名覆盖、CSS 变量、字体资源
npm run lab:smoke   # 拆解页：SSR 渲染一遍，捕获 demo 运行时错误
npm run lab:check   # component.md 是否落后于卡片与源码
npm run build       # 生成 dist/
npm run preview     # 本地检查构建结果：/、/origin/、/component/、/component.md
```

页面本身不访问官网接口：字体已本地化，问卷答案只写进访问者的 `localStorage`。
