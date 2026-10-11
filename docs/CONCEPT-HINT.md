# 术语补充说明与代码样式

组件：`src/lab/ui/ConceptHint.jsx`。导出 `ConceptHint`、`ConceptText`、`InlineCode`、`CodeBlock`，样式随导入自动加载。

术语说明只使用已审定内容，不自动编写新解释。`concepts.mjs` 收录 seed、tD、插值、smoothstep、重采样、法线、RGB 通道、amount、值噪声、阈值、遮罩、clipPath 十二项。卡片标题、说明、要点和参数提示中的匹配词由 ConceptText / InlineCode 接入；控件普通标签保持原有格式和交互，源码 CodeBlock 不做术语匹配。

A1 的 frac 与 A4 的公式继续使用用户给定的手工说明。手工说明优先，触发元素及弹层内部停止自动匹配，避免嵌套按钮和层层弹窗。要点纯字符串仍由 note-code.mjs 标记代码，原文字逐字保留；本轮正文改写另经用户审核批准。

## 接入

在 `src/lab/parts/` 或 `src/lab/demos/` 的组件中：

```jsx
import * as React from "react";
import { ConceptHint, InlineCode, CodeBlock } from "../ui/ConceptHint.jsx";

function Reference({ formula, details, source }) {
  return (
    <>
      <InlineCode>{formula}</InlineCode>
      <ConceptHint content={details}>
        <InlineCode>frac</InlineCode>
      </ConceptHint>
      <CodeBlock>{source}</CodeBlock>
    </>
  );
}
```

`formula`、`details`、`source` 由调用方传入。普通术语不需要代码样式时，直接把文字作为 `ConceptHint` 的 children。

## API

| 组件 | 参数 | 用途 |
|---|---|---|
| ConceptText | children | 在字符串和 Fragment 中匹配审定术语，保留其他文字；不要用于链接或按钮内部 |
| ConceptHint | children | 触发文字，或由 InlineCode 包裹的术语；不要嵌套按钮、链接等交互元素 |
| ConceptHint | content | 补充说明的 ReactNode，可包含普通文字、段落、列表、InlineCode、CodeBlock；不放表单或其他交互控件 |
| ConceptHint | placement | 默认 `top`，支持 Floating UI 的 top/bottom/left/right 及 -start/-end；空间不足时自动换边 |
| ConceptHint | className | 可选的触发元素样式类 |
| ConceptHint | ariaLabel | 可选的触发元素无障碍名称；默认使用 children 的文字 |
| InlineCode | children / className | 行内代码及可选样式类 |
| CodeBlock | children / className | 保留换行的代码及可选样式类 |

说明为空、null、undefined 或 false 时只显示原内容，不产生空弹层或额外焦点。

## 交互与样式

- 鼠标悬停 150ms 或键盘聚焦显示，鼠标可以移入说明框阅读、选中复制。
- Esc 或点击外部关闭。触屏点击切换，键盘可用 Tab 聚焦与 Enter/Space 操作。
- 弹层通过 Portal 避免被卡片裁切；使用固定定位、自动换边和边缘避让。只定位说明框，不悬浮演示画布。
- 长说明限高并可滚动；触发文字完全离开可见区域时隐藏弹层。
- 使用现有 Anthropic 字体及触发元素所在主题；没有额外字体、动画或 Markdown 解析器。
- 行内代码按 claude.dev 的 `/mnt/memory/` 参考样式：`.875em` 等宽字、5% 墨色底、1px 细边框、`.0625em .25em` 内边距。不改变未使用显式类名的现有 code。
- 内容由 React 渲染，不使用 HTML 字符串注入，也不把普通字符串自动解析成 Markdown。代码样式和术语说明可以单独使用。

## 手动验收 Todo

当前可以在 A1 展开「原理与注意事项」，悬停公式中的 frac 验收；以后接入其他术语时沿用以下清单：

- [ ] 普通文字与行内代码保持原有行流；hover 不撑开正文。
- [ ] 鼠标从触发文字移到说明框不关闭，内容可以选中、复制。
- [ ] Tab 聚焦显示，Esc 关闭；触屏点击切换，点击外部关闭。
- [ ] 靠近屏幕四边时不裁切；长说明和长代码可以滚动阅读。
- [ ] 内容为空时没有按钮焦点和空框。
- [ ] 页面滚动、窗口缩放时定位更新；组件不会让演示画布吸顶或回到侧栏。
- [ ] 图鉴正文文案、侧栏、演示和已存在的源码块保持不变。

不运行浏览器或 UI 单元测试。编译检查只能验证语法与依赖，不能替代以上交互验收。
