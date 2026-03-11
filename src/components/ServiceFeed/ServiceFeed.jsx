import ServicePost from '../ServicePost/ServicePost';
import s from './ServiceFeed.module.scss';

export default function ServiceFeed({ services, onBook }) {
  return (
    <div className={s.feed}>
      {services.map((service) => (
        <ServicePost key={service.id} service={service} onBook={onBook} />
      ))}
    </div>
  );
}
