import { useState } from 'react';
import { useFAQ } from '../../hooks/useFAQ';
import s from './FAQPage.module.scss';

export default function FAQPage() {
  const { faq, loading } = useFAQ();
  const [open, setOpen] = useState(null);

  if (loading) return <div className={s.page} />;

  return (
    <div className={s.page}>
      <ul className={s.list}>
        {faq.map((item, i) => (
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
