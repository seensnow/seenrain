import type { Metadata } from 'next';
import SiteSidebar from '../site-sidebar';
import { posts } from './posts';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '博客 — 雪人工坊',
  description: '雪人工坊的文章、随笔和笔记。',
};

export default function BlogsPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <main className="site-shell">
    <SiteSidebar active="博客" />
    <div className="blog-stage">
      <header className="blog-heading"><p>Blogs</p><h1>文章与随笔</h1></header>
      {(['public', 'locked'] as const).map((visibility) => {
        const entries = posts.filter((post) => post.visibility === visibility);
        return <section className="blog-section" key={visibility}>
          <h2>{visibility === 'public' ? '公开文章' : '上锁文章'}</h2>
          <p className="blog-description">{visibility === 'public' ? '可以直接阅读。' : '需要文章的专属密码才能阅读。'}</p>
          {entries.length ? entries.map((post) => <a className="blog-card" href={`${basePath}/blogs/${post.slug}/`} key={post.slug}>
            <span className="blog-badge">{visibility === 'public' ? '公开' : '上锁'}</span>
            <h3>{post.title}</h3><span className="blog-read">{visibility === 'public' ? '阅读文章' : '输入密码阅读'} →</span>
          </a>) : <p className="blog-empty">暂时没有上锁文章。</p>}
        </section>;
      })}
    </div>
  </main>;
}
