import * as React from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  hide,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import "./concept-hint.css";
import { splitConceptTerms } from "./concepts.mjs";
import { splitNoteCode } from "./note-code.mjs";

const VIEWPORT_PADDING = 12;
const HINT_GAP = 8;
const HOVER_DELAY = { open: 150, close: 150 };
const KEEP_HOVER = safePolygon({ buffer: 1 });

const HintSuppression = React.createContext(false);

function DefinitionContent({ text }) {
  return splitNoteCode(text).map((part, index) => part.code
    ? <InlineCode key={index}>{part.text}</InlineCode>
    : <React.Fragment key={index}>{part.text}</React.Fragment>);
}

function ConceptText({ children }) {
  const suppressed = React.useContext(HintSuppression);
  if (suppressed) return <>{children}</>;
  if (Array.isArray(children)) return children.map((child, index) => <ConceptText key={index}>{child}</ConceptText>);
  if (React.isValidElement(children) && children.type === React.Fragment) {
    return <ConceptText>{children.props.children}</ConceptText>;
  }
  if (typeof children !== "string") return <>{children}</>;
  return splitConceptTerms(children).map((part, index) => part.content
    ? <ConceptHint key={index} content={<DefinitionContent text={part.content} />}>{part.text}</ConceptHint>
    : <React.Fragment key={index}>{part.text}</React.Fragment>);
}

function InlineCode({ children, className = "" }) {
  return <code className={`lab-inline-code ${className}`.trim()}><ConceptText>{children}</ConceptText></code>;
}

function CodeBlock({ children, className = "" }) {
  return <pre className={`lab-code-block ${className}`.trim()}><code>{children}</code></pre>;
}

function useHintPosition(placement) {
  const [open, setOpen] = React.useState(false);
  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(HINT_GAP),
      flip({ padding: VIEWPORT_PADDING }),
      shift({ padding: VIEWPORT_PADDING }),
      size({
        padding: VIEWPORT_PADDING,
        apply({ availableHeight, elements }) {
          elements.floating.style.setProperty("--hint-available-height", `${Math.max(0, availableHeight)}px`);
        },
      }),
      hide(),
    ],
  });
  return { open, ...floating };
}

function HintBubble({ children, content, placement, className, ariaLabel }) {
  const { open, refs, floatingStyles, context, middlewareData } = useHintPosition(placement);
  const hover = useHover(context, {
    mouseOnly: true,
    move: false,
    delay: HOVER_DELAY,
    handleClose: KEEP_HOVER,
  });
  const focus = useFocus(context, { visibleOnly: true });
  // 鼠标以悬停为主；触屏和键盘可以点击切换。
  const click = useClick(context, { ignoreMouse: true });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role]);
  const referenceHidden = middlewareData.hide?.referenceHidden;
  // Portal 不继承正文主题，显式沿用触发元素所在的 data-theme。
  const theme = refs.domReference.current?.closest("[data-theme]")?.getAttribute("data-theme") ?? "ivory";

  return (
    <>
      <button ref={refs.setReference} type="button"
        className={`lab-concept-trigger ${className}`.trim()}
        aria-label={ariaLabel}
        {...getReferenceProps()}
      >
        {children}
      </button>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} className="lab-concept-hint" data-theme={theme}
            style={{ ...floatingStyles, visibility: referenceHidden ? "hidden" : undefined }}
            aria-hidden={referenceHidden || undefined}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

/* 未填写解释时不产生空弹层，也不增加无意义的键盘焦点。 */
function ConceptHint({ children, content, placement = "top", className = "", ariaLabel }) {
  if (content == null || content === false || (typeof content === "string" && !content.trim())) {
    return <>{children}</>;
  }
  // 手工说明优先，说明内部不再生成可点击术语，避免按钮嵌套。
  return <HintSuppression.Provider value={true}>
    <HintBubble {...{ children, content, placement, className, ariaLabel }} />
  </HintSuppression.Provider>;
}

export { ConceptHint, ConceptText, InlineCode, CodeBlock };
