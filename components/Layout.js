import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985', '797111731864207360'];

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [clock, setClock] = useState('--:--:--');

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/');
          return;
        }
        setUser(data.user);
        setIsAdmin(ADMIN_IDS.includes(data.user.id));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/announcement')
      .then(res => res.json())
      .then(data => {
        if (data.announcement) setAnnouncement(data.announcement);
      })
      .catch(() => {});
  }, []);

  // ⏱️ Живые часы
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { name: 'dashboard', path: '/dashboard' },
    { name: 'profile', path: '/profile' },
    { name: 'help', path: '/help' },
    ...(isAdmin ? [{ name: 'admin', path: '/admin' }] : []),
  ];

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  const userLabel = user ? user.username : 'anonymous';
  const pathLabel = router.pathname;

  return (
    <div className="app-shell">
      <ParticleBackground />

      {/* ═══ TOP STATUS BAR ═══ */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand">FIB-FORMS</span>
          <span className="sep">::</span>
          <span className="path">
            <span className="user">{userLabel}</span>
            <span className="at">@</span>
            <span className="host">mainframe</span>
            <span className="colon">:</span>
            <span className="dir">{pathLabel}</span>
            <span className="term-cursor" />
          </span>
        </div>

        <nav className="topbar-nav">
          {tabs.map(tab => (
            <button
              key={tab.path}
              className={`nav-cmd ${router.pathname === tab.path ? 'active' : ''}`}
              onClick={() => router.push(tab.path)}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          <span className="clock">[{clock}]</span>
          <span className="status">
            <span className="status-dot" />
            ONLINE
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            exit
          </button>
        </div>
      </header>

      {/* ═══ ANNOUNCEMENT ═══ */}
      {announcement && (
        <div className="sys-msg">
          <span className="sys-tag">[ SYS ]</span>
          <span className="sys-text">{announcement}</span>
        </div>
      )}

      {/* ═══ MAIN ═══ */}
      <main key={router.pathname} className="main-area">
        {children}
      </main>

      {/* ═══ BOTTOM BAR ═══ */}
      <footer className="bottombar">
        <div className="bb-left">
          <span className="bb-tag">F1</span> help
          <span className="bb-sep">│</span>
          <span className="bb-tag">F2</span> minigame
          <span className="bb-sep">│</span>
          <span className="bb-tag">F3</span> links
          <span className="bb-sep">│</span>
          <span className="bb-tag">F4</span> hosting
          <span className="bb-sep">│</span>
          <span className="bb-tag">F5</span> admins
        </div>
        <div className="bb-right">
          <a href="/author" className="bb-author">
            <span className="bb-author-dot" />
            @muruh1ta
          </a>
          <span className="bb-sep">│</span>
          <a href="/leh" className="bb-legal">ToS</a>
          <span className="bb-sep">·</span>
          <a href="/geh" className="bb-legal">Privacy</a>
        </div>
      </footer>

      <style jsx>{`
        .app-shell {
          min-height: 100vh;
          position: relative;
        }

        /* ═══ TOP BAR ═══ */
        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 20px;
          background: rgba(5, 8, 5, 0.92);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--term-border);
          font-size: 12px;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--term-fg-dim);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 1;
          min-width: 0;
        }
        .brand {
          color: var(--term-fg);
          font-weight: 800;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(51, 255, 85, 0.7);
          flex-shrink: 0;
        }
        .sep { color: var(--term-border-bright); flex-shrink: 0; }
        .path {
          display: flex;
          align-items: center;
          gap: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .user { color: var(--term-accent); }
        .at, .colon { color: var(--term-fg-dim); }
        .host { color: var(--term-fg); }
        .dir { color: var(--term-fg-bright); }

        .topbar-nav {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }
        .nav-cmd {
          background: transparent;
          border: 1px solid transparent;
          color: var(--term-fg-dim);
          padding: 4px 12px;
          font-family: inherit;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .nav-cmd::before {
          content: './';
          color: var(--term-border-bright);
        }
        .nav-cmd:hover {
          color: var(--term-fg);
          border-color: var(--term-border);
        }
        .nav-cmd.active {
          color: var(--term-bg);
          background: var(--term-fg);
          border-color: var(--term-fg);
          text-shadow: none;
          font-weight: 700;
        }
        .nav-cmd.active::before {
          color: rgba(0, 0, 0, 0.5);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          color: var(--term-fg-dim);
          font-size: 11px;
        }
        .clock { color: var(--term-fg-dim); letter-spacing: 1px; }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--term-fg);
          letter-spacing: 1.5px;
          font-weight: 700;
        }
        .status-dot {
          width: 6px; height: 6px;
          background: var(--term-fg);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--term-fg);
          animation: term-pulse 2s ease-in-out infinite;
        }
        @keyframes term-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .logout-btn {
          background: transparent;
          border: 1px solid var(--term-border);
          color: var(--term-fg-dim);
          padding: 4px 10px;
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .logout-btn::before { content: '$ '; color: var(--term-prompt); }
        .logout-btn:hover {
          color: var(--term-error);
          border-color: var(--term-error);
          box-shadow: 0 0 12px rgba(255, 51, 85, 0.3);
        }

        /* ═══ SYS MESSAGE ═══ */
        .sys-msg {
          position: fixed;
          top: 50px;
          left: 0;
          right: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 8px 20px;
          background: rgba(30, 22, 0, 0.92);
          border-bottom: 1px solid var(--term-warn);
          backdrop-filter: blur(6px);
          font-size: 12px;
          color: var(--term-warn);
          text-shadow: 0 0 6px rgba(255, 176, 0, 0.5);
        }
        .sys-tag {
          color: var(--term-warn);
          font-weight: 700;
          letter-spacing: 1px;
        }
        .sys-text { color: #ffd580; }

        /* ═══ MAIN ═══ */
        .main-area {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px 70px;
          min-height: 100vh;
          animation: term-fade-in 0.4s ease both;
        }
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ═══ BOTTOM BAR ═══ */
        .bottombar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 8px 20px;
          background: rgba(5, 8, 5, 0.95);
          backdrop-filter: blur(8px);
          border-top: 1px solid var(--term-border);
          font-size: 11px;
          color: var(--term-fg-dim);
          letter-spacing: 0.5px;
        }
        .bb-left, .bb-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .bb-tag {
          display: inline-block;
          padding: 0 5px;
          border: 1px solid var(--term-border);
          color: var(--term-fg);
          font-size: 10px;
          font-weight: 700;
          margin-right: 2px;
        }
        .bb-sep { color: var(--term-border-bright); }
        .bb-author {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--term-accent);
          text-decoration: none;
          transition: color 0.2s;
        }
        .bb-author:hover { color: var(--term-fg-bright); }
        .bb-author-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--term-accent);
          box-shadow: 0 0 6px var(--term-accent);
        }
        .bb-legal {
          color: var(--term-fg-dim);
          text-decoration: none;
          transition: color 0.2s;
        }
        .bb-legal:hover { color: var(--term-fg); }

        /* ═══ MOBILE ═══ */
        @media (max-width: 900px) {
          .topbar {
            padding: 8px 12px;
            gap: 8px;
          }
          .path { display: none; }
          .topbar-nav { gap: 0; }
          .nav-cmd { padding: 4px 8px; font-size: 11px; }
          .clock { display: none; }
          .main-area { padding: 72px 14px 68px; }
          .bottombar {
            padding: 6px 10px;
            font-size: 10px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .bb-left { display: none; }
        }
        @media (max-width: 500px) {
          .status { display: none; }
          .brand { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
