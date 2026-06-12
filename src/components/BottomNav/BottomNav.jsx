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
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 20V14H15V20H19V12H22L12 3L2 12H5V20H9Z" fill="currentColor"/>
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
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H7L9 2H15L17 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17ZM12 15C10.9 15 10 14.1 10 13C10 11.9 10.9 11 12 11C13.1 11 14 11.9 14 13C14 14.1 13.1 15 12 15Z" fill="currentColor"/>
        </svg>
      </button>

      <button
        type="button"
        className={`${s.item} ${activeTab === 'address' ? s.active : ''}`}
        aria-label="Адрес"
        aria-current={activeTab === 'notifications' ? 'true' : undefined}
        onClick={() => onTabChange?.('address')}
      >
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
        </svg>
      </button>

      <button
        type="button"
        className={`${s.item} ${activeTab === 'profile' ? s.active : ''}`}
        aria-label="Профиль"
        aria-current={activeTab === 'profile' ? 'true' : undefined}
        onClick={() => onTabChange?.('profile')}
      >
        <svg className={s.icon} width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
        </svg>
      </button>
    </nav>
  );
}
