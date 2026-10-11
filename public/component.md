# 手绘水彩渲染引擎拆解

> Anthropic Econ Scenarios · 从一根笔触到整页装配

本文是设计元素图鉴（`/component`）的文本版：8 章、30 张元素卡、18 个源文件。交互演示、参数旋钮与实时效果只在页面上；这里保留每张卡的说明、要点、注意事项和对应源码。

由 `scripts/build-lab-md.mjs` 从 `src/lab/parts/` 的卡片定义与 `src/` 的真实源码生成，与页面共用同一份内容，不会各自漂移。

## 0 从画面开始

按组件分析 Anthropic 页面风格

> 元素地图：用 `src/recovered/` 的真实绘制函数拼出的一张画面，页面上可点击跳到对应模块。

## 1 基座：噪声与路径几何

先看随机如何固定，再看线条如何成形。

### A1 确定性哈希 `hashNoise`

给每个点一个固定偏移，重新绘制时，线条不会换样子。

#### hashNoise 与查表版 tD

`src/recovered/drawing-noise.jsx:3–15` · 13 行

```jsx
let hashNoise = (e) => {
  let t = 43758.5453 * Math.sin(127.1 * e + 311.7);
  return t - Math.floor(t);
};
let tH = (() => {
  let e = new Float32Array(1024);
  for (let t = 0; t < 1024; t++) {
    let a = 43758.5453 * Math.sin(127.1 * t + 311.7);
    e[t] = a - Math.floor(a);
  }
  return e;
})();
let tD = (e) => tH[(733.1 * e) & 1023];
```

### A2 种子随机与平滑插值 `createSeededRandom`

把固定的随机数连成平滑起伏，用来控制笔画的粗细和边缘。

**要点**

- createSeededRandom(seed) 每次给出下一个数；相同种子、相同取值顺序，结果就一样。
- createSeededNormal 把这些数映射到 −1…1，再用插值补出中间的变化。
- smoothstep 让采样点之间的连接更缓；count 越大，起伏越密，而不是幅度越大。

#### 两个生成器

`src/recovered/question-specs-2.jsx:345–364` · 20 行

```jsx
function createSeededRandom(e) {
  return function () {
    e |= 0;
    let t = Math.imul((e = (e + 0x6d2b79f5) | 0) ^ (e >>> 15), 1 | e);
    return (
      (((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) ^ (t >>> 14)) >>> 0) /
      0x100000000
    );
  };
}
function createSeededNormal(e, t) {
  let a = createSeededRandom(e),
    s = [];
  for (let e = 0; e <= t + 1; e++) s.push(2 * a() - 1);
  return function (e) {
    let a = Math.floor((e = Math.max(0, Math.min(1, e)) * t)),
      l = e - a;
    return s[a] + (s[a + 1] - s[a]) * (l * l * (3 - 2 * l));
  };
}
```

### A3 路径几何 `tK / tX / tJ / tQ`

沿着线条均匀安排采样点，为后面的粗细和边缘计算做准备。

**要点**

- tX 测量总长度，tK 沿原折线做重采样，让点的间距更均匀。
- tJ 计算各点沿线前进的方向；转 90° 后才是向两侧移动的法线方向。
- tQ 把点移向线条两侧，偏移距离由 fn(t) 决定；t 从起点的 0 变化到终点的 1。

#### tK / tX / tJ / tQ

`src/recovered/drawing-noise.jsx:46–97` · 52 行

```jsx
function tK(e, t) {
  if (e.length < 2) return e.slice();
  let a = [0],
    s = 0;
  for (let t = 1; t < e.length; t++) {
    s += Math.hypot(e[t][0] - e[t - 1][0], e[t][1] - e[t - 1][1]);
    a.push(s);
  }
  if (0 === s) return e.slice();
  let l = [],
    o = 0;
  for (let r = 0; r < t; r++) {
    let n = (s * r) / (t - 1);
    for (; o < a.length - 2 && a[o + 1] < n;) o++;
    let i = a[o + 1] - a[o] || 1,
      d = (n - a[o]) / i;
    l.push([
      e[o][0] + (e[o + 1][0] - e[o][0]) * d,
      e[o][1] + (e[o + 1][1] - e[o][1]) * d,
    ]);
  }
  return l;
}
function tX(e) {
  let t = 0;
  for (let a = 1; a < e.length; a++)
    t += Math.hypot(e[a][0] - e[a - 1][0], e[a][1] - e[a - 1][1]);
  return t;
}
function tJ(e) {
  let t = e.length,
    a = [];
  for (let s = 0; s < t; s++) {
    let l = e[Math.max(0, s - 1)],
      o = e[Math.min(t - 1, s + 1)],
      r = o[0] - l[0],
      n = o[1] - l[1],
      i = Math.hypot(r, n) || 1;
    a.push([r / i, n / i]);
  }
  return a;
}
function tQ(e, t) {
  let a = tJ(e),
    s = e.length,
    l = [];
  for (let o = 0; o < s; o++) {
    let r = t(o / (s - 1));
    l.push([e[o][0] - a[o][1] * r, e[o][1] + a[o][0] * r]);
  }
  return l;
}
```

### A4 墨色暗化 `tU`

从基色生成配套的深色，用来画笔芯、深色条痕和积墨边缘。

**要点**

- 颜色由红、绿、蓝三个 RGB 通道组成。tU 先突出较强的分量，再把三者一起压暗。
- amount 越大，结果越暗；调色不等于修改透明度。

#### tU

`src/recovered/drawing-noise.jsx:18–45` · 28 行

```jsx
function tU(e, t) {
  var a;
  let s,
    l =
      ((a = ((a = e) || "").trim()),
      (s = /^#([0-9a-f]{3})$/i.exec(a))
        ? [
            17 * parseInt(s[1][0], 16),
            17 * parseInt(s[1][1], 16),
            17 * parseInt(s[1][2], 16),
          ]
        : (s = /^#([0-9a-f]{6})$/i.exec(a))
          ? [
              parseInt(s[1].slice(0, 2), 16),
              parseInt(s[1].slice(2, 4), 16),
              parseInt(s[1].slice(4, 6), 16),
            ]
          : null);
  if (!l) return e;
  let o = Math.max(l[0], l[1], l[2]);
  return (
    "rgb(" +
    l
      .map((e) => Math.max(0, Math.round((e + (e - o) * 0.25) * (1 - t))))
      .join(",") +
    ")"
  );
}
```

## 2 笔触：一条线是怎么变成面的

从连续笔画到断续笔触，再加上纸纹与叠色。

### B1 手绘路径 `makeHandDrawnLine`

把细线骨架扩成有粗细变化、带毛边的笔画。

**要点**

- 沿骨架计算两侧边缘，再围成一个填充面；不是给细线直接加粗。
- width 是基准宽度，belly 让中段鼓起，wobble 控制沿途的粗细起伏。
- edge 让两侧边缘各自变化；taperIn/taperOut 控制两端收窄的范围，startWidth/endWidth 控制端点保留的宽度。

**注意事项**

- 起笔、收笔的收窄区过长时，中间也可能变细。

#### makeHandDrawnLine 全文

`src/recovered/drawing-noise.jsx:99–145` · 47 行

高亮的两段是核心：上面一行取默认参数，下面一行算每个点的半宽 p —— 锥度、鼓腹、抖动都乘在这一个量上。

```jsx
function makeHandDrawnLine(e, t = {}) {
  let a,
    s,
    l = e.length;
  if (l < 2) return "";
  let o = t.width || 4,
    r = t.seed || 1,
    n = null != t.taperIn ? t.taperIn : 0.14,
    i = null != t.taperOut ? t.taperOut : 0.08,
    d = null != t.startWidth ? t.startWidth : 0.14,
    c = null != t.endWidth ? t.endWidth : 0.8,
    u = null != t.belly ? t.belly : 0.07,
    h = null != t.wobble ? t.wobble : 0.14,
    m = null != t.edge ? t.edge : 0.055 * o + 0.35,
    p = null != t.chisel ? t.chisel : 0.35,
    f = createSeededNormal(7 * r + 1, Math.max(3, Math.round(l / 9))),
    g = createSeededNormal(13 * r + 2, Math.max(4, Math.round(l / 5))),
    x = createSeededNormal(17 * r + 3, Math.max(4, Math.round(l / 5))),
    _ = tJ(e),
    y = [],
    w = [];
  for (a = 0; a < l; a++) {
    let t = a / (l - 1),
      r = 1;
    n > 0 && t < n && (r *= d + (1 - d) * (s = (s = t / n) * s * (3 - 2 * s)));
    i > 0 &&
      t > 1 - i &&
      (r *= c + (1 - c) * (s = (s = (1 - t) / i) * s * (3 - 2 * s)));
    let p = Math.max(
        0.25,
        (o * (r *= (1 + u * Math.sin(Math.PI * t)) * (1 + h * f(t)))) / 2,
      ),
      b = -_[a][1],
      v = _[a][0];
    y.push([e[a][0] + b * (p + m * g(t)), e[a][1] + v * (p + m * g(t))]);
    w.push([e[a][0] - b * (p + m * x(t)), e[a][1] - v * (p + m * x(t))]);
  }
  let b = p * o;
  y[l - 1] = [y[l - 1][0] + _[l - 1][0] * b, y[l - 1][1] + _[l - 1][1] * b];
  w[0] = [w[0][0] - _[0][0] * b * 0.6, w[0][1] - _[0][1] * b * 0.6];
  let v = "M" + roundToTenth(y[0][0]) + " " + roundToTenth(y[0][1]);
  for (a = 1; a < l; a++)
    v += "L" + roundToTenth(y[a][0]) + " " + roundToTenth(y[a][1]);
  for (a = l - 1; a >= 0; a--)
    v += "L" + roundToTenth(w[a][0]) + " " + roundToTenth(w[a][1]);
  return v + "Z";
}
```

### B2 种子家族

保持参数不变，换种子看看同一支笔能画出哪些变化。

**要点**

- 参数决定变化幅度，seed 决定这一次具体长什么样。
- 换回原来的种子，就能恢复同一种笔画。

