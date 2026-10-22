#!/usr/bin/env python3
"""Copy the standalone starter without overwriting an existing project."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--example', action='store_true', help='also initialize the bundled constant-speed example')
    args = parser.parse_args()
    source = Path(__file__).resolve().parents[1] / 'assets' / 'starter'
    target = args.destination.expanduser()
    if target.is_symlink():
        parser.error('目标目录不能是符号链接')
    target = target.resolve()
    if target == source or source in target.parents:
        parser.error('不能在 Skill 模板内部生成项目')
    if target.exists() and (not target.is_dir() or any(target.iterdir())):
        parser.error('目标必须是新目录或空目录；不会覆盖已有项目')
    node = shutil.which('node')
    if not node:
        parser.error('需要 Node.js 20+，未找到 node')
    version = subprocess.check_output([node, '--version'], text=True).strip()
    if int(version.lstrip('v').split('.')[0]) < 20:
        parser.error('需要 Node.js 20+')
    shutil.copytree(source, target, dirs_exist_ok=True)
    if args.example:
        subprocess.run([node, str(target / 'scripts/lab.mjs'), 'new', str(target / 'demo')], check=True, capture_output=True, text=True)
    print(json.dumps({'ok': True, 'directory': str(target), 'node': version,
        'exampleInitialized': args.example,
        'next': '适配 web/model.mjs、web/app.js、web/index.html、data/lesson.json 后创建 demo；--example 仅用于模板验收'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (OSError, subprocess.CalledProcessError) as error:
        print(f'初始化失败，目标中可能有已复制文件，请核对后继续：{error}', file=sys.stderr)
        sys.exit(1)
