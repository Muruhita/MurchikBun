import { useRouter } from 'next/router';

export default function BanOverlay({ 
  show, 
  reason = 'Вы были заблокированы', 
  until = null,
  onClose = null
}) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose();
    router.push('/dashboard');
  };

  return (
    <>
      {show && (
        <div className="ban-overlay">
          <div className="ban-scanlines" />
          <div className="ban-box">
            <div className="ban-icon-wrapper">
              <svg className="ban-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L1 21h22L12 2z" 
                      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M12 9v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="12" cy="18" r="1.1" fill="currentColor"/>
              </svg>
            </div>

            <h2 className="ban-title">ДОСТУП ЗАБЛОКИРОВАН</h2>
            <div className="ban-divider" />

            <p className="ban-reason">{reason}</p>
            {until && <p className="ban-until">До: {until}</p>}

            <p className="ban-hint">
              Если вы считаете это ошибкой — обратитесь в <strong>Discord</strong> к администрации.
            </p>

            <button className="ban-btn" onClick={handleClose}>
              Вернуться в панель
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .ban-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(60, 0, 0, 0.92) 0%, rgba(10, 0, 0, 0.96) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: banOverlayIn 0.4s ease forwards;
          overflow: hidden;
        }

        /* Полосатая "scanline" текстура */
        .ban-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 0, 0, 0.04) 0px,
            rgba(255, 0, 0, 0.04) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          animation: scanMove 8s linear infinite;
        }

        .ban-box {
          position: relative;
          background: linear-gradient(145deg, rgba(28, 8, 8, 0.98), rgba(15, 4, 4, 0.98));
          border: 1.5px solid rgba(255, 50, 50, 0.55);
          border-radius: 22px;
          padding: 44px 52px;
          max-width: 520px;
          width: calc(100% - 40px);
          text-align: center;
          box-shadow:
            0 0 0 1px rgba(255, 0, 0, 0.15),
            0 20px 70px rgba(0, 0, 0, 0.7),
            0 0 100px rgba(255, 20, 20, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: banBoxIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     banGlow 2.5s ease-in-out 0.6s infinite;
        }

        .ban-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 40, 40, 0.18), transparent 70%);
          margin-bottom: 20px;
          animation: iconPulse 1.8s ease-in-out infinite;
        }

        .ban-icon {
          width: 56px;
          height: 56px;
          color: #ff4444;
          filter: drop-shadow(0 0 12px rgba(255, 60, 60, 0.8));
          animation: iconShake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) 0.3s;
        }

        .ban-title {
          color: #ff5252;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 2px;
          margin: 0 0 16px 0;
          text-shadow:
            0 0 10px rgba(255, 60, 60, 0.7),
            0 0 30px rgba(255, 30, 30, 0.4);
          opacity: 0;
          animation: titleIn 0.5s ease 0.4s forwards, glitch 3s ease-in-out 1.5s infinite;
        }

        .ban-divider {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff4444, transparent);
          margin: 0 auto 20px;
          opacity: 0;
          animation: titleIn 0.5s ease 0.5s forwards;
        }

        .ban-reason {
          color: #e0e0e0;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 10px 0;
          padding: 14px 18px;
          background: rgba(255, 60, 60, 0.08);
          border-left: 3px solid #ff4444;
          border-radius: 8px;
          text-align: left;
          white-space: pre-line;
          opacity: 0;
          animation: titleIn 0.5s ease 0.6s forwards;
        }

        .ban-until {
          color: #ff8888;
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 14px 0;
          opacity: 0;
          animation: titleIn 0.5s ease 0.7s forwards;
        }

        .ban-hint {
          color: #888;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 24px 0;
          opacity: 0;
          animation: titleIn 0.5s ease 0.8s forwards;
        }
        .ban-hint strong {
          color: #b0b0b0;
        }

        .ban-btn {
          width: 100%;
          padding: 14px 20px;
          background: rgba(255, 60, 60, 0.12);
          color: #ff6b6b;
          border: 1.5px solid rgba(255, 60, 60, 0.55);
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.25s ease;
          opacity: 0;
          animation: titleIn 0.5s ease 0.9s forwards;
        }
        .ban-btn:hover {
          background: rgba(255, 60, 60, 0.25);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 40, 40, 0.35);
        }
        .ban-btn:active {
          transform: translateY(0);
        }

        /* === КЕЙФРЕЙМЫ === */
        @keyframes banOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes banBoxIn {
          0% { transform: scale(0.85) translateY(20px); opacity: 0; }
          60% { transform: scale(1.02) translateY(-4px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes banGlow {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(255, 0, 0, 0.15),
              0 20px 70px rgba(0, 0, 0, 0.7),
              0 0 100px rgba(255, 20, 20, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(255, 0, 0, 0.3),
              0 20px 70px rgba(0, 0, 0, 0.7),
              0 0 130px rgba(255, 20, 20, 0.55),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes iconShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-3deg); }
          30% { transform: translateX(5px) rotate(3deg); }
          45% { transform: translateX(-4px) rotate(-2deg); }
          60% { transform: translateX(3px) rotate(2deg); }
          80% { transform: translateX(-1px); }
        }

        @keyframes titleIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glitch {
          0%, 90%, 100% {
            text-shadow:
              0 0 10px rgba(255, 60, 60, 0.7),
              0 0 30px rgba(255, 30, 30, 0.4);
            transform: translateX(0);
          }
          92% {
            text-shadow:
              -2px 0 0 #00ffff,
              2px 0 0 #ff00ff,
              0 0 10px rgba(255, 60, 60, 0.7);
            transform: translateX(-2px);
          }
          94% {
            text-shadow:
              2px 0 0 #00ffff,
              -2px 0 0 #ff00ff,
              0 0 30px rgba(255, 30, 30, 0.4);
            transform: translateX(2px);
          }
          96% {
            text-shadow:
              -1px 0 0 #00ffff,
              1px 0 0 #ff00ff,
              0 0 10px rgba(255, 60, 60, 0.7);
            transform: translateX(-1px);
          }
        }

        @keyframes scanMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }

        @media (max-width: 500px) {
          .ban-box { padding: 32px 26px; border-radius: 18px; }
          .ban-icon-wrapper { width: 76px; height: 76px; }
          .ban-icon { width: 44px; height: 44px; }
          .ban-title { font-size: 17px; letter-spacing: 1.5px; }
          .ban-reason { font-size: 14px; }
        }
      `}</style>
    </>
  );
}