### B3 马克笔三层 `makeMarkerPath`

在主体笔画上，按需加深色笔芯或纸色漏白。

**要点**

- 主体是填充笔画；core 额外叠两条较窄的深色笔触，streaks 额外叠三道纸色条带。
- 只有开启对应开关、且笔宽足够时才添加：core 至少 3.5，streaks 至少 14。

**注意事项**

- 漏白使用 paper 指定的纸色；换背景时也要更新它。

#### makeMarkerPath 全文

`src/recovered/drawing-strokes.jsx:22–106` · 85 行

两个高亮的 if 就是那两个阈值：width ≥ 3.5 加笔芯，width ≥ 14 加漏白。

```jsx
function makeMarkerPath(e, t = {}) {
  let a = t.width || 4,
    s = t.seed || 1,
    l = t.color || "#333",
    o = tK(e, t6(e, t)),
    r = null != t.opacity ? t.opacity : 0.92,
    n =
      '<path d="' +
      makeHandDrawnLine(o, {
        width: a,
        seed: s,
        taperIn: t.taperIn,
        taperOut: t.taperOut,
        startWidth: t.startWidth,
        endWidth: t.endWidth,
        belly: t.belly,
        wobble: t.wobble,
        edge: t.edge,
        chisel: t.chisel,
      }) +
      '" fill="' +
      l +
      '" fill-opacity="' +
      r +
      '"/>';
  if (a >= 3.5 && false !== t.core) {
    let e = createSeededNormal(5 * s + 9, 5),
      t = tQ(o, (t) => e(t) * a * 0.17);
    n +=
      '<path d="' +
      makeHandDrawnLine(t, {
        width: 0.45 * a,
        seed: s + 31,
        taperIn: 0.2,
        taperOut: 0.16,
        startWidth: 0.2,
        endWidth: 0.5,
        edge: 0.03 * a + 0.3,
        chisel: 0.25,
      }) +
      '" fill="' +
      tU(l, 0.12) +
      '" fill-opacity="0.30"/>';
    let r = tQ(o, () => 0.3 * a);
    n +=
      '<path d="' +
      makeHandDrawnLine(r, {
        width: 0.16 * a,
        seed: s + 57,
        taperIn: 0.25,
        taperOut: 0.2,
        startWidth: 0.15,
        endWidth: 0.4,
        edge: 0.5,
        chisel: 0.15,
      }) +
      '" fill="' +
      tU(l, 0.18) +
      '" fill-opacity="0.22"/>';
  }
  if (a >= 14 && false !== t.streaks) {
    let e = t.paper || "#ffffff";
    [-0.22, 0.05, 0.26].forEach((t, l) => {
      let r = tQ(o, (e) => t * a * (1 + 0.15 * Math.sin(5 * e + l)));
      n +=
        '<path d="' +
        makeHandDrawnLine(r, {
          width: a * (0.09 + 0.04 * l),
          seed: s + 71 + 13 * l,
          taperIn: 0.3,
          taperOut: 0.25,
          startWidth: 0.2,
          endWidth: 0.3,
          edge: 0.6,
          chisel: 0.1,
        }) +
        '" fill="' +
        e +
        '" fill-opacity="' +
        (0.1 + (l % 2) * 0.04) +
        '"/>';
    });
  }
  return n;
}
```

### B4 干笔分段 `at`

把连续笔画拆成小段，每段略有不同，形成干笔效果。

**要点**

- dashLength 控制每段长度，gap 控制段间空隙。
- 各段的长度、粗细、角度和深浅略有不同；neat 会收紧这些变化，让排列更规整。
- landOnEnd 会在必要时补一小段，让线条更接近原定终点。

**注意事项**

- 段长过小会生成更多 SVG 路径，使用时留意段数。

#### at（干笔分段）全文

`src/recovered/drawing-strokes.jsx:119–205` · 87 行

高亮处依次是：段起点、段中央、段终点（都带旋转）—— 以及 neat 开关控制的两组随机幅度、35%/12% 的重墨概率。

```jsx
function at(e, t = {}) {
  let a = t.width || 4,
    s = t.seed || 1,
    l = t.color || "#333",
    o = t.dashLength || 3.4 * a,
    r = t.gap || 1.6 * a,
    n = null != t.opacity ? t.opacity : 1,
    i = tK(e, Math.max(48, t6(e, t))),
    d = tX(i),
    c = createSeededRandom(101 * s + 5),
    u = !!t.neat,
    h = [],
    m = 0.3 * o * c(),
    p = 0,
    f = (e, t) => {
      let o = e / d,
        r = t / d,
        h = Math.max(0, Math.floor(o * (i.length - 1))),
        m = Math.min(i.length - 1, Math.ceil(r * (i.length - 1))),
        p = "";
      if (m - h >= 1) {
        let t = tK(i.slice(h, m + 1), 8),
          o = (c() - 0.5) * (u ? 0.018 : 0.06),
          r = Math.cos(o),
          d = Math.sin(o),
          f = 0,
          g = 0,
          x;
        for (x = 0; x < t.length; x++) {
          f += t[x][0];
          g += t[x][1];
        }
        for (f /= t.length, g /= t.length, x = 0; x < t.length; x++) {
          let e = t[x][0] - f,
            a = t[x][1] - g;
          t[x] = [f + e * r - a * d, g + e * d + a * r];
        }
        let _ = a * (u ? 0.94 + 0.12 * c() : 0.85 + 0.35 * c());
        p =
          '<path d="' +
          makeHandDrawnLine(t, {
            width: _,
            seed: s + Math.round(e),
            taperIn: 0.18,
            taperOut: 0.18,
            startWidth: 0.55,
            endWidth: 0.5,
            belly: u ? 0.02 : 0.05,
            wobble: u ? 0.03 : 0.08,
            edge: u ? 0.25 : 0.05 * _ + 0.3,
            chisel: u ? 0.2 : 0.35,
          }) +
          '" fill="' +
          l +
          '" fill-opacity="' +
          ((u ? 0.9 + 0.08 * c() : 0.82 + 0.16 * c()) * n).toFixed(2) +
          '"/>';
        c() < (u ? 0.12 : 0.35) &&
          (p +=
            '<path d="' +
            makeHandDrawnLine(t, {
              width: 0.5 * _,
              seed: s + Math.round(e) + 7,
              taperIn: 0.3,
              taperOut: 0.3,
              startWidth: 0.3,
              endWidth: 0.3,
              edge: 0.4,
              chisel: 0.2,
            }) +
            '" fill="' +
            tU(l, 0.13) +
            '" fill-opacity="' +
            (0.3 * n).toFixed(2) +
            '"/>');
      }
      return p;
    };
  for (; m < d - 2;) {
    let e = Math.min(d, m + o * (u ? 0.92 + 0.16 * c() : 0.8 + 0.45 * c()));
    h.push(f(m, e));
    p = e;
    m = e + r * (u ? 0.9 + 0.2 * c() : 0.75 + 0.5 * c());
  }
  t.landOnEnd && d - p > 0.5 * o && h.push(f(Math.max(p + 0.4 * r, d - o), d));
  return h;
}
```

### B5 噪点滤镜配方台

给笔画加入颗粒和轻微变形，避免边缘太规整。

**要点**

- 先用噪点遮罩让部分位置更透明，再轻微移动轮廓。
- mk-rule 变化较轻，适合格线；mk-marker 适合普通笔触；mk-dry 的颗粒感更强。
- 前四列是固定对照，参数只影响最右边的自定义滤镜。

**注意事项**

- 滤镜区域需要给边缘变形留出空间，否则可能被裁切。

#### MarkerFilters 里的三档定义

`src/recovered/SectionLaborShare.jsx:174–202` · 29 行

高亮的两行分别是 mk-marker 与 mk-dry 的完整串联。注意二者除了频率和 k3，位移 scale 也不同。

```jsx
function MarkerFilters() {
  return (
    <svg
      width={"0"}
      height={"0"}
      style={{
        position: "absolute",
      }}
      aria-hidden={true}
      focusable={"false"}
    >
      <defs
        dangerouslySetInnerHTML={{
          __html:
            '<filter id="' +
            MARKER_FILTER_ID +
            '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="7" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="-0.30" k4="0" result="inked"/><feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="2" seed="11" result="warp"/><feDisplacementMap in="inked" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="' +
            DRY_FILTER_ID +
            '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="-0.55" k4="0" result="inked"/><feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="2" seed="9" result="warp"/><feDisplacementMap in="inked" in2="warp" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="' +
            RULE_FILTER_ID +
            '" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="5" result="grain"/><feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/><feComposite in="SourceGraphic" in2="ga" operator="arithmetic" k1="0" k2="1" k3="-0.12" k4="0" result="inked"/><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="3" result="warp"/><feDisplacementMap in="inked" in2="warp" scale="0.6" xChannelSelector="R" yChannelSelector="G"/></filter>' +
            makeLiteFilter("mk-marker-lite", 0.55, 7, -0.3) +
            makeLiteFilter("mk-dry-lite", 0.9, 4, -0.55) +
            makeLiteFilter("mk-rule-lite", 0.72, 5, -0.12),
        }}
      />
    </svg>
  );
}
```

### B6 叠加与 `mix-blend-mode: multiply`

让重叠处颜色变深，像两笔颜料叠在一起。

**要点**

- multiply 改变颜色的混合方式，不改变笔触形状。
- isolation: isolate 把混合限制在当前组合中，避免影响外面的背景。

**注意事项**

- 纸色也参与叠色；换背景后重新检查重叠效果。

#### t8 与两个包装

`src/recovered/drawing-strokes.jsx:107–118` · 12 行

```jsx
function t8(e, t) {
  return (
    '<g class="mk"' +
    (t && false === t.blend ? "" : ' style="mix-blend-mode:multiply"') +
    ">" +
    e +
    "</g>"
  );
}
function makeMarkerStroke(e, t = {}) {
  return t8(makeMarkerPath(e, t), t);
}
```

## 3 纸与材质

观察纸面、网格和颜料的边缘。

### C1 纸张方格

调格距、端点长短和加粗间隔，做出手绘方格纸。

**要点**

