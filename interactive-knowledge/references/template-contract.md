# 独立模板契约

模板复制到项目后，运行只依赖 Node.js 20+；不引用本机原始 shadow-lab、Skill 安装路径或外部 CDN。`scripts/init_demo.py --example` 仅用于快速验收内置匀速范例，会另外初始化 demo；正式新主题通常不加该选项。

## 适配入口

| 文件 | 责任 |
| --- | --- |
| data/lesson.json | 课程标题与五段可编辑文字；topic 固定 custom；不要改成知识点名称 |
| web/model.mjs | 无 DOM 纯函数；导出 ANCHORS、DEFAULT_VIEW、validateView，以及本主题计算函数 |
| web/app.js | 交互状态、图形与预测逻辑、createReview 接入 |
| web/index.html / style.css | 主题布局、可访问控件与响应式图形 |
| web/shared-review.* | 通用反馈组件，通常无需修改 |
| tests/model.test.mjs | 替换为当前主题的知识关系、边界与无效输入测试 |
| tests/runtime.test.mjs | 通用保存、历史、冲突、HTTP 与隔离测试；使用当前 DEFAULT_VIEW |
| scripts/core.mjs / server.mjs / lab.mjs | 持久化、固定静态资源白名单与 CLI，通常无需修改 |

`model.mjs` 同时被浏览器及 Node 后端导入。保持纯计算，不访问 window/document、文件、网络或不受控随机。`validateView(raw)` 必须拒绝未知字段、错误类型、NaN/Infinity、越界及违反主题关系的值，返回规范化的新 JSON 对象。保留 challengePhase 的 explore/predict/revealed 三态；如主题不采用预测，维持 explore。不能只修改前端滑杆范围而忘记服务端共用校验。

`ANCHORS` 包含 block 和实际实验对象名称。非 block 的对象必须关联 experiment。文字使用 textContent 渲染，保存的内容不可作为 HTML 执行。若增加静态资源，显式添加 server.mjs 的资源映射，不开放任意文件读取。

## 反馈接入

```js
await createReview({
  getView: () => ({ ...view }),
  describeView: v => `用中文与单位描述 ${v.someParameter}`,
  anchors: { block: '整个区块', someObject: '对象名称' },
  renderContent(content) { /* 只刷新讲解文字，保留当前实验参数 */ }
});
```

`describeView` 显示给用户，需有可读标签、单位、预测状态，而不是一串内部字段名。点击入口用 `data-review="why"`；实验对象用 `data-review="experiment" data-review-anchor="someObject"`，与 ANCHORS 对应。图内键盘可聚焦的对象要响应 Enter/Space。稳定 ID 不随标题改变。

## 数据生命周期

`new demo` 用 data/lesson.json 创建 v1，拒绝覆盖。也可 `new demo --lesson <file>` 指定课文。之后更新课文文件不会修改已创建项目；正文修改需走 patch/API，保留历史。不要手写 demo/project.json 绕过机制。

源码变化时反馈面板提示保存草稿后刷新；不强行刷新用户当前实验。热加载文字不重置模拟参数。sessionStorage 可以用于本地观察状态，但不是已保存的课程内容或跨设备同步。

初版完成后，在项目内写简短的使用说明、启动命令、来源/假设与实际验证记录。初始化范例只是脚手架，用户交付物要有自己的主题模型、图形和说明。
