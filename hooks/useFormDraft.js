import { useEffect, useRef, useState } from 'react';

/**
 * Автосохранение формы в localStorage.
 * @param {string} key — уникальный ключ черновика (например 'draft:leave')
 * @param {any} value — текущее значение формы (объект)
 * @param {object} options
 *   - onLoad?: (saved) => void — что делать при восстановлении черновика
 *   - enabled?: boolean — вкл/выкл (можно отключать для забаненных)
 * @returns {{
 *   savedAt: number|null,
 *   clear: () => void,
 *   restore: () => any|null,
 *   hasDraft: boolean
 * }}
 */
export function useFormDraft(key, value, options = {}) {
  const { onLoad, enabled = true } = options;
  const [savedAt, setSavedAt] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  // 🚀 Загрузка черновика при монтировании
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.data && onLoad) {
        onLoad(parsed.data);
        setSavedAt(parsed.savedAt || null);
        setHasDraft(true);
      }
    } catch (e) {
      console.warn('[useFormDraft] ошибка чтения:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  // 💾 Сохранение при изменении value (debounce 500ms)
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Пропускаем самый первый рендер, чтобы не перезаписать черновик
    // пустыми значениями сразу после загрузки
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // Проверяем — есть ли вообще что сохранять
      const isEmpty = !value || (typeof value === 'object' && Object.values(value).every(v => !v));
      if (isEmpty) {
        localStorage.removeItem(key);
        setSavedAt(null);
        setHasDraft(false);
        return;
      }

      try {
        const payload = { data: value, savedAt: Date.now() };
        localStorage.setItem(key, JSON.stringify(payload));
        setSavedAt(payload.savedAt);
        setHasDraft(true);
      } catch (e) {
        console.warn('[useFormDraft] ошибка сохранения:', e);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [key, value, enabled]);

  // 🗑️ Очистить черновик
  const clear = () => {
    try {
      localStorage.removeItem(key);
      setSavedAt(null);
      setHasDraft(false);
    } catch (e) { /* ignore */ }
  };

  // 📥 Восстановить вручную (если нужно)
  const restore = () => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw)?.data || null;
    } catch {
      return null;
    }
  };

  return { savedAt, clear, restore, hasDraft };
}

/**
 * Утилита — форматирует "5 мин. назад"
 */
export function formatSavedAt(ts) {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'только что';
  if (diff < 60) return `${diff} сек. назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
  return `${Math.floor(diff / 86400)} д. назад`;
}
