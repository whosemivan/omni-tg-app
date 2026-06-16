import s from './ProfileSection.module.scss';

export default function ProfileSection({ servicesCount, followersCount, followingCount, onBook, onFollowingClick }) {
  return (
    <section className={s.profile}>
      <div className={s.topRow}>
        <div className={s.avatarWrap}>
          <img
            className={s.avatar}
            src="/images/logo.png"
            alt="Omni Studio"
          />
        </div>
        <div className={s.statsAndBook}>
          <div className={s.stats}>
            <div className={s.stat}>
              <span className={s.statNum}>{servicesCount}</span>
              <span className={s.statLabel}>services</span>
            </div>
            <div className={s.stat}>
              <span className={s.statNum}>{followersCount}</span>
              <span className={s.statLabel}>followers</span>
            </div>
            <button type="button" className={s.stat} onClick={onFollowingClick}>
              <span className={s.statNum}>{followingCount}</span>
              <span className={s.statLabel}>following</span>
            </button>
          </div>
          <button className={s.bookBtn} onClick={onBook}>
            Бронь
          </button>
        </div>
      </div>

      <div className={s.divider} />

      <div className={s.info}>
        <h1 className={s.name}>Omni Studio</h1>
        <p className={s.bio}>
          запись, сведение, аренда, написание битов, обучение сведению и
          битмейкингу, диджеинг
        </p>
        <a className={s.link} href="https://t.me/omnistud1o" target="_blank" rel="noreferrer">
          @omnistud1o
        </a>
      </div>
    </section>
  );
}
