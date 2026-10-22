import { DEFAULT_VIEW, validateView, calculate } from '/model.mjs';
import { createReview } from '/review.js';
const $ = id => document.getElementById(id);
let view = { ...DEFAULT_VIEW }, prediction = null;
function resetPrediction() {
  prediction = null; view.challengePhase = 'explore'; $('verify').disabled = true; $('feedback').hidden = true;
  $('prediction-status').textContent = '先选一个答案，再验证。';
  document.querySelectorAll('[data-answer]').forEach(b => b.setAttribute('aria-pressed', 'false'));
}
function render() {
  const m = calculate(view);
  $('distance').value = view.distance; $('speed').value = view.speed;
  $('distance-output').textContent = `${view.distance} 米`; $('speed-output').textContent = `${view.speed} 米/秒`;
  $('baseline-result').textContent = `${m.baselineSeconds.toFixed(1)} 秒`;
  const concealed = view.challengePhase === 'predict';
  $('result').textContent = concealed ? '先保留你的答案，验证后揭晓。' : `${m.seconds.toFixed(1)} 秒`;
  $('time-bar').style.width = `${m.ratio * 100}%`; $('time-bar').style.visibility = concealed ? 'hidden' : 'visible';
  try { sessionStorage.setItem('knowledge-view', JSON.stringify(view)); } catch {}
}
for (const id of ['distance', 'speed']) $(id).addEventListener('input', () => { resetPrediction(); view[id] = Number($(id).value); render(); });
$('reset').addEventListener('click', () => { view = { ...DEFAULT_VIEW }; resetPrediction(); render(); });
document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
  prediction = button.dataset.answer; view = { ...DEFAULT_VIEW, challengePhase: 'predict' };
  document.querySelectorAll('[data-answer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  $('verify').disabled = false; $('feedback').hidden = true; $('prediction-status').textContent = '已记下预测：验证同走 120 米、速度从 1 变为 2 米/秒。'; render();
}));
$('verify').addEventListener('click', () => {
  if (!prediction) return; view.challengePhase = 'revealed'; render();
  $('feedback').textContent = `${prediction === 'half' ? '猜对了！' : '看看对照：'}同走 120 米，1 米/秒需 120 秒，2 米/秒需 60 秒，所需时间是一半。`;
  $('feedback').hidden = false; $('verify').disabled = true; $('prediction-status').textContent = '已验证；修改参数可以重新探索。';
});
try { const stored = JSON.parse(sessionStorage.getItem('knowledge-view')); if (stored) view = { ...validateView(stored), challengePhase: 'explore' }; } catch {}
render();
document.querySelector('[role=button]').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } });
try {
  await createReview({ getView: () => ({ ...view }), describeView: v => `路程 ${v.distance} 米 · B 速度 ${v.speed} 米/秒 · ${{ explore: '自由探索', predict: '已作预测', revealed: '已验证' }[v.challengePhase]}`,
    anchors: { route: '路程', speed: '速度', result: '比较结果' },
    renderContent(content) { document.title = content.title; document.querySelector('[data-lesson-title]').textContent = content.title;
      for (const b of content.blocks) { document.querySelectorAll(`[data-title="${b.id}"]`).forEach(e => e.textContent = b.title); document.querySelectorAll(`[data-body="${b.id}"]`).forEach(e => e.textContent = b.body); }
    }
  });
} catch (error) { $('connection-error').hidden = false; $('connection-error').textContent = `批注服务未连接：${error.message}。请保留未保存的想法。`; }
