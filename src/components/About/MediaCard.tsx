import styles from '../../styles/About/MediaCard.module.css';

export function MediaCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Media & Leisure</h3>

      <div className={styles.interestsList}>
        <div className={styles.interestRow}>
          <span className={styles.interestTitle}>Anime</span>
          <span className={styles.interestDetail}>Series & Movies</span>
        </div>
        <div className={styles.interestRow}>
          <span className={styles.interestTitle}>Manga</span>
          <span className={styles.interestDetail}>Light Novels & Webtoons</span>
        </div>
      </div>
    </div>
  );
}