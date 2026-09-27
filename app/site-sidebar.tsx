const navItems = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects/' },
  { label: '博客', href: '/blogs/' },
];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function SiteSidebar({ active = '首页', status = '在线' }: { active?: string; status?: string }) {
  return (
    <header className="site-header">
      <div className="skyline-banner" aria-hidden="true">
        <div className="banner-identity">
          <strong>雪人工坊</strong>
          <span>一个学生的个人网站</span>
        </div>
        <div className="header-sun" />
        <div className="header-mountain mountain-back" />
        <div className="header-mountain mountain-mid" />
        <div className="header-mountain mountain-front" />
      </div>

      <div className="topbar">
        <nav aria-label="主导航" className="nav-list">
          {navItems.map((item) => (
            <a key={item.label} href={`${basePath}${item.href}`} className={`nav-item ${item.label === active ? 'active' : ''}`}>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="header-meta"><span className="pulse" /> {status} · UTC+08</div>
      </div>
    </header>
  );
}
