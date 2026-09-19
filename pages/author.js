import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const AUTHOR = {
  username: 'muruh1ta',
  displayName: 'Mura Kiratu',
  discordId: '1018113109346504744',
  email: 'murkilanki@gmail.com',
  avatar: 'https://i.pinimg.com/736x/8f/c7/20/8fc7201fb1ee4228df360fa848395597.jpg',
  roles: ['Админ', 'Автор сия бота'],
  bio: 'Создатель и хранитель FIB Forms.'
};

// 🎨 Темы
const THEMES = {
  sakura: {
    name: 'Sakura',
    emoji: '🌸',
    bgStart: '#0a0612',
    bgMid: '#0d0718',
    aura1: '168, 85, 247',
    aura2: '255, 105, 180',
    aura3: '0, 229, 255',
    aura4: '88, 101, 242',
    accent1: '#A855F7',
    accent2: '#FF69B4',
    accent3: '#00E5FF',
    petalA: '#ffc5e0',
    petalB: '#ff69b4',
    petalC: '#d1438d',
    petalGlow: 'rgba(255, 105, 180, 0.55)',
    cornerColor: 'rgba(196, 165, 240, 0.18)',
    cardBorder: 'rgba(168, 85, 247, 0.4)',
    nameGlow: 'rgba(255, 105, 180, 0.55)',
    role0: '#FFD700',
    role1: '#FF8FC7'
  },
  ocean: {
    name: 'Ocean',
    emoji: '🌊',
    bgStart: '#04101f',
    bgMid: '#061a2e',
    aura1: '0, 119, 255',
    aura2: '0, 229, 255',
    aura3: '88, 101, 242',
    aura4: '0, 180, 200',
    accent1: '#0077FF',
    accent2: '#00E5FF',
    accent3: '#5865F2',
    petalA: '#c5e4ff',
    petalB: '#00b8ff',
    petalC: '#0066cc',
    petalGlow: 'rgba(0, 184, 255, 0.55)',
    cornerColor: 'rgba(160, 200, 240, 0.18)',
    cardBorder: 'rgba(0, 184, 255, 0.4)',
    nameGlow: 'rgba(0, 184, 255, 0.55)',
    role0: '#7DD3FC',
    role1: '#00E5FF'
  },
  sunset: {
    name: 'Sunset',
    emoji: '🔥',
    bgStart: '#1a0805',
    bgMid: '#2a0f08',
    aura1: '255, 100, 50',
    aura2: '255, 180, 60',
    aura3: '255, 60, 120',
    aura4: '200, 40, 60',
    accent1: '#FF6428',
    accent2: '#FFB43C',
    accent3: '#FF3C78',
    petalA: '#ffd7a5',
    petalB: '#ff7a3c',
    petalC: '#b83617',
    petalGlow: 'rgba(255, 122, 60, 0.55)',
    cornerColor: 'rgba(255, 200, 150, 0.18)',
    cardBorder: 'rgba(255, 122, 60, 0.4)',
    nameGlow: 'rgba(255, 122, 60, 0.55)',
    role0: '#FFD700',
    role1: '#FF8A4C'
  },
  night: {
    name: 'Night',
    emoji: '🌙',
    bgStart: '#050510',
    bgMid: '#0a0a1f',
    aura1: '100, 100, 255',
    aura2: '150, 100, 255',
    aura3: '80, 80, 200',
    aura4: '50, 50, 150',
    accent1: '#7C7CFF',
    accent2: '#A87CFF',
    accent3: '#5050C8',
    petalA: '#b8b8ff',
    petalB: '#7c7cff',
    petalC: '#3a3a8a',
    petalGlow: 'rgba(124, 124, 255, 0.55)',
    cornerColor: 'rgba(180, 180, 240, 0.18)',
    cardBorder: 'rgba(124, 124, 255, 0.4)',
    nameGlow: 'rgba(124, 124, 255, 0.55)',
    role0: '#B0B0FF',
    role1: '#A87CFF'
  }
};

