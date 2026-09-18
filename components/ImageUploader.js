import { useState, useRef } from 'react';

const MAX_SIZE_MB = 5;

export default function ImageUploader({ value, onChange, label = 'Скриншот' }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('❌ Это не изображение');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`❌ Файл больше ${MAX_SIZE_MB} МБ`);
      return;
    }

    // 1. Локальный превью — мгновенно
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // 2. Загрузка на сервер → imgbb
    setUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = (e) => resolve(e.target.result);
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');

      onChange(data.url);
    } catch (e) {
      setError('❌ ' + (e.message || 'Не удалось загрузить'));
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handlePaste = (e) => {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) handleFile(file);
    }
  };

  const clear = () => {
    onChange('');
    setPreview('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <div className="uploader">
        <label className="uploader-label">{label}</label>

        {!value && !preview && (
          <div
            className={`dropzone ${dragging ? 'dragging' : ''} ${uploading ? 'loading' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex={0}
          >
            {uploading ? (
              <>
                <div className="uploader-spinner" />
                <p>Загрузка на imgbb...</p>
              </>
            ) : (
              <>
                <div className="dropzone-icon">📸</div>
                <p className="dropzone-title">
                  Перетащи скриншот сюда
                </p>
                <p className="dropzone-hint">
                  или <strong>кликни</strong> для выбора · <kbd>Ctrl+V</kbd> для вставки
                </p>
                <p className="dropzone-limit">PNG, JPG, GIF · до {MAX_SIZE_MB} МБ</p>
              </>
            )}
          </div>
        )}

        {preview && (
          <div className="preview-box">
            <img src={preview} alt="preview" className="preview-img" />
            {uploading && (
              <div className="preview-overlay">
                <div className="uploader-spinner" />
                <span>Загрузка...</span>
              </div>
            )}
            {!uploading && value && (
              <div className="preview-overlay success">
                <span className="check">✅</span>
                <span>Загружено</span>
              </div>
            )}
            <button type="button" className="preview-remove" onClick={clear} title="Удалить">
              ✕
            </button>
          </div>
        )}

        {value && !preview && (
          <div className="url-box">
            <input type="text" value={value} readOnly />
            <button type="button" onClick={clear}>✕</button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {error && <p className="uploader-error">{error}</p>}
      </div>

      <style jsx>{`
        .uploader { margin-bottom: 20px; }
        .uploader-label {
          display: block;
          color: #888;
          margin-bottom: 8px;
        }

        .dropzone {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: center;
          min-height: 160px;
          outline: none;
        }
        .dropzone:hover,
        .dropzone:focus {
          border-color: rgba(168, 85, 247, 0.6);
          background: rgba(168, 85, 247, 0.05);
        }
        .dropzone.dragging {
          border-color: #A855F7;
          background: rgba(168, 85, 247, 0.12);
          transform: scale(1.01);
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.25);
        }
        .dropzone.loading { cursor: wait; opacity: 0.8; }

        .dropzone-icon {
          font-size: 44px;
          margin-bottom: 12px;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));
        }
        .dropzone-title {
          color: #ddd;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 6px;
        }
        .dropzone-hint {
          color: #888;
          font-size: 13px;
          margin: 0 0 8px;
        }
        .dropzone-hint strong { color: #C4A5F0; }
        .dropzone-hint kbd {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 11px;
          font-family: ui-monospace, monospace;
          color: #ccc;
        }
        .dropzone-limit {
          color: #666;
          font-size: 11px;
          margin: 0;
        }

        .preview-box {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(76, 175, 80, 0.4);
          background: #0a0a0a;
          animation: previewIn 0.3s ease;
        }
        .preview-img {
          display: block;
          width: 100%;
          max-height: 300px;
          object-fit: contain;
        }
        .preview-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(4px);
        }
        .preview-overlay.success {
          color: #4CAF50;
          background: rgba(0,0,0,0.55);
          animation: fadeOutSuccess 1s ease 1.5s forwards;
          pointer-events: none;
        }
        .preview-overlay .check { font-size: 20px; }
        .preview-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .preview-remove:hover {
          background: #ff4444;
          border-color: #ff4444;
          transform: scale(1.1);
        }

        .url-box {
          display: flex;
          gap: 8px;
        }
        .url-box input {
          flex: 1;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #888;
          border-radius: 8px;
          font-size: 13px;
        }
        .url-box button {
          padding: 0 14px;
          background: rgba(255, 60, 60, 0.15);
          border: 1px solid rgba(255, 60, 60, 0.4);
          color: #ff6b6b;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .url-box button:hover {
          background: rgba(255, 60, 60, 0.3);
          color: #fff;
        }

        .uploader-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #A855F7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 10px;
        }
        .dropzone p { margin: 0; color: #aaa; font-size: 13px; }
        .dropzone.loading p { color: #A855F7; font-weight: 600; }

        .uploader-error {
          margin-top: 8px;
          color: #ff6b6b;
          font-size: 13px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes previewIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOutSuccess {
          to { opacity: 0; }
        }
      `}</style>
    </>
  );
}
