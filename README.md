# 运势卡牌测试游戏

打开 `index.html` 即可游玩，不需要安装依赖。

规则：

- 使用 54 张扑克牌：52 张普通牌加小王、大王。
- 测试者生日的年、月、日、时各抽一张，共四张，代表“命运底色”。
- 预测时间的年、月、日、时各抽一张，共四张，代表“变化运势”。
- 8 张牌按年、月、日、时顺序展开今日运势。
- 生日四张牌只由生日年月日时决定，同一个生日输入会保持同一组命运底色牌。
- 预测时间可以一键填入现在，也可以手动选择某一天某一小时，用来预测指定时间的运气。

素材建议放在 `assets` 文件夹里。后续如果你提供真实扑克牌图片，我可以把现在的代码牌面替换成你的图片素材。

站点说明页面：

- `about.html`：关于本站
- `how-to-play.html`：玩法说明
- `privacy.html`：隐私政策
- `contact.html`：联系方式

## 发布

这是纯静态网页游戏，可以直接发布到 GitHub Pages 或 Cloudflare Pages。

Cloudflare Pages 发布步骤见：

`DEPLOY_CLOUDFLARE.md`

## 添加左侧链接

编辑 `links.json` 即可改左侧“更多链接”。

格式：

```json
[
  {
    "title": "网站名称",
    "description": "一句说明",
    "url": "https://example.com"
  }
]
```

上传到 GitHub 后，Cloudflare Pages 会自动更新。
