import { useState } from 'react';
import s from './EngineerPost.module.scss';

export default function EngineerPost({ engineer, index }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className={s.post} style={{ animationDelay: `${index * 0.08}s` }}>
      <div className={s.postHeader}>
        <div className={s.avatar}>
          {engineer.avatar
            ? <img src={engineer.avatar} alt={engineer.name} />
            : <div className={s.avatarPlaceholder} />}
        </div>
        <div className={s.headerInfo}>
          <span className={s.username}>{engineer.name}</span>
          {(engineer.rate || engineer.remote) && (
            <span className={s.rate}>
              {engineer.rate ? `${engineer.rate.toLocaleString('ru-RU')} ₽/ч` : 'дистанционно'}
            </span>
          )}
        </div>
      </div>

      {engineer.avatar && (
        <div className={s.imageWrap}>
          <img
            className={s.image}
            src={engineer.avatar}
            alt={engineer.name}
            loading="lazy"
          />
        </div>
      )}

      <div className={s.actions}>
        <div className={s.leftActions}>
          <button type="button" className={s.actionBtn} aria-label="Like" onClick={() => setLiked(v => !v)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? '#ed4956' : 'none'} stroke={liked ? '#ed4956' : 'currentColor'} strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
            </svg>
          </button>
          <button type="button" className={s.actionBtn} aria-label="Comment">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={s.caption}>
        {engineer.description && (
          <p className={s.description}>
            <span className={s.captionName}>{engineer.name} </span>
            {engineer.description}
          </p>
        )}
        {engineer.services?.length > 0 && (
          <ul className={s.services}>
            {engineer.services.map((svc, i) => (
              <li key={i} className={s.serviceItem}>{svc}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
