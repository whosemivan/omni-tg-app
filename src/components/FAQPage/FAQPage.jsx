import { useState } from 'react';
import s from './FAQPage.module.scss';

const FAQ = [
  {
    q: 'Боюсь идти на запись, я новичок — что делать?',
    a: 'Не бойся! Наши звукорежиссёры — профессионалы, настроят на дружелюбный вайб, помогут с текстом, мотивом и битом.',
  },
  {
    q: 'Как до нас добраться?',
    a: 'Метро Дмитровская, пройти через Хлебзавод — Новодмитровская 5А с3.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className={s.page}>
      <ul className={s.list}>
        {FAQ.map((item, i) => (
          <li key={i} className={s.item}>
            <button
              className={s.question}
              onClick={() => setOpen(open === i ? null : i)}
              type="button"
            >
              <span>{item.q}</span>
              <svg
                className={`${s.chevron} ${open === i ? s.chevronOpen : ''}`}
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {open === i && (
              <p className={s.answer}>{item.a}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
