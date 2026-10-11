import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet } from "../ui/Snippet.jsx";
import { SOURCES } from "../sources.js";
import { PaperGrid, GridHoles, InkBlob, WashBlob } from "../demos/materials.jsx";

const meta = {
  id: "materials",
  no: "3",
  title: "纸与材质",
  lede: "观察纸面、网格和颜料的边缘。",
};

function Part3Materials() {
  return (
    <Part {...meta}>
      <Card
        id="paper-grid"
        index="C1"
        title="纸张方格"
        tags={[{ label: "核心", tone: "core" }, "drawing-grid.jsx"]}
        summary="调格距、端点长短和加粗间隔，做出手绘方格纸。"
        demo={<PaperGrid />}
        notes={{
          "keys": [
            "ar 记录格线位置，an 把这些线段画成笔触。",
            "rag 让格线两端的长短不齐，不改变参考线的水平或垂直方向。",
            "heavyEvery 让水平格线每隔几条加粗一次，形成节奏。"
          ],
          "dont": [
            "格距较小时，适当减小线宽和端点错落，避免拥挤。"
          ]
        }}
        footer={
          <Snippet
            title="ar 与 an"
            path="src/recovered/drawing-grid.jsx"
            start={198}
            end={261}
            source={SOURCES.drawingGrid}
            defaultOpen
            highlight={[202, 213, 245]}
          />
        }
      />

      <Card
        id="grid-holes"
        index="C2"
        title="网格挖洞"
        tags={[{ label: "核心", tone: "core" }, "drawing-grid.jsx"]}
        summary="拖动方块，让网格绕开内容，并留下不齐整的断口。"
        demo={<GridHoles />}
        notes={{
          "keys": [
            "先把方块边界对齐格线，再算出每条线需要避开的范围。",
            "visible 保留外面的线段，patch 提供补线；较短的碎段会被丢弃。",
            "断口两端略有错落，不像整齐切断的电脑线。"
          ]
        }}
        footer={
          <Snippet
            title="ad / ac / au / ah"
            path="src/recovered/drawing-grid.jsx"
            start={262}
            end={349}
            source={SOURCES.drawingGrid}
            defaultOpen
            highlight={[281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294]}
            note="高亮的是区间合并：把线段穿过障碍的那几段收拢成不重叠的区间集合。"
          />
        }
      />

      <Card
        id="ink-blob"
        index="C3"
        title={<>墨块 <InlineCode>ao</InlineCode></>}
        tags={["drawing-grid.jsx"]}
        summary="用多道笔触叠成色带，再加渐变、条痕和边缘积色。"
        demo={<InkBlob />}
        notes={{
          "keys": [
            "多道笔触轻微重叠，铺在上下边界之间。",
            "两端颜色不同时，沿色带生成渐变。",
            "pressure 加深浅条痕，rim 加边缘色，dashedEdges 改用断续的边缘描线。"
          ],
          "dont": [
            "samples 太少时，边界可能出现明显折角。"
          ]
        }}
        footer={
          <Snippet
            title="as / al / ao"
            path="src/recovered/drawing-grid.jsx"
            start={7}
            end={197}
            source={SOURCES.drawingGrid}
            defaultOpen
            highlight={[72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85]}
            note="高亮处：笔数、每条笔触在厚度里的相对位置、以及相邻笔触的错落。"
          />
        }
      />

      <Card
        id="wash-blob"
        index="C4"
        title={<>值噪声斑块 <InlineCode>aL</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "drawing-tasks.jsx"]}
        summary="决定哪些位置有颜料，生成不规则的斑块。"
        demo={<WashBlob />}
        notes={{
          "keys": [
            "aL 只返回这个位置是否上色，不直接返回颜色或透明度。",
            "把值噪声与从中心到边缘变化的阈值比较，决定哪些位置保留颜料。",
            "scale 提高阈值，让更多位置上色；gain 改变噪声数值的差异，而不是直接调透明度。"
          ],
          "dont": [
            "相同位置和参数会得到相同结果；改变尺寸或参数后，形状也会改变。"
          ]
        }}
        footer={
          <Snippet
            title="aM / aj / aS / aN / aA / aT / aL"
            path="src/recovered/drawing-tasks.jsx"
            start={244}
            end={282}
            source={SOURCES.drawingTasks}
            defaultOpen
            highlight={[269, 270, 271, 272, 273, 274, 275, 276, 277, 278]}
            note="aL 只有十几行：钳位半径 → 插值阈值 → 取两层噪声 → 比较。"
          />
        }
      />
    </Part>
  );
}

export { Part3Materials, meta as part3Meta };
