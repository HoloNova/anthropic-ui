import * as React from "react";
import { InlineCode } from "./ui/ConceptHint.jsx";
import { MarkerFilters } from "../recovered/SectionLaborShare.jsx";
import { NAV } from "./nav.js";
import { OFFICIAL_URL } from "./nav.js";
import { Rail, useReadingState } from "./ui/Rail.jsx";
import { MobileContents } from "./ui/MobileContents.jsx";
import { Part0Overview } from "./parts/Part0Overview.jsx";
import { Part1Atoms } from "./parts/Part1Atoms.jsx";
import { Part2Strokes } from "./parts/Part2Strokes.jsx";
import { Part3Materials } from "./parts/Part3Materials.jsx";
import { Part4Wash } from "./parts/Part4Wash.jsx";
import { Part5Ink } from "./parts/Part5Ink.jsx";
import { Part6Molecules } from "./parts/Part6Molecules.jsx";
import { Part7Assembly, Part8Sources } from "./parts/Part7Assembly.jsx";

function Lab() {
  let state = useReadingState(NAV);

  return (
    <div className="lab" data-theme="ivory">
      {/* 页面里真实注册的滤镜：mk-rule / mk-marker / mk-dry 及移动端 lite 版 */}
      <MarkerFilters />
      <div
        className="lab-prog"
        style={{ "--p": state.progress }}
        aria-hidden="true"
      />

      <MobileContents nav={NAV} state={state} />

      <header className="lab-top">
        <h1 className="lab-top__title">手绘水彩渲染引擎拆解</h1>
        <p className="lab-top__sub">
          <a
            className="lab-top__origin"
            href={OFFICIAL_URL}
            target="_blank"
            rel="noreferrer"
            title="Anthropic 官网上的原始页面"
          >
            Anthropic Econ Scenarios
          </a>
          <span className="lab-top__sep"> · </span>
          从一根笔触到整页装配
        </p>
        <span className="lab-top__spacer" />
        <a className="lab-top__link" href={`${import.meta.env.BASE_URL}origin/`}>
          Original Page
        </a>
      </header>

      <div className="lab-body">
        <Rail nav={NAV} state={state} />
        <main className="lab-main">
          <Part0Overview />
          <Part1Atoms />
          <Part2Strokes />
          <Part3Materials />
          <Part4Wash />
          <Part5Ink />
          <Part6Molecules />
          <Part7Assembly />
          <Part8Sources />

          <footer className="lab-foot">
            demo 全部调用 <InlineCode>src/recovered/</InlineCode> 的真实函数，源码折叠块由 Vite 的{" "}
            <InlineCode>?raw</InlineCode> 在构建时读入，不会与工程不一致。
          </footer>
        </main>
      </div>
    </div>
  );
}

export { Lab };
