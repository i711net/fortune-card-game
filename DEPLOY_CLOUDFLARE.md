# 发布到 GitHub 和 Cloudflare Pages

## GitHub

当前文件夹 `web-game` 就是要发布的网页游戏目录。

如果 GitHub CLI 已登录，可以在 `web-game` 目录运行：

```powershell
git init
git add .
git commit -m "Initial fortune card web game"
gh repo create fortune-card-game --public --source . --remote origin --push
```

如果 `gh auth status` 提示 token 失效，先运行：

```powershell
gh auth login -h github.com
```

然后重新执行 `gh repo create ...`。

## Cloudflare Pages

推荐用 GitHub 连接 Cloudflare Pages：

1. 登录 Cloudflare Dashboard。
2. 进入 `Workers & Pages`。
3. 选择 `Create application`，再选择 `Pages`。
4. 连接 GitHub，选择 `fortune-card-game` 仓库。
5. Framework preset 选择 `None`。
6. Build command 留空。
7. Build output directory 填 `/`。
8. 点击部署。

这个项目是纯静态网页，不需要服务器、不需要数据库、不需要构建命令。

## 后续更新

修改网页后运行：

```powershell
git add .
git commit -m "Update game"
git push
```

Cloudflare Pages 会自动重新部署。
