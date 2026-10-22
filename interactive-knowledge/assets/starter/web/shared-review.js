// Shared local feedback shell. Topic applications own their simulation and prose rendering.
const DEFAULT_LABELS = { intro: '开场讲解', experiment: '互动实验', why: '原理讲解', challenge: '预测与验证', limits: '适用条件' };
const STATUS_LABELS = { open: '待处理', working: '处理中', done: '已完成', stale: '待复核' };
const PHASE_LABELS = { explore: '自由探索', predict: '已作预测', revealed: '已验证' };
export async function createReview({ getView, renderContent, labels = {}, anchors = {}, describeView }) {
  if ([getView, renderContent, describeView].some(fn => typeof fn !== 'function')) throw new TypeError('createReview 需要 getView、renderContent 和 describeView');
  const names = { ...DEFAULT_LABELS, ...labels }, anchorNames = { block: '整个区块', ...anchors };
  const host = document.createElement('div'); host.className = 'lab-review';
  host.innerHTML = `<button class="lab-review-launch" type="button" aria-label="打开批注与修改">批注与修改 <span class="lab-review-count">0</span></button>
    <div class="lab-review-notice" role="status" hidden></div>
    <section class="lab-review-panel" role="dialog" aria-modal="true" aria-label="批注与修改" hidden>
      <header><div><strong>批注与修改</strong><small class="lab-review-connection">正在连接</small></div><button class="lab-review-close" type="button" aria-label="关闭批注面板">×</button></header>
      <div class="lab-review-scroll">
        <label>定位到区块<select class="lab-review-target" aria-label="批注区块"></select></label>
        <p class="lab-review-context"></p><p class="lab-review-view"></p>
        <p class="lab-review-conflict" role="alert" hidden>内容版本已更新。草稿已保留，请核对最新文字后继续。</p>
        <div class="lab-review-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-review-tab="comments">写批注</button><button type="button" role="tab" aria-selected="false" data-review-tab="edit">直接改文字</button></div>
        <div class="lab-review-comment-pane">
          <form class="lab-review-comment-form"><label>修改意见<textarea class="lab-review-comment-text" maxlength="4000" rows="4" placeholder="说明哪里需要改，以及希望怎么改。" required></textarea></label><button type="submit" class="lab-review-primary">保存批注</button><button type="button" class="lab-review-rebase">核对后，按当前版本保存</button></form>
          <p class="lab-review-help">批注保存位置、当前观察参数和原文。保存后，回到 当前编程助手 说「处理这个 demo 的批注」。网页不会自行启动 AI。</p>
          <h3>本区块批注</h3><div class="lab-review-comments"></div>
        </div>
        <div class="lab-review-edit-pane" hidden><form class="lab-review-edit-form"><label>区块标题<input class="lab-review-title" maxlength="180" required></label><label>区块正文<textarea class="lab-review-body" rows="8" maxlength="12000"></textarea></label><button type="submit" class="lab-review-primary">保存这一段</button><button type="button" class="lab-review-reload-text">放弃文字草稿，载入最新内容</button></form><p class="lab-review-help">仅更新当前区块。每次保存都会留下修改前的版本。</p></div>
        <p class="lab-review-message" role="alert" hidden></p>
        <footer><a href="/api/export" download>导出项目 JSON</a><span>内容、批注与历史索引</span></footer>
      </div>
    </section>`;
  document.body.append(host);
  const $ = selector => host.querySelector(selector), $$ = selector => [...host.querySelectorAll(selector)];
  const panel = $('.lab-review-panel'), selector = $('.lab-review-target');
  for (const [id, name] of Object.entries(names)) selector.add(new Option(name, id));
  let state, assetVersion, selected = 'experiment', anchor = 'block', commentRevision, editRevision, commentView, editDirty = false, busy = false, pendingRefresh, previousFocus;
  let commentInputVersion = 0, editInputVersion = 0;
  const dirty = () => editDirty || !!$('.lab-review-comment-text').value.trim();
  function message(value, error = false) { const el = $('.lab-review-message'); el.textContent = value; el.hidden = !value; el.classList.toggle('is-error', error); }
  function notice(value) { const el = $('.lab-review-notice'); el.textContent = value; el.hidden = !value; }
  function currentBlock() { return state?.content.blocks.find(block => block.id === selected); }
  function updateConflict() {
    $('.lab-review-conflict').hidden = !state || !((!!$('.lab-review-comment-text').value.trim() && commentRevision !== state.revision) || (editDirty && editRevision !== state.revision));
    $('.lab-review-rebase').hidden = !state || commentRevision === state.revision;
  }
  function resetEdit() {
    const block = currentBlock(); if (!block) return;
    $('.lab-review-title').value = block.title; $('.lab-review-body').value = block.body;
    editRevision = state.revision; editDirty = false; updateConflict();
  }
  function renderComments() {
    const list = $('.lab-review-comments'); list.replaceChildren();
    const comments = state.comments.filter(item => item.blockId === selected);
    if (!comments.length) { const empty = document.createElement('p'); empty.className = 'lab-review-empty'; empty.textContent = '还没有批注。'; list.append(empty); return; }
    for (const item of comments.slice().reverse()) {
      const article = document.createElement('article');
      const caption = document.createElement('div'); caption.className = 'lab-review-comment-caption';
      const status = document.createElement('span'); status.textContent = STATUS_LABELS[item.status] ?? item.status; status.className = 'lab-review-status';
      const target = document.createElement('span'); target.textContent = anchorNames[item.anchor] ?? item.anchor; caption.append(status, target);
      const prose = document.createElement('p'); prose.textContent = item.text;
      const context = document.createElement('small'); context.textContent = describeView(item.view);
      article.append(caption, prose, context);
      if (item.note) { const note = document.createElement('p'); note.className = 'lab-review-response'; note.textContent = item.note; article.append(note); }
      const details = document.createElement('details'), summary = document.createElement('summary'), original = document.createElement('p');
      summary.textContent = `查看批注时的原文 · v${item.baseRevision}`; original.textContent = `${item.snapshot.title}\n${item.snapshot.body}`; details.append(summary, original); article.append(details);
      if (item.status === 'done' || item.status === 'stale') {
        const reopen = document.createElement('button'); reopen.type = 'button'; reopen.textContent = '重新打开'; reopen.dataset.reviewReopen = item.id; article.append(reopen);
      }
      list.append(article);
    }
  }
  function renderPanel() {
    if (!state) return;
    selector.value = selected;
    $('.lab-review-context').textContent = `${names[selected] ?? selected} · ${anchorNames[anchor] ?? anchor}`;
    $('.lab-review-view').textContent = commentView ? `本次批注上下文：${describeView(commentView)}` : '';
    renderComments(); updateConflict();
  }
  function accept(next) {
    // A poll started before a save can arrive after the newer POST response.
    if (state && next.revision < state.revision) return;
    const changed = !state || state.revision !== next.revision;
    if (assetVersion && assetVersion !== next.assetVersion) notice('页面代码已更新。请先保存草稿，再刷新页面查看。');
    assetVersion = next.assetVersion; state = next;
    $('.lab-review-connection').textContent = `已保存 · v${state.revision}`;
    $('.lab-review-count').textContent = state.comments.filter(c => c.status === 'open' || c.status === 'working').length;
    if (changed) {
      renderContent(state.content);
      if (!editDirty) resetEdit();
      if (!$('.lab-review-comment-text').value.trim()) { commentRevision = state.revision; commentView = structuredClone(getView()); }
      renderPanel();
    }
  }
  async function read() {
    const response = await fetch('/api/state', { cache: 'no-store' });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || '无法读取项目'); return data;
  }
  async function refresh() {
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = (async () => {
      try { const next = await read(); accept(next); return state; }
      catch (error) { $('.lab-review-connection').textContent = '连接中断，请保留草稿'; message(error.message, true); throw error; }
      finally { pendingRefresh = null; }
    })();
    return pendingRefresh;
  }
  async function mutate(endpoint, payload) {
    if (busy) throw new Error('正在保存，请稍候');
    busy = true; $$('button[type="submit"]').forEach(button => button.disabled = true);
    try {
      const response = await fetch('/api/' + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Lab-Token': state.token }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) { if (response.status === 409 || response.status === 403) await refresh(); throw new Error(data.error || '保存失败，请保留草稿'); }
      accept(data); return data;
    } finally { busy = false; $$('button[type="submit"]').forEach(button => button.disabled = false); }
  }
  function open(blockId = 'experiment', targetAnchor = 'block') {
    if (busy) { panel.hidden = false; message('正在保存，请稍候再切换批注位置。'); return false; }
    if (!state) { notice('项目尚未加载，请稍后再试。'); return false; }
    if (!state.content.blocks.some(block => block.id === blockId)) { notice('未找到要批注的区块。'); return false; }
    if (dirty() && (selected !== blockId || anchor !== targetAnchor)) { panel.hidden = false; message('请先保存或清空当前草稿，再切换批注位置。', true); return false; }
    const preserve = dirty(); selected = blockId; anchor = targetAnchor;
    if (!preserve) { commentRevision = state.revision; commentView = structuredClone(getView()); resetEdit(); message(''); }
    previousFocus = document.activeElement; panel.hidden = false; renderPanel(); $('.lab-review-close').focus(); return true;
  }
  function close() { panel.hidden = true; previousFocus?.focus?.(); }
  $('.lab-review-launch').addEventListener('click', () => open(selected, anchor));
  $('.lab-review-close').addEventListener('click', close);
  selector.addEventListener('change', event => { if (!open(event.target.value)) selector.value = selected; });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-review]');
    if (button && !host.contains(button)) open(button.dataset.review, button.dataset.reviewAnchor || 'block');
  });
  $$('[data-review-tab]').forEach(button => button.addEventListener('click', () => {
    $$('[data-review-tab]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    $('.lab-review-comment-pane').hidden = button.dataset.reviewTab !== 'comments'; $('.lab-review-edit-pane').hidden = button.dataset.reviewTab !== 'edit';
  }));
  $('.lab-review-comment-text').addEventListener('input', () => { commentInputVersion++; updateConflict(); });
  $('.lab-review-edit-form').addEventListener('input', () => { editInputVersion++; editDirty = true; updateConflict(); });
  $('.lab-review-comment-form').addEventListener('submit', async event => {
    event.preventDefault(); const text = $('.lab-review-comment-text').value.trim(); if (!text) return;
    const submittedInputVersion = commentInputVersion;
    try {
      await mutate('comments', { revision: commentRevision, blockId: selected, anchor, text, view: commentView });
      const continuedTyping = commentInputVersion !== submittedInputVersion;
      if (!continuedTyping) { $('.lab-review-comment-text').value = ''; commentRevision = state.revision; commentView = structuredClone(getView()); }
      renderPanel();
      message(continuedTyping ? '上一条批注已保存；保存期间输入的草稿已保留，请核对当前版本后再保存。' : '批注已保存。回到 当前编程助手，请它处理这个 demo 的批注。');
    } catch (error) { message(error.message, true); }
  });
  $('.lab-review-edit-form').addEventListener('submit', async event => {
    event.preventDefault();
    const submittedInputVersion = editInputVersion;
    try {
      const saved = await mutate('patch', { revision: editRevision, blockId: selected, changes: { title: $('.lab-review-title').value, body: $('.lab-review-body').value } });
      if (editInputVersion === submittedInputVersion) { resetEdit(); message('这一段已更新，其他区块保持不变。'); }
      else { editRevision = saved.revision; updateConflict(); message('上一版文字已保存；保存期间继续输入的文字仍是未保存草稿。'); }
    }
    catch (error) { message(error.message, true); }
  });
  $('.lab-review-rebase').addEventListener('click', async () => {
    if (busy) { message('正在保存，请稍候再核对版本。'); return; }
    try { await refresh(); commentRevision = state.revision; commentView = structuredClone(getView()); renderPanel(); message('已切换为当前版本和当前观察状态；批注草稿仍保留，请核对后保存。'); }
    catch (error) { message(error.message, true); }
  });
  $('.lab-review-reload-text').addEventListener('click', async () => {
    if (busy) { message('正在保存，请稍候再载入文字。'); return; }
    try { await refresh(); resetEdit(); message('已载入最新文字。'); }
    catch (error) { message(error.message, true); }
  });
  $('.lab-review-comments').addEventListener('click', async event => {
    const button = event.target.closest('[data-review-reopen]'); if (!button || busy) return;
    try { await mutate('comment-status', { revision: state.revision, id: button.dataset.reviewReopen, status: 'open' }); message('批注已重新打开，请核对原上下文。'); }
    catch (error) { message(error.message, true); }
  });
  document.addEventListener('keydown', event => {
    if (panel.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button,input,textarea,select,a[href]')].filter(element => !element.disabled && element.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('beforeunload', event => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } });
  await refresh();
  const interval = setInterval(() => { if (!busy) refresh().catch(() => {}); }, 1800); // refresh already exposes the error in the panel.
  return { open, refresh, destroy() { clearInterval(interval); host.remove(); } };
}
