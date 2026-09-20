import { toggleFormSubmission } from '../../../lib/antispam';
import { verifyToken } from '../../../lib/discord';
import { ADMIN_IDS } from '../../../lib/admins';

export default async function handler(req, res) {
  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user || !ADMIN_IDS.includes(user.id)) return res.status(403).json({ error: 'Нет доступа' });

  const { status } = req.body;
  const newStatus = await toggleFormSubmission(status);
  res.status(200).json({ formsActive: newStatus });
}
