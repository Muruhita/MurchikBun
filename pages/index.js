import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CloudBackground from '../components/CloudBackground';

const TOS_URL = 'https://docs.google.com/document/d/1GOFZ0kCdL2WNg85YRgi07BRHd-uQuOQKeqX4m0Ru7Zs/edit?usp=sharing';
const PRIVACY_URL = 'https://docs.google.com/document/d/1kG7hH5jsf1ItOQwsnvGMs_drvssIeJ_vbZQ9_hG7PuE/edit?usp=sharing';

const BOOT_LINES = [
  '> fib-forms boot sequence v1.0',
  '> mounting /dev/mainframe ........ [ OK ]',
  '> loading crypto module ......... [ OK ]',
  '> resolving discord gateway ..... [ OK ]',
  '> waiting for operator login',
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Boot animation
  useEffect(() => {
    if (bootStep >= BOOT_LINES.length) return;
    const id = setTimeout(() => setBootStep(s => s + 1), 350);
    return () => clearTimeout(id);
  }, [bootStep]);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          router.push('/dashboard');
          return;
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDiscordLogin = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/start-auth');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setConnecting(false);
        alert('ERROR: failed to create auth link');
      }
    } catch (e) {
      setConnecting(false);
      alert('ERROR: network failure');
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-text">
          $ booting<span className="term-cursor" />
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <CloudBackground />

      <div className="login-wrap">
        <div className="term-window login-window">
          <div className="term-window-header">
            <div className="term-dots">
              <span className="term-dot red" />
              <span className="term-dot yellow" />
              <span className="term-dot green" />
            </div>
            <span>auth@fib-forms:~#</span>
            <span>v1.0</span>
          </div>

          <div className="term-window-body login-body">
            {/* ASCII Logo */}
            <pre className="ascii-logo">
{` ███████╗██╗██████╗     ███████╗ ██████╗ ██████╗ ███╗   ███╗███████╗
 ██╔════╝██║██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗████╗ ████║██╔════╝
 █████╗  ██║██████╔╝    █████╗  ██║   ██║██████╔╝██╔████╔██║███████╗
 ██╔══╝  ██║██╔══██╗    ██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║╚════██║
 ██║     ██║██████╔╝    ██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████║
 ╚═╝     ╚═╝╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝`}
            </pre>

            {/* Boot log */}
            <div className="boot-log">
              {BOOT_LINES.slice(0, bootStep).map((line, i) => (
                <div key={i} className="boot-line term-anim-in">
                  {line}
                </div>
              ))}
              {bootStep >= BOOT_LINES.length && (
                <div className="boot-line term-anim-in">
                  <span className="term-text-dim">{'> '}</span>
                  <span className="term-cursor">ready</span>
                </div>
              )}
            </div>

            <hr className="term-divider" />

            {/* Discord login button */}
            <button
              className="term-btn term-btn-primary term-btn-block discord-login"
              onClick={handleDiscordLogin}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <span className="term-spinner" />
                  connecting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.33-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.31.61.67 1.19 1.07 1.74.02.02.06.03.07.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
                  </svg>
                  connect via discord
                </>
              )}
            </button>

            {/* Info toggle */}
            <button
              className="term-btn term-btn-block"
              style={{ marginTop: 10 }}
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? 'close info' : 'what does the bot get?'}
            </button>

            {showInfo && (
              <div className="info-panel term-anim-in">
                <div className="info-title">$ scope requested by bot:</div>
                <ul className="info-list">
                  <li><span className="term-text-accent">identify</span> — account id</li>
                  <li><span className="term-text-accent">identify</span> — username</li>
                  <li><span className="term-text-accent">identify</span> — avatar</li>
                  <li><span className="term-text-accent">identify</span> — banner</li>
                </ul>
                <div className="info-note">
                  <span className="term-text-warn">note:</span> no other data is stored or transmitted
                </div>
              </div>
            )}

            <hr className="term-divider" />

            {/* Author + Legal */}
            <div className="login-footer">
              <button
                className="author-link"
                onClick={() => router.push('/author')}
                type="button"
              >
                <span className="author-dot" />
                author: @muruh1ta
              </button>

              <div className="legal-links">
                <a href={TOS_URL} target="_blank" rel="noopener noreferrer">tos</a>
                <span className="sep">·</span>
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">privacy</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: #050805;
        }

        .login-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 720px;
          animation: term-fade-in 0.6s ease both;
        }
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-window {
          /* унаследовано от .term-window */
        }

        .login-body {
          padding: 28px 26px 24px;
        }

        /* ASCII logo */
        .ascii-logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          line-height: 1.05;
          color: var(--term-fg);
          text-align: center;
          margin: 0 0 24px;
          overflow-x: auto;
          white-space: pre;
          text-shadow:
            0 0 6px rgba(51, 255, 85, 0.8),
            0 0 18px rgba(51, 255, 85, 0.4);
          letter-spacing: 0;
        }
        @media (max-width: 720px) {
          .ascii-logo { font-size: 6px; }
        }
        @media (max-width: 520px) {
          .ascii-logo { font-size: 4.5px; }
        }

        /* Boot log */
        .boot-log {
          min-height: 110px;
          font-size: 12px;
          line-height: 1.7;
          color: var(--term-fg);
          margin-bottom: 8px;
        }
        .boot-line { color: var(--term-fg); }
        .boot-line:nth-child(odd) { color: var(--term-fg-bright); }

        /* Discord login */
        .discord-login {
          padding: 14px 20px;
          font-size: 13px;
          letter-spacing: 2.5px;
        }
        .discord-login:hover:not(:disabled) {
          box-shadow: 0 0 30px rgba(51, 255, 85, 0.7);
        }

        /* Info panel */
        .info-panel {
          margin-top: 12px;
          padding: 12px 14px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px dashed var(--term-border);
          font-size: 12px;
        }
        .info-title {
          color: var(--term-fg-dim);
          margin-bottom: 8px;
        }
        .info-list {
          list-style: none;
          padding: 0;
          margin: 0 0 10px;
        }
        .info-list li {
          padding: 2px 0;
          color: var(--term-fg);
        }
        .info-list li::before {
          content: '  ▸ ';
          color: var(--term-accent);
        }
        .info-note {
          color: var(--term-fg-dim);
          font-size: 11px;
          border-top: 1px dashed var(--term-border);
          padding-top: 8px;
        }

        /* Login footer */
        .login-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .author-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--term-fg-dim);
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
          padding: 4px 0;
          transition: color 0.15s ease;
        }
        .author-link:hover { color: var(--term-accent); }
        .author-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--term-fg-dim);
          transition: all 0.2s;
        }
        .author-link:hover .author-dot {
          background: var(--term-accent);
          box-shadow: 0 0 8px var(--term-accent);
        }

        .legal-links {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--term-fg-dim);
        }
        .legal-links a {
          color: var(--term-fg-dim);
          text-decoration: none;
          border-bottom: 1px dashed transparent;
          transition: all 0.15s ease;
        }
        .legal-links a:hover {
          color: var(--term-accent);
          border-bottom-color: var(--term-accent);
        }
        .sep { color: var(--term-border-bright); }

        /* Loader */
        .loader {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050805;
        }
        .loader-text {
          font-size: 14px;
          color: var(--term-fg);
          letter-spacing: 2px;
        }

        @media (max-width: 500px) {
          .login-body { padding: 20px 16px 18px; }
          .login-footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
