// pages/dish.js
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const EDITOR_ID = '1018113109346504744';
const MAX_LINKS = 10;

export default function DisH() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ links: [], text: '' });
  const [editMode, setEditMode] = useState(false);

  // Форма редактирования
  const [formLinks, setFormLinks] = useState([{ label: '', url: '' }]);
  const [formText, setFormText] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const isEditor = me?.id === EDITOR_ID;

  const load = () => {
    fetch('/api/dish')
      .then(res => res.json())
      .then(d => {
        const links = Array.isArray(d.links) ? d.links : [];
        setData({ links, text: d.text || '' });
        setFormLinks(links.length > 0 ? links : [{ label: '', url: '' }]);
        setFormText(d.text || '');
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

  const addLink = () => {
    if (formLinks.length >= MAX_LINKS) return;
    setFormLinks([...formLinks, { label: '', url: '' }]);
  };

  const removeLink = (idx) => {
    setFormLinks(formLinks.filter((_, i) => i !== idx));
  };

  const updateLink = (idx, field, value) => {
    const next = [...formLinks];
    next[idx][field] = value;
    setFormLinks(next);
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: formLinks, text: formText })
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
    setFormLinks(data.links.length > 0 ? data.links : [{ label: '', url: '' }]);
    setFormText(data.text || '');
    setMsg('');
  };

  return (
    <Layout>
      <div className="dish-container">
        <h1 className="dish-title">🔴 Проблемы с Discord?</h1>
        <p className="dish-subtitle">
          Полезные ссылки и информация по решению проблем с Discord
        </p>

        {loading ? (
          <div className="dish-loading">
            <div className="dish-spinner" />
            <p>Загрузка...</p>
          </div>
        ) : (
          <>
            {/* ─── Ссылки ─── */}
            {data.links.length > 0 ? (
              <div className="dish-links">
                {data.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dish-link-btn"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <span className="dish-link-num">[{String(i + 1).padStart(2, '0')}]</span>
                    <span className="dish-link-label">{link.label}</span>
                    <span className="dish-link-arrow">→</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="dish-empty">
                <div className="dish-empty-icon">🔗</div>
                <p>Ссылки пока не добавлены</p>
              </div>
            )}

            {/* ─── Текст ниже ─── */}
            {data.text && (
              <div className="dish-text-block">
                <div className="dish-text-content">{data.text}</div>
              </div>
            )}
          </>
        )}

        {/* 🔒 Редактор */}
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
                {/* Ссылки */}
                <div className="dish-section-label">
                  Ссылки ({formLinks.length}/{MAX_LINKS})
                </div>

                {formLinks.map((link, idx) => (
                  <div key={idx} className="dish-link-row">
                    <span className="dish-link-row-num">[{idx + 1}]</span>
                    <div className="dish-link-row-fields">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(idx, 'label', e.target.value)}
                        placeholder="Название ссылки"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(idx, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      type="button"
                      className="dish-link-remove"
                      onClick={() => removeLink(idx)}
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {formLinks.length < MAX_LINKS && (
                  <button
                    type="button"
                    className="dish-add-btn"
                    onClick={addLink}
                  >
                    + Добавить ссылку
                  </button>
                )}

                {/* Текст */}
                <div className="dish-section-label" style={{ marginTop: 8 }}>
                  Текст ниже
                </div>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  rows="6"
                  placeholder="Введите текст, который появится под ссылками. Переносы строк сохраняются."
                  className="dish-textarea"
                />

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

        /* ── Ссылки ── */
        .dish-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 26px;
        }

        .dish-link-btn {
          display: grid;
          grid-template-columns: 60px 1fr 30px;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          background: linear-gradient(135deg, rgba(255, 60, 60, 0.1), rgba(255, 60, 60, 0.04));
          border: 1px solid rgba(255, 60, 60, 0.4);
          border-radius: 12px;
          color: #fff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.25s;
          opacity: 0;
          animation: linkIn 0.45s ease forwards;
        }
        @keyframes linkIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dish-link-btn:hover {
          background: rgba(255, 60, 60, 0.2);
          border-color: #ff4444;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 60, 60, 0.3);
        }
        .dish-link-btn:hover .dish-link-arrow {
          transform: translateX(4px);
        }

        .dish-link-num {
          color: #ff4444;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          opacity: 0.9;
        }
        .dish-link-label {
          color: #fff;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dish-link-arrow {
          color: #ff4444;
          font-size: 18px;
          transition: transform 0.2s;
          text-align: right;
        }

        /* ── Empty ── */
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

        /* ── Текст ── */
        .dish-text-block {
          margin-bottom: 22px;
          padding: 22px 26px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid #ff4444;
          border-radius: 12px;
        }
        .dish-text-content {
          color: #d0d0d0;
          font-size: 15px;
          line-height: 1.75;
          white-space: pre-line;
          text-align: left;
        }

        /* ── Editor ── */
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
          gap: 14px;
        }

        .dish-section-label {
          color: #C4A5F0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* ── Строка ссылки в редакторе ── */
        .dish-link-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .dish-link-row-num {
          color: #C4A5F0;
          font-size: 12px;
          font-weight: 700;
          padding-top: 12px;
          min-width: 30px;
          flex-shrink: 0;
        }

        .dish-link-row-fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .dish-link-row-fields input {
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .dish-link-row-fields input:focus {
          border-color: #A855F7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }
        .dish-link-row-fields input::placeholder { color: #555; }

        .dish-link-remove {
          width: 34px;
          height: 34px;
          background: rgba(255, 60, 60, 0.1);
          border: 1px solid rgba(255, 60, 60, 0.4);
          color: #ff8080;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .dish-link-remove:hover {
          background: rgba(255, 60, 60, 0.3);
          color: #fff;
          border-color: #ff4444;
        }

        .dish-add-btn {
          padding: 10px 16px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px dashed rgba(168, 85, 247, 0.5);
          color: #C4A5F0;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .dish-add-btn:hover {
          background: rgba(168, 85, 247, 0.2);
          color: #fff;
          border-style: solid;
        }

        .dish-textarea {
          padding: 12px 14px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
          width: 100%;
          box-sizing: border-box;
        }
        .dish-textarea:focus {
          border-color: #A855F7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }
        .dish-textarea::placeholder { color: #555; }

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
          .dish-editor-header { flex-direction: column; align-items: flex-start; }
          .dish-text-block { padding: 18px; }
          .dish-text-content { font-size: 14px; }
          .dish-link-btn {
            grid-template-columns: 45px 1fr 25px;
            padding: 14px 16px;
            font-size: 14px;
          }
          .dish-link-row {
            flex-direction: column;
          }
          .dish-link-row-num {
            padding-top: 0;
          }
          .dish-link-remove {
            align-self: flex-end;
            margin-top: 0;
          }
        }
      `}</style>
    </Layout>
  );
}
