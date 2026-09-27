import type { Metadata } from 'next';
import Construction from '../construction';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '博客 — 雪人工坊',
  description: '雪人工坊的文章、随笔和笔记。',
};

export default function BlogsPage() {
  return <Construction section="博客" note="文章和随笔正在整理中，稍后再来看看。" />;
}
