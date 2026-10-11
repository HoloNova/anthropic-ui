import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet } from "../ui/Snippet.jsx";
import { SOURCES } from "../sources.js";
import {
  HandDrawnAnatomy,
  SeedFamily,
  MarkerLayers,
  DryBrush,
  FilterBench,
  BlendStack,
} from "../demos/strokes.jsx";

const meta = {
  id: "strokes",
  no: "2",
  title: "笔触：一条线是怎么变成面的",
  lede: "从连续笔画到断续笔触，再加上纸纹与叠色。",
};

function Part2Strokes() {
  return (
    <Part {...meta}>
      <Card
        id="hand-drawn-line"
        index="B1"
        title={<>手绘路径 <InlineCode>makeHandDrawnLine</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "drawing-noise.jsx"]}
        summary="把细线骨架扩成有粗细变化、带毛边的笔画。"
        demo={<HandDrawnAnatomy />}
        notes={{
          "keys": [
            "沿骨架计算两侧边缘，再围成一个填充面；不是给细线直接加粗。",
            "width 是基准宽度，belly 让中段鼓起，wobble 控制沿途的粗细起伏。",
            "edge 让两侧边缘各自变化；taperIn/taperOut 控制两端收窄的范围，startWidth/endWidth 控制端点保留的宽度。"
          ],
          "dont": [
            "起笔、收笔的收窄区过长时，中间也可能变细。"
          ]
        }}
        footer={
          <Snippet
            title="makeHandDrawnLine 全文"
            path="src/recovered/drawing-noise.jsx"
            start={99}
            end={145}
            source={SOURCES.drawingNoise}
            defaultOpen
            highlight={[110, 111, 112, 113, 114, 127, 128, 129, 130, 131, 132]}
            note="高亮的两段是核心：上面一行取默认参数，下面一行算每个点的半宽 p —— 锥度、鼓腹、抖动都乘在这一个量上。"
          />
        }
      />

      <Card
        id="seed-family"
        index="B2"
        title="种子家族"
        tags={["观感检查"]}
        summary="保持参数不变，换种子看看同一支笔能画出哪些变化。"
        demo={<SeedFamily />}
        notes={{
          "keys": [
            "参数决定变化幅度，seed 决定这一次具体长什么样。",
            "换回原来的种子，就能恢复同一种笔画。"
          ]
        }}
      />

      <Card
        id="marker-layers"
        index="B3"
        title={<>马克笔三层 <InlineCode>makeMarkerPath</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "drawing-strokes.jsx"]}
        summary="在主体笔画上，按需加深色笔芯或纸色漏白。"
        demo={<MarkerLayers />}
        notes={{
          "keys": [
            "主体是填充笔画；core 额外叠两条较窄的深色笔触，streaks 额外叠三道纸色条带。",
            "只有开启对应开关、且笔宽足够时才添加：core 至少 3.5，streaks 至少 14。"
          ],
          "dont": [
            "漏白使用 paper 指定的纸色；换背景时也要更新它。"
          ]
        }}
        footer={
          <Snippet
            title="makeMarkerPath 全文"
            path="src/recovered/drawing-strokes.jsx"
            start={22}
            end={106}
            source={SOURCES.drawingStrokes}
            defaultOpen
            highlight={[47, 48, 49, 50, 82, 83, 84, 85, 86, 87, 88]}
            note="两个高亮的 if 就是那两个阈值：width ≥ 3.5 加笔芯，width ≥ 14 加漏白。"
          />
        }
      />

      <Card
        id="dry-brush"
        index="B4"
        title={<>干笔分段 <InlineCode>at</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "drawing-strokes.jsx"]}
        summary="把连续笔画拆成小段，每段略有不同，形成干笔效果。"
        demo={<DryBrush />}
        notes={{
          "keys": [
            "dashLength 控制每段长度，gap 控制段间空隙。",
            "各段的长度、粗细、角度和深浅略有不同；neat 会收紧这些变化，让排列更规整。",
            "landOnEnd 会在必要时补一小段，让线条更接近原定终点。"
          ],
          "dont": [
            "段长过小会生成更多 SVG 路径，使用时留意段数。"
          ]
        }}
        footer={
          <Snippet
            title="at（干笔分段）全文"
            path="src/recovered/drawing-strokes.jsx"
            start={119}
            end={205}
            source={SOURCES.drawingStrokes}
            defaultOpen
            highlight={[139, 140, 141, 142, 143, 144, 156, 176]}
            note="高亮处依次是：段起点、段中央、段终点（都带旋转）—— 以及 neat 开关控制的两组随机幅度、35%/12% 的重墨概率。"
          />
        }
      />

      <Card
        id="filters"
        index="B5"
        title="噪点滤镜配方台"
        tags={[{ label: "核心", tone: "core" }, "SectionLaborShare.jsx"]}
        summary="给笔画加入颗粒和轻微变形，避免边缘太规整。"
        demo={<FilterBench />}
        notes={{
          "keys": [
            "先用噪点遮罩让部分位置更透明，再轻微移动轮廓。",
            "mk-rule 变化较轻，适合格线；mk-marker 适合普通笔触；mk-dry 的颗粒感更强。",
            "前四列是固定对照，参数只影响最右边的自定义滤镜。"
          ],
          "dont": [
            "滤镜区域需要给边缘变形留出空间，否则可能被裁切。"
          ]
        }}
        footer={
          <Snippet
            title="MarkerFilters 里的三档定义"
            path="src/recovered/SectionLaborShare.jsx"
            start={174}
            end={202}
            source={SOURCES.sectionLaborShare}
            defaultOpen
            highlight={[190, 192]}
            note="高亮的两行分别是 mk-marker 与 mk-dry 的完整串联。注意二者除了频率和 k3，位移 scale 也不同。"
          />
        }
      />

      <Card
        id="blend"
        index="B6"
        title={<>叠加与 <InlineCode>mix-blend-mode: multiply</InlineCode></>}
        tags={["drawing-strokes.jsx t8()"]}
        summary="让重叠处颜色变深，像两笔颜料叠在一起。"
        demo={<BlendStack />}
        notes={{
          "keys": [
            "multiply 改变颜色的混合方式，不改变笔触形状。",
            "isolation: isolate 把混合限制在当前组合中，避免影响外面的背景。"
          ],
          "dont": [
            "纸色也参与叠色；换背景后重新检查重叠效果。"
          ]
        }}
        footer={
          <Snippet
            title="t8 与两个包装"
            path="src/recovered/drawing-strokes.jsx"
            start={107}
            end={118}
            source={SOURCES.drawingStrokes}
            defaultOpen
          />
        }
      />
    </Part>
  );
}

export { Part2Strokes, meta as part2Meta };
