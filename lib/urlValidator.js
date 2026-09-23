// lib/urlValidator.js
// Безопасная валидация пользовательских ссылок

const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const DEFAULT_MAX_LENGTH = 2000;

// Control chars + CRLF
const CONTROL_CHARS = /[\x00-\x1F\x7F]/;

// Запрещённые протоколы (regexp для скорости)
const DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript|file|blob|about|chrome|chrome-extension|ms-its|mhtml):/i;

// Явно запрещённые хосты
const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  'metadata.google.internal',
  'metadata',
  '169.254.169.254' // AWS / GCP metadata
]);

// Хосты картинок, которым доверяем (для скинов)
export const TRUSTED_IMAGE_HOSTS = [
  'ibb.co', 'i.ibb.co', 'imgbb.com',
  'imgur.com', 'i.imgur.com',
  'cdn.discordapp.com', 'media.discordapp.net',
  'i.pinimg.com', 'pinimg.com',
  'googleusercontent.com',
  'githubusercontent.com',
  'cloudinary.com',
  'unsplash.com', 'images.unsplash.com',
  'tenor.com', 'media.tenor.com',
  'giphy.com', 'media.giphy.com',
  'img.youtube.com', 'i.ytimg.com'
];

function isPrivateIPv4(host) {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b, c, d] = m.slice(1).map(Number);
  if ([a, b, c, d].some(n => n < 0 || n > 255)) return true;
  if (a === 0) return true;              // 0.0.0.0/8
  if (a === 10) return true;             // 10.0.0.0/8
  if (a === 127) return true;            // loopback
  if (a === 169 && b === 254) return true; // link-local
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12
  if (a === 192 && b === 168) return true; // 192.168/16
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

function isPrivateIPv6(host) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === '::1') return true;
  if (h === '::') return true;
  if (h.startsWith('fc') || h.startsWith('fd')) return true; // unique local
  if (h.startsWith('fe80')) return true;                    // link-local
  return false;
}

/**
 * Проверяет URL на безопасность.
 *
 * @param {string} input
 * @param {object} opts
 *   - maxLength?: number — макс. длина (по умолчанию 2000)
 *   - allowedHosts?: string[] — если задан, разрешены только эти хосты (и их поддомены)
 *   - allowAnyHost?: boolean — пропустить проверку хоста
 * @returns {boolean}
 */
export function isSafeUrl(input, opts = {}) {
  if (typeof input !== 'string') return false;

  const trimmed = input.trim();
  if (!trimmed) return false;

  const maxLength = opts.maxLength ?? DEFAULT_MAX_LENGTH;
  if (trimmed.length > maxLength) return false;

  // Control chars (включая \n \r \t) — под запрет
  if (CONTROL_CHARS.test(trimmed)) return false;

  // Быстрая отсечка опасных протоколов
  if (DANGEROUS_PROTOCOLS.test(trimmed)) return false;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return false;
  }

  // Только http / https
  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return false;

  const host = url.hostname.toLowerCase();

  // Явно запрещённые хосты
  if (BLOCKED_HOSTS.has(host)) return false;

  // Приватные IP
  if (isPrivateIPv4(host)) return false;
  if (isPrivateIPv6(host)) return false;

  // Хост должен содержать буквы/цифры/точки/дефисы или быть [IPv6]
  if (!/^[a-z0-9.-]+$/i.test(host) && !/^\[[a-f0-9:]+\]$/i.test(host)) {
    return false;
  }

  // Whitelist хостов
  if (Array.isArray(opts.allowedHosts) && opts.allowedHosts.length > 0) {
    const allowed = opts.allowedHosts.some(base => {
      const b = base.toLowerCase();
      return host === b || host.endsWith('.' + b);
    });
    if (!allowed) return false;
  }

  return true;
}

/**
 * Извлекает все http(s)-ссылки из текста.
 */
export function extractUrls(text) {
  if (typeof text !== 'string') return [];
  return text.match(/https?:\/\/[^\s<>"']+/gi) || [];
}

/**
 * Проверяет все ссылки в тексте.
 * @returns {string[]} — массив невалидных URL
 */
export function findUnsafeUrls(text, opts = {}) {
  const urls = extractUrls(text);
  return urls.filter(u => !isSafeUrl(u, opts));
}

/**
 * Экранирует URL для использования внутри CSS `url(...)`.
 * Удаляет символы, которые могут сломать контекст.
 */
export function escapeCssUrl(url) {
  if (typeof url !== 'string') return '';
  // Убираем: кавычки, скобки, backslash, точки с запятой, пробелы и control chars
  return url.replace(/[\\"'\n\r()\s;{}]/g, '');
}

/**
 * Готовая "безопасная" CSS-функция для background.
 */
export function safeCssBackgroundImage(url) {
  if (!isSafeUrl(url)) return 'none';
  return `url("${url.replace(/"/g, '%22')}")`;
}
