import s from './SettingsPage.module.scss';

const LINKS = [
  {
    label: 'Telegram-канал',
    sub: '@omnistudioo',
    href: 'https://t.me/omnistudioo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.46.7-.92.44l-2.56-1.88-1.24 1.2c-.14.14-.26.26-.52.26l.18-2.6 4.72-4.26c.2-.18-.04-.28-.32-.1L7.6 14.42 5.08 13.6c-.56-.18-.58-.56.12-.82l10.32-3.98c.46-.18.86.1.72.8-.04-.02-.04-.02 0 0z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Основатель студии',
    sub: '@mishaomni',
    href: 'https://t.me/mishaomni',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.46.7-.92.44l-2.56-1.88-1.24 1.2c-.14.14-.26.26-.52.26l.18-2.6 4.72-4.26c.2-.18-.04-.28-.32-.1L7.6 14.42 5.08 13.6c-.56-.18-.58-.56.12-.82l10.32-3.98c.46-.18.86.1.72.8-.04-.02-.04-.02 0 0z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    sub: '@omnistud1o',
    href: 'https://www.instagram.com/omnistud1o?igsh=MWh5dGk4OWw3djl2aA==',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Наши работы',
    sub: 'vk.com/omnistudio',
    href: 'https://vk.com/wall-216619380_192',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Правила аренды',
    sub: 'vk.com/omnistudio',
    href: 'https://m.vk.com/@omnistudio-pravila-posescheniya-omni-studio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Наше оборудование',
    sub: 'telegra.ph',
    href: 'https://telegra.ph/Omni-oborudovanie-11-07',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19 10a7 7 0 0 1-14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M12 17v4M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Школа диджеинга',
    sub: '@dekkidjschool',
    href: 'https://t.me/dekkidjschool',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.56-.46.7-.92.44l-2.56-1.88-1.24 1.2c-.14.14-.26.26-.52.26l.18-2.6 4.72-4.26c.2-.18-.04-.28-.32-.1L7.6 14.42 5.08 13.6c-.56-.18-.58-.56.12-.82l10.32-3.98c.46-.18.86.1.72.8-.04-.02-.04-.02 0 0z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    sub: '@omnistud1o',
    href: 'https://www.tiktok.com/@omnistud1o?_t=ZS-8sscnENkHLj&_r=1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'ВКонтакте',
    sub: 'vk.com/omnistudio',
    href: 'https://vk.com/omnistudio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13.16 17s.28-.03.42-.18c.13-.14.13-.4.13-.4s-.02-1.22.55-1.4c.56-.18 1.28 1.18 2.04 1.7.58.4 1.01.31 1.01.31l2.04-.03s1.06-.07.56-1c-.04-.07-.29-.67-1.52-1.9-1.28-1.28-1.11-1.07.44-3.28.95-1.34 1.33-2.16 1.21-2.51-.11-.33-.85-.24-.85-.24l-2.3.01s-.17-.02-.3.06c-.12.08-.2.26-.2.26s-.37 1.02-.85 1.89c-1.03 1.84-1.44 1.94-1.61 1.82-.39-.27-.29-1.08-.29-1.66 0-1.81.27-2.56-.53-2.75-.27-.07-.46-.11-1.14-.12-.87-.01-1.61.01-2.03.22-.28.14-.49.45-.36.47.16.02.53.1.73.38.25.36.24 1.16.24 1.16s.14 2.13-.33 2.39c-.33.18-.77-.18-1.73-1.84-.49-.85-.86-1.79-.86-1.79s-.07-.18-.19-.27c-.15-.11-.35-.14-.35-.14l-2.19.01s-.33.01-.45.16c-.11.13-.01.4-.01.4s1.72 4.23 3.66 6.36C9.96 16.93 12.03 17 12.03 17h1.13z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Связаться с нами',
    sub: '@omnistud1o',
    href: 'https://t.me/omnistud1o',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function SettingsPage() {
  return (
    <div className={s.page}>
      <ul className={s.list}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={s.row}
            >
              <span className={s.iconWrap}>{link.icon}</span>
              <span className={s.text}>
                <span className={s.label}>{link.label}</span>
                <span className={s.sub}>{link.sub}</span>
              </span>
              <svg className={s.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          </li>
        ))}
      </ul>

      <div className={s.address}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span>Москва, М. Дмитровская</span>
        <span className={s.addressStreet}>Новодмитровская 5А с3</span>
      </div>
    </div>
  );
}
