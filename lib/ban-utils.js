import redis from './redis';

/**
 * Достаёт информацию о бане пользователя
 * @returns {Promise<{banned: boolean, reason: string|null, until: string|null}>}
 */
export async function getBanInfo(userId) {
  const banRaw = await redis.get(`blacklist:${userId}`);
  if (!banRaw) return { banned: false, reason: null, until: null };

  // Парсим reason из JSON-строки {username, reason, timestamp}
  let reason = 'Вы были заблокированы администрацией.';
  try {
    const parsed = JSON.parse(banRaw);
    reason = parsed.reason || reason;
  } catch {
    reason = banRaw; // fallback, если хранится просто строка
  }

  // TTL — секунд до конца бана
  let until = null;
  const ttl = await redis.ttl(`blacklist:${userId}`);
  if (ttl > 0) {
    const untilDate = new Date(Date.now() + ttl * 1000);
    until = untilDate.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return { banned: true, reason, until };
}
