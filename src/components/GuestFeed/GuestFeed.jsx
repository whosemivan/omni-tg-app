import { useGuests } from '../../hooks/useGuests';
import EngineerPost from '../EngineerPost/EngineerPost';
import Loader from '../Loader/Loader';
import s from './GuestFeed.module.scss';

export default function GuestFeed() {
  const { guests, loading } = useGuests();

  if (loading) return <Loader />;

  return (
    <div className={s.feed}>
      {guests.map((guest, i) => (
        <EngineerPost key={guest.id} engineer={guest} index={i} />
      ))}
    </div>
  );
}
