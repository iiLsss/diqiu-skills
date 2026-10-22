# guarded-delivery · 按风险交付软件变更

在新建项目或修改既有代码时，根据风险选择工作方式，明确项目边界、保留现有约定，并以实际验证结果判断交付状态。

## 安装

直接把下面这段话发给你使用的编程 Agent：

```text
请帮我将这个 Skill 安装到当前 Agent 的全局 Skills 目录，只安装 guarded-delivery，保留该 Skill 的完整目录及附带资源，并确认安装后可以被发现：
https://github.com/iiLsss/diqiu-skills/tree/main/guarded-delivery
```

Agent 根据自己的 Skill 安装机制完成操作。如果只想在当前项目中使用，把“全局 Skills 目录”改为“当前项目的 Skills 目录”。安装时保留 `references/`，不要只下载 `SKILL.md`。

## 使用

在目标项目的对话中说明任务、修改范围和验收要求，例如：

```text
使用 $guarded-delivery 实现这个请求，先核对现有项目约定，按风险确定修改范围和验证方式，再完成实现与相关检查。
```

适用于项目初始化、功能开发、修复、重构和架构调整。执行规则见 [SKILL.md](SKILL.md)，三种工作方式的区别如下：

| 方式 | 工作重点 |
| --- | --- |
| Fast | 沿用成熟模式完成局部改动，执行针对性验证 |
| Guarded | 先明确边界、状态归属和数据流，再完成贯通相关模块的变更与检查 |
| Gated | 先调查并记录重要决策，用代表性功能验证新架构后再扩展 |

具体风险判断见 [references/risk-routing.md](references/risk-routing.md)。Skill 不自带业务项目或通用构建命令；测试、构建和界面验收采用目标项目已有的工具与配置。交付时应说明改动、实际执行的验证、未验证项和剩余风险。

## 目录与参考资料

| 路径 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md) | Agent 执行入口 |
| [agents/openai.yaml](agents/openai.yaml) | 展示信息与默认调用提示 |
| [references/risk-routing.md](references/risk-routing.md) | 风险判断与工作方式选择 |
| [references/new-project.md](references/new-project.md) | 新项目或新架构的交付 |
| [references/existing-project.md](references/existing-project.md) | 既有项目中的变更 |
| [references/project-guardrails.md](references/project-guardrails.md) | 项目指令与长期工程约束 |
| [references/gate-catalog.md](references/gate-catalog.md) | 按变更选择验证项目 |

## 更新与维护

GitHub 仓库是唯一维护源。需要更新时，直接告诉当前 Agent：

```text
请从 https://github.com/iiLsss/diqiu-skills 更新已安装的 guarded-delivery，保留完整资源，并核对更新结果。
```

链接到仓库检出的维护环境通过 `git pull --ff-only` 更新。Skill 提供工作流程，目标项目自己的 `AGENTS.md`、工程配置和测试仍需以当前实际内容为准。
