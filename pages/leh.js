import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Leh() {
  const router = useRouter();

  return (
    <Layout>
      <div className="legal-page">
        <div className="legal-container">
          <h1>📜 Условия Пользования</h1>
          <p className="updated">Последнее обновление: сентябрь 2026</p>

          <section>
            <h2>1. Общие положения</h2>
            <p>
              Настоящие Условия Пользования регулируют использование Discord-бота
              <strong> FIB Forms</strong> и связанного с ним сайта. Используя бота или сайт,
              вы подтверждаете, что ознакомились с условиями и согласны их соблюдать.
            </p>
            <p>
              Если вы не согласны с любым пунктом — пожалуйста, прекратите использование.
            </p>
          </section>

          <section>
            <h2>2. Кто может пользоваться</h2>
            <ul>
              <li>Участники фракции <strong>FIB</strong> на игровом сервере Majestic RP</li>
              <li>Лица старше 13 лет (в соответствии с правилами Discord)</li>
              <li>Пользователи с действующим Discord-аккаунтом</li>
            </ul>
          </section>

          <section>
            <h2>3. Что можно делать</h2>
            <ul>
              <li>Подавать заявки через формы (повышение, отпуск, перевод и т.д.)</li>
              <li>Заполнять профиль — ник и отдел</li>
              <li>Просматривать справку, правила и общую информацию</li>
              <li>Общаться с администрацией через тех. поддержку</li>
              <li>Участвовать в мини-игре и других активностях бота</li>
            </ul>
          </section>

          <section>
            <h2>4. Что запрещено</h2>
            <p>При использовании бота и сайта <strong>запрещается</strong>:</p>
            <ul>
              <li>Отправлять спам, дублировать заявки, флудить формами</li>
              <li>Использовать нецензурную лексику, оскорбления, угрозы</li>
              <li>Пытаться взломать, обойти защиту или автоматизировать отправку</li>
              <li>Выдавать себя за другого человека или администратора</li>
              <li>Загружать файлы с вирусами, запрещённым контентом, NSFW</li>
              <li>Нарушать правила Discord и правила сервера Majestic RP</li>
              <li>Использовать бота для любых целей, не связанных с фракцией</li>
            </ul>
            <p>
              За нарушение — блокировка доступа <strong>на 7 дней</strong> или
              <strong> навсегда</strong>, без предварительного уведомления.
            </p>
          </section>

          <section>
            <h2>5. Ответственность пользователя</h2>
            <p>Вы несёте ответственность за:</p>
            <ul>
              <li>Правильность данных, которые вы указываете в формах</li>
              <li>Действия, совершённые с вашего Discord-аккаунта</li>
              <li>Содержимое текстов и скриншотов, которые вы загружаете</li>
              <li>Соблюдение правил фракции и сервера</li>
            </ul>
          </section>

          <section>
            <h2>6. Ответственность администрации</h2>
            <p>
              Администрация бота <strong>не несёт ответственности</strong> за:
            </p>
            <ul>
              <li>Возможные технические сбои, потери данных или задержки</li>
              <li>Решения, принятые по вашим заявкам</li>
              <li>Действия третьих сервисов (Discord, Vercel, imgbb, Redis)</li>
              <li>Ущерб, возникший из-за неправильно указанных данных</li>
            </ul>
            <p>
              Бот предоставляется <strong>«как есть»</strong>. Мы стараемся поддерживать
              его работу стабильной, но не гарантируем 100% доступность.
            </p>
          </section>

          <section>
            <h2>7. Отправка заявок</h2>
            <ul>
              <li>Заявки уходят в Discord-каналы администрации фракции</li>
              <li>Сроки рассмотрения определяет администрация и не гарантируется</li>
              <li>Заявку можно отклонить без объяснения причин</li>
              <li>Повторная подача при отклонении возможна через 24 часа</li>
            </ul>
          </section>

          <section>
            <h2>8. Блокировка и снятие</h2>
            <p>
              Администрация вправе заблокировать доступ пользователю за нарушение
              условий. Срок блокировки — от 7 дней до бессрочной. Снятие возможно
              через обращение в тех. поддержку или Discord.
            </p>
          </section>

          <section>
            <h2>9. Изменение условий</h2>
            <p>
              Мы можем обновлять эти Условия. Продолжение использования бота
              после изменений означает согласие с новой редакцией. Актуальная
              версия всегда доступна на этой странице.
            </p>
          </section>

          <section>
            <h2>10. Контакты</h2>
            <p>По всем вопросам обращайтесь:</p>
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
        section { margin-bottom: 28px; }
        h2 {
          color: #C4A5F0;
          font-size: 18px;
          margin-bottom: 12px;
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
