import redis from '../../lib/redis';
import { verifyToken } from '../../lib/discord';
import { ADMIN_IDS } from '../../lib/admins';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const rules = await redis.get('rules');
    return res.status(200).json({ rules });
  }

  if (req.method === 'POST') {
    const token = req.cookies.token;
    const user = verifyToken(token);
    if (!user || !ADMIN_IDS.includes(user.id)) {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      await redis.del('rules');
      return res.status(200).json({ message: 'Правила удалены' });
    }

    await redis.set('rules', text.trim());
    return res.status(200).json({ message: 'Правила сохранены' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
