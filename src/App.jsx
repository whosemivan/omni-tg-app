import { useState } from 'react';
import MainPage from './pages/MainPage/MainPage';
import BookingPage from './pages/BookingPage/BookingPage';
import styles from './App.module.scss';

export default function App() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.flipbook}>
      <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
        <div className={styles.face}>
          <MainPage onBook={() => setFlipped(true)} />
        </div>
        <div className={`${styles.face} ${styles.back}`}>
          <BookingPage onBack={() => setFlipped(false)} />
        </div>
      </div>
    </div>
  );
}
