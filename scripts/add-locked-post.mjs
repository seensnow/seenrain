import { webcrypto } from 'node:crypto';
import fs from 'node:fs/promises';
const [source, slug, title] = process.argv.slice(2);
const password = process.env.BLOG_PASSWORD;
if (!source || !slug || !title || !password || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error('Set BLOG_PASSWORD and run: node scripts/add-locked-post.mjs <markdown-path> <slug> <title>. Use a lowercase slug with hyphens.');
}
const registry = new URL('../app/blogs/posts.json', import.meta.url);
const posts = JSON.parse(await fs.readFile(registry, 'utf8'));
if (posts.some((post) => post.slug === slug)) throw new Error('This article slug already exists.');
const content = await fs.readFile(source, 'utf8');
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));
const iterations = 600000;
const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(content));
const base64 = (value) => Buffer.from(value).toString('base64');
posts.push({ slug, title, visibility: 'locked', encrypted: { salt: base64(salt), iv: base64(iv), ciphertext: base64(ciphertext), iterations } });
await fs.writeFile(registry, JSON.stringify(posts, null, 2) + '\n');
console.log(`Added locked article: ${title}`);
