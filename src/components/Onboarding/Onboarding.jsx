import { useState, useEffect } from 'react';
import styles from './Onboarding.module.scss';

const PHRASES = [
  'подгружаем омни-файлы..',
  'скоро все будет..',
  'подгружаем мега-услуги..',
  'ещё чуть-чуть..',
  'че как дела вообще?',
  'сейчас всё будет..',
];

export default function Onboarding() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
      }, 5000);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.onboardingRoot}>
      <img
        src="/images/logo.png"
        alt="Omni Studio logo"
        className={styles.logo}
      />
      <div className={styles.loaderWrap}>
        <span className={styles.spinner} />
        <p key={phraseIdx} className={styles.phrase}>
          {PHRASES[phraseIdx]}
        </p>
      </div>
    </div>
  );
}
