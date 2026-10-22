# adapt-frontend-project · 前端项目发现与适配

接手陌生前端仓库，或工程方案尚不明确时，先识别实际技术栈、项目规则和代码惯例，再用一个可运行的代表性功能验证方案。该 Skill 需要通过 `$adapt-frontend-project` 显式调用。

## 安装

直接把下面这段话发给你使用的编程 Agent：

```text
请帮我将这个 Skill 安装到当前 Agent 的全局 Skills 目录，只安装 adapt-frontend-project，保留该 Skill 的完整目录及附带资源，并确认安装后可以被发现：
https://github.com/iiLsss/diqiu-skills/tree/main/adapt-frontend-project
```

Agent 根据自己的 Skill 安装机制完成操作。如果只想在当前项目中使用，把“全局 Skills 目录”改为“当前项目的 Skills 目录”。安装时保留 `scripts/`、`references/` 和 `assets/`，不要只下载 `SKILL.md`。

## 使用

在目标项目的对话中说明仓库位置、任务和允许修改的范围，例如：

```text
使用 $adapt-frontend-project 探索这个前端仓库，识别真实工程约定，再实现并验证一个最小的代表性功能。沿用现有技术栈，保留已有修改。
```

适合接手陌生仓库、初始化缺少基础能力的前端项目、明确要求的工程规范整理，以及跨状态、请求、组件和测试的方案验证。普通页面、样式调整、范围明确的小 Bug 和已有成熟模式的常规功能通常无需调用。

执行规则见 [SKILL.md](SKILL.md)。预期交付包括：有证据支持的约束与惯例、尚未确定的选择、一个贯通关键边界的功能，以及实际检查结果。扫描到文件不代表代码正确，文档也不能代替构建、业务测试和界面验收。

## 目录与参考资料

| 路径 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md) | Agent 执行入口 |
| [agents/openai.yaml](agents/openai.yaml) | 展示信息与显式调用策略 |
| [scripts/scan-project-context.sh](scripts/scan-project-context.sh) | 列出工程指令、工具链配置和工程规范文件 |
| [references/instruction-discovery.md](references/instruction-discovery.md) | 定位项目规则及其作用范围 |
| [references/brownfield.md](references/brownfield.md) | 既有项目适配 |
| [references/greenfield.md](references/greenfield.md) | 新项目初始化 |
| [references/standardize.md](references/standardize.md) | 明确要求时整理工程规范 |
| [references/representative-slice.md](references/representative-slice.md) | 选择与验证代表性功能 |
| [assets/governance/](assets/governance/) | 项目说明与工程规范模板，需按实际项目适配 |

如需手动查看扫描结果，在本 Skill 目录执行：

```sh
bash scripts/scan-project-context.sh /path/to/frontend-project
```

扫描工具依赖 Bash 和常见 Unix 工具；Git 仓库内会扫描仓库根目录，其他目录则扫描传入目录。它只列出文件，具体技术栈、命令和规则仍需读取并核对。

## 更新与维护

GitHub 仓库是唯一维护源。需要更新时，直接告诉当前 Agent：

```text
请从 https://github.com/iiLsss/diqiu-skills 更新已安装的 adapt-frontend-project，保留完整资源，并核对更新结果。
```

链接到仓库检出的维护环境通过 `git pull --ff-only` 更新；已写入业务项目的工程说明和模板不会自动同步，需结合项目实际情况维护。
