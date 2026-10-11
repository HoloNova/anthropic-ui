// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionLaborShareStyles from "../styles/SectionLaborShare.classes.js";
import { lm } from "./model-series.jsx";
import { ed } from "./scenario-inputs-2.jsx";
import { useElementSize, GraphPaper, aI } from "./layout-hooks.jsx";
import { FindingHead } from "./FindingHead.jsx";
import {
  ScenarioGrowthOutline,
  ScenarioSquareRow,
} from "./ScenarioSquareRow.jsx";
import { lz, ChartKey } from "./ChartKey.jsx";
import { ShareStrokes } from "./ShareStrokes.jsx";
import {
  MARKER_FILTER_ID,
  DRY_FILTER_ID,
  RULE_FILTER_ID,
} from "./drawing-noise.jsx";
import { makeLiteFilter } from "./drawing-strokes.jsx";
let lV = (e) => Math.max(0, Math.min(100, e)).toFixed(1);
function SectionLaborShare({ user, children, className }) {
  let s = React.useMemo(
      () => [...lm(user)].sort((e, t) => e.gdp2030 - t.gdp2030),
      [user],
    ),
    l = Math.max(...s.map((e) => e.levelRatio)),
    o = 100 * ed,
    r = Math.max(
      ...s.map((e) => (e.levelRatio / l) * (Math.round(e.cents) / 100)),
    ),
    n = React.useRef(null),
    i = useElementSize(n);
  return (
    <React.Fragment>
      <FindingHead
        eyebrow={"Finding 4: Labor vs. capital share"}
        title={"The pie will grow, but a larger share might go to capital"}
      >
        <p>
          {"Today, of each dollar the economy produces, about "}
          {o.toFixed(0)}
          {"¢ goes to workers and "}
          {(100 - o).toFixed(0)}
          {
            "¢ go to capital. If the economy grows, but AI automates more tasks, more of each dollar might go to capital. This can happen even when wages for all workers rise substantially. If capital becomes more useful for more things, it will be in higher demand, which raises its price. In that world, more of the gains from a growing economy flow to owners of capital."
          }
        </p>
        <p>
          {
            "We find that the labor share falls noticeably in the substantial and extreme scenarios, and the capital share rises. Average wages rise—non-knowledge workers are paid much more—but wages for knowledge workers stagnate or decline alongside worsening unemployment."
          }
        </p>
        <p>
          {
            "In the extreme scenario, the gains from a rapidly expanding economy are unevenly distributed. Most knowledge workers face either lower wages or unemployment, and workers overall get a smaller fraction of the larger pie. Total labor income is barely changed by 2030."
          }
        </p>
        <p>
          {
            "In this scenario, the main challenge is not achieving economic growth, but making sure the benefits are broadly shared and the costs aren’t unequally dispersed."
          }
        </p>
      </FindingHead>
      {children}
      <section
        className={`${sectionLaborShareStyles.section} ${sectionLaborShareStyles.static} ${className ?? ""}`}
      >
        <div className={sectionLaborShareStyles.figures}>
          <GraphPaper className={sectionLaborShareStyles.paper} />
          <p className={sectionLaborShareStyles.chartTitle}>
            {"How GDP is shared between workers and capital"}
          </p>
          <div
            className={sectionLaborShareStyles.rows}
            ref={n}
            style={{
              ...(i.x || i.y
                ? {
                    transform: `translate(${i.x}px, ${i.y}px)`,
                  }
                : null),
              "--split-at": r,
            }}
          >
            {s.map((e, t) => {
              var a;
              let s;
              return (
                <div
                  className={
                    e.isYou
                      ? `${sectionLaborShareStyles.row} ${sectionLaborShareStyles.you}`
                      : sectionLaborShareStyles.row
                  }
                  key={e.key}
                >
                  {e.isYou && <ScenarioGrowthOutline />}
                  <div
                    className={sectionLaborShareStyles.who}
                    {...{
                      [aI]: "",
                    }}
                  >
                    <p className={sectionLaborShareStyles.name}>{e.label}</p>
                    {e.blurb && (
                      <p className={sectionLaborShareStyles.blurb}>{e.blurb}</p>
                    )}
                  </div>
                  <div className={sectionLaborShareStyles.gridSlot}>
                    <ScenarioSquareRow
                      comp={lz(e.comp)}
                      cols={6}
                      fitWidth={156}
                    />
                  </div>
                  <div className={sectionLaborShareStyles.barSlot}>
                    <ShareStrokes
                      cents={e.cents}
                      seed={t + 1}
                      todayCents={o}
                      widthFraction={e.levelRatio / l}
                      sizeLabel={`$${Number(e.gdp2030.toFixed(1))}T GDP`}
                      sizeCut={"caption-1"}
                      sizeAt={"bar-end"}
                      anchorFraction={r}
                    />
                    <p className={sectionLaborShareStyles.read}>
                      <React.Fragment>
                        <span className={sectionLaborShareStyles.readLabour}>
                          <b>
                            {lV(e.cents)}
                            {"%"}
                          </b>
                          <i>{"to labor"}</i>
                        </span>
                        <span className={sectionLaborShareStyles.readCapital}>
                          <b>
                            {lV(100 - e.cents)}
                            {"%"}
                          </b>
                          <i>
                            {"to capital"}
                            {0 ===
                            (s = Number(Math.abs((a = -e.sharePP)).toFixed(1)))
                              ? ""
                              : ` (${a > 0 ? "up" : "down"} ${s.toFixed(1)} points)`}
                          </i>
                        </span>
                      </React.Fragment>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={sectionLaborShareStyles.keyRow}>
          <ChartKey
            items={["augmented", "automated", "newWork"]}
            sizeNote={"Productivity"}
            className={sectionLaborShareStyles.taskKey}
            title={"Task types"}
          />
        </div>
        <p className={sectionLaborShareStyles.caption}>
          {
            "With each scenario, the total economy grows (measured in GDP). But more of the growth goes to capital, compared to the amount people receive in their wages. Some professions see their wages increase significantly, but overall, wages make up a smaller share of the country’s economic growth."
          }
        </p>
      </section>
    </React.Fragment>
  );
}
function MarkerFilters() {
  return (
    <svg
      width={"0"}
      height={"0"}
      style={{
        position: "absolute",
      }}
      aria-hidden={true}
      focusable={"false"}
    >
      <defs
        dangerouslySetInnerHTML={{
          __html:
            '<filter id="' +
            MARKER_FILTER_ID +
            '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="7" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="-0.30" k4="0" result="inked"/><feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="2" seed="11" result="warp"/><feDisplacementMap in="inked" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="' +
            DRY_FILTER_ID +
            '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="-0.55" k4="0" result="inked"/><feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="2" seed="9" result="warp"/><feDisplacementMap in="inked" in2="warp" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="' +
            RULE_FILTER_ID +
            '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="5" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="-0.12" k4="0" result="inked"/><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="3" result="warp"/><feDisplacementMap in="inked" in2="warp" scale="0.6" xChannelSelector="R" yChannelSelector="G"/></filter>' +
            makeLiteFilter("mk-marker-lite", 0.55, 7, -0.3) +
            makeLiteFilter("mk-dry-lite", 0.9, 4, -0.55) +
            makeLiteFilter("mk-rule-lite", 0.72, 5, -0.12),
        }}
      />
    </svg>
  );
}
export { lV, SectionLaborShare, MarkerFilters };
