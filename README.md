# diqiu-skills

个人使用的 Agent Skills 汇总仓库，用于整理、存档和分享可复用的工作流能力。

## 当前 Skills

### `guarded-delivery`

面向软件项目和代码变更的风险自适应交付 skill。它会根据任务风险选择合适的执行级别，并在实现前确认项目边界、现有约定和验证方式。

适用场景：

- 新建软件项目或新的架构边界
- 现有项目中的功能开发、修复、重构和架构调整
- 需要结合项目约束、分阶段交付和真实验证的工程任务

核心能力：

- 按风险将任务分为 Fast、Guarded 或 Gated
- 区分新项目与现有项目的交付方式
- 保留现有项目约定，避免无关重构
- 根据变更类型选择测试、构建、类型检查和界面验证
- 对不可逆操作、公开契约、安全边界和部署影响提高验证要求
- 诚实记录已验证、未验证和仍存在的风险

使用方式：

```text
使用 $guarded-delivery 实现这个请求。
```

也可以直接描述任务，由 Agent 根据 skill 的触发条件决定是否使用。

### `adapt-frontend-project`

低频、显式调用的前端仓库发现与适配 skill。它用于在高不确定性前先识别真实工程约定，再用一个代表性垂直切片验证后续方案。

适用场景：

- 接手陌生前端仓库，需要识别真实工程规范
- 初始化或标准化缺少基础能力的前端项目
- 新增跨状态、请求、组件和测试的代表性功能
- 需要先用一个垂直切片验证工程方案

不适用场景：

- 普通页面开发、单文件修改或样式调整
- 范围明确的小 Bug
- 已有清晰模式的常规功能

使用方式：

```text
使用 $adapt-frontend-project 探索这个前端仓库，并先验证一个代表性垂直切片。
```

### `interactive-knowledge`

把知识点或已有讲解制作成可运行的互动知识网页，支持操作验证、预测、按位置批注、定点修改和项目导出。包含独立 Node.js 20+ 模板、初始化脚本和模型及后端测试，无需安装 npm 包。

使用方式：

```text
使用 $interactive-knowledge，面向小学生，把“冰为什么浮在水上？”做成能互动、能批注修改的讲解，跑起来看看。
```

安装后的使用与运行方式见 [使用说明](interactive-knowledge/README.md)，执行规则见 [Skill 说明](interactive-knowledge/SKILL.md)。它用于互动知识作品；普通经营报告和纯知识问答不在此 Skill 范围内。

## 唯一数据源与本机入口

本仓库是 `interactive-knowledge` 的唯一维护源，GitHub `main` 保存已提交版本。本机各客户端通过软链接使用当前仓库检出中的同一份文件，不再维护安装副本。修改在本仓库进行，验证后提交并推送；其他机器通过 `git pull --ff-only` 更新。生成的用户项目放在仓库之外。

在仓库根目录执行以下命令，可为尚未安装该 Skill 的机器建立入口（已有同名目录时命令会停止，应先核对，避免覆盖）：

```sh
(
for entry in "$HOME/.agents/skills/interactive-knowledge" "$HOME/.codex/skills/interactive-knowledge" "$HOME/.gemini/config/skills/interactive-knowledge"; do
  if [ -e "$entry" ] || [ -L "$entry" ]; then
    printf '已有入口，请先核对：%s\n' "$entry"
    exit 1
  fi
done
mkdir -p "$HOME/.agents/skills" "$HOME/.codex/skills" "$HOME/.gemini/config/skills"
ln -s "$PWD/interactive-knowledge" "$HOME/.agents/skills/interactive-knowledge" &&
ln -s "$HOME/.agents/skills/interactive-knowledge" "$HOME/.codex/skills/interactive-knowledge" &&
ln -s "$HOME/.agents/skills/interactive-knowledge" "$HOME/.gemini/config/skills/interactive-knowledge"
)
```

DeepSeek Harness 使用共享入口 `~/.agents/skills`；Codex 和 Antigravity 使用各自入口。仓库移动后需要更新共享软链接。模板运行要求 Python 3 和 Node.js 20+。

## 目录结构

```text
.
├── README.md
├── adapt-frontend-project/
│   ├── SKILL.md                 # Skill 主说明与执行流程
│   ├── agents/openai.yaml       # Agent 展示信息与默认提示词
│   ├── assets/governance/       # 工程规范与 Agent 适配模板
│   ├── references/              # 新建、既有项目和标准化流程
│   └── scripts/                 # 项目上下文扫描工具
├── guarded-delivery/
│   ├── SKILL.md                 # Skill 主说明与执行流程
│   ├── agents/openai.yaml       # Agent 展示信息与默认提示词
│   └── references/              # 风险路由、项目模式和验证门槛
└── interactive-knowledge/
    ├── README.md                # 使用、运行与维护说明
    ├── SKILL.md                 # 互动知识作品工作流
    ├── agents/openai.yaml       # Agent 展示信息
    ├── assets/starter/          # 独立可运行模板与测试
    ├── references/              # 互动设计、模板契约与批注改稿
    └── scripts/init_demo.py     # 初始化独立项目
```

## Skill 目录约定

每个 skill 独立放在根目录下，并至少包含：

- `SKILL.md`：名称、触发描述和完整工作流
- `agents/openai.yaml`：面向 Agent 的展示信息
- `references/`：仅在需要拆分详细规则时使用
- `assets/` 与 `scripts/`：按需提供可复用模板和受控辅助工具

新增 skill 时，请同步更新本 README 的“当前 Skills”和目录结构说明。

## 维护原则

- 内容优先服务个人实际使用和复用
- 保持每个 skill 的边界清晰，避免重复覆盖
- 只记录已验证的命令、路径和项目事实
- 对未验证内容、环境限制和剩余风险明确标注
