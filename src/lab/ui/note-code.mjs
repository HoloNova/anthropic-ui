// 仅标记已有技术词，不改写文字，也不推测/补充术语说明。
const PLAIN_WORDS = new Set(["AI", "SVG", "DOM", "JS", "LCG", "Serif", "Sans", "Mono", "Anthropic", "Fallback"]);
const TOKENS = /RGB 通道|<\/?[A-Za-z][\w-]*>|--[\w-]+|#[\da-fA-F]{3,8}\b|(?<![\w])(?:[A-Za-z_$][\w$-]*)(?:\.[A-Za-z_$][\w$-]*)*/g;
const MATH_TAIL = /^(?:\s*[+×*\/^=<>±≥≤−-]\s*[+-]?\d+(?:\.\d+)?%?)+/;
const MATH_PREFIX = /[+-]?\d+(?:\.\d+)?\s*[×*\/^±−+]\s*$/;
const CODE_GAP = /^[\s\d./+,=<>±×*^−(){}\[\]-]*$/;

function callEnd(text, start) {
  if (text[start] !== "(") return start;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "(") depth += 1;
    if (text[i] === ")" && --depth === 0) return i + 1;
  }
  return start;
}

function codeRanges(text) {
  const ranges = [];
  for (const match of text.matchAll(new RegExp(TOKENS))) {
    if (match.index < (ranges.at(-1)?.end ?? 0) || PLAIN_WORDS.has(match[0])) continue;
    const prefix = text.slice(0, match.index).match(MATH_PREFIX)?.[0].length ?? 0;
    const start = match.index - prefix;
    let end = match.index + match[0].length;
    end = callEnd(text, end);
    end += text.slice(end).match(MATH_TAIL)?.[0].length ?? 0;
    const previous = ranges.at(-1);
    if (previous && (start <= previous.end || CODE_GAP.test(text.slice(previous.end, start)))) {
      ranges[ranges.length - 1] = { start: previous.start, end };
    } else {
      ranges.push({ start, end });
    }
  }
  return ranges;
}

function splitNoteCode(text) {
  const parts = [];
  let cursor = 0;
  for (const { start, end } of codeRanges(text)) {
    if (start > cursor) parts.push({ text: text.slice(cursor, start), code: false });
    parts.push({ text: text.slice(start, end), code: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), code: false });
  return parts;
}

export { splitNoteCode };
