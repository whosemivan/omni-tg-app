import { useState } from 'react';
import { ENGINEERS, ENGINEERS_ARTICLE } from '../../data/engineers';
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

function parseHour(slot) {
  return parseInt(slot, 10);
}

export default function BookingModal({ service, onClose }) {
  const [engineerId, setEngineerId] = useState('');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!service) return null;

  const NO_ENGINEER_SERVICES = ['Дистрибьюция', 'АРЕНДА СТУДИИ'];
  const needsEngineer = !NO_ENGINEER_SERVICES.includes(service.name);

  const engineer = ENGINEERS.find((e) => e.id === engineerId);
  const fromIndex = TIME_SLOTS.indexOf(timeFrom);
  const endSlots = fromIndex >= 0 ? TIME_SLOTS.slice(fromIndex + 1) : [];
  const canSubmit = date && timeFrom && timeTo && (engineerId || !needsEngineer) && !loading;

  const hours = timeFrom && timeTo ? parseHour(timeTo) - parseHour(timeFrom) : 0;
  const totalPrice = engineer?.rate ? hours * engineer.rate : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    const payload = {
      service: service.name,
      engineer: engineer?.name,
      date,
      time: `${timeFrom} – ${timeTo}`,
      hours,
      price: totalPrice,
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
      console.error('Booking error:', err);
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
          {needsEngineer && (
            <div className={s.fieldWithLink}>
              <label className={s.label}>
                <span>Звукорежиссёр</span>
                <select
                  className={s.input}
                  value={engineerId}
                  onChange={(e) => setEngineerId(e.target.value)}
                  required
                >
                  <option value="" disabled>Выберите</option>
                  {ENGINEERS.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name}{eng.rate ? ` — ${eng.rate.toLocaleString('ru-RU')}₽/ч` : ' (дист.)'}
                    </option>
                  ))}
                </select>
              </label>
              <a
                href={ENGINEERS_ARTICLE}
                target="_blank"
                rel="noopener noreferrer"
                className={s.articleLink}
              >
                Наши звукорежиссёры
              </a>
            </div>
          )}

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

          <div className={s.timeRow}>
            <label className={s.label}>
              <span>С</span>
              <select
                className={s.input}
                value={timeFrom}
                onChange={(e) => {
                  setTimeFrom(e.target.value);
                  setTimeTo('');
                }}
                required
              >
                <option value="" disabled>Начало</option>
                {TIME_SLOTS.slice(0, -1).map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>

            <label className={s.label}>
              <span>До</span>
              <select
                className={s.input}
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                required
                disabled={!timeFrom}
              >
                <option value="" disabled>Конец</option>
                {endSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>
          </div>

          {hours > 0 && engineer && (
            <div className={s.priceCalc}>
              <div className={s.priceRow}>
                <span>{engineer.name}</span>
                <span>{hours} ч</span>
              </div>
              {totalPrice != null ? (
                <div className={s.priceTotal}>
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              ) : (
                <div className={s.priceNote}>Цена по запросу</div>
              )}
            </div>
          )}

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
