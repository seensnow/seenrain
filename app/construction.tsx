import SiteSidebar from './site-sidebar';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Construction({ section, note }: { section: string; note: string }) {
  return (
    <main className="site-shell construction-shell">
      <SiteSidebar active={section} status="筹备中" />

      <section className="construction-stage">
        <div className="simple-notice">
          <p className="notice-label">{section}</p>
          <h1>正在准备中</h1>
          <p>{note}</p>
          <a href={`${basePath}/`} className="home-link">返回首页 <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  );
}
