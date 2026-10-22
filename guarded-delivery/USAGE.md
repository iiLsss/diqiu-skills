# Guarded Delivery 使用说明

`guarded-delivery` 用于在软件开发过程中平衡 AI 的实现自由与工程风险控制。它不会让所有需求都执行同一套重型流程，而是先判断项目状态和变更风险，再选择 Fast、Guarded 或 Gated 通道。

## 1. 适用场景

适合：

- 创建新软件项目；
- 在现有项目中实现功能；
- 修复缺陷或进行局部重构；
- 新增业务模块；
- 修改状态、接口、数据或部署架构；
- 希望 AI 自动建立或维护项目级 `AGENTS.md`；
- 希望在代表性功能验证后再批量实现需求。

不需要用于单纯的知识问答、代码解释或不涉及项目变更的讨论。

## 2. 安装位置

当前目录中的 `guarded-delivery/` 是可移植的技能源码。复制整个目录，不要只复制 `SKILL.md`，否则按需引用和 UI 元数据会丢失。

### Codex 用户级安装

将目录复制到：

```text
~/.agents/skills/guarded-delivery/
```

安装后应包含：

```text
~/.agents/skills/guarded-delivery/
├── SKILL.md
├── USAGE.md
├── agents/
│   └── openai.yaml
└── references/
    ├── existing-project.md
    ├── gate-catalog.md
    ├── new-project.md
    ├── project-guardrails.md
    └── risk-routing.md
```

### Codex 仓库级安装

只希望某个仓库使用时，复制到：

```text
<repository>/.agents/skills/guarded-delivery/
```

### Claude Code 用户级安装

将目录复制到：

```text
~/.claude/skills/guarded-delivery/
```

### Claude Code 项目级安装

复制到：

```text
<repository>/.claude/skills/guarded-delivery/
```

`agents/openai.yaml` 是 Codex 的可选 UI 元数据；Claude Code 可以忽略它，不影响 `SKILL.md` 和 references 的使用。

如果安装后没有出现技能，重新打开会话，并通过 Codex 或 Claude Code 的技能列表确认是否被发现。

## 3. 基本调用

### Codex

```text
使用 $guarded-delivery 完成当前需求。
```

### Claude Code

```text
/guarded-delivery 完成当前需求。
```

技能描述支持隐式匹配，但在重要项目、重大变更或首次使用时，建议显式调用，避免与其他开发技能的触发范围重叠。

## 4. 新项目示例

```text
使用 $guarded-delivery，根据 @requirements.md 和 @designs 完成这个项目。
```

预期行为：

1. 将新项目识别为 Gated；
2. 阅读需求、设计、接口和部署约束；
3. 选择最小合理技术方案；
4. 定义模块、状态、请求、样式和测试边界；
5. 创建可运行工程骨架和真实检查命令；
6. 根据真实工程生成暂定 `AGENTS.md`；
7. 实现一个代表性垂直切片；
8. 复查并修订项目约束；
9. 通过门禁后再分阶段实现剩余需求。

技能不会仅为了显得完整而预装未被当前需求证明必要的依赖。

## 5. 现有项目示例

```text
使用 $guarded-delivery，在现有项目中实现订单筛选和导出功能。
```

预期行为：

- 先读取现有指令、配置和最近维护的类似实现；
- 保留框架、目录、组件库、状态、请求和样式方案；
- 判断属于 Fast、Guarded 或 Gated；
- 只补充当前需求必须具备的工程能力；
- 避免无关升级、第二套同类技术和全面重构；
- 运行项目真实存在的相关检查。

## 6. 小型修改示例

```text
使用 $guarded-delivery，修复用户列表分页后筛选条件丢失的问题。
```

如果修改局部、可逆、有明确参考实现且可针对性验证，技能应选择 Fast：

```text
找到最近实现
→ 最小修改
→ 回归测试
→ 检查 diff
```

Fast 不应为了形式创建 `PLAN.md`、架构文档或新的 `AGENTS.md`。

## 7. 高风险变更示例

```text
使用 $guarded-delivery，将现有权限模型调整为组织级角色权限。
```

认证、授权、敏感数据、数据库迁移、公共接口、核心依赖和部署架构属于 Gated 硬触发项。技能应先说明：

