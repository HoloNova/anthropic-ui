import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet } from "../ui/Snippet.jsx";
import { SOURCES } from "../sources.js";
import {
  FanBloom,
  ShareBar,
  DropCapDemo,
  ScrollDrawDemo,
  StaggerDemo,
  LittleThings,
} from "../demos/molecules.jsx";

const meta = {
  id: "molecules",
  no: "6",
  title: "组合：零件怎么长成组件",
  lede: "把基础元素放回组件，看它们如何一起工作。",
};

function Part6Molecules() {
  return (
    <Part {...meta}>
      <Card
        id="fan"
        index="F1"
        title={<>扇形绽放 —— 首屏那 180 条曲线</>}
        tags={[{ label: "核心", tone: "core" }, "HeroChart.jsx"]}
        summary="让多条曲线从窄缝展开，尾部逐渐断续。"
        demo={<FanBloom />}
        notes={{
          "keys": [
            "曲线使用固定的随机数据，重播时保持同一种形状。",
            "尾部增加笔触间隙，形成断续效果，而不是只降低透明度。",
            "linePitch 越小，轨迹通常越多；达到条数上限后，不再继续增加。"
          ]
        }}
        footer={
          <>
            <Snippet
              title="曲线族与默认参数"
              path="src/recovered/HeroChart.jsx"
              start={34}
              end={91}
              source={SOURCES.heroChart}
              defaultOpen
              highlight={[35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]}
              note="高亮处：固定种子的 LCG、终点值的幂分布、曲率，以及每条线的三个哈希属性 d / j / family。"
            />
            <Snippet
              title="扇形布局"
              path="src/recovered/HeroChart.jsx"
              start={216}
              end={322}
              source={SOURCES.heroChart}
              highlight={[223, 224, 225, 226, 227, 228, 229, 230, 255, 256, 257, 258, 259, 262, 289, 290]}
              note="高亮处：张角与绽放跨度的推导、左右交替与车道位置、以及把尾部单独交给一组更松的干笔参数。"
            />
          </>
        }
      />

      <Card
        id="share-bar"
        index="F2"
        title={<>比例横条 <InlineCode>ShareStrokes</InlineCode></>}
        tags={[{ label: "实机组件", tone: "api" }, "ShareStrokes.jsx"]}
        summary="用色条长度表达份额，再加渐变和笔触质感。"
        demo={<ShareBar />}
        notes={{
          "keys": [
            "份额按容器宽度换算成长度，widthFraction 控制整体比例。",
            "颜色分界带一点固定偏移，表面再叠一层笔触，避免整齐平滑的电脑色条。"
          ]
        }}
        footer={
          <Snippet
            title="ShareStrokes 全文"
            path="src/recovered/ShareStrokes.jsx"
            start={8}
            end={150}
            source={SOURCES.shareStrokes}
            highlight={[50, 51, 52, 53, 54, 55, 56, 57]}
            note="高亮处：为每条笔触生成渐变，三个 stop 的位置就是三种颜色的分界。"
          />
        }
      />

      <Card
        id="dropcap"
        index="F3"
        title={<>首字下沉 <InlineCode>DropCap</InlineCode></>}
        tags={[{ label: "实机组件", tone: "api" }, "DropCap.jsx"]}
        summary="把水彩裁成字母，做成文章开头的大首字。"
        demo={<DropCapDemo />}
        notes={{
          "keys": [
            "先测量字形占据的范围，再用 clipPath 把水彩裁成这个字形。",
            "水彩比字形略大，保证裁切后边缘仍被填满。"
          ],
          "dont": [
            "等字体就绪后再测量，否则字形范围可能不准。"
          ]
        }}
        footer={
          <Snippet
            title="DropCap 全文"
            path="src/recovered/DropCap.jsx"
            start={14}
            end={91}
            source={SOURCES.dropCap}
            highlight={[25, 26, 27, 28, 61, 62, 63, 64, 65, 68]}
            note="高亮处：测量字形包围盒，以及用 <text> 作 clipPath。"
          />
        }
      />

      <Card
        id="scroll-draw"
        index="F4"
        title={<>尺寸变化与重绘 <InlineCode>useScrollDraw</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "scroll-hooks.jsx"]}
        summary="改变容器宽度，让笔触按新尺寸重新绘制。"
        demo={<ScrollDrawDemo />}
        notes={{
          "keys": [
            "ResizeObserver 发现尺寸变化；useScrollDraw 返回当前宽度，供笔触生成器使用。",
            "在视口附近启用测量，用 requestAnimationFrame 合并更新，减少重复处理。"
          ]
        }}
        footer={
          <Snippet
            title="scroll-hooks.jsx 全文"
            path="src/recovered/scroll-hooks.jsx"
            source={SOURCES.scrollHooks}
            defaultOpen
          />
        }
      />

      <Card
        id="stagger"
        index="F5"
        title="交错入场"
        tags={["TaskBundleStage.jsx"]}
        summary="错开各元素的出现时间，让入场不那么机械。"
        demo={<StaggerDemo />}
        notes={{
          "keys": [
            "hashNoise 根据元素编号决定延迟，同样的元素保持同样的入场顺序。",
            "延迟写进各元素的 CSS 变量，由 transition-delay 控制，不需要逐个切换状态。"
          ]
        }}
        footer={
          <Snippet
            title="TaskPasses 的交错"
            path="src/recovered/TaskBundleStage.jsx"
            start={269}
            end={309}
            source={SOURCES.taskBundleStage}
            defaultOpen
            highlight={[285, 286, 287, 288]}
            note="高亮处：两个 CSS 变量都是 hashNoise 算出来的，不是随机数。"
          />
        }
      />

      <Card
        id="little-things"
        index="F6"
        title="手绘方框与铅笔光标"
        tags={["DropCap.jsx", "CapabilityGrid.jsx"]}
        summary="给方框和鼠标光标加入手绘细节。"
        demo={<LittleThings />}
        notes={{
          "keys": [
            "方框各边用断续笔触绘制，保留轻微的粗细和位置变化。",
            "光标用内联 SVG 画成铅笔；热点决定哪个位置对应鼠标的点击点。"
          ]
        }}
        footer={
          <>
            <Snippet
              title="l6 手绘方框"
              path="src/recovered/DropCap.jsx"
              start={106}
              end={125}
              source={SOURCES.dropCap}
              defaultOpen
            />
            <Snippet
              title="r4 铅笔光标"
              path="src/recovered/CapabilityGrid.jsx"
              start={51}
              end={54}
              source={SOURCES.capGrid}
              defaultOpen
            />
          </>
        }
      />
    </Part>
  );
}

export { Part6Molecules, meta as part6Meta };
