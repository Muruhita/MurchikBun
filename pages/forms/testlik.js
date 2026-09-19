import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ImageUploader from '../../components/ImageUploader';
import MultiImageUploader from '../../components/MultiImageUploader';
import BanOverlay from '../../components/BanOverlay';

export default function TestLikPage() {
  const router = useRouter();
  const [petals, setPetals] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [banned, setBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banUntil, setBanUntil] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    category: 'option1',
    date: '',
    agree: false,
    singleImage: '',
    multiImages: []
  });

  // 🌸 Лепестки
  useEffect(() => {
    const generated = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 10,
      size: 10 + Math.random() * 14,
      rotate: Math.random() * 360,
      opacity: 0.3 + Math.random() * 0.5
    }));
    setPetals(generated);
    setTimeout(() => setMounted(true), 60);
  }, []);

  // 🔒 Проверка бана
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
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
        body: JSON.stringify({ type: 'testlik', ...formData })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 1800);
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

  const resetForm = () => {
    setFormData({
      name: '',
      message: '',
      category: 'option1',
      date: '',
      agree: false,
      singleImage: '',
      multiImages: []
    });
  };

  return (
    <>
      <Head>
        <title>TestLik · Песочница</title>
        <meta name="description" content="Тестовая страница FIB Forms" />
      </Head>

      <div className={`testlik-page ${mounted ? 'mounted' : ''}`}>
        {/* 🌸 Лепестки */}
        <div className="sakura-layer">
          {petals.map(p => (
            <div
              key={p.id}
              className="petal"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                transform: `rotate(${p.rotate}deg)`
              }}
            />
          ))}
        </div>

        {/* ✨ Ауры */}
        <div className="aura aura-1" />
        <div className="aura aura-2" />
        <div className="aura aura-3" />

        {/* 🈴 Углы */}
        <div className="corner-deco corner-tl">実験</div>
        <div className="corner-deco corner-tr">テスト</div>
        <div className="corner-deco corner-bl">開発</div>
        <div className="corner-deco corner-br">未来</div>

        {/* 🔙 Кнопка назад */}
        <button
          className="back-float"
          onClick={() => router.push('/dashboard')}
          title="На главную"
        >
          <span className="back-arrow">←</span>
          <span className="back-text">На главную</span>
        </button>

        {/* 📦 Контент */}
        <div className="content-wrap">
          {/* 🌟 HERO */}
          <div className="page-hero">
            <div className="hero-jp">テ ス ト 形 式</div>
            <h1 className="hero-title">
              <span className="title-accent">TestLik</span> Sandbox
            </h1>
            <div className="hero-underline" />
            <p className="hero-sub">
              Песочница для проверки всех функций FIB Forms в реальном времени
            </p>
          </div>

          {/* 🎴 Карточка с формой */}
          <div className="form-card">
            <div className="card-top-strip">
              <span>テ ス ト</span>
              <span>·</span>
              <span>TEST</span>
              <span>·</span>
              <span>Песочница</span>
            </div>

            <div className="test-badge">🧪 SANDBOX MODE</div>

            <form onSubmit={handleSubmit} className="form-body">
              {/* Имя */}
              <div className="form-group">
                <label className="form-label">Имя / любой текст</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Test User 123456"
                />
              </div>

              {/* Сообщение */}
              <div className="form-group">
                <label className="form-label">Сообщение</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="4"
                  placeholder="Проверка многострочного текста..."
                />
              </div>

              {/* Категория + Дата */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Категория</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="option1">Опция 1</option>
                    <option value="option2">Опция 2</option>
                    <option value="option3">Опция 3</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Дата</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Чекбокс */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  />
                  <span>Подтверждаю, что это тест</span>
                </label>
              </div>

              {/* Картинки */}
              <div className="form-group">
                <ImageUploader
                  label="Одиночная картинка (тест)"
                  value={formData.singleImage}
                  onChange={(url) => setFormData(prev => ({ ...prev, singleImage: url }))}
                  allowManualUrl
                />
              </div>

              <div className="form-group">
                <MultiImageUploader
                  label="Несколько картинок (тест)"
                  value={formData.multiImages}
                  onChange={(urls) => setFormData(prev => ({ ...prev, multiImages: urls }))}
                  max={5}
                />
              </div>

              {/* Кнопки */}
              <div className="form-actions">
                <button
                  type="button"
                  className="reset-btn"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  ♻️ Очистить
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting || success || banned}
                >
                  {submitting
                    ? <><span className="btn-spinner" />Отправка...</>
                    : banned
                      ? '🚫 Заблокирован'
                      : '🧪 Отправить тест'}
                </button>
              </div>
            </form>

            <div className="card-bottom">
              <span className="quote-mark">"</span>
              テ ス ト は 成 功 へ の 道
              <span className="quote-mark">"</span>
            </div>
          </div>

          {/* 📊 Инфо-панель */}
          <div className="stats-strip">
            <div className="stat">
              <div className="stat-emoji">🧪</div>
              <div className="stat-val">Sandbox</div>
              <div className="stat-lbl">режим</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-emoji">🔒</div>
              <div className="stat-val">Safe</div>
              <div className="stat-lbl">тест</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-emoji">🎌</div>
              <div className="stat-val">TestLik</div>
              <div className="stat-lbl">v1.0</div>
            </div>
          </div>

          <p className="page-footer">
            Powered by <span className="heart">♥</span> FIB Forms
          </p>
        </div>
      </div>

      {/* 🎉 Оверлеи поверх — они и так fixed */}
      {success && (
        <div className="submit-overlay">
          <div className="submit-box">
            <svg className="checkmark-svg" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <p className="submit-text">Тест отправлен в Discord!</p>
            <p className="submit-subtext">Проверяй канал</p>
          </div>
        </div>
      )}

      <BanOverlay show={banned} reason={banReason} until={banUntil} />

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #0a0612;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .testlik-page {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          padding: 40px 32px 60px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% 8%, rgba(88, 101, 242, 0.25), transparent 45%),
            radial-gradient(ellipse at 85% 92%, rgba(0, 229, 255, 0.18), transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1), transparent 70%),
            linear-gradient(180deg, #0a0612 0%, #0d0718 50%, #0a0612 100%);
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .testlik-page.mounted { opacity: 1; }

        /* 🌸 Лепестки */
        .sakura-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }
        .petal {
          position: absolute;
          top: -30px;
          background: radial-gradient(circle at 30% 30%, #d0e0ff, #5865F2 60%, #3a44a8);
          border-radius: 50% 0 50% 50%;
          box-shadow: 0 0 12px rgba(88, 101, 242, 0.6);
          animation: fall linear infinite;
          will-change: transform;
        }
        .petal::before {
          content: '';
          position: absolute;
          inset: 2px;
          background: radial-gradient(circle at 70% 70%, rgba(255,255,255,0.5), transparent 60%);
          border-radius: inherit;
        }
        @keyframes fall {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); }
          100% { transform: translateY(120vh) translateX(100px) rotate(720deg); }
        }

        /* ✨ Ауры */
        .aura {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .aura-1 {
          width: 550px; height: 550px;
          background: #5865F2;
          top: -150px; left: -150px;
          opacity: 0.3;
          animation: floatAura 14s ease-in-out infinite;
        }
        .aura-2 {
          width: 450px; height: 450px;
          background: #00E5FF;
          bottom: -150px; right: -150px;
          opacity: 0.2;
          animation: floatAura 16s ease-in-out infinite reverse;
        }
        .aura-3 {
          width: 350px; height: 350px;
          background: #A855F7;
          top: 40%; right: 15%;
          opacity: 0.18;
          animation: floatAura 18s ease-in-out infinite;
        }
        @keyframes floatAura {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -60px) scale(1.15); }
        }

        /* 🈴 Углы */
        .corner-deco {
          position: fixed;
          color: rgba(196, 210, 255, 0.15);
          font-size: 130px;
          font-weight: 900;
          font-family: 'Noto Serif JP', 'Yu Mincho', serif;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          line-height: 1;
          animation: cornerGlow 6s ease-in-out infinite;
        }
        .corner-tl { top: 30px; left: 30px; }
        .corner-tr { top: 30px; right: 30px; }
        .corner-bl { bottom: 30px; left: 30px; }
        .corner-br { bottom: 30px; right: 30px; }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.35; }
        }

        /* 🔙 Кнопка назад */
        .back-float {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(15, 20, 45, 0.8);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(88, 101, 242, 0.5);
          border-radius: 12px;
          color: #A8B8FF;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
        }
        .back-float:hover {
          background: rgba(88, 101, 242, 0.25);
          border-color: #5865F2;
          color: #fff;
          transform: translateX(-3px);
          box-shadow: 0 8px 26px rgba(88, 101, 242, 0.5);
        }
        .back-arrow {
          font-size: 16px;
          transition: transform 0.25s;
        }
        .back-float:hover .back-arrow {
          transform: translateX(-3px);
        }

        /* 📦 Контент */
        .content-wrap {
          position: relative;
          z-index: 10;
          max-width: 780px;
          margin: 0 auto;
        }

        /* 🌟 HERO */
        .page-hero {
          text-align: center;
          margin-bottom: 36px;
          padding: 10px 0;
        }
        .hero-jp {
          color: #00E5FF;
          font-size: 14px;
          letter-spacing: 12px;
          font-weight: 500;
          margin-bottom: 14px;
          text-shadow: 0 0 20px rgba(0, 229, 255, 0.7);
          animation: titleGlow 3s ease-in-out infinite;
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(0, 229, 255, 0.7); }
          50% { text-shadow: 0 0 32px rgba(88, 101, 242, 0.9); }
        }
        .hero-title {
          color: #fff;
          font-size: 50px;
          font-weight: 900;
          letter-spacing: 1.5px;
          margin: 0;
          line-height: 1.1;
        }
        .title-accent {
          background: linear-gradient(90deg, #5865F2, #00E5FF, #A855F7, #5865F2);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 5s linear infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .hero-underline {
          width: 140px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00E5FF, #5865F2, transparent);
          margin: 18px auto 14px;
          border-radius: 2px;
          box-shadow: 0 0 16px rgba(88, 101, 242, 0.7);
        }
        .hero-sub {
          color: #8898c8;
          font-size: 14px;
          font-style: italic;
          margin: 0;
        }

        /* 🎴 Карточка */
        .form-card {
          position: relative;
          background: linear-gradient(160deg, rgba(20, 25, 55, 0.9) 0%, rgba(15, 18, 40, 0.95) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(88, 101, 242, 0.5);
          border-radius: 28px;
          padding: 60px 48px 32px;
          box-shadow:
            0 0 0 1px rgba(0, 229, 255, 0.12),
            0 30px 100px rgba(88, 101, 242, 0.3),
            0 0 140px rgba(0, 229, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: hidden;
          animation: cardIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-top-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 10px 24px;
          background: linear-gradient(90deg, rgba(88, 101, 242, 0.35), rgba(0, 229, 255, 0.3), rgba(168, 85, 247, 0.35));
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #fff;
          text-transform: uppercase;
        }

        .test-badge {
          display: inline-block;
          position: absolute;
          top: 46px;
          right: 24px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #5865F2, #00E5FF);
          color: #fff;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          box-shadow: 0 4px 20px rgba(88, 101, 242, 0.6);
          animation: badgePulse 2.5s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(88, 101, 242, 0.6); }
          50% { box-shadow: 0 4px 30px rgba(0, 229, 255, 0.9); }
        }

        .form-body {
          margin-top: 20px;
        }

        .form-group {
          margin-bottom: 22px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
        }

        .form-label {
          display: block;
          color: #8898c8;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(88, 101, 242, 0.3);
          color: #fff;
          border-radius: 10px;
          box-sizing: border-box;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.25s;
        }
        .form-input:focus {
          outline: none;
          border-color: #00E5FF;
          box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.15);
          background: rgba(88, 101, 242, 0.06);
        }
        .form-input::placeholder {
          color: #556;
        }
        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }
        select.form-input option {
          background: #0f1228;
          color: #fff;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ccc;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          padding: 4px 0;
        }
        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin: 0;
          accent-color: #00E5FF;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        @media (max-width: 500px) {
          .form-actions { flex-direction: column; }
        }

        .reset-btn {
          flex: 0 0 auto;
          padding: 15px 24px;
          background: rgba(255, 255, 255, 0.04);
          color: #aaa;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.25s;
          font-family: inherit;
        }
        .reset-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.3);
        }
        .reset-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-btn {
          flex: 1;
          padding: 15px;
          background: linear-gradient(135deg, #5865F2, #00E5FF);
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: inherit;
          box-shadow: 0 6px 24px rgba(88, 101, 242, 0.5);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(0, 229, 255, 0.6);
        }
        .submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .card-bottom {
          text-align: center;
          color: #7080b8;
          font-size: 12px;
          font-style: italic;
          padding-top: 22px;
          margin-top: 28px;
          border-top: 1px dashed rgba(88, 101, 242, 0.3);
          font-family: 'Noto Serif JP', serif;
          letter-spacing: 2px;
        }
        .quote-mark {
          color: #00E5FF;
          font-weight: 900;
          margin: 0 6px;
        }

        /* 📊 Статистика */
        .stats-strip {
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 16px;
          margin-top: 28px;
          padding: 24px 36px;
          background: rgba(15, 18, 40, 0.7);
          border: 1px solid rgba(88, 101, 242, 0.35);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(88, 101, 242, 0.15);
          animation: cardIn 0.8s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (max-width: 700px) {
          .stats-strip { flex-wrap: wrap; gap: 18px; padding: 18px; }
          .stat-sep { display: none; }
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          flex: 1;
          min-width: 80px;
        }
        .stat-emoji {
          font-size: 22px;
          margin-bottom: 5px;
          filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.7));
        }
        .stat-val {
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .stat-lbl {
          color: #7080b8;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .stat-sep {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, transparent, rgba(88, 101, 242, 0.6), transparent);
        }

        .page-footer {
          text-align: center;
          color: #556;
          font-size: 12px;
          margin-top: 28px;
          letter-spacing: 0.5px;
          font-style: italic;
        }
        .heart {
          color: #00E5FF;
          animation: heartbeat 1.4s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.18); }
        }

        /* 🎉 Оверлей успеха */
        .submit-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 5, 20, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: overlayIn 0.35s ease forwards;
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        .submit-box {
          background: linear-gradient(145deg, rgba(20, 25, 55, 0.98), rgba(12, 15, 30, 0.98));
          border: 1px solid rgba(0, 229, 255, 0.5);
          border-radius: 24px;
          padding: 48px 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 100px rgba(0, 229, 255, 0.25);
          animation: boxIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes boxIn {
          0% { transform: scale(0.6) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .checkmark-svg {
          width: 96px;
          height: 96px;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.6));
        }
        .checkmark-svg circle {
          stroke: #00E5FF;
          stroke-width: 2;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: strokeCircle 0.7s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark-svg path {
          stroke: #00E5FF;
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: strokeCheck 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.55s forwards;
        }
        @keyframes strokeCircle { to { stroke-dashoffset: 0; } }
        @keyframes strokeCheck { to { stroke-dashoffset: 0; } }
        .submit-text {
          color: #00E5FF;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 6px 0;
          opacity: 0;
          animation: textIn 0.45s ease 0.85s forwards;
        }
        .submit-subtext {
          color: #7080b8;
          font-size: 13px;
          margin: 0;
          opacity: 0;
          animation: textIn 0.45s ease 1s forwards;
        }
        @keyframes textIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* 📱 Мобильная адаптация */
        @media (max-width: 900px) {
          .testlik-page { padding: 20px 16px 40px; }
          .form-card { padding: 56px 24px 28px; border-radius: 22px; }
          .hero-title { font-size: 34px; }
          .hero-jp { letter-spacing: 6px; font-size: 12px; }
          .corner-deco { font-size: 70px; }
          .back-text { display: none; }
          .back-float { padding: 10px 12px; top: 16px; left: 16px; }
          .test-badge { top: 42px; right: 16px; font-size: 10px; padding: 5px 10px; }
        }
        @media (max-width: 500px) {
          .hero-title { font-size: 26px; }
          .hero-jp { letter-spacing: 4px; }
          .form-card { padding: 50px 16px 22px; }
          .corner-deco { font-size: 50px; opacity: 0.1; }
          .submit-box { padding: 32px 26px; }
        }
      `}</style>
    </>
  );
}
