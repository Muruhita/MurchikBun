import { verifyToken } from '../../../lib/discord';
import { cleanupDeadTickets } from '../../../lib/support';

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
    const result = await cleanupDeadTickets();
    return res.status(200).json({
      success: true,
      cleaned: result.cleaned,
      total: result.total,
      message: result.cleaned > 0
        ? `✅ Очищено ${result.cleaned} мёртвых тикетов из ${result.total}`
        : `✨ Всё чисто — мёртвых тикетов нет (проверено ${result.total})`
    });
  } catch (error) {
    console.error('[cleanup-tickets] ошибка:', error);
    return res.status(500).json({ error: 'Ошибка очистки' });
  }
}
