// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { ModelKernel } from "./ModelKernel.jsx";
import { ec } from "./scenario-inputs-2.jsx";
let eM =
  "Where the curve passes today: the best empirical reading at mid-2026, which every scenario path runs through.";
function eT(e, t) {
  let a;
  a = {
    anchor: e.x0,
    slope: e.g,
    ceil: e.ceil,
  };
  return ModelKernel.linearAt(t, a, ec);
}
let eP = (e) => Math.max(0, Math.min(1, e));
export { eM, eT, eP };
