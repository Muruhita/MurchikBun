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
    { name: 'Главная',       path: '/dashboard', match: p => p === '/dashboard' },
    { name: 'Профиль',       path: '/profile',   match: p => p.startsWith('/profile') },
    { name: 'Формы',         path: '/dashboard', match: p => p.startsWith('/forms') },
    { name: 'Участники',     path: '/members',   match: p => p.startsWith('/members') },
    { name: 'Справка',       path: '/help',      match: p => p.startsWith('/help') || p.startsWith('/rules') },
    ...(isAdmin ? [{ name: 'Админ-Панель', path: '/admin', match: p => p.startsWith('/admin') }] : []),
  ];

  const extraNav = [
    { name: 'Админ Лист',       path: '/admins',  match: p => p.startsWith('/admins') },
    { name: 'Полезные ссылки',  path: '/privacy', match: p => p.startsWith('/privacy') },
    { name: 'Фотохостинги',     path: '/hosting', match: p => p.startsWith('/hosting') },
    { name: 'Мини-игра',        path: '/terms',   match: p => p.startsWith('/terms') },
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
        {sbOpen ? '✕' : '≡'}
      </button>

      {/* Overlay для мобилки */}
      {sbOpen && <div className="sb-overlay" onClick={() => setSbOpen(false)} />}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`sidebar ${sbOpen ? 'open' : ''}`}>
        {/* HEADER */}
        <div className="sb-top">
          <div className="sb-logo">
            <span className="sb-logo-mark">▓▒░</span>
            <span className="sb-logo-text">FIB-FORMS</span>
          </div>

          <div className="sb-tagline">terminal interface · v1.0</div>

          <div className="sb-user">
            <span className="sb-user-at">@</span>
            <span className="sb-user-name term-cursor">{user?.username || 'anonymous'}</span>
          </div>

          <div className="sb-sys">
            <span className="sb-sys-dot" />
            <span className="sb-sys-text">online</span>
            <span className="sb-sys-sep">·</span>
            <span className="sb-sys-text sb-sys-clock">{clock}</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="sb-nav">
          <div className="sb-group">
            <div className="sb-group-title">
              <span className="sb-group-line">──</span>
              <span className="sb-group-text">main</span>
              <span className="sb-group-line">──────</span>
            </div>
            {mainNav.map(item => {
              const active = isActive(item);
              return (
                <button
                  key={item.name}
                  className={`sb-item ${active ? 'active' : ''}`}
                  onClick={() => router.push(item.path)}
                >
                  <span className="sb-item-mark">{active ? '▸' : ' '}</span>
                  <span className="sb-item-name">{item.name}</span>
                  {active && <span className="sb-item-dot">•</span>}
                </button>
              );
            })}
          </div>

          <div className="sb-group">
            <div className="sb-group-title">
              <span className="sb-group-line">──</span>
              <span className="sb-group-text">additional</span>
              <span className="sb-group-line">──</span>
            </div>
            {extraNav.map(item => {
              const active = isActive(item);
              return (
                <button
                  key={item.name}
                  className={`sb-item ${active ? 'active' : ''}`}
                  onClick={() => router.push(item.path)}
                >
                  <span className="sb-item-mark">{active ? '▸' : ' '}</span>
                  <span className="sb-item-name">{item.name}</span>
                  {active && <span className="sb-item-dot">•</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="sb-footer">
          <div className="sb-foot-row">
            <a href="/leh" className="sb-foot-link">ToS</a>
            <span className="sb-foot-sep">·</span>
            <a href="/geh" className="sb-foot-link">Privacy</a>
          </div>
          <a href="/author" className="sb-foot-author">
            <span className="sb-foot-author-line" />
            <span>автор</span>
            <span className="sb-foot-author-line" />
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
            <span className="topbar-prompt">$</span>
            <span className="topbar-cursor">█</span>
          </div>

          <div className="topbar-right">
            <span className="topbar-clock">{clock}</span>
            <span className="topbar-status">
              <span className="topbar-status-dot" />
              SECURE
            </span>
            <button className="topbar-exit" onClick={handleLogout}>
              exit
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

        {/* BOTTOM BAR */}
        <footer className="bottombar">
          <span className="bb-line">───</span>
          <span className="bb-text">FIB-FORMS · secure channel · {clock}</span>
          <span className="bb-line">───</span>
        </footer>
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
          width: 256px;
          background: var(--term-bg);
          border-right: 1px solid var(--term-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.25s ease;
        }

        /* ── HEADER ── */
        .sb-top {
          padding: 20px 18px 16px;
          border-bottom: 1px solid var(--term-border);
        }

        .sb-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .sb-logo-mark {
          color: var(--term-fg-dim);
          font-size: 12px;
          letter-spacing: -1px;
        }
        .sb-logo-text {
          color: var(--term-fg);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .sb-tagline {
          color: var(--term-fg-dim);
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
          padding-left: 30px;
        }

        .sb-user {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          background: var(--term-bg-panel);
          border: 1px solid var(--term-border);
          font-size: 12px;
          margin-bottom: 8px;
        }
        .sb-user-at {
          color: var(--term-fg-dim);
          font-weight: 700;
        }
        .sb-user-name {
          color: var(--term-fg);
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
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding-left: 4px;
        }
        .sb-sys-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--term-fg);
          box-shadow: 0 0 6px var(--term-fg);
          animation: sb-pulse 2s ease-in-out infinite;
        }
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .sb-sys-sep { color: var(--term-fg-dimmer); }
        .sb-sys-clock { color: var(--term-fg-dim); }

        /* ── NAV ── */
        .sb-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
        }

        .sb-group { margin-bottom: 22px; }

        .sb-group-title {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 8px 10px;
          color: var(--term-fg-dim);
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .sb-group-line {
          color: var(--term-fg-dimmer);
          letter-spacing: -2px;
          flex: 1;
        }
        .sb-group-text {
          flex-shrink: 0;
          padding: 0 4px;
        }

        .sb-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          margin-bottom: 1px;
          background: transparent;
          border: none;
          border-left: 2px solid transparent;
          color: var(--term-fg-dim);
          font-family: inherit;
          font-size: 12.5px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sb-item:hover {
          background: var(--term-bg-panel);
          color: var(--term-fg);
        }
        .sb-item:hover .sb-item-mark { color: var(--term-fg-dim); }

        .sb-item.active {
          background: var(--term-bg-panel);
          border-left-color: var(--term-fg);
          color: var(--term-fg);
          font-weight: 600;
        }

        .sb-item-mark {
          width: 10px;
          color: var(--term-fg-dimmer);
          font-size: 11px;
          transition: color 0.15s;
        }
        .sb-item.active .sb-item-mark {
          color: var(--term-fg);
        }

        .sb-item-name {
          flex: 1;
          letter-spacing: 0.3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sb-item-dot {
          color: var(--term-fg);
          font-size: 10px;
          animation: sb-pulse 2s ease-in-out infinite;
        }

        /* ── FOOTER ── */
        .sb-footer {
          padding: 14px 18px 16px;
          border-top: 1px solid var(--term-border);
          background: var(--term-bg);
        }

        .sb-foot-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
          font-size: 11px;
        }
        .sb-foot-link {
          color: var(--term-fg-dim);
          text-decoration: none;
          letter-spacing: 1px;
          transition: color 0.15s;
        }
        .sb-foot-link:hover { color: var(--term-fg); }
        .sb-foot-sep { color: var(--term-fg-dimmer); }

        .sb-foot-author {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--term-fg-dim);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          transition: color 0.15s;
        }
        .sb-foot-author:hover { color: var(--term-fg); }
        .sb-foot-author-line {
          flex: 1;
          height: 1px;
          background: var(--term-fg-dimmer);
        }

        /* ═══════════════ MAIN ═══════════════ */
        .content {
          margin-left: 256px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── TOP BAR ── */
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.9);
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
        .topbar-user { color: var(--term-fg); font-weight: 600; }
        .topbar-at,
        .topbar-colon { color: var(--term-fg-dimmer); }
        .topbar-host { color: var(--term-fg-dim); }
        .topbar-dir {
          color: var(--term-fg);
          font-weight: 600;
        }
        .topbar-prompt {
          color: var(--term-fg-dim);
          margin-left: 6px;
          margin-right: 4px;
        }
        .topbar-cursor {
          color: var(--term-fg);
          animation: term-blink 1.1s step-end infinite;
          font-size: 11px;
        }
        @keyframes term-blink { 50% { opacity: 0; } }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          font-size: 11px;
        }

        .topbar-clock {
          color: var(--term-fg-dim);
          letter-spacing: 1px;
        }

        .topbar-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--term-fg);
          letter-spacing: 2px;
          font-weight: 700;
          font-size: 10px;
        }
        .topbar-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--term-fg);
          box-shadow: 0 0 8px var(--term-fg);
          animation: sb-pulse 2s ease-in-out infinite;
        }

        .topbar-exit {
          padding: 5px 12px;
          background: transparent;
          border: 1px solid var(--term-border-bright);
          color: var(--term-fg-dim);
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }
        .topbar-exit:hover {
          background: var(--term-fg);
          color: var(--term-bg);
          border-color: var(--term-fg);
        }

        /* ── SYS MSG ── */
        .sys-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          background: var(--term-bg-panel);
          border-bottom: 1px solid var(--term-border);
          font-size: 12px;
          color: var(--term-fg);
        }
        .sys-msg-tag {
          font-weight: 800;
          letter-spacing: 1.5px;
          flex-shrink: 0;
          color: var(--term-fg);
        }
        .sys-msg-text { color: var(--term-fg-dim); }

        /* ── PAGE ── */
        .page {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 32px 60px;
          animation: term-fade-in 0.35s ease both;
        }
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── BOTTOM BAR ── */
        .bottombar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 10px 24px;
          border-top: 1px solid var(--term-border);
          font-size: 10px;
          color: var(--term-fg-dimmer);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .bb-line {
          color: var(--term-fg-dimmer);
          letter-spacing: -1px;
          flex: 0 1 120px;
          overflow: hidden;
          white-space: nowrap;
        }
        .bb-text {
          color: var(--term-fg-dim);
          flex-shrink: 0;
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
          background: var(--term-bg);
          border: 1px solid var(--term-border-bright);
          color: var(--term-fg);
          font-size: 18px;
          cursor: pointer;
          font-family: inherit;
          align-items: center;
          justify-content: center;
        }
        .sb-toggle:hover { background: var(--term-bg-panel); }

        .sb-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 90;
        }

        @media (max-width: 900px) {
          .sb-toggle { display: flex; }
          .sb-overlay { display: block; }
          .sidebar {
            transform: translateX(-100%);
            box-shadow: 8px 0 40px rgba(0, 0, 0, 0.9);
          }
          .sidebar.open { transform: translateX(0); }
          .content { margin-left: 0; }
          .topbar { padding: 12px 16px 12px 62px; }
          .topbar-path { display: none; }
          .topbar-clock { display: none; }
          .page { padding: 22px 16px 40px; }
          .bottombar { font-size: 9px; letter-spacing: 1.5px; }
        }
      `}</style>
    </div>
  );
}
