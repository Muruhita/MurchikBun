import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const AUTHOR = {
  username: 'muruh1ta',
  displayName: 'Mura Kiratu',
  discordId: '1018113109346504744',
  email: 'murkilanki@gmail.com',
  avatar: 'https://i.pinimg.com/736x/57/48/10/5748107f528598de8e909b60ff7324aa.jpg',
  roles: ['Админ', 'Автор сия бота'],
  bio: 'Создатель и хранитель FIB Forms.'
};

export default function AuthorPage() {
  const router = useRouter();
  const [petals, setPetals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🌸 Лепестки сакуры
  useEffect(() => {
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 10,
      size: 10 + Math.random() * 16,
      rotate: Math.random() * 360,
      opacity: 0.35 + Math.random() * 0.55
    }));
    setPetals(generated);
    setTimeout(() => setMounted(true), 60);
  }, []);

  // 🎬 Глитч
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
    <>
      <Head>
        <title>About the Author · Mura Kiratu</title>
        <meta name="description" content="Об авторе Discord-бота FIB Forms" />
      </Head>

      <div className={`author-page ${mounted ? 'mounted' : ''}`}>
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
        <div className="aura aura-4" />

        {/* 🈴 Углы */}
        <div className="corner-deco corner-tl">作者</div>
        <div className="corner-deco corner-tr">桜</div>
        <div className="corner-deco corner-bl">夢</div>
        <div className="corner-deco corner-br">未来</div>

        {/* 📦 Контент */}
        <div className="content-wrap">

          {/* 🌟 HERO */}
          <div className="page-hero">
            <div className="hero-jp">作者について</div>
            <h1 className="hero-title">
              <span className="title-accent">About</span> the Author
            </h1>
            <div className="hero-underline" />
          </div>

          {/* 🎴 Карточка */}
          <div className="author-card">
            <div className="card-top-strip">
              <span>開発者</span>
              <span>·</span>
              <span>Developer</span>
              <span>·</span>
              <span>Разработчик</span>
            </div>

            <div className="card-grid">
              {/* ЛЕВАЯ КОЛОНКА */}
              <div className="left-col">
                <div className="avatar-block">
                  <div className="avatar-ring-outer" />
                  <div className="avatar-ring-inner" />
                  <div className={`avatar-wrap ${glitching ? 'glitch' : ''}`}>
                    {AUTHOR.avatar && !avatarError ? (
                      <img
                        src={AUTHOR.avatar}
                        alt="Author avatar"
                        className="avatar-img"
                        onError={() => setAvatarError(true)}
                      />
                    ) : null}
                    <div className={`avatar-fallback ${AUTHOR.avatar && !avatarError ? 'hidden' : ''}`}>村</div>
                  </div>
                  <div className="avatar-glow" />
                </div>

                <h2 className="name-jp">{AUTHOR.displayName}</h2>

                <div className="name-handle">
                  <span className="at-symbol">@</span>
                  <span className="handle-text">{AUTHOR.username}</span>
                  <span className="verified-badge" title="Verified">✓</span>
                </div>

                <div className="roles-row">
                  {AUTHOR.roles.map((role, i) => (
                    <span key={i} className={`role-chip role-${i}`}>
                      {i === 0 ? '👑' : '✍️'} {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* ПРАВАЯ КОЛОНКА */}
              <div className="right-col">
                <p className="bio">{AUTHOR.bio}</p>

                <div className="divider">
                  <span className="divider-line" />
                  <span className="divider-icon">❖</span>
                  <span className="divider-line" />
                </div>

                <div className="info-grid">
                  <button className="info-item" onClick={copyId} title="Скопировать ID">
                    <span className="info-label">Discord ID</span>
                    <span className="info-value">{AUTHOR.discordId}</span>
                    <span className="info-hint">{copied ? '✅ Скопировано' : 'Нажми, чтобы скопировать'}</span>
                  </button>

                  <a href={`mailto:${AUTHOR.email}`} className="info-item" title="Написать на email">
                    <span className="info-label">Email</span>
                    <span className="info-value">{AUTHOR.email}</span>
                    <span className="info-hint">📧 Отправить письмо</span>
                  </a>
                </div>

                <div className="actions-row">
                  <a
                    href={`https://discord.com/users/${AUTHOR.discordId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn discord"
                  >
                    💬 Написать в Discord
                  </a>
                  <button
                    className="action-btn back"
                    onClick={() => router.push('/dashboard')}
                  >
                    ↩ На главную
                  </button>
                </div>
              </div>
            </div>

            <div className="card-bottom">
              <span className="quote-mark">"</span>
              コードは芸術、心は炎
              <span className="quote-mark">"</span>
            </div>
          </div>

          {/* 📊 Статистика */}
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
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-emoji">🎌</div>
              <div className="stat-val">Japan</div>
              <div className="stat-lbl">vibe</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-emoji">🔥</div>
              <div className="stat-val">React</div>
              <div className="stat-lbl">stack</div>
            </div>
          </div>

          <p className="page-footer">
            Made with <span className="heart">♥</span> by{' '}
            <span className="author-sign">{AUTHOR.displayName}</span>
            <span className="japanese-sign"> · 村切る</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #0a0612;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .author-page {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          padding: 40px 32px 60px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 15% 8%, rgba(168, 85, 247, 0.22), transparent 45%),
            radial-gradient(ellipse at 85% 92%, rgba(255, 105, 180, 0.22), transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(88, 101, 242, 0.08), transparent 70%),
            linear-gradient(180deg, #0a0612 0%, #0d0718 50%, #0a0612 100%);
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .author-page.mounted {
          opacity: 1;
        }

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
          background: radial-gradient(circle at 30% 30%, #ffc5e0, #ff69b4 60%, #d1438d);
          border-radius: 50% 0 50% 50%;
          box-shadow: 0 0 12px rgba(255, 105, 180, 0.55);
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
          width: 600px; height: 600px;
          background: #A855F7;
          top: -150px; left: -150px;
          opacity: 0.28;
          animation: floatAura 14s ease-in-out infinite;
        }
        .aura-2 {
          width: 500px; height: 500px;
          background: #FF69B4;
          bottom: -150px; right: -150px;
          opacity: 0.25;
          animation: floatAura 16s ease-in-out infinite reverse;
        }
        .aura-3 {
          width: 400px; height: 400px;
          background: #00E5FF;
          top: 30%; right: 10%;
          opacity: 0.15;
          animation: floatAura 18s ease-in-out infinite;
        }
        .aura-4 {
          width: 450px; height: 450px;
          background: #5865F2;
          bottom: 20%; left: 5%;
          opacity: 0.18;
          animation: floatAura 20s ease-in-out infinite reverse;
        }
        @keyframes floatAura {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -60px) scale(1.15); }
        }

        /* 🈴 Углы */
        .corner-deco {
          position: fixed;
          color: rgba(196, 165, 240, 0.18);
          font-size: 140px;
          font-weight: 900;
          font-family: 'Noto Serif JP', 'Yu Mincho', 'MS Mincho', serif;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          animation: cornerGlow 6s ease-in-out infinite;
          line-height: 1;
        }
        .corner-tl { top: 30px; left: 30px; }
        .corner-tr { top: 30px; right: 30px; }
        .corner-bl { bottom: 30px; left: 30px; }
        .corner-br { bottom: 30px; right: 30px; }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }

        /* 📦 Контент */
        .content-wrap {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* 🌟 HERO */
        .page-hero {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0 10px;
        }
        .hero-jp {
          color: #ff69b4;
          font-size: 15px;
          letter-spacing: 10px;
          font-weight: 500;
          margin-bottom: 12px;
          text-shadow: 0 0 20px rgba(255, 105, 180, 0.6);
          animation: titleGlow 3s ease-in-out infinite;
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 105, 180, 0.6); }
          50% { text-shadow: 0 0 32px rgba(168, 85, 247, 0.85); }
        }
        .hero-title {
          color: #fff;
          font-size: 56px;
          font-weight: 900;
          letter-spacing: 1.5px;
          margin: 0;
          line-height: 1.1;
        }
        .title-accent {
          background: linear-gradient(90deg, #A855F7, #FF69B4, #00E5FF, #A855F7);
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
          width: 160px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FF69B4, #A855F7, #00E5FF, transparent);
          margin: 20px auto 0;
          border-radius: 2px;
          box-shadow: 0 0 16px rgba(255, 105, 180, 0.6);
        }

        /* 🎴 Карточка */
        .author-card {
          position: relative;
          background: linear-gradient(160deg, rgba(30, 15, 45, 0.85) 0%, rgba(20, 10, 35, 0.92) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 30px;
          padding: 56px 60px 36px;
          box-shadow:
            0 0 0 1px rgba(255, 105, 180, 0.15),
            0 30px 100px rgba(168, 85, 247, 0.3),
            0 0 160px rgba(255, 105, 180, 0.18),
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
          background: linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.3), rgba(0, 229, 255, 0.3));
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

        .card-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 70px;
          align-items: center;
          margin-top: 12px;
        }
        @media (max-width: 900px) {
          .card-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
        }

        /* ─── ЛЕВАЯ КОЛОНКА ─── */
        .left-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .avatar-block {
          position: relative;
          width: 220px;
          height: 220px;
          margin-bottom: 30px;
        }
        .avatar-ring-outer {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #A855F7, #FF69B4, #00E5FF, #A855F7);
          animation: spinRing 8s linear infinite;
          filter: blur(0.5px);
          opacity: 0.9;
        }
        .avatar-ring-inner {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          background: conic-gradient(from 180deg, #FF69B4, #A855F7, #00E5FF, #FF69B4);
          animation: spinRing 8s linear infinite reverse;
          opacity: 0.65;
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
          border: 4px solid #0a0612;
          z-index: 2;
        }
        .avatar-wrap.glitch {
          animation: avatarGlitch 0.4s steps(2);
        }
        @keyframes avatarGlitch {
          0% { filter: hue-rotate(0deg); transform: translateX(0); }
          25% { filter: hue-rotate(90deg); transform: translateX(-4px); }
          50% { filter: hue-rotate(-60deg); transform: translateX(4px); }
          75% { filter: hue-rotate(30deg); transform: translateX(-2px); }
          100% { filter: hue-rotate(0deg); transform: translateX(0); }
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .avatar-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 84px;
          font-family: 'Noto Serif JP', serif;
          color: #FF69B4;
          background: radial-gradient(circle, #2a1538, #1a0d25);
          z-index: 1;
        }
        .avatar-fallback.hidden { display: none; }
        .avatar-glow {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.4), transparent 60%);
          z-index: 1;
          animation: pulseGlow 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }

        .name-jp {
          font-size: 34px;
          font-weight: 900;
          color: #fff;
          margin: 0 0 8px;
          letter-spacing: 0.5px;
          text-align: center;
          text-shadow:
            0 0 22px rgba(255, 105, 180, 0.55),
            0 0 44px rgba(168, 85, 247, 0.35);
        }
        .name-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #C4A5F0;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 22px;
        }
        .at-symbol {
          color: #FF69B4;
          font-weight: 800;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #5865F2, #A855F7);
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 0 14px rgba(168, 85, 247, 0.8);
        }

        .roles-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .role-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 22px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: 1px solid;
        }
        .role-0 {
          background: rgba(255, 215, 0, 0.12);
          border-color: rgba(255, 215, 0, 0.55);
          color: #FFD700;
          box-shadow: 0 0 24px rgba(255, 215, 0, 0.25);
        }
        .role-1 {
          background: rgba(255, 105, 180, 0.12);
          border-color: rgba(255, 105, 180, 0.55);
          color: #FF8FC7;
          box-shadow: 0 0 24px rgba(255, 105, 180, 0.25);
        }

        /* ─── ПРАВАЯ КОЛОНКА ─── */
        .right-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bio {
          color: #d8c8e8;
          font-size: 18px;
          line-height: 1.8;
          margin: 0 0 24px;
          font-style: italic;
          text-align: left;
        }
        @media (max-width: 900px) {
          .bio { text-align: center; }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 8px 0 26px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.55), transparent);
        }
        .divider-icon {
          color: #FF69B4;
          font-size: 16px;
          text-shadow: 0 0 14px rgba(255, 105, 180, 0.9);
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 26px;
        }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 18px 22px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(168, 85, 247, 0.28);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
          color: inherit;
          font-family: inherit;
          text-decoration: none;
        }
        .info-item:hover {
          background: rgba(168, 85, 247, 0.12);
          border-color: rgba(255, 105, 180, 0.65);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(168, 85, 247, 0.3);
        }
        .info-label {
          color: #888;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .info-value {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          word-break: break-all;
        }
        .info-hint {
          color: #A855F7;
          font-size: 11px;
          opacity: 0.85;
        }

        .actions-row {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 600px) {
          .actions-row { flex-direction: column; }
        }
        .action-btn {
          flex: 1;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid;
          font-size: 15px;
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
          box-shadow: 0 6px 24px rgba(88, 101, 242, 0.45);
        }
        .action-btn.discord:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(168, 85, 247, 0.65);
        }
        .action-btn.back {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.18);
          color: #ccc;
        }
        .action-btn.back:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.35);
          color: #fff;
          transform: translateY(-3px);
        }

        .card-bottom {
          text-align: center;
          color: #a888c8;
          font-size: 13px;
          font-style: italic;
          padding-top: 24px;
          margin-top: 32px;
          border-top: 1px dashed rgba(168, 85, 247, 0.25);
          font-family: 'Noto Serif JP', serif;
          letter-spacing: 1.5px;
        }
        .quote-mark {
          color: #FF69B4;
          font-weight: 900;
          margin: 0 6px;
        }

        /* 📊 Статистика */
        .stats-strip {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 16px;
          margin-top: 32px;
          padding: 26px 40px;
          background: rgba(20, 10, 35, 0.65);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 22px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(168, 85, 247, 0.15);
          animation: cardIn 0.8s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (max-width: 700px) {
          .stats-strip {
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
          }
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
          font-size: 24px;
          margin-bottom: 6px;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.6));
        }
        .stat-val {
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .stat-lbl {
          color: #888;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .stat-sep {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.55), transparent);
        }

        /* 🖋️ Footer */
        .page-footer {
          position: relative;
          z-index: 10;
          text-align: center;
          color: #666;
          font-size: 13px;
          margin-top: 32px;
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
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.18); }
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

        /* 📱 Мобильная адаптация */
        @media (max-width: 900px) {
          .author-page { padding: 20px 16px 40px; }
          .author-card { padding: 44px 24px 28px; border-radius: 24px; }
          .hero-title { font-size: 36px; }
          .hero-jp { letter-spacing: 6px; font-size: 13px; }
          .name-jp { font-size: 26px; }
          .corner-deco { font-size: 70px; }
          .avatar-block { width: 160px; height: 160px; }
          .avatar-fallback { font-size: 60px; }
        }
        @media (max-width: 500px) {
          .hero-title { font-size: 28px; }
          .hero-jp { letter-spacing: 4px; }
          .author-card { padding: 36px 18px 22px; }
          .corner-deco { font-size: 50px; opacity: 0.1; }
          .bio { font-size: 15px; }
        }
      `}</style>
    </>
  );
}
