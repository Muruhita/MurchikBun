import Layout from '../components/Layout';
import BanOverlay from '../components/BanOverlay';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [banned, setBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banUntil, setBanUntil] = useState(null);

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
    { cmd: 'transfer',      title: 'Перевод в отдел',         path: '/forms/transfer',         desc: 'transfer to another department' },
    { cmd: 'report',        title: 'Отчёт на повышение',      path: '/forms/report',           desc: 'in-department promotion report' },
    { cmd: 'hr-report',     title: 'Отчёт HR',                path: '/forms/high-rank-report', desc: 'report for dep.head and above' },
    { cmd: 'resignation',   title: 'Рапорт на увольнение',    path: '/forms/resignation',      desc: 'leave the bureau' },
    { cmd: 'reinstatement', title: 'Восстановление',          path: '/forms/reinstatement',    desc: 'rejoin the bureau' },
    { cmd: 'transfer-fib',  title: 'Перевод в FIB',           path: '/forms/transfer-to-fib',  desc: 'transfer into the bureau' },
    { cmd: 'weapon',        title: 'Спец Вооружение',         path: '/forms/weapon-request',   desc: 'request special weapons' },
    { cmd: 'withdrawal',    title: 'Снятие ЧС',               path: '/forms/withdrawal',       desc: 'request blacklist removal' },
    { cmd: 'hiring',        title: 'Трудоустройство',         path: '/forms/hiring',           desc: 'join the bureau' },
    { cmd: 'claim',         title: 'Жалоба',                  path: '/forms/claim',            desc: 'file a complaint' },
  ];

  return (
    <Layout>
      {/* ── HEADER ── */}
      <div className="d-header">
        <div className="d-prompt">
          <span className="d-prompt-sym">$</span>
          <span className="d-prompt-cmd">ls -la /forms/</span>
          <span className="d-prompt-cursor">█</span>
        </div>
        <div className="d-meta">
          <span className="d-meta-tag">[{forms.length} entries]</span>
          <span className="d-meta-tag">rw-r--r--</span>
        </div>
      </div>

      {/* ── BANNER ── */}
      <pre className="d-banner">{`
┌────────────────────────────────────────────────────────────┐
│  FIB-FORMS — TERMINAL INTERFACE                            │
│  ─────────────────────────────────────────────────────     │
│  ▸ выберите команду для продолжения                        │
│  ▸ все заявки отправляются напрямую администрации          │
└────────────────────────────────────────────────────────────┘`}</pre>

      {/* ── GRID ── */}
      <div className="d-grid">
        {forms.map((form, index) => (
          <button
            key={form.path}
            className="d-card"
            style={{ animationDelay: `${Math.min(index * 0.035, 0.4)}s` }}
            onClick={() => router.push(form.path)}
          >
            <div className="d-card-head">
              <span className="d-card-num">[{String(index + 1).padStart(2, '0')}]</span>
              <span className="d-card-cmd">./{form.cmd}</span>
            </div>
            <div className="d-card-body">
              <div className="d-card-title">{form.title}</div>
              <div className="d-card-desc">{form.desc}</div>
            </div>
            <div className="d-card-foot">
              <span className="d-card-exec">exec</span>
              <span className="d-card-arrow">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div className="d-footer">
        <span className="d-footer-line">─</span>
        <span className="d-footer-text">
          {forms.length} commands available · all secure · v1.0
        </span>
        <span className="d-footer-line">─</span>
      </div>

      <BanOverlay show={banned} reason={banReason} until={banUntil} />

      <style jsx>{`
        /* ── HEADER ── */
        .d-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px dashed var(--term-border);
          font-size: 13px;
        }

        .d-prompt {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .d-prompt-sym {
          color: var(--term-fg-dim);
          font-weight: 700;
        }
        .d-prompt-cmd {
          color: var(--term-fg);
          font-weight: 600;
        }
        .d-prompt-cursor {
          color: var(--term-fg);
          font-size: 12px;
          animation: term-blink 1.1s step-end infinite;
        }
        @keyframes term-blink { 50% { opacity: 0; } }

        .d-meta {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .d-meta-tag {
          padding: 2px 8px;
          border: 1px solid var(--term-border);
          color: var(--term-fg-dim);
          font-size: 10px;
          letter-spacing: 1px;
        }

        /* ── BANNER ── */
        .d-banner {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          line-height: 1.5;
          color: var(--term-fg-dim);
          background: var(--term-bg-panel);
          border: 1px solid var(--term-border);
          padding: 16px 20px;
          margin: 0 0 22px;
          overflow-x: auto;
          white-space: pre;
        }
        @media (max-width: 700px) {
          .d-banner { font-size: 8.5px; padding: 12px 14px; }
        }

        /* ── GRID ── */
        .d-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
        }

        .d-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 0;
          background: var(--term-bg);
          border: 1px solid var(--term-border);
          color: var(--term-fg);
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          animation: term-fade-in 0.4s ease both;
          overflow: hidden;
        }
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .d-card:hover {
          border-color: var(--term-fg);
          background: var(--term-bg-panel);
        }
        .d-card:hover .d-card-arrow {
          transform: translateX(6px);
          color: var(--term-fg);
        }
        .d-card:hover .d-card-num {
          color: var(--term-fg);
        }

        /* card: head */
        .d-card-head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-bottom: 1px dashed var(--term-border);
        }
        .d-card-num {
          color: var(--term-fg-dimmer);
          font-size: 11px;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }
        .d-card-cmd {
          color: var(--term-fg);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* card: body */
        .d-card-body {
          flex: 1;
          padding: 14px 14px 16px;
        }
        .d-card-title {
          color: var(--term-fg);
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 6px;
          line-height: 1.35;
        }
        .d-card-desc {
          color: var(--term-fg-dim);
          font-size: 11px;
          line-height: 1.45;
        }

        /* card: foot */
        .d-card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          border-top: 1px dashed var(--term-border);
          font-size: 10px;
          color: var(--term-fg-dim);
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }
        .d-card-arrow {
          color: var(--term-fg-dimmer);
          font-size: 14px;
          letter-spacing: 0;
          transition: all 0.2s;
        }

        /* ── FOOTER ── */
        .d-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          font-size: 10px;
          color: var(--term-fg-dimmer);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .d-footer-line {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
        }
        .d-footer-text {
          flex-shrink: 0;
        }
      `}</style>
    </Layout>
  );
}
