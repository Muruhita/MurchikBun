import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SubmitOverlay from '../../components/SubmitOverlay';
import BanOverlay from '../../components/BanOverlay';
import MultiImageUploader from '../../components/MultiImageUploader';

export default function LeaveForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [leaveType, setLeaveType] = useState('IC');
  const [formData, setFormData] = useState({
    department: '',
    reason: '',
    startDate: '',
    endDate: '',
    screenshots: []              // 🖼️ массив URL
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [banned, setBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banUntil, setBanUntil] = useState(null);

  const departments = ['IB', 'CID', 'FA', 'HRT', 'ATF', 'AF', 'OCU', 'DEA', 'FNA', 'NSB'];

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.nickname) setNickname(data.nickname);
        if (data.banned) {
          setBanned(true);
          setBanReason(data.banReason || 'Ваш доступ к системе заявок заблокирован.');
          setBanUntil(data.banUntil || null);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'leave', leaveType, fullName: nickname, ...formData })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 1400);
        return;
      }

      if (res.status === 403) {
        const err = await res.json();
        if (err.banned) {
          setBanned(true);
          setBanReason(err.reason || 'Ваш доступ к системе заявок заблокирован.');
          setBanUntil(err.until || null);
          setSubmitting(false);
          return;
        }
        throw new Error(err.error || 'Доступ запрещён');
      }

      const err = await res.json();
      throw new Error(err.error || 'Ошибка');
    } catch (error) {
      alert('❌ ' + error.message);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <button onClick={() => router.push('/dashboard')} className="back-btn">← Назад к выбору</button>
        <div className="form-container">
          <h1>🌴 Отпуск</h1>

          <div className="type-switcher">
            <button type="button" className={leaveType === 'IC' ? 'active' : ''} onClick={() => setLeaveType('IC')}>IC Отпуск</button>
            <button type="button" className={leaveType === 'OOC' ? 'active' : ''} onClick={() => setLeaveType('OOC')}>OOC Отпуск</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя Фамилия + Статик</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
            </div>
            <div className="form-group">
              <label>Отдел</label>
              <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
                <option value="">-- Выберите отдел --</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Причина</label>
              <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required rows="4" />
            </div>
            <div className="form-group date-row">
              <div>
                <label>Начало отпуска</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div>
                <label>Конец отпуска</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
              </div>
            </div>

            {/* 🖼️ Мульти-загрузка скриншотов */}
            <MultiImageUploader
              label="Скриншоты (необязательно)"
              value={formData.screenshots}
              onChange={(urls) => setFormData(prev => ({ ...prev, screenshots: urls }))}
              max={5}
            />

            <button type="submit" className="submit-btn" disabled={submitting || success || banned}>
              {submitting ? <><span className="btn-spinner" />Отправка...</> : banned ? '🚫 Доступ заблокирован' : '📤 Отправить'}
            </button>
          </form>
        </div>
      </div>

      <SubmitOverlay show={success} text="Заявка на отпуск отправлена!" />
      <BanOverlay show={banned} reason={banReason} until={banUntil} />

      <style jsx>{`
        .form-page { min-height: calc(100vh - 60px); padding: 30px; }
        .back-btn { background: rgba(255, 255, 255, 0.08); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; font-size: 14px; }
        .back-btn:hover { background: rgba(255, 255, 255, 0.15); color: white; transform: translateY(-2px); }
        .form-container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border-radius: 20px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); animation: fadeIn 0.5s ease; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
        h1 { color: white; margin-bottom: 30px; }
        .type-switcher { display: flex; gap: 10px; margin-bottom: 20px; background: #1a1a1a; padding: 5px; border-radius: 10px; }
        .type-switcher button { flex: 1; padding: 12px; background: transparent; color: #888; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .type-switcher button.active { background: #fff; color: #000; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
        .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .submit-btn:hover:not(:disabled) { background: #ccc; transform: translateY(-2px); }
        .submit-btn:disabled { opacity: 0.75; cursor: not-allowed; transform: none; }
        .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.15); border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
}
