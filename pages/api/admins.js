import redis from '../../lib/redis';
import { verifyToken } from '../../lib/discord';

// Список ID администраторов — должен совпадать с остальными файлами
const ADMIN_IDS = [
  '1018113109346504744',
  '555380718566506506',
  '260076815970729985',
  '797111731864207360'
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const admins = [];

    for (const adminId of ADMIN_IDS) {
      const nickname = await redis.get(`nickname:${adminId}`);
      const department = await redis.get(`department:${adminId}`);
      const username = await redis.get(`username:${adminId}`);
      const avatar = await redis.get(`avatar:${adminId}`);
      const profileCustom = await redis.get(`profileCustom:${adminId}`);

      admins.push({
        userId: adminId,
        username: username || 'Неизвестный',
        nickname: nickname || 'Ник не указан',
        department: department || 'Не указан',
        avatar: avatar || '',
        profileCustom: profileCustom ? JSON.parse(profileCustom) : null
      });
    }

    // Сортировка по нику (админы без ника — в конце)
    admins.sort((a, b) => {
      if (a.nickname === 'Ник не указан') return 1;
      if (b.nickname === 'Ник не указан') return -1;
      return a.nickname.localeCompare(b.nickname);
    });

    return res.status(200).json({ admins });
  } catch (error) {
    console.error('Ошибка получения админов:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
