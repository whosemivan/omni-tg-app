import { useState, useCallback } from 'react';
import Confetti from 'react-confetti';
import s from './Header.module.scss';

const CONFETTI_DURATION_MS = 4000;

export default function Header({title}) {
  const [runConfetti, setRunConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState(
    typeof window !== 'undefined' ? { w: window.innerWidth, h: window.innerHeight } : { w: 412, h: 691 }
  );

  const handleSettingsClick = useCallback(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    setRunConfetti(true);
    setTimeout(() => setRunConfetti(false), CONFETTI_DURATION_MS);
  }, []);

  return (
    <>
      {runConfetti && (
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          run={runConfetti}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <header className={s.header}>
        <span className={`${s.title} ${!title ? s.logo : ''}`}>{title ?? 'Omnistudio'}</span>
        <button
          type="button"
          className={s.settingsBtn}
          aria-label="Settings"
          onClick={handleSettingsClick}
        >
          <img
            src="/images/header-settings-btn.svg"
            alt=""
            width="44"
            height="37"
          />
        </button>
      </header>
    </>
  );
}
