import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function Members() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loader">
          <span className="term-spinner" />
          <span>$ querying users...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pg-header">
        <span className="term-prompt">ls /members/</span>
        <span className="pg-count">[{users.length} entries]</span>
      </div>

      {users.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">▸</div>
          <div className="empty-text">no members yet</div>
          <div className="empty-hint">no one has filled their profile</div>
        </div>
      ) : (
        <div className="members-list">
          {users.map((user, i) => (
            <div
              key={user.userId}
              className="m-row term-anim-in"
              style={{ animationDelay: `${Math.min(i * 0.02, 0.4)}s` }}
            >
              <span className="m-idx">{String(i + 1).padStart(3, '0')}</span>
              <span className="m-avatar">
                {user.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}.png`}
                    alt=""
                  />
                ) : (
                  <span className="m-avatar-ph">?</span>
                )}
              </span>
              <span className="m-nick">{user.nickname}</span>
              <span className="m-user">@{user.username}</span>
              <span className="m-dept">[{user.department}]</span>
              <span className={`m-status ${user.banned ? 'err' : 'ok'}`}>
                {user.banned ? 'banned' : 'active'}
              </span>
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
        .empty-icon { font-size: 32px; color: var(--term-accent); margin-bottom: 8px; }
        .empty-text { font-size: 14px; color: var(--term-fg); margin-bottom: 4px; }
        .empty-hint { font-size: 11px; }

        .members-list {
          border: 1px solid var(--term-border);
          background: var(--term-bg-panel);
          overflow: hidden;
        }

        .m-row {
          display: grid;
          grid-template-columns: 40px 40px 1fr 1fr auto auto;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--term-border);
          font-size: 12px;
          transition: background 0.15s;
          animation: term-fade-in 0.3s ease both;
        }
        .m-row:last-child { border-bottom: none; }
        .m-row:hover {
          background: rgba(51, 255, 85, 0.04);
          box-shadow: inset 3px 0 0 var(--term-accent);
        }

        .m-idx { color: var(--term-fg-dim); font-size: 11px; }

        .m-avatar {
          width: 28px; height: 28px;
          border: 1px solid var(--term-border);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .m-avatar img {
          width: 100%; height: 100%; object-fit: cover;
          filter: grayscale(0.4) contrast(1.1);
        }
        .m-avatar-ph {
          color: var(--term-fg-dim);
          font-size: 12px;
        }

        .m-nick { color: var(--term-fg); font-weight: 600; }
        .m-user { color: var(--term-fg-dim); }
        .m-dept { color: var(--term-accent); font-size: 11px; }

        .m-status {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 1px 6px;
          border: 1px solid;
        }
        .m-status.ok { color: var(--term-fg); border-color: var(--term-border-bright); }
        .m-status.err { color: var(--term-error); border-color: var(--term-error); }

        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 800px) {
          .m-row {
            grid-template-columns: 32px 32px 1fr auto;
            font-size: 11px;
          }
          .m-user, .m-dept { display: none; }
        }
      `}</style>
    </Layout>
  );
}
