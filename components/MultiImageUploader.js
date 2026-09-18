import { useState, useRef } from 'react';

const MAX_SIZE_MB = 5;

export default function MultiImageUploader({
  value = [],
  onChange,
  label = 'Скриншоты',
  max = 5
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploadingCount, setUploadingCount] = useState(0);
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file.type.startsWith('image/')) throw new Error('Не изображение');
    if (file.size > MAX_SIZE_MB * 1024 * 1024) throw new Error(`Файл больше ${MAX_SIZE_MB} МБ`);

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
    return data.url;
  };

  const handleFiles = async (files) => {
    setError('');
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return;

    const slotsLeft = max - value.length;
    if (slotsLeft <= 0) {
      setError(`❌ Максимум ${max} файлов`);
      return;
    }

    const toUpload = list.slice(0, slotsLeft);
    if (list.length > slotsLeft) {
      setError(`⚠️ Загружено только ${slotsLeft} (лимит ${max})`);
    }

    setUploadingCount(toUpload.length);
    const uploaded = [];

    for (const file of toUpload) {
      try {
        const url = await uploadFile(file);
        uploaded.push(url);
        onChange([...value, ...uploaded]);
      } catch (e) {
        setError('❌ ' + e.message);
      } finally {
        setUploadingCount(c => c - 1);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handlePaste = (e) => {
    const items = [...(e.clipboardData?.items || [])].filter(i => i.type.startsWith('image/'));
    const files = items.map(i => i.getAsFile()).filter(Boolean);
    if (files.length) handleFiles(files);
  };

  const removeAt = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const isUploading = uploadingCount > 0;
  const canAdd = value.length < max;
  const hasItems = value.length > 0 || isUploading;

  return (
    <>
      <div className="uploader">
        <label className="uploader-label">
          {label}
          {value.length > 0 && <span className="counter">{value.length}/{max}</span>}
        </label>

        {/* Пустая форма — большая зона */}
        {!hasItems && (
          <div
            className={`dropzone ${dragging ? 'dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex={0}
          >
            <div className="dropzone-icon">📸</div>
            <p className="dropzone-title">Перетащи скриншоты сюда</p>
            <p className="dropzone-hint">
              или <strong>кликни</strong> · <kbd>Ctrl+V</kbd> · до {max} файлов
            </p>
            <p className="dropzone-limit">PNG, JPG, GIF · до {MAX_SIZE_MB} МБ</p>
          </div>
        )}

        {/* Сетка превью */}
        {hasItems && (
          <div className="preview-grid">
            {value.map((url, idx) => (
              <div key={url + idx} className="preview-item">
                <img src={url} alt={`preview-${idx}`} />
                <button
                  type="button"
                  className="preview-remove"
                  onClick={() => removeAt(idx)}
                  title="Удалить"
                >
                  ✕
                </button>
                <div className="preview-num">#{idx + 1}</div>
              </div>
            ))}

            {isUploading && (
              <div className="preview-item loading">
                <div className="uploader-spinner" />
                {uploadingCount > 1 && <span className="loading-count">×{uploadingCount}</span>}
              </div>
            )}

            {canAdd && !isUploading && (
              <div
                className={`preview-item add ${dragging ? 'dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onPaste={handlePaste}
                tabIndex={0}
              >
                <span className="add-icon">+</span>
                <span className="add-text">Добавить</span>
              </div>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        {error && <p className="uploader-error">{error}</p>}
      </div>

      <style jsx>{`
        .uploader { margin-bottom: 20px; }
        .uploader-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          margin-bottom: 8px;
        }
        .counter {
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #C4A5F0;
          border-radius: 12px;
          padding: 1px 8px;
          font-size: 11px;
          font-weight: 700;
        }

        .dropzone {
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

        .dropzone-icon {
          font-size: 44px;
          margin-bottom: 12px;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));
        }
        .dropzone-title { color: #ddd; font-size: 15px; font-weight: 600; margin: 0 0 6px; }
        .dropzone-hint { color: #888; font-size: 13px; margin: 0 0 8px; }
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
        .dropzone-limit { color: #666; font-size: 11px; margin: 0; }

        /* Сетка превью */
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
          animation: gridIn 0.3s ease;
        }
        .preview-item {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: #0a0a0a;
          border: 1px solid rgba(76, 175, 80, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .preview-remove {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          background: rgba(0,0,0,0.75);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 2;
        }
        .preview-remove:hover {
          background: #ff4444;
          border-color: #ff4444;
          transform: scale(1.15);
        }
        .preview-num {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: rgba(0,0,0,0.65);
          color: #C4A5F0;
          border-radius: 8px;
          padding: 2px 7px;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
        }

        /* Плитка "+" */
        .preview-item.add {
          border: 2px dashed rgba(168, 85, 247, 0.4);
          background: rgba(168, 85, 247, 0.04);
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
          transition: all 0.25s;
          color: #C4A5F0;
        }
        .preview-item.add:hover,
        .preview-item.add.dragging {
          border-color: #A855F7;
          background: rgba(168, 85, 247, 0.12);
          transform: scale(1.02);
        }
        .add-icon {
          font-size: 28px;
          font-weight: 300;
          line-height: 1;
          color: #C4A5F0;
        }
        .add-text {
          font-size: 12px;
          font-weight: 600;
        }

        /* Плитка "загружается" */
        .preview-item.loading {
          border-color: rgba(168, 85, 247, 0.5);
          background: rgba(168, 85, 247, 0.06);
        }
        .loading-count {
          position: absolute;
          bottom: 6px;
          right: 6px;
          font-size: 11px;
          color: #C4A5F0;
          font-weight: 700;
        }

        .uploader-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #A855F7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .uploader-error {
          margin-top: 8px;
          color: #ff6b6b;
          font-size: 13px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gridIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
