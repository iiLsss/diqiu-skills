#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as pause } from 'node:timers/promises';
import { createProject, readState, publicState, inbox, patchBlock, setCommentStatus, checkProject, LabError, TOPICS } from './core.mjs';
import { startStudio } from './server.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const print = value => process.stdout.write(JSON.stringify(value, null, 2) + '\n');
function usage() {
  console.log(`互动知识讲解\n\nnode scripts/lab.mjs new <project> [--lesson lesson.json]\nnode scripts/lab.mjs studio <project> [--port 4860]\nnode scripts/lab.mjs state <project>\nnode scripts/lab.mjs inbox <project> [--claim] [--wait --timeout 55]\nnode scripts/lab.mjs patch <project> --block ID --file patch.json --revision N\nnode scripts/lab.mjs done <project> --id ID --note TEXT --revision N\nnode scripts/lab.mjs check <project>\n\n批注保存当前观看状态和原文，由运行中的 当前编程助手 处理；CLI 不自动调用模型。`);
}
function parseOptions(args, allowed) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (!key.startsWith('--') || !allowed.includes(key.slice(2))) throw new LabError(`不支持参数：${key}`);
    const name = key.slice(2); if (Object.hasOwn(options, name)) throw new LabError(`重复参数：${key}`);
    if (['wait', 'claim'].includes(name)) options[name] = true;
    else { const value = args[++index]; if (!value || value.startsWith('--')) throw new LabError(`${key} 缺少值`); options[name] = value; }
  }
  return options;
}
function required(options, key) { if (!options[key]) throw new LabError(`缺少 --${key}`); return options[key]; }
async function main() {
  const [command, project, ...args] = process.argv.slice(2);
  if (!command || ['help', '--help', '-h'].includes(command)) return usage();
  if (!project || project.startsWith('--')) throw new LabError('请提供实验项目目录');
  switch (command) {
    case 'new': {
      const options = parseOptions(args, ['lesson']);
      const lesson = options.lesson ? path.resolve(options.lesson) : path.join(directory, '../data/lesson.json');
      const state = createProject(project, JSON.parse(fs.readFileSync(lesson, 'utf8')));
      return print({ ok: true, revision: state.revision, project: path.resolve(project) });
    }
    case 'studio': {
      const options = parseOptions(args, ['port']);
      const { server, url } = await startStudio(project, { port: options.port === undefined ? 4860 : Number(options.port) });
      print({ ok: true, url, message: '仅本机访问；批注由运行中的 当前编程助手 处理' });
      const stop = () => server.close(() => process.exit(0));
      process.once('SIGINT', stop); process.once('SIGTERM', stop); return;
    }
    case 'state': parseOptions(args, []); return print(publicState(readState(project)));
    case 'check': parseOptions(args, []); return print(checkProject(project));
    case 'inbox': {
      const options = parseOptions(args, ['wait', 'timeout', 'claim']);
      const timeout = options.timeout === undefined ? 55 : Number(options.timeout);
      if (!Number.isFinite(timeout) || timeout < 0 || timeout > 55) throw new LabError('--timeout 应为 0～55 秒');
      const deadline = Date.now() + timeout * 1000;
      for (;;) {
        const result = inbox(project, options.claim);
        if (result.comments.length || !options.wait || Date.now() >= deadline) return print({ ...result, timedOut: !!options.wait && !result.comments.length });
        await pause(Math.min(500, Math.max(0, deadline - Date.now())));
      }
    }
    case 'patch': {
      const options = parseOptions(args, ['block', 'file', 'revision']);
      const changes = JSON.parse(fs.readFileSync(required(options, 'file'), 'utf8'));
      return print(publicState(patchBlock(project, Number(required(options, 'revision')), required(options, 'block'), changes)));
    }
    case 'done': {
      const options = parseOptions(args, ['id', 'note', 'revision']);
      return print(publicState(setCommentStatus(project, Number(required(options, 'revision')), required(options, 'id'), 'done', required(options, 'note'))));
    }
    default: throw new LabError(`未知命令：${command}；使用 --help 查看帮助`);
  }
}
main().catch(error => { console.error(JSON.stringify({ error: error.message, ...(error.status ? { status: error.status } : {}) })); process.exitCode = 1; });
