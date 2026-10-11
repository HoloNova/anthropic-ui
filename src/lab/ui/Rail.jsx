import * as React from "react";

/* 侧边栏。结构取自 claude.dev 的文章页：树形章节 + 字符进度条 + 底部块，
   配色与字体则全部用本项目的 ivory 主题变量，让它看起来是这一页原生的一部分。 */

const BAR_CELLS = 28;

/* 图鉴的文本版；BASE 支持部署在子路径。 */
const MARKDOWN_URL = `${import.meta.env.BASE_URL}component.md`;

/* 一次 rAF 里同时算进度与当前章节，避免两套监听各自触发重排。 */
function useReadingState(nav) {
  let [state, setState] = React.useState({ progress: 0, scrolled: false, overviewGone: false, part: "", card: "" });
  let nodes = React.useRef(null);

  React.useEffect(() => {
    nodes.current = {
      parts: nav.map((group) => [group.id, document.getElementById(group.id)]),
      cards: nav.flatMap((group) => group.items.map(([id]) => [id, group.id, document.getElementById(id)])),
      overview: document.getElementById("overview-scene"),
    };
  }, [nav]);

  React.useEffect(() => {
    let frame = 0;

    let compute = () => {
      frame = 0;
      let doc = document.documentElement;
      let total = doc.scrollHeight - window.innerHeight;
      let progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;

      // 视口上方 120px 处放一根「读到这里了」的标尺。
      let anchor = 120;
      let part = "";
      let card = "";
      let cache = nodes.current;
      if (cache) {
        for (let [id, node] of cache.parts) {
          if (node && node.getBoundingClientRect().top <= anchor) part = id;
        }
        const candidates = cache.cards.filter(([, group, node]) => group === part && node);
        for (let [id, , node] of candidates) {
          if (node.getBoundingClientRect().top <= anchor) card = id;
        }
        if (!card && candidates.length) card = candidates[0][0];
      }
      const overviewGone = Boolean(cache?.overview && cache.overview.getBoundingClientRect().bottom <= 0);
      const next = { progress, scrolled: overviewGone, overviewGone, part, card };
      setState((current) => Object.keys(next).every((key) => current[key] === next[key]) ? current : next);
    };

    let onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // 折叠说明、字体加载和窄屏变化也会改变文档高度。
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    observer?.observe(document.body);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return state;
}

/* 复制当前地址。降级成一个普通链接，右键或中键仍然能用。 */
function CopyUrl({ label = "Copy URL" }) {
  let [href, setHref] = React.useState("#");
  let [done, setDone] = React.useState(false);

  React.useEffect(() => setHref(window.location.href), []);

  React.useEffect(() => {
    if (!done) return;
    let timer = window.setTimeout(() => setDone(false), 1400);
    return () => window.clearTimeout(timer);
  }, [done]);

  return (
    <a
      role="button"
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigator.clipboard?.writeText(window.location.href).then(
          () => setDone(true),
          () => setDone(false),
        );
      }}
    >
      <span className="rail__br">└</span>
      {done ? "已复制" : label}
    </a>
  );
}

/* /component.md 是构建时生成的静态文件（scripts/build-lab-md.mjs）。
   点击时复制到剪贴板；没有 JS 时退化成普通链接，点开就是 markdown 原文。 */
function CopyMarkdown({ label = "Copy markdown" }) {
  let [done, setDone] = React.useState(false);
  let cached = React.useRef(null);

  React.useEffect(() => {
    let alive = true;
    fetch(MARKDOWN_URL)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error("missing"))))
      .then((text) => {
        if (alive) cached.current = text;
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    if (!done) return;
    let timer = window.setTimeout(() => setDone(false), 1400);
    return () => window.clearTimeout(timer);
  }, [done]);

  return (
    <a
      role="button"
      href={MARKDOWN_URL}
      onClick={(event) => {
        event.preventDefault();
        // 预取过的文本在点击手势里同步写入，避免被浏览器判定为异步剪贴板操作。
        if (cached.current) {
          navigator.clipboard?.writeText(cached.current).then(
            () => setDone(true),
            () => setDone(false),
          );
          return;
        }
        fetch(MARKDOWN_URL)
          .then((response) => response.text())
          .then((text) => navigator.clipboard?.writeText(text))
          .then(() => setDone(true), () => setDone(false));
      }}
    >
      <span className="rail__br">└</span>
      {done ? "已复制" : label}
    </a>
  );
}

function RailTree({ nav, state, onNavigate, expanded = false }) {
  return (
    <nav className="rail__tree" aria-label="章节目录">
      {nav.map((group) => {
        const active = state.part === group.id;
        return (
          <div className="rail__group" key={group.id} style={{ "--menu-order": group.no }}
            data-open={expanded || active ? "true" : undefined}>
            <a className="rail__link" href={`#${group.id}`} onClick={onNavigate} aria-current={active ? "true" : undefined}>
              <span className="rail__br">└</span>
              {group.title}
              <span className="rail__no">{group.no}</span>
            </a>
            {group.items.length ? (
              <div className="rail__subs">
                <div>
                  {group.items.map(([id, label]) => (
                    <a className="rail__link rail__link--sub" key={id} href={`#${id}`} onClick={onNavigate}
                      aria-current={state.card === id ? "true" : undefined}>
                      <span className="rail__br">└</span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

function Rail({ nav, state }) {
  let filled = Math.round(state.progress * BAR_CELLS);
  let percent = String(Math.round(state.progress * 100)).padStart(2, "0");

  return (
    <aside className="rail" aria-label="章节">
      <div className="rail__title" data-on={state.scrolled ? "true" : undefined}>
        手绘水彩渲染引擎拆解
      </div>

      <div className="rail__th">TREE</div>

      <RailTree nav={nav} state={state} />

      <div className="rail__prog" aria-hidden="true">
        <b>{"▓".repeat(filled)}</b>
        {"░".repeat(BAR_CELLS - filled)}
        <span className="rail__pct">{percent}%</span>
      </div>
      <div className="rail__hint">
        PRESS <span className="rail__arr">↑</span> / <span className="rail__arr">↓</span> TO SCROLL
      </div>

      <div className="rail__bottom" hidden={!state.overviewGone}>
        <div className="rail__foot">
          <div className="rail__th">SHARE</div>
          <CopyUrl />
          <CopyMarkdown />
          <a href="/">
            <span className="rail__br">└</span>Original Page
          </a>
        </div>
      </div>
    </aside>
  );
}

export { Rail, RailTree, useReadingState };
