import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Geh() {
  const router = useRouter();

  return (
    <Layout>
      <div className="legal-page">
        <div className="legal-container">
          <h1>🔒 Политика Конфиденциальности</h1>
          <p className="updated">Последнее обновление:22:22 18/09/2026</p>

          <section>
            <h2>1. Общее</h2>
            <p>
              Настоящая Политика Конфиденциальности описывает, какие данные собирает
              Discord-бот <strong>FIB Forms</strong> и связанный с ним сайт, как они
              используются, хранятся и защищаются.
            </p>
            <p>
              Пользуясь ботом и сайтом, вы соглашаетесь с условиями данной Политики.
            </p>
          </section>

          <section>
            <h2>2. Какие данные мы собираем</h2>
            <p>При авторизации через Discord мы получаем и храним только:</p>
            <ul>
              <li><strong>Discord ID</strong> — уникальный идентификатор аккаунта</li>
              <li><strong>Username</strong> (@имя) и <strong>аватар</strong></li>
              <li><strong>Игровой ник и отдел</strong>, которые вы указываете сами в профиле</li>
              <li><strong>Текст заявок</strong>, которые вы отправляете через формы</li>
              <li><strong>Загруженные скриншоты</strong> (через сервис imgbb)</li>
              <li><strong>Технический лог</strong> — время и тип запросов (для защиты от спама)</li>
            </ul>
            <p>
              Мы <strong>не собираем</strong>: пароли, email, номер телефона, IP-адрес в открытом виде,
              содержимое других ваших сообщений в Discord, доступ к личным чатам.
            </p>
          </section>

          <section>
            <h2>3. Как используются данные</h2>
            <ul>
              <li>Для идентификации вас на сайте и в боте</li>
              <li>Для обработки ваших заявок и отправки их администрации в Discord</li>
              <li>Для защиты от спама, ботов и нарушений</li>
              <li>Для отображения вашего профиля в общих списках участников</li>
            </ul>
            <p>Мы <strong>никогда не продаём</strong> и не передаём ваши данные третьим лицам в коммерческих целях.</p>
          </section>

          <section>
            <h2>4. Где хранятся данные</h2>
            <ul>
              <li><strong>Redis (Upstash)</strong> — база данных с профилями, заявками и статистикой</li>
              <li><strong>Vercel</strong> — хостинг сайта и API</li>
              <li><strong>imgbb</strong> — хостинг загруженных скриншотов</li>
              <li><strong>Discord</strong> — каналы, куда отправляются ваши заявки</li>
            </ul>
            <p>
              Все данные передаются по защищённому протоколу <strong>HTTPS</strong> и хранятся
              в зашифрованном виде.
            </p>
          </section>

          <section>
            <h2>5. Срок хранения</h2>
            <ul>
              <li>Профиль — пока вы пользуетесь ботом</li>
              <li>Заявки — бессрочно, для истории решений</li>
              <li>Логи о спаме — до 7 дней</li>
              <li>Баны — на срок, указанный при блокировке (обычно 7 дней или навсегда)</li>
            </ul>
          </section>

          <section>
            <h2>6. Ваши права</h2>
            <p>Вы вправе:</p>
            <ul>
              <li>Запросить копию своих данных</li>
              <li>Потребовать удаления профиля и всех связанных данных</li>
              <li>Исправить неточную информацию через профиль</li>
              <li>Отозвать согласие — просто перестать пользоваться ботом</li>
            </ul>
            <p>Для любого запроса — напишите на почту: <a href="mailto:murkilanki@gmail.com">murkilanki@gmail.com</a></p>
          </section>

          <section>
            <h2>7. Безопасность</h2>
            <p>
              Мы делаем всё возможное для защиты ваших данных: используем токены,
              ограничиваем доступ администраторов, шифруем трафик. Однако никакая
              система не даёт 100% гарантии, поэтому используйте бота осознанно.
            </p>
          </section>

          <section>
            <h2>8. Изменения в Политике</h2>
            <p>
              Мы можем обновлять эту Политику. Актуальная версия всегда доступна
              на этой странице. Продолжая пользоваться ботом после обновления,
              вы соглашаетесь с новыми условиями.
            </p>
          </section>

          <section>
            <h2>9. Контакты</h2>
            <p>По всем вопросам, связанным с обработкой персональных данных:</p>
            <ul>
              <li><strong>Разработчик:</strong> Mura Kiratu</li>
              <li><strong>Discord:</strong> @muruh1ta</li>
              <li><strong>Email:</strong> <a href="mailto:murkilanki@gmail.com">murkilanki@gmail.com</a></li>
            </ul>
          </section>

          <button className="back-btn" onClick={() => router.push('/dashboard')}>
            ← Вернуться на главную
          </button>
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          min-height: 100vh;
          padding: 40px 20px;
        }
        .legal-container {
          max-width: 820px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 48px 56px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.5s ease;
        }
        h1 {
          color: #fff;
          font-size: 30px;
          margin-bottom: 8px;
        }
        .updated {
          color: #666;
          font-size: 13px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        section {
          margin-bottom: 28px;
        }
        h2 {
          color: #fff;
          font-size: 18px;
          margin-bottom: 12px;
          color: #C4A5F0;
        }
        p {
          color: #c8c8c8;
          font-size: 15px;
          line-height: 1.75;
          margin-bottom: 12px;
        }
        ul {
          list-style: none;
          padding-left: 0;
          margin-bottom: 12px;
        }
        li {
          color: #c8c8c8;
          font-size: 15px;
          line-height: 1.75;
          padding-left: 22px;
          position: relative;
          margin-bottom: 4px;
        }
        li::before {
          content: '•';
          color: #A855F7;
          position: absolute;
          left: 6px;
          font-weight: bold;
        }
        strong { color: #fff; }
        a {
          color: #A855F7;
          text-decoration: none;
          border-bottom: 1px dashed rgba(168, 85, 247, 0.4);
          transition: all 0.2s;
        }
        a:hover {
          color: #C4A5F0;
          border-bottom-style: solid;
        }
        .back-btn {
          display: block;
          width: 100%;
          margin-top: 40px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.25s;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .legal-container { padding: 28px 22px; }
          h1 { font-size: 22px; }
        }
      `}</style>
    </Layout>
  );
}
