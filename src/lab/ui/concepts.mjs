// 仅收录用户审定的说明；新术语须先审文案，再加入这里。
const CONCEPTS = Object.freeze({
  seed: "随机序列的起始编号。使用相同种子，并按相同顺序取值，就能重复得到同一串结果。",
  tD: "从预先算好的 1024 个噪声值中取一个，省去重复计算正弦。它与 hashNoise(x) 的输入映射不同，结果不一定相同。",
  插值: "已知两个值，补出中间的过渡值。例如从粗到细，不是突然切换，而是逐渐变化。",
  smoothstep: "一种平滑过渡方式。相比直线连接，它在连接处变化得更缓。",
  重采样: "沿原折线按距离重新安排点，让后续计算不会受原始点疏密不均的影响。",
  法线: "与线条前进方向垂直的方向。沿它移动，就能把点移向线条两侧。",
  "RGB 通道": "红、绿、蓝三个分量，每个数表示对应光的强弱。",
  amount: "控制整体压暗程度。越大越暗；即使为 0，前面的通道调整也可能让结果略不同于原色。",
  值噪声: "先给格点固定的随机值，再补出格点之间的平滑变化，用来生成连续的不规则图案。",
  阈值: "判断‘这个位置是否上色’的分界值。提高这里的阈值，会让更多位置通过判断。",
  遮罩: "用一张图控制哪些位置保留、哪些位置更透明。",
  clipPath: "只保留指定形状里面的内容。例如用字母形状裁切水彩。",
});

const TERMS = /(?<![\w$])(?:seed|tD|smoothstep|amount|clipPath)(?![\w$])|RGB 通道|重采样|值噪声|插值|法线|阈值|遮罩/g;

function splitConceptTerms(text) {
  let cursor = 0;
  const parts = [];
  for (const match of text.matchAll(new RegExp(TERMS))) {
    if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
    parts.push({ text: match[0], content: CONCEPTS[match[0]] });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}

export { CONCEPTS, splitConceptTerms };