- ar 记录格线位置，an 把这些线段画成笔触。
- rag 让格线两端的长短不齐，不改变参考线的水平或垂直方向。
- heavyEvery 让水平格线每隔几条加粗一次，形成节奏。

**注意事项**

- 格距较小时，适当减小线宽和端点错落，避免拥挤。

#### ar 与 an

`src/recovered/drawing-grid.jsx:198–261` · 64 行

```jsx
function ar(e, t, a, s, l = {}) {
  let o = l.cell ?? 26,
    r = l.rag ?? 26,
    n = l.heavyEvery ?? 0,
    i = (e, t) => (hashNoise(e) - 0.5) * 2 * t,
    d = [];
  for (let l = t + o, c = 0; l < t + s - 0.5; l += o, c++) {
    let t = 900 + 4.3 * c;
    d.push({
      key: `h${c}`,
      x1: e + i(t + 11, r),
      y1: l,
      x2: e + a + i(t + 17, r),
      y2: l,
      seed: t,
      heavy: n > 0 && (c + 1) % n == 0,
    });
  }
  for (let l = e + o, n = 0; l < e + a - 0.5; l += o, n++) {
    let e = 3.7 * n;
    d.push({
      key: `v${n}`,
      x1: l,
      y1: t + i(e + 11, r),
      x2: l,
      y2: t + s + i(e + 17, r),
      seed: e,
      heavy: false,
    });
  }
  return d;
}
function an(e, t = {}, a) {
  let s = t.color ?? "#87867F",
    l = t.weight ?? 1.2,
    o = t.opacity ?? 0.24,
    r = a ? a.from : e.x1,
    n = a ? a.to : e.x2;
  return makeMarkerStroke(
    [
      [r, e.y1],
      [(r + n) / 2, (e.y1 + e.y2) / 2],
      [n, e.y2],
    ],
    {
      width:
        t.width ??
        (e.heavy ? 1.6 * l : l * (0.85 + 0.4 * hashNoise(e.seed + 0.6))),
      color: s,
      seed: Math.round(7 * e.seed) + 3,
      opacity: e.heavy ? 1.4 * o : o,
      taperIn: 0.04,
      taperOut: 0.04,
      startWidth: 0.7,
      endWidth: 0.7,
      belly: 0,
      wobble: 0.09,
      edge: 0.3,
      chisel: 0.1,
      core: false,
      blend: false,
    },
  );
}
```

### C2 网格挖洞

拖动方块，让网格绕开内容，并留下不齐整的断口。

**要点**

- 先把方块边界对齐格线，再算出每条线需要避开的范围。
- visible 保留外面的线段，patch 提供补线；较短的碎段会被丢弃。
- 断口两端略有错落，不像整齐切断的电脑线。

#### ad / ac / au / ah

`src/recovered/drawing-grid.jsx:262–349` · 88 行

高亮的是区间合并：把线段穿过障碍的那几段收拢成不重叠的区间集合。

```jsx
let ai = 12;
let ad = (e, t = ai) => -t / 2 + tD(e) * (1.5 * t);
let ac = (e, t) => {
  let a = hashNoise(e);
  return a < 0.6 ? 0 : ((a - 0.6) / 0.4) ** 1.4 * t;
};
function au(e, t, a = {}, s) {
  let l = a.cell ?? 26,
    o = a.edgeY ?? 44,
    r = a.edgeX ?? 64,
    n = a.jut ?? ai,
    i = a.minPiece ?? 0,
    d = (e, t) => (hashNoise(e) - 0.5) * 2 * t,
    c = (s ? (Array.isArray(s) ? s : [s]) : []).map((e) => ({
      left: Math.floor(e.left / l) * l,
      top: Math.floor(e.top / l) * l,
      right: Math.ceil(e.right / l) * l,
      bottom: Math.ceil(e.bottom / l) * l,
    })),
    u = (e, t, a) => {
      let s = [];
      c.forEach((l, o) => {
        e(l) && s.push([...t(l, a + 17.3 * o)]);
      });
      s.sort((e, t) => e[0] - t[0]);
      let o = [];
      for (let e of s) {
        let t = o[o.length - 1];
        t && e[0] <= t[1] + l
          ? (t[1] = Math.max(t[1], e[1]))
          : o.push([e[0], e[1]]);
      }
      return o;
    },
    h = [],
    m = [],
    p = (e, t, a, s, l, o, r) =>
      e.push({
        key: t,
        x1: a,
        y1: s,
        x2: l,
        y2: o,
        seed: r,
        heavy: false,
      });
  for (let s = l, r = 0; s < e - 0.5; s += l, r++) {
    let e = 3.7 * r,
      l = d(e + 11, o) + ac(e + 23, a.edgeShort ?? 0),
      c = t + d(e + 17, o) - ac(e + 29, a.edgeShortBottom ?? 0),
      f = u(
        (e) => s > e.left && s < e.right,
        (e, t) => [e.top + ad(t + 2.1, n), e.bottom - ad(t + 5.3, n)],
        e,
      ),
      g = l;
    f.forEach(([t, a], l) => {
      t - g > i && p(h, `v${r}-${l}`, s, g, s, t, e + 0.3 * l);
      p(m, `v${r}p${l}`, s, t, s, a, e);
      g = Math.max(g, a);
    });
    c - g > i && p(h, `v${r}-e`, s, g, s, c, e + 0.3 * f.length);
  }
  for (let s = l, o = 0; s < t - 0.5; s += l, o++) {
    let t = 900 + 4.3 * o,
      l = d(t + 11, r) + ac(t + 23, a.edgeShortLeft ?? 0),
      c = e + d(t + 17, r) - ac(t + 29, a.edgeShortRight ?? 0),
      f = u(
        (e) => s > e.top && s < e.bottom,
        (e, t) => [e.left + ad(t + 3.7, n), e.right - ad(t + 8.9, n)],
        t,
      ),
      g = l;
    f.forEach(([e, a], l) => {
      e - g > i && p(h, `h${o}-${l}`, g, s, e, s, t + 0.3 * l);
      p(m, `h${o}p${l}`, e, s, a, s, t);
      g = Math.max(g, a);
    });
    c - g > i && p(h, `h${o}-e`, g, s, c, s, t + 0.3 * f.length);
  }
  return {
    visible: h,
    patch: m,
  };
}
function ah(e, t, a = {}, s) {
  return au(e, t, a, s).visible;
}
```

### C3 墨块 `ao`

用多道笔触叠成色带，再加渐变、条痕和边缘积色。

**要点**

- 多道笔触轻微重叠，铺在上下边界之间。
- 两端颜色不同时，沿色带生成渐变。
- pressure 加深浅条痕，rim 加边缘色，dashedEdges 改用断续的边缘描线。

**注意事项**

- samples 太少时，边界可能出现明显折角。

#### as / al / ao

`src/recovered/drawing-grid.jsx:7–197` · 191 行

高亮处：笔数、每条笔触在厚度里的相对位置、以及相邻笔触的错落。

```jsx
function as(e, t, a, s, l) {
  let o = [];
  for (let r = 0; r <= l; r++) {
    let n = r / l,
      i = 1 - n,
      d = e + (a - e) * 0.45,
      c = a - (a - e) * 0.45,
      u = i * i * i * e + 3 * i * i * n * d + 3 * i * n * n * c + n * n * n * a,
      h = n * n * (3 - 2 * n);
    o.push([u, t + (s - t) * h]);
  }
  return o;
}
function al(e, t, a, s = {}) {
  return makeMarkerStroke(
    [
      [e, t - 2],
      [e, t + a / 2],
      [e, t + a + 2],
    ],
    {
      width: s.width || 13,
      color: s.color || "#333",
      seed: s.seed || 3,
      opacity: null != s.opacity ? s.opacity : 0.94,
      taperIn: 0.04,
      taperOut: 0.04,
      startWidth: 0.8,
      endWidth: 0.8,
      belly: 0.03,
      wobble: 0.05,
      chisel: 0.2,
      core: s.core,
      blend: s.blend,
    },
  );
}
function ao(e) {
  let t,
    a = e.samples || 44,
    s = e.seed || 1,
    l = as(e.x0, e.y0, e.x1, e.y1, a),
    o = as(e.x0, e.y0 + e.h0, e.x1, e.y1 + e.h1, a),
    r = e.c0 || "#cfc9ba",
    n = e.c1 || r,
    i = "";
  if (false !== e.fill) {
    let a = (e.h0 + e.h1) / 2,
      d = r;
    if (n !== r) {
      let t = "mkflow" + ++aa;
      i +=
        '<linearGradient id="' +
        t +
        '" gradientUnits="userSpaceOnUse" x1="' +
        e.x0 +
        '" y1="0" x2="' +
        e.x1 +
        '" y2="0"><stop offset="0" stop-color="' +
        r +
        '"/><stop offset="1" stop-color="' +
        n +
        '"/></linearGradient>';
      d = "url(#" + t + ")";
    }
    let c = Math.min(24, Math.max(8, a / 3)),
      u = a <= 14 ? 1 : Math.max(1, Math.ceil(a / (0.72 * c))),
      h = createSeededRandom(91 * s + 7),
      m = "";
    for (t = 0; t < u; t++) {
      let e =
          1 === u
            ? 0.5
            : (0.45 * c) / a +
              (t * (1 - (0.9 * c) / a)) / (u - 1) +
              (h() - 0.5) * 0.03,
        r = l.map((t, a) => [t[0], t[1] + (o[a][1] - t[1]) * e]),
        n = 1 === u ? a : 1.18 * c;
      m += makeMarkerPath(r, {
        width: n,
        seed: s + 17 * t,
        color: d,
        opacity: 1,
        taperIn: 0.015,
        taperOut: 0.015,
        startWidth: 0.92,
        endWidth: 0.92,
        belly: 0,
        wobble: 0.035,
        edge: Math.min(1.4, 0.04 * n + 0.4),
        chisel: 0.08,
        core: false,
        streaks: false,
        samples: 40,
      });
    }
    if (
      ((i +=
        '<g opacity="' +
        (null != e.opacity ? e.opacity : 0.5) +
        '">' +
        m +
        "</g>"),
      true === e.pressure && a > 40)
    ) {
      let e = Math.min(3, Math.max(2, Math.round(0.6 * u)));
      for (t = 0; t < e; t++) {
        let e = 0.12 + 0.76 * h(),
          a = l.map((t, a) => [t[0], t[1] + (o[a][1] - t[1]) * e]),
          n = c * (1.6 + 0.9 * h()),
          d = 0.6 > h(),
          u = d ? tU(r, 0.04 + 0.04 * h()) : "#ffffff",
          m = d ? 0.028 + 0.02 * h() : 0.028 + 0.016 * h();
        [
          [1.6, 0.55],
          [0.85, 1],
        ].forEach((e, l) => {
          i += makeMarkerPath(a, {
            width: n * e[0],
            seed: s + 121 + 19 * t + 7 * l,
            color: u,
            opacity: m * e[1],
            taperIn: 0.05,
            taperOut: 0.05,
            startWidth: 0.75,
            endWidth: 0.75,
            belly: 0,
            wobble: 0.04,
            edge: 0.3 * n,
            chisel: 0.1,
            core: false,
            streaks: false,
            samples: 40,
          });
        });
      }
    }
    if (false !== e.rim && a > 24) {
      let e = Math.max(2.5, 0.14 * c),
        t = tU(r, 0.16);
      [
        [l, 1],
        [o, -1],
      ].forEach((a, l) => {
        let o = a[0].map((t) => [t[0], t[1] + a[1] * (0.5 * e + 0.8)]);
        i += makeMarkerPath(o, {
          width: e,
          seed: s + 61 + 13 * l,
          color: t,
          opacity: 0.13,
          taperIn: 0.06,
          taperOut: 0.06,
          startWidth: 0.5,
          endWidth: 0.5,
          belly: 0,
          wobble: 0.06,
          edge: 0.5,
          chisel: 0.1,
          core: false,
          streaks: false,
          samples: 40,
        });
      });
    }
  }
  if (e.dashedEdges) {
    let t = e.edgeColor || r,
      a = e.edgeWidth || 3.2,
      n = e.edgeDashLength || 3.6 * a,
      d = e.edgeGap || 2.7 * a;
    i += makeDryStroke(l, {
      width: a,
      color: t,
      seed: s + 5,
      dashLength: n,
      gap: d,
      neat: true,
    });
    i += makeDryStroke(o, {
      width: a,
      color: t,
      seed: s + 9,
      dashLength: n,
      gap: d,
      neat: true,
    });
  }
  return t8(i, {
    blend: e.blend,
  });
}
```

