import type { Metadata } from 'next';
import SiteSidebar from '../site-sidebar';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '项目 — 雪人工坊',
  description: '雪人工坊的个人项目。',
};

const projects = [
  { title: 'Simple Reader', type: '应用', description: '项目介绍和公开链接正在整理中。' },
  { title: '雪人工坊', type: '个人网站', description: '一个记录项目、笔记和日常想法的个人空间。' },
];

export default function ProjectsPage() {
  return (
    <main className="site-shell content-shell">
      <SiteSidebar active="项目" />
      <section className="content-stage">
        <header className="page-header">
          <h2><em>项目展示</em></h2>
        </header>

        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-copy">
                <span className="card-label">{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <span className="pending-link" aria-label={`${project.title} 链接待补充`}>链接待补充</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
