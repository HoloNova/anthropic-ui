// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { SCENARIO_KEYS } from "./scenario-inputs.jsx";
import { getPresetScenario } from "./question-specs.jsx";
import { eb, ew, ed } from "./scenario-inputs-2.jsx";
import { sp, sb, sw, sh, sM, sk, sj, sT, sL } from "./model-metrics.jsx";
import { eA } from "./scenario-presets.jsx";
let oQ = (e) => e[e.length - 1].v;
function oZ(e) {
  let t = null;
  return () =>
    (t ??= SCENARIO_KEYS.map((t) => ({
      points: e({
        inputs: getPresetScenario(t),
        scenario: t,
      }),
      color: eb[t],
      label: ew[t],
    })));
}
let o0 = (e) =>
  e.map((e) => ({
    t: e.t,
    v: (e.v / 100) * sp,
  }));
let o1 = oZ(({ inputs, scenario }) => o0(sb(inputs, scenario).ai));
let o2 = [
  [0.5, "real, but within the noise of the productivity statistics"],
  [2.5, "clearly visible in the data by decade’s end"],
  [1 / 0, "large enough to dominate aggregate productivity growth"],
];
let o5 = [];
for (let e = 2025; e <= 2030; e += 0.25) o5.push(e);
let o3 = (e) =>
  e < 10 ? e.toFixed(1).replace(/\.0$/, "") : String(Math.round(e));
let o6 = (e, t) => {
  let { w: a, d: s } = e.production;
  return eA(a, t) * eA(s, t);
};
let o4 = (e) =>
  o5.map((t) => ({
    t,
    v: 100 * o6(e, t),
  }));
let o8 = oZ(({ inputs }) => o4(inputs));
let o7 = (e) =>
  e.map((e) => ({
    t: e.t,
    v: 2 + e.v,
  }));
let o9 = oZ(({ inputs }) => o7(sw(inputs, sh).actual));
function re(e) {
  let t = Math.abs(e);
  return 0 === t
    ? "0"
    : t < 0.01
      ? e.toFixed(4)
      : t < 1
        ? e.toFixed(2)
        : t >= 1 && 1e-6 > Math.abs(e - Math.round(e))
          ? e.toFixed(0)
          : t < 20
            ? e.toFixed(1)
            : e.toFixed(0);
}
let rt = oZ(({ inputs }) => sw(inputs, sh).research);
let ra = 100 * ed;
let rs = oZ(({ inputs }) => sM(inputs));
let rl = (e) => (10 > Math.abs(e) ? e.toFixed(1) : Math.round(e).toString());
let ro = oZ(({ inputs }) => sk(inputs));
let rr = oZ(({ inputs }) => sj(inputs).exposed);
let rn = (e) => (10 > Math.abs(e) ? e.toFixed(1) : Math.round(e).toString());
let ri = (e) => {
  let t = Math.abs(e);
  return 1e-9 > Math.abs(t - Math.round(t))
    ? t.toFixed(0)
    : t < 20
      ? t.toFixed(1)
      : t.toFixed(0);
};
let rd = (e) => (e > 1e-9 ? `+${ri(e)}` : e < -1e-9 ? `\u2212${ri(e)}` : "0");
let rc = (e) => e[e.length - 1].v;
let ru = oZ(({ inputs }) => sT(inputs).rate);
let rh = (e) => (10 > Math.abs(e) ? e.toFixed(1) : Math.round(e).toString());
let rm = oZ(({ inputs }) => sL(inputs).affected);
let rp = (e) => (e < 10 ? e.toFixed(1) : Math.round(e).toString());
export {
  oQ,
  oZ,
  o0,
  o1,
  o2,
  o5,
  o3,
  o6,
  o4,
  o8,
  o7,
  o9,
  re,
  rt,
  ra,
  rs,
  rl,
  ro,
  rr,
  rn,
  ri,
  rd,
  rc,
  ru,
  rh,
  rm,
  rp,
};
