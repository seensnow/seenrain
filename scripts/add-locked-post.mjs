import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { root, contentDirectory, validSlug, encryptPost, passwordFor, writeChanged, generatePosts } from './lib/blog.mjs';

const [source, slug, title] = process.argv.slice(2);
if (!source || !title || !validSlug(slug)) throw new Error('用法：node scripts/add-locked-post.mjs <原稿路径> <slug> <标题>');
const resolved = await fs.realpath(source);
if (resolved.startsWith(root + path.sep)) throw new Error('私密原稿必须放在仓库外。');
for (const name of [`${slug}.md`, `${slug}.locked.json`]) {
  if (await fs.stat(path.join(contentDirectory, name)).then(() => true, () => false)) throw new Error('此 slug 已存在。');
}
const { content, data } = matter(await fs.readFile(resolved, 'utf8'));
const entry = await encryptPost({ slug, title, tags: Array.isArray(data.tags) ? data.tags : ['上锁文章'], content: content.trim() }, await passwordFor(title));
await writeChanged(path.join(contentDirectory, `${slug}.locked.json`), JSON.stringify(entry, null, 2) + '\n');
await generatePosts();
console.log(`已添加上锁文章：${title}`);
