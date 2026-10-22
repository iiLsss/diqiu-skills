// DOM-free contract shared by the browser and backend. Replace for each new lesson.
export const ANCHORS = ['block', 'route', 'speed', 'result'];
export const DEFAULT_VIEW = { distance: 120, speed: 2, challengePhase: 'explore' };
export function validateView(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError('观看参数必须是对象');
  if (Object.keys(raw).some(k => !['distance', 'speed', 'challengePhase'].includes(k))) throw new TypeError('观看参数包含未知字段');
  for (const [key, min, max] of [['distance', 60, 240], ['speed', 1, 3]]) {
    if (typeof raw[key] !== 'number' || !Number.isFinite(raw[key]) || raw[key] < min || raw[key] > max) throw new TypeError(`${key} 必须在 ${min}～${max} 之间`);
  }
  if (!['explore', 'predict', 'revealed'].includes(raw.challengePhase)) throw new TypeError('预测状态无效');
  return { distance: raw.distance, speed: raw.speed, challengePhase: raw.challengePhase };
}
export function calculate(view) {
  const { distance, speed } = validateView(view);
  return { baselineSeconds: distance, seconds: distance / speed, ratio: 1 / speed };
}