### C4 值噪声斑块 `aL`

决定哪些位置有颜料，生成不规则的斑块。

**要点**

- aL 只返回这个位置是否上色，不直接返回颜色或透明度。
- 把值噪声与从中心到边缘变化的阈值比较，决定哪些位置保留颜料。
- scale 提高阈值，让更多位置上色；gain 改变噪声数值的差异，而不是直接调透明度。

**注意事项**

- 相同位置和参数会得到相同结果；改变尺寸或参数后，形状也会改变。

#### aM / aj / aS / aN / aA / aT / aL

`src/recovered/drawing-tasks.jsx:244–282` · 39 行

aL 只有十几行：钳位半径 → 插值阈值 → 取两层噪声 → 比较。

```jsx
let aM = {
  core: 0.33,
  edge: 0.26,
  coreRadius: 0.35,
  blob: 1,
  gain: 2.4,
};
let aj = (e) => (e < 0 ? 0 : e > 1 ? 1 : e);
let aS = (e) => {
  let t = aj(e);
  return t * t * (3 - 2 * t);
};
let aN = (e, t, a) => e + (t - e) * a;
let aA = (e, t) => hashNoise(157.31 * e + 311.7 * t + 0.5);
function aT(e, t) {
  let a = Math.floor(e),
    s = Math.floor(t),
    l = aS(e - a),
    o = aS(t - s);
  return aN(
    aN(aA(a, s), aA(a + 1, s), l),
    aN(aA(a, s + 1), aA(a + 1, s + 1), l),
    o,
  );
}
function aL(e, t, a, s, l = aM, o = 1) {
  let r = Math.min(1, Math.hypot(e / a, t / s)),
    n = aN(l.core, l.edge, aS((r - l.coreRadius) / (1 - l.coreRadius))) * o,
    i = l.blob;
  return (
    aj(
      0.5 +
        (0.65 * aT(e / i, t / i) +
          0.35 * aT(e / (0.4 * i), t / (0.4 * i)) -
          0.5) *
          l.gain,
    ) < n
  );
}
```

## 4 水彩铺色

把笔触铺成色块，再加入干燥的痕迹。

### D1 铺色 `a_`

用略有重叠的笔触铺满一块区域。

**要点**

- 根据区域大小和笔宽安排笔数，相邻笔触轻微重叠，减少缝隙。
- endScatter 让起止位置略有参差；direction 决定横向还是纵向铺色。
- passes 是底色笔触，weather 是后来叠加的条痕、斑驳和边缘色。

#### a_ 的参数推导部分

`src/recovered/drawing-tasks.jsx:39–101` · 63 行

高亮处就是那几个关键公式：笔宽推导、方向对调、passCount，以及每条 pass 的位置与三处抖动。

```jsx
function a_(e, t, a, s, l, o = () => l.color ?? "#333") {
  var r, n, i, d, c;
  let u,
    h,
    m,
    p,
    {
      seed: f,
      span: g,
      len: x,
      sw: _,
      pt: y,
      nPass: w,
    } = ((r = e),
    (n = t),
    (i = a),
    (d = s),
    (u = (c = l).seed ?? 1),
    (m = (h = "v" === c.direction) ? i : d),
    (p = (function (e, t = false) {
      return t ? e : Math.max(e, 10);
    })(c.strokeWidth ?? Math.min(24, Math.max(10, m / 3)), c.finePass)),
    {
      seed: u,
      span: m,
      len: h ? d : i,
      sw: p,
      pt: (e, t) => (h ? [r + t, n + e] : [r + e, n + t]),
      nPass: Math.max(1, Math.ceil(m / (0.72 * p))),
    }),
    b = l.color ?? "#333",
    v = l.endScatter ?? 1,
    k = createSeededRandom(77 * f + 3),
    M = [];
  for (let e = 0; e < w; e++) {
    let t =
        (1 === w ? g / 2 : 0.45 * _ + (e * (g - 0.9 * _)) / (w - 1)) +
        (k() - 0.5) * _ * 0.08,
      a = (k() - 0.5) * x * 0.02 * v,
      s = x + (k() - 0.5) * x * 0.02 * v,
      l = (k() - 0.5) * _ * 0.12,
      r = y(a, t - l),
      n = y((a + s) / 2, t + (k() - 0.5) * _ * 0.08),
      i = y(s, t + l);
    M.push(
      makeMarkerPath([r, n, i], {
        width: 1.18 * _,
        seed: f + 17 * e,
        color: o(e, w),
        opacity: 1,
        taperIn: 0.025,
        taperOut: 0.02,
        startWidth: 0.88,
        endWidth: 0.88,
        belly: 0.015,
        wobble: 0.05,
        edge: 0.035 * _ + 0.4,
        chisel: 0.12,
        core: false,
        streaks: false,
      }),
    );
  }
```

### D2 干燥痕迹的三个层次

在相同底色上，分别观察条痕、斑驳和边缘积色。

**要点**

- pressure 加深浅交替的条痕，mottle 打散过于均匀的底色，rim 加深边缘。
- 四列使用相同的底色笔触，只改变后面叠加的痕迹。

#### pressure / mottle / rim 三段

`src/recovered/drawing-tasks.jsx:102–200` · 99 行

高亮处是 pressure 的生成：随机位置、随机宽度、深浅二选一、外层宽内层窄。

```jsx
  let j = "";
  if (false !== l.pressure && g > 26 && x > 40) {
    let e = Math.max(2, Math.round(0.8 * w));
    for (let t = 0; t < e; t++) {
      let e = g * (0.1 + 0.8 * k()),
        a = _ * (1.2 + 0.8 * k()),
        s = 0.65 > k(),
        o = s ? tU(b, 0.05 + 0.06 * k()) : (l.paper ?? "#ffffff"),
        r = s ? 0.09 + 0.05 * k() : 0.07 + 0.04 * k(),
        n = (k() - 0.5) * a * 0.25,
        i = [
          y(0.02 * x, e - n),
          y(0.5 * x, e + (k() - 0.5) * a * 0.15),
          y(0.98 * x, e + n),
        ];
      [
        [1.6, 0.55],
        [0.85, 1],
      ].forEach((e, s) => {
        j += makeMarkerPath(i, {
          width: a * e[0],
          seed: f + 51 + 19 * t + 7 * s,
          color: o,
          opacity: r * e[1],
          taperIn: 0.05,
          taperOut: 0.05,
          startWidth: 0.75,
          endWidth: 0.75,
          belly: 0.02,
          wobble: 0.06,
          edge: 0.22 * a,
          chisel: 0.1,
          core: false,
          streaks: false,
        });
      });
    }
  }
  if (false !== l.mottle && g > 26 && x > 40) {
    let l = 2 + Math.floor(2 * k());
    for (let o = 0; o < l; o++) {
      let l = e + a * (0.18 + 0.64 * k()),
        r = t + s * (0.18 + 0.64 * k()),
        n = k() * Math.PI,
        i = Math.min(x, g) * (0.35 + 0.5 * k()),
        d = (Math.cos(n) * i) / 2,
        c = (Math.sin(n) * i) / 2;
      j += makeMarkerPath(
        [
          [l - d, r - c],
          [l + (k() - 0.5) * i * 0.2, r + (k() - 0.5) * i * 0.2],
          [l + d, r + c],
        ],
        {
          width: _ * (0.9 + 0.7 * k()),
          seed: f + 91 + 7 * o,
          color: tU(b, 0.08),
          opacity: 0.05 + 0.03 * k(),
          taperIn: 0.25,
          taperOut: 0.25,
          startWidth: 0.35,
          endWidth: 0.35,
          belly: 0.1,
          wobble: 0.1,
          edge: 2,
          chisel: 0.1,
          core: false,
          streaks: false,
        },
      );
    }
  }
  if (false !== l.rim && g > 18 && x > 18) {
    let l = Math.max(3, 0.16 * _),
      o = 0.55 * l + 1,
      r = tU(b, 0.13),
      n = (e, t, a) =>
        makeMarkerPath([e, [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2], t], {
          width: l,
          seed: f + 171 + 13 * a,
          color: r,
          opacity: 0.16,
          taperIn: 0.08,
          taperOut: 0.08,
          startWidth: 0.5,
          endWidth: 0.5,
          belly: 0,
          wobble: 0.07,
          edge: 0.5,
          chisel: 0.1,
          core: false,
          streaks: false,
        });
    j +=
      n([e + o, t + o], [e + a - o, t + o], 0) +
      n([e + a - o, t + o], [e + a - o, t + s - o], 1) +
      n([e + a - o, t + s - o], [e + o, t + s - o], 2) +
      n([e + o, t + s - o], [e + o, t + o], 3);
  }
```

