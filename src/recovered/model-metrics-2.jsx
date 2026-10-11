// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
let su = (e, t) => {
  let a = [];
  for (let s = e; s <= t; s++)
    for (let e = 0; e < 12 && s + e / 12 <= t + 1e-9; e++)
      a.push(0 === e ? s : s + e / 12);
  return a;
};
export { su };
