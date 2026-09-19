import redis from './redis';

const TICKET_TTL = 60 * 60 * 24 * 4; // 4 дня

export async function createTicket(userId, username, subject, message) {
  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const ticket = {
    id,
    userId,
    username,
    subject: subject || '(без темы)',
    status: 'open',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      { from: 'user', userId, username, text: message, at: Date.now() }
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
  const ids = await redis.zrevrange('support:tickets', 0, limit * 2 - 1);
  if (!ids.length) return [];

  const tickets = [];
  const deadIds = [];

  for (const id of ids) {
    const t = await getTicket(id);
    if (!t) { deadIds.push(id); continue; }
    if (userId && t.userId !== userId) continue;
    tickets.push(t);
    if (tickets.length >= limit) break;
  }

  if (deadIds.length) {
    try {
      await redis.zrem('support:tickets', ...deadIds);
      console.log(`[support] Очищено мёртвых тикетов: ${deadIds.length}`);
    } catch (e) {
      console.error('[support] Ошибка очистки:', e.message);
    }
  }

  return tickets;
}

export async function addMessage(ticketId, from, user, text) {
  const ticket = await getTicket(ticketId);
  if (!ticket) return null;

  ticket.messages.push({
    from,
    userId: user.id,
    username: user.username,
    text,
    at: Date.now()
  });

  ticket.status = from === 'admin' ? 'answered' : 'open';
  await saveTicket(ticket);

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

export async function deleteTicket(ticketId) {
  const ticket = await getTicket(ticketId);
  if (!ticket) return { success: false, error: 'Тикет не найден' };

  await redis.del(`support:ticket:${ticketId}`);
  await redis.zrem('support:tickets', ticketId);

  const unread = await redis.get(`support:unread:${ticket.userId}`);
  if (unread && parseInt(unread) > 0) {
    await redis.decr(`support:unread:${ticket.userId}`);
  }

  return { success: true, ticket };
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

/**
 * 🧹 Очистка только мёртвых тикетов (TTL истёк, но id в sorted set висит)
 */
export async function cleanupDeadTickets() {
  const ids = await redis.zrange('support:tickets', 0, -1);
  if (!ids.length) return { cleaned: 0, total: 0 };

  const deadIds = [];
  const pipeline = redis.pipeline();
  ids.forEach(id => pipeline.exists(`support:ticket:${id}`));
  const results = await pipeline.exec();

  results.forEach(([err, exists], i) => {
    if (!err && !exists) deadIds.push(ids[i]);
  });

  if (deadIds.length) {
    await redis.zrem('support:tickets', ...deadIds);
  }

  return { cleaned: deadIds.length, total: ids.length };
}

/**
 * 🗑️ Полная очистка ВСЕХ тикетов (без разбора — временные или нет).
 */
export async function clearAllTickets() {
  const ids = await redis.zrange('support:tickets', 0, -1);

  if (!ids.length) {
    return { deleted: 0 };
  }

  const ticketKeys = ids.map(id => `support:ticket:${id}`);

  const pipeline = redis.pipeline();
  ticketKeys.forEach(key => pipeline.del(key));
  pipeline.del('support:tickets');
  pipeline.del('support:unread:admin');
  await pipeline.exec();

  const unreadKeys = await redis.keys('support:unread:*');
  if (unreadKeys.length) {
    const cleanPipeline = redis.pipeline();
    unreadKeys.forEach(key => cleanPipeline.del(key));
    await cleanPipeline.exec();
  }

  console.log(`[support] Полная очистка: удалено ${ids.length} тикетов`);
  return { deleted: ids.length };
}
