import { verifyToken } from '../../../lib/discord';
import { getUnreadForUser, getUnreadForAdmin, markUserRead, markAdminRead } from '../../../lib/support';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985', '797111731864207360'];

export default async function handler(req, res) {
  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const isAdmin = ADMIN_IDS.includes(user.id);

  if (req.method === 'GET') {
    const unreadUser = await getUnreadForUser(user.id);
    const unreadAdmin = isAdmin ? await getUnreadForAdmin() : 0;
    return res.status(200).json({ unreadUser, unreadAdmin, isAdmin });
  }

  if (req.method === 'POST') {
    if (isAdmin && req.body?.scope === 'admin') {
      await markAdminRead();
    } else {
      await markUserRead(user.id);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
