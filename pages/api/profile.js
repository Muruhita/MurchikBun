import redis from '../../lib/redis';
import { verifyToken } from '../../lib/discord';
import { containsBadWords } from '../../lib/badwords';
import { getBanInfo } from '../../lib/ban-utils';

export default async function handler(req, res) {
  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const nickname = await redis.get(`nickname:${user.id}`);
    const department = await redis.get(`department:${user.id}`);
    const { banned, reason: banReason, until: banUntil } = await getBanInfo(user.id);

    return res.status(200).json({ user, nickname, department, banned, banReason, banUntil });
  }

  if (req.method === 'POST') {
    const { nickname, department } = req.body;

    // Валидация ника
    if (nickname !== undefined) {
      if (!nickname || containsBadWords(nickname)) {
        return res.status(400).json({ error: 'Никнейм содержит запрещенные слова!' });
      }
      await redis.set(`nickname:${user.id}`, nickname);
    }

    // Валидация отдела
    if (department !== undefined) {
      await redis.set(`department:${user.id}`, department);
    }

    return res.status(200).json({ message: 'Профиль обновлён!' });
  }
}
