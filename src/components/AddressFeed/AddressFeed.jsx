import ServiceMap from '../ServiceMap/ServiceMap';
import s from './AddressFeed.module.scss';

export default function AddressFeed() {
  return (
    <div className={s.feed}>
      <div className={s.card}>
        <div className={s.iconRow}>
          <img src="/images/pin-icon.svg" alt="" className={s.pin} />
          <div className={s.addressText}>
            <span className={s.city}>Москва, М. Дмитровская</span>
            <span className={s.street}>Новодмитровская 5Ас3</span>
          </div>
        </div>
      </div>

      <div className={s.mapCard}>
        <ServiceMap />
      </div>
    </div>
  );
}
