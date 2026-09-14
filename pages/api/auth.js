import { getDiscordToken, getDiscordUser, createToken } from '../../lib/discord';
import redis from '../../lib/redis';

export default async function handler(req, res) {
  const { code, error, state } = req.query;

  if (error) return res.redirect('/?error=access_denied');
  if (!code) return res.redirect('/?error=no_code');

  // Проверяем state (защита от CSRF)
  const stateKey = `oauth_state:${state}`;
  const savedState = await redis.get(stateKey);
  if (!savedState || savedState !== '1') {
    return res.redirect('/?error=invalid_state');
  }
  await redis.del(stateKey);

  try {
    const tokenData = await getDiscordToken(code);
    const user = await getDiscordUser(tokenData.access_token);
    const jwtToken = createToken(user);

    await redis.set(`username:${user.id}`, user.username);
    if (user.avatar) {
      await redis.set(`avatar:${user.id}`, user.avatar);
    }

    const isLocal = process.env.NODE_ENV === 'development';
    const secureFlag = isLocal ? '' : '; Secure';

    res.setHeader('Set-Cookie', `token=${jwtToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${secureFlag}`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect('/?error=auth_failed');
  }
}
