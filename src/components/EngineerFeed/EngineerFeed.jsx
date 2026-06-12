import { useEngineers } from '../../hooks/useEngineers';
import EngineerPost from '../EngineerPost/EngineerPost';
import Loader from '../Loader/Loader';
import s from './EngineerFeed.module.scss';

export default function EngineerFeed() {
  const { engineers, loading } = useEngineers();

  if (loading) return <Loader />;

  return (
    <div className={s.feed}>
      {engineers.map((eng, i) => (
        <EngineerPost key={eng.id} engineer={eng} index={i} />
      ))}
    </div>
  );
}
