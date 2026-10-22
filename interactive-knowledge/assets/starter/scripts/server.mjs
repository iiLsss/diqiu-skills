import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { LabError, readState, publicState, patchBlock, addComment, setCommentStatus, restoreContent, validateContent } from './core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharedWeb = path.join(root, 'web');
const TYPES = { html: 'text/html; charset=utf-8', js: 'application/javascript; charset=utf-8', css: 'text/css; charset=utf-8' };
function assetFiles(topic = 'custom') {
  if (topic !== 'custom') throw new LabError('不支持的知识主题');
  return {
    '/': [path.join(sharedWeb, 'index.html'), TYPES.html],
    '/app.js': [path.join(sharedWeb, 'app.js'), TYPES.js],
    '/style.css': [path.join(sharedWeb, 'style.css'), TYPES.css],
    '/review.js': [path.join(sharedWeb, 'shared-review.js'), TYPES.js],
    '/review.css': [path.join(sharedWeb, 'shared-review.css'), TYPES.css],
    '/model.mjs': [path.join(sharedWeb, 'model.mjs'), TYPES.js],
  };
}
const BODY_LIMIT = 128 * 1024;
export function assetVersion(topic = 'custom') {
  const hash = createHash('sha256');
  for (const [route, [file]] of Object.entries(assetFiles(topic))) {
    hash.update(route);
    try { hash.update(fs.readFileSync(file)); }
    catch (error) { if (error.code === 'ENOENT') hash.update('missing'); else throw error; }
  }
  return hash.digest('hex').slice(0, 20);
}
function send(response, status, data, type = 'application/json; charset=utf-8', headers = {}) {
  response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY', ...headers });
  response.end(type.startsWith('application/json') && typeof data !== 'string' ? JSON.stringify(data) : data);
}
async function body(request) {
  if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) throw new LabError('请求必须使用 application/json', 415);
  let size = 0; const chunks = [];
  for await (const chunk of request) {
    size += chunk.length; if (size > BODY_LIMIT) throw new LabError('请求内容超过 128 KB 上限', 413); chunks.push(chunk);
  }
  try { const value = JSON.parse(Buffer.concat(chunks).toString('utf8')); if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(); return value; }
  catch { throw new LabError('请求不是有效 JSON 对象'); }
}
export function startStudio(project, { port = 4860 } = {}) {
  const initial = readState(project);
  validateContent(initial.content);
  const topic = initial.content.topic ?? 'custom', files = assetFiles(topic);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new LabError('端口应为 0～65535 的整数');
  const token = randomBytes(32).toString('hex');
  const server = http.createServer(async (request, response) => {
    try {
      const activePort = server.address().port;
      if (![ `127.0.0.1:${activePort}`, `localhost:${activePort}` ].includes(request.headers.host)) throw new LabError('仅允许通过本机地址访问', 403);
      const expectedOrigin = `http://${request.headers.host}`;
      if (request.headers.origin && request.headers.origin !== expectedOrigin) throw new LabError('拒绝跨来源请求', 403);
      if (request.headers['sec-fetch-site'] === 'cross-site') throw new LabError('拒绝跨站点请求', 403);
      const url = new URL(request.url, expectedOrigin);
      const stateResponse = state => ({ ...publicState(state), token, assetVersion: assetVersion(topic) });
      if (request.method === 'GET') {
        if (url.pathname === '/api/state') return send(response, 200, stateResponse(readState(project)));
        if (url.pathname === '/api/export') return send(response, 200, publicState(readState(project)), 'application/json; charset=utf-8', { 'Content-Disposition': `attachment; filename="${topic}-lab-project.json"` });
        if (Object.hasOwn(files, url.pathname)) {
          const [file, type] = files[url.pathname];
          return send(response, 200, fs.readFileSync(file), type,
            { 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" });
        }
        throw new LabError('未找到页面', 404);
      }
      if (request.method !== 'POST') throw new LabError('不支持的请求方式', 405);
      const supplied = request.headers['x-lab-token'];
      if (typeof supplied !== 'string' || Buffer.byteLength(supplied) !== Buffer.byteLength(token) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))) throw new LabError('会话已变化，请刷新页面', 403);
      const data = await body(request); let state;
      switch (url.pathname) {
        case '/api/comments': state = addComment(project, data.revision, data.blockId, data.anchor, data.text, data.view); break;
        case '/api/patch': state = patchBlock(project, data.revision, data.blockId, data.changes); break;
        case '/api/comment-status': state = setCommentStatus(project, data.revision, data.id, data.status, data.note); break;
        case '/api/restore': state = restoreContent(project, data.revision, data.targetRevision); break;
        default: throw new LabError('未找到操作', 404);
      }
      return send(response, 200, stateResponse(state));
    } catch (error) {
      if (!response.headersSent && !response.destroyed) send(response, error instanceof LabError ? error.status : 500,
        { error: error instanceof LabError ? error.message : '本地服务发生错误，请查看终端' });
      if (!(error instanceof LabError)) console.error(error);
    }
  });
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://localhost:${server.address().port}/` }));
  });
}
