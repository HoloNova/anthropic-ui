import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet } from "../ui/Snippet.jsx";
import { SOURCES } from "../sources.js";
import { WashFill, WeatherBreakdown, TaskSquares } from "../demos/wash.jsx";

const meta = {
  id: "wash",
  no: "4",
  title: "水彩铺色",
  lede: "把笔触铺成色块，再加入干燥的痕迹。",
};

function Part4Wash() {
  return (
    <Part {...meta}>
      <Card
        id="wash-fill"
        index="D1"
        title={<>铺色 <InlineCode>a_</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "drawing-tasks.jsx"]}
        summary="用略有重叠的笔触铺满一块区域。"
        demo={<WashFill />}
        notes={{
          "keys": [
            "根据区域大小和笔宽安排笔数，相邻笔触轻微重叠，减少缝隙。",
            "endScatter 让起止位置略有参差；direction 决定横向还是纵向铺色。",
            "passes 是底色笔触，weather 是后来叠加的条痕、斑驳和边缘色。"
          ]
        }}
        footer={
          <Snippet
            title="a_ 的参数推导部分"
            path="src/recovered/drawing-tasks.jsx"
            start={39}
            end={101}
            source={SOURCES.drawingTasks}
            defaultOpen
            highlight={[58, 59, 60, 63, 64, 65, 66, 67, 74, 75, 76, 77, 78, 79, 80, 81, 82]}
            note="高亮处就是那几个关键公式：笔宽推导、方向对调、passCount，以及每条 pass 的位置与三处抖动。"
          />
        }
      />

      <Card
        id="weather"
        index="D2"
        title={<>干燥痕迹的三个层次</>}
        tags={["drawing-tasks.jsx"]}
        summary="在相同底色上，分别观察条痕、斑驳和边缘积色。"
        demo={<WeatherBreakdown />}
        notes={{
          "keys": [
            "pressure 加深浅交替的条痕，mottle 打散过于均匀的底色，rim 加深边缘。",
            "四列使用相同的底色笔触，只改变后面叠加的痕迹。"
          ]
        }}
        footer={
          <Snippet
            title="pressure / mottle / rim 三段"
            path="src/recovered/drawing-tasks.jsx"
            start={102}
            end={200}
            source={SOURCES.drawingTasks}
            defaultOpen
            highlight={[103, 104, 105, 106, 107, 108, 109, 110, 111, 117, 118, 119, 120]}
            note="高亮处是 pressure 的生成：随机位置、随机宽度、深浅二选一、外层宽内层窄。"
          />
        }
      />

      <Card
        id="task-squares"
        index="D3"
        title="任务方格"
        tags={["drawing-tasks.jsx"]}
        summary="给每个方格固定的颜色和笔触，再排列成任务图。"
        demo={<TaskSquares />}
        notes={{
          "keys": [
            "seed 决定方格的随机样式和颜色类别，重绘时不重新抽取。",
            "先画底色，再按需要覆盖一部分颜色，最后叠加表面痕迹。"
          ]
        }}
        footer={
          <Snippet
            title="am / ag / ax / makeTaskSquare / aw / av / ak"
            path="src/recovered/drawing-tasks.jsx"
            start={6}
            end={38}
            source={SOURCES.drawingTasks}
            defaultOpen
          />
        }
      />
    </Part>
  );
}

export { Part4Wash, meta as part4Meta };
