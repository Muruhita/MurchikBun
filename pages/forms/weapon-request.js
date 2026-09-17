import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SubmitOverlay from '../../components/SubmitOverlay';

export default function WeaponRequestForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ rank: '', department: '', item: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const departments = ['IB', 'CID', 'FA', 'HRT', 'ATF', 'AF', 'OCU', 'DEA', 'FNA', 'NSB'];

  const items = ['Дрон', 'Высокоточная винтовка (Прецизионная винтовка) ', 'Heave Sniper Mk1', 'Heave Sniper Mk2'];

  const deptMap = {
    'ib': 'IB', 'cid': 'CID', 'fa': 'FA', 'hrt': 'HRT',
    'atf': 'ATF', 'af': 'AF', 'ocu': 'OCU', 'dea': 'DEA',
    'fna': 'FNA', 'nsb': 'NSB', 'trainee': 'Trainee'
  };

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => {
      if (data.nickname) setNickname(data.nickname);
      if (data.department) {
        const deptName = deptMap[data.department] || data.department;
        setFormData(prev => ({ ...prev, department: deptName }));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'weaponRequest', fullName: nickname, ...formData })
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

  return (
    <Layout>
      <div className="form-page">
        <button onClick={() => router.push('/dashboard')} className="back-btn">← Назад к выбору</button>
        <div className="form-container">
          <h1>🔫 Спец Вооружение</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя Фамилия + Статик</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Name Surname 123456" />
            </div>
            <div className="form-group">
              <label>Ваш ранг</label>
              <input type="text" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Ваш отдел</label>
              <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
                <option value="">-- Выберите отдел --</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Предмет на выбор</label>
              <select value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} required>
                <option value="">-- Выберите предмет --</option>
                {items.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <button type="submit" className="submit-btn" disabled={submitting || success}>
              {submitting ? <><span className="btn-spinner" />Отправка...</> : '📤 Отправить'}
            </button>
          </form>
        </div>
      </div>

      <SubmitOverlay show={success} text="Запрос на вооружение отправлен!" />

      <style jsx>{`
        .form-page { min-height: calc(100vh - 60px); padding: 30px; }
        .back-btn { background: rgba(255, 255, 255, 0.08); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; font-size: 14px; }
        .back-btn:hover { background: rgba(255, 255, 255, 0.15); color: white; transform: translateY(-2px); }
        .form-container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border-radius: 20px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); animation: fadeIn 0.5s ease; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
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
