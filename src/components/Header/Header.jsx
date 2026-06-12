import s from './Header.module.scss';

export default function Header({ title, onSettingsClick }) {
  return (
    <header className={s.header}>
      <span className={`${s.title} ${!title ? s.logo : ''}`}>{title ?? 'Omnistudio'}</span>
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
    </header>
  );
}
