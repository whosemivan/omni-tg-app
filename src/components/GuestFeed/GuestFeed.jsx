import GuestPost from '../GuestPost/GuestPost';
import s from './GuestFeed.module.scss';

export default function GuestFeed({ photos, onConfetti }) {
  return (
    <div className={s.feed}>
      {photos.map((photo, index) => (
        <GuestPost
          key={`${photo}-${index}`}
          photo={photo}
          index={index}
          onConfetti={onConfetti}
        />
      ))}
    </div>
  );
}
