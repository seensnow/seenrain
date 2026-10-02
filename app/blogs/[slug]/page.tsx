import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteSidebar from '../../site-sidebar';
import { posts } from '../posts';
import ArticleBody from '../article-body';
import LockedArticle from '../locked-article';
export const dynamic = 'force-static';
export const dynamicParams = false;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  return { title: post ? `${post.title} — 雪人工坊` : '文章未找到' };
}
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();
  return <main className="site-shell">
    <SiteSidebar active="博客" />
    <article className="blog-stage">
      <a className="text-link" href={`${basePath}/blogs/`}>← 返回博客</a>
      <header className="blog-heading"><p>{post.visibility === 'public' ? '公开随笔' : '上锁文章'}</p><h1>{post.title}</h1></header>
      {post.visibility === 'public' ? <ArticleBody content={post.content} /> : <LockedArticle encrypted={post.encrypted} />}
    </article>
  </main>;
}
