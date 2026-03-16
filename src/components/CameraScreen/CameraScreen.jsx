import { useState, useCallback, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';
import s from './CameraScreen.module.scss';

const CONFETTI_DURATION_MS = 4000;

export default function CameraScreen() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [facingMode, setFacingMode] = useState('user');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [flash, setFlash] = useState(false);
  const [runConfetti, setRunConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState(
    typeof window !== 'undefined'
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 412, h: 691 },
  );

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async (facing) => {
    stopStream();
    setCameraReady(false);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch {
      setCameraError('Нет доступа к камере');
    }
  }, [stopStream]);

  useEffect(() => {
    startCamera(facingMode);
    return stopStream;
  }, [facingMode, startCamera, stopStream]);

  const handleFlip = useCallback(() => {
    setFacingMode((m) => (m === 'user' ? 'environment' : 'user'));
  }, []);

  const handleShutter = useCallback(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    setRunConfetti(true);
    setTimeout(() => setRunConfetti(false), CONFETTI_DURATION_MS);
  }, []);

  return (
    <div className={s.camera}>
      {runConfetti && (
        <Confetti
          width={windowSize.w}
          height={windowSize.h}
          run={runConfetti}
          recycle={false}
          numberOfPieces={300}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
        />
      )}

      <div className={s.viewfinder}>
        <video
          ref={videoRef}
          className={s.video}
          autoPlay
          playsInline
          muted
        />

        {!cameraReady && !cameraError && (
          <div className={s.noSignal}>
            <span>Подключение...</span>
          </div>
        )}

        {cameraError && (
          <div className={s.noSignal}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.2">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <circle cx="12" cy="11" r="4" />
              <rect x="15" y="5" width="3" height="2" rx="0.5" />
            </svg>
            <span>{cameraError}</span>
          </div>
        )}

        {flash && cameraReady && <div className={s.flashOverlay} />}
      </div>

      <div className={s.controls}>
        <button
          type="button"
          className={`${s.sideBtn} ${flash ? s.sideBtnActive : ''}`}
          aria-label="Вспышка"
          onClick={() => setFlash((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={flash ? '#ffd60a' : 'none'} stroke={flash ? '#ffd60a' : '#fff'} strokeWidth="1.6">
            <path d="M13 2L4.5 13.5h6L9 22l9.5-12.5h-6L13 2z" />
          </svg>
          <span className={s.sideBtnLabel}>{flash ? 'ON' : 'OFF'}</span>
        </button>

        <button type="button" className={s.shutter} aria-label="Снять" onClick={handleShutter}>
          <span className={s.shutterOuter}>
            <span className={s.shutterInner} />
          </span>
        </button>

        <button type="button" className={s.sideBtn} aria-label="Переключить камеру" onClick={handleFlip}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7l-3-3-3 3" />
            <path d="M17 4v8" />
            <path d="M4 17l3 3 3-3" />
            <path d="M7 20v-8" />
          </svg>
          <span className={s.sideBtnLabel}>Flip</span>
        </button>
      </div>
    </div>
  );
}
