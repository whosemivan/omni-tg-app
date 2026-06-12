import { useState, useCallback, useRef, useEffect } from 'react';
import s from './CameraScreen.module.scss';

const FILTERS = [
  { id: 'normal',   label: 'Normal',   css: 'none' },
  { id: 'rio',      label: 'Rio',      css: 'sepia(0.4) saturate(1.5) contrast(0.88) brightness(1.1) hue-rotate(-8deg)' },
  { id: 'valencia', label: 'Valencia', css: 'sepia(0.2) saturate(1.3) contrast(1.05) brightness(1.08) hue-rotate(10deg)' },
  { id: 'fade',     label: 'Fade',     css: 'contrast(0.75) brightness(1.2) saturate(0.55)' },
  { id: 'chrome',   label: 'Chrome',   css: 'grayscale(0.5) contrast(1.3) brightness(1.05) saturate(0.8)' },
  { id: 'lomo',     label: 'Lomo',     css: 'contrast(1.5) saturate(1.7) brightness(0.88)' },
  { id: 'bw',       label: 'B&W',      css: 'grayscale(1) contrast(1.1)' },
  { id: 'negative', label: 'Negative', css: 'invert(1)' },
];

export default function CameraScreen() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/images/logo.png';
    img.onload = () => { logoRef.current = img; };
  }, []);

  const [facingMode, setFacingMode] = useState('user');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [flash, setFlash] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState('normal');

  const activeFilter = FILTERS.find((f) => f.id === activeFilterId) ?? FILTERS[0];
  const mirrored = facingMode === 'user';

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
    if (!videoRef.current || !cameraReady) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.save();
    if (activeFilter.css !== 'none') ctx.filter = activeFilter.css;
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    if (logoRef.current) {
      const logo = logoRef.current;
      const size = Math.round(canvas.width * 0.13);
      const pad = Math.round(canvas.width * 0.025);
      ctx.filter = 'brightness(0)';
      ctx.globalAlpha = 0.9;
      ctx.drawImage(logo, canvas.width - size - pad, canvas.height - size - pad, size, size);
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
    }

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.download = `omni-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [cameraReady, activeFilter]);

  return (
    <div className={s.camera}>
      <div className={s.viewfinder}>
        <video
          ref={videoRef}
          className={s.video}
          style={{ filter: activeFilter.css, transform: mirrored ? 'scaleX(-1)' : 'none' }}
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

      <div className={s.filterStrip}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${s.filterItem} ${f.id === activeFilterId ? s.filterItemActive : ''}`}
            onClick={() => setActiveFilterId(f.id)}
          >
            <span className={s.filterCircle} style={{ filter: f.css }} />
            <span className={s.filterLabel}>{f.label}</span>
          </button>
        ))}
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
