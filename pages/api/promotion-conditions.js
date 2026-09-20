import redis from '../../lib/redis';
import { verifyToken } from '../../lib/discord';
import { ADMIN_IDS } from '../../lib/admins';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const content = await redis.get('promotion:conditions');
    return res.status(200).json({ content: content || '' });
  }

  if (req.method === 'POST') {
    const token = req.cookies.token;
    const user = verifyToken(token);
    if (!user || !ADMIN_IDS.includes(user.id)) {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    const { content } = req.body;
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Неверные данные' });
    }

    if (content.trim().length === 0) {
      await redis.del('promotion:conditions');
      return res.status(200).json({ message: 'Условия удалены' });
    }

    await redis.set('promotion:conditions', content);
    return res.status(200).json({ message: 'Условия сохранены' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
