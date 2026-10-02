import type { Metadata } from 'next';
import SiteSidebar from './site-sidebar';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: '雪人工坊' };

export default function Home() {
  return (
    <main className="site-shell sketch-shell">
      <SiteSidebar />

      <div className="sketch-content">
        <section className="sketch-section about-section" id="about">
          <header>
            <h2>关于我</h2>
          </header>
          <div className="about-writing-box">
            <p className="writing-label">关于我的介绍</p>
            <div className="writing-lines" aria-hidden="true"><i /><i /><i /></div>
            <p className="writing-hint">这里会记录我的经历、兴趣，以及雪人工坊背后的故事。</p>
          </div>
        </section>

        <section className="sketch-section academic-section" id="academic">
          <header>
            <h2>学习经历</h2>
          </header>
          <div className="academic-box">
            <article>
              <div className="academic-row"><strong>剑桥大学</strong><span>2025–2028</span></div>
              <p>BA (Hons) 工程</p>
            </article>
            <article>
              <div className="academic-row"><strong>深圳国际交流书院</strong><span>2021–2025</span></div>
              <p>4A* · 年级排名第二</p>
            </article>
          </div>
        </section>

        <footer className="sketch-footer">
          <span>雪人工坊</span>
          <span>深圳 · UTC+08</span>
          <a href="mailto:1817144508@qq.com" aria-label="发送邮件至 1817144508@qq.com">1817144508@qq.com</a>
          <span>2026</span>
        </footer>
      </div>
    </main>
  );
}
