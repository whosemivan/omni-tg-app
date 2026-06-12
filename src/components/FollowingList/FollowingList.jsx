import { ENGINEERS_ARTICLE } from '../../data/engineers';
import { useEngineers } from '../../hooks/useEngineers';
import s from './FollowingList.module.scss';

export default function FollowingList({ onBack }) {
  const { engineers, loading } = useEngineers();

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <button type="button" className={s.backBtn} onClick={onBack} aria-label="Назад">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className={s.toolbarTitle}>Following</span>
        <span className={s.toolbarCount}>{loading ? '…' : engineers.length}</span>
      </div>

      <a
        href={ENGINEERS_ARTICLE}
        target="_blank"
        rel="noopener noreferrer"
        className={s.articleBanner}
      >
        Подробнее о каждом звукаре →
      </a>

      <ul className={s.list}>
        {engineers.map((eng) => (
          <li key={eng.id} className={s.row}>
            <img className={s.avatar} src={eng.avatar} alt={eng.name} />
            <div className={s.info}>
              <span className={s.name}>{eng.name}</span>
              <span className={s.meta}>
                {eng.rate ? `${eng.rate.toLocaleString('ru-RU')} ₽/ч` : 'дистанционно'}
              </span>
            </div>
            {eng.telegram ? (
              <a
                href={`https://t.me/${eng.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={s.tgBtn}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.46.7-.92.44l-2.56-1.88-1.24 1.2c-.14.14-.26.26-.52.26l.18-2.6 4.72-4.26c.2-.18-.04-.28-.32-.1L7.6 14.42 5.08 13.6c-.56-.18-.58-.56.12-.82l10.32-3.98c.46-.18.86.1.72.8z"/>
                </svg>
                TG
              </a>
            ) : (
              <span className={s.badge}>скоро</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
