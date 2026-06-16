import GuestPost from '../GuestPost/GuestPost';
import s from './PhotoFeed.module.scss';

export default function PhotoFeed({ photos, onConfetti }) {
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
