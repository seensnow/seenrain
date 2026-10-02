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
      <div className="blog-list">
        {posts.map((post) => <a className="blog-card" href={`${basePath}/blogs/${post.slug}/`} key={post.slug}>
          <div>
            <h2>{post.title}</h2>
            <div className="blog-tags">{(post.tags ?? [post.visibility === 'public' ? '公开随笔' : '上锁文章']).map((tag) => <span className="blog-badge" key={tag}>{tag}</span>)}</div>
            {post.visibility === 'locked' && <p className="blog-description">需要专属密码阅读</p>}
          </div>
          <span className="blog-arrow" aria-hidden="true">→</span>
        </a>)}
      </div>
    </div>
  </main>;
}
