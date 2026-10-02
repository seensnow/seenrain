'use client';
import { useState, type FormEvent } from 'react';
import type { LockedPost } from './posts';
import ArticleBody from './article-body';
function decode(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
export default function LockedArticle({ encrypted }: Pick<LockedPost, 'encrypted'>) {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (!globalThis.crypto?.subtle) { setError('请通过 HTTPS 打开网站后再解锁。'); return; }
      const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: decode(encrypted.salt), iterations: encrypted.iterations, hash: 'SHA-256' },
        material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
      );
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(encrypted.iv) }, key, decode(encrypted.ciphertext));
      setContent(new TextDecoder().decode(plaintext)); setPassword('');
    } catch { setError('密码不正确，或文章无法解锁。请重试。'); }
    finally { setBusy(false); }
  }
  if (content !== null) return <><ArticleBody content={content} /><button className="blog-button" onClick={() => setContent(null)}>重新上锁</button></>;
  return <form className="blog-lock" onSubmit={unlock}>
    <p>这篇文章已上锁，请输入专属密码。</p>
    <label htmlFor="article-password">文章密码</label>
    <input id="article-password" type="password" autoComplete="off" required value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} />
    <button className="blog-button" disabled={busy}>{busy ? '正在解锁…' : '解锁阅读'}</button>
    <p role="status" aria-live="polite">{error}</p>
  </form>;
}
