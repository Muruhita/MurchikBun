export default function ProgressBar({ show }) {
  return (
    <>
      <div className={`progress-bar ${show ? 'active' : ''}`}>
        <div className="progress-bar-fill" />
      </div>

      <style jsx>{`
        .progress-bar {
          position: fixed;
          top: 68px; /* сразу под навбаром */
          left: 0;
          width: 100%;
          height: 3px;
          z-index: 99998;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .progress-bar.active {
          opacity: 1;
        }

        .progress-bar-fill {
          position: absolute;
          top: 0;
          height: 100%;
          width: 35%;
          border-radius: 2px;
          background: linear-gradient(
            90deg,
            #5865F2 0%,
            #A855F7 25%,
            #FF69B4 50%,
            #A855F7 75%,
            #5865F2 100%
          );
          background-size: 200% 100%;
          box-shadow:
            0 0 12px rgba(168, 85, 247, 0.8),
            0 0 24px rgba(88, 101, 242, 0.5);
          animation:
            slideBar 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite,
            gradientShift 2.5s linear infinite;
        }

        @keyframes slideBar {
          0% { left: -35%; }
          100% { left: 100%; }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </>
  );
}
