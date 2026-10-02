import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import matter from 'gray-matter';

export const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const contentDirectory = path.join(root, 'content/blogs');
export const registry = path.join(root, 'app/blogs/posts.json');
export const validSlug = (slug) => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export function parsePost(text, filename) {
  const { data, content } = matter(text);
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${filename}：请填写 title。`);
  if (!validSlug(data.slug)) throw new Error(`${filename}：slug 请使用小写字母、数字和连字符。`);
  if (typeof data.locked !== 'boolean') throw new Error(`${filename}：locked 必须是布尔值：true（上锁）或 false（公开）。`);
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string'))) throw new Error(`${filename}：tags 必须是文字列表。`);
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new Error(`${filename}：draft 必须是 true 或 false。`);
  return { slug: data.slug, title: data.title.trim(), tags: data.tags ?? [], locked: data.locked, draft: data.draft ?? false, content: content.trim() };
}

export async function writeChanged(filename, text, options = {}) {
  const previous = await fs.readFile(filename, 'utf8').catch((error) => { if (error.code === 'ENOENT') return null; throw error; });
  if (previous === text) {
    if (options.mode) await fs.chmod(filename, options.mode);
    return;
  }
  await fs.mkdir(path.dirname(filename), { recursive: true });
  await fs.writeFile(`${filename}.tmp`, text, options);
  await fs.rename(`${filename}.tmp`, filename);
}

export async function encryptPost(post, password) {
  if (password.length < 12) throw new Error('上锁文章密码至少需要 12 个字符。');
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const iterations = 600000;
  const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(post.content));
  const base64 = (value) => Buffer.from(value).toString('base64');
  return { slug: post.slug, title: post.title, tags: post.tags, locked: true, encrypted: { salt: base64(salt), iv: base64(iv), ciphertext: base64(ciphertext), iterations } };
}

export async function configuredPassword() {
  const config = JSON.parse(await fs.readFile(path.join(root, '.blog-local.json'), 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return '{}';
    throw error;
  }));
  const password = config.sharedPassword ?? process.env.BLOG_PASSWORD;
  if (password !== undefined && (typeof password !== 'string' || password.length < 12)) throw new Error('统一文章密码至少需要 12 个字符。');
  return password;
}

export async function passwordFor(title) {
  const shared = await configuredPassword();
  if (shared) return shared;
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error(`「${title}」需要密码。请在终端运行同步命令。`);
  process.stdout.write(`「${title}」的密码（至少 12 位，输入不显示）：`);
  return new Promise((resolve, reject) => {
    let password = '';
    const previousRaw = process.stdin.isRaw;
    const finish = () => {
      process.stdin.setRawMode(previousRaw ?? false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      process.stdout.write('\n');
    };
    const onData = (chunk) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') { finish(); reject(new Error('已取消同步。')); return; }
        if (character === '\r' || character === '\n') { finish(); resolve(password); return; }
        if (character === '\u007f' || character === '\b') password = [...password].slice(0, -1).join('');
        else if (character >= ' ') password += character;
      }
    };
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onData);
  });
}

export async function generatePosts() {
  const files = await fs.readdir(contentDirectory);
  const posts = [];
  for (const file of files.sort()) {
    if (file.endsWith('.md')) {
      const post = parsePost(await fs.readFile(path.join(contentDirectory, file), 'utf8'), file);
      if (post.locked === true) throw new Error(`${file}：私密原稿必须放在仓库外，通过 blog:sync 加密导入。`);
      if (!post.draft) {
        posts.push({ slug: post.slug, title: post.title, tags: post.tags, locked: false, content: post.content });
      }
    } else if (file.endsWith('.locked.json')) {
      const post = JSON.parse(await fs.readFile(path.join(contentDirectory, file), 'utf8'));
      if (!validSlug(post.slug) || !post.title || post.locked !== true || !post.encrypted || 'content' in post) throw new Error(`${file}：无效的加密文章。`);
      posts.push(post);
    }
  }
  if (new Set(posts.map((post) => post.slug)).size !== posts.length) throw new Error('有文章使用了相同的 slug，请修改后重试。');
  await writeChanged(registry, JSON.stringify(posts, null, 2) + '\n');
  return posts;
}
