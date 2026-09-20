import redis from '../../lib/redis';
import { verifyToken } from '../../lib/discord';

const ADMIN_IDS = [
  '1018113109346504744',
  '555380718566506506',
  '260076815970729985',
  '797111731864207360'
];

// Получаем данные пользователя из Discord API по bot-токену
async function fetchDiscordUser(userId, botToken) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { Authorization: `Bot ${botToken}` }
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Ошибка получения Discord-юзера ${userId}:`, error.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const admins = [];

    for (const adminId of ADMIN_IDS) {
      // Пытаемся взять данные из Redis
      let username = await redis.get(`username:${adminId}`);
      let avatar = await redis.get(`avatar:${adminId}`);
      const nickname = await redis.get(`nickname:${adminId}`);
      const department = await redis.get(`department:${adminId}`);
      const profileCustom = await redis.get(`profileCustom:${adminId}`);

      // 🔄 Если данных нет в Redis и есть bot-токен — тянем из Discord API
      if ((!username || !avatar) && botToken) {
        console.log(`[Admins] Загружаем данные для ${adminId} из Discord API`);
        const discordUser = await fetchDiscordUser(adminId, botToken);
        if (discordUser) {
          username = username || discordUser.username;
          avatar = avatar || discordUser.avatar;

          // Кэшируем в Redis, чтобы не дёргать API каждый раз
          if (discordUser.username) {
            await redis.set(`username:${adminId}`, discordUser.username);
          }
          if (discordUser.avatar) {
            await redis.set(`avatar:${adminId}`, discordUser.avatar);
          }
        }
      }

      // Пропускаем админов, чьи данные совсем не удалось получить
      admins.push({
        userId: adminId,
        username: username || 'Неизвестный',
        nickname: nickname || 'Ник не указан',
        department: department || 'Не указан',
        avatar: avatar || null,
        profileCustom: profileCustom ? JSON.parse(profileCustom) : null
      });
    }

    // Сортировка: сначала с ником, потом без
    admins.sort((a, b) => {
      if (a.nickname === 'Ник не указан') return 1;
      if (b.nickname === 'Ник не указан') return -1;
      return a.nickname.localeCompare(b.nickname);
    });

    return res.status(200).json({ admins });
  } catch (error) {
    console.error('Ошибка получения админов:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
