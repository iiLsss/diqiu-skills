import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createProject, readState, addComment, patchBlock, inbox, setCommentStatus, restoreContent, checkProject } from '../scripts/core.mjs';
import { startStudio } from '../scripts/server.mjs';
import { DEFAULT_VIEW } from '../web/model.mjs';
const lesson = JSON.parse(fs.readFileSync(new URL('../data/lesson.json', import.meta.url)));
function fixture(t) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'knowledge-runtime-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true })); createProject(dir, lesson); return dir; }
test('creation refuses overwrite; targeted patches retain all other blocks and history', t => {
  const p = fixture(t); assert.throws(() => createProject(p, lesson), /已存在/);
  const before = readState(p), after = patchBlock(p, 1, 'why', { body: '只改这一段' });
  assert.deepEqual(after.content.blocks.filter(b => b.id !== 'why'), before.content.blocks.filter(b => b.id !== 'why'));
  assert.equal(after.revision, 2); assert.equal(checkProject(p).history, 1);
  assert.throws(() => patchBlock(p, 1, 'why', { body: '旧版本覆盖' }), /版本冲突/);
  assert.equal(readState(p).content.blocks[2].body, '只改这一段');
});
test('feedback snapshots, context and claimed ownership survive edits and completion', t => {
  const p = fixture(t); const c = addComment(p, 1, 'experiment', 'block', '说明这个变化', DEFAULT_VIEW).comments[0];
  const claimed = inbox(p, true); assert.equal(claimed.comments[0].id, c.id); assert.equal(claimed.comments[0].status, 'working');
  assert.equal(inbox(p, true).comments.length, 0);
  const edited = patchBlock(p, claimed.revision, 'experiment', { body: '改后解释' });
  const done = setCommentStatus(p, edited.revision, c.id, 'done', '已改对应段落');
  assert.deepEqual(done.comments[0].view, DEFAULT_VIEW); assert.equal(done.comments[0].snapshot.body, lesson.blocks[1].body); assert.equal(done.comments[0].status, 'done');
  const restored = restoreContent(p, done.revision, 1); assert.equal(restored.comments[0].status, 'stale'); assert.deepEqual(restored.content, lesson);
});
test('HTTP write requires token and same origin; export excludes credentials and assets are whitelisted', async t => {
  const p = fixture(t); const { server, url } = await startStudio(p, { port: 0 }); t.after(() => new Promise(resolve => server.close(resolve)));
  const state = await (await fetch(url + 'api/state')).json(); assert.ok(state.token);
  const payload = JSON.stringify({ revision: 1, blockId: 'why', changes: { body: '通过 API 定点修改' } });
  const post = headers => fetch(url + 'api/patch', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: payload });
  assert.equal((await post({})).status, 403);
  assert.equal((await post({ 'X-Lab-Token': state.token, Origin: 'http://untrusted.invalid' })).status, 403);
  assert.equal((await post({ 'X-Lab-Token': state.token })).status, 200);
  const exported = await (await fetch(url + 'api/export')).json(); assert.equal(exported.token, undefined); assert.equal(exported.revision, 2);
  assert.equal((await fetch(url + 'project.json')).status, 404); assert.equal((await fetch(url + 'model.mjs')).status, 200);
});
