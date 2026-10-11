import * as React from "react";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet } from "../ui/Snippet.jsx";
import { ConceptHint, InlineCode } from "../ui/ConceptHint.jsx";
import { SOURCES } from "../sources.js";
import {
  NoiseDeterminism,
  SeededSequence,
  PathGeometry,
  InkDarkening,
} from "../demos/atoms.jsx";

const meta = {
  id: "atoms",
  no: "1",
  title: "基座：噪声与路径几何",
  lede: "先看随机如何固定，再看线条如何成形。",
};

function Part1Atoms() {
  return (
    <Part {...meta}>
      <Card
        id="hash-noise"
        index="A1"
        title={<>确定性哈希 <InlineCode>hashNoise</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "drawing-noise.jsx"]}
        summary="给每个点一个固定偏移，重新绘制时，线条不会换样子。"
        demo={<NoiseDeterminism />}
        notes={{
          keys: [
            { text: <>
              <InlineCode>
                {"hashNoise(x): "}
                <ConceptHint content={<><strong><InlineCode>frac(x) = x - ⌊x⌋</InlineCode></strong>，取浮点数的小数部分</>}>
                  frac
                </ConceptHint>
                {"(sin(127.1 * x + 311.7) * 43758.5453)"}
              </InlineCode>
              ，得到 <InlineCode>[0, 1)</InlineCode> 的数，同一编号总得到同一数值
            </> },
            { text: <>
              <InlineCode>tD</InlineCode> 从预先算好的噪声表中取值，省去重复计算正弦。它不调用 <InlineCode>Math.random()</InlineCode>，也不等于直接计算 <InlineCode>hashNoise(x)</InlineCode>。
            </> }
          ]
        }}
        footer={
          <Snippet
            title="hashNoise 与查表版 tD"
            path="src/recovered/drawing-noise.jsx"
            start={3}
            end={15}
            source={SOURCES.drawingNoise}
            defaultOpen
          />
        }
      />

      <Card
        id="seeded"
        index="A2"
        title={<>种子随机与平滑插值 <InlineCode>createSeededRandom</InlineCode></>}
        tags={[{ label: "核心", tone: "core" }, "question-specs-2.jsx"]}
        summary="把固定的随机数连成平滑起伏，用来控制笔画的粗细和边缘。"
        demo={<SeededSequence />}
        notes={{
          "keys": [
            "createSeededRandom(seed) 每次给出下一个数；相同种子、相同取值顺序，结果就一样。",
            "createSeededNormal 把这些数映射到 −1…1，再用插值补出中间的变化。",
            "smoothstep 让采样点之间的连接更缓；count 越大，起伏越密，而不是幅度越大。"
          ]
        }}
        footer={
          <Snippet
            title="两个生成器"
            path="src/recovered/question-specs-2.jsx"
            start={345}
            end={364}
            source={SOURCES.seeded}
            defaultOpen
          />
        }
      />

      <Card
        id="path-geometry"
        index="A3"
        title={<>路径几何 <InlineCode>tK / tX / tJ / tQ</InlineCode></>}
        tags={["drawing-noise.jsx"]}
        summary="沿着线条均匀安排采样点，为后面的粗细和边缘计算做准备。"
        demo={<PathGeometry />}
        notes={{
          "keys": [
            "tX 测量总长度，tK 沿原折线做重采样，让点的间距更均匀。",
            "tJ 计算各点沿线前进的方向；转 90° 后才是向两侧移动的法线方向。",
            "tQ 把点移向线条两侧，偏移距离由 fn(t) 决定；t 从起点的 0 变化到终点的 1。"
          ]
        }}
        footer={
          <Snippet
            title="tK / tX / tJ / tQ"
            path="src/recovered/drawing-noise.jsx"
            start={46}
            end={97}
            source={SOURCES.drawingNoise}
          />
        }
      />

      <Card
        id="ink-darkening"
        index="A4"
        title={<>墨色暗化 <InlineCode>tU</InlineCode></>}
        tags={["drawing-noise.jsx"]}
        summary="从基色生成配套的深色，用来画笔芯、深色条痕和积墨边缘。"
        demo={<InkDarkening />}
        notes={{
          "keys": [
            "颜色由红、绿、蓝三个 RGB 通道组成。tU 先突出较强的分量，再把三者一起压暗。",
            "amount 越大，结果越暗；调色不等于修改透明度。"
          ]
        }}
        footer={
          <Snippet
            title="tU"
            path="src/recovered/drawing-noise.jsx"
            start={18}
            end={45}
            source={SOURCES.drawingNoise}
          />
        }
      />
    </Part>
  );
}

export { Part1Atoms, meta as part1Meta };
