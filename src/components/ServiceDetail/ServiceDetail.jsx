import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useServices } from '../../hooks/useServices';
import Loader from '../Loader/Loader';
import s from './ServiceDetail.module.scss';

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
function renderDescription(text) {
  return text.split('\n').map((line, i) => {
    const parts = [];
    let last = 0;
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      parts.push(<a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return <span key={i}>{i > 0 && <br />}{parts}</span>;
  });
}

export default function ServiceDetail({ onBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const { services, loading } = useServices();

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
  const service = services.find((srv) => srv.id === Number(id));

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      const handler = () => navigate(-1);
      tg.BackButton.onClick(handler);
      return () => {
        tg.BackButton.offClick(handler);
        tg.BackButton.hide();
      };
    }
  }, [navigate]);

  if (loading) return <Loader />;

  if (!service) {
    return (
      <div className={s.notFound}>
        <p>Услуга не найдена</p>
        <button className={s.backBtn} onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className={s.detail}>
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dde9f0" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className={s.headerTitle}>{service.name}</span>
        <div className={s.spacer} />
      </div>

      <div className={s.imageWrap}>
        <img className={s.image} src={service.image} alt={service.name} />
      </div>

      <div className={s.actions}>
        <div className={s.leftActions}>
          <button className={s.actionBtn} aria-label="Like" onClick={() => setLiked((v) => !v)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? '#ed4956' : 'none'} stroke={liked ? '#ed4956' : 'currentColor'} strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
            </svg>
          </button>
          <button className={s.actionBtn} aria-label="Comment" onClick={() => window.open('https://t.me/omnistud1o', '_blank')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
            </svg>
          </button>
          <button className={s.actionBtn} aria-label="Repost" onClick={() => sharePost()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={s.content}>
        <h2 className={s.name}>{service.name}</h2>
        <p className={s.description}>{renderDescription(service.description)}</p>
        <p className={s.details}>{service.details}</p>
        {service.price && <p className={s.price}>{service.price}</p>}
      </div>

      <div className={s.bookWrap}>
        <button className={s.bookBtn} onClick={() => onBook(service)}>
          Забронировать
        </button>
      </div>
    </div>
  );
}
