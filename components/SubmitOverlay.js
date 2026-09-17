export default function SubmitOverlay({ 
  show, 
  text = 'Успешно отправлено!', 
  subtext = 'Перенаправление...' 
}) {
  return (
    <>
      {show && (
        <div className="success-overlay">
          <div className="success-box">
            <svg className="checkmark-svg" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <p className="success-text">{text}</p>
            {subtext && <p className="success-subtext">{subtext}</p>}
          </div>
        </div>
      )}

      <style jsx>{`
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
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes boxIn {
          0% { transform: scale(0.6) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes strokeCircle { to { stroke-dashoffset: 0; } }
        @keyframes strokeCheck { to { stroke-dashoffset: 0; } }
        @keyframes textIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 500px) {
          .success-box { padding: 36px 40px; border-radius: 20px; }
          .checkmark-svg { width: 72px; height: 72px; margin-bottom: 18px; }
          .success-text { font-size: 17px; }
          .success-subtext { font-size: 12px; }
        }
      `}</style>
    </>
  );
}
