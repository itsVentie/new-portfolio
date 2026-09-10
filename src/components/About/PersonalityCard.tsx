import styles from '../../styles/About/PersonalityCard.module.css';

export function PersonalityCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Personality Profiles</h3>

      <div className={styles.profileGrid}>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>MBTI</span>
          <span className={styles.profileValue}>INFJ-T</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>Enneagram</span>
          <span className={styles.profileValue}>4w5</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>Socionics</span>
          <span className={styles.profileValue}>EII</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileLabel}>Attitudinal</span>
          <span className={styles.profileValue}>ELVF</span>
        </div>
      </div>
    </div>
  );
}