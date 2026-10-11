// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import outputPanelsStyles from "../styles/OutputPanels.classes.js";
import * as React from "react";
import { ed } from "./scenario-inputs-2.jsx";
import { ChartGrid } from "./LineChart.jsx";
import { MarkerBar } from "./MarkerBar.jsx";
import { ls } from "./model-metrics.jsx";
import { ShareStrokes } from "./ShareStrokes.jsx";
import { ChartKey } from "./ChartKey.jsx";
import { RateDotGrid } from "./RateDotGrid.jsx";
import { WorkerFlows } from "./SectionReallocation.jsx";
let oK = (e) => Math.max(0, Math.min(100, e)).toFixed(1);
function CentsLabel({ cents, split }) {
  return (
    <p
      className={outputPanelsStyles.splitRead}
      style={{
        "--split-at": Math.max(0, Math.min(1, split)),
      }}
    >
      <span className={outputPanelsStyles.splitLabour}>
        {oK(cents)}
        {"% labor"}
      </span>
      <span className={outputPanelsStyles.splitCapital}>
        {oK(100 - cents)}
        {"% capital"}
      </span>
    </p>
  );
}
function LaborShareChart({
  row,
  flows,
  layout = "grid",
  arrangement = "economy-first",
  panels,
  flowHeight,
  titlesOnly = false,
}) {
  let n,
    i = 100 * ed,
    d = Math.max(row.gdpToday, row.gdp2030),
    u = Math.min(1, row.gdpToday / d),
    h = Math.min(1, row.gdp2030 / d),
    m = "share-first" === arrangement,
    p = (
      <div className={outputPanelsStyles.panel} key={"economy"}>
        <ChartGrid opacity={0.62} />
        <p className={outputPanelsStyles.panelHead}>{"The economy"}</p>
        <div className={outputPanelsStyles.gdpRows}>
          <div className={outputPanelsStyles.gdpRow}>
            <span className={outputPanelsStyles.gdpName}>{"Today"}</span>
            <MarkerBar
              fraction={row.gdpToday / d}
              color={"var(--bar-ink)"}
              sublabel={`$${row.gdpToday.toFixed(1)}T`}
              seed={1}
              height={"mini" === layout ? 22 : 28}
              valueAt={"row-end"}
            />
          </div>
          <div className={outputPanelsStyles.gdpRow}>
            <span className={outputPanelsStyles.gdpName}>{row.year}</span>
            <MarkerBar
              fraction={row.gdp2030 / d}
              color={"var(--bar-ink)"}
              label={ls(row.gainPct)}
              sublabel={`$${row.gdp2030.toFixed(1)}T`}
              seed={2}
              height={"mini" === layout ? 22 : 28}
              valueAt={"row-end"}
            />
          </div>
        </div>
      </div>
    ),
    f = (
      <div className={outputPanelsStyles.panel} key={"share"}>
        <ChartGrid opacity={0.62} />
        <p className={outputPanelsStyles.panelHead}>
          {m
            ? `Labor and capital share — in an economy ${ls(row.gainPct)} bigger`
            : "Labor and capital share"}
        </p>
        <div className={outputPanelsStyles.waffle}>
          <div className={outputPanelsStyles.waffleRow}>
            <span className={outputPanelsStyles.waffleHead}>
              <span className={outputPanelsStyles.waffleName}>{"Today"}</span>
            </span>
            <ShareStrokes
              seed={1}
              cents={i}
              todayCents={i}
              widthFraction={u}
              sizeLabel={`$${row.gdpToday.toFixed(1)}T`}
              sizeAt={"bar-end"}
            />
            {!titlesOnly && <CentsLabel cents={i} split={(u * i) / 100} />}
          </div>
          <div className={outputPanelsStyles.waffleRow}>
            <span className={outputPanelsStyles.waffleHead}>
              <span className={outputPanelsStyles.waffleName}>{row.year}</span>
            </span>
            <ShareStrokes
              seed={2}
              cents={row.cents}
              todayCents={i}
              widthFraction={h}
              sizeLabel={`$${row.gdp2030.toFixed(1)}T`}
              sizeAt={"bar-end"}
            />
            {!titlesOnly && (
              <CentsLabel cents={row.cents} split={(h * row.cents) / 100} />
            )}
          </div>
        </div>
        <div className={outputPanelsStyles.panelFoot}>
          <ChartKey items={["labour", "moved", "capital"]} />
          {!titlesOnly && (
            <p className={outputPanelsStyles.priceBase}>
              {"All $ numbers are in 2025 prices"}
            </p>
          )}
        </div>
      </div>
    ),
    g = (
      <div className={outputPanelsStyles.panel} key={"unemployment"}>
        <ChartGrid opacity={0.62} />
        <p className={outputPanelsStyles.panelHead}>{"Unemployment"}</p>
        <RateDotGrid rates={row.rates} height={"mini" === layout ? 150 : 186} />
        {!titlesOnly && (
          <div className={outputPanelsStyles.panelFoot}>
            <p className={outputPanelsStyles.panelNote}>
              <b>
                {row.rates.affected[1].toFixed(1)}
                {"%"}
              </b>
              {" in the occupations AI reaches, against"}{" "}
              {row.rates.normalAffected.toFixed(1)}
              {"% without it"}
            </p>
          </div>
        )}
      </div>
    ),
    x =
      "mini" !== layout &&
      (m ||
        "grid" !== layout ||
        (panels?.length === 1 && "flow" === panels[0])),
    _ = (
      <div
        className={
          x
            ? `${outputPanelsStyles.panel} ${outputPanelsStyles.panelWide}`
            : outputPanelsStyles.panel
        }
        key={"flow"}
      >
        <ChartGrid opacity={0.62} />
        <p className={outputPanelsStyles.panelHead}>
          {"AI-driven occupation switching"}
        </p>
        <WorkerFlows
          flows={flows}
          height={flowHeight ?? (x ? 320 : undefined)}
        />
        <div className={outputPanelsStyles.panelFoot}>
          <ChartKey items={["exposed", "other", "displaced"]} />
          <p className={outputPanelsStyles.flowNote}>
            {"As we progress from 2026 to "}
            {flows.year}
            {
              ", the number of jobs available in occupations AI affects (knowledge work) decreases, while the jobs available in occupations AI doesn’t affect increase."
            }
          </p>
        </div>
      </div>
    );
  return (
    <div
      className={
        panels?.length === 1
          ? outputPanelsStyles.single
          : "grid" === layout
            ? outputPanelsStyles.grid
            : "mini" === layout
              ? outputPanelsStyles.mini
              : outputPanelsStyles.column
      }
    >
      {
        ((n = {
          economy: p,
          share: f,
          unemployment: g,
          flow: _,
        }),
        (
          panels ??
          (m
            ? ["share", "unemployment", "flow"]
            : ["economy", "share", "unemployment", "flow"])
        ).map((e) => n[e]))
      }
    </div>
  );
}
export { oK, CentsLabel, LaborShareChart };
