import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Leh() {
  const router = useRouter();

  return (
    <Layout>
      <div className="l-header">
        <div className="l-prompt">
          <span className="l-sym">$</span>
          <span className="l-cmd">cat /etc/legal/terms-of-service.md</span>
          <span className="l-cursor">█</span>
        </div>
        <div className="l-meta">
          <span className="l-meta-tag">v2026.09.18</span>
        </div>
      </div>

      <div className="l-wrap">
        <div className="l-block">
          <div className="l-block-head">
            <span>legal::terms-of-service</span>
            <span className="l-block-meta">READONLY</span>
          </div>

          <div className="l-block-body">
            <h1 className="l-title">📜 Условия Пользования</h1>
            <p className="l-meta-line">// last-updated: 22:22 18/09/2026</p>

            <section>
              <h2>1. Общие положения</h2>
              <p>Настоящие Условия Пользования регулируют использование Discord-бота <strong>FIB Forms</strong> и связанного с ним сайта. Используя бота или сайт, вы подтверждаете, что ознакомились с условиями и согласны их соблюдать.</p>
              <p>Если вы не согласны с любым пунктом — пожалуйста, прекратите использование.</p>
            </section>

            <section>
              <h2>2. Кто может пользоваться</h2>
              <ul>
                <li>Игроки игрового сервера Boston Majestic RP</li>
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
                <li>Загружать файлы с запрещённым контентом, NSFW</li>
                <li>Нарушать правила Discord и правила сервера Majestic RP</li>
                <li>Использовать бота для любых целей, не связанных с фракцией</li>
              </ul>
              <p>За нарушение — блокировка доступа <strong>на 7 дней</strong> или <strong>навсегда</strong>, без предварительного уведомления.</p>
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
              <p>Администрация бота <strong>не несёт ответственности</strong> за:</p>
              <ul>
                <li>Возможные технические сбои или задержки</li>
                <li>Решения, принятые по вашим заявкам</li>
                <li>Действия третьих сервисов (Discord, Vercel, imgbb, Redis)</li>
                <li>Ущерб, возникший из-за неправильно указанных данных</li>
              </ul>
              <p>Бот предоставляется <strong>«как есть»</strong>. Мы стараемся поддерживать его работу стабильной, но не гарантируем 100% доступность.</p>
            </section>

            <section>
              <h2>7. Отправка заявок</h2>
              <ul>
                <li>Заявки уходят в Discord-каналы сервера фракции</li>
                <li>Сроки рассмотрения определяет администрация и не гарантируется</li>
              </ul>
            </section>

            <section>
              <h2>8. Блокировка и снятие</h2>
              <p>Администрация вправе заблокировать доступ пользователю за нарушение условий. Срок блокировки — от 7 дней до бессрочной. Снятие возможно через обращение в тех. поддержку или Discord.</p>
            </section>

            <section>
              <h2>9. Изменение условий</h2>
              <p>Мы можем обновлять эти Условия. Продолжение использования бота после изменений означает согласие с новой редакцией. Актуальная версия всегда доступна на этой странице.</p>
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

            <button className="l-exit" onClick={() => router.push('/dashboard')}>
              [ exit ]
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .l-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px dashed var(--term-border);
          font-size: 13px;
        }
        .l-prompt { display: flex; align-items: center; gap: 8px; }
        .l-sym { color: var(--term-fg-dim); font-weight: 700; }
        .l-cmd { color: var(--term-fg); font-weight: 600; }
        .l-cursor { color: var(--term-fg); font-size: 12px; animation: term-blink 1.1s step-end infinite; }
        @keyframes term-blink { 50% { opacity: 0; } }
        .l-meta-tag {
          padding: 2px 8px;
          border: 1px solid var(--term-border);
          color: var(--term-fg-dim);
          font-size: 10px;
          letter-spacing: 1px;
        }

        .l-wrap { max-width: 820px; margin: 0 auto; }
        .l-block { background: var(--term-bg-panel); border: 1px solid var(--term-border); }
        .l-block-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px dashed var(--term-border);
          font-size: 11px;
          letter-spacing: 1.5px;
          color: var(--term-fg-dim);
          text-transform: uppercase;
        }
        .l-block-meta {
          padding: 1px 8px;
          border: 1px solid var(--term-border);
          font-size: 9px;
        }
        .l-block-body { padding: 32px 40px; }

        .l-title {
          color: var(--term-fg);
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 6px;
          letter-spacing: 0.5px;
        }
        .l-meta-line {
          color: var(--term-fg-dimmer);
          font-size: 11px;
          margin: 0 0 26px;
          padding-bottom: 16px;
          border-bottom: 1px dashed var(--term-border);
          letter-spacing: 0.5px;
        }

        section { margin-bottom: 24px; }

        h2 {
          color: var(--term-fg);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        h2::before { content: '## '; color: var(--term-fg-dimmer); }

        p {
          color: var(--term-fg-dim);
          font-size: 13px;
          line-height: 1.75;
          margin-bottom: 10px;
        }

        ul { list-style: none; padding: 0; margin-bottom: 10px; }
        li {
          color: var(--term-fg-dim);
          font-size: 13px;
          line-height: 1.75;
          padding-left: 22px;
          position: relative;
          margin-bottom: 4px;
        }
        li::before {
          content: '▸';
          color: var(--term-fg-dimmer);
          position: absolute;
          left: 6px;
        }

        strong { color: var(--term-fg); font-weight: 700; }

        a {
          color: var(--term-fg);
          text-decoration: none;
          border-bottom: 1px dashed var(--term-fg-dimmer);
          transition: all 0.15s;
        }
        a:hover { border-bottom-style: solid; }

        .l-exit {
          display: block;
          width: 100%;
          margin-top: 32px;
          padding: 12px;
          background: transparent;
          border: 1px solid var(--term-border-bright);
          color: var(--term-fg-dim);
          font-family: inherit;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }
        .l-exit:hover {
          background: var(--term-fg);
          color: var(--term-bg);
          border-color: var(--term-fg);
        }

        @media (max-width: 600px) {
          .l-block-body { padding: 22px 20px; }
          .l-title { font-size: 18px; }
        }
      `}</style>
    </Layout>
  );
}
