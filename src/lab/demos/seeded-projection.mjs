// 两种形态共用同一坐标轴，给下方图例留出空间。
const SEEDED_BASELINE = 94;
const SEEDED_AMPLITUDE = 70;

function seededValueY(value) {
  return SEEDED_BASELINE - value * SEEDED_AMPLITUDE;
}

function seededSampleY(sample) {
  return seededValueY(2 * sample - 1);
}

export { SEEDED_BASELINE, seededValueY, seededSampleY };
