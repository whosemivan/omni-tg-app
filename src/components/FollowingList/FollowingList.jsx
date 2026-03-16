import { ENGINEERS, ENGINEERS_ARTICLE } from '../../data/engineers';
import s from './FollowingList.module.scss';

export default function FollowingList({ onBack }) {
  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <button type="button" className={s.backBtn} onClick={onBack} aria-label="Назад">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className={s.toolbarTitle}>Following</span>
        <span className={s.toolbarCount}>{ENGINEERS.length}</span>
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
        {ENGINEERS.map((eng) => (
          <li key={eng.id} className={s.row}>
            <img className={s.avatar} src={eng.avatar} alt={eng.name} />
            <div className={s.info}>
              <span className={s.name}>{eng.name}</span>
              <span className={s.meta}>
                {eng.rate ? `${eng.rate.toLocaleString('ru-RU')} ₽/ч` : 'дистанционно'}
              </span>
            </div>
            <span className={s.badge}>Подписаться</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