// 🈴 Иероглифы вокруг аватарки
const ORBIT_SYMBOLS = [
  { char: '心', meaning: 'heart', angle: 0 },
  { char: '技', meaning: 'skill', angle: 60 },
  { char: '夢', meaning: 'dream', angle: 120 },
  { char: '炎', meaning: 'flame', angle: 180 },
  { char: '力', meaning: 'power', angle: 240 },
  { char: '光', meaning: 'light', angle: 300 }
];

export default function AuthorPage() {
  const router = useRouter();
  const [petals, setPetals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [themeKey, setThemeKey] = useState('sakura');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // 🌸 Лепестки
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

  // 🎨 Загрузка темы из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('author-theme');
      if (saved && THEMES[saved]) setThemeKey(saved);
    } catch (e) {}
  }, []);

  // 🎨 Применение темы к CSS-переменным
  useEffect(() => {
    const t = THEMES[themeKey];
    if (!t) return;
    document.documentElement.style.setProperty('--bg-start', t.bgStart);
    document.documentElement.style.setProperty('--bg-mid', t.bgMid);
    document.documentElement.style.setProperty('--aura-1', t.aura1);
    document.documentElement.style.setProperty('--aura-2', t.aura2);
    document.documentElement.style.setProperty('--aura-3', t.aura3);
    document.documentElement.style.setProperty('--aura-4', t.aura4);
    document.documentElement.style.setProperty('--accent-1', t.accent1);
    document.documentElement.style.setProperty('--accent-2', t.accent2);
    document.documentElement.style.setProperty('--accent-3', t.accent3);
    document.documentElement.style.setProperty('--petal-a', t.petalA);
    document.documentElement.style.setProperty('--petal-b', t.petalB);
    document.documentElement.style.setProperty('--petal-c', t.petalC);
    document.documentElement.style.setProperty('--petal-glow', t.petalGlow);
    document.documentElement.style.setProperty('--corner-color', t.cornerColor);
    document.documentElement.style.setProperty('--card-border', t.cardBorder);
    document.documentElement.style.setProperty('--name-glow', t.nameGlow);
    document.documentElement.style.setProperty('--role-0', t.role0);
    document.documentElement.style.setProperty('--role-1', t.role1);
    try { localStorage.setItem('author-theme', themeKey); } catch (e) {}
  }, [themeKey]);

  // 🎬 Глитч
  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 400);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // 🎨 Переключение темы
  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    const currentIdx = keys.indexOf(themeKey);
    const nextIdx = (currentIdx + 1) % keys.length;
    setThemeKey(keys[nextIdx]);
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(AUTHOR.discordId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };

  const currentTheme = THEMES[themeKey];

  return (
    <>
      <Head>
        <title>About the Author · Mura Kiratu</title>
        <meta name="description" content="Об авторе Discord-бота FIB Forms" />
      </Head>

      <div className={`author-page theme-${themeKey} ${mounted ? 'mounted' : ''}`}>
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

        {/* 🎨 Переключатель тем */}
        <button
          className="theme-switcher"
          onClick={cycleTheme}
          onMouseEnter={() => setShowThemeMenu(true)}
          onMouseLeave={() => setShowThemeMenu(false)}
          title={`Тема: ${currentTheme.name}`}
        >
          <span className="theme-emoji">{currentTheme.emoji}</span>
          <span className="theme-label">{currentTheme.name}</span>
        </button>

        {showThemeMenu && (
          <div
            className="theme-menu"
            onMouseEnter={() => setShowThemeMenu(true)}
            onMouseLeave={() => setShowThemeMenu(false)}
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <div
                key={key}
                className={`theme-option ${themeKey === key ? 'active' : ''}`}
                onClick={() => setThemeKey(key)}
              >
                <span className="theme-option-emoji">{t.emoji}</span>
                <span className="theme-option-name">{t.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* 📦 Контент */}
        <div className="content-wrap">
          <div className="page-hero">
            <div className="hero-jp">作者について</div>
            <h1 className="hero-title">
              <span className="title-accent">About</span> the Author
            </h1>
            <div className="hero-underline" />
          </div>

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
                  {/* 🈴 Вращающиеся иероглифы вокруг аватарки */}
                  <div className="orbit-ring">
                    {ORBIT_SYMBOLS.map((s, i) => (
                      <div
                        key={i}
                        className="orbit-symbol"
                        style={{
                          transform: `rotate(${s.angle}deg) translateY(-175px) rotate(-${s.angle}deg)`,
                          animationDelay: `${i * 0.5}s`
                        }}
                        title={s.meaning}
                      >
                        {s.char}
                      </div>
                    ))}
                  </div>

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
          background: var(--bg-start, #0a0612);
          overflow-x: hidden;
          transition: background 0.6s ease;
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
            radial-gradient(ellipse at 15% 8%, rgba(var(--aura-1), 0.22), transparent 45%),
            radial-gradient(ellipse at 85% 92%, rgba(var(--aura-2), 0.22), transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(var(--aura-4), 0.08), transparent 70%),
            linear-gradient(180deg, var(--bg-start) 0%, var(--bg-mid) 50%, var(--bg-start) 100%);
          opacity: 0;
          transition: opacity 0.6s ease, background 0.8s ease;
        }
        .author-page.mounted { opacity: 1; }

        /* 🎨 Переключатель тем */
        .theme-switcher {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          letter-spacing: 0.5px;
        }
        .theme-switcher:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .theme-emoji {
          font-size: 18px;
          filter: drop-shadow(0 0 8px currentColor);
        }
        .theme-label {
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.9;
        }
        @media (max-width: 500px) {
          .theme-label { display: none; }
          .theme-switcher { padding: 10px 12px; }
        }

        .theme-menu {
          position: fixed;
          top: 78px;
          right: 24px;
          z-index: 101;
          background: rgba(15, 15, 25, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          padding: 8px;
          min-width: 160px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
          animation: menuIn 0.25s ease;
        }
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .theme-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          cursor: pointer;
          color: #ccc;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          font-family: inherit;
        }
        .theme-option:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }
        .theme-option.active {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .theme-option.active::after {
          content: '✓';
          margin-left: auto;
          color: #4CAF50;
          font-weight: 900;
        }
        .theme-option-emoji { font-size: 15px; }
        .theme-option-name { flex: 1; }

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
          background: radial-gradient(circle at 30% 30%, var(--petal-a), var(--petal-b) 60%, var(--petal-c));
          border-radius: 50% 0 50% 50%;
          box-shadow: 0 0 12px var(--petal-glow);
          animation: fall linear infinite;
          will-change: transform;
          transition: background 0.8s ease, box-shadow 0.8s ease;
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
          transition: background 0.8s ease;
        }
        .aura-1 {
          width: 600px; height: 600px;
          background: rgb(var(--aura-1));
          top: -150px; left: -150px;
          opacity: 0.28;
          animation: floatAura 14s ease-in-out infinite;
        }
        .aura-2 {
          width: 500px; height: 500px;
          background: rgb(var(--aura-2));
          bottom: -150px; right: -150px;
          opacity: 0.25;
          animation: floatAura 16s ease-in-out infinite reverse;
        }
        .aura-3 {
          width: 400px; height: 400px;
          background: rgb(var(--aura-3));
          top: 30%; right: 10%;
          opacity: 0.15;
          animation: floatAura 18s ease-in-out infinite;
        }
        .aura-4 {
          width: 450px; height: 450px;
          background: rgb(var(--aura-4));
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
          color: var(--corner-color);
          font-size: 140px;
          font-weight: 900;
          font-family: 'Noto Serif JP', 'Yu Mincho', 'MS Mincho', serif;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          animation: cornerGlow 6s ease-in-out infinite;
          line-height: 1;
          transition: color 0.8s ease;
        }
        .corner-tl { top: 30px; left: 30px; }
        .corner-tr { top: 30px; right: 30px; }
        .corner-bl { bottom: 30px; left: 30px; }
        .corner-br { bottom: 30px; right: 30px; }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }

        .content-wrap {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-hero {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0 10px;
        }
        .hero-jp {
          color: var(--accent-2);
          font-size: 15px;
          letter-spacing: 10px;
          font-weight: 500;
          margin-bottom: 12px;
          text-shadow: 0 0 20px var(--name-glow);
          animation: titleGlow 3s ease-in-out infinite;
          transition: color 0.8s ease;
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px var(--name-glow); }
          50% { text-shadow: 0 0 32px rgba(var(--aura-1), 0.85); }
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
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-3), var(--accent-1));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 5s linear infinite;
          transition: background 0.8s ease;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .hero-underline {
          width: 160px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-2), var(--accent-1), var(--accent-3), transparent);
          margin: 20px auto 0;
          border-radius: 2px;
          box-shadow: 0 0 16px var(--name-glow);
          transition: background 0.8s ease;
        }

        .author-card {
          position: relative;
          background: linear-gradient(160deg, rgba(30, 15, 45, 0.85) 0%, rgba(20, 10, 35, 0.92) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid var(--card-border);
          border-radius: 30px;
          padding: 56px 60px 36px;
          box-shadow:
            0 0 0 1px rgba(255, 105, 180, 0.15),
            0 30px 100px rgba(var(--aura-1), 0.3),
            0 0 160px rgba(var(--aura-2), 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: visible;
          animation: cardIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transition: border-color 0.8s ease, box-shadow 0.8s ease;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-top-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 10px 24px;
          background: linear-gradient(90deg,
            rgba(var(--aura-1), 0.3),
            rgba(var(--aura-2), 0.3),
            rgba(var(--aura-3), 0.3));
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #fff;
          text-transform: uppercase;
          border-radius: 30px 30px 0 0;
          transition: background 0.8s ease;
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

        /* 🈴 Орбита с иероглифами */
        .orbit-ring {
          position: absolute;
          inset: -120px;
          pointer-events: none;
          z-index: 3;
        }
        .orbit-symbol {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 44px;
          height: 44px;
          margin: -22px 0 0 -22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Noto Serif JP', 'Yu Mincho', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--accent-2);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(var(--aura-1), 0.5);
          border-radius: 50%;
          backdrop-filter: blur(6px);
          text-shadow: 0 0 12px var(--name-glow);
          box-shadow:
            0 0 14px rgba(var(--aura-1), 0.5),
            inset 0 0 8px rgba(255, 255, 255, 0.05);
          animation: orbitPulse 3s ease-in-out infinite;
          transition: color 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease;
        }
        .orbit-symbol:nth-child(1) { animation-delay: 0s; }
        .orbit-symbol:nth-child(2) { animation-delay: 0.5s; }
        .orbit-symbol:nth-child(3) { animation-delay: 1s; }
        .orbit-symbol:nth-child(4) { animation-delay: 1.5s; }
        .orbit-symbol:nth-child(5) { animation-delay: 2s; }
        .orbit-symbol:nth-child(6) { animation-delay: 2.5s; }

        /* ⚠️ НЕ содержит transform — иначе позиция съезжает */
        @keyframes orbitPulse {
          0%, 100% {
            opacity: 0.7;
            filter: drop-shadow(0 0 6px var(--name-glow));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 16px var(--name-glow));
          }
        }

        .avatar-ring-outer {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--accent-1), var(--accent-2), var(--accent-3), var(--accent-1));
          animation: spinRing 8s linear infinite;
          filter: blur(0.5px);
          opacity: 0.9;
          transition: background 0.8s ease;
        }
        .avatar-ring-inner {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          background: conic-gradient(from 180deg, var(--accent-2), var(--accent-1), var(--accent-3), var(--accent-2));
          animation: spinRing 8s linear infinite reverse;
          opacity: 0.65;
          transition: background 0.8s ease;
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
          color: var(--accent-2);
          background: radial-gradient(circle, #2a1538, #1a0d25);
          z-index: 1;
        }
        .avatar-fallback.hidden { display: none; }
        .avatar-glow {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--aura-2), 0.4), transparent 60%);
          z-index: 1;
          animation: pulseGlow 3s ease-in-out infinite;
          pointer-events: none;
          transition: background 0.8s ease;
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
            0 0 22px var(--name-glow),
            0 0 44px rgba(var(--aura-1), 0.35);
          transition: text-shadow 0.8s ease;
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
          color: var(--accent-2);
          font-weight: 800;
          transition: color 0.8s ease;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, var(--accent-3), var(--accent-1));
          color: #fff;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          box-shadow: 0 0 14px var(--name-glow);
          transition: background 0.8s ease;
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
          transition: all 0.8s ease;
        }
        .role-0 {
          background: rgba(255, 215, 0, 0.12);
          border-color: color-mix(in srgb, var(--role-0) 55%, transparent);
          color: var(--role-0);
          box-shadow: 0 0 24px color-mix(in srgb, var(--role-0) 25%, transparent);
        }
        .role-1 {
          background: rgba(255, 105, 180, 0.12);
          border-color: color-mix(in srgb, var(--role-1) 55%, transparent);
          color: var(--role-1);
          box-shadow: 0 0 24px color-mix(in srgb, var(--role-1) 25%, transparent);
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
          background: linear-gradient(90deg, transparent, rgba(var(--aura-1), 0.55), transparent);
        }
        .divider-icon {
          color: var(--accent-2);
          font-size: 16px;
          text-shadow: 0 0 14px var(--name-glow);
          transition: color 0.8s ease;
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
          border: 1px solid rgba(var(--aura-1), 0.28);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
          color: inherit;
          font-family: inherit;
          text-decoration: none;
        }
        .info-item:hover {
          background: rgba(var(--aura-1), 0.12);
          border-color: rgba(var(--aura-2), 0.65);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(var(--aura-1), 0.3);
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
          color: var(--accent-1);
          font-size: 11px;
          opacity: 0.85;
          transition: color 0.8s ease;
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
          transition: all 0.3s;
          text-align: center;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }
        .action-btn.discord {
          background: linear-gradient(135deg, var(--accent-3), var(--accent-1));
          border-color: transparent;
          color: #fff;
          box-shadow: 0 6px 24px rgba(var(--aura-1), 0.45);
        }
        .action-btn.discord:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(var(--aura-1), 0.65);
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
          border-top: 1px dashed rgba(var(--aura-1), 0.25);
          font-family: 'Noto Serif JP', serif;
          letter-spacing: 1.5px;
        }
        .quote-mark {
          color: var(--accent-2);
          font-weight: 900;
          margin: 0 6px;
          transition: color 0.8s ease;
        }

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
          border: 1px solid rgba(var(--aura-1), 0.3);
          border-radius: 22px;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(var(--aura-1), 0.15);
          animation: cardIn 0.8s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          transition: border-color 0.8s ease;
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
          filter: drop-shadow(0 0 10px var(--name-glow));
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
          background: linear-gradient(180deg, transparent, rgba(var(--aura-1), 0.55), transparent);
        }

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
          color: var(--accent-2);
          animation: heartbeat 1.4s ease-in-out infinite;
          display: inline-block;
          transition: color 0.8s ease;
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
          color: var(--accent-1);
          font-family: 'Noto Serif JP', serif;
          opacity: 0.7;
          transition: color 0.8s ease;
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
          .orbit-ring { inset: -80px; }
          .orbit-symbol {
            width: 34px;
            height: 34px;
            margin: -17px 0 0 -17px;
            font-size: 17px;
          }
        }
        @media (max-width: 500px) {
          .hero-title { font-size: 28px; }
          .hero-jp { letter-spacing: 4px; }
          .author-card { padding: 36px 18px 22px; }
          .corner-deco { font-size: 50px; opacity: 0.1; }
          .bio { font-size: 15px; }
          .theme-switcher { top: 14px; right: 14px; }
          .theme-menu { top: 64px; right: 14px; }
        }
      `}</style>
    </>
  );
}
