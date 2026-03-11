import s from './BottomNav.module.scss';

export default function BottomNav({ activeTab = 'profile', onTabChange }) {
  return (
    <nav className={s.nav} role="navigation">
      <button
        type="button"
        className={`${s.item} ${activeTab === 'home' ? s.active : ''}`}
        aria-label="Главная"
        aria-current={activeTab === 'home' ? 'true' : undefined}
        onClick={() => onTabChange?.('home')}
      >
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10h4v-5h6v5h4V10" />
        </svg>
      </button>

      <button
        type="button"
        className={`${s.item} ${activeTab === 'explore' ? s.active : ''}`}
        aria-label="Обзор"
        aria-current={activeTab === 'explore' ? 'true' : undefined}
        onClick={() => onTabChange?.('explore')}
      >
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41" />
        </svg>
      </button>

      <button
        type="button"
        className={`${s.item} ${activeTab === 'camera' ? s.active : ''}`}
        aria-label="Камера"
        aria-current={activeTab === 'camera' ? 'true' : undefined}
        onClick={() => onTabChange?.('camera')}
      >
        <svg className={s.icon} width="26" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <circle cx="12" cy="11" r="4" />
          <rect x="15" y="5" width="3" height="2" rx="0.5" />
        </svg>
      </button>

      <button
        type="button"
        className={`${s.item} ${activeTab === 'notifications' ? s.active : ''}`}
        aria-label="Уведомления"
        aria-current={activeTab === 'notifications' ? 'true' : undefined}
        onClick={() => onTabChange?.('notifications')}
      >
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 16.2c-1.4-1.2-2.5-2.2-2.5-3.4 0-.9.7-1.6 1.6-1.6.5 0 1 .2 1.4.5.3-.3.9-.5 1.4-.5.9 0 1.6.7 1.6 1.6 0 1.2-1.1 2.2-2.5 3.4z" fill="currentColor" stroke="none" />
        </svg>
      </button>

      <button
        type="button"
        className={`${s.item} ${activeTab === 'profile' ? s.active : ''}`}
        aria-label="Профиль"
        aria-current={activeTab === 'profile' ? 'true' : undefined}
        onClick={() => onTabChange?.('profile')}
      >
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <path d="M12 8h4M12 12h4M12 16h4" strokeLinecap="round" />
        </svg>
      </button>
    </nav>
  );
}
