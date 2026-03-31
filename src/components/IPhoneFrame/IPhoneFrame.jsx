import { useState, useEffect } from 'react';
import styles from './IPhoneFrame.module.scss';

export default function IPhoneFrame({ children }) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth > 768
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isDesktop) return children;

  return (
    <div className={styles.desktop}>
      <div className={styles.frame}>
        <div className={styles.topBezel}>
          <div className={styles.camera} />
          <div className={styles.speaker} />
        </div>

        <div className={styles.screen}>
          <div className={styles.scrollContent}>
            {children}
          </div>
        </div>

        <div className={styles.bottomBezel}>
          <div className={styles.homeButton}>
            <div className={styles.homeButtonInner} />
          </div>
        </div>
      </div>
    </div>
  );
}
