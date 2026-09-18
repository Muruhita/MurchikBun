import redis from './redis';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/**
 * @param {string} userId
 * @param {string} username
 * @param {string} reason
 * @param {boolean} permanent — если true, бан без TTL (навсегда)
 */
export async function addToBlacklist(userId, username, reason = 'Банворд', permanent = false) {
  const data = JSON.stringify({
    username,
    reason,
    timestamp: Date.now(),
    permanent: !!permanent
  });

  const key = `blacklist:${userId}`;

  if (permanent) {
    // ⚠️ Без EX — ключ не истечёт
    await redis.set(key, data);
  } else {
    await redis.set(key, data, 'EX', SEVEN_DAYS);
  }

  return true;
}

export async function isBlacklisted(userId) {
  const banned = await redis.get(`blacklist:${userId}`);
  return !!banned;
}

export async function removeFromBlacklist(userId) {
  await redis.del(`blacklist:${userId}`);
  return true;
}
