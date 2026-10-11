import * as React from "react";
import { InlineCode } from "../ui/ConceptHint.jsx";
import { Part } from "../ui/Part.jsx";
import { Card } from "../ui/Card.jsx";
import { Snippet, CopyButton } from "../ui/Snippet.jsx";
import { SOURCES, SOURCE_INDEX } from "../sources.js";
import { Assembly, BuildYourOwn } from "../demos/assembly.jsx";

const meta = {
  id: "assembly",
  no: "7",
  title: "装配：逐层组成画面",
  lede: "逐层查看网格、笔触、滤镜与文字的作用。",
};

function Part7Assembly() {
  return (
    <Part {...meta}>
      <Card
        id="layers"
        index="G1"
        title="八层装配"
        tags={[{ label: "组合", tone: "core" }]}
        summary="逐层加入网格、笔触、滤镜和文字，组成示意画面。"
        demo={<Assembly />}
        notes={{
          "keys": [
            "这里展示一组简化的组合，不是完整原页，也不是浏览器的执行步骤。",
            "分段改变笔触形状，滤镜改变颗粒和边缘，multiply 改变重叠处的颜色。",
            "文字单独叠在上面，不参与笔触的混合效果。"
          ]
        }}
      />

      <Card
        id="own"
        index="G2"
        title="笔触的生成过程"
        tags={[{ label: "原理示例", tone: "api" }]}
        summary="用输入点和参数生成笔触，查看对应的工作原理。"
        demo={<BuildYourOwn />}
        notes={{
          "keys": [
            "输入点描述骨架，参数控制粗细、收笔和随机变化。",
            "makeMarkerStroke 返回 SVG 片段，at 返回一组分段片段，最终放进 svg 容器中显示。"
          ],
          "dont": [
            "示例只说明绘制过程；容器、CSS 和滤镜定义需要另外配合。"
          ]
        }}
      />

      <Card
        id="performance"
        index="G3"
        title="性能账"
        tags={["工程细节"]}
        summary="看原页如何复用图形、合并更新和分批绘制。"
        demo={
          <div className="lab-notes">
            <div className="lab-notes__col">
              <h4>复用结果</h4>
              <ul>
                <li>预先生成一组任务方块，再用 <InlineCode>&lt;use&gt;</InlineCode> 重复引用，避免每格都重新生成。</li>
                <li><InlineCode>tD</InlineCode> 从噪声表取值，避免重复计算正弦。</li>
              </ul>
            </div>
            <div className="lab-notes__col">
              <h4>减少更新</h4>
              <ul>
                <li>把同一帧的多次尺寸通知合并处理，减少重复测量。</li>
                <li>曲线分批加入画面，避免在同一帧生成全部笔触。</li>
              </ul>
            </div>
          </div>
        }
        footer={
          <Snippet
            title="tile 生成与池化"
            path="src/recovered/TaskBundleStage.jsx"
            start={192}
            end={233}
            source={SOURCES.taskBundleStage}
            highlight={[193, 195, 200, 201, 202, 203, 204, 205, 206, 207]}
            note="高亮处：viewBox 边长 = 1.4 倍格子、以及 24 个 tile 的 id 生成规则。"
          />
        }
      />
    </Part>
  );
}

const indexCardStyle = {
  border: "1px solid var(--border-subtle)",
  borderRadius: 3,
  background: "var(--background-secondary)",
};

function Part8Sources() {
  let [filter, setFilter] = React.useState("");
  let shown = SOURCE_INDEX.filter(
    (file) => !filter || file.path.includes(filter) || file.role.includes(filter),
  );

  let dump = React.useMemo(
    () =>
      SOURCE_INDEX.map(
        (file) => `/* ===== ${file.path} ===== */\n${SOURCES[file.key]}`,
      ).join("\n\n"),
    [],
  );

  return (
    <Part
      id="sources"
      no="8"
      title="源码索引"
      lede="工程里的真实文件，可单独复制或整体带走。"
    >
      <div className="lab-files">
        <div className="lab-file">
          <div className="lab-file__head">
            <span className="lab-file__path">全部 {SOURCE_INDEX.length} 个文件</span>
            <span className="lab-file__role">
              合计 {SOURCE_INDEX.reduce((sum, file) => sum + SOURCES[file.key].split("\n").length, 0).toLocaleString()} 行
            </span>
            <CopyButton text={dump} label="复制全部源码" />
          </div>
        </div>

        {shown.map((file) => (
          <div style={indexCardStyle} key={file.key}>
            <div className="lab-file__head">
              <span className="lab-file__path">{file.path}</span>
              <span className="lab-file__role">{file.role}</span>
              <span className="lab-file__stat">
                {SOURCES[file.key].split("\n").length} 行
              </span>
            </div>
            <Snippet
              title="全文"
              path={file.path}
              source={SOURCES[file.key]}
            />
          </div>
        ))}
      </div>
    </Part>
  );
}

export { Part7Assembly, Part8Sources, meta as part7Meta };
