import s from './Header.module.scss';

export default function Header({ title, onSettingsClick, onFaqClick }) {
  return (
    <header className={s.header}>
      <span className={`${s.title} ${!title ? s.logo : ''}`}>{title ?? 'Omnistudio'}</span>
      <div className={s.actions}>
        {onFaqClick !== undefined && (
          <button
            type="button"
            className={s.actionBtn}
            aria-label="FAQ"
            onClick={onFaqClick}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
          </button>
        )}
        {onSettingsClick !== undefined && (
          <button
            type="button"
            className={s.settingsBtn}
            aria-label="Settings"
            onClick={onSettingsClick}
          >
            <img
              src="/images/header-settings-btn.svg"
              alt=""
              width="44"
              height="37"
            />
          </button>
        )}
      </div>
    </header>
  );
}
