# interactive-knowledge · 互动知识讲解

把一个知识点做成可以亲手操作的本地网页：改变条件、观察结果、验证预测，再通过批注持续修改讲解。适合日常知识、学习和科普主题；普通经营报告、纯文字问答和静态插图不在此 Skill 的范围内。

## 安装

直接把下面这段话发给你使用的编程 Agent：

```text
请帮我将这个 Skill 安装到当前 Agent 的全局 Skills 目录，只安装 interactive-knowledge，保留完整的模板、脚本和参考资料，并确认安装后可以被发现：
https://github.com/iiLsss/diqiu-skills/tree/main/interactive-knowledge
```

Agent 根据自己的 Skill 安装机制完成操作，无需你先手动克隆仓库或运行终端命令。如果只想在当前项目中使用，把“全局 Skills 目录”改为“当前项目的 Skills 目录”。

<details>
<summary>手动安装与更新（终端命令）</summary>

也可以使用 [skills CLI](https://github.com/vercel-labs/skills) 单独安装。以下命令需要 Node.js 22.20+（含 npm/npx）和 Git；生成作品另需 Python 3。

全局安装，供多个项目使用：

```sh
npx skills add iiLsss/diqiu-skills --skill interactive-knowledge --global
```

按提示选择要使用的编程助手；`--skill interactive-knowledge` 只安装这一项，不安装仓库中的其他 Skills。只用于当前项目时，在该项目根目录执行：

```sh
npx skills add iiLsss/diqiu-skills --skill interactive-knowledge
```

也可以直接指定客户端，例如仅安装到 Codex 的全局目录：

```sh
npx skills add iiLsss/diqiu-skills --skill interactive-knowledge --global --agent codex
```

查看全局安装结果，以及从 GitHub 更新这一项：

```sh
npx skills list --global
npx skills update interactive-knowledge --global
```

项目级安装使用 `npx skills list` 查看，使用 `npx skills update interactive-knowledge --project` 更新。安装后在编程助手的新对话中使用；应完整安装 Skill 目录，保留 `assets/`、`scripts/` 和 `references/`，只下载 `SKILL.md` 无法运行模板。

</details>

如果需要直接维护源码、让多个本机客户端共用同一份仓库检出，使用[仓库软链接安装方式](https://github.com/iiLsss/diqiu-skills#唯一数据源与本机入口)。已采用该方式的机器继续在仓库执行 `git pull --ff-only` 更新，无需再执行上面的安装命令。

## 在编程助手中使用

新建作品时，说明知识点、学习对象和希望理解的关系，例如：

```text
使用 $interactive-knowledge，面向小学生，把“冰为什么浮在水上？”做成能互动、能批注修改的讲解，跑起来看看。
```

已有作品需要修改时，提供项目目录和修改目标：

```text
使用 $interactive-knowledge，处理这个项目中的未完成批注，只修改对应内容，验证后保留修改记录。项目目录：<项目绝对路径>
```

Skill 的执行规则见 [SKILL.md](SKILL.md)。生成作品包含独立源码，运行不依赖 Skill 的安装目录。

## 快速运行内置范例

需要 Python 3 和 Node.js 20+，无需安装 npm 包。下面命令从本 Skill 目录执行，将「匀速行走」范例放到新建的临时目录：

```sh
knowledge_demo_dir="$(mktemp -d "${TMPDIR:-/tmp}/interactive-knowledge.XXXXXX")"
python3 scripts/init_demo.py "$knowledge_demo_dir" --example
cd "$knowledge_demo_dir"
node --test tests/*.test.mjs
node scripts/lab.mjs check demo
node scripts/lab.mjs studio demo --port 4860
```

打开终端输出的本机地址；按 `Ctrl+C` 停止服务。端口占用时改用空闲端口。

`--example` 用于体验和验收模板。正式制作新主题时，运行 `python3 scripts/init_demo.py <output-dir>`，在生成目录适配课程文字、主题模型、图形和测试后，再执行 `node scripts/lab.mjs new demo`。输出目录必须是新目录或空目录，放在 Skill 仓库之外；初始化不会覆盖已有项目。

## 批注、改稿与导出

在网页中可以直接编辑讲解文字，或针对区块、实验对象留下批注。批注会保存观看参数和原文快照；保存后回到当前编程助手的对话中交代处理，网页不会自动调用模型。

在生成项目目录运行 `node scripts/lab.mjs inbox demo` 查看待处理意见。定点修改、领取批注、版本冲突和完成标记的命令见[批注改稿流程](references/feedback-workflow.md)。修改 `data/lesson.json` 不会更新已经创建的 `demo`，已有正文通过 patch/API 修改并保留历史。

JSON 导出包含内容、批注和历史索引；完整备份需保留整个生成项目，包括 `demo/.history/` 和源码。服务只监听本机，公开部署需另行处理。

## 目录与适配入口

```text
interactive-knowledge/
├── README.md                   # 使用与运行说明
├── SKILL.md                    # 编程助手执行规则
├── agents/openai.yaml          # Agent 展示信息
├── scripts/init_demo.py        # 独立项目初始化工具
├── references/                 # 互动设计、模板契约与改稿流程
└── assets/starter/
    ├── data/lesson.json         # 课程标题与可编辑文字
    ├── web/                    # 主题模型、界面与通用批注组件
    ├── scripts/                # 存储、CLI 与本机服务
    └── tests/                  # 模型与后端测试
```

制作新主题前按需阅读[互动设计](references/interaction-design.md)和[模板契约](references/template-contract.md)。内置范例是适配参考，新主题需要自己的模型、图形和知识依据。

## 验证与维护

生成项目中的 `node --test tests/*.test.mjs` 检查模型关系、输入边界、保存历史、版本冲突和 HTTP 写入限制；`node scripts/lab.mjs check demo` 检查项目数据。浏览器中的实际操作、预测、批注保存、刷新保留和手机布局需要单独验收。

GitHub 仓库是唯一维护源，修改和提交在仓库中完成。通过 CLI 单独安装的版本使用 `npx skills update` 更新；链接到仓库检出的维护环境使用 `git pull --ff-only` 更新。已生成项目是独立副本，不会随 Skill 更新自动升级。
