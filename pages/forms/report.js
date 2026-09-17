import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const DEPARTMENTS = [
  { id: 'ib', name: 'IB (Intelligence Branch)', emoji: '🕵️' },
  { id: 'cid', name: 'CID (Criminal Investigation)', emoji: '🔍' },
  { id: 'fa', name: 'FA (Free Agent)', emoji: '🆓' },
  { id: 'hrt', name: 'HRT (Hostage Rescue)', emoji: '🛡️' },
  { id: 'atf', name: 'ATF (Anti Terrorism)', emoji: '💥' },
  { id: 'af', name: 'AF (Air Force)', emoji: '✈️' },
  { id: 'ocu', name: 'OCU (Organized Crime)', emoji: '⚖️' },
  { id: 'dea', name: 'DEA (Drug Enforcement)', emoji: '💊' },
  { id: 'fna', name: 'FNA (Academy)', emoji: '📚' },
  { id: 'nsb', name: 'NSB (National Security)', emoji: '🏛️' },
  { id: 'trainee', name: 'Trainee (Стажёр)', emoji: '📖' }
];

const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function ReportForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    currentRank: '',
    targetRank: '',
    isInstructor: '',
    workLinks: ''
  });

  const targetRankNum = parseInt(formData.targetRank);
  const showInstructorField = (targetRankNum === 9 || targetRankNum === 10) && formData.department !== 'fa';

  useEffect(() => {
    Promise.all([
      fetch('/api/me').then(res => res.json()),
      fetch('/api/profile').then(res => res.json())
    ]).then(([meData, profileData]) => {
      if (!meData.user) {
        router.push('/');
        return;
      }
      setUser(meData.user);
      if (profileData.nickname) {
        setFormData(prev => ({ ...prev, fullName: profileData.nickname }));
      }
      if (profileData.department) {
        setFormData(prev => ({ ...prev, department: profileData.department }));
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showInstructorField && formData.isInstructor !== 'yes') {
      alert('⚠️ Для повышения на 9 или 10 ранг необходимо подтвердить назначение на инструктора!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'report',
          department: formData.department,
          fullName: formData.fullName,
          currentRank: formData.currentRank,
          targetRank: formData.targetRank,
          isInstructor: formData.isInstructor || 'no',
          workLinks: formData.workLinks
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 1400);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка');
      }
    } catch (error) {
      alert('❌ ' + error.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Загрузка...</p></div>;

  return (
    <Layout>
      <div className="form-page">
        <button onClick={() => router.push('/dashboard')} className="back-btn">← Назад к выбору</button>
        <div className="form-container">
          <h1>📋 Отчёт на повышении</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя Фамилия + Статик *</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Например: Name Surname 123456" />
            </div>
            <div className="form-group">
              <label>Выберите отдел *</label>
              <select required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                <option value="">-- Выберите отдел --</option>
                {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Ваш текущий ранг *</label>
              <select required value={formData.currentRank} onChange={(e) => setFormData({...formData, currentRank: e.target.value})}>
                <option value="">-- Выберите ранг --</option>
                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>На какой ранг повышаетесь *</label>
              <select required value={formData.targetRank} onChange={(e) => setFormData({...formData, targetRank: e.target.value})}>
                <option value="">-- Выберите ранг --</option>
                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {showInstructorField && (
              <div className="form-group">
                <label>Назначены ли вы на инструктора? *</label>
                <select required value={formData.isInstructor} onChange={(e) => setFormData({...formData, isInstructor: e.target.value})}>
                  <option value="">-- Выберите ответ --</option>
                  <option value="yes">✅ Да</option>
                  <option value="no">❌ Нет</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Ссылки на проделанную работу *</label>
              <textarea required value={formData.workLinks} onChange={(e) => setFormData({...formData, workLinks: e.target.value})} rows="4" />
            </div>

            <div className="form-group">
              <label>Discord ID</label>
              <input type="text" value={`${user.username} (${user.id})`} disabled className="disabled-input" />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting || success}>
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  Отправка...
                </>
              ) : '📤 Отправить отчёт'}
            </button>
          </form>
        </div>
      </div>

      {/* === FULL-SCREEN SUCCESS OVERLAY === */}
      {success && (
        <div className="success-overlay">
          <div className="success-box">
            <svg className="checkmark-svg" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <p className="success-text">Отчёт успешно отправлен!</p>
            <p className="success-subtext">Перенаправление в панель...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-page { min-height: calc(100vh - 60px); padding: 30px; }
        .back-btn { background: rgba(255, 255, 255, 0.08); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; font-size: 14px; }
        .back-btn:hover { background: rgba(255, 255, 255, 0.15); color: white; transform: translateY(-2px); }
        .form-container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border-radius: 20px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); animation: fadeIn 0.5s ease; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
        .disabled-input { opacity: 0.5; cursor: not-allowed; }

        /* === Кнопка === */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover:not(:disabled) { background: #ccc; transform: translateY(-2px); }
        .submit-btn:disabled { opacity: 0.75; cursor: not-allowed; transform: none; }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 0, 0, 0.15);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* === Loading screen === */
        .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #0a0a0a; }
        .loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
        .loading-container p { color: #888; }

        /* ============================================================
           FULL-SCREEN SUCCESS OVERLAY
           ============================================================ */
        .success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 5, 5, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: overlayIn 0.35s ease forwards;
        }

        .success-box {
          background: linear-gradient(145deg, rgba(22, 26, 22, 0.98), rgba(12, 16, 12, 0.98));
          border: 1px solid rgba(76, 175, 80, 0.4);
          border-radius: 24px;
          padding: 48px 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 80px rgba(76, 175, 80, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: boxIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: center;
        }

        .checkmark-svg {
          width: 96px;
          height: 96px;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 20px rgba(76, 175, 80, 0.5));
        }
        .checkmark-svg circle {
          stroke: #4CAF50;
          stroke-width: 2;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: strokeCircle 0.7s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark-svg path {
          stroke: #4CAF50;
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: strokeCheck 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.55s forwards;
        }

        .success-text {
          color: #4CAF50;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 6px 0;
          letter-spacing: 0.3px;
          opacity: 0;
          animation: textIn 0.45s ease 0.85s forwards;
        }
        .success-subtext {
          color: #777;
          font-size: 13px;
          margin: 0;
          opacity: 0;
          animation: textIn 0.45s ease 1s forwards;
        }

        /* === KEYFRAMES === */
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes boxIn {
          0% { transform: scale(0.6) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes strokeCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes strokeCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes textIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* === Мобильная адаптация === */
        @media (max-width: 500px) {
          .success-box { padding: 36px 40px; border-radius: 20px; }
          .checkmark-svg { width: 72px; height: 72px; margin-bottom: 18px; }
          .success-text { font-size: 17px; }
          .success-subtext { font-size: 12px; }
        }
      `}</style>
    </Layout>
  );
}