### D3 任务方格

给每个方格固定的颜色和笔触，再排列成任务图。

**要点**

- seed 决定方格的随机样式和颜色类别，重绘时不重新抽取。
- 先画底色，再按需要覆盖一部分颜色，最后叠加表面痕迹。

#### am / ag / ax / makeTaskSquare / aw / av / ak

`src/recovered/drawing-tasks.jsx:6–38` · 33 行

```jsx
function am(e, t, a, s, l, o = {}) {
  return makeMarkerStroke(
    [
      [e, t],
      [(e + a) / 2, (t + s) / 2],
      [a, s],
    ],
    {
      width: o.width ?? 1.3,
      color: o.color ?? "currentColor",
      seed: Math.round(13 * l) + 5,
      opacity: o.opacity ?? 0.34,
      taperIn: 0.04,
      taperOut: 0.04,
      startWidth: 0.7,
      endWidth: 0.7,
      belly: 0,
      wobble: 0.09,
      edge: 0.3,
      chisel: 0.1,
      core: false,
      blend: false,
    },
  );
}
let TASK_CELL_SIZE = 52;
let af = (e) => 7 * e + 3;
function ag(e, t, a, s, l, o = {}) {
  return a_(e, t, a, s, o, l).passes;
}
function ax(e, t, a, s, l = {}) {
  return a_(e, t, a, s, l).weather;
}
```

## 5 墨与色

原页的配色、字体与字号。

### E1 三档情景色板

三组配色，每组四档；拖动 t 查看深浅变化。

**要点**

- 蓝、绿、粉分别对应原页的三种情景，每组由深到浅排列。
- pickPaletteShade 在 t 达到 0.42、0.72、0.92 时切换到下一档，不是连续渐变。

#### palette.jsx 全文

`src/recovered/palette.jsx` · 38 行

```jsx
// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
let MODEST_PALETTE = ["#6A9BCC", "#8BADCF", "#A8C4DE", "#C4D9EA"];
let SUBSTANTIAL_PALETTE = ["#788C5D", "#8AA16D", "#A2B48B", "#B3C1A0"];
let EXTREME_PALETTE = ["#C46686", "#CC7D98", "#D89EB0", "#E2B6C4"];
function pickPaletteShade(e, t) {
  return t < 0.42 ? e[0] : t < 0.72 ? e[1] : t < 0.92 ? e[2] : e[3];
}
let SCENARIO_PALETTES = {
  slow: MODEST_PALETTE,
  central: SUBSTANTIAL_PALETTE,
  fast: EXTREME_PALETTE,
};
let NEUTRAL_INK = "#BDBAAE";
let AUGMENTATION_INK = "#918BD6";
let AUTOMATION_INK = "#6A9BCC";
let NEW_TASK_INK = "#F0AC54";
let BASELINE_INK = "#D97757";
let CHART_THEME = {
  paper: "#FAF9F5",
  rule: "#87867F",
  text: "#141413",
  history: "#9C9A92",
  baseline: BASELINE_INK,
};
export {
  MODEST_PALETTE,
  SUBSTANTIAL_PALETTE,
  EXTREME_PALETTE,
  pickPaletteShade,
  SCENARIO_PALETTES,
  NEUTRAL_INK,
  AUGMENTATION_INK,
  AUTOMATION_INK,
  NEW_TASK_INK,
  BASELINE_INK,
  CHART_THEME,
};

```

### E2 语义墨水色

颜色不仅装饰画面，也区分任务的不同含义。

**要点**

- 同一含义在图表、图例和正文中沿用同一种颜色。
- 修改语义颜色时，同步相关色值和 CSS 变量，避免同一个含义出现不同颜色。

#### 语义色常量

`src/recovered/palette.jsx:13–24` · 12 行

```jsx
let NEUTRAL_INK = "#BDBAAE";
let AUGMENTATION_INK = "#918BD6";
let AUTOMATION_INK = "#6A9BCC";
let NEW_TASK_INK = "#F0AC54";
let BASELINE_INK = "#D97757";
let CHART_THEME = {
  paper: "#FAF9F5",
  rule: "#87867F",
  text: "#141413",
  history: "#9C9A92",
  baseline: BASELINE_INK,
};
```

### E3 CHART_THEME 与中性色阶

用纸色、格线色和墨色建立画面的轻重层次。

**要点**

- paper 是纸底，rule 是格线，text 是文字；baseline 使用品牌色作为参照。
- 背景以浅纸色为主，文字与辅助线使用不同深浅的墨色。

**注意事项**

- 给整个容器设置 opacity 会同时淡化笔触和文字；只想换纸色时，应修改背景颜色。

#### CHART_THEME

`src/recovered/palette.jsx:18–24` · 7 行

```jsx
let CHART_THEME = {
  paper: "#FAF9F5",
  rule: "#87867F",
  text: "#141413",
  history: "#9C9A92",
  baseline: BASELINE_INK,
};
```

#### 21 级中性色阶

`src/styles/foundation-2.css:180–223` · 44 行

```css
  --color-slate-1000: #0f0f0e;
  --color-slate-950: #141413;
  --color-slate-900: #1a1918;
  --color-slate-850: #1f1e1d;
  --color-slate-800: #262624;
  --color-slate-750: #30302e;
  --color-slate-700: #3d3d3a;
  --color-slate-650: #4d4c48;
  --color-slate-600: #5e5d59;
  --color-slate-550: #73726c;
  --color-slate-500: #87867f;
  --color-slate-450: #9c9a92;
  --color-slate-400: #b0aea5;
  --color-slate-350: #c2c0b6;
  --color-slate-300: #d1cfc5;
  --color-slate-250: #dedcd1;
  --color-slate-200: #e8e6dc;
  --color-slate-150: #f0eee6;
  --color-slate-100: #f5f4ed;
  --color-slate-050: #faf9f5;
  --color-slate-000: #fff;
  --color-clay: #d97757;
  --color-oat: #e3dacc;
  --color-olive: #788c5d;
  --color-cactus: #bcd1ca;
  --color-sky: #6a9bcc;
  --color-heather: #cbcadb;
  --color-fig: #c46686;
  --color-coral: #ebcece;
  --color-tint-10: #1919191a;
  --color-tint-20: #19191933;
  --color-focus: #2c84db;
  --color-error: #bf4d43;
  --color-dark: #0f0f0e;
  --color-light: #fff;
  --color-slate-dark: #141413;
  --color-slate-medium: #3d3d3a;
  --color-slate-light: #5e5d59;
  --color-cloud-dark: #87867f;
  --color-cloud-medium: #b0aea5;
  --color-cloud-light: #d1cfc5;
  --color-ivory-dark: #e8e6dc;
  --color-ivory-medium: #f0eee6;
  --color-ivory-light: #faf9f5;
```

### E4 字体与字号 scale

对比正文、说明和代码各自使用的字体与字号。

**要点**

- Serif 用于文章文字，Sans 用于说明与控件，Mono 用于代码与数字。
- 字体缺失的字形由系统字体补齐，例如中文和部分块元素。
- Fallback 在字体未加载时提供替代显示，度量调整用于减少布局变化。

**注意事项**

- 更换字体后，重新检查字距、换行和文字占据的空间。

#### 三族 @font-face 与 fallback 度量覆盖

`src/styles/foundation-1.css:2–67` · 66 行

高亮的是 sans 的 fallback 定义：三行覆写决定了加载前后行高是否一致。

```css
   字体族名沿用本地的 anthropicSans / anthropicSerif / anthropicMono，
   但权重范围、fallback 的 local() 列表与度量覆盖全部照抄 claude.dev 的原站声明 ——
   fallback 是否指向等宽字体直接决定 ░ ▒ ▓ 这类块元素字符由谁渲染。 */

@font-face {
  font-family: anthropicSans;
  src: url("/assets/fonts/AnthropicSans_Roman_Web-s.p.1e3n6bt4oqimz.woff2")
    format("woff2");
  font-weight: 300 800;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: anthropicSans;
  src: url("/assets/fonts/AnthropicSans_Italic_Web-s.p.212cqpul8-axk.woff2")
    format("woff2");
  font-weight: 300 800;
  font-display: swap;
  font-style: italic;
}
@font-face {
  font-family: anthropicSans Fallback;
  src: local(Arial), local(ArialMT), local(Liberation Sans), local(LiberationSans);
  font-weight: 300 500;
  ascent-override: 95.2%;
  descent-override: 25%;
  line-gap-override: 0%;
  size-adjust: 104%;
}
@font-face {
  font-family: anthropicSans Fallback;
  src: local(Arial Bold), local(Arial-BoldMT), local(Liberation Sans Bold),
    local(LiberationSans-Bold);
  font-weight: 600 800;
  ascent-override: 99.75%;
  descent-override: 26.2%;
  line-gap-override: 0%;
  size-adjust: 99.24%;
}
@font-face {
  font-family: anthropicSans Fallback;
  src: local(Arial Italic), local(Arial-ItalicMT), local(Liberation Sans Italic),
    local(LiberationSans-Italic);
  font-weight: 300 500;
  font-style: italic;
  ascent-override: 95.2%;
  descent-override: 25%;
  line-gap-override: 0%;
  size-adjust: 104%;
}
@font-face {
  font-family: anthropicSans Fallback;
  src: local(Arial Bold Italic), local(Arial-BoldItalicMT),
    local(Liberation Sans Bold Italic), local(LiberationSans-BoldItalic);
  font-weight: 600 800;
  font-style: italic;
  ascent-override: 99.78%;
  descent-override: 26.2%;
  line-gap-override: 0%;
  size-adjust: 99.22%;
}
@font-face {
  font-family: anthropicSans Fallback Roboto;
  src: local(Roboto), local(Roboto Regular), local(Roboto-Regular);
  font-weight: 300 500;
  ascent-override: 95.23%;
```

