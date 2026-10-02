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

## 在 Obsidian 写博客

你的本机已连接 Obsidian 的 `Websites Writings` 文件夹。配置保存在不上传的 `.blog-local.json`。文章原稿在 Obsidian，公开副本在 `content/blogs/*.md`，上锁文章在仓库中只保存 `*.locked.json` 密文。`app/blogs/posts.json` 是自动生成的文件，不需要手动修改。

每篇文章顶部填写：

```yaml
---
title: 网站初建随笔
slug: first-website-notes
tags: [公开随笔]
locked: false
draft: false
---
```

下面直接写 Markdown 正文。`slug` 是网址，使用小写英文、数字和连字符，每篇唯一；改标题不需要改 slug。`tags` 可以填写多个标签。公开文章用 `locked: false`，上锁文章用 `locked: true`，写作中的文章用 `draft: true`。上锁与标签独立，不要在文件中写密码。

### 修改文章与本地预览

在 Obsidian 保存后，在网站文件夹的终端运行：

```bash
npm run blog:sync
```

已经打开的本地网站会读取更新；若尚未启动，运行 `npm run dev`，打开 http://localhost:3000/ 。同步只扫描配置文件夹直接包含的 `.md` 文件，没有文章信息的普通笔记会跳过。草稿不导入；将已发布文章设为草稿、删除原稿或修改 slug，下一次同步会移除它之前的发布副本。不会删除 Obsidian 原稿。

首次在另一台电脑连接原稿目录：

```bash
npm run blog:sync -- --source "你的 Obsidian 文章文件夹路径"
```

配置保存在本机，不会上传个人路径。

### 上锁文章

本机已配置统一文章密码，保存在被 Git 忽略的 `.blog-local.json` 的 `sharedPassword` 字段中，该文件仅当前用户可读写。所有上锁文章自动使用这个密码，同步时不再逐篇询问；修改统一密码后，下次同步会用新密码重新加密已接入的上锁文章。密码不要写在 Markdown 原稿或网站代码里。

在另一台电脑上需要重新配置本机密码；没有本机配置时可以通过 `BLOG_PASSWORD` 环境变量提供，或在终端按提示输入。

正文在本机用 PBKDF2（SHA-256，600,000 次）和 AES-256-GCM 加密后上传。密码、草稿和私密正文不进入仓库。标题、slug、标签仍公开。读者在文章页输入正确密码后才显示正文。

已公开文章改成上锁，工具会先停止并提醒你：之前发布的正文和 Git 历史不会自动变成私密，需要单独处理。

### 发布更新

```bash
npm run blog:publish
```

命令会同步原稿、构建检查、提交博客内容、推送到 GitHub，然后由 GitHub Actions 发布。仅提交 `content/blogs` 和生成的文章登记文件，不会把其他改动一起提交；如果暂存区已有修改，命令会停止。需要本机已登录 GitHub，且在 `main` 分支。

**当前正式发布前还需要在仓库设置中启用 GitHub Pages，并选择 GitHub Actions 作为来源。** 上传成功不等于部署成功，可以在仓库 Actions 页面查看部署结果。

本地预览使用 `npm run dev`；构建和启动会自动根据仓库中的文章生成页面，无需在 CI 中访问 Obsidian。
