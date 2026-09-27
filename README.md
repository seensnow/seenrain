# 雪人工坊

雪人工坊的个人网站。源码由 GitHub 管理，静态页面通过 GitHub Pages 发布。

## 本地开发

```bash
npm ci
npm run dev
```

## 构建

```bash
GITHUB_PAGES=true GITHUB_REPOSITORY=seensnow/seenrain npm run build
```

静态文件生成在 `dist/client/`。推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。
