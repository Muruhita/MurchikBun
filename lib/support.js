import redis from './redis';

const TICKET_TTL = 60 * 60 * 24 * 30; // 30 дней

export async function createTicket(userId, username, subject, message) {
  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const ticket = {
    id,
    userId,
    username,
    subject: subject || '(без темы)',
    status: 'open', // open | answered | closed
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      {
        from: 'user',
        userId,
        username,
        text: message,
        at: Date.now()
      }
    ]
  };

  await redis.set(`support:ticket:${id}`, JSON.stringify(ticket), 'EX', TICKET_TTL);
  await redis.zadd('support:tickets', Date.now(), id);
  await redis.incr('support:unread:admin');

  return ticket;
}

export async function getTicket(id) {
  const raw = await redis.get(`support:ticket:${id}`);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function saveTicket(ticket) {
  ticket.updatedAt = Date.now();
  await redis.set(`support:ticket:${ticket.id}`, JSON.stringify(ticket), 'EX', TICKET_TTL);
}

export async function listTickets({ userId = null, limit = 50 } = {}) {
  // Берём последние N id
  const ids = await redis.zrevrange('support:tickets', 0, limit - 1);
  if (!ids.length) return [];

  const tickets = [];
  for (const id of ids) {
    const t = await getTicket(id);
    if (!t) continue;
    if (userId && t.userId !== userId) continue;
    tickets.push(t);
  }
  return tickets;
}

export async function addMessage(ticketId, from, user, text) {
  const ticket = await getTicket(ticketId);
  if (!ticket) return null;

  ticket.messages.push({
    from, // 'user' | 'admin'
    userId: user.id,
    username: user.username,
    text,
    at: Date.now()
  });

  ticket.status = from === 'admin' ? 'answered' : 'open';
  await saveTicket(ticket);

  // Счётчики непрочитанных
  if (from === 'admin') {
    await redis.incr(`support:unread:${ticket.userId}`);
  } else {
    await redis.incr('support:unread:admin');
  }

  return ticket;
}

export async function closeTicket(ticketId) {
  const ticket = await getTicket(ticketId);
  if (!ticket) return null;
  ticket.status = 'closed';
  await saveTicket(ticket);
  return ticket;
}

export async function getUnreadForUser(userId) {
  const n = await redis.get(`support:unread:${userId}`);
  return parseInt(n || 0);
}

export async function getUnreadForAdmin() {
  const n = await redis.get('support:unread:admin');
  return parseInt(n || 0);
}

export async function markUserRead(userId) {
  await redis.del(`support:unread:${userId}`);
}

export async function markAdminRead() {
  await redis.del('support:unread:admin');
}
