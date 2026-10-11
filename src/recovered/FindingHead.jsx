// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import findingHeadStyles from "../styles/FindingHead.classes.js";
import * as React from "react";
function FindingHead({
  eyebrow,
  title,
  children,
  flushTop = false,
  className,
}) {
  return (
    <div
      className={[
        findingHeadStyles.section,
        flushTop && findingHeadStyles.flushTop,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={findingHeadStyles.head}>
        <h2 className={findingHeadStyles.title}>
          {eyebrow && (
            <span className={findingHeadStyles.eyebrow}>{eyebrow}</span>
          )}
          {title}
        </h2>
        {children && (
          <div className={findingHeadStyles.standfirst}>{children}</div>
        )}
      </div>
    </div>
  );
}
export { FindingHead };