#### 字号与间距变量

`src/styles/foundation-2.css:224–330` · 107 行

```css
  --sp-2: 2px;
  --sp-4: 4px;
  --sp-6: 6px;
  --sp-8: 8px;
  --sp-12: 12px;
  --sp-16: 16px;
  --sp-20: 20px;
  --sp-24: 24px;
  --sp-32: 32px;
  --sp-36: 36px;
  --sp-40: 40px;
  --sp-48: 48px;
  --sp-56: 56px;
  --sp-64: 64px;
  --sp-80: 80px;
  --sp-96: 96px;
  --sp-128: 128px;
  --sp-200: 200px;
  --spacer-01: 4px;
  --spacer-02: 8px;
  --spacer-03: 12px;
  --spacer-04: 16px;
  --spacer-05: 24px;
  --spacer-06: 32px;
  --spacer-07: 40px;
  --spacer-08: 48px;
  --spacer-09: 64px;
  --spacer-10: 80px;
  --spacer-11: 96px;
  --spacer-12: 128px;
  --br-2: 2px;
  --br-4: 4px;
  --br-6: 6px;
  --br-8: 8px;
  --br-12: 12px;
  --br-16: 16px;
  --br-24: 24px;
  --br-32: 32px;
  --border-xs: 0.5px;
  --border-sm: 1px;
  --border-md: 1.5px;
  --border-lg: 2px;
  --breakpoint-mobile: 567px;
  --breakpoint-tablet: 992px;
  --breakpoint-desktop: 1024px;
  --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
  --weight-text-regular: 400;
  --weight-text-medium: 500;
  --weight-text-semibold: 600;
  --weight-text-bold: 700;
  --weight-display-regular: 400;
  --weight-display-medium: 500;
  --weight-display-semibold: 600;
  --weight-display-bold: 700;
  --weight-mono-regular: 400;
  --leading-100: 100%;
  --leading-110: 110%;
  --leading-120: 120%;
  --leading-125: 125%;
  --leading-140: 140%;
  --leading-155: 155%;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-max: 1000px;
  --gap-xxs: 4px;
  --gap-xs: 12px;
  --gap-sm: 16px;
  --gap-md: 24px;
  --gap-lg: 32px;
  --gap-xl: 48px;
  --container-max-width: 1400px;
  --page-margins: 32px;
  --gutter: 24px;
  --section-spacer-lg: 64px;
  --section-spacer-sm: 32px;
  --section-spacer-0: 0;
  --media-max-width: 880px;
  --media-max-height: 560px;
  --text-column-max-width: 640px;
  --card-padding-xs: 12px;
  --card-padding-sm: 16px;
  --card-padding-md: 24px;
  --card-padding-lg: 48px;
  --display-1: 42px;
  --display-2: 36px;
  --headline-1: 32px;
  --headline-2: 30px;
  --headline-3: 28px;
  --headline-4: 23px;
  --headline-5: 20px;
  --headline-6: 17px;
  --body-large-1: 22px;
  --body-large-2: 20px;
  --body-1: 19px;
  --body-2: 17px;
  --body-3: 15px;
  --body-4: 12px;
  --mono: 15px;
  --caption: 14px;
  --micro: 10px;
  --display-xs: 18px;
  --display-s: 22px;
```

## 6 组合：零件怎么长成组件

把基础元素放回组件，看它们如何一起工作。

### F1 扇形绽放 —— 首屏那 180 条曲线

让多条曲线从窄缝展开，尾部逐渐断续。

**要点**

- 曲线使用固定的随机数据，重播时保持同一种形状。
- 尾部增加笔触间隙，形成断续效果，而不是只降低透明度。
- linePitch 越小，轨迹通常越多；达到条数上限后，不再继续增加。

#### 曲线族与默认参数

`src/recovered/HeroChart.jsx:34–91` · 58 行

高亮处：固定种子的 LCG、终点值的幂分布、曲率，以及每条线的三个哈希属性 d / j / family。

```jsx
let a7 = (() => {
  let e = 0x1352770,
    t = () => (e = (0x41c64e6d * e + 12345) % 0x80000000) / 0x80000000,
    a = [];
  for (let e = 0; e < 180; e++) {
    let s = e / 179,
      l = t(),
      o = 2.3 + 11.6 * Math.pow(0.82 * s + 0.18 * l, 2.1),
      r = 0.9 + 1.9 * Math.pow(s, 1.4) + 0.25 * l,
      n = o > 6 ? "fast" : o > 3.5 ? "central" : "slow",
      i = [];
    for (let e = 0; e <= 26; e++) {
      let t = e / 26;
      i.push([2026 + 4 * t, 2.2 + (o - 2.2) * Math.pow(t, r)]);
    }
    a.push({
      end: o,
      curve: r,
      pts: i,
      d: 0.55 * s + 0.45 * t(),
      j: t(),
      family: n,
    });
  }
  return a;
})();
let a9 =
  (a8.baseline,
  a8.baseline,
  a8.slow,
  a8.central,
  a8.fast,
  [3.6, 1.15, 1, 1, 1.2].reduce((e, t) => [...e, e[e.length - 1] + t], [0]));
a9[a9.length - 1];
let se = () => () => {};
let st = a7.map((e, t) => t).sort((e, t) => a7[e].end - a7[t].end);
let sa = a7[st[0]].end;
let ss = a7[st[st.length - 1]].end;
let sl = {
  fanReach: 0.99,
  linePitch: 1.9,
  spacing: 1,
  fullRuns: 0.22,
  tailShare: 0.28,
  curveSoft: 1,
  bloom: 2.7,
  fanLen: 1,
  startGap: 0,
  startSpread: 0.18,
  startHide: 40,
  startFeather: 0,
  drawMs: 3600,
  laneStagger: 0.28,
  laneSpan: 0.6,
  laneSpanVar: 0.32,
  wobble: 0,
  opacity: 1,
};
```

#### 扇形布局

`src/recovered/HeroChart.jsx:216–322` · 107 行

高亮处：张角与绽放跨度的推导、左右交替与车道位置、以及把尾部单独交给一组更松的干笔参数。

```jsx
    h = React.useMemo(
      () =>
        (function (e, t, a, s, l = false) {
          let o = t / 2,
            r = 0 + s.startGap,
            n = r - s.startHide,
            i = Math.max(1, s.fanLen * a - n),
            d = a5(i / 1.15, t * (l ? 1.3 * s.fanReach : s.fanReach), 2.2 * t),
            c = Math.min(i, 1.15 * d),
            u = s.bloom,
            h = c / 5.28,
            m = Math.pow(1.32, u) + s.startSpread,
            p = d / 2 / m,
            f = (e) => n + (e - 2026) * h,
            g = s.wobble,
            x = a5(
              Math.round((2 * p * m) / (4.3 * Math.max(0.2, s.linePitch))),
              16,
              a7.length,
            ),
            _ = Array.from(
              {
                length: x,
              },
              (e, t) =>
                st[x > 1 ? Math.round((t * (a7.length - 1)) / (x - 1)) : 0],
            ),
            y = 0;
          return {
            runs: _.map((e, t) => {
              let a = a7[e],
                l = (Math.floor(t / 2) + 0.5) / Math.ceil(x / 2),
                r =
                  ((0.5 + a5((a.end - sa) / (ss - sa), 0, 1) * (x - 1)) / x) *
                    (1 - s.spacing) +
                  l * s.spacing,
                n =
                  (t % 2 == 0 ? -1 : 1) *
                  a5(r + (a3(9.1 * e + 4.4) - 0.5) * 0.012, 0, 1.02),
                i =
                  (a3(2.7 * e + 5) < s.fullRuns
                    ? 1
                    : 0.5 + 0.5 * Math.pow(a3(4.41 * e + 8.7), 0.8)) * 1.32,
                d = i * s.startFeather * a3(1.37 * e + 3.3),
                c = u + (a.curve - u) * (1 - s.curveSoft),
                m = n * s.startSpread * p,
                _ = (e) => o + n * p * Math.pow(e, c),
                w = (t, a) => {
                  let s = a5(
                      Math.round(
                        Math.hypot(4 * (a - t) * h, Math.abs(_(a) - _(t))) / 24,
                      ),
                      12,
                      60,
                    ),
                    l = [];
                  for (let o = 0; o <= s; o++) {
                    let r = t + (o / s) * (a - t),
                      n = 2026 + 4 * r,
                      i = a5(r / 0.12, 0, 1);
                    l.push([
                      f(n) + (a4(8.3 * e + 3.1 * n + 5) - 0.5) * g * i,
                      _(r) + m + (a4(4.7 * e + 2.3 * n) - 0.5) * g * i,
                    ]);
                  }
                  return l;
                },
                b = 0.87 + 0.26 * a.j,
                v = pickPaletteShade(
                  SCENARIO_PALETTES[a.family],
                  a3(3.7 * e + 1.9),
                ),
                k = a3(7.77 * e + 0.9),
                M = Math.max(0.396, i - 1.32 * s.tailShare),
                j = [
                  ...at(w(d, M), {
                    width: 4.3 * b,
                    color: v,
                    seed: 13 * e + 1,
                    dashLength: 6.2 + 1.6 * k,
                    gap: 5.4 + 1.6 * k,
                    opacity: s.opacity,
                    samples: 160,
                  }),
                  ...at(w(M, i), {
                    width: 4.3 * b * 0.9,
                    color: v,
                    seed: 13 * e + 4,
                    dashLength: 5.5 + 1.5 * k,
                    gap: 12 + 9 * k,
                    opacity: 0.8 * s.opacity,
                    samples: 80,
                  }),
                ];
              y += j.length;
              return {
                key: e,
                pieces: j,
              };
            }),
            centerY: o,
            clipX: r,
            marks: y,
          };
        })(s.w, s.h, r, sl, n),
      [s.w, s.h, 0, r, sl, n],
    ),
```

