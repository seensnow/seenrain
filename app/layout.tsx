import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL('https://seensnow.github.io/seenrain/'),
  title: '雪人工坊',
  description: '雪人工坊的个人空间，记录项目、笔记和日常想法。',
  openGraph: {
    title: '雪人工坊',
    description: '记录项目、笔记和日常想法的个人空间。',
    type: 'website',
    images: [{ url: 'https://seensnow.github.io/seenrain/og-cn.png', width: 1731, height: 909, alt: '雪景中的雪人工坊' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '雪人工坊',
    description: '记录项目、笔记和日常想法的个人空间。',
    images: ['https://seensnow.github.io/seenrain/og-cn.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
