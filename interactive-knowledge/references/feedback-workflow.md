# 按批注定点修改

以下命令从生成项目根目录执行，project 参数通常为 demo。先检查现有项目及未提交改动，不重新初始化。

```sh
node scripts/lab.mjs inbox demo
node scripts/lab.mjs inbox demo --claim
```

claim 一次领取最早的一条 open，改成 working，并返回更新后的 revision、anchor、view、snapshot 和 current。其他已领取的 working 需用不带 claim 的 inbox 查看；不要把 claim 返回空列表解释为全部完成。若需要等新批注，`inbox demo --wait --timeout 55` 最长等待 55 秒。

核对批注时原文与当前内容，判断旧意见是否仍适用。只修改对应区块的 title/body，将实际补丁写成 JSON 文件：

```json
{"body":"修改后的正文"}
```

```sh
node scripts/lab.mjs patch demo --block why --file output/patch.json --revision <current-revision>
node scripts/lab.mjs done demo --id <comment-id> --note "具体改了什么" --revision <new-revision>
node scripts/lab.mjs check demo
```

patch 成功会递增 revision；done 要用 patch 返回的新 revision。版本冲突时重新读 state/inbox，核对变化再重做补丁，不能盲目递增 revision 或重复覆盖。未完成修改不要标 done。图形/行为修改先按 view 复现并改对应源码，再验证，最后完成批注。

CLI 的 state/export 没有会话 token。HTTP 写入使用 /api/state 返回的会话 token，并校验 Host/Origin；不要把 token 写进项目、文档或截图。测试 HTTP 时从实际运行的服务获取 token。

用户草稿冲突的两种行为不同：批注允许显式确认后采用最新原文与当前观看参数；正文只能由用户核对合并或明确选择丢弃草稿载入。不要用自动刷新掩盖冲突。先前保存请求返回时，期间继续输入的文字也必须保留。
