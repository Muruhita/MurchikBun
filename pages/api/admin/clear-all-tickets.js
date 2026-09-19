import { verifyToken } from '../../../lib/discord';
import { clearAllTickets } from '../../../lib/support';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985', '797111731864207360'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user || !ADMIN_IDS.includes(user.id)) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  try {
    const result = await clearAllTickets();
    return res.status(200).json({
      success: true,
      deleted: result.deleted,
      message: result.deleted > 0
        ? `🗑️ Удалено ${result.deleted} тикетов (все, без разбора)`
        : `✨ Тикетов не было — нечего удалять`
    });
  } catch (error) {
    console.error('[clear-all-tickets] ошибка:', error);
    return res.status(500).json({ error: 'Ошибка очистки' });
  }
}
