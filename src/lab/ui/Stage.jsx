import * as React from "react";

/* SVG 画布外壳与动态滤镜定义。
   滤镜必须是真实 DOM 里的 <filter> 节点，所以这里生成一个隐藏的 svg 承载它们；
   同一个文档里的其他 svg 用 url(#id) 引用即可。 */

function makeFilter({ id, baseFrequency, numOctaves, seed, k3, warpFrequency, scale }) {
  return (
    '<filter id="' +
    id +
    '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="' +
    baseFrequency +
    '" numOctaves="' +
    numOctaves +
    '" seed="' +
    seed +
    '" result="grain"/>' +
    '<feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/>' +
    '<feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="' +
    k3 +
    '" k4="0" result="inked"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="' +
    warpFrequency +
    '" numOctaves="2" seed="' +
    (seed + 3) +
    '" result="warp"/>' +
    '<feDisplacementMap in="inked" in2="warp" scale="' +
    scale +
    '" xChannelSelector="R" yChannelSelector="G"/>' +
    "</filter>"
  );
}

function FilterDefs({ defs }) {
  let html = React.useMemo(() => defs.map(makeFilter).join(""), [defs]);
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs dangerouslySetInnerHTML={{ __html: html }} />
    </svg>
  );
}

/* 生成一组带组件唯一后缀的 id，避免同页多个 demo 互相抢滤镜。 */
function useIds(prefix, names) {
  let uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return React.useMemo(() => {
    let out = {};
    for (let name of names) out[name] = `${prefix}-${name}-${uid}`;
    return out;
  }, [prefix, uid, names.join(",")]);
}

function Stage({ width, height, caption, bare, children, html, overflow, label, filter, groupStyle }) {
  let groupProps = {};
  if (html) groupProps.dangerouslySetInnerHTML = { __html: html };
  if (filter) groupProps.filter = filter;
  if (groupStyle) groupProps.style = groupStyle;
  return (
    <div className={bare ? "lab-canvas lab-canvas--bare" : "lab-canvas"}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label || caption || "手绘笔触示例"}
        style={overflow ? { overflow: "visible" } : undefined}
      >
        <g {...groupProps}>{html ? null : children}</g>
      </svg>
      {caption ? <span className="lab-canvas__cap">{caption}</span> : null}
    </div>
  );
}

export { Stage, FilterDefs, useIds, makeFilter };
