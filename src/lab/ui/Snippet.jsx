import * as React from "react";
import { CodeBlock } from "./ConceptHint.jsx";

/* 源码折叠块。code 一律来自 `?raw` 导入的真实文件内容，
   这里只做按行切片和行号标注，不复制、不改写。 */

function sliceLines(source, start, end) {
  let lines = source.split("\n");
  if (!start) return { lines, offset: 1 };
  return { lines: lines.slice(start - 1, end), offset: start };
}

function CopyButton({ text, label = "复制" }) {
  let [done, setDone] = React.useState(false);
  React.useEffect(() => {
    if (!done) return;
    let timer = window.setTimeout(() => setDone(false), 1400);
    return () => window.clearTimeout(timer);
  }, [done]);
  return (
    <button
      type="button"
      className="lab-btn"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        navigator.clipboard?.writeText(text).then(
          () => setDone(true),
          () => setDone(false),
        );
      }}
    >
      {done ? "已复制" : label}
    </button>
  );
}

function quote(text) {
  return "```\n" + text + "\n```";
}

function Snippet({ title, path, start, end, source, note, highlight }) {
  let { lines, offset } = React.useMemo(() => sliceLines(source, start, end), [source, start, end]);
  let body = lines.join("\n");
  let hi = highlight || [];
  // 大文件全文很多，没用到的折叠块不预先渲染进 DOM。
  let [seen, setSeen] = React.useState(false);
  return (
    <details
      className="lab-fold"
      onToggle={(event) => {
        if (event.currentTarget.open && !seen) setSeen(true);
      }}
    >
      <summary className="lab-fold__sum">
        <span>{title || path}</span>
        <span className="lab-fold__meta">
          {path}
          {start ? `:${start}–${end}` : ""} · {lines.length} 行
        </span>
        <CopyButton text={body} />
      </summary>
      {!seen ? null : (
        <>
          {note ? (
            <p
              className="lab-fold__pre"
              style={{ borderTop: 0, paddingBottom: 0, color: "var(--foreground-tertiary)" }}
            >
              {note}
            </p>
          ) : null}
          <CodeBlock className="lab-fold__pre">
            {lines.map((line, index) => {
              let lineNo = offset + index;
              let on = hi.includes(lineNo);
              return (
                <span key={lineNo} style={on ? { background: "#f6e2c8" } : undefined}>
                  {String(lineNo).padStart(4, " ") + "  " + line + "\n"}
                </span>
              );
            })}
          </CodeBlock>
        </>
      )}
    </details>
  );
}

/* 直接展示一段字符串（比如 marker filter 的拼装结果），不涉及文件切片。 */
function RawSnippet({ title, body, meta }) {
  let [seen, setSeen] = React.useState(false);
  return (
    <details
      className="lab-fold"
      onToggle={(event) => {
        if (event.currentTarget.open && !seen) setSeen(true);
      }}
    >
      <summary className="lab-fold__sum">
        <span>{title}</span>
        <span className="lab-fold__meta">{meta}</span>
        <CopyButton text={body} />
      </summary>
      {seen ? <CodeBlock className="lab-fold__pre">{body}</CodeBlock> : null}
    </details>
  );
}

export { Snippet, RawSnippet, CopyButton, quote };
