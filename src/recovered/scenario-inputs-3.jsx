// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import { er } from "./scenario-inputs-2.jsx";
import { ep } from "./question-specs.jsx";
function cloneScenarioInputs(e) {
  let t = er("central"),
    { production: a, labor: s } = e,
    l = 1e-12 > Math.abs(a.w.xb - ep) ? null : a.w.xb;
  return {
    ...t,
    mAnchor: a.w.x0,
    m2030: a.w.x30,
    mCeil: l,
    mKappa: null,
    dAnchor: a.d.x0,
    d2030: a.d.x30,
    dCeil: a.d.xb,
    dKappa: null,
    aAnchor: a.a.x0,
    aSlope: a.a.g,
    aCeil: a.a.ceil ?? t.aCeil,
    eps: a.eps,
    sigma: a.sigma,
    psiAnchor: s.phi.x0,
    psiFloor: 0,
    psiCeil: s.phi.xb,
    psiKappa: s.phi.k,
    rho: s.rho,
    theta: s.theta,
    gamma: s.gamma,
    qBar: s.qbar,
    uBar: s.ubar,
    muCN: Math.max(0, Math.min(1, s.mu)),
    muNC: Math.max(0, Math.min(1, s.mu)),
    horizon: 2035,
  };
}
export { cloneScenarioInputs };
