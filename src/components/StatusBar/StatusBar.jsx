import { useState, useEffect } from 'react';
import s from './StatusBar.module.scss';

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={s.bar}>
      <div className={s.left}>
        <div className={s.signal}>
          <span className={s.bar1} />
          <span className={s.bar2} />
          <span className={s.bar3} />
          <span className={s.bar4} />
          <span className={s.bar5} />
        </div>
        <span className={s.network}>3G</span>
      </div>
      <span className={s.time}>{time}</span>
      <div className={s.battery}>
        <span className={s.batteryOuter}>
          <span className={s.batteryInner} />
        </span>
      </div>
    </div>
  );
}
