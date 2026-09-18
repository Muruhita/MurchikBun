import { verifyToken } from '../../../lib/discord';
import { listTickets } from '../../../lib/support';

const ADMIN_IDS = ['1018113109346504744', '555380718566506506', '260076815970729985', '797111731864207360'];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const isAdmin = ADMIN_IDS.includes(user.id);
  const tickets = await listTickets({
    userId: isAdmin ? null : user.id,
    limit: 50
  });

  return res.status(200).json({ tickets, isAdmin });
}
