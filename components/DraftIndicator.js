import { formatSavedAt } from '../hooks/useFormDraft';

export default function DraftIndicator({ savedAt, onClear }) {
  if (!savedAt) return null;

  return (
    <>
      <div className="draft-indicator">
        <span className="draft-icon">💾</span>
        <span className="draft-text">
          Черновик сохранён · <em>{formatSavedAt(savedAt)}</em>
        </span>
        <button type="button" className="draft-clear" onClick={onClear} title="Очистить черновик">
          ✕
        </button>
      </div>

      <style jsx>{`
        .draft-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255, 200, 0, 0.08);
          border: 1px solid rgba(255, 200, 0, 0.25);
          border-radius: 20px;
          color: #FFD54F;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 16px;
          animation: draftIn 0.35s ease;
        }
        .draft-icon { font-size: 14px; }
        .draft-text em {
          color: #FFB300;
          font-style: normal;
          opacity: 0.8;
        }
        .draft-clear {
          background: transparent;
          border: none;
          color: #FFD54F;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          padding: 0 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .draft-clear:hover {
          background: rgba(255, 200, 0, 0.15);
          color: #fff;
        }
        @keyframes draftIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
