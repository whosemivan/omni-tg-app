import { useState } from 'react';
import s from './BookingModal.module.scss';

const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 10;
  return `${hour}:00`;
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default function BookingModal({ service, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  if (!service) return null;

  const canSubmit = date && time && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    const payload = {
      service: service.name,
      date,
      time,
      user: tgUser
        ? {
            id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username,
          }
        : { id: 0, first_name: 'Гость', username: 'unknown' },
    };

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        if (tg?.showPopup) {
          tg.showPopup({
            title: 'Успешно',
            message: 'Заявка отправлена! Мы свяжемся с вами.',
            buttons: [{ type: 'ok' }],
          });
        } else {
          alert('Заявка отправлена! Мы свяжемся с вами.');
        }
        onClose();
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (err) {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: 'Ошибка',
          message: 'Не удалось отправить заявку. Попробуйте позже.',
          buttons: [{ type: 'ok' }],
        });
      } else {
        alert('Не удалось отправить заявку. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>Выберите дату и время</h3>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className={s.serviceName}>{service.name}</p>

        <form className={s.form} onSubmit={handleSubmit}>
          <label className={s.label}>
            <span>Дата</span>
            <input
              type="date"
              className={s.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayString()}
              required
            />
          </label>

          <label className={s.label}>
            <span>Время</span>
            <select
              className={s.input}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="" disabled>
                Выберите время
              </option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className={s.submitBtn}
            disabled={!canSubmit}
          >
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
}
