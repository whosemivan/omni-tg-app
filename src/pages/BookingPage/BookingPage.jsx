import { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { useEngineers } from '../../hooks/useEngineers';
import styles from './BookingPage.module.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const tg = window.Telegram?.WebApp;
const isTelegram = Boolean(tg?.initData);

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export default function BookingPage({ onBack }) {
  const { services, loading: svcLoading } = useServices();
  const { engineers, loading: engLoading } = useEngineers();

  const [serviceName, setServiceName] = useState('');
  const [engineerId, setEngineerId] = useState('');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [allNight, setAllNight] = useState(false);
  const [tgUsername, setTgUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const engineer = engineers.find((e) => e.id === engineerId);
  const fromIndex = TIME_SLOTS.indexOf(timeFrom);
  const endSlots = fromIndex >= 0
    ? [...TIME_SLOTS.slice(fromIndex + 1), ...TIME_SLOTS.slice(0, fromIndex)]
    : TIME_SLOTS;

  const fromHour = parseInt(timeFrom, 10);
  const toHour = parseInt(timeTo, 10);
  const hours = !allNight && timeFrom && timeTo
    ? (toHour > fromHour ? toHour - fromHour : 24 - fromHour + toHour)
    : 0;
  const totalPrice = engineer?.rate && hours > 0 ? hours * engineer.rate : null;
  const timeReady = allNight || (timeFrom && timeTo);
  const canSubmit = serviceName && date && timeReady && !loading && (isTelegram || tgUsername.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    const tgUser = tg?.initDataUnsafe?.user;
    const payload = {
      service: serviceName,
      engineer: engineer?.name,
      date,
      time: allNight ? 'Всю ночь' : `${timeFrom} – ${timeTo}`,
      hours: hours || undefined,
      price: totalPrice,
      user: tgUser
        ? { id: tgUser.id, first_name: tgUser.first_name, username: tgUser.username }
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
      setResult(data.success ? 'success' : 'error');
    } catch {
      setResult('error');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className={styles.page}>
        <img src="/images/bc.jpg" alt="" className={styles.bg} />
        <div className={styles.result}>
          <p className={styles.resultTitle}>
            {result === 'success' ? 'Заявка отправлена!' : 'Ошибка отправки'}
          </p>
          <p className={styles.resultMsg}>
            {result === 'success'
              ? 'Мы свяжемся с вами в Telegram для подтверждения'
              : 'Не удалось отправить. Попробуйте позже.'}
          </p>
          <button
            className={styles.closeBtn}
            onClick={result === 'success' ? onBack : () => setResult(null)}
          >
            {result === 'success' ? 'Закрыть' : 'Попробовать снова'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <img src="/images/bc.jpg" alt="" className={styles.bg} />
      <button className={styles.backBtn} onClick={onBack} aria-label="Назад">←</button>

      {/* Scrollable area: sticker + fields */}
      <div className={styles.scrollArea}>
        <div className={styles.sticker}>
          <img src="/images/sticker.webp" alt="" className={styles.stickerImg} />
        </div>

        <form id="booking-form" className={styles.form} onSubmit={handleSubmit}>
          {!isTelegram && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>TELEGRAM</span>
              <input
                className={styles.fieldInput}
                type="text"
                value={tgUsername}
                onChange={(e) => setTgUsername(e.target.value)}
                placeholder="@username"
              />
            </div>
          )}

          <div className={styles.field}>
            <span className={styles.fieldLabel}>УСЛУГА</span>
            <select
              className={styles.fieldSelect}
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            >
              <option value="" disabled>{svcLoading ? 'Загрузка...' : 'Выберите'}</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>ЗВУКОРЕЖИССЕР</span>
            <select
              className={styles.fieldSelect}
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
            >
              <option value="">{engLoading ? 'Загрузка...' : 'Любой'}</option>
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name}{eng.rate ? ` — ${eng.rate.toLocaleString('ru-RU')}₽/ч` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>ДАТА</span>
            <input
              className={styles.fieldInput}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayString()}
            />
          </div>

          <div className={`${styles.field} ${styles.fieldTime}`}>
            <div className={styles.fieldTimeTop}>
              <span className={styles.fieldLabel}>ВРЕМЯ</span>
              <label className={styles.allNight}>
                <input
                  type="checkbox"
                  checked={allNight}
                  onChange={(e) => {
                    setAllNight(e.target.checked);
                    if (e.target.checked) { setTimeFrom(''); setTimeTo(''); }
                  }}
                />
                Всю ночь
              </label>
            </div>
            {!allNight && (
              <div className={styles.timeSlots}>
                <select
                  className={styles.fieldSelect}
                  value={timeFrom}
                  onChange={(e) => { setTimeFrom(e.target.value); setTimeTo(''); }}
                >
                  <option value="" disabled>С</option>
                  {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  className={styles.fieldSelect}
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  disabled={!timeFrom}
                >
                  <option value="" disabled>До</option>
                  {endSlots.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          {hours > 0 && engineer?.rate && (
            <div className={styles.priceRow}>
              <span>{engineer.name} · {hours} ч</span>
              <span>{(hours * engineer.rate).toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
        </form>
      </div>

      {/* БРОНЬ — fixed at bottom, linked to form via id */}
      <button
        type="submit"
        form="booking-form"
        className={styles.submitBtn}
        disabled={!canSubmit}
      >
        <img src="/images/БРОНЬ.svg" alt={loading ? 'Отправка...' : 'Бронь'} />
      </button>
    </div>
  );
}
