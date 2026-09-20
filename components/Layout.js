import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985', '797111731864207360'];

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [clock, setClock] = useState('--:--:--');
  const [sbOpen, setSbOpen] = useState(false);

  // ⏱️ Часы
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) { router.push('/'); return; }
        setUser(data.user);
        setIsAdmin(ADMIN_IDS.includes(data.user.id));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/announcement')
      .then(res => res.json())
      .then(data => { if (data.announcement) setAnnouncement(data.announcement); })
      .catch(() => {});
  }, []);

  // Закрытие сайдбара при смене страницы (моб.)
  useEffect(() => { setSbOpen(false); }, [router.pathname]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  // ─── Навигация ───
  const mainNav = [
    { name: 'Главная',     cmd: 'home',     path: '/dashboard',  match: p => p === '/dashboard' || p === '/' },
    { name: 'Профиль',     cmd: 'profile',  path: '/profile',    match: p => p.startsWith('/profile') },
    { name: 'Формы',       cmd: 'forms',    path: '/dashboard',  match: p => p.startsWith('/forms') },
    { name: 'Участники',   cmd: 'members',  path: '/members',    match: p => p.startsWith('/members') },
    { name: 'Справка',     cmd: 'help',     path: '/help',       match: p => p.startsWith('/help') || p.startsWith('/rules') },
    ...(isAdmin ? [{ name: 'Админ-Панель', cmd: 'admin', path: '/admin', match: p => p.startsWith('/admin') }] : []),
  ];

  const extraNav = [
    { name: 'Админ Лист',       cmd: 'admins',   path: '/admins',  match: p => p.startsWith('/admins') },
    { name: 'Полезные ссылки',  cmd: 'links',    path: '/privacy', match: p => p.startsWith('/privacy') },
    { name: 'Фотохостинги',     cmd: 'hosting',  path: '/hosting', match: p => p.startsWith('/hosting') },
    { name: 'Мини-игра',        cmd: 'minigame', path: '/terms',   match: p => p.startsWith('/terms') },
  ];

  const isActive = (item) => item.match ? item.match(router.pathname) : router.pathname === item.path;

  return (
    <div className="shell">
      {/* Mobile toggle */}
      <button
        className="sb-toggle"
        onClick={() => setSbOpen(v => !v)}
        aria-label="toggle menu"
      >
        {sbOpen ? '✕' : '☰'}
      </button>

      {/* Overlay для мобилки */}
      {sbOpen && <div className="sb-overlay" onClick={() => setSbOpen(false)} />}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`sidebar ${sbOpen ? 'open' : ''}`}>
        {/* HEADER */}
        <div className="sb-top">
          <div className="sb-brand">
            <span className="sb-brand-mark">◤◢</span>
            <span className="sb-brand-name">FIB-FORMS</span>
            <span className="sb-brand-ver">v1.0</span>
          </div>

          <div className="sb-user">
            <span className="sb-user-prompt">$</span>
            <span className="sb-user-name term-cursor">{user?.username || 'anonymous'}</span>
          </div>

          <div className="sb-sys">
            <span className="sb-sys-dot" />
            <span>online</span>
            <span className="sb-sys-sep">│</span>
            <span className="sb-sys-clock">{clock}</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="sb-nav">
          <div className="sb-group">
            <div className="sb-group-title">// main</div>
            {mainNav.map(item => (
              <button
                key={item.name + item.cmd}
                className={`sb-item ${isActive(item) ? 'active' : ''}`}
                onClick={() => router.push(item.path)}
              >
                <span className="sb-item-mark">{isActive(item) ? '❯' : ' '}</span>
                <span className="sb-item-cmd">./{item.cmd}</span>
                <span className="sb-item-name">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="sb-group">
            <div className="sb-group-title">// additional</div>
            {extraNav.map(item => (
              <button
                key={item.name + item.cmd}
                className={`sb-item ${isActive(item) ? 'active' : ''}`}
                onClick={() => router.push(item.path)}
              >
                <span className="sb-item-mark">{isActive(item) ? '❯' : ' '}</span>
                <span className="sb-item-cmd">./{item.cmd}</span>
                <span className="sb-item-name">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="sb-footer">
          <a href="/leh" className="sb-foot-link">ToS</a>
          <span className="sb-foot-sep">│</span>
          <a href="/geh" className="sb-foot-link">Privacy</a>
          <span className="sb-foot-sep">│</span>
          <a href="/author" className="sb-foot-link sb-foot-author">
            <span className="sb-author-dot" />
            Author
          </a>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="content">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-path">
            <span className="topbar-user">{user?.username || 'anon'}</span>
            <span className="topbar-at">@</span>
            <span className="topbar-host">mainframe</span>
            <span className="topbar-colon">:</span>
            <span className="topbar-dir">{router.pathname}</span>
            <span className="term-cursor" />
          </div>

          <div className="topbar-right">
            <span className="topbar-clock">[{clock}]</span>
            <span className="topbar-status">
              <span className="topbar-status-dot" />
              SECURE
            </span>
            <button className="topbar-exit" onClick={handleLogout}>
              $ exit
            </button>
          </div>
        </header>

        {/* ANNOUNCEMENT */}
        {announcement && (
          <div className="sys-msg">
            <span className="sys-msg-tag">[ SYS ]</span>
            <span className="sys-msg-text">{announcement}</span>
          </div>
        )}

        {/* PAGE */}
        <div className="page" key={router.pathname}>
          {children}
        </div>
      </main>

      <style jsx>{`
        /* ═══════════════ SHELL ═══════════════ */
        .shell {
          min-height: 100vh;
          background: var(--term-bg);
        }

        /* ═══════════════ SIDEBAR ═══════════════ */
        .sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 260px;
          background: var(--term-bg-panel);
          border-right: 1px solid var(--term-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.25s ease;
        }

        /* HEADER */
        .sb-top {
          padding: 18px 18px 14px;
          border-bottom: 1px solid var(--term-border);
        }

        .sb-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 13px;
          letter-spacing: 1.5px;
          font-weight: 800;
        }
        .sb-brand-mark {
          color: var(--term-accent);
          text-shadow: 0 0 10px var(--term-accent);
          font-size: 11px;
        }
        .sb-brand-name {
          color: var(--term-fg);
          flex: 1;
        }
        .sb-brand-ver {
          color: var(--term-fg-dim);
          font-size: 10px;
          letter-spacing: 1px;
        }

        .sb-user {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          background: rgba(0, 136, 255, 0.04);
          border: 1px solid var(--term-border);
          font-size: 12px;
          margin-bottom: 8px;
        }
        .sb-user-prompt {
          color: var(--term-prompt);
          font-weight: 700;
        }
        .sb-user-name {
          color: var(--term-fg-bright);
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sb-sys {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: var(--term-fg-dim);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .sb-sys-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--term-accent);
          box-shadow: 0 0 6px var(--term-accent);
          animation: sb-pulse 2s ease-in-out infinite;
        }
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .sb-sys-sep { color: var(--term-border-bright); }
        .sb-sys-clock { color: var(--term-fg-dim); }

        /* NAV */
        .sb-nav {
          flex: 1;
          overflow-y: auto;
          padding: 14px 10px;
        }

        .sb-group { margin-bottom: 18px; }

        .sb-group-title {
          padding: 4px 10px 8px;
          color: var(--term-fg-dim);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.65;
        }

        .sb-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 2px;
          background: transparent;
          border: none;
          border-left: 2px solid transparent;
          color: var(--term-fg-dim);
          font-family: inherit;
          font-size: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .sb-item:hover {
          background: rgba(255, 255, 255, 0.02);
          color: var(--term-fg);
        }
        .sb-item.active {
          background: rgba(0, 136, 255, 0.08);
          border-left-color: var(--term-accent);
          color: var(--term-fg-bright);
        }

        .sb-item-mark {
          color: var(--term-accent);
          font-size: 11px;
          width: 12px;
          display: inline-block;
        }
        .sb-item-cmd {
          color: var(--term-fg-dim);
          font-size: 11px;
          letter-spacing: 0.5px;
          opacity: 0.8;
          min-width: 66px;
        }
        .sb-item.active .sb-item-cmd {
          color: var(--term-accent);
          opacity: 1;
        }
        .sb-item-name {
          flex: 1;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* FOOTER */
        .sb-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          border-top: 1px solid var(--term-border);
          background: var(--term-bg-panel2);
          font-size: 11px;
        }
        .sb-foot-link {
          color: var(--term-fg-dim);
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: color 0.15s;
        }
        .sb-foot-link:hover { color: var(--term-accent); }
        .sb-foot-sep { color: var(--term-border-bright); }
        .sb-foot-author {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--term-accent);
        }
        .sb-author-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--term-accent);
          box-shadow: 0 0 6px var(--term-accent);
        }

        /* ═══════════════ MAIN ═══════════════ */
        .content {
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* TOP BAR */
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 24px;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--term-border);
          font-size: 12px;
        }
        .topbar-path {
          display: flex;
          align-items: center;
          gap: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          color: var(--term-fg-dim);
        }
        .topbar-user { color: var(--term-accent); }
        .topbar-at, .topbar-colon { color: var(--term-fg-dim); }
        .topbar-host { color: var(--term-fg); }
        .topbar-dir { color: var(--term-fg-bright); }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          color: var(--term-fg-dim);
          font-size: 11px;
        }
        .topbar-clock { letter-spacing: 1px; }
        .topbar-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--term-fg);
          letter-spacing: 1.5px;
          font-weight: 700;
        }
        .topbar-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--term-accent);
          box-shadow: 0 0 8px var(--term-accent);
          animation: sb-pulse 2s ease-in-out infinite;
        }
        .topbar-exit {
          padding: 5px 12px;
          background: transparent;
          border: 1px solid var(--term-border);
          color: var(--term-fg-dim);
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .topbar-exit:hover {
          color: var(--term-error);
          border-color: var(--term-error);
          box-shadow: 0 0 10px rgba(255, 51, 68, 0.25);
        }

        /* SYS MSG */
        .sys-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          background: rgba(255, 170, 0, 0.06);
          border-bottom: 1px solid var(--term-warn);
          font-size: 12px;
          color: var(--term-warn);
        }
        .sys-msg-tag {
          font-weight: 800;
          letter-spacing: 1px;
          flex-shrink: 0;
        }
        .sys-msg-text { color: #ffd580; }

        /* PAGE */
        .page {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 28px 32px 60px;
          animation: term-fade-in 0.35s ease both;
        }
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════ MOBILE ═══════════════ */
        .sb-toggle {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 200;
          width: 38px;
          height: 38px;
          background: var(--term-bg-panel);
          border: 1px solid var(--term-border-bright);
          color: var(--term-accent);
          font-size: 18px;
          cursor: pointer;
          font-family: inherit;
        }
        .sb-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 90;
        }

        @media (max-width: 900px) {
          .sb-toggle { display: flex; align-items: center; justify-content: center; }
          .sb-overlay { display: block; }
          .sidebar {
            transform: translateX(-100%);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.6);
          }
          .sidebar.open { transform: translateX(0); }
          .content { margin-left: 0; }
          .topbar { padding: 10px 16px 10px 62px; }
          .topbar-path { display: none; }
          .topbar-clock { display: none; }
          .page { padding: 20px 16px 40px; }
        }
      `}</style>
    </div>
  );
}
