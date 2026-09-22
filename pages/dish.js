// pages/dish.js
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const EDITOR_ID = '1018113109346504744';

// Достать YouTube ID из разных форматов ссылок
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function DisH() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ youtube: '', link: '', linkLabel: 'Дополнительная ссылка' });
  const [editMode, setEditMode] = useState(false);

  // форма редактирования
  const [formYoutube, setFormYoutube] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formLinkLabel, setFormLinkLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const isEditor = me?.id === EDITOR_ID;

  const load = () => {
    fetch('/api/dish')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setFormYoutube(d.youtube || '');
        setFormLink(d.link || '');
        setFormLinkLabel(d.linkLabel || 'Дополнительная ссылка');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(d => { if (d.user) setMe(d.user); })
      .catch(() => {});
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtube: formYoutube,
          link: formLink,
          linkLabel: formLinkLabel
        })
      });
      const d = await res.json();
      if (res.ok) {
        setMsg('✅ Сохранено');
        setEditMode(false);
        load();
        setTimeout(() => setMsg(''), 2500);
      } else {
        setMsg('❌ ' + (d.error || 'Ошибка'));
      }
    } catch (e) {
      setMsg('❌ Ошибка сети');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormYoutube(data.youtube || '');
    setFormLink(data.link || '');
    setFormLinkLabel(data.linkLabel || 'Дополнительная ссылка');
    setMsg('');
  };

  const ytId = extractYouTubeId(data.youtube);

  return (
    <Layout>
      <div className="dish-container">
        <h1 className="dish-title">🔴 Проблемы с Discord?</h1>
        <p className="dish-subtitle">
          Если у вас возникли проблемы с Discord — посмотрите видео-инструкцию ниже
        </p>

        {/* Инфо-блок */}
        <div className="dish-info">
          <div className="dish-info-icon">⚠️</div>
          <div className="dish-info-text">
            <strong>Частые проблемы:</strong> не заходит в аккаунт, не работает авторизация,
            ошибки подключения к серверам Discord. Решения — в видео ниже.
          </div>
        </div>

        {loading ? (
          <div className="dish-loading">
            <div className="dish-spinner" />
            <p>Загрузка...</p>
          </div>
        ) : (
          <>
            {/* YouTube видео */}
            {ytId ? (
              <div className="dish-video">
                <div className="dish-video-header">
                  <span className="dish-video-dot" />
                  <span>Видео-инструкция</span>
                </div>
                <div className="dish-video-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="dish-empty">
                <div className="dish-empty-icon">📺</div>
                <p>Видео пока не добавлено</p>
              </div>
            )}

            {/* Вторая ссылка */}
            {data.link && (
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="dish-link-btn"
              >
                <span className="dish-link-icon">🔗</span>
                <span>{data.linkLabel || 'Дополнительная ссылка'}</span>
                <span className="dish-link-arrow">→</span>
              </a>
            )}
          </>
        )}

        {/* 🔒 Редактирование — только для одного ID */}
        {isEditor && (
          <div className="dish-editor">
            <div className="dish-editor-header">
              <span className="dish-editor-badge">🔒 OWNER MODE</span>
              {!editMode ? (
                <button className="dish-edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Редактировать
                </button>
              ) : (
                <button className="dish-edit-btn dish-edit-cancel" onClick={cancelEdit}>
                  ✕ Отмена
                </button>
              )}
            </div>

            {editMode && (
              <div className="dish-editor-body">
                <div className="dish-field">
                  <label>Ссылка на YouTube видео</label>
                  <input
                    type="text"
                    value={formYoutube}
                    onChange={(e) => setFormYoutube(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... или https://youtu.be/..."
                  />
                  <small>Поддерживаются: youtube.com/watch, youtu.be, /shorts/, /embed/</small>
                </div>

                <div className="dish-field">
                  <label>Вторая ссылка (URL)</label>
                  <input
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://example.com/..."
                  />
                </div>

                <div className="dish-field">
                  <label>Название второй ссылки</label>
                  <input
                    type="text"
                    value={formLinkLabel}
                    onChange={(e) => setFormLinkLabel(e.target.value)}
                    placeholder="Например: Инструкция от Discord"
                  />
                </div>

                <button className="dish-save-btn" onClick={save} disabled={saving}>
                  {saving ? '⏳ Сохранение...' : '💾 Сохранить'}
                </button>

                {msg && <p className="dish-msg">{msg}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .dish-container {
          max-width: 780px;
          margin: 0 auto;
          padding: 10px;
        }

        .dish-title {
          font-size: 32px;
          color: #fff;
          text-align: center;
          margin-bottom: 12px;
          text-shadow: 0 0 20px rgba(255, 60, 60, 0.4);
        }

        .dish-subtitle {
          text-align: center;
          color: #aaa;
          font-size: 15px;
          margin-bottom: 30px;
        }

        /* Info */
        .dish-info {
          display: flex;
          gap: 14px;
          padding: 16px 20px;
          background: rgba(255, 60, 60, 0.08);
          border: 1px solid rgba(255, 60, 60, 0.35);
          border-left: 3px solid #ff4444;
          border-radius: 10px;
          margin-bottom: 26px;
        }
        .dish-info-icon {
          font-size: 24px;
          flex-shrink: 0;
          line-height: 1;
        }
        .dish-info-text {
          color: #e0e0e0;
          font-size: 13px;
          line-height: 1.6;
        }
        .dish-info-text strong {
          color: #ff8080;
        }

        /* Loading */
        .dish-loading {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }
        .dish-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255, 255, 255, 0.15);
          border-top-color: #ff4444;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Video */
        .dish-video {
          margin-bottom: 22px;
          border: 1px solid rgba(255, 60, 60, 0.4);
          border-radius: 14px;
          overflow: hidden;
          background: #0a0a0a;
          box-shadow: 0 10px 40px rgba(255, 60, 60, 0.15);
        }
        .dish-video-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: rgba(255, 60, 60, 0.08);
          border-bottom: 1px solid rgba(255, 60, 60, 0.25);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .dish-video-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff4444;
          box-shadow: 0 0 10px #ff4444;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .dish-video-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
        }
        .dish-video-frame iframe {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Empty */
        .dish-empty {
          text-align: center;
          padding: 50px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: #888;
          margin-bottom: 22px;
        }
        .dish-empty-icon {
          font-size: 48px;
          margin-bottom: 10px;
          opacity: 0.6;
        }

        /* Link button */
        .dish-link-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(255, 60, 60, 0.12), rgba(255, 60, 60, 0.05));
          border: 1px solid rgba(255, 60, 60, 0.4);
          border-radius: 12px;
          color: #fff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.25s;
          margin-bottom: 22px;
        }
        .dish-link-btn:hover {
          background: rgba(255, 60, 60, 0.2);
          border-color: #ff4444;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 60, 60, 0.3);
        }
        .dish-link-icon { font-size: 18px; }
        .dish-link-arrow {
          margin-left: auto;
          color: #ff4444;
          font-size: 18px;
          transition: transform 0.2s;
        }
        .dish-link-btn:hover .dish-link-arrow {
          transform: translateX(4px);
        }

        /* Editor */
        .dish-editor {
          margin-top: 30px;
          background: rgba(168, 85, 247, 0.05);
          border: 1px solid rgba(168, 85, 247, 0.35);
          border-radius: 14px;
          overflow: hidden;
        }

        .dish-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 18px;
          background: rgba(168, 85, 247, 0.08);
          border-bottom: 1px solid rgba(168, 85, 247, 0.25);
        }

        .dish-editor-badge {
          color: #C4A5F0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .dish-edit-btn {
          padding: 6px 14px;
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.5);
          color: #C4A5F0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          transition: all 0.2s;
        }
        .dish-edit-btn:hover {
          background: rgba(168, 85, 247, 0.3);
          color: #fff;
        }
        .dish-edit-cancel {
          border-color: rgba(255, 60, 60, 0.5);
          background: rgba(255, 60, 60, 0.1);
          color: #ff8080;
        }
        .dish-edit-cancel:hover {
          background: rgba(255, 60, 60, 0.25);
          color: #fff;
        }

        .dish-editor-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dish-field { display: flex; flex-direction: column; }
        .dish-field label {
          display: block;
          color: #aaa;
          font-size: 13px;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .dish-field small {
          color: #666;
          font-size: 11px;
          margin-top: 4px;
        }
        .dish-field input {
          padding: 12px 14px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .dish-field input:focus {
          border-color: #A855F7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }
        .dish-field input::placeholder { color: #555; }

        .dish-save-btn {
          padding: 14px;
          background: linear-gradient(135deg, #A855F7, #5865F2);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
        }
        .dish-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.6);
        }
        .dish-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dish-msg {
          text-align: center;
          font-size: 13px;
          color: #4CAF50;
          margin: 0;
        }

        @media (max-width: 500px) {
          .dish-title { font-size: 24px; }
          .dish-subtitle { font-size: 13px; }
          .dish-info { padding: 12px 14px; }
          .dish-editor-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </Layout>
  );
}