### F2 比例横条 `ShareStrokes`

用色条长度表达份额，再加渐变和笔触质感。

**要点**

- 份额按容器宽度换算成长度，widthFraction 控制整体比例。
- 颜色分界带一点固定偏移，表面再叠一层笔触，避免整齐平滑的电脑色条。

#### ShareStrokes 全文

`src/recovered/ShareStrokes.jsx:8–150` · 143 行

高亮处：为每条笔触生成渐变，三个 stop 的位置就是三种颜色的分界。

```jsx
function ShareStrokes({
  cents,
  todayCents,
  widthFraction,
  sizeLabel,
  sizeAt = "row-end",
  sizeCut = "caption-2",
  outlined = false,
  seed = 0,
  splitGap = 0,
  anchorFraction,
}) {
  let h = React.useRef(null),
    m = React.useId().replace(/[^a-zA-Z0-9_-]/g, ""),
    p = useScrollDraw(h),
    f = Math.round(cents),
    g = Math.max(0, Math.round(todayCents) - f),
    x = Math.max(0, Math.round(splitGap)),
    _ = Math.max(0, p - x),
    y = Math.max(0, Math.round(_ * widthFraction)),
    w = y / 100,
    b = y + x,
    v = 97.3 * seed + 3,
    k = f * w,
    M = (f + g) * w + x,
    j = "",
    S =
      y > 2
        ? ag(
            0,
            0,
            b,
            46,
            (e) => {
              let t = `shs-${m}-${e}`,
                a = (hashNoise(v + 7.7 * e) - 0.5) * 2,
                s = (hashNoise(v + 7.7 * e + 5.9) - 0.5) * 2,
                l = (hashNoise(v + 7.7 * e + 3.1) - 0.5) * 2,
                o = (e) => Math.max(0, Math.min(1, e / Math.max(1, b))),
                r = o(k + a),
                n = x > 0 ? Math.max(r, o(k + x + s)) : r,
                i = Math.max(n, o(M + l));
              j +=
                `<linearGradient id="${t}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${b}" y2="0"><stop offset="${r.toFixed(4)}" stop-color="var(--stroke-labour)"/>` +
                (x > 0
                  ? `<stop offset="${r.toFixed(4)}" stop-color="var(--stroke-labour)" stop-opacity="0"/><stop offset="${n.toFixed(4)}" stop-color="var(--stroke-moved)" stop-opacity="0"/>`
                  : "") +
                `<stop offset="${n.toFixed(4)}" stop-color="var(--stroke-moved)"/>` +
                `<stop offset="${i.toFixed(4)}" stop-color="var(--stroke-moved)"/>` +
                `<stop offset="${i.toFixed(4)}" stop-color="var(--stroke-capital)"/>` +
                "</linearGradient>";
              return `url(#${t})`;
            },
            {
              seed: v,
              paper: "#FAF9F5",
              endScatter: 0.3,
            },
          ).join("")
        : "",
    N =
      x > 0
        ? ax(0, 0, k, 46, {
            color: NEUTRAL_INK,
            seed: v,
            paper: "#FAF9F5",
          }) +
          ax(k + x, 0, b - k - x, 46, {
            color: NEUTRAL_INK,
            seed: v + 11,
            paper: "#FAF9F5",
          })
        : ax(0, 0, b, 46, {
            color: NEUTRAL_INK,
            seed: v,
            paper: "#FAF9F5",
          }),
    A = S ? `<defs>${j}</defs>` + S + N : "",
    T =
      null != anchorFraction
        ? Math.max(0, Math.round(_ * anchorFraction - k))
        : 0;
  return (
    <span className={shareStrokesStyles.barLine}>
      <span
        className={shareStrokesStyles.track}
        ref={h}
        style={
          T
            ? {
                "--anchor-inset": `${T}px`,
              }
            : undefined
        }
      >
        <svg
          className={
            outlined
              ? `${shareStrokesStyles.bar} ${shareStrokesStyles.outlined}`
              : shareStrokesStyles.bar
          }
          width={b}
          height={46}
          viewBox={`0 0 ${Math.max(1, b)} 46`}
          style={{
            overflow: "visible",
          }}
          aria-hidden={true}
        >
          {y > 0 && A && (
            <g
              filter={`url(#${MARKER_FILTER_ID})`}
              style={{
                isolation: "isolate",
                mixBlendMode: "multiply",
              }}
              dangerouslySetInnerHTML={{
                __html: A,
              }}
            />
          )}
        </svg>
        {sizeLabel && "bar-end" === sizeAt && (
          <span
            className={`${shareStrokesStyles.size} ${"caption-1" === sizeCut ? shareStrokesStyles.sizeUp : ""} ${shareStrokesStyles.sizeBarEnd}`}
            style={{
              left: b + 14,
            }}
          >
            {sizeLabel}
          </span>
        )}
      </span>
      {sizeLabel && "row-end" === sizeAt && (
        <span
          className={`${shareStrokesStyles.size} ${"caption-1" === sizeCut ? shareStrokesStyles.sizeUp : ""}`}
        >
          {sizeLabel}
        </span>
      )}
    </span>
  );
}
```

### F3 首字下沉 `DropCap`

把水彩裁成字母，做成文章开头的大首字。

**要点**

- 先测量字形占据的范围，再用 clipPath 把水彩裁成这个字形。
- 水彩比字形略大，保证裁切后边缘仍被填满。

**注意事项**

- 等字体就绪后再测量，否则字形范围可能不准。

#### DropCap 全文

`src/recovered/DropCap.jsx:14–91` · 78 行

高亮处：测量字形包围盒，以及用 <text> 作 clipPath。

```jsx
function DropCap({ letter = "A" }) {
  let t = React.useRef(null),
    [a, s] = React.useState(null);
  React.useEffect(() => {
    let a = true,
      l = () => {
        let l = t.current;
        if (!a || !l) return;
        let o = getComputedStyle(l).fontFamily,
          r = document.createElement("canvas").getContext("2d");
        if (!r) return;
        r.font = `700 92px ${o}`;
        let n = r.measureText(letter),
          i = n.actualBoundingBoxLeft + n.actualBoundingBoxRight,
          d = n.actualBoundingBoxAscent + n.actualBoundingBoxDescent;
        i > 0 &&
          d > 0 &&
          s({
            x: -n.actualBoundingBoxLeft,
            y: 92 - n.actualBoundingBoxAscent,
            w: i,
            h: d,
          });
      };
    "u" > typeof document && document.fonts?.ready
      ? document.fonts.ready.then(l)
      : l();
    return () => {
      a = false;
    };
  }, [letter]);
  let l = a ? Math.round((64 * a.w) / a.h) : null,
    o = `efx-dropcap-${letter}`;
  return (
    <span className={dropCapStyles.drop} ref={t}>
      <span className={a ? dropCapStyles.sr : dropCapStyles.glyph}>
        {letter}
      </span>
      {a && null != l && (
        <svg
          className={dropCapStyles.art}
          style={{
            width: l,
          }}
          viewBox={`${a.x} ${a.y} ${a.w} ${a.h}`}
          aria-hidden={true}
        >
          <clipPath id={o}>
            <text className={dropCapStyles.glyphType} x={"0"} y={92}>
              {letter}
            </text>
          </clipPath>
          <g filter={`url(#${MARKER_FILTER_ID})`}>
            <g
              clipPath={`url(#${o})`}
              dangerouslySetInnerHTML={{
                __html:
                  '<g class="mk" style="mix-blend-mode:multiply"><g opacity="0.94">' +
                  ag(a.x - 4, a.y - 4, a.w + 8, a.h + 8, l0, {
                    seed: l1,
                    color: lZ,
                    paper: "#FAF9F5",
                  }).join("") +
                  "</g>" +
                  ax(a.x - 4, a.y - 4, a.w + 8, a.h + 8, {
                    seed: l1,
                    color: lZ,
                    paper: "#FAF9F5",
                  }) +
                  "</g>",
              }}
            />
          </g>
        </svg>
      )}
    </span>
  );
}
```

### F4 尺寸变化与重绘 `useScrollDraw`

改变容器宽度，让笔触按新尺寸重新绘制。

**要点**

- ResizeObserver 发现尺寸变化；useScrollDraw 返回当前宽度，供笔触生成器使用。
- 在视口附近启用测量，用 requestAnimationFrame 合并更新，减少重复处理。

#### scroll-hooks.jsx 全文

`src/recovered/scroll-hooks.jsx` · 97 行

```jsx
// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import { lv } from "./model-series.jsx";
function lk(e, t = {}) {
  return lM(e, t, false);
}
function lM(e, t, a) {
  let {
      threshold: s = 1,
      margin: l = "200px 0px",
      initial: o = lv,
      box: r = "border",
    } = t,
    [n, i] = React.useState(o),
    d = React.useRef({
      threshold: s,
      margin: l,
      widthOnly: a,
      model: r,
    });
  d.current = {
    threshold: s,
    margin: l,
    widthOnly: a,
    model: r,
  };
  React.useEffect(() => {
    let t = e.current;
    if (!t) return;
    let a = 0,
      s = false,
      l = true,
      o = false,
      r = () => {
        a = 0;
        let e = t.getBoundingClientRect(),
          s = e.width;
        if ("content" === d.current.model) {
          let e = getComputedStyle(t);
          s -=
            parseFloat(e.paddingLeft || "0") +
            parseFloat(e.paddingRight || "0");
        }
        let r = Math.max(0, Math.round(s)),
          n = d.current.widthOnly ? 0 : Math.round(e.height);
        l = false;
        let c = !o;
        o = true;
        i((e) => {
          let t = d.current.threshold;
          return (!c && Math.abs(e.w - r) < t && Math.abs(e.h - n) < t) ||
            (e.w === r && e.h === n)
            ? e
            : {
                w: r,
                h: n,
              };
        });
      },
      n = () => {
        if (!s) {
          l = true;
          return;
        }
        a || (a = requestAnimationFrame(r));
      },
      c = new ResizeObserver(n);
    if ((c.observe(t), "u" < typeof IntersectionObserver)) {
      s = true;
      n();
      return () => {
        cancelAnimationFrame(a);
        c.disconnect();
      };
    }
    let u = new IntersectionObserver(
      ([e]) => {
        (s = e.isIntersecting) && l && n();
      },
      {
        rootMargin: d.current.margin,
      },
    );
    u.observe(t);
    return () => {
      cancelAnimationFrame(a);
      u.disconnect();
      c.disconnect();
    };
  }, [e]);
  return n;
}
function useScrollDraw(e, t = {}) {
  return lM(e, t, true).w;
}
export { lk, lM, useScrollDraw };

