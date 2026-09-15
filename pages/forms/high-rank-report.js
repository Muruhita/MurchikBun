import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const RANK_OPTIONS = [
  '1-2 ранг', '2-3 ранг', '3-4 ранг', '4-5 ранг', '5-6 ранг',
  '6-7 ранг', '7-8 ранг', '8-9 ранг', '9-10 ранг', '10-11 ранг',
  '11-12 ранг', '12-13 ранг', '13-14 ранг', '14-15 ранг'
];

const ADMIN_IDS = [
  '1018113109346504744',
  '555380718566506506',
  '260076815970729985',
  '797111731864207360'
];

export default function HighRankReportForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    rankRange: '',
    workLink: ''
  });

  // Условия повышения
  const [conditions, setConditions] = useState('');
  const [editConditions, setEditConditions] = useState(false);
  const [tempConditions, setTempConditions] = useState('');
  const [conditionStatus, setConditionStatus] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/me').then(res => res.json()),
      fetch('/api/profile').then(res => res.json()),
      fetch('/api/promotion-conditions').then(res => res.json())
    ]).then(([meData, profileData, conditionsData]) => {
      if (!meData.user) {
        router.push('/');
        return;
      }
      setUser(meData.user);
      setIsAdmin(ADMIN_IDS.includes(meData.user.id));

      if (profileData.nickname) {
        setFormData(prev => ({ ...prev, fullName: profileData.nickname }));
      }
      if (conditionsData.content) {
        setConditions(conditionsData.content);
        setTempConditions(conditionsData.content);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'highrank',
          fullName: formData.fullName,
          rankRange: formData.rankRange,
          workLink: formData.workLink
        })
      });
      if (res.ok) { alert('✅ Отчёт успешно отправлен!'); router.push('/dashboard'); }
      else { const err = await res.json(); throw new Error(err.error || 'Ошибка'); }
    } catch (error) { alert('❌ ' + error.message); }
    finally { setSubmitting(false); }
  };

  const saveConditions = async () => {
    const res = await fetch('/api/promotion-conditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: tempConditions })
    });
    const data = await res.json();
    if (data.message) {
      setConditions(tempConditions);
      setEditConditions(false);
      setConditionStatus('✅ Сохранено');
      setTimeout(() => setConditionStatus(''), 2000);
    } else {
      setConditionStatus('❌ ' + (data.error || 'Ошибка'));
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Загрузка...</p></div>;

  return (
    <Layout>
      <div className="form-page">
        <button onClick={() => router.push('/dashboard')} className="back-btn">← Назад к выбору</button>

        <div className="layout-row">
          {/* ЛЕВАЯ ЧАСТЬ — форма */}
          <div className="form-container">
            <h1>⚜️ Отчёт на повышение (Хай Ранги)</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Имя Фамилия + Статик *</label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Например: Name Surname 123456" />
              </div>
              <div className="form-group">
                <label>С какого на какой ранг вы повышаетесь *</label>
                <select required value={formData.rankRange} onChange={(e) => setFormData({...formData, rankRange: e.target.value})}>
                  <option value="">-- Выберите диапазон рангов --</option>
                  {RANK_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ссылка на проделанную работу *</label>
                <textarea required value={formData.workLink} onChange={(e) => setFormData({...formData, workLink: e.target.value})} rows="5" />
              </div>
              <div className="form-group">
                <label>Discord ID</label>
                <input type="text" value={`${user.username} (${user.id})`} disabled className="disabled-input" />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? '⏳ Отправка...' : '📤 Отправить отчёт'}
              </button>
            </form>
          </div>

          {/* ПРАВАЯ ЧАСТЬ — условия */}
          <div className="conditions-container">
            <div className="conditions-header">
              <h2> Условия для повышения</h2>
              {isAdmin && !editConditions && (
                <button className="edit-btn" onClick={() => { setEditConditions(true); setTempConditions(conditions); }}>
                   Редактировать
                </button>
              )}
            </div>

            {editConditions ? (
              <>
                <textarea
                  className="conditions-textarea"
                  value={tempConditions}
                  onChange={(e) => setTempConditions(e.target.value)}
                  rows="18"
                  placeholder="Введите условия для повышения (например, требования по рангам, отчётам, срокам и т.д.)"
                />
                <div className="conditions-actions">
                  <button className="save-btn" onClick={saveConditions}>💾 Сохранить</button>
                  <button className="cancel-btn" onClick={() => setEditConditions(false)}>Отмена</button>
                </div>
              </>
            ) : (
              <div className="conditions-view">
                {conditions ? (
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                    {conditions}
                  </div>
                ) : (
                  <p className="empty-conditions">
                    Условия пока не заполнены.
                    {isAdmin && ' Нажмите «Редактировать», чтобы добавить.'}
                  </p>
                )}
              </div>
            )}

            {conditionStatus && <p className="condition-status">{conditionStatus}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-page { min-height: calc(100vh - 60px); padding: 30px; }
        .back-btn { background: rgba(255, 255, 255, 0.08); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; font-size: 14px; }
        .back-btn:hover { background: rgba(255, 255, 255, 0.15); color: white; transform: translateY(-2px); }

        .layout-row {
          display: flex;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .form-container {
          flex: 1 1 400px;
          min-width: 320px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.5s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .conditions-container {
          flex: 0 0 380px;
          min-width: 300px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 25px;
          border: 1px groove rgba(98, 37, 102, 0.35);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.6s ease;
          position: sticky;
          top: 90px;
        }
        .conditions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
        }
        .conditions-header h2 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }
        .edit-btn {
          background: rgba(64, 42, 105, 0.2);
          color: #C4C0CC;
          border: 1px solid rgba(88, 101, 242, 0.5);
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .edit-btn:hover {
          background: rgba(88, 101, 242, 0.4);
          color: white;
        }
        .conditions-view {
          color: #ddd;
          font-size: 15px;
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 5px;
        }
        .conditions-view::-webkit-scrollbar { width: 6px; }
        .conditions-view::-webkit-scrollbar-thumb { background: rgba(88, 101, 242, 0.5); border-radius: 3px; }
        .empty-conditions {
          color: #888;
          font-style: italic;
          text-align: center;
          padding: 20px 0;
        }
        .conditions-textarea {
          width: 100%;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(88, 101, 242, 0.4);
          color: white;
          border-radius: 10px;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
          box-sizing: border-box;
          outline: none;
          font-family: inherit;
        }
        .conditions-textarea:focus {
          border-color: #742F75;
          box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.2);
        }
        .conditions-actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .save-btn {
          background: #355F78;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 14px;
        }
        .save-btn:hover { background: #4752C4; }
        .cancel-btn {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .cancel-btn:hover { background: rgba(255,255,255,0.2); }
        .condition-status {
          margin-top: 10px;
          font-size: 13px;
          color: #4CAF50;
          text-align: center;
        }

        h1 { color: white; margin-bottom: 30px; font-size: 22px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
        .disabled-input { opacity: 0.5; cursor: not-allowed; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; transform: translateY(-2px); }

        .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a0a; }
        .loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-container p { color: #888; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .layout-row { flex-direction: column; }
          .conditions-container { flex: 1 1 auto; width: 100%; position: static; }
        }
      `}</style>
    </Layout>
  );
}
