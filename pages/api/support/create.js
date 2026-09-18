import { verifyToken } from '../../../lib/discord';
import { createTicket } from '../../../lib/support';
import { sanitizeText } from '../../../lib/sanitize';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { subject, message } = req.body || {};
  if (!message || message.trim().length < 3) {
    return res.status(400).json({ error: 'Сообщение слишком короткое' });
  }

  try {
    const ticket = await createTicket(
      user.id,
      user.username,
      sanitizeText(subject || '', 100),
      sanitizeText(message, 2000)
    );
    return res.status(200).json({ ticket });
  } catch (e) {
    console.error('[support/create]', e);
    return res.status(500).json({ error: 'Не удалось создать обращение' });
  }
}
