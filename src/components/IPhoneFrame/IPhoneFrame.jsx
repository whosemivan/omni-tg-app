import { useState, useEffect } from 'react';
import styles from './IPhoneFrame.module.scss';

export default function IPhoneFrame({ children }) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth > 768
  );
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isDesktop) return children;

  return (
    <div className={styles.desktop}>
      <div className={styles.outerShell}>
        <button className={styles.powerBtn} onClick={() => setIsOn(v => !v)} />
        <div className={styles.innerBody}>
          <div className={`${styles.screen}${isOn ? '' : ` ${styles.screenOff}`}`}>
            <div className={styles.scrollContent}>
              {children}
            </div>
          </div>
          <div className={styles.homeButton}>
            <div className={styles.homeButtonInner} />
          </div>
        </div>
      </div>
      <p className={styles.desktopAddress}>Москва, М. Дмитровская / Новодмитровская 5А с3</p>
      <img src="/images/whitelogo.png" alt="Omni Studio" className={styles.desktopLogo} />
    </div>
  );
}
