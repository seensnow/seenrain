import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { root, contentDirectory, parsePost, encryptPost, configuredPassword, passwordFor, writeChanged, generatePosts } from './lib/blog.mjs';

export async function syncBlog(sourceOverride) {
  const configFile = path.join(root, '.blog-local.json');
  const stateFile = path.join(root, '.blog-sync-state.json');
  const config = JSON.parse(await fs.readFile(configFile, 'utf8').catch((error) => { if (error.code === 'ENOENT') return '{}'; throw error; }));
  const source = sourceOverride ?? config.sourceDirectory;
  if (!source) throw new Error('请先运行 npm run blog:sync -- --source "Obsidian 文章文件夹的路径"。');
  const directory = await fs.realpath(source);
  if (directory === root || directory.startsWith(root + path.sep)) throw new Error('Obsidian 原稿文件夹必须在网站仓库外，避免提交私密原稿。');
  const state = JSON.parse(await fs.readFile(stateFile, 'utf8').catch((error) => { if (error.code === 'ENOENT') return '{"slugs":[],"digests":{}}'; throw error; }));
  const entries = [];
  for (const file of await fs.readdir(directory, { withFileTypes: true })) {
    if (!file.isFile() || !file.name.endsWith('.md')) continue;
    const text = await fs.readFile(path.join(directory, file.name), 'utf8');
    if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) { console.log(`跳过没有文章信息的文件：${file.name}`); continue; }
    entries.push(parsePost(text, file.name));
  }
  if (new Set(entries.map((post) => post.slug)).size !== entries.length) throw new Error('Obsidian 文件使用了重复的 slug。');
  const previousSlugs = new Set(state.slugs);
  const digests = {};
  const planned = [];
  const sharedPassword = await configuredPassword();
  for (const post of entries.filter((post) => !post.draft)) {
    const markdown = path.join(contentDirectory, `${post.slug}.md`);
    const encryptedFile = path.join(contentDirectory, `${post.slug}.locked.json`);
    if (!previousSlugs.has(post.slug)) {
      for (const filename of [markdown, encryptedFile]) {
        if (await fs.stat(filename).then(() => true, () => false)) throw new Error(`${post.slug} 已在网站中存在，请为新文章换一个 slug。`);
      }
    }
    if (post.locked === true) {
      if (await fs.stat(markdown).then(() => true, () => false)) throw new Error(`${post.title} 曾作为公开文章导入。请先移除 content/blogs/${post.slug}.md；旧的公开版本和 Git 历史不会因上锁而消失。`);
      const digest = createHash('sha256').update(JSON.stringify([post, sharedPassword ?? null])).digest('hex');
      digests[post.slug] = digest;
      if (state.digests?.[post.slug] === digest && await fs.stat(encryptedFile).then(() => true, () => false)) continue;
      const entry = await encryptPost(post, await passwordFor(post.title));
      planned.push([encryptedFile, JSON.stringify(entry, null, 2) + '\n']);
    } else {
      const { content, ...metadata } = post;
      planned.push([markdown, matter.stringify(content + '\n', metadata)]);
    }
  }
  // Validate all inputs and collect passwords before changing published sources.
  await fs.mkdir(contentDirectory, { recursive: true });
  const activeSlugs = entries.filter((post) => !post.draft).map((post) => post.slug);
  for (const slug of previousSlugs) {
    if (!activeSlugs.includes(slug)) {
      await fs.rm(path.join(contentDirectory, `${slug}.md`), { force: true });
      await fs.rm(path.join(contentDirectory, `${slug}.locked.json`), { force: true });
    }
  }
  for (const [filename, text] of planned) {
    await writeChanged(filename, text);
    if (filename.endsWith('.md')) await fs.rm(filename.replace(/\.md$/, '.locked.json'), { force: true });
  }
  await generatePosts();
  await writeChanged(configFile, JSON.stringify({ ...config, sourceDirectory: directory }, null, 2) + '\n', { mode: 0o600 });
  await writeChanged(stateFile, JSON.stringify({ slugs: activeSlugs, digests }, null, 2) + '\n');
  console.log(`已从 Obsidian 同步 ${activeSlugs.length} 篇文章；草稿不发布。`);
}

if (process.argv[1] && await fs.realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args[0] !== '--source' || args.length !== 2)) throw new Error('用法：npm run blog:sync -- --source "文章文件夹"');
  await syncBlog(args[1]);
}
