// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { at, t8 } from "./drawing-strokes.jsx";
function makeDryStroke(e, t = {}) {
  return at(e, t).join("");
}
function makeRuleStroke(e, t = {}) {
  return t8(makeDryStroke(e, t), t);
}
export { makeDryStroke, makeRuleStroke };
