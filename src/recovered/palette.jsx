// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
let MODEST_PALETTE = ["#6A9BCC", "#8BADCF", "#A8C4DE", "#C4D9EA"];
let SUBSTANTIAL_PALETTE = ["#788C5D", "#8AA16D", "#A2B48B", "#B3C1A0"];
let EXTREME_PALETTE = ["#C46686", "#CC7D98", "#D89EB0", "#E2B6C4"];
function pickPaletteShade(e, t) {
  return t < 0.42 ? e[0] : t < 0.72 ? e[1] : t < 0.92 ? e[2] : e[3];
}
let SCENARIO_PALETTES = {
  slow: MODEST_PALETTE,
  central: SUBSTANTIAL_PALETTE,
  fast: EXTREME_PALETTE,
};
let NEUTRAL_INK = "#BDBAAE";
let AUGMENTATION_INK = "#918BD6";
let AUTOMATION_INK = "#6A9BCC";
let NEW_TASK_INK = "#F0AC54";
let BASELINE_INK = "#D97757";
let CHART_THEME = {
  paper: "#FAF9F5",
  rule: "#87867F",
  text: "#141413",
  history: "#9C9A92",
  baseline: BASELINE_INK,
};
export {
  MODEST_PALETTE,
  SUBSTANTIAL_PALETTE,
  EXTREME_PALETTE,
  pickPaletteShade,
  SCENARIO_PALETTES,
  NEUTRAL_INK,
  AUGMENTATION_INK,
  AUTOMATION_INK,
  NEW_TASK_INK,
  BASELINE_INK,
  CHART_THEME,
};
