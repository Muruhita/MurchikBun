import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [reply, setReply] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const res = await fetch('/api/support/list');
    const data = await res.json();
    setTickets(data.tickets || []);
    setIsAdmin(!!data.isAdmin);
    setLoading(false);
    fetch('/api/support/unread', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
  };

  useEffect(() => { load(); }, []);

  const createTicket = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setCreating(true);
    const res = await fetch('/api/support/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message })
    });
    const data = await res.json();
    setCreating(false);
    if (res.ok) {
      setSubject(''); setMessage(''); setShowCreate(false);
      setActiveId(data.ticket.id);
      load();
    } else {
      alert('❌ ' + (data.error || 'Ошибка'));
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !activeId) return;
    const res = await fetch('/api/support/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: activeId, message: reply })
    });
    if (res.ok) {
      setReply('');
      load();
    }
  };

  const closeTicket = async () => {
    if (!activeId) return;
    if (!confirm('Закрыть тикет?')) return;
    await fetch('/api/support/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: activeId, close: true })
    });
    load();
  };

  // 🗑️ Удаление тикета
  const deleteTicket = async () => {
    if (!activeId) return;
    if (!confirm('Удалить тикет навсегда? Это действие нельзя отменить.')) return;
    const res = await fetch('/api/support/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: activeId, delete: true })
    });
    if (res.ok) {
      setActiveId(null);
      load();
    } else {
      const data = await res.json();
      alert('❌ ' + (data.error || 'Не удалось удалить'));
    }
  };

  const active = tickets.find(t => t.id === activeId);

  return (
    <Layout>
      <div className="support-container">
        <div className="support-header">
          <h1>🎧 Поддержка</h1>
          <button className="new-btn" onClick={() => setShowCreate(v => !v)}>
            {showCreate ? '✕ Отмена' : '➕ Новое обращение'}
          </button>
        </div>

        {showCreate && (
          <form className="create-form" onSubmit={createTicket}>
            <input
              type="text"
              placeholder="Тема (необязательно)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={100}
            />
            <textarea
              placeholder="Опишите проблему подробнее..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              maxLength={2000}
              required
            />
            <button type="submit" className="submit-btn" disabled={creating}>
              {creating ? 'Отправка...' : '📤 Отправить'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="empty-text">Загрузка...</p>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>Пока нет обращений</p>
            <p className="empty-hint">Если что-то не работает — создайте тикет</p>
          </div>
        ) : (
          <div className="support-layout">
            <div className="tickets-list">
              {tickets.map(t => (
                <div
                  key={t.id}
                  className={`ticket-item ${activeId === t.id ? 'active' : ''} ${t.status}`}
                  onClick={() => setActiveId(t.id)}
                >
                  <div className="ticket-top">
                    <span className={`status-dot ${t.status}`} />
                    <span className="ticket-subject">{t.subject}</span>
                  </div>
                  <div className="ticket-meta">
                    {isAdmin && <span className="ticket-user">@{t.username}</span>}
                    <span className="ticket-time">{new Date(t.updatedAt).toLocaleString('ru-RU')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-box">
              {!active ? (
                <p className="empty-text">Выберите тикет слева</p>
              ) : (
                <>
                  <div className="chat-head">
                    <div>
                      <strong>{active.subject}</strong>
                      {isAdmin && <span className="chat-user"> · @{active.username}</span>}
                    </div>
                    {isAdmin && (
                      <div className="chat-actions">
                        {active.status !== 'closed' && (
                          <button className="close-btn" onClick={closeTicket} title="Закрыть тикет">
                            ✓ Закрыть
                          </button>
                        )}
                        <button className="delete-btn" onClick={deleteTicket} title="Удалить тикет навсегда">
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="chat-messages">
                    {active.messages.map((m, i) => (
                      <div key={i} className={`msg ${m.from}`}>
                        <div className="msg-head">
                          <span>{m.from === 'admin' ? '🛡️ Админ' : `👤 ${m.username}`}</span>
                          <span className="msg-time">{new Date(m.at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {active.status !== 'closed' ? (
                    <form className="chat-reply" onSubmit={sendReply}>
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows="2"
                        placeholder="Написать сообщение..."
                      />
                      <button type="submit" className="send-btn">➤</button>
                    </form>
                  ) : (
                    <p className="closed-text">Тикет закрыт</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .support-container { max-width: 1100px; margin: 0 auto; padding: 10px; }
        .support-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 10px; }
        h1 { color: #fff; margin: 0; }
        .new-btn { background: #5865F2; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .new-btn:hover { background: #4752C4; transform: translateY(-2px); }

        .create-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px; margin-bottom: 20px; animation: fadeIn 0.3s ease; }
        .create-form input, .create-form textarea {
          width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 8px; box-sizing: border-box; margin-bottom: 10px; font-size: 14px;
        }
        .create-form textarea { resize: vertical; font-family: inherit; }
        .submit-btn { width: 100%; padding: 12px; background: #fff; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .support-layout { display: grid; grid-template-columns: 300px 1fr; gap: 16px; height: calc(100vh - 220px); min-height: 400px; }
        @media (max-width: 800px) { .support-layout { grid-template-columns: 1fr; height: auto; } }

        .tickets-list { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 10px; overflow-y: auto; }
        .ticket-item { padding: 12px; border-radius: 10px; cursor: pointer; margin-bottom: 6px; background: rgba(255,255,255,0.02); border: 1px solid transparent; transition: all 0.2s; }
        .ticket-item:hover { background: rgba(255,255,255,0.06); }
        .ticket-item.active { background: rgba(88,101,242,0.15); border-color: rgba(88,101,242,0.5); }
        .ticket-item.closed { opacity: 0.5; }
        .ticket-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .status-dot.open { background: #FF9800; box-shadow: 0 0 8px #FF9800; }
        .status-dot.answered { background: #4CAF50; box-shadow: 0 0 8px #4CAF50; }
        .status-dot.closed { background: #666; }
        .ticket-subject { color: #fff; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ticket-meta { display: flex; justify-content: space-between; font-size: 11px; color: #888; }
        .ticket-user { color: #C4A5F0; }

        .chat-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; display: flex; flex-direction: column; overflow: hidden; }
        .chat-head { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; color: #fff; gap: 10px; }
        .chat-user { color: #C4A5F0; font-size: 13px; font-weight: 400; }
        .chat-actions { display: flex; gap: 6px; align-items: center; }
        .close-btn { background: rgba(76,175,80,0.15); border: 1px solid rgba(76,175,80,0.4); color: #81C784; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
        .close-btn:hover { background: rgba(76,175,80,0.3); color: #fff; }
        .delete-btn { background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.35); color: #ff6b6b; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .delete-btn:hover { background: rgba(255,60,60,0.3); border-color: #ff4444; color: #fff; transform: scale(1.05); }

        .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; background: rgba(255,255,255,0.05); }
        .msg.admin { align-self: flex-end; background: rgba(88,101,242,0.2); border: 1px solid rgba(88,101,242,0.4); }
        .msg.user { align-self: flex-start; }
        .msg-head { display: flex; justify-content: space-between; gap: 10px; font-size: 11px; color: #888; margin-bottom: 4px; }
        .msg p { color: #e0e0e0; margin: 0; font-size: 14px; white-space: pre-line; }

        .chat-reply { display: flex; gap: 8px; padding: 12px; border-top: 1px solid rgba(255,255,255,0.08); }
        .chat-reply textarea { flex: 1; padding: 10px 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 10px; resize: none; font-family: inherit; font-size: 14px; }
        .send-btn { width: 48px; background: #5865F2; color: #fff; border: none; border-radius: 10px; cursor: pointer; font-size: 18px; }
        .send-btn:hover { background: #4752C4; }
        .closed-text { text-align: center; color: #666; padding: 16px; font-size: 13px; }

        .empty-state { text-align: center; padding: 60px 20px; color: #888; }
        .empty-icon { font-size: 60px; margin-bottom: 12px; opacity: 0.5; }
        .empty-hint { font-size: 13px; color: #666; margin-top: 4px; }
        .empty-text { color: #888; text-align: center; padding: 40px; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
}
