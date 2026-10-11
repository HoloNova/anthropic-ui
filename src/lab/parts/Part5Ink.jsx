import * as React from "react";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet } from "../ui/Snippet.jsx";
import { SOURCES } from "../sources.js";
import { ScenarioPalettes, SemanticInks, ChartTheme, TypographyScale } from "../demos/ink.jsx";

const meta = {
  id: "ink",
  no: "5",
  title: "墨与色",
  lede: "原页的配色、字体与字号。",
};

function Part5Ink() {
  return (
    <Part {...meta}>
      <Card
        id="palettes"
        index="E1"
        title="三档情景色板"
        tags={[{ label: "palette.jsx", tone: "api" }]}
        summary="三组配色，每组四档；拖动 t 查看深浅变化。"
        demo={<ScenarioPalettes />}
        notes={{
          "keys": [
            "蓝、绿、粉分别对应原页的三种情景，每组由深到浅排列。",
            "pickPaletteShade 在 t 达到 0.42、0.72、0.92 时切换到下一档，不是连续渐变。"
          ]
        }}
        footer={
          <Snippet
            title="palette.jsx 全文"
            path="src/recovered/palette.jsx"
            source={SOURCES.palette}
            defaultOpen
          />
        }
      />

      <Card
        id="semantic-inks"
        index="E2"
        title="语义墨水色"
        tags={["palette.jsx"]}
        summary="颜色不仅装饰画面，也区分任务的不同含义。"
        demo={<SemanticInks />}
        notes={{
          "keys": [
            "同一含义在图表、图例和正文中沿用同一种颜色。",
            "修改语义颜色时，同步相关色值和 CSS 变量，避免同一个含义出现不同颜色。"
          ]
        }}
        footer={
          <Snippet
            title="语义色常量"
            path="src/recovered/palette.jsx"
            start={13}
            end={24}
            source={SOURCES.palette}
          />
        }
      />

      <Card
        id="chart-theme"
        index="E3"
        title="CHART_THEME 与中性色阶"
        tags={["palette.jsx", "foundation-2.css"]}
        summary="用纸色、格线色和墨色建立画面的轻重层次。"
        demo={<ChartTheme />}
        notes={{
          "keys": [
            "paper 是纸底，rule 是格线，text 是文字；baseline 使用品牌色作为参照。",
            "背景以浅纸色为主，文字与辅助线使用不同深浅的墨色。"
          ],
          "dont": [
            "给整个容器设置 opacity 会同时淡化笔触和文字；只想换纸色时，应修改背景颜色。"
          ]
        }}
        footer={
          <>
            <Snippet
              title="CHART_THEME"
              path="src/recovered/palette.jsx"
              start={18}
              end={24}
              source={SOURCES.palette}
              defaultOpen
            />
            <Snippet
              title="21 级中性色阶"
              path="src/styles/foundation-2.css"
              start={180}
              end={223}
              source={SOURCES.foundation2}
            />
          </>
        }
      />

      <Card
        id="typography"
        index="E4"
        title="字体与字号 scale"
        tags={["foundation-1.css", "foundation-2.css"]}
        summary="对比正文、说明和代码各自使用的字体与字号。"
        demo={<TypographyScale />}
        notes={{
          "keys": [
            "Serif 用于文章文字，Sans 用于说明与控件，Mono 用于代码与数字。",
            "字体缺失的字形由系统字体补齐，例如中文和部分块元素。",
            "Fallback 在字体未加载时提供替代显示，度量调整用于减少布局变化。"
          ],
          "dont": [
            "更换字体后，重新检查字距、换行和文字占据的空间。"
          ]
        }}
        footer={
          <>
            <Snippet
              title="三族 @font-face 与 fallback 度量覆盖"
              path="src/styles/foundation-1.css"
              start={2}
              end={67}
              source={SOURCES.foundation1}
              defaultOpen
              highlight={[16, 17, 18, 19, 20, 21, 22]}
              note="高亮的是 sans 的 fallback 定义：三行覆写决定了加载前后行高是否一致。"
            />
            <Snippet
              title="字号与间距变量"
              path="src/styles/foundation-2.css"
              start={224}
              end={330}
              source={SOURCES.foundation2}
            />
          </>
        }
      />
    </Part>
  );
}

export { Part5Ink, meta as part5Meta };
