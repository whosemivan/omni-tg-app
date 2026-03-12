import styles from './Onboarding.module.scss';

export default function Onboarding() {
  return (
    <div className={styles.onboardingRoot}>
      <img
        src="/images/logo.png"
        alt="Omni Studio logo"
        className={styles.logo}
      />
    </div>
  );
}

