import * as React from "react";
import { Part } from "../ui/Part.jsx";
import { OverviewScene } from "../ui/OverviewScene.jsx";

const meta = {
  id: "overview",
  no: "0",
  title: "从画面开始",
  lede: "按组件分析 Anthropic 页面风格",
};

function Part0Overview() {
  return (
    <Part {...meta}>
      <OverviewScene />
    </Part>
  );
}

export { Part0Overview, meta as part0Meta };
