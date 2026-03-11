import s from './TabBar.module.scss';

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className={s.tabBar}>
      <button
        className={`${s.tab} ${activeTab === 'grid' ? s.active : ''}`}
        onClick={() => onTabChange('grid')}
        aria-label="Grid view"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="17" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          <rect x="17" y="9" width="6" height="6" rx="1" />
          <rect x="1" y="17" width="6" height="6" rx="1" />
          <rect x="9" y="17" width="6" height="6" rx="1" />
          <rect x="17" y="17" width="6" height="6" rx="1" />
        </svg>
      </button>

      <button
        className={`${s.tab} ${activeTab === 'feed' ? s.active : ''}`}
        onClick={() => onTabChange('feed')}
        aria-label="Feed view"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="3" width="20" height="2" rx="1" />
          <rect x="2" y="8" width="20" height="2" rx="1" />
          <rect x="2" y="13" width="20" height="2" rx="1" />
          <rect x="2" y="18" width="14" height="2" rx="1" />
        </svg>
      </button>

      <button
        className={`${s.tab} ${activeTab === 'map' ? s.active : ''}`}
        onClick={() => onTabChange('map')}
        aria-label="Location"
      >
        <div className={s.mapTab}>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 14 8 14s8-8.75 8-14c0-4.42-3.58-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
          </svg>
          <span className={s.mapLabel}>Адрес</span>
          <svg className={s.chevron} width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </button>
    </div>
  );
}
