import { verifyToken } from '../../../lib/discord';
import { getTicket, addMessage, closeTicket, deleteTicket } from '../../../lib/support';
import { sanitizeText } from '../../../lib/sanitize';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985', '797111731864207360'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { ticketId, message, close, delete: del } = req.body || {};
  if (!ticketId) return res.status(400).json({ error: 'Нет ticketId' });

  const ticket = await getTicket(ticketId);
  if (!ticket) return res.status(404).json({ error: 'Тикет не найден' });

  const isAdmin = ADMIN_IDS.includes(user.id);
  const isOwner = ticket.userId === user.id;

  if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Нет доступа' });

  // 🗑️ Удаление — только админ
  if (del) {
    if (!isAdmin) return res.status(403).json({ error: 'Только админ может удалить' });
    const result = await deleteTicket(ticketId);
    if (result.success) {
      return res.status(200).json({ deleted: true, ticketId });
    }
    return res.status(404).json({ error: result.error });
  }

  // Закрытие — только админ
  if (close) {
    if (!isAdmin) return res.status(403).json({ error: 'Только админ может закрыть' });
    const closed = await closeTicket(ticketId);
    return res.status(200).json({ ticket: closed });
  }

  if (!message || message.trim().length < 1) {
    return res.status(400).json({ error: 'Пустое сообщение' });
  }

  const updated = await addMessage(
    ticketId,
    isAdmin ? 'admin' : 'user',
    user,
    sanitizeText(message, 2000)
  );

  return res.status(200).json({ ticket: updated });
}
