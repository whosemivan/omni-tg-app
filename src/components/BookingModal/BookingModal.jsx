import { useState, useEffect } from 'react';
import { ENGINEERS_ARTICLE } from '../../data/engineers';
import { useEngineers } from '../../hooks/useEngineers';
import s from './BookingModal.module.scss';

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const API_URL = import.meta.env.VITE_API_URL || 'https://omni-backend-8sfl.onrender.com';

const tg = window.Telegram?.WebApp;
const isTelegram = Boolean(tg?.initData);

function toLocalDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTodayString() {
  return toLocalDateString(new Date());
}

function getMaxDateString() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return toLocalDateString(d);
}

function parseHour(slot) {
  return parseInt(slot, 10);
}

export default function BookingModal({ service, onClose }) {
  useEffect(() => {
    const handleVisibility = () => { if (document.hidden) onClose(); };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [onClose]);

  const { engineers, loading: engLoading } = useEngineers();
  const [engineerId, setEngineerId] = useState('');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [allNight, setAllNight] = useState(false);
  const [tgUsername, setTgUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!service) return null;

  const NO_ENGINEER_KEYWORDS = ['аренда', 'дистрибьюц'];
  const needsEngineer = !NO_ENGINEER_KEYWORDS.some((k) =>
    service.name.toLowerCase().includes(k)
  );

  const isDJ = service.name.toLowerCase().includes('диджеинг');
  const DJ_ENGINEERS = ['миша', 'omni', 'никита', 'seemquieter'];
  const availableEngineers = isDJ
    ? engineers.filter((e) => DJ_ENGINEERS.some((kw) => e.name.toLowerCase().includes(kw)))
    : engineers;
  const DJ_MIN_RATE = 5000;

  const engineer = engineers.find((e) => e.id === engineerId);
  const engineerName = engineerId === 'any' ? 'Любой звукорежиссер' : engineer?.name;
  const effectiveRate = engineer?.rate
    ? (isDJ ? Math.max(engineer.rate, DJ_MIN_RATE) : engineer.rate)
    : null;
  const isMaxTwoHours = ['дистан', 'бит', 'инструментал'].some((k) =>
    service.name.toLowerCase().includes(k)
  );

  const isToday = date === getTodayString();
  const currentHour = new Date().getHours();
  const startSlots = isToday
    ? TIME_SLOTS.filter((slot) => parseInt(slot, 10) > currentHour)
    : TIME_SLOTS;

  const fromIndex = TIME_SLOTS.indexOf(timeFrom);
  const allEndSlots = fromIndex >= 0
    ? [...TIME_SLOTS.slice(fromIndex + 1), ...TIME_SLOTS.slice(0, fromIndex)]
    : TIME_SLOTS;
  const endSlots = isMaxTwoHours ? allEndSlots.slice(0, 2) : allEndSlots;
  const timeReady = allNight || (timeFrom && timeTo);
  const dateValid = date >= getTodayString() && date <= getMaxDateString();
  const canSubmit =
    date && dateValid && timeReady && (engineerId || !needsEngineer) && !loading &&
    (isTelegram || tgUsername.trim());

  const fromHour = parseHour(timeFrom);
  const toHour = parseHour(timeTo);
  const hours = !allNight && timeFrom && timeTo
    ? (toHour > fromHour ? toHour - fromHour : 24 - fromHour + toHour)
    : 0;
  const FIXED_PRICE = 7500;
  const totalPrice = isMaxTwoHours
    ? FIXED_PRICE
    : (effectiveRate && hours > 0 ? hours * effectiveRate : null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const tgUser = tg?.initDataUnsafe?.user;

    const payload = {
      service: service.name,
      engineer: engineerName,
      date,
      time: allNight ? 'Всю ночь' : `${timeFrom} – ${timeTo}`,
      hours,
      price: totalPrice,
      user: tgUser
        ? {
            id: tgUser.id,
            first_name: tgUser.first_name,
            username: tgUser.username,
          }
        : { id: 0, first_name: 'Гость', username: tgUsername.replace(/^@/, '') },
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
        setResult('success');
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setResult('error');
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

        {result ? (
          <div className={s.result}>
            <div className={s[result === 'success' ? 'resultIconSuccess' : 'resultIconError']}>
              {result === 'success' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}
            </div>
            <p className={s.resultTitle}>
              {result === 'success' ? 'Заявка отправлена!' : 'Запись не удалась'}
            </p>
            <p className={s.resultMessage}>
              {result === 'success'
                ? 'Наши модераторы свяжутся с вами в телеграме для дальнейшей записи'
                : 'Не удалось отправить заявку. Попробуйте позже.'}
            </p>
            <button
              className={s.submitBtn}
              onClick={result === 'success' ? onClose : () => setResult(null)}
            >
              {result === 'success' ? 'Отлично' : 'Попробовать снова'}
            </button>
          </div>
        ) : (
        <form className={s.form} onSubmit={handleSubmit}>
          {!isTelegram && (
            <label className={s.label}>
              <span>Ваш Telegram</span>
              <input
                type="text"
                className={s.input}
                value={tgUsername}
                onChange={(e) => setTgUsername(e.target.value)}
                placeholder="@username"
                required
              />
            </label>
          )}

          {needsEngineer && (
            <div className={s.fieldWithLink}>
              <label className={s.label}>
                <span>Звукорежиссёр</span>
                <select
                  className={s.input}
                  value={engineerId}
                  onChange={(e) => setEngineerId(e.target.value)}
                  required
                  disabled={engLoading}
                >
                  <option value="" disabled>{engLoading ? 'Загрузка...' : 'Выберите'}</option>
                  <option value="any">Любой звукорежиссер</option>
                  {availableEngineers.map((eng) => {
                    const rate = isDJ && eng.rate ? Math.max(eng.rate, DJ_MIN_RATE) : eng.rate;
                    return (
                      <option key={eng.id} value={eng.id}>
                        {eng.name}{rate ? ` — ${rate.toLocaleString('ru-RU')}₽/ч` : ' (дист.)'}
                      </option>
                    );
                  })}
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
              onChange={(e) => {
                const newDate = e.target.value;
                if (newDate < getTodayString() || newDate > getMaxDateString()) return;
                setDate(newDate);
                if (newDate === getTodayString() && timeFrom && parseInt(timeFrom, 10) <= new Date().getHours()) {
                  setTimeFrom('');
                  setTimeTo('');
                }
              }}
              min={getTodayString()}
              max={getMaxDateString()}
              required
            />
          </label>

          {!isMaxTwoHours && (
            <label className={s.allNightLabel}>
              <input
                type="checkbox"
                checked={allNight}
                onChange={(e) => {
                  setAllNight(e.target.checked);
                  if (e.target.checked) { setTimeFrom(''); setTimeTo(''); }
                }}
              />
              <span>Всю ночь</span>
            </label>
          )}

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
                required={!allNight}
                disabled={allNight}
              >
                <option value="" disabled>Начало</option>
                {startSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>

            <label className={s.label}>
              <span>До</span>
              <select
                key={timeFrom || '__empty__'}
                className={s.input}
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                required={!allNight}
                disabled={allNight || !timeFrom}
              >
                <option value="" disabled>Конец</option>
                {endSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </label>
          </div>

          {isMaxTwoHours ? (
            <div className={s.priceCalc}>
              <div className={s.priceTotal}>
                <span>Итого</span>
                <span>от {FIXED_PRICE.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          ) : hours > 0 && engineer && (
            <div className={s.priceCalc}>
              <div className={s.priceRow}>
                <span>{engineer.name}</span>
                <span>{hours} ч × {(effectiveRate || 0).toLocaleString('ru-RU')} ₽/ч</span>
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
        )}
      </div>
    </div>
  );
}
