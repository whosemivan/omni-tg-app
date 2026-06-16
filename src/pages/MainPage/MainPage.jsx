import styles from './MainPage.module.scss';

export default function MainPage({ onBook }) {
  return (
    <div className={styles.page}>
      <img src="/images/bc.jpg" alt="" className={styles.bg} />
      <div className={styles.strip} />
      <img src="/images/logo.svg" alt="Garden Music" className={styles.logo} />
      <p className={styles.coords}>55°44'33"N 37°42'27"E</p>
      <button className={styles.bookBtn} onClick={onBook} aria-label="Забронировать">
        <img src="/images/БРОНЬ.svg" alt="Бронь" />
      </button>
    </div>
  );
}
