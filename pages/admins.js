import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const DEPT_NAMES = {
  'ib': 'IB', 'cid': 'CID', 'fa': 'FA', 'hrt': 'HRT',
  'atf': 'ATF', 'af': 'AF', 'ocu': 'OCU', 'dea': 'DEA',
  'fna': 'FNA', 'nsb': 'NSB', 'trainee': 'TR',
  'director': 'DIR', 'cod': 'CoD', 'assh': 'Ass.SH'
};

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admins')
      .then(res => res.json())
      .then(data => {
        if (data.admins) setAdmins(data.admins);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loader">
          <span className="term-spinner" />
          <span>$ querying admins...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pg-header">
        <span className="term-prompt">cat /etc/sudoers.d/admins</span>
        <span className="pg-count">[{admins.length} operators]</span>
      </div>

      {admins.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">⚠</div>
          <div className="empty-text">no admins registered</div>
        </div>
      ) : (
        <div className="admins-grid">
          {admins.map((a, i) => (
            <div
              key={a.userId}
              className="a-card term-anim-in"
              style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
            >
              <div className="a-card-header">
                <span className="a-crown">◆ ROOT</span>
                <span className="a-idx">#{String(i + 1).padStart(2, '0')}</span>
              </div>

              <div className="a-body">
                <div className="a-avatar">
                  {a.avatar ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${a.userId}/${a.avatar}.png`}
                      alt=""
                    />
                  ) : (
                    <span className="a-avatar-ph">◆</span>
                  )}
                </div>
                <div className="a-nick">{a.nickname}</div>
                <div className="a-user">@{a.username}</div>
                <div className="a-row">
                  <span className="term-badge">{DEPT_NAMES[a.department] || a.department || '—'}</span>
                  <span className="term-badge ok">ADMIN</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 60px 0;
          color: var(--term-fg);
          font-size: 13px;
        }

        .pg-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px dashed var(--term-border);
          font-size: 13px;
        }
        .pg-count { color: var(--term-fg-dim); font-size: 11px; letter-spacing: 1px; }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: var(--term-fg-dim);
        }
        .empty-icon { font-size: 32px; color: var(--term-warn); margin-bottom: 8px; }
        .empty-text { font-size: 14px; color: var(--term-fg); }

        .admins-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }

        .a-card {
          border: 1px solid var(--term-border);
          background: var(--term-bg-panel);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .a-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 8px,
              rgba(51, 255, 85, 0.015) 8px,
              rgba(51, 255, 85, 0.015) 9px
            );
          pointer-events: none;
        }
        .a-card:hover {
          border-color: var(--term-fg);
          box-shadow: 0 0 24px rgba(51, 255, 85, 0.15);
          transform: translateY(-2px);
        }

        .a-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          background: var(--term-bg-panel2);
          border-bottom: 1px solid var(--term-border);
          font-size: 10px;
          letter-spacing: 1.5px;
        }
        .a-crown {
          color: var(--term-accent);
          font-weight: 800;
          text-shadow: 0 0 8px rgba(51, 255, 85, 0.7);
        }
        .a-idx { color: var(--term-fg-dim); }

        .a-body {
          padding: 18px 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .a-avatar {
          width: 64px; height: 64px;
          border: 1px solid var(--term-border-bright);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          margin-bottom: 6px;
          box-shadow: 0 0 20px rgba(51, 255, 85, 0.1);
        }
        .a-avatar img {
          width: 100%; height: 100%; object-fit: cover;
          filter: grayscale(0.3) contrast(1.1);
        }
        .a-avatar-ph {
          color: var(--term-accent);
          font-size: 24px;
        }

        .a-nick {
          color: var(--term-fg);
          font-size: 14px;
          font-weight: 700;
        }
        .a-user {
          color: var(--term-fg-dim);
          font-size: 11px;
          margin-bottom: 6px;
        }

        .a-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }

        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}
