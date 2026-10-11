import * as React from "react";
import { ar, an, ao } from "../../recovered/drawing-grid.jsx";
import { makeMarkerStroke } from "../../recovered/drawing-strokes.jsx";
import { makeTaskSquare } from "../../recovered/drawing-tasks.jsx";
import { DropCap, l6 } from "../../recovered/DropCap.jsx";
import { ShareStrokes } from "../../recovered/ShareStrokes.jsx";
import { sl as FAN_DEFAULTS } from "../../recovered/HeroChart.jsx";
import { buildFan } from "../demos/molecules.jsx";

const WIDTH = 900;
const HEIGHT = 560;
const HOTSPOTS = [
  ["fan", "扇形曲线", 490, 50, 360, 270],
  ["hand-drawn-line", "手绘笔触", 54, 254, 326, 44],
  ["ink-blob", "水彩墨块", 44, 340, 350, 118],
  ["task-squares", "任务方格", 492, 359, 230, 62],
  ["little-things", "手绘方框", 748, 346, 106, 90],
];

function SceneLink({ id, label, children }) {
  return (
    <a className="lab-scene__target" href={`#${id}`} aria-label={`查看${label}`}>
      <title>{label}</title>
      {children}
    </a>
  );
}

/* 不是原页截图：用现有真实函数组成一张元素地图。
   SVG 链接和 HTML 链接都是普通锚点，鼠标、键盘和无 JS 导航共用。 */
function OverviewScene() {
  const art = React.useMemo(() => {
    const grid = ar(0, 0, WIDTH, HEIGHT, { cell: 26, rag: 30, heavyEvery: 4 })
      .map((line) => an(line, { opacity: 0.16 })).join("");
    const fan = buildFan(370, 270, 330, { ...FAN_DEFAULTS, startHide: 15, linePitch: 3, opacity: 0.86 });
    const curves = fan.runs.map((run) => run.pieces.join("")).join("");
    const stroke = makeMarkerStroke([[64, 276], [150, 269], [248, 282], [366, 272]], {
      width: 12, seed: 23, color: "#D97757", paper: "#FAF9F5", opacity: 0.88,
    });
    const blob = ao({ x0: 60, y0: 367, x1: 366, y1: 376, h0: 54, h1: 68,
      c0: "#B3C1A0", c1: "#788C5D", seed: 6, opacity: 0.64, pressure: true, rim: true });
    const tiles = Array.from({ length: 4 }, (_, index) => {
      const tile = makeTaskSquare(index * 7 + 3, 48);
      return `<g transform="translate(${500 + index * 56} 367)">${tile.passes.join("")}${tile.weather}</g>`;
    }).join("");
    const box = l6(761, 359, 82, 62, 11, "#B0403A");
    return { grid, curves, stroke, blob, tiles, box };
  }, []);

  return (
    <div id="overview-scene" className="lab-scene">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label="设计元素地图，点击画面中的元素查看讲解">
        <SceneLink id="paper-grid" label="纸张方格">
          <rect width={WIDTH} height={HEIGHT} fill="#FAF9F5" />
          <g filter="url(#mk-rule)" dangerouslySetInnerHTML={{ __html: art.grid }} />
          <text className="lab-scene__label" x={720} y={535}>纸张方格</text>
        </SceneLink>
        <g filter="url(#mk-marker)" style={{ mixBlendMode: "multiply", isolation: "isolate" }}>
          <g transform="translate(490 50)" dangerouslySetInnerHTML={{ __html: art.curves }} />
          <g dangerouslySetInnerHTML={{ __html: art.stroke + art.blob + art.tiles }} />
        </g>
        <g dangerouslySetInnerHTML={{ __html: art.box }} />
        {HOTSPOTS.map(([id, label, x, y, w, h]) => (
          <SceneLink key={id} id={id} label={label}>
            <rect className="lab-scene__hit" x={x} y={y} width={w} height={h} rx="3" />
            <text className="lab-scene__label" x={x + 8} y={y + h - 8}>{label}</text>
          </SceneLink>
        ))}
      </svg>
      <a className="lab-scene__heading" href="#typography">
        <span>Economic futures</span>
        <strong>从一根笔触，<br />看见整页设计。</strong>
      </a>
      <a className="lab-scene__dropcap" href="#dropcap" aria-label="查看水彩首字">
        <DropCap letter="W" /><span>atercolor on paper.<br />每一处质感，都能拆开看。</span>
      </a>
      <a className="lab-scene__share" href="#share-bar" aria-label="查看比例横条">
        <ShareStrokes cents={64} todayCents={100} widthFraction={0.9} seed={2} sizeLabel="64¢" />
      </a>
    </div>
  );
}

export { OverviewScene };
