import styles from '../../styles/About/VideoGamesCard.module.css';

export function VideoGamesCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Video Games</h3>

      <div className={styles.interestsList}>
        <div className={styles.interestRow}>
          <span className={styles.interestTitle}>Competitive</span>
          <span className={styles.interestDetail}>CS2, LoL</span>
        </div>
        <div className={styles.interestRow}>
          <span className={styles.interestTitle}>Gacha / RPG</span>
          <span className={styles.interestDetail}>Hoyoverse, WuWa</span>
        </div>
      </div>
    </div>
  );
}