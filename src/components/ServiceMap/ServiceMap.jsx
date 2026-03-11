import s from './ServiceMap.module.scss';

const IFRAME_SRC =
  'https://yandex.ru/map-widget/v1/?display-text=omni%20studio&filter=alternate_vertical%3ARequestWindow&indoorLevel=1&ll=37.587627%2C55.808300&mode=search&oid=191600803627&ol=biz&sctx=ZAAAAAgBEAAaKAoSCYVDb%2FHwuEJAET%2BrzJTW8UtAEhIJGFxzR%2F%2FLxT8RP5EnSddMsj8iBgABAgMEBSgKOABAhlRIAWoCcnWdAc3MzD2gAQCoAQC9AUFMwWbCAQar%2FrDiyQWCAgtvbW5pIHN0dWRpb4oCAJICAJoCDGRlc2t0b3AtbWFwcw%3D%3D&sll=37.587627%2C55.808300&sspn=0.011486%2C0.004832&text=omni%20studio&z=16.89';

export default function ServiceMap() {
  return (
    <div className={s.wrapper}>
      <a
        href="https://yandex.ru/maps/org/omni_studio/191600803627/?utm_medium=mapframe&utm_source=maps"
        className={s.link}
        style={{ top: 0 }}
      >
        Omni Studio
      </a>
      <a
        href="https://yandex.ru/maps/213/moscow/category/recording_studio/184105594/?utm_medium=mapframe&utm_source=maps"
        className={s.link}
        style={{ top: 14 }}
      >
        Студия звукозаписи в Москве
      </a>
      <iframe
        src={IFRAME_SRC}
        className={s.iframe}
        title="Omni Studio на карте"
        frameBorder={1}
        allowFullScreen
      />
    </div>
  );
}
