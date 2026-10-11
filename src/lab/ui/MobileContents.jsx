import * as React from "react";
import { RailTree } from "./Rail.jsx";
import "./mobile-contents.css";

const NARROW_QUERY = "(max-width: 1080px)";

function useNarrowScreen() {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

function useMenuDismiss(open, button, panel, setOpen) {
  React.useEffect(() => {
    if (!open) return;
    const dismissOutside = (event) => {
      if (!button.current?.contains(event.target) && !panel.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      button.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, button, panel, setOpen]);
}

function MobileContents({ nav, state }) {
  const narrow = useNarrowScreen();
  const enabled = narrow && Boolean(state.part) && state.part !== "overview";
  const [open, setOpen] = React.useState(false);
  const button = React.useRef(null);
  const panel = React.useRef(null);
  const id = React.useId();
  const expanded = enabled && open;

  React.useEffect(() => {
    if (!enabled) setOpen(false);
  }, [enabled]);
  useMenuDismiss(expanded, button, panel, setOpen);

  const navigate = (event) => {
    // 保留锚点的默认导航，以及中键和新标签页行为。
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) setOpen(false);
  };

  return (
    <>
      <button className="lab-menu-toggle" ref={button} type="button" hidden={!enabled}
        onClick={() => setOpen((current) => !current)} data-open={expanded ? "true" : undefined}
        aria-label={expanded ? "关闭目录" : "打开目录"} aria-controls={id} aria-expanded={expanded}>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div className="lab-mobile-toc" id={id} ref={panel} role="region" aria-label="目录"
        hidden={!enabled} data-open={expanded ? "true" : undefined} aria-hidden={!expanded} inert={!expanded}>
        <div className="lab-mobile-toc__clip">
          <div className="lab-mobile-toc__scroll">
            <RailTree nav={nav} state={state} onNavigate={navigate} expanded />
          </div>
        </div>
      </div>
    </>
  );
}

export { MobileContents };