```

### F5 交错入场

错开各元素的出现时间，让入场不那么机械。

**要点**

- hashNoise 根据元素编号决定延迟，同样的元素保持同样的入场顺序。
- 延迟写进各元素的 CSS 变量，由 transition-delay 控制，不需要逐个切换状态。

#### TaskPasses 的交错

`src/recovered/TaskBundleStage.jsx:269–309` · 41 行

高亮处：两个 CSS 变量都是 hashNoise 算出来的，不是随机数。

```jsx
function TaskPasses({ passes, weather, ink }) {
  let s = it(ink);
  return (
    <g
      style={{
        isolation: "isolate",
        ...("current" === ink
          ? null
          : {
              color: s,
            }),
      }}
    >
      {passes.map((e, t) => (
        <g
          className={taskFieldStyles.sline}
          style={{
            "--dd": `${Math.round(110 * iI(t))}ms`,
            "--de": `${Math.round((1 - iI(t)) * 110)}ms`,
          }}
          dangerouslySetInnerHTML={{
            __html: e,
          }}
          key={t}
        />
      ))}
      {weather ? (
        <g
          className={taskFieldStyles.sline}
          style={{
            "--dd": "110ms",
            "--de": "0ms",
          }}
          dangerouslySetInnerHTML={{
            __html: weather,
          }}
        />
      ) : null}
    </g>
  );
}
```

### F6 手绘方框与铅笔光标

给方框和鼠标光标加入手绘细节。

**要点**

- 方框各边用断续笔触绘制，保留轻微的粗细和位置变化。
- 光标用内联 SVG 画成铅笔；热点决定哪个位置对应鼠标的点击点。

#### l6 手绘方框

`src/recovered/DropCap.jsx:106–125` · 20 行

```jsx
function l6(e, t, a, s, l, o = l3) {
  return makeRuleStroke(
    [
      [e, t],
      [e + a, t + 1],
      [e + a + 1, t + s / 2],
      [e + a, t + s],
      [e, t + s - 1],
      [e - 1, t + s / 2],
      [e, t + 1],
    ],
    {
      width: 2.6,
      color: o,
      seed: l,
      dashLength: 9,
      gap: 5.5,
    },
  );
}
```

#### r4 铅笔光标

`src/recovered/CapabilityGrid.jsx:51–54` · 4 行

```jsx
let r4 = (e) => {
  let t = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g transform="rotate(38 6 26)"><path d="M2 9.5Q2 8 3.5 8h5Q10 8 10 9.5V24l-4 5-4-5z" fill="${e}" stroke="#3c3733" stroke-width="1" stroke-linejoin="round"/><rect x="2" y="12" width="8" height="5" fill="#fffdf8" fill-opacity=".7"/><path d="M2 24h8" stroke="#3c3733" stroke-width="1" stroke-opacity=".55"/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(t)}") 4 28, crosshair`;
};
```

## 7 装配：逐层组成画面

逐层查看网格、笔触、滤镜与文字的作用。

### G1 八层装配

逐层加入网格、笔触、滤镜和文字，组成示意画面。

**要点**

- 这里展示一组简化的组合，不是完整原页，也不是浏览器的执行步骤。
- 分段改变笔触形状，滤镜改变颗粒和边缘，multiply 改变重叠处的颜色。
- 文字单独叠在上面，不参与笔触的混合效果。

### G2 笔触的生成过程

用输入点和参数生成笔触，查看对应的工作原理。

**要点**

- 输入点描述骨架，参数控制粗细、收笔和随机变化。
- makeMarkerStroke 返回 SVG 片段，at 返回一组分段片段，最终放进 svg 容器中显示。

**注意事项**

- 示例只说明绘制过程；容器、CSS 和滤镜定义需要另外配合。

### G3 性能账

看原页如何复用图形、合并更新和分批绘制。

**复用结果**

- 预先生成一组任务方块，再用 `<use>` 重复引用，避免每格都重新生成。
- `tD` 从噪声表取值，避免重复计算正弦。

**减少更新**

- 把同一帧的多次尺寸通知合并处理，减少重复测量。
- 曲线分批加入画面，避免在同一帧生成全部笔触。

#### tile 生成与池化

`src/recovered/TaskBundleStage.jsx:192–233` · 42 行

高亮处：viewBox 边长 = 1.4 倍格子、以及 24 个 tile 的 id 生成规则。

```jsx
let it = (e) => ("current" === e ? "currentColor" : ie[e]);
let ia = `${-0.2 * TASK_CELL_SIZE} ${-0.2 * TASK_CELL_SIZE} ${1.4 * TASK_CELL_SIZE} ${1.4 * TASK_CELL_SIZE}`;
let is = (e) => ((e % 24) + 24) % 24;
let il = (e, t = "tile") => `efx-task-${t}-${is(e)}`;
let io = {
  fill: 1,
  scale: 2,
};
function ir(e, t, a, s = io) {
  let l = TASK_CELL_SIZE * s.scale,
    o = af(e),
    r = (e) => e - Math.round(e * s.fill),
    n = ag(0, 0, l, l, (e, s) => (e < r(s) ? t : a), {
      seed: o,
      paper: CHART_THEME.paper,
    }),
    i = ax(0, 0, l, l, {
      color: t,
      seed: o,
      paper: CHART_THEME.paper,
    });
  return {
    passes: n,
    split: r(n.length),
    weather: i,
    mark: l,
    offset: -(l - TASK_CELL_SIZE) / 2,
  };
}
let id = {
  color: "#87867F",
  opacity: 0.3,
  edgeY: 44,
  edgeX: 64,
  edgeShort: 130,
};
let ic = (e) => 3 * e + 1;
let iu = (e) => 3 * e;
let ih = (e, t) => (t + 512) * 1024 + (e + 512);
let im = (e, t) => ih(ic(e), iu(t));
let ip = new Set();
for (let e = 0; e < 20; e++) ip.add(`${ic(e % 4)},${iu(Math.floor(e / 4))}`);
```

## 8 源码索引

工程里的真实文件，页面可单独复制或整体带走；这里是清单与职责。

- `src/recovered/drawing-noise.jsx` · 166 行 — 噪声基座 + 手绘路径生成器：hashNoise、tD 查表、tU 墨色、makeHandDrawnLine。
- `src/recovered/drawing-strokes.jsx` · 207 行 — 马克笔三层合成（主体 / core / streaks）、干笔分段 at、滤镜工厂 makeLiteFilter。
- `src/recovered/drawing-strokes-2.jsx` · 10 行 — 干笔 / 细线两种输出的薄包装，分出带 multiply 混合与不带两种用法。
- `src/recovered/drawing-grid.jsx` · 351 行 — 纸张网格（ar/an）、网格挖洞避让（au）、墨块渐变色块（ao）、贝塞尔上下边界（as）。
- `src/recovered/drawing-tasks.jsx` · 303 行 — 水彩铺色 a_、值噪声斑块 aL、52px 任务方格、中性/增强/自动化三色分配。
- `src/recovered/palette.jsx` · 38 行 — 三档情景色板（蓝/绿/品红各 4 阶）、语义墨水色、CHART_THEME。
- `src/recovered/question-specs-2.jsx` · 366 行 — createSeededRandom（mulberry32）与 createSeededNormal（平滑插值序列）。
- `src/recovered/HeroChart.jsx` · 424 行 — 首屏扇形绽放：180 条种子化轨迹、弧面展开、rAF 增量补画、滚出即清空。
- `src/recovered/ShareStrokes.jsx` · 152 行 — 比例横条：按容器宽度实时重算笔触，三段 linearGradient 上色。
- `src/recovered/DropCap.jsx` · 127 行 — 首字下沉：canvas measureText 量字形 → clipPath 裁水彩；手绘方框 l6。
- `src/recovered/scroll-hooks.jsx` · 97 行 — useScrollDraw：ResizeObserver + IntersectionObserver + rAF 合并，把容器宽度直接喂给笔触生成器。
- `src/recovered/SectionLaborShare.jsx` · 204 行 — MarkerFilters：mk-marker / mk-dry / mk-rule 三档噪点滤镜与移动端 lite 版。
- `src/recovered/TaskBundleStage.jsx` · 780 行 — 任务方块舞台：defs 池化 24 个 tile、passes/weather 分层、CSS 变量交错入场。
- `src/recovered/SectionHero.jsx` · 123 行 — 首屏布局：ResizeObserver 把文案边界换算给图表，尊重 prefers-reduced-motion。
- `src/recovered/CapabilityGrid.jsx` · 589 行 — 可拖拽画预测的方格纸，内含手绘铅笔 data-URI 光标。
- `src/recovered/EconomicFutures.jsx` · 247 行 — 页面装配：章节顺序、状态共享、MARKER_FILTER_ID 注入点。
- `src/styles/foundation-1.css` · 195 行 — 三个字体族的 @font-face 与 fallback 度量覆盖（ascent/descent/size-adjust）。
- `src/styles/foundation-2.css` · 709 行 — 设计变量：slate 色阶、间距、圆角、字号 scale、ivory/slate 主题。
