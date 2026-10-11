// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
let ib = [
  "..X..",
  ".XXX.",
  "X.X.X",
  "X.X..",
  ".XX..",
  "..XX.",
  "..X.X",
  "X.X.X",
  ".XXX.",
  "..X..",
];
let iS = [];
ib.forEach((e, t) =>
  [...e].forEach(
    (e, a) =>
      "X" === e &&
      iS.push({
        c: a,
        r: t,
      }),
  ),
);
export { ib, iS };
