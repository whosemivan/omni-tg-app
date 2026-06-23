import { useState, useRef } from 'react';
import s from './GuestPost.module.scss';

export default function GuestPost({ photo, index, onConfetti }) {
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const heartTimer = useRef(null);

  const handleDoubleClick = () => {
    if (!liked) { setLiked(true); onConfetti?.(); }
    clearTimeout(heartTimer.current);
    setShowHeart(true);
    heartTimer.current = setTimeout(() => setShowHeart(false), 800);
  };

  const sharePost = () => {
    const url = 'https://t.me/omnistudioo';
    if (window.Telegram?.WebApp?.shareUrl) {
      window.Telegram.WebApp.shareUrl(url);
    } else if (navigator.share) {
      navigator.share({ url });
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <article className={s.post}>
      <div className={s.postHeader}>
        <div className={s.avatar}>
          <img src="/images/logo.png" alt="Omni Studio" />
        </div>
        <span className={s.username}>omnistud1o</span>
      </div>

      <div className={s.imageWrap} onDoubleClick={handleDoubleClick}>
        <img
          className={s.image}
          src={photo}
          alt={`Фото ${index + 1}`}
          loading="lazy"
        />
        {showHeart && (
          <svg className={s.heartPop} viewBox="0 0 24 24" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
          </svg>
        )}
      </div>

      <div className={s.actions}>
        <div className={s.leftActions}>
          <button type="button" className={s.actionBtn} aria-label="Like" onClick={() => { setLiked((v) => !v); onConfetti?.(); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? '#ed4956' : 'none'} stroke={liked ? '#ed4956' : 'currentColor'} strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
            </svg>
          </button>
          <button type="button" className={s.actionBtn} aria-label="Comment" onClick={() => window.open('https://t.me/omnistud1o', '_blank')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
            </svg>
          </button>
          <button type="button" className={s.actionBtn} aria-label="Repost" onClick={() => sharePost()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
