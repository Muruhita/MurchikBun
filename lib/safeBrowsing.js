// lib/safeBrowsing.js
const API_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY;
const API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
const TIMEOUT_MS = 2500;

// Если API-ключ не задан — просто пропускаем (fail-open)
const ENABLED = !!API_KEY;

export async function checkUrlsSafeBrowsing(urls) {
  if (!ENABLED) return { safe: true, reason: 'API key not configured' };
  if (!Array.isArray(urls) || urls.length === 0) return { safe: true };

  // Лимит API — 500 URL на запрос, у нас будет меньше
  const threatEntries = urls.slice(0, 500).map(url => ({ url }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        client: { clientId: 'fib-forms', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION'
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries
        }
      })
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn('[safeBrowsing] HTTP', res.status);
      return { safe: true, reason: 'API error' }; // fail-open
    }

    const data = await res.json();

    if (data.matches && data.matches.length > 0) {
      const first = data.matches[0];
      return {
        safe: false,
        threat: first.threatType,
        url: first.threat?.url || 'unknown'
      };
    }

    return { safe: true };
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') {
      console.warn('[safeBrowsing] Timeout');
      return { safe: true, reason: 'timeout' };
    }
    console.error('[safeBrowsing] error:', e.message);
    return { safe: true, reason: 'network error' };
  }
}

// Красивое название типа угрозы
export function threatName(type) {
  const map = {
    MALWARE: 'вредоносное ПО',
    SOCIAL_ENGINEERING: 'фишинг / мошенничество',
    UNWANTED_SOFTWARE: 'нежелательное ПО',
    POTENTIALLY_HARMFUL_APPLICATION: 'потенциально опасное приложение'
  };
  return map[type] || 'опасный контент';
}
