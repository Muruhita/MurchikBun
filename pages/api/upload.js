import { verifyToken } from '../../lib/discord';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 🔒 Только авторизованные
  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'IMGBB_API_KEY не настроен' });
  }

  try {
    const { image } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Нет изображения' });
    }

    // Убираем data:image/...;base64,
    const base64 = image.replace(/^data:.*?;base64,/, '');

    // ~5 МБ лимит
    if (base64.length > 7 * 1024 * 1024) {
      return res.status(413).json({ error: 'Файл больше 5 МБ' });
    }

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64);

    const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await imgbbRes.json();

    if (!imgbbRes.ok || !data.success) {
      console.error('[imgbb] ошибка:', imgbbRes.status, data);
      return res.status(imgbbRes.status).json({
        error: data?.error?.message || 'Ошибка imgbb',
        imgbbStatus: imgbbRes.status,
        imgbbBody: data
      });
    }

    return res.status(200).json({
      url: data.data.url,           // https://i.ibb.co/xxxx/image.png
      displayUrl: data.data.display_url,
      deleteUrl: data.data.delete_url,
      id: data.data.id
    });
  } catch (error) {
    console.error('[upload] ошибка:', error);
    return res.status(500).json({ error: error.message || 'Ошибка загрузки' });
  }
}
