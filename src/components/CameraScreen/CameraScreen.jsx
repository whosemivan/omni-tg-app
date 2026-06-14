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

// Functional test: draw white pixel with brightness(0) filter, check it becomes black
const CTX_FILTER_OK = (() => {
  try {
    const c = document.createElement('canvas');
    c.width = 1; c.height = 1;
    const ctx = c.getContext('2d');
    ctx.filter = 'brightness(0)';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data[0] === 0;
  } catch { return false; }
})();

function parseFilterFunctions(css) {
  const out = [];
  const re = /([\w-]+)\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const raw = m[2].trim();
    out.push({ name: m[1], value: raw.endsWith('deg') ? parseFloat(raw) * (Math.PI / 180) : parseFloat(raw) });
  }
  return out;
}

function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

function mat3(r, g, b, m) {
  return [
    cl(r * m[0] + g * m[1] + b * m[2]),
    cl(r * m[3] + g * m[4] + b * m[5]),
    cl(r * m[6] + g * m[7] + b * m[8]),
  ];
}

function applyOne(name, val, r, g, b) {
  switch (name) {
    case 'brightness':
      return [cl(r * val), cl(g * val), cl(b * val)];
    case 'contrast':
      return [cl((r - 0.5) * val + 0.5), cl((g - 0.5) * val + 0.5), cl((b - 0.5) * val + 0.5)];
    case 'saturate':
      return mat3(r, g, b, [
        0.213 + 0.787 * val, 0.715 - 0.715 * val, 0.072 - 0.072 * val,
        0.213 - 0.213 * val, 0.715 + 0.285 * val, 0.072 - 0.072 * val,
        0.213 - 0.213 * val, 0.715 - 0.715 * val, 0.072 + 0.928 * val,
      ]);
    case 'sepia':
      return mat3(r, g, b, [
        0.393 + 0.607 * (1 - val), 0.769 - 0.769 * val, 0.189 - 0.189 * val,
        0.349 - 0.349 * val,       0.686 + 0.314 * val, 0.168 - 0.168 * val,
        0.272 - 0.272 * val,       0.534 - 0.534 * val, 0.131 + 0.869 * val,
      ]);
    case 'grayscale': {
      const s = 1 - val;
      return mat3(r, g, b, [
        0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s,
        0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s,
        0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s,
      ]);
    }
    case 'hue-rotate': {
      const cos = Math.cos(val), sin = Math.sin(val);
      return mat3(r, g, b, [
        0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928,
        0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283,
        0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072,
      ]);
    }
    case 'invert':
      return [cl(r + (1 - 2 * r) * val), cl(g + (1 - 2 * g) * val), cl(b + (1 - 2 * b) * val)];
    default:
      return [r, g, b];
  }
}

function bakeFilter(dataUrl, filterCss) {
  return new Promise((resolve) => {
    if (filterCss === 'none') { resolve(dataUrl); return; }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const cx = c.getContext('2d');

      if (CTX_FILTER_OK) {
        cx.filter = filterCss;
        cx.drawImage(img, 0, 0);
      } else {
        cx.drawImage(img, 0, 0);
        const funcs = parseFilterFunctions(filterCss);
        const id = cx.getImageData(0, 0, c.width, c.height);
        const d = id.data;
        for (let i = 0; i < d.length; i += 4) {
          let r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
          for (const f of funcs) [r, g, b] = applyOne(f.name, f.value, r, g, b);
          d[i] = r * 255; d[i + 1] = g * 255; d[i + 2] = b * 255;
        }
        cx.putImageData(id, 0, 0);
      }

      resolve(c.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

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
  // { dataUrl: string, filterCss: string } | null
  const [capturedPhoto, setCapturedPhoto] = useState(null);

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
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    // Step 1: capture raw mirrored frame and immediately export to data URL.
    // toDataURL works on iOS even when the canvas is camera-tainted.
    const raw = document.createElement('canvas');
    raw.width = w; raw.height = h;
    const rawCtx = raw.getContext('2d');
    rawCtx.save();
    if (mirrored) { rawCtx.translate(w, 0); rawCtx.scale(-1, 1); }
    rawCtx.drawImage(video, 0, 0);
    rawCtx.restore();
    const rawDataUrl = raw.toDataURL('image/jpeg', 0.92);

    // Step 2: load from data URL into an <img> so the next canvas is untainted,
    // then bake filter + logo and store result.
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const cx = c.getContext('2d');

      if (activeFilter.css === 'none' || !activeFilter.css) {
        cx.drawImage(img, 0, 0);
      } else if (CTX_FILTER_OK) {
        cx.filter = activeFilter.css;
        cx.drawImage(img, 0, 0);
        cx.filter = 'none';
      } else {
        // Manual pixel manipulation on untainted canvas — always safe
        cx.drawImage(img, 0, 0);
        const funcs = parseFilterFunctions(activeFilter.css);
        const id = cx.getImageData(0, 0, c.width, c.height);
        const d = id.data;
        for (let i = 0; i < d.length; i += 4) {
          let r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
          for (const f of funcs) [r, g, b] = applyOne(f.name, f.value, r, g, b);
          d[i] = r * 255; d[i + 1] = g * 255; d[i + 2] = b * 255;
        }
        cx.putImageData(id, 0, 0);
      }

      if (logoRef.current) {
        const logo = logoRef.current;
        const size = Math.round(c.width * 0.13);
        const pad = Math.round(c.width * 0.025);
        cx.filter = 'brightness(0)';
        cx.globalAlpha = 0.9;
        cx.drawImage(logo, c.width - size - pad, c.height - size - pad, size, size);
        cx.globalAlpha = 1;
        cx.filter = 'none';
      }

      setCapturedPhoto({ dataUrl: c.toDataURL('image/jpeg', 0.92), filterCss: 'none' });
    };
    img.onerror = () => {
      // Fallback: show raw photo with CSS filter; save without baked filter
      setCapturedPhoto({ dataUrl: rawDataUrl, filterCss: activeFilter.css });
    };
    img.src = rawDataUrl;
  }, [cameraReady, activeFilter, mirrored]);

  const handleSave = useCallback(async () => {
    if (!capturedPhoto) return;
    const { dataUrl } = capturedPhoto;

    try {
      // fetch('data:...') не работает в iOS WKWebView — конвертируем вручную
      const [meta, b64] = dataUrl.split(',');
      const mime = meta.match(/:(.*?);/)[1];
      const bytes = atob(b64);
      const arr = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob = new Blob([arr], { type: mime });
      const file = new File([blob], `omni-${Date.now()}.jpg`, { type: 'image/jpeg' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
    } catch (e) {
      if (e.name === 'AbortError') return;
    }

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `omni-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [capturedPhoto]);

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

        {capturedPhoto && (
          <div className={s.preview}>
            <img
              src={capturedPhoto.dataUrl}
              alt="Снимок"
              className={s.previewImg}
              style={{ filter: capturedPhoto.filterCss }}
            />
            <div className={s.previewActions}>
              <button type="button" className={s.retakeBtn} onClick={() => setCapturedPhoto(null)}>
                Переснять
              </button>
              <button type="button" className={s.saveBtn} onClick={handleSave}>
                Сохранить
              </button>
            </div>
          </div>
        )}
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
