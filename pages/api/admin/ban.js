import { addToBlacklist } from '../../../lib/blacklist';
import { verifyToken } from '../../../lib/discord';
import { ADMIN_IDS } from '../../../lib/admins';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user || !ADMIN_IDS.includes(user.id)) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  const { userId, reason, username, permanent } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Не указан Discord ID пользователя' });
  }

  try {
    await addToBlacklist(
      userId,
      username || 'Неизвестный',
      reason || 'Забанен администратором',
      !!permanent
    );

    return res.status(200).json({
      message: permanent
        ? '✅ Пользователь заблокирован навсегда.'
        : '✅ Пользователь успешно заблокирован (7 дней).'
    });
  } catch (error) {
    console.error('Ошибка блокировки:', error);
    return res.status(500).json({ error: 'Ошибка при блокировке' });
  }
}
