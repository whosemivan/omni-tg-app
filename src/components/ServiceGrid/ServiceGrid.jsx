import { Link } from 'react-router-dom';
import s from './ServiceGrid.module.scss';

export default function ServiceGrid({ services }) {
  return (
    <div className={s.grid}>
      {services.map((service) => (
        <Link
          key={service.id}
          to={`/service/${service.id}`}
          className={s.cell}
        >
          <img
            className={s.image}
            src={service.image}
            alt={service.name}
            loading="lazy"
          />
        </Link>
      ))}
    </div>
  );
}
