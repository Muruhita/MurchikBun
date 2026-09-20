import Layout from '../components/Layout';
import BanOverlay from '../components/BanOverlay';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [banned, setBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banUntil, setBanUntil] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.banned) {
          setBanned(true);
          setBanReason(data.banReason || 'access blocked by security policy');
          setBanUntil(data.banUntil || null);
        }
      })
      .catch(() => {});
  }, []);

  const forms = [
    { cmd: 'promotion',     title: 'Запрос на повышение',    path: '/forms/promotion',        desc: 'rank promotion request' },
    { cmd: 'transfer',      title: 'Перевод в отдел',         path: '/forms/transfer',         desc: 'transfer to another dept' },
    { cmd: 'report',        title: 'Отчёт на повышение',      path: '/forms/report',           desc: 'in-department promotion report' },
    { cmd: 'hr-report',     title: 'Отчёт на повышение HR',   path: '/forms/high-rank-report', desc: 'promotion report (dep.head+)' },
    { cmd: 'resignation',   title: 'Рапорт на увольнение',    path: '/forms/resignation',      desc: 'leave the bureau' },
    { cmd: 'reinstatement', title: 'Восстановление',          path: '/forms/reinstatement',    desc: 'rejoin the bureau' },
    { cmd: 'transfer-fib',  title: 'Перевод в FIB',           path: '/forms/transfer-to-fib',  desc: 'transfer into FIB' },
    { cmd: 'weapon',        title: 'Спец Вооружение',         path: '/forms/weapon-request',   desc: 'request special weapons' },
    { cmd: 'withdrawal',    title: 'Снятие ЧС',               path: '/forms/withdrawal',       desc: 'request blacklist removal' },
    { cmd: 'hiring',        title: 'Трудоустройство',         path: '/forms/hiring',           desc: 'join the bureau' },
    { cmd: 'claim',         title: 'Жалоба',                  path: '/forms/claim',            desc: 'file complaint against a player' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="dash-header">
        <div className="dh-left">
          <span className="term-prompt">ls -la /forms/</span>
        </div>
        <div className="dh-right">
          <span className="dh-meta">[{forms.length} entries]</span>
          <span className="dh-meta">ready</span>
        </div>
      </div>

      {/* ASCII banner */}
      <pre className="dash-banner">{`
 ┌─ FIB-FORMS ─────────────────────────────────────────┐
 │  select a command to proceed                        │
 │  all submissions are routed to discord administrators │
 └─────────────────────────────────────────────────────┘`}</pre>

      {/* Grid */}
      <div className="term-grid">
        {forms.map((form, index) => (
          <div
            key={form.path}
            className="term-card"
            style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}
            onClick={() => router.push(form.path)}
          >
            <div className="card-head">
              <span className="card-prompt">$</span>
              <span className="card-cmd">./{form.cmd}</span>
            </div>
            <div className="card-title">{form.title}</div>
            <div className="card-desc">{form.desc}</div>
            <div className="card-exec">
              <span>exec</span>
              <span className="card-arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="dash-footer">
        <span className="term-text-dim">// {forms.length} commands available · all secure · v1.0</span>
      </div>

      <BanOverlay show={banned} reason={banReason} until={banUntil} />

      <style jsx>{`
        /* HEADER */
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px dashed var(--term-border);
          font-size: 13px;
        }
        .dh-right {
          display: flex;
          gap: 12px;
          color: var(--term-fg-dim);
          font-size: 11px;
          letter-spacing: 1px;
        }
        .dh-meta {
          padding: 2px 8px;
          border: 1px solid var(--term-border);
        }

        /* BANNER */
        .dash-banner {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          line-height: 1.5;
          color: var(--term-accent);
          background: rgba(0, 136, 255, 0.03);
          border: 1px solid var(--term-border);
          padding: 14px 18px;
          margin: 0 0 20px;
          overflow-x: auto;
          white-space: pre;
          text-shadow: 0 0 6px rgba(0, 136, 255, 0.4);
        }
        @media (max-width: 700px) {
          .dash-banner { font-size: 9px; padding: 10px 12px; }
        }

        /* GRID */
        .term-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }

        .term-card {
          position: relative;
          padding: 16px 18px;
          background: var(--term-bg-panel);
          border: 1px solid var(--term-border);
          cursor: pointer;
          transition: all 0.2s ease;
          animation: term-fade-in 0.35s ease both;
        }
        .term-card:hover {
          border-color: var(--term-accent);
          background: rgba(0, 136, 255, 0.04);
          box-shadow:
            0 0 24px rgba(0, 136, 255, 0.15),
            inset 0 0 30px rgba(0, 136, 255, 0.03);
          transform: translateY(-2px);
        }
        .term-card:hover .card-arrow {
          transform: translateX(4px);
          color: var(--term-accent);
        }
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-head {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed var(--term-border);
        }
        .card-prompt {
          color: var(--term-prompt);
          font-weight: 700;
          font-size: 12px;
        }
        .card-cmd {
          color: var(--term-accent);
          font-size: 11px;
          letter-spacing: 1px;
        }

        .card-title {
          color: var(--term-fg);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .card-desc {
          color: var(--term-fg-dim);
          font-size: 11px;
          line-height: 1.4;
          margin-bottom: 14px;
          min-height: 30px;
        }

        .card-exec {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10px;
          color: var(--term-fg-dim);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .card-arrow {
          color: var(--term-fg-dim);
          font-size: 14px;
          transition: all 0.2s;
        }

        /* FOOTER */
        .dash-footer {
          margin-top: 24px;
          padding-top: 12px;
          border-top: 1px dashed var(--term-border);
          font-size: 11px;
          text-align: center;
        }
      `}</style>
    </Layout>
  );
}