```text
Mode: existing project / Gated
Evidence: changes authorization model and persisted role data
Boundaries: preserve current login and public API compatibility
Gates: permission tests, migration validation, recovery plan, full relevant checks
```

只有存在无法从权威资料判断的业务取舍、不可逆操作或重大兼容性差异时，才需要用户决策。

## 8. 与 Plan 和 Goal 配合

### Plan 阶段

```text
使用 $guarded-delivery，仅分析当前需求并生成风险自适应实施计划，不修改代码。
```

计划应包含：

- 新项目或现有项目；
- Fast、Guarded 或 Gated；
- 修改边界；
- 重大决策；
- 阶段退出条件；
- 需要运行的真实验证。

### 执行阶段

```text
使用 $guarded-delivery，按照已确认的 PLAN.md 实施。
```

对于长期任务，可将 Goal 保持简短，把详细状态留在文件中：

```text
/goal 按照 PLAN.md 持续完成项目，遵守 AGENTS.md 和 guarded-delivery 的风险门禁。
```

Goal 负责持续推进，`PLAN.md` 负责阶段状态，`AGENTS.md` 负责项目事实，Skill 负责风险路由。

## 9. 运行时应看到什么

开始修改前，技能应给出简洁执行声明。普通需求示例：

```text
Mode: existing project / Guarded
Evidence: adds shared server state across two routes
Boundaries: reuse current query layer; no new production dependency
Gates: targeted tests, typecheck, lint, build, UI verification
```

完成时应报告：

- 使用的项目模式和风险通道；
- 主要修改和产生的项目文档；
- 实际运行的验证及结果；
- 未运行或无法运行的验证；
- 剩余风险；
- 是否允许进入下一阶段。

## 10. 项目约束的生成原则

新项目不会一开始生成一份未经验证的超长规范。正确顺序是：

```text
需求和架构判断
→ 可运行工程骨架
→ 暂定 AGENTS.md
→ 代表性功能
→ 架构复查
→ 修订并固化 AGENTS.md
```

新项目或新架构会显式执行 Project Constraint Gate，并按实际情况创建：

```text
AGENTS.md
CLAUDE.md                         # 需要 Claude Code 兼容时
PLAN.md                           # 多阶段长期任务时
docs/
├── architecture.md
└── decisions/
    └── 0001-technical-stack.md   # 存在重大技术选择时
真实的 lint/type/test/build/check 命令
CI                                 # 项目成熟度和交付环境需要时
```

Skill 应在开始时报告：

```text
Project constraints: absent / provisional / usable / stale
Action: create / update / keep / intentionally skip
Constraint gate: required artifacts and exit criteria
```

在可修改文件的执行任务中，Skill 会直接创建适用结构，而不只是提示“建议你以后创建”。Plan-only 或只读任务则把该结构列为执行阶段的明确门禁。

现有项目只有在 Guarded/Gated 工作确实能沉淀稳定事实，或原有指令缺失、错误时，才创建或更新 `AGENTS.md`。

如果项目同时支持 Claude Code，可创建薄适配文件：

```md
@AGENTS.md

## Claude Code

仅在这里添加 Claude Code 专属要求。
```

不要分别维护两份内容相同的项目规则。

## 11. Skill 与硬门禁的边界

Skill 和项目指令属于行为指导，并不是绝对执行保证。必须稳定执行的规则应进入：

- Lint 和格式化配置；
- 类型系统；
- 自动化测试；
- 项目 `check` 命令；
- CI；
- 必要时的生命周期 Hook。

Skill 负责判断应运行哪些门禁，脚本和 CI 负责客观判断是否通过。

## 12. 维护建议

根据真实误判维护 Skill：

- 简单需求经常被送入 Gated：减少不必要硬触发项；
- 高风险任务被归入 Fast：补充明确风险信号；
- 同一条规则已由 CI 完整保证：从自然语言中删除重复说明；
- 项目产生稳定新模式：更新项目 `AGENTS.md`，不要写入通用 Skill；
- 规则仅针对某个技术栈：放入单独的专项 Skill，不要扩大主 Skill。

目标是让 Skill 保持“短路由、强边界、按需细节”，而不是逐渐变成一部通用编程手册。
