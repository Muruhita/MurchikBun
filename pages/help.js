import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985'];

export default function Help() {
  const [content, setContent] = useState('loading...');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetch('/api/help')
      .then(res => res.json())
      .then(data => {
        setContent(data.content || 'no data yet');
        setNewContent(data.content || '');
      })
      .catch(() => setContent('load failed'));

    fetch('/api/me')
      .then(res => res.json())
      .then(data => setIsAdmin(data.user && ADMIN_IDS.includes(data.user.id)))
      .catch(() => {});
  }, []);

  const saveContent = async () => {
    const res = await fetch('/api/help', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent })
    });
    const data = await res.json();
    if (data.message) {
      setContent(newContent);
      setEditMode(false);
    }
  };

  return (
    <Layout>
      <div className="help-shell">
        <div className="pg-header">
          <span className="term-prompt">man fib-forms</span>
          {isAdmin && !editMode && (
            <button className="term-btn" onClick={() => setEditMode(true)}>edit</button>
          )}
        </div>

        <div className="term-window">
          <div className="term-window-header">
            <div className="term-dots">
              <span className="term-dot red" />
              <span className="term-dot yellow" />
              <span className="term-dot green" />
            </div>
            <span>manual::help</span>
            <span>READONLY</span>
          </div>

          <div className="term-window-body">
            {editMode ? (
              <>
                <div className="term-label">manual content [shift+enter — new paragraph]</div>
                <textarea
                  className="term-textarea"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows="14"
                />
                <div className="edit-actions">
                  <button className="term-btn term-btn-primary" onClick={saveContent}>save</button>
                  <button className="term-btn" onClick={() => setEditMode(false)}>cancel</button>
                </div>
              </>
            ) : (
              <div className="help-content">{content}</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .help-shell { max-width: 820px; margin: 0 auto; }

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

        .help-content {
          white-space: pre-line;
          line-height: 1.75;
          font-size: 13px;
          color: var(--term-fg);
          padding: 4px 0;
        }

        .edit-actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
      `}</style>
    </Layout>
  );
}
