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

## 博客

文章登记在 `app/blogs/posts.json`。公开文章保存正文；上锁文章只保存标题、路径和加密数据。每篇上锁文章使用自己的密码，以 PBKDF2（SHA-256，600,000 次）派生密钥，再通过 AES-256-GCM 加密，浏览器输入密码后解密。密码和解密正文不会持久保存。

添加上锁文章时，在终端读入密码，再运行脚本：

```zsh
read -s 'BLOG_PASSWORD?文章密码：'
export BLOG_PASSWORD
node scripts/add-locked-post.mjs /path/outside/repository/article.md article-slug '文章标题'
unset BLOG_PASSWORD
```

私密原稿放在仓库外，不要提交到 Git；密码应足够长且独特。公开标题请避免包含私密信息。修改登记后重新构建发布即可。
