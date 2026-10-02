import type { Metadata } from 'next';
import SiteSidebar from '../site-sidebar';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '关于我 — 雪人工坊',
  description: '雪人工坊的个人介绍，就读于剑桥大学工程专业。',
};

export default function AboutPage() {
  return (
    <main className="site-shell content-shell">
      <SiteSidebar active="关于我" />
      <section className="content-stage">
        <header className="page-header">
          <p>个人简介</p>
          <h2>关于<br /><em>雪人工坊</em></h2>
        </header>

        <div className="about-grid">
          <article className="profile-card">
            <div>
              <span className="card-label">名字</span>
              <h3>雪人工坊</h3>
              <p>学生 · 剑桥大学工程专业</p>
            </div>
            <div className="profile-draft">
              <span>介绍待补充</span>
              <p>个人介绍正在整理中。</p>
            </div>
          </article>

          <article className="info-card info-wide">
            <span className="card-label">大学</span>
            <h3>剑桥大学</h3>
            <p>BA (Hons) 工程。</p>
          </article>

          <article className="info-card">
            <span className="card-label">高中</span>
            <h3>深圳国际交流书院</h3>
            <p>4A* · 年级排名第二。</p>
          </article>

          <article className="info-card">
            <span className="card-label">所在地</span>
            <h3>深圳</h3>
            <p>UTC+08</p>
          </article>

          <article className="bio-placeholder">
            <span className="card-label">更多介绍</span>
            <p>更完整的个人介绍稍后更新。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
