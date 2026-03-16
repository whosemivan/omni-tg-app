import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import services from '../../data/services.json';
import s from './ServiceDetail.module.scss';

export default function ServiceDetail({ onBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
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
          <button className={s.actionBtn} aria-label="Comment">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={s.content}>
        <h2 className={s.name}>{service.name}</h2>
        <p className={s.description}>{service.description}</p>
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
