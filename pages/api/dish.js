// pages/api/dish.js
import redis from '../../lib/redis';
import { verifyToken } from '../../lib/discord';

// Единственный юзер, который может редактировать эту страницу
const EDITOR_ID = '1018113109346504744';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const youtube = await redis.get('dish:youtube');
    const link = await redis.get('dish:link');
    const linkLabel = await redis.get('dish:linkLabel');

    return res.status(200).json({
      youtube: youtube || '',
      link: link || '',
      linkLabel: linkLabel || 'Дополнительная ссылка'
    });
  }

  if (req.method === 'POST') {
    const token = req.cookies.token;
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // 🔒 Только указанный ID
    if (user.id !== EDITOR_ID) {
      return res.status(403).json({ error: 'Нет доступа. Только владелец может редактировать.' });
    }

    const { youtube, link, linkLabel } = req.body;

    if (typeof youtube === 'string') {
      if (youtube.trim().length === 0) await redis.del('dish:youtube');
      else await redis.set('dish:youtube', youtube.trim());
    }

    if (typeof link === 'string') {
      if (link.trim().length === 0) await redis.del('dish:link');
      else await redis.set('dish:link', link.trim());
    }

    if (typeof linkLabel === 'string') {
      if (linkLabel.trim().length === 0) await redis.del('dish:linkLabel');
      else await redis.set('dish:linkLabel', linkLabel.trim());
    }

    return res.status(200).json({ message: '✅ Данные сохранены' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
