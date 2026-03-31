import s from './BookingModal.module.scss';

export default function BookingModal({ service, onClose }) {
  if (!service) return null;


  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
      <div className={s.modalHeader}>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <iframe
        className={s.iframe}
          frameBorder='0'
          allowTransparency='true'
          id='ms_booking_iframe'
          src='https://n2079261.yclients.com/company/1820445/personal/menu?o='
          title='Booking'
        />
      </div>
    </div>
  );
}
