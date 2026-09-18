import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const AUTHOR = {
  username: 'muruh1ta',
  displayName: 'Mura Kiratu',
  discordId: '1018113109346504744',
  avatar: 'https://cdn.discordapp.com/avatars/1018113109346504744/0b9b2f95e6a2b4b8a1b5a2b0b2b2b2b2.png',
  email: 'murkilanki@gmail.com',
  roles: ['Админ', 'Автор сия бота'],
  bio: 'Создатель и хранитель FIB Forms. Пишу код ночами, чтобы ваши заявки летали в Discord быстрее, чем сакура падает с ветки.'
};

export default function AuthorPage() {
  const router = useRouter();
  const [petals, setPetals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [glitching, setGlitching] = useState(false);

  // 🌸 Генерируем лепестки сакуры
  useEffect(() => {
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 10 + Math.random() * 14,
      rotate: Math.random() * 360,
      opacity: 0.4 + Math.random() * 0.5
    }));
    setPetals(generated);
  }, []);

  // Глитч на аватарке раз в ~8 сек
  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 400);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(AUTHOR.discordId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };

  return (
    <Layout>
      <div className="author-page">
        {/* 🌸 Фоновые лепестки сакуры */}
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

        {/* 🎴 Свечение по центру */}
        <div className="aura aura-1" />
        <div className="aura aura-2" />
        <div className="aura aura-3" />

        {/* Иероглифы-декор по углам */}
        <div className="corner-deco corner-tl">作者</div>
        <div className="corner-deco corner-tr">桜</div>
        <div className="corner-deco corner-bl">夢</div>
        <div className="corner-deco corner-br">未来</div>

        <div className="content-wrapper">
          {/* 🌟 Заголовок */}
          <div className="title-block">
            <div className="title-jp">作者について</div>
            <h1 className="title-en">
              <span className="title-accent">About</span> the Author
            </h1>
            <div className="title-underline" />
          </div>

          {/* 🎴 Карточка автора */}
          <div className="author-card">
            {/* Верхняя полоса с иероглифами */}
            <div className="card-top-strip">
              <span>開発者</span>
              <span>·</span>
              <span>Developer</span>
              <span>·</span>
              <span>Разработчик</span>
            </div>

            {/* Аватар с вращающимся кольцом */}
            <div className="avatar-block">
              <div className="avatar-ring-outer" />
              <div className="avatar-ring-inner" />
              <div className={`avatar-wrap ${glitching ? 'glitch' : ''}`}>
                <img
                  src={AUTHOR.avatar}
                  alt="Author avatar"
                  className="avatar-img"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="avatar-fallback">村</div>
              </div>
              <div className="avatar-glow" />
            </div>

            {/* Имя */}
            <h2 className="name-jp">Mura Kiratu</h2>
            <div className="name-handle">
              <span className="at-symbol">@</span>
              <span className="handle-text">{AUTHOR.username}</span>
              <span className="verified-badge" title="Verified">✓</span>
            </div>

            {/* Роли */}
            <div className="roles-row">
              {AUTHOR.roles.map((role, i) => (
                <span key={i} className={`role-chip role-${i}`}>
                  {i === 0 ? '👑' : '✍️'} {role}
                </span>
              ))}
            </div>

            {/* Описание */}
            <p className="bio">{AUTHOR.bio}</p>

            {/* Разделитель */}
            <div className="divider">
              <span className="divider-line" />
              <span className="divider-icon">❖</span>
              <span className="divider-line" />
            </div>

            {/* Инфо-блоки */}
            <div className="info-grid">
              <button className="info-item" onClick={copyId} title="Скопировать ID">
                <span className="info-label">Discord ID</span>
                <span className="info-value">{AUTHOR.discordId}</span>
                <span className="info-hint">{copied ? '✅ Скопировано' : 'Нажми, чтобы скопировать'}</span>
              </button>

              <a
                href={`mailto:${AUTHOR.email}`}
                className="info-item"
                title="Написать на email"
              >
                <span className="info-label">Email</span>
                <span className="info-value">{AUTHOR.email}</span>
                <span className="info-hint">📧 Отправить письмо</span>
              </a>
            </div>

            {/* Кнопки */}
            <div className="actions-row">
              <a
                href={`https://discord.com/users/${AUTHOR.discordId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn discord"
              >
                <span>💬 Написать в Discord</span>
              </a>
              <button
                className="action-btn back"
                onClick={() => router.push('/dashboard')}
              >
                <span>↩ На главную</span>
              </button>
            </div>

            {/* Нижняя подпись */}
            <div className="card-bottom">
              <span className="quote-mark">"</span>
              コードは芸術、心は炎
              <span className="quote-mark">"</span>
            </div>
          </div>

          {/* Нижняя панель со статистикой */}
          <div className="stats-strip">
            <div className="stat">
              <div className="stat-emoji">🌸</div>
              <div className="stat-val">FIB Forms</div>
              <div className="stat-lbl">проект</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-emoji">⚡</div>
              <div className="stat-val">24/7</div>
              <div className="stat-lbl">онлайн</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-emoji">💜</div>
              <div className="stat-val">∞</div>
              <div className="stat-lbl">преданность</div>
            </div>
          </div>

          {/* Подпись внизу */}
          <p className="page-footer">
            Made with <span className="heart">♥</span> by{' '}
            <span className="author-sign">{AUTHOR.displayName}</span>
            <span className="japanese-sign"> · 村切る</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .author-page {
          position: relative;
          min-height: calc(100vh - 100px);
          padding: 40px 20px 60px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 20% 10%, rgba(168, 85, 247, 0.18), transparent 55%),
            radial-gradient(ellipse at 80% 90%, rgba(255, 105, 180, 0.18), transparent 55%),
            radial-gradient(ellipse at 50% 50%, rgba(88, 101, 242, 0.08), transparent 70%),
            linear-gradient(180deg, #0a0612 0%, #0d0718 50%, #0a0612 100%);
        }

        /* 🌸 Лепестки сакуры */
        .sakura-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }
        .petal {
          position: absolute;
          top: -30px;
          background: radial-gradient(circle at 30% 30%, #ffc5e0, #ff69b4 60%, #d1438d);
          border-radius: 50% 0 50% 50%;
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.5);
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
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
          }
          100% {
            transform: translateY(120vh) translateX(80px) rotate(720deg);
          }
        }

        /* ✨ Ауры-свечения */
        .aura {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }
        .aura-1 {
          width: 500px; height: 500px;
          background: #A855F7;
          top: -100px; left: -100px;
          opacity: 0.25;
          animation: floatAura 12s ease-in-out infinite;
        }
        .aura-2 {
          width: 400px; height: 400px;
          background: #FF69B4;
          bottom: -100px; right: -100px;
          opacity: 0.22;
          animation: floatAura 14s ease-in-out infinite reverse;
        }
        .aura-3 {
          width: 300px; height: 300px;
          background: #00E5FF;
          top: 40%; left: 55%;
          opacity: 0.12;
          animation: floatAura 16s ease-in-out infinite;
        }
        @keyframes floatAura {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.15); }
        }

        /* 🈴 Угловые иероглифы */
        .corner-deco {
          position: absolute;
          color: rgba(196, 165, 240, 0.18);
          font-size: 90px;
          font-weight: 900;
          font-family: 'Noto Serif JP', 'Yu Mincho', 'MS Mincho', serif;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          animation: cornerGlow 6s ease-in-out infinite;
        }
        .corner-tl { top: 20px; left: 20px; }
        .corner-tr { top: 20px; right: 20px; }
        .corner-bl { bottom: 20px; left: 20px; }
        .corner-br { bottom: 20px; right: 20px; }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }

        /* 📦 Контент-обёртка */
        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 720px;
          margin: 0 auto;
        }

        /* 🌟 Заголовок */
        .title-block {
          text-align: center;
          margin-bottom: 32px;
        }
        .title-jp {
          color: #ff69b4;
          font-size: 14px;
          letter-spacing: 8px;
          font-weight: 500;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
          animation: titleGlow 3s ease-in-out infinite;
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 105, 180, 0.6); }
          50% { text-shadow: 0 0 30px rgba(168, 85, 247, 0.8); }
        }
        .title-en {
          color: #fff;
          font-size: 36px;
          font-weight: 900;
          letter-spacing: 1px;
          margin: 0;
        }
        .title-accent {
          background: linear-gradient(90deg, #A855F7, #FF69B4, #00E5FF);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s linear infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .title-underline {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FF69B4, #A855F7, transparent);
          margin: 16px auto 0;
          border-radius: 2px;
        }

        /* 🎴 Карточка автора */
        .author-card {
          position: relative;
          background:
            linear-gradient(160deg, rgba(30, 15, 45, 0.85) 0%, rgba(20, 10, 35, 0.9) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 26px;
          padding: 40px 32px 32px;
          box-shadow:
            0 0 0 1px rgba(255, 105, 180, 0.15),
            0 30px 80px rgba(168, 85, 247, 0.25),
            0 0 120px rgba(255, 105, 180, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: hidden;
          animation: cardIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Верхняя полоса */
        .card-top-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 8px 24px;
          background: linear-gradient(90deg, rgba(168, 85, 247, 0.25), rgba(255, 105, 180, 0.25), rgba(0, 229, 255, 0.25));
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #fff;
          text-transform: uppercase;
        }

        /* 💫 Аватар */
        .avatar-block {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 20px auto 24px;
        }
        .avatar-ring-outer {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #A855F7, #FF69B4, #00E5FF, #A855F7);
          animation: spinRing 8s linear infinite;
          filter: blur(0.5px);
          opacity: 0.9;
        }
        .avatar-ring-inner {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: conic-gradient(from 180deg, #FF69B4, #A855F7, #00E5FF, #FF69B4);
          animation: spinRing 8s linear infinite reverse;
          opacity: 0.6;
        }
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
        .avatar-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: #1a0d25;
          border: 3px solid #0a0612;
          z-index: 2;
          transition: filter 0.2s;
        }
        .avatar-wrap.glitch {
          animation: avatarGlitch 0.4s steps(2);
        }
        @keyframes avatarGlitch {
          0% { filter: hue-rotate(0deg); transform: translateX(0); }
          25% { filter: hue-rotate(90deg); transform: translateX(-3px); }
          50% { filter: hue-rotate(-60deg); transform: translateX(3px); }
          75% { filter: hue-rotate(30deg); transform: translateX(-2px); }
          100% { filter: hue-rotate(0deg); transform: translateX(0); }
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          font-family: 'Noto Serif JP', serif;
          color: #FF69B4;
          background: radial-gradient(circle, #2a1538, #1a0d25);
          z-index: -1;
        }
        .avatar-glow {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.35), transparent 60%);
          z-index: 1;
          animation: pulseGlow 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* ✨ Имя */
        .name-jp {
          text-align: center;
          font-size: 30px;
          font-weight: 900;
          color: #fff;
          margin: 0 0 8px;
          letter-spacing: 0.5px;
          text-shadow:
            0 0 20px rgba(255, 105, 180, 0.5),
            0 0 40px rgba(168, 85, 247, 0.3);
        }
        .name-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #C4A5F0;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 18px;
        }
        .at-symbol {
          color: #FF69B4;
          font-weight: 800;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #5865F2, #A855F7);
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.7);
        }

        /* 🏷️ Роли */
        .roles-row {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .role-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: 1px solid;
        }
        .role-0 {
          background: rgba(255, 215, 0, 0.12);
          border-color: rgba(255, 215, 0, 0.55);
          color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
        }
        .role-1 {
          background: rgba(255, 105, 180, 0.12);
          border-color: rgba(255, 105, 180, 0.55);
          color: #FF8FC7;
          box-shadow: 0 0 20px rgba(255, 105, 180, 0.2);
        }

        /* 📖 Bio */
        .bio {
          text-align: center;
          color: #b8a8c8;
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 24px;
          padding: 0 10px;
          font-style: italic;
        }

        /* ── Разделитель */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
        }
        .divider-icon {
          color: #FF69B4;
          font-size: 14px;
          text-shadow: 0 0 12px rgba(255, 105, 180, 0.8);
        }

        /* ℹ️ Инфо-сетка */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 500px) {
          .info-grid { grid-template-columns: 1fr; }
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
          color: inherit;
          font-family: inherit;
          text-decoration: none;
        }
        .info-item:hover {
          background: rgba(168, 85, 247, 0.1);
          border-color: rgba(255, 105, 180, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.25);
        }
        .info-label {
          color: #888;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .info-value {
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          word-break: break-all;
        }
        .info-hint {
          color: #A855F7;
          font-size: 11px;
          opacity: 0.8;
        }

        /* 🎯 Кнопки */
        .actions-row {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        @media (max-width: 500px) {
          .actions-row { flex-direction: column; }
        }
        .action-btn {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }
        .action-btn.discord {
          background: linear-gradient(135deg, #5865F2, #A855F7);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 20px rgba(88, 101, 242, 0.4);
        }
        .action-btn.discord:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(168, 85, 247, 0.6);
        }
        .action-btn.back {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.15);
          color: #ccc;
        }
        .action-btn.back:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
          color: #fff;
          transform: translateY(-2px);
        }

        /* Подпись внутри карточки */
        .card-bottom {
          text-align: center;
          color: #a888c8;
          font-size: 12px;
          font-style: italic;
          padding-top: 16px;
          border-top: 1px dashed rgba(168, 85, 247, 0.2);
          font-family: 'Noto Serif JP', serif;
          letter-spacing: 1px;
        }
        .quote-mark {
          color: #FF69B4;
          font-weight: 900;
          margin: 0 4px;
        }

        /* 📊 Статистика под карточкой */
        .stats-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-top: 30px;
          padding: 20px;
          background: rgba(20, 10, 35, 0.6);
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 18px;
          backdrop-filter: blur(10px);
          animation: cardIn 0.8s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (max-width: 500px) {
          .stats-strip {
            flex-wrap: wrap;
            gap: 12px;
          }
          .stat-sep { display: none; }
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 70px;
        }
        .stat-emoji {
          font-size: 20px;
          margin-bottom: 4px;
          filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.5));
        }
        .stat-val {
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .stat-lbl {
          color: #888;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .stat-sep {
          width: 1px;
          height: 30px;
          background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.5), transparent);
        }

        /* 🖋️ Подпись внизу страницы */
        .page-footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 24px;
          letter-spacing: 0.5px;
          font-style: italic;
        }
        .heart {
          color: #FF69B4;
          animation: heartbeat 1.4s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.25); }
          50% { transform: scale(1); }
          75% { transform: scale(1.15); }
        }
        .author-sign {
          color: #C4A5F0;
          font-weight: 600;
        }
        .japanese-sign {
          color: #A855F7;
          font-family: 'Noto Serif JP', serif;
          opacity: 0.7;
        }

        /* Мобильная адаптация */
        @media (max-width: 600px) {
          .author-page { padding: 20px 12px 40px; }
          .author-card { padding: 32px 20px 24px; }
          .title-en { font-size: 24px; }
          .name-jp { font-size: 22px; }
          .corner-deco { font-size: 50px; }
          .avatar-block { width: 120px; height: 120px; }
          .avatar-fallback { font-size: 44px; }
        }
      `}</style>
    </Layout>
  );
}
