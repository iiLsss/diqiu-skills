import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const BLOCK_IDS = ['intro', 'experiment', 'why', 'challenge', 'limits'];
export const TOPICS = ['custom'];
import { ANCHORS, validateView as validateInteraction } from '../web/model.mjs';
function topicOf(content) { return content.topic ?? 'custom'; }
function validateTopic(topic) { if (!TOPICS.includes(topic)) fail('不支持的知识主题'); return topic; }
const STATUSES = ['open', 'working', 'done', 'stale'];
const clone = value => structuredClone(value);
const now = () => new Date().toISOString();

export class LabError extends Error {
  constructor(message, status = 400) { super(message); this.name = 'LabError'; this.status = status; }
}
const fail = (message, status) => { throw new LabError(message, status); };
function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label}必须是对象`);
}
function text(value, label, max = 180, allowEmpty = false) {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim()) || value.length > max) fail(`${label}应为${allowEmpty ? '至多' : '1～'}${max}字的文字`);
  return value.trim();
}
function keysOnly(value, keys, label) {
  if (Object.keys(value).some(key => !keys.includes(key))) fail(`${label}包含不支持的字段`);
}
function finiteRange(value, min, max, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(`${label}必须是 ${min}～${max} 的有限数字`);
  return value;
}
export function validateView(raw, topic = 'custom') {
  object(raw, 'view'); validateTopic(topic);
  try { return validateInteraction(raw); }
  catch (error) { fail(error.message || '观看参数无效'); }
}
export function validateContent(raw) {
  object(raw, 'content'); keysOnly(raw, ['title', 'blocks', 'topic'], 'content');
  if ('topic' in raw) validateTopic(raw.topic);
  const title = text(raw.title, '课程标题', 120);
  if (!Array.isArray(raw.blocks) || raw.blocks.length !== BLOCK_IDS.length) fail('必须包含 5 个固定讲解区块');
  const blocks = raw.blocks.map((item, index) => {
    object(item, '区块'); keysOnly(item, ['id', 'title', 'body'], '区块');
    if (item.id !== BLOCK_IDS[index]) fail(`区块顺序或 ID 错误，应为 ${BLOCK_IDS.join('、')}`);
    return { id: item.id, title: text(item.title, '区块标题'), body: text(item.body, '区块说明', 12000, true) };
  });
  return { title, blocks, ...("topic" in raw ? { topic: raw.topic } : {}) };
}
function targetBlock(state, id) {
  const block = state.content.blocks.find(item => item.id === id);
  if (!block) fail('未找到目标讲解区块', 404);
  return block;
}
function validateAnchor(blockId, anchor, topic = 'custom') {
  validateTopic(topic);
  if (!ANCHORS.includes(anchor)) fail('不支持的批注对象');
  if (anchor !== 'block' && blockId !== 'experiment') fail('画面对象批注必须关联实验区块');
  return anchor;
}
function statePath(project) { return path.join(path.resolve(project), 'project.json'); }
function atomicWrite(file, value) {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  try { fs.writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 }); fs.renameSync(temporary, file); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}
function withLock(project, action) {
  const lock = path.join(path.resolve(project), '.lab.lock');
  let handle;
  try { handle = fs.openSync(lock, 'wx', 0o600); }
  catch (error) {
    if (error.code === 'EEXIST') fail('项目正在保存，请稍后重试。如果进程已异常退出，确认没有写入任务后再移除 .lab.lock。', 409);
    throw error;
  }
  try { fs.writeFileSync(handle, String(process.pid)); return action(); }
  finally { fs.closeSync(handle); fs.unlinkSync(lock); }
}
export function readState(project) {
  let state;
  try { state = JSON.parse(fs.readFileSync(statePath(project), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') fail('未找到 project.json，请先运行 new 创建实验项目', 404); throw error; }
  if (state.schemaVersion !== 1 || !Number.isSafeInteger(state.revision) || state.revision < 1 || !state.content || !Array.isArray(state.comments) || !Array.isArray(state.history)) fail('项目状态格式不正确');
  return state;
}
export function publicState(state) {
  // Deliberately whitelist persisted fields so a copied token or path is never exported.
  const { schemaVersion, revision, updatedAt, content, comments, history } = state;
  return { schemaVersion, revision, updatedAt, content, comments, history };
}
export function createProject(project, raw) {
  const content = validateContent(raw);
  fs.mkdirSync(path.resolve(project), { recursive: true });
  return withLock(project, () => {
    if (fs.existsSync(statePath(project))) fail('项目已存在，new 不会覆盖已有内容', 409);
    const state = { schemaVersion: 1, revision: 1, updatedAt: now(), content, comments: [], history: [] };
    fs.mkdirSync(path.join(path.resolve(project), '.history'), { recursive: true });
    atomicWrite(statePath(project), state); return state;
  });
}
export function mutate(project, revision, reason, action) {
  if (!Number.isSafeInteger(revision) || revision < 1) fail('必须提供当前整数 revision');
  return withLock(project, () => {
    const before = readState(project);
    if (before.revision !== revision) fail(`版本冲突：当前为 v${before.revision}，请求为 v${revision}。请核对最新内容后重试。`, 409);
    if (before.revision === Number.MAX_SAFE_INTEGER) fail('版本号已达到上限');
    const next = clone(before); action(next);
    validateContent(next.content);
    const historyDir = path.join(path.resolve(project), '.history'); fs.mkdirSync(historyDir, { recursive: true });
    atomicWrite(path.join(historyDir, `${before.revision}.json`), before);
    next.history = [...before.history, { revision: before.revision, createdAt: before.updatedAt, reason: `${reason}前的快照` }];
    next.revision = before.revision + 1; next.updatedAt = now();
    atomicWrite(statePath(project), next); return next;
  });
}
export function patchBlock(project, revision, id, changes) {
  object(changes, 'changes'); keysOnly(changes, ['title', 'body'], 'changes');
  if (!Object.keys(changes).length) fail('请提供 title 或 body');
  const values = {};
  if ('title' in changes) values.title = text(changes.title, '标题');
  if ('body' in changes) values.body = text(changes.body, '说明', 12000, true);
  return mutate(project, revision, `编辑区块 ${id}`, state => Object.assign(targetBlock(state, id), values));
}
export function addComment(project, revision, blockId, anchor, message, rawView) {
  const value = text(message, '批注', 4000);
  return mutate(project, revision, `批注 ${blockId}/${anchor}`, state => {
    const target = targetBlock(state, blockId);
    const topic = topicOf(state.content), view = validateView(rawView, topic);
    validateAnchor(blockId, anchor, topic);
    state.comments.push({ id: randomUUID(), blockId, anchor, text: value, status: 'open', createdAt: now(), baseRevision: revision,
      snapshot: { title: target.title, body: target.body }, view });
  });
}
export function setCommentStatus(project, revision, id, status, note) {
  if (!['open', 'working', 'done'].includes(status)) fail('批注状态不支持');
  const value = note === undefined ? undefined : text(note, '处理说明', 4000, status !== 'done');
  if (status === 'done' && !value) fail('完成批注必须填写处理说明');
  return mutate(project, revision, `批注状态 ${status}`, state => {
    const comment = state.comments.find(item => item.id === id);
    if (!comment) fail('未找到批注', 404);
    if (comment.status === 'stale' && status !== 'open') fail('内容已恢复，该批注需先重新打开并核对原上下文', 409);
    comment.status = status; comment.updatedAt = now();
    if (status === 'open') delete comment.note;
    if (value !== undefined) comment.note = value;
    // Original snapshot, baseRevision and view remain immutable even after reopening.
  });
}
export function restoreContent(project, revision, targetRevision) {
  if (!Number.isSafeInteger(targetRevision) || targetRevision < 1) fail('无效历史版本');
  return mutate(project, revision, `恢复内容 v${targetRevision}`, state => {
    if (!state.history.some(item => item.revision === targetRevision)) fail('历史版本不存在', 404);
    const snapshot = JSON.parse(fs.readFileSync(path.join(path.resolve(project), '.history', `${targetRevision}.json`), 'utf8'));
    state.content = validateContent(snapshot.content);
    for (const comment of state.comments) { comment.status = 'stale'; comment.updatedAt = now(); }
  });
}
export function inbox(project, claim = false) {
  let state = readState(project);
  if (claim) {
    const comment = state.comments.find(item => item.status === 'open');
    if (!comment) return { revision: state.revision, comments: [] };
    state = setCommentStatus(project, state.revision, comment.id, 'working');
    return { revision: state.revision, comments: state.comments.filter(item => item.id === comment.id).map(item => ({ ...item, current: clone(targetBlock(state, item.blockId)) })) };
  }
  return { revision: state.revision, comments: state.comments.filter(item => ['open', 'working'].includes(item.status)).map(item => ({ ...item, current: clone(targetBlock(state, item.blockId)) })) };
}
export function checkProject(project) {
  const state = readState(project); validateContent(state.content);
  const ids = new Set();
  for (const comment of state.comments) {
    targetBlock(state, comment.blockId); validateAnchor(comment.blockId, comment.anchor, topicOf(state.content)); validateView(comment.view, topicOf(state.content));
    if (!STATUSES.includes(comment.status)) fail('批注状态不正确');
    text(comment.id, '批注 ID', 80); text(comment.text, '批注', 4000);
    if (ids.has(comment.id)) fail('批注 ID 重复'); ids.add(comment.id);
    if (!Number.isSafeInteger(comment.baseRevision) || comment.baseRevision < 1 || comment.baseRevision >= state.revision) fail('批注版本不正确');
    object(comment.snapshot, 'snapshot'); text(comment.snapshot.title, '原文标题'); text(comment.snapshot.body, '原文说明', 12000, true);
    if (comment.status === 'done') text(comment.note, '处理说明', 4000);
  }
  const revisions = new Set();
  for (const entry of state.history) {
    if (!Number.isSafeInteger(entry.revision) || entry.revision < 1 || entry.revision >= state.revision || revisions.has(entry.revision)) fail('历史版本不正确');
    revisions.add(entry.revision);
    if (!fs.existsSync(path.join(path.resolve(project), '.history', `${entry.revision}.json`))) fail(`历史快照 v${entry.revision} 缺失`);
  }
  return { ok: true, revision: state.revision, blocks: state.content.blocks.length, comments: state.comments.length, history: state.history.length };
}
