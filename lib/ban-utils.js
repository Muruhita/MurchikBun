import redis from './redis';

/**
 * Достаёт информацию о бане пользователя
 * @returns {Promise<{banned: boolean, reason: string|null, until: string|null, permanent: boolean}>}
 */
export async function getBanInfo(userId) {
  const banRaw = await redis.get(`blacklist:${userId}`);
  if (!banRaw) return { banned: false, reason: null, until: null, permanent: false };

  let reason = 'Вы были заблокированы администрацией.';
  let permanent = false;
  try {
    const parsed = JSON.parse(banRaw);
    reason = parsed.reason || reason;
    permanent = !!parsed.permanent;
  } catch {
    reason = banRaw;
  }

  // 🎯 Если помечен как permanent — не показываем дату, показываем «Навсегда»
  if (permanent) {
    return { banned: true, reason, until: 'Навсегда', permanent: true };
  }

  // Иначе смотрим TTL
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
  } else if (ttl === -1) {
    // На всякий случай — если TTL нет, но и permanent не выставлен (старые записи)
    until = 'Навсегда';
    permanent = true;
  }

  return { banned: true, reason, until, permanent };
}
