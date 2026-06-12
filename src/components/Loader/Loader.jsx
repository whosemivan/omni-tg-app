import s from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={s.wrap}>
      <div className={s.spinner} />
    </div>
  );
}
